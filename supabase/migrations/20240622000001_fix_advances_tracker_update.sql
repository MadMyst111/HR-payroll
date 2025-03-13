-- Ensure the advances table is properly included in the realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS advances;
ALTER PUBLICATION supabase_realtime ADD TABLE advances;

-- Add a trigger to force a notification on update
CREATE OR REPLACE FUNCTION public.notify_advances_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS advances_update_notify ON advances;
CREATE TRIGGER advances_update_notify
BEFORE UPDATE ON advances
FOR EACH ROW
EXECUTE FUNCTION public.notify_advances_update();
