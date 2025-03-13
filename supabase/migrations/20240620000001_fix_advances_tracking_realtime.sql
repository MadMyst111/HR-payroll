-- Fix realtime tracking for advances table
-- This ensures that all columns in the advances table are properly tracked by the realtime system

-- First, remove the table from the publication if it exists
ALTER PUBLICATION supabase_realtime DROP TABLE advances;

-- Then add it back to ensure all columns are included
ALTER PUBLICATION supabase_realtime ADD TABLE advances;

-- Ensure the remaining_amount column is properly indexed for better performance
DROP INDEX IF EXISTS idx_advances_remaining_amount;
CREATE INDEX idx_advances_remaining_amount ON advances(remaining_amount);

-- Ensure the is_deducted column is properly indexed for better performance
DROP INDEX IF EXISTS idx_advances_is_deducted;
CREATE INDEX idx_advances_is_deducted ON advances(is_deducted);
