-- Validation Constraints and Business Rules
-- Database-level validation for data integrity

-- Validation functions
CREATE OR REPLACE FUNCTION validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Function to validate phone numbers (international format)
CREATE OR REPLACE FUNCTION validate_phone(phone_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- International phone number format: + followed by country code and number
    RETURN phone_number ~ '^\+[1-9]\d{1,14}$';
END;
$$ LANGUAGE plpgsql;

-- Function to validate Namibian phone numbers
CREATE OR REPLACE FUNCTION validate_namibian_phone(phone_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Namibian phone numbers: +264 followed by 9 digits
    RETURN phone_number ~ '^\+264[0-9]{9}$';
END;
$$ LANGUAGE plpgsql;

-- Function to validate Namibian ID numbers
CREATE OR REPLACE FUNCTION validate_namibian_id(id_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Namibian ID numbers: 11 digits
    RETURN id_number ~ '^[0-9]{11}$';
END;
$$ LANGUAGE plpgsql;

-- Function to validate price amounts
CREATE OR REPLACE FUNCTION validate_price(amount DECIMAL)
RETURNS BOOLEAN AS $$
BEGIN
    -- Price must be positive and reasonable (less than 1 million)
    RETURN amount > 0 AND amount < 1000000;
END;
$$ LANGUAGE plpgsql;

-- Function to validate room capacity
CREATE OR REPLACE FUNCTION validate_room_capacity(capacity INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    -- Room capacity must be between 1 and 20
    RETURN capacity >= 1 AND capacity <= 20;
END;
$$ LANGUAGE plpgsql;

-- Function to validate date ranges
CREATE OR REPLACE FUNCTION validate_date_range(start_date DATE, end_date DATE)
RETURNS BOOLEAN AS $$
BEGIN
    -- End date must be after start date
    RETURN end_date > start_date;
END;
$$ LANGUAGE plpgsql;

-- Function to validate time ranges
CREATE OR REPLACE FUNCTION validate_time_range(start_time TIME, end_time TIME)
RETURNS BOOLEAN AS $$
BEGIN
    -- End time must be after start time
    RETURN end_time > start_time;
END;
$$ LANGUAGE plpgsql;

-- Function to validate loyalty points
CREATE OR REPLACE FUNCTION validate_loyalty_points(points INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    -- Loyalty points must be non-negative
    RETURN points >= 0;
END;
$$ LANGUAGE plpgsql;

-- Function to validate rating scores
CREATE OR REPLACE FUNCTION validate_rating(rating INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    -- Rating must be between 1 and 5
    RETURN rating >= 1 AND rating <= 5;
END;
$$ LANGUAGE plpgsql;

-- Function to validate status values
CREATE OR REPLACE FUNCTION validate_status(status TEXT, valid_statuses TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN status = ANY(valid_statuses);
END;
$$ LANGUAGE plpgsql;

-- Add validation constraints to existing tables

-- Customer table constraints
ALTER TABLE Customer 
ADD CONSTRAINT check_customer_email 
CHECK (email IS NULL OR validate_email(email));

ALTER TABLE Customer 
ADD CONSTRAINT check_customer_phone 
CHECK (phone IS NULL OR validate_phone(phone));

ALTER TABLE Customer 
ADD CONSTRAINT check_customer_loyalty_points 
CHECK (validate_loyalty_points(loyalty_points));

-- BuffrHostUser table constraints
ALTER TABLE BuffrHostUser 
ADD CONSTRAINT check_user_email 
CHECK (validate_email(email));

-- HospitalityProperty table constraints
ALTER TABLE HospitalityProperty 
ADD CONSTRAINT check_property_email 
CHECK (email IS NULL OR validate_email(email));

ALTER TABLE HospitalityProperty 
ADD CONSTRAINT check_property_phone 
CHECK (phone IS NULL OR validate_phone(phone));

ALTER TABLE HospitalityProperty 
ADD CONSTRAINT check_property_capacity 
CHECK (max_capacity IS NULL OR max_capacity > 0);

-- Menu table constraints
ALTER TABLE Menu 
ADD CONSTRAINT check_menu_price 
CHECK (validate_price(base_price));

-- RoomType table constraints
ALTER TABLE RoomType 
ADD CONSTRAINT check_room_type_price 
CHECK (validate_price(base_price_per_night));

ALTER TABLE RoomType 
ADD CONSTRAINT check_room_type_capacity 
CHECK (validate_room_capacity(max_occupancy));

-- RoomReservation table constraints
ALTER TABLE RoomReservation 
ADD CONSTRAINT check_reservation_dates 
CHECK (validate_date_range(check_in_date, check_out_date));

ALTER TABLE RoomReservation 
ADD CONSTRAINT check_reservation_guests 
CHECK (number_of_guests > 0 AND number_of_guests <= 20);

ALTER TABLE RoomReservation 
ADD CONSTRAINT check_reservation_amount 
CHECK (validate_price(total_amount));

-- StaffSchedule table constraints
ALTER TABLE StaffSchedule 
ADD CONSTRAINT check_schedule_times 
CHECK (validate_time_range(start_time, end_time));

-- StaffPerformance table constraints
ALTER TABLE StaffPerformance 
ADD CONSTRAINT check_performance_ratings 
CHECK (
    validate_rating(overall_rating) AND
    validate_rating(punctuality_rating) AND
    validate_rating(work_quality_rating) AND
    validate_rating(teamwork_rating) AND
    validate_rating(customer_service_rating)
);

-- Order table constraints
ALTER TABLE "Order" 
ADD CONSTRAINT check_order_amount 
CHECK (validate_price(total));

-- ServiceBooking table constraints
ALTER TABLE ServiceBooking 
ADD CONSTRAINT check_booking_dates 
CHECK (validate_date_range(booking_date, booking_date));

ALTER TABLE ServiceBooking 
ADD CONSTRAINT check_booking_times 
CHECK (validate_time_range(start_time, end_time));

ALTER TABLE ServiceBooking 
ADD CONSTRAINT check_booking_amount 
CHECK (validate_price(total_price));

-- CrossBusinessLoyalty table constraints
ALTER TABLE CrossBusinessLoyalty 
ADD CONSTRAINT check_loyalty_total_points 
CHECK (validate_loyalty_points(total_points));

ALTER TABLE CrossBusinessLoyalty 
ADD CONSTRAINT check_loyalty_earned_points 
CHECK (
    validate_loyalty_points(points_earned_restaurant) AND
    validate_loyalty_points(points_earned_hotel) AND
    validate_loyalty_points(points_earned_spa) AND
    validate_loyalty_points(points_earned_conference) AND
    validate_loyalty_points(points_earned_transportation) AND
    validate_loyalty_points(points_earned_recreation) AND
    validate_loyalty_points(points_earned_specialized) AND
    validate_loyalty_points(points_redeemed)
);

-- LoyaltyTransaction table constraints
ALTER TABLE LoyaltyTransaction 
ADD CONSTRAINT check_loyalty_transaction_points 
CHECK (validate_loyalty_points(points_amount));

-- CorporateBooking table constraints
ALTER TABLE CorporateBooking 
ADD CONSTRAINT check_corporate_booking_dates 
CHECK (validate_date_range(start_date, end_date));

ALTER TABLE CorporateBooking 
ADD CONSTRAINT check_corporate_booking_amount 
CHECK (validate_price(total_estimated_cost));

-- Quotation table constraints
ALTER TABLE Quotation 
ADD CONSTRAINT check_quotation_amounts 
CHECK (
    validate_price(subtotal) AND
    validate_price(tax_amount) AND
    validate_price(discount_amount) AND
    validate_price(total_amount)
);

-- Invoice table constraints
ALTER TABLE Invoice 
ADD CONSTRAINT check_invoice_amounts 
CHECK (
    validate_price(subtotal) AND
    validate_price(tax_amount) AND
    validate_price(discount_amount) AND
    validate_price(total_amount) AND
    validate_price(paid_amount) AND
    validate_price(balance_amount)
);

-- PaymentTransaction table constraints
ALTER TABLE PaymentTransaction 
ADD CONSTRAINT check_payment_amount 
CHECK (validate_price(amount));

-- AIAgentSession table constraints
ALTER TABLE AIAgentSession 
ADD CONSTRAINT check_ai_session_rating 
CHECK (satisfaction_rating IS NULL OR validate_rating(satisfaction_rating));

-- Create function to validate business rules
CREATE OR REPLACE FUNCTION validate_business_rules()
RETURNS TRIGGER AS $$
BEGIN
    -- Add any additional business rule validations here
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
