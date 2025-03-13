-- Fix the remaining_amount column in advances table
-- This migration ensures that remaining_amount is properly set for all advances

-- Update any NULL remaining_amount values to be equal to the amount
UPDATE advances
SET remaining_amount = amount
WHERE remaining_amount IS NULL;

-- Make sure the remaining_amount column is properly added to the realtime publication
ALTER PUBLICATION supabase_realtime ADD COLUMN advances.remaining_amount;
