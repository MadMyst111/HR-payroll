-- Add work_hours column to attendance table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attendance' AND column_name = 'work_hours') THEN
    ALTER TABLE attendance ADD COLUMN work_hours NUMERIC(5,2);
  END IF;
END $$;

-- Update realtime publication for attendance
alter publication supabase_realtime add table attendance;
