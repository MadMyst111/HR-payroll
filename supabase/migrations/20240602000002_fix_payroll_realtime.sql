-- This migration fixes the issue with payroll table in realtime publication
-- First check if the table is already in the publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'payroll'
  ) THEN
    -- Only add if it's not already there
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payroll;
  END IF;
END
$$;