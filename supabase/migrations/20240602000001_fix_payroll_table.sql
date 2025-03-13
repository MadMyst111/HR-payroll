-- Enable RLS for payroll table
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

-- Create policy for payroll table
DROP POLICY IF EXISTS "Public access" ON payroll;
CREATE POLICY "Public access"
ON payroll FOR ALL
USING (true);

-- Add realtime subscription for payroll table
ALTER PUBLICATION supabase_realtime ADD TABLE payroll;

-- Reset payroll table sequence
SELECT setval('payroll_id_seq', COALESCE((SELECT MAX(id::uuid) FROM payroll), '00000000-0000-0000-0000-000000000000'));
