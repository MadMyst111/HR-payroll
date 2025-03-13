-- Fix for advances deduction tracking

-- Make sure the remaining_amount column is properly defined
ALTER TABLE advances ALTER COLUMN remaining_amount TYPE NUMERIC;

-- Make sure the is_deducted column is properly defined
ALTER TABLE advances ALTER COLUMN is_deducted SET DEFAULT false;

-- Make sure the deduction_date column is properly defined
ALTER TABLE advances ALTER COLUMN deduction_date TYPE DATE;

-- Make sure the payroll_id column is properly defined
ALTER TABLE advances ALTER COLUMN payroll_id TYPE TEXT;

-- Ensure the advances table is included in the realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
