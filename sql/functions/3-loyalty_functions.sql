-- Loyalty Functions
-- Functions for loyalty point management and calculations

-- Add loyalty points
CREATE OR REPLACE FUNCTION add_loyalty_points(
  p_customer_id UUID,
  p_property_id INTEGER,
  p_points INTEGER,
  p_service_type VARCHAR(50),
  p_description TEXT DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_booking_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  loyalty_record RECORD;
BEGIN
  -- Get or create loyalty record
  SELECT * INTO loyalty_record
  FROM CrossBusinessLoyalty
  WHERE customer_id = p_customer_id AND property_id = p_property_id;
  
  IF NOT FOUND THEN
    INSERT INTO CrossBusinessLoyalty (customer_id, property_id, total_points)
    VALUES (p_customer_id, p_property_id, p_points);
  ELSE
    UPDATE CrossBusinessLoyalty
    SET total_points = total_points + p_points,
        last_activity_date = NOW()
    WHERE customer_id = p_customer_id AND property_id = p_property_id;
  END IF;
  
  -- Update service-specific points
  UPDATE CrossBusinessLoyalty
  SET 
    points_earned_restaurant = CASE WHEN p_service_type = 'restaurant' THEN points_earned_restaurant + p_points ELSE points_earned_restaurant END,
    points_earned_hotel = CASE WHEN p_service_type = 'hotel' THEN points_earned_hotel + p_points ELSE points_earned_hotel END,
    points_earned_spa = CASE WHEN p_service_type = 'spa' THEN points_earned_spa + p_points ELSE points_earned_spa END,
    points_earned_conference = CASE WHEN p_service_type = 'conference' THEN points_earned_conference + p_points ELSE points_earned_conference END,
    points_earned_transportation = CASE WHEN p_service_type = 'transportation' THEN points_earned_transportation + p_points ELSE points_earned_transportation END,
    points_earned_recreation = CASE WHEN p_service_type = 'recreation' THEN points_earned_recreation + p_points ELSE points_earned_recreation END,
    points_earned_specialized = CASE WHEN p_service_type = 'specialized' THEN points_earned_specialized + p_points ELSE points_earned_specialized END
  WHERE customer_id = p_customer_id AND property_id = p_property_id;
  
  -- Record transaction
  INSERT INTO LoyaltyTransaction (
    customer_id, property_id, transaction_type, points_amount, 
    service_type, order_id, booking_id, description
  ) VALUES (
    p_customer_id, p_property_id, 'earned', p_points, 
    p_service_type, p_order_id, p_booking_id, p_description
  );
  
  RETURN TRUE;
END;
$$;

-- Redeem loyalty points
CREATE OR REPLACE FUNCTION redeem_loyalty_points(
  p_customer_id UUID,
  p_property_id INTEGER,
  p_points INTEGER,
  p_description TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  current_points INTEGER;
BEGIN
  -- Check if customer has enough points
  SELECT total_points INTO current_points
  FROM CrossBusinessLoyalty
  WHERE customer_id = p_customer_id AND property_id = p_property_id;
  
  IF current_points IS NULL OR current_points < p_points THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct points
  UPDATE CrossBusinessLoyalty
  SET 
    total_points = total_points - p_points,
    points_redeemed = points_redeemed + p_points,
    last_activity_date = NOW()
  WHERE customer_id = p_customer_id AND property_id = p_property_id;
  
  -- Record transaction
  INSERT INTO LoyaltyTransaction (
    customer_id, property_id, transaction_type, points_amount, description
  ) VALUES (
    p_customer_id, p_property_id, 'redeemed', p_points, p_description
  );
  
  RETURN TRUE;
END;
$$;
