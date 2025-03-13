-- Fix for advances tracking system

-- Ensure the advances table has the necessary columns for tracking
ALTER TABLE IF EXISTS public.advances
    ADD COLUMN IF NOT EXISTS is_deducted BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS deduction_date DATE,
    ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS payroll_id TEXT;

-- Ensure the employees table has the necessary columns for advance tracking
ALTER TABLE IF EXISTS public.employees
    ADD COLUMN IF NOT EXISTS total_advances NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS remaining_advances NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS max_advance_limit NUMERIC DEFAULT NULL;

-- Update remaining_amount for existing advances if not set
UPDATE public.advances
SET remaining_amount = amount
WHERE remaining_amount IS NULL;

-- Enable realtime for these tables if not already enabled
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.advances, public.employees;
