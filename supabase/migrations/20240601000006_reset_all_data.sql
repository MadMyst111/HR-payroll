-- Clear all existing data from tables
TRUNCATE TABLE employees CASCADE;
TRUNCATE TABLE advances CASCADE;
TRUNCATE TABLE payroll CASCADE;
TRUNCATE TABLE attendance CASCADE;
TRUNCATE TABLE incentives CASCADE;
TRUNCATE TABLE leave_requests CASCADE;
TRUNCATE TABLE settings CASCADE;

-- Reset sequences if they exist
DO $$ 
BEGIN
    -- Only reset sequences if they exist
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'employees_id_seq') THEN
        ALTER SEQUENCE employees_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'advances_id_seq') THEN
        ALTER SEQUENCE advances_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'payroll_id_seq') THEN
        ALTER SEQUENCE payroll_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'attendance_id_seq') THEN
        ALTER SEQUENCE attendance_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'incentives_id_seq') THEN
        ALTER SEQUENCE incentives_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'leave_requests_id_seq') THEN
        ALTER SEQUENCE leave_requests_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'settings_id_seq') THEN
        ALTER SEQUENCE settings_id_seq RESTART WITH 1;
    END IF;
END $$;
