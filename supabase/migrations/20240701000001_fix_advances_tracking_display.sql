-- Add a timestamp column to advances table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'advances' AND column_name = 'created_at') THEN
        ALTER TABLE advances ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
    END IF;

    -- Ensure all existing advances have a created_at timestamp
    UPDATE advances SET created_at = now() WHERE created_at IS NULL;

    -- Ensure remaining_amount is set for all advances that don't have it
    UPDATE advances SET remaining_amount = amount WHERE remaining_amount IS NULL;

    -- Ensure is_deducted is set to false for all advances that don't have it
    UPDATE advances SET is_deducted = false WHERE is_deducted IS NULL;

    -- Add an index on employee_id for faster queries
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'advances_employee_id_idx') THEN
        CREATE INDEX advances_employee_id_idx ON advances(employee_id);
    END IF;

    -- Add an index on created_at for faster queries
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'advances_created_at_idx') THEN
        CREATE INDEX advances_created_at_idx ON advances(created_at);
    END IF;
END $$;