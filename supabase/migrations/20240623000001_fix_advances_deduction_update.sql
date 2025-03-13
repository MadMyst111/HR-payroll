-- Ensure advances table is properly included in the realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE employees, payroll, advances, attendance, incentives, leave_requests, settings;

-- Add a trigger to force a notification on update by updating the timestamp
CREATE OR REPLACE FUNCTION public.handle_advances_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Force an update to the updated_at field to trigger realtime notifications
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS advances_update_trigger ON public.advances;

-- Create the trigger
CREATE TRIGGER advances_update_trigger
BEFORE UPDATE ON public.advances
FOR EACH ROW
EXECUTE FUNCTION public.handle_advances_update();
