-- Fix the advances table to ensure proper column types and constraints
ALTER TABLE advances ALTER COLUMN amount TYPE numeric USING amount::numeric;
ALTER TABLE advances ALTER COLUMN request_date TYPE date USING request_date::date;
ALTER TABLE advances ALTER COLUMN expected_payment_date TYPE date USING expected_payment_date::date;
ALTER TABLE advances ALTER COLUMN payment_date TYPE date USING payment_date::date;

-- Ensure status has a default value
ALTER TABLE advances ALTER COLUMN status SET DEFAULT 'pending';

-- Make sure the table is included in realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
