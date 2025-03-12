-- Reset sequences safely
DO $$ 
BEGIN
    -- Only reset sequences if they exist
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = 'employees_id_seq') THEN
        ALTER SEQUENCE public.employees_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = 'advances_id_seq') THEN
        ALTER SEQUENCE public.advances_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = 'payroll_id_seq') THEN
        ALTER SEQUENCE public.payroll_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = 'attendance_id_seq') THEN
        ALTER SEQUENCE public.attendance_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = 'incentives_id_seq') THEN
        ALTER SEQUENCE public.incentives_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = 'leave_requests_id_seq') THEN
        ALTER SEQUENCE public.leave_requests_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = 'settings_id_seq') THEN
        ALTER SEQUENCE public.settings_id_seq RESTART WITH 1;
    END IF;
END $$;
