-- Fix the realtime publication for the remaining_amount column

-- First, ensure the advances table is in the publication
ALTER PUBLICATION supabase_realtime ADD TABLE advances;

-- No need to add individual columns to the publication, as adding the table includes all columns
