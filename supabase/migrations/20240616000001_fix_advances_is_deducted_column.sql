-- Add is_deducted column to advances table if it doesn't exist
ALTER TABLE IF EXISTS advances ADD COLUMN IF NOT EXISTS is_deducted BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS advances ADD COLUMN IF NOT EXISTS deduction_date DATE;
ALTER TABLE IF EXISTS advances ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC DEFAULT NULL;
ALTER TABLE IF EXISTS advances ADD COLUMN IF NOT EXISTS payroll_id TEXT DEFAULT NULL;

-- No need to add to realtime publication since it's already FOR ALL TABLES