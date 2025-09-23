-- Staff Row Level Security Policies
-- Security policies for staff management tables

-- Enable RLS on staff tables
ALTER TABLE StaffProfile ENABLE ROW LEVEL SECURITY;
ALTER TABLE StaffSchedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE StaffAttendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE StaffTask ENABLE ROW LEVEL SECURITY;
ALTER TABLE StaffPerformance ENABLE ROW LEVEL SECURITY;
ALTER TABLE StaffCommunication ENABLE ROW LEVEL SECURITY;

-- Staff Profile Policies
CREATE POLICY "Allow staff to view their own profile"
  ON StaffProfile
  FOR SELECT
  TO authenticated
  USING (staff_id = auth.uid());

CREATE POLICY "Allow property managers to view all staff"
  ON StaffProfile
  FOR SELECT
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid() AND role IN ('admin', 'manager')
  ));

CREATE POLICY "Allow property managers to manage staff"
  ON StaffProfile
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Staff Schedule Policies
CREATE POLICY "Allow staff to view their own schedule"
  ON StaffSchedule
  FOR SELECT
  TO authenticated
  USING (staff_id = auth.uid());

CREATE POLICY "Allow managers to manage schedules"
  ON StaffSchedule
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Staff Attendance Policies
CREATE POLICY "Allow staff to view their own attendance"
  ON StaffAttendance
  FOR SELECT
  TO authenticated
  USING (staff_id = auth.uid());

CREATE POLICY "Allow managers to manage attendance"
  ON StaffAttendance
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Staff Task Policies
CREATE POLICY "Allow staff to view their own tasks"
  ON StaffTask
  FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

CREATE POLICY "Allow managers to manage tasks"
  ON StaffTask
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Staff Performance Policies
CREATE POLICY "Allow staff to view their own performance"
  ON StaffPerformance
  FOR SELECT
  TO authenticated
  USING (staff_id = auth.uid());

CREATE POLICY "Allow managers to manage performance"
  ON StaffPerformance
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid() AND role IN ('admin', 'manager')
  ));

-- Staff Communication Policies
CREATE POLICY "Allow staff to view their own communications"
  ON StaffCommunication
  FOR SELECT
  TO authenticated
  USING (recipient_id = auth.uid() OR sender_id = auth.uid());

CREATE POLICY "Allow staff to send communications"
  ON StaffCommunication
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());
