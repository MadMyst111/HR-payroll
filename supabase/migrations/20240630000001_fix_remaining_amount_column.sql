-- Add remaining_amount column to advances table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advances' AND column_name = 'remaining_amount') THEN
        ALTER TABLE advances ADD COLUMN remaining_amount NUMERIC;
    END IF;

    -- Add is_deducted column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advances' AND column_name = 'is_deducted') THEN
        ALTER TABLE advances ADD COLUMN is_deducted BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add payroll_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advances' AND column_name = 'payroll_id') THEN
        ALTER TABLE advances ADD COLUMN payroll_id TEXT;
    END IF;

    -- Ensure advances table is in the realtime publication
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'advances') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE advances;
    END IF;
END
$$;