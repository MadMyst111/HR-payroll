-- Enable RLS for advances table
ALTER TABLE advances ENABLE ROW LEVEL SECURITY;

-- Add advances tracking fields to employees table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'total_advances') THEN
        ALTER TABLE employees ADD COLUMN total_advances DECIMAL(10, 2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'remaining_advances') THEN
        ALTER TABLE employees ADD COLUMN remaining_advances DECIMAL(10, 2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employees' AND column_name = 'max_advance_limit') THEN
        ALTER TABLE employees ADD COLUMN max_advance_limit DECIMAL(10, 2) DEFAULT 0;
    END IF;
END $$;

-- Create or replace function to update employee advances
CREATE OR REPLACE FUNCTION update_employee_advances()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate max advance limit as 3x base salary (can be customized later)
    UPDATE employees
    SET max_advance_limit = base_salary * 3
    WHERE id = NEW.employee_id AND (max_advance_limit IS NULL OR max_advance_limit = 0);
    
    -- For new advances
    IF TG_OP = 'INSERT' THEN
        -- If approved, add to remaining advances
        IF NEW.status = 'approved' THEN
            UPDATE employees
            SET total_advances = COALESCE(total_advances, 0) + NEW.amount,
                remaining_advances = COALESCE(remaining_advances, 0) + NEW.amount
            WHERE id = NEW.employee_id;
        END IF;
    -- For updated advances
    ELSIF TG_OP = 'UPDATE' THEN
        -- If status changed to approved
        IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
            UPDATE employees
            SET total_advances = COALESCE(total_advances, 0) + NEW.amount,
                remaining_advances = COALESCE(remaining_advances, 0) + NEW.amount
            WHERE id = NEW.employee_id;
        -- If status changed to paid
        ELSIF NEW.status = 'paid' AND OLD.status != 'paid' THEN
            UPDATE employees
            SET remaining_advances = COALESCE(remaining_advances, 0) - NEW.amount
            WHERE id = NEW.employee_id;
        -- If status changed from approved to something else (not paid)
        ELSIF OLD.status = 'approved' AND NEW.status != 'approved' AND NEW.status != 'paid' THEN
            UPDATE employees
            SET total_advances = COALESCE(total_advances, 0) - NEW.amount,
                remaining_advances = COALESCE(remaining_advances, 0) - NEW.amount
            WHERE id = NEW.employee_id;
        END IF;
    -- For deleted advances
    ELSIF TG_OP = 'DELETE' THEN
        -- If advance was approved but not paid
        IF OLD.status = 'approved' THEN
            UPDATE employees
            SET total_advances = COALESCE(total_advances, 0) - OLD.amount,
                remaining_advances = COALESCE(remaining_advances, 0) - OLD.amount
            WHERE id = OLD.employee_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS advances_after_insert_update ON advances;
DROP TRIGGER IF EXISTS advances_after_delete ON advances;

-- Create triggers for advances table
CREATE TRIGGER advances_after_insert_update
    AFTER INSERT OR UPDATE ON advances
    FOR EACH ROW
    EXECUTE FUNCTION update_employee_advances();

CREATE TRIGGER advances_after_delete
    AFTER DELETE ON advances
    FOR EACH ROW
    EXECUTE FUNCTION update_employee_advances();

-- Add advances to realtime publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE employees, advances, payroll, attendance, incentives, leave_requests, settings;
