-- Add work_hours column to attendance table if it doesn't exist already
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attendance' AND column_name = 'work_hours') THEN
    ALTER TABLE attendance ADD COLUMN work_hours NUMERIC;
  END IF;
END $$;

-- Make sure the attendance table is included in the realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
