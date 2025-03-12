-- This migration ensures all tables are properly added to the realtime publication

-- Add tables to the supabase_realtime publication if they're not already there
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Enable realtime for employees table
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'employees'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.employees;
  END IF;
  
  -- Enable realtime for payroll table
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'payroll'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payroll;
  END IF;
  
  -- Enable realtime for advances table
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'advances'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.advances;
  END IF;
  
  -- Enable realtime for attendance table
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'attendance'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
  END IF;
  
  -- Enable realtime for incentives table
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'incentives'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.incentives;
  END IF;
  
  -- Enable realtime for leave_requests table
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'leave_requests'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leave_requests;
  END IF;
  
  -- Enable realtime for settings table
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'settings'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
  END IF;
  
END
$$;