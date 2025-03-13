-- Ensure the advances table is properly included in the realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.advances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.advances;

-- Create or replace the trigger function to notify on advances updates
CREATE OR REPLACE FUNCTION public.notify_advances_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('supabase_realtime', json_build_object(
    'table', 'advances',
    'type', TG_OP,
    'id', NEW.id,
    'record', row_to_json(NEW)
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS advances_notify_changes ON public.advances;
CREATE TRIGGER advances_notify_changes
AFTER INSERT OR UPDATE ON public.advances
FOR EACH ROW EXECUTE FUNCTION public.notify_advances_changes();
