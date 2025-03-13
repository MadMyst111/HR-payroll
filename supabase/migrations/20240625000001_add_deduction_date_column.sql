-- Add deduction_date column to advances table
ALTER TABLE advances ADD COLUMN IF NOT EXISTS deduction_date DATE;

-- Make sure the column is included in the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE advances;
