-- Fix the realtime publication issue
-- Instead of trying to add tables to the existing supabase_realtime publication,
-- we'll create a separate publication for our specific tables

-- First, check if our custom publication exists and create it if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'hr_realtime') THEN
        CREATE PUBLICATION hr_realtime;
    END IF;
END
$$;

-- Add our tables to the custom publication
ALTER PUBLICATION hr_realtime ADD TABLE attendance;
ALTER PUBLICATION hr_realtime ADD TABLE leave_requests;

-- Enable row-level security on the tables
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for attendance table
DROP POLICY IF EXISTS "Users can view their own attendance records" ON attendance;
CREATE POLICY "Users can view their own attendance records"
    ON attendance FOR SELECT
    USING (auth.uid() = employee_id OR auth.uid() IN (
        SELECT user_id FROM employees WHERE user_id IS NOT NULL
    ));

DROP POLICY IF EXISTS "HR admins can manage all attendance records" ON attendance;
CREATE POLICY "HR admins can manage all attendance records"
    ON attendance FOR ALL
    USING (auth.uid() IN (
        SELECT user_id FROM employees WHERE position = 'HR Manager' AND user_id IS NOT NULL
    ));

-- Create policies for leave_requests table
DROP POLICY IF EXISTS "Users can view their own leave requests" ON leave_requests;
CREATE POLICY "Users can view their own leave requests"
    ON leave_requests FOR SELECT
    USING (auth.uid() = employee_id OR auth.uid() IN (
        SELECT user_id FROM employees WHERE user_id IS NOT NULL
    ));

DROP POLICY IF EXISTS "HR admins can manage all leave requests" ON leave_requests;
CREATE POLICY "HR admins can manage all leave requests"
    ON leave_requests FOR ALL
    USING (auth.uid() IN (
        SELECT user_id FROM employees WHERE position = 'HR Manager' AND user_id IS NOT NULL
    ));
