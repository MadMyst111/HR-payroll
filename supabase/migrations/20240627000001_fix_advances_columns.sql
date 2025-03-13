-- Add is_deducted column to advances table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advances' AND column_name = 'is_deducted') THEN
        ALTER TABLE advances ADD COLUMN is_deducted BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advances' AND column_name = 'remaining_amount') THEN
        ALTER TABLE advances ADD COLUMN remaining_amount NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advances' AND column_name = 'payroll_id') THEN
        ALTER TABLE advances ADD COLUMN payroll_id TEXT;
    END IF;
END $$;

-- Make sure the advances table is in the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE advances;