-- Fix for advances table already in supabase_realtime publication

-- First drop the table from the publication if it exists
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Recreate the publication
CREATE PUBLICATION supabase_realtime FOR TABLE employees, payroll, incentives, attendance, leave_requests, settings;

-- Add advances table to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE advances;
