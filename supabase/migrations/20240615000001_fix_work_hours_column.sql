-- Fix work_hours column in attendance table
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS work_hours NUMERIC;

-- Ensure the attendance table is included in the realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
