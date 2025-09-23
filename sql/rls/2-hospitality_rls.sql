-- Hospitality Row Level Security Policies
-- Security policies for hospitality service tables

-- Enable RLS on hospitality tables
ALTER TABLE Menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE MenuCategory ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE OrderItem ENABLE ROW LEVEL SECURITY;
ALTER TABLE RoomReservation ENABLE ROW LEVEL SECURITY;
ALTER TABLE ServiceBooking ENABLE ROW LEVEL SECURITY;

-- Menu System Policies
CREATE POLICY "Allow public to view active menu items"
  ON Menu
  FOR SELECT
  TO public
  USING (is_available = true);

CREATE POLICY "Allow property staff to manage menu"
  ON Menu
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow public to view menu categories"
  ON MenuCategory
  FOR SELECT
  TO public
  USING (true);

-- Order Policies
CREATE POLICY "Allow customers to view their own orders"
  ON "Order"
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to manage orders"
  ON "Order"
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow customers to create orders"
  ON "Order"
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id IN (
    SELECT customer_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Room Reservation Policies
CREATE POLICY "Allow customers to view their own reservations"
  ON RoomReservation
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to manage reservations"
  ON RoomReservation
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Service Booking Policies
CREATE POLICY "Allow customers to view their own bookings"
  ON ServiceBooking
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to manage bookings"
  ON ServiceBooking
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));
