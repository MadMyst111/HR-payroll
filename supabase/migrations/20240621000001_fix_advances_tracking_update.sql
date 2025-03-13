-- Fix advances tracking update issues

-- First, ensure the advances table is properly included in the realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE advances;
ALTER PUBLICATION supabase_realtime ADD TABLE advances;

-- Add a trigger to ensure remaining_amount is properly updated
CREATE OR REPLACE FUNCTION public.handle_advance_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure remaining_amount is properly set when is_deducted is true
  IF NEW.is_deducted = true AND NEW.remaining_amount IS NULL THEN
    NEW.remaining_amount := 0;
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS before_advance_update ON public.advances;

-- Create the trigger
CREATE TRIGGER before_advance_update
  BEFORE UPDATE ON public.advances
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_advance_update();
