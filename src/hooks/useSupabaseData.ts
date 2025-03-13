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

        console.log(`Fetched ${tableName} data:`, result);
        if (result) {
          setData(result as TableRow[]);
        } else {
          console.warn(`No data returned for ${tableName}`);
          setData([]);
        }
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

          // Force a refresh of data after any change to ensure we have the latest data
          if (tableName === "advances" || tableName === "payroll") {
            console.log(`Forcing refresh of ${tableName} data`);
            // Use multiple refreshes with increasing delays to ensure we get the latest data
            setTimeout(() => {
              console.log(`First refresh attempt for ${tableName}`);
              fetchData();

              // Second refresh after a longer delay
              setTimeout(() => {
                console.log(`Second refresh attempt for ${tableName}`);
                fetchData();

                // Third refresh after an even longer delay
                setTimeout(() => {
                  console.log(`Third refresh attempt for ${tableName}`);
                  fetchData();

                  // Fourth refresh after an even longer delay
                  setTimeout(() => {
                    console.log(`Fourth refresh attempt for ${tableName}`);
                    fetchData();

                    // Fifth refresh after an even longer delay
                    setTimeout(() => {
                      console.log(`Fifth refresh attempt for ${tableName}`);
                      fetchData();

                      // If this is advances data, consider reloading the page
                      if (tableName === "advances") {
                        console.log(
                          "Advances data updated, considering page reload",
                        );
                        // Uncomment to enable automatic page reload
                        // window.location.reload();
                      }
                    }, 2500);
                  }, 2000);
                }, 1500);
              }, 1000);
            }, 500);
            return;
          }

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
            setData((prevData) => {
              // Check if the item exists and if the update actually changes anything
              const existingItem = prevData.find(
                (item) => item.id === payload.new.id,
              );
              if (!existingItem) {
                // Item doesn't exist, add it
                return [...prevData, payload.new as TableRow];
              }

              // Special handling for advances with remaining_amount
              if (
                tableName === "advances" &&
                "remaining_amount" in payload.new
              ) {
                console.log(
                  `Updating advance ${payload.new.id} with remaining_amount:`,
                  payload.new.remaining_amount,
                );
              }

              // Update the item
              return prevData.map((item) =>
                item.id === payload.new.id ? (payload.new as TableRow) : item,
              );
            });
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
      // Clean up the row data to ensure no undefined values and handle null values properly
      const cleanRow = Object.entries(row).reduce(
        (acc, [key, value]) => {
          // Only include properties that have values (not undefined)
          // Explicitly keep null values as they're different from undefined
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      console.log(`Inserting into ${tableName} with data:`, cleanRow);

      const { data, error } = await supabase
        .from(tableName)
        .insert(cleanRow)
        .select();

      if (error) {
        console.error(`Error details for ${tableName}:`, error);
        console.error(`Error code: ${error.code}, Message: ${error.message}`);
        console.error(`Error details:`, error.details);
        throw error;
      }

      if (!data || data.length === 0) {
        console.error(`No data returned after insert into ${tableName}`);
        throw new Error(`Failed to insert data into ${tableName}`);
      }

      console.log(`Successfully inserted into ${tableName}:`, data[0]);
      return data[0];
    } catch (err) {
      console.error(`Error inserting into ${tableName}:`, err);
      throw err;
    }
  };

  const updateRow = async (id: string, updates: Partial<TableRow>) => {
    try {
      console.log(`Updating ${tableName} with ID ${id}:`, updates);

      const { data, error } = await supabase
        .from(tableName)
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq("id", id)
        .select();

      if (error) {
        console.error(`Error updating ${tableName}:`, error);
        throw error;
      }

      console.log(
        `Successfully updated ${tableName} with ID ${id}:`,
        data?.[0],
      );
      return data?.[0];
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
