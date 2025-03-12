import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

type TableName =
  | "employees"
  | "payroll"
  | "advances"
  | "attendance"
  | "incentives"
  | "leave_requests"
  | "settings";

export function useSupabaseData<T extends TableName>(
  tableName: T,
  options?: {
    select?: string;
    filter?: { column: string; value: any }[];
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  },
) {
  type TableRow = Tables<T>;

  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let query = supabase.from(tableName).select(options?.select || "*");

        // Apply filters if provided
        if (options?.filter && options.filter.length > 0) {
          options.filter.forEach((filter) => {
            query = query.eq(filter.column, filter.value);
          });
        }

        // Apply ordering if provided
        if (options?.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true,
          });
        }

        // Apply limit if provided
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error } = await query;

        if (error) throw error;

        setData(result as TableRow[]);
      } catch (err) {
        console.error("Error fetching data from Supabase:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up realtime subscription with a more unique channel name
    const channelName = `${tableName}-changes-${Math.random().toString(36).substring(2, 10)}`;
    const subscription = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => {
          console.log(
            `Realtime event for ${tableName}:`,
            payload.eventType,
            payload,
          );

          // Handle different types of changes
          if (payload.eventType === "INSERT") {
            setData((prevData) => {
              // Check if the item already exists to avoid duplicates
              const exists = prevData.some(
                (item) => item.id === payload.new.id,
              );
              if (exists) return prevData;
              return [...prevData, payload.new as TableRow];
            });
          } else if (payload.eventType === "UPDATE") {
            setData((prevData) =>
              prevData.map((item) =>
                item.id === payload.new.id ? (payload.new as TableRow) : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setData((prevData) =>
              prevData.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tableName, JSON.stringify(options)]);

  const insertRow = async (
    row: Omit<TableRow, "id" | "created_at" | "updated_at">,
  ) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(row as any)
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error(`Error inserting into ${tableName}:`, err);
      throw err;
    }
  };

  const updateRow = async (id: string, updates: Partial<TableRow>) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error(`Error updating ${tableName}:`, err);
      throw err;
    }
  };

  const deleteRow = async (id: string) => {
    try {
      const { error } = await supabase.from(tableName).delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      throw err;
    }
  };

  return { data, loading, error, insertRow, updateRow, deleteRow };
}
