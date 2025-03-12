-- Insert default settings if none exist
INSERT INTO settings (company_name, currency, working_days_per_month, working_hours_per_day, enable_rtl, default_language, daily_rate_formula, daily_rate_with_incentive_formula, overtime_rate_formula, absence_deductions_formula, penalties_formula, net_salary_formula, total_salary_with_incentive_formula, max_advance_limit_formula)
SELECT 
    '', -- company_name
    'ج.م', -- currency
    26, -- working_days_per_month
    8, -- working_hours_per_day
    true, -- enable_rtl
    'ar', -- default_language
    'baseSalary / workingDaysPerMonth', -- daily_rate_formula
    '(baseSalary + monthlyIncentives) / workingDaysPerMonth', -- daily_rate_with_incentive_formula
    '(baseSalary / (workingDaysPerMonth * workingHoursPerDay)) * 1.5', -- overtime_rate_formula
    'absenceDays * dailyRate', -- absence_deductions_formula
    'penaltyDays * dailyRate', -- penalties_formula
    'baseSalary + bonus + overtimeAmount - (purchases + advances + absenceDeductions + penalties)', -- net_salary_formula
    'baseSalary + monthlyIncentives', -- total_salary_with_incentive_formula
    'baseSalary * 3' -- max_advance_limit_formula
WHERE NOT EXISTS (SELECT 1 FROM settings);
