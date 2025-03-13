-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on attendance table
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create policy for attendance table
DROP POLICY IF EXISTS "Authenticated users can CRUD attendance" ON attendance;
CREATE POLICY "Authenticated users can CRUD attendance"
  ON attendance
  USING (auth.role() = 'authenticated');

-- Enable RLS on leave_requests table
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for leave_requests table
DROP POLICY IF EXISTS "Authenticated users can CRUD leave_requests" ON leave_requests;
CREATE POLICY "Authenticated users can CRUD leave_requests"
  ON leave_requests
  USING (auth.role() = 'authenticated');

-- Enable realtime for attendance table
ALTER PUBLICATION supabase_realtime ADD TABLE attendance;

-- Enable realtime for leave_requests table
ALTER PUBLICATION supabase_realtime ADD TABLE leave_requests;
