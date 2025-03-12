import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";

type SettingsType = Tables<"settings">;

interface SupabaseContextType {
  settings: SettingsType | null;
  loading: boolean;
  error: Error | null;
  updateSettings: (updates: Partial<SettingsType>) => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined,
);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .limit(1)
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Set up realtime subscription for settings
    const subscription = supabase
      .channel("settings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        (payload) => {
          fetchSettings();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateSettings = async (updates: Partial<SettingsType>) => {
    try {
      if (!settings?.id) throw new Error("Settings not loaded");

      const { data, error } = await supabase
        .from("settings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", settings.id)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (err) {
      console.error("Error updating settings:", err);
      throw err;
    }
  };

  return (
    <SupabaseContext.Provider
      value={{ settings, loading, error, updateSettings }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
