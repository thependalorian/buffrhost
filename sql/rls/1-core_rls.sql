-- Core Row Level Security Policies
-- Security policies for core system tables

-- Enable RLS on core tables
ALTER TABLE HospitalityProperty ENABLE ROW LEVEL SECURITY;
ALTER TABLE BuffrHostUser ENABLE ROW LEVEL SECURITY;
ALTER TABLE Customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE CorporateCustomer ENABLE ROW LEVEL SECURITY;
ALTER TABLE KYCKYBDocument ENABLE ROW LEVEL SECURITY;

-- Hospitality Property Policies
CREATE POLICY "Allow authenticated users to view properties"
  ON HospitalityProperty
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow property owners to manage their property"
  ON HospitalityProperty
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Buffr Host User Policies
CREATE POLICY "Allow users to view their own profile"
  ON BuffrHostUser
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Allow users to update their own profile"
  ON BuffrHostUser
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

-- Customer Policies
CREATE POLICY "Allow customers to view their own data"
  ON Customer
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to view customers"
  ON Customer
  FOR SELECT
  TO authenticated
  USING (true);

-- Corporate Customer Policies
CREATE POLICY "Allow corporate customers to view their own data"
  ON CorporateCustomer
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- KYC/KYB Document Policies
CREATE POLICY "Allow customers to view their own documents"
  ON KYCKYBDocument
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to manage documents"
  ON KYCKYBDocument
  FOR ALL
  TO authenticated
  USING (true);
