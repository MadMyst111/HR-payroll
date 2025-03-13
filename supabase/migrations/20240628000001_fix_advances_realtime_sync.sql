-- The advances table is already part of the supabase_realtime publication
-- This migration ensures the advances table has proper realtime support
DO $$
BEGIN
    -- Check if advances table is already in the publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'advances'
    ) THEN
        -- Only add if not already present
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE advances';
    END IF;
END
$$;