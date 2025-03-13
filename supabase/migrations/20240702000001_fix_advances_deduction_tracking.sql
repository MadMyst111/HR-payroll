-- This migration fixes issues with advances deduction tracking

-- Make sure the is_deducted column has a default value of false
ALTER TABLE advances ALTER COLUMN is_deducted SET DEFAULT false;

-- Make sure the remaining_amount column exists and has the correct type
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advances' AND column_name = 'remaining_amount') THEN
    ALTER TABLE advances ADD COLUMN remaining_amount NUMERIC;
  END IF;
END $$;

-- Update any NULL is_deducted values to false
UPDATE advances SET is_deducted = false WHERE is_deducted IS NULL;

-- Set remaining_amount equal to amount for any records where it's NULL
UPDATE advances SET remaining_amount = amount WHERE remaining_amount IS NULL;

-- Ensure the realtime publication includes the advances table
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE employees, payroll, advances, attendance, incentives, leave_requests, settings;
