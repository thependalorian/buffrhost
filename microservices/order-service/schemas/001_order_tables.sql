-- Order Service Database Schema
-- Handles order processing, fulfillment, and management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Order status enum
CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'preparing',
    'ready',
    'delivered',
    'picked_up',
    'completed',
    'cancelled',
    'refunded'
);

-- Order type enum
CREATE TYPE order_type AS ENUM (
    'dine_in',
    'takeaway',
    'delivery',
    'pickup'
);

-- Payment status enum
CREATE TYPE payment_status AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded'
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL, -- Reference to auth service users
    property_id UUID NOT NULL, -- Reference to property service
    order_type order_type NOT NULL,
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    items JSONB NOT NULL, -- Array of order item objects
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) NOT NULL CHECK (tax_amount >= 0),
    tip_amount DECIMAL(10,2) DEFAULT 0 CHECK (tip_amount >= 0),
    delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    delivery_address JSONB, -- For delivery orders
    special_instructions TEXT,
    estimated_ready_time TIMESTAMP WITH TIME ZONE,
    actual_ready_time TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50) NOT NULL,
    created_by UUID NOT NULL, -- Reference to auth service users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table (normalized for better querying)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL, -- Reference to menu service
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
    special_instructions TEXT,
    modifiers JSONB DEFAULT '[]', -- Array of modifier objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    notes TEXT,
    created_by UUID NOT NULL, -- Reference to auth service users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order analytics table
CREATE TABLE IF NOT EXISTS order_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    property_id UUID, -- Reference to property service
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_property_id ON orders(property_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_type ON orders(order_type);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);
CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_status ON order_status_history(status);
CREATE INDEX idx_order_status_history_created_at ON order_status_history(created_at);
CREATE INDEX idx_order_analytics_order_id ON order_analytics(order_id);
CREATE INDEX idx_order_analytics_property_id ON order_analytics(property_id);
CREATE INDEX idx_order_analytics_date ON order_analytics(metric_date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Customers can view their own orders" ON orders FOR SELECT USING (
    customer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Staff can manage orders for their properties" ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))
);

CREATE POLICY "Order items follow order access" ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (
        customer_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))
);

CREATE POLICY "Order status history follows order access" ON order_status_history FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (
        customer_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))
);

CREATE POLICY "Order analytics follow order access" ON order_analytics FOR ALL USING (
    (order_id IS NULL OR EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (
        customer_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))) AND
    (property_id IS NULL OR EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    )))
);

-- Grant permissions
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;
GRANT ALL ON order_status_history TO authenticated;
GRANT ALL ON order_analytics TO authenticated;