-- Order Management System
-- Restaurant orders, room service, and general ordering

-- Orders
CREATE TABLE "Order" (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number SERIAL UNIQUE,
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total DECIMAL(10,2) DEFAULT 0.00,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    service_type VARCHAR(50) DEFAULT 'restaurant',
    order_type VARCHAR(50) DEFAULT 'dine_in',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    special_instructions TEXT
);

-- Order Items
CREATE TABLE OrderItem (
    order_item_id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES "Order"(order_id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES Menu(menu_item_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_order NUMERIC(10,2) NOT NULL,
    special_instructions TEXT
);

-- Order Item Options
CREATE TABLE OrderItemOption (
    order_item_id INTEGER REFERENCES OrderItem(order_item_id) ON DELETE CASCADE,
    option_value_id INTEGER REFERENCES OptionValue(option_value_id) ON DELETE CASCADE,
    PRIMARY KEY (order_item_id, option_value_id)
);

-- Create updated_at triggers
CREATE TRIGGER update_order_updated_at 
    BEFORE UPDATE ON "Order" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
