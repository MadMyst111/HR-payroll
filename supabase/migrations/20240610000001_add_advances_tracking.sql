-- Add columns to track advance deductions
ALTER TABLE advances
ADD COLUMN IF NOT EXISTS is_deducted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deduction_date DATE,
ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS payroll_id TEXT;

-- Set remaining_amount to amount for existing advances
UPDATE advances
SET remaining_amount = amount
WHERE remaining_amount IS NULL;

-- Add realtime publication for the new columns
ALTER PUBLICATION supabase_realtime ADD TABLE advances;
