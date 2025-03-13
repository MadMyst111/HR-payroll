-- Add deduction_date column to advances table if it doesn't exist
ALTER TABLE advances ADD COLUMN IF NOT EXISTS deduction_date DATE;
