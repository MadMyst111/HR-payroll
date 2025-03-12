CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  join_date DATE NOT NULL,
  base_salary NUMERIC NOT NULL,
  daily_rate NUMERIC,
  daily_rate_with_incentive NUMERIC,
  overtime_rate NUMERIC,
  monthly_incentives NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payroll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  base_salary NUMERIC NOT NULL,
  monthly_incentives NUMERIC DEFAULT 0,
  bonus NUMERIC DEFAULT 0,
  overtime_hours NUMERIC DEFAULT 0,
  overtime_amount NUMERIC DEFAULT 0,
  purchases NUMERIC DEFAULT 0,
  advances NUMERIC DEFAULT 0,
  absence_days INTEGER DEFAULT 0,
  absence_deductions NUMERIC DEFAULT 0,
  penalty_days INTEGER DEFAULT 0,
  penalties NUMERIC DEFAULT 0,
  net_salary NUMERIC NOT NULL,
  total_salary_with_incentive NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  amount NUMERIC NOT NULL,
  request_date DATE NOT NULL,
  expected_payment_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  approved_by TEXT,
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  date DATE NOT NULL,
  status TEXT NOT NULL,
  check_in TIME,
  check_out TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incentives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  reason TEXT,
  date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  sold_items INTEGER,
  distribution_date TEXT,
  yearly_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  leave_type TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  approved_by TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT DEFAULT 'شركة الموارد البشرية',
  company_logo TEXT,
  currency TEXT DEFAULT 'جنيه مصري',
  working_days_per_month INTEGER DEFAULT 22,
  working_hours_per_day INTEGER DEFAULT 8,
  default_language TEXT DEFAULT 'ar',
  enable_rtl BOOLEAN DEFAULT TRUE,
  daily_rate_formula TEXT DEFAULT 'baseSalary / workingDaysPerMonth',
  daily_rate_with_incentive_formula TEXT DEFAULT '(baseSalary + monthlyIncentives) / workingDaysPerMonth',
  overtime_rate_formula TEXT DEFAULT '(baseSalary / (workingDaysPerMonth * workingHoursPerDay)) * 1.5',
  absence_deductions_formula TEXT DEFAULT 'absenceDays * dailyRate',
  penalties_formula TEXT DEFAULT 'penaltyDays * dailyRate',
  net_salary_formula TEXT DEFAULT 'baseSalary + bonus + overtimeAmount - (purchases + advances + absenceDeductions + penalties)',
  total_salary_with_incentive_formula TEXT DEFAULT 'baseSalary + monthlyIncentives',
  max_advance_limit_formula TEXT DEFAULT 'baseSalary * 3',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE incentives ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for development purposes)
CREATE POLICY "Public access to employees" ON employees FOR ALL USING (true);
CREATE POLICY "Public access to payroll" ON payroll FOR ALL USING (true);
CREATE POLICY "Public access to advances" ON advances FOR ALL USING (true);
CREATE POLICY "Public access to attendance" ON attendance FOR ALL USING (true);
CREATE POLICY "Public access to incentives" ON incentives FOR ALL USING (true);
CREATE POLICY "Public access to leave_requests" ON leave_requests FOR ALL USING (true);
CREATE POLICY "Public access to settings" ON settings FOR ALL USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE employees;
ALTER PUBLICATION supabase_realtime ADD TABLE payroll;
ALTER PUBLICATION supabase_realtime ADD TABLE advances;
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE incentives;
ALTER PUBLICATION supabase_realtime ADD TABLE leave_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE settings;

-- Insert default settings
INSERT INTO settings (company_name, currency) VALUES ('شركة الموارد البشرية', 'جنيه مصري');
