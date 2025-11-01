-- Restaurant Inventory Management Database Schema
-- Comprehensive inventory system for Sofia's restaurant oversight

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name VARCHAR(200) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'ingredient', 'beverage', 'supply', 'equipment'
    category VARCHAR(100) NOT NULL, -- 'proteins', 'vegetables', 'beverages', 'cleaning', etc.
    unit_of_measure VARCHAR(20) NOT NULL, -- 'kg', 'liters', 'pieces', 'boxes'
    current_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    minimum_threshold DECIMAL(10,3) NOT NULL DEFAULT 0,
    maximum_threshold DECIMAL(10,3) NOT NULL DEFAULT 0,
    reorder_point DECIMAL(10,3) NOT NULL DEFAULT 0,
    reorder_quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
    unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    supplier_name VARCHAR(200),
    supplier_contact VARCHAR(200),
    shelf_life_days INTEGER,
    storage_location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    tenant_id VARCHAR(50) NOT NULL,
    property_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Movements Table
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment', 'waste', 'transfer'
    quantity DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    reason VARCHAR(200),
    reference_id VARCHAR(100), -- order_id, supplier_invoice, etc.
    reference_type VARCHAR(50), -- 'order', 'purchase', 'waste', 'adjustment'
    notes TEXT,
    performed_by VARCHAR(100),
    tenant_id VARCHAR(50) NOT NULL,
    property_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Alerts Table
CREATE TABLE IF NOT EXISTS inventory_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    alert_type VARCHAR(30) NOT NULL, -- 'low_stock', 'out_of_stock', 'expiring_soon', 'overstock'
    alert_level VARCHAR(20) NOT NULL, -- 'warning', 'critical', 'urgent'
    current_stock DECIMAL(10,3) NOT NULL,
    threshold_value DECIMAL(10,3) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(100),
    tenant_id VARCHAR(50) NOT NULL,
    property_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Item Ingredients Table (Recipe Management)
CREATE TABLE IF NOT EXISTS menu_item_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id VARCHAR(100) NOT NULL,
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    quantity_required DECIMAL(10,3) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    is_optional BOOLEAN DEFAULT false,
    notes TEXT,
    tenant_id VARCHAR(50) NOT NULL,
    property_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(200) NOT NULL,
    supplier_contact VARCHAR(200),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'ordered', 'received', 'cancelled'
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery_date TIMESTAMP WITH TIME ZONE,
    received_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_by VARCHAR(100) NOT NULL,
    approved_by VARCHAR(100),
    tenant_id VARCHAR(50) NOT NULL,
    property_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Order Items Table
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id),
    item_name VARCHAR(200) NOT NULL,
    quantity_ordered DECIMAL(10,3) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    quantity_received DECIMAL(10,3) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Reports Table
CREATE TABLE IF NOT EXISTS inventory_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type VARCHAR(50) NOT NULL, -- 'stock_levels', 'low_stock', 'expiring_items', 'cost_analysis'
    report_data JSONB NOT NULL,
    generated_by VARCHAR(100) NOT NULL,
    tenant_id VARCHAR(50) NOT NULL,
    property_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_tenant_property ON inventory_items(tenant_id, property_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_stock_levels ON inventory_items(current_stock, minimum_threshold);
CREATE INDEX IF NOT EXISTS idx_stock_movements_item_id ON stock_movements(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_tenant_property ON stock_movements(tenant_id, property_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_unresolved ON inventory_alerts(is_resolved, alert_level);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_tenant_property ON inventory_alerts(tenant_id, property_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_ingredients_menu_item ON menu_item_ingredients(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_tenant_property ON purchase_orders(tenant_id, property_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);

-- Row Level Security (RLS) Policies
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory_items
CREATE POLICY inventory_items_tenant_isolation ON inventory_items
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id'));

-- RLS Policies for stock_movements
CREATE POLICY stock_movements_tenant_isolation ON stock_movements
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id'));

-- RLS Policies for inventory_alerts
CREATE POLICY inventory_alerts_tenant_isolation ON inventory_alerts
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id'));

-- RLS Policies for menu_item_ingredients
CREATE POLICY menu_item_ingredients_tenant_isolation ON menu_item_ingredients
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id'));

-- RLS Policies for purchase_orders
CREATE POLICY purchase_orders_tenant_isolation ON purchase_orders
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id'));

-- RLS Policies for purchase_order_items
CREATE POLICY purchase_order_items_tenant_isolation ON purchase_order_items
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id'));

-- RLS Policies for inventory_reports
CREATE POLICY inventory_reports_tenant_isolation ON inventory_reports
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id'));

-- Functions for inventory management
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current stock based on movement type
    IF NEW.movement_type = 'in' THEN
        UPDATE inventory_items 
        SET current_stock = current_stock + NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.inventory_item_id;
    ELSIF NEW.movement_type = 'out' THEN
        UPDATE inventory_items 
        SET current_stock = current_stock - NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.inventory_item_id;
    ELSIF NEW.movement_type = 'adjustment' THEN
        UPDATE inventory_items 
        SET current_stock = NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.inventory_item_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update stock levels
CREATE TRIGGER trigger_update_inventory_stock
    AFTER INSERT ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_stock();

-- Function to check for low stock alerts
CREATE OR REPLACE FUNCTION check_low_stock_alerts()
RETURNS void AS $$
DECLARE
    item RECORD;
BEGIN
    -- Check for low stock items
    FOR item IN 
        SELECT id, item_name, current_stock, minimum_threshold, reorder_point
        FROM inventory_items 
        WHERE is_active = true 
        AND current_stock <= minimum_threshold
        AND id NOT IN (
            SELECT inventory_item_id 
            FROM inventory_alerts 
            WHERE alert_type = 'low_stock' 
            AND is_resolved = false
        )
    LOOP
        INSERT INTO inventory_alerts (
            inventory_item_id, alert_type, alert_level, current_stock, 
            threshold_value, message, tenant_id, property_id
        ) VALUES (
            item.id, 'low_stock', 
            CASE 
                WHEN item.current_stock <= 0 THEN 'critical'
                WHEN item.current_stock <= item.reorder_point THEN 'urgent'
                ELSE 'warning'
            END,
            item.current_stock, item.minimum_threshold,
            'Stock level is below minimum threshold for ' || item.item_name,
            (SELECT tenant_id FROM inventory_items WHERE id = item.id),
            (SELECT property_id FROM inventory_items WHERE id = item.id)
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate stock requirements for menu items
CREATE OR REPLACE FUNCTION calculate_menu_item_stock_requirements(menu_item_id_param VARCHAR(100))
RETURNS TABLE (
    inventory_item_id UUID,
    item_name VARCHAR(200),
    quantity_required DECIMAL(10,3),
    current_stock DECIMAL(10,3),
    shortfall DECIMAL(10,3)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mi.id,
        mi.item_name,
        mii.quantity_required,
        mi.current_stock,
        GREATEST(0, mii.quantity_required - mi.current_stock) as shortfall
    FROM menu_item_ingredients mii
    JOIN inventory_items mi ON mii.inventory_item_id = mi.id
    WHERE mii.menu_item_id = menu_item_id_param
    AND mi.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to generate inventory report
CREATE OR REPLACE FUNCTION generate_inventory_report(report_type_param VARCHAR(50))
RETURNS JSONB AS $$
DECLARE
    report_data JSONB;
BEGIN
    CASE report_type_param
        WHEN 'stock_levels' THEN
            SELECT jsonb_agg(
                jsonb_build_object(
                    'item_id', id,
                    'item_name', item_name,
                    'category', category,
                    'current_stock', current_stock,
                    'minimum_threshold', minimum_threshold,
                    'reorder_point', reorder_point,
                    'unit_cost', unit_cost,
                    'total_value', current_stock * unit_cost,
                    'status', CASE 
                        WHEN current_stock <= 0 THEN 'out_of_stock'
                        WHEN current_stock <= minimum_threshold THEN 'low_stock'
                        WHEN current_stock >= maximum_threshold THEN 'overstock'
                        ELSE 'normal'
                    END
                )
            ) INTO report_data
            FROM inventory_items
            WHERE is_active = true;
            
        WHEN 'low_stock' THEN
            SELECT jsonb_agg(
                jsonb_build_object(
                    'item_id', id,
                    'item_name', item_name,
                    'category', category,
                    'current_stock', current_stock,
                    'minimum_threshold', minimum_threshold,
                    'reorder_quantity', reorder_quantity,
                    'unit_cost', unit_cost,
                    'supplier_name', supplier_name,
                    'urgency_level', CASE 
                        WHEN current_stock <= 0 THEN 'critical'
                        WHEN current_stock <= reorder_point THEN 'urgent'
                        ELSE 'warning'
                    END
                )
            ) INTO report_data
            FROM inventory_items
            WHERE is_active = true 
            AND current_stock <= minimum_threshold;
            
        ELSE
            report_data := '{"error": "Invalid report type"}'::jsonb;
    END CASE;
    
    RETURN report_data;
END;
$$ LANGUAGE plpgsql;

-- Insert default inventory categories
INSERT INTO inventory_items (item_name, item_type, category, unit_of_measure, current_stock, minimum_threshold, reorder_point, reorder_quantity, unit_cost, supplier_name, tenant_id, property_id) VALUES
('Fresh Salmon', 'ingredient', 'proteins', 'kg', 10.0, 2.0, 5.0, 15.0, 45.00, 'Ocean Fresh Suppliers', 'default-tenant', 'default-property'),
('Romaine Lettuce', 'ingredient', 'vegetables', 'kg', 5.0, 1.0, 2.0, 8.0, 8.50, 'Green Valley Farms', 'default-tenant', 'default-property'),
('Parmesan Cheese', 'ingredient', 'dairy', 'kg', 3.0, 0.5, 1.0, 2.0, 25.00, 'Cheese Masters', 'default-tenant', 'default-property'),
('Sauvignon Blanc', 'beverage', 'wine', 'bottles', 24.0, 6.0, 12.0, 36.0, 15.00, 'Wine Distributors', 'default-tenant', 'default-property'),
('Olive Oil', 'ingredient', 'oils', 'liters', 2.0, 0.5, 1.0, 3.0, 12.00, 'Mediterranean Imports', 'default-tenant', 'default-property'),
('Sea Salt', 'ingredient', 'seasonings', 'kg', 1.0, 0.2, 0.5, 1.0, 5.00, 'Salt Works', 'default-tenant', 'default-property'),
('Black Pepper', 'ingredient', 'seasonings', 'kg', 0.5, 0.1, 0.3, 0.5, 8.00, 'Spice Traders', 'default-tenant', 'default-property'),
('Fresh Rosemary', 'ingredient', 'herbs', 'kg', 0.2, 0.05, 0.1, 0.3, 20.00, 'Herb Garden', 'default-tenant', 'default-property'),
('Fresh Thyme', 'ingredient', 'herbs', 'kg', 0.15, 0.05, 0.1, 0.2, 18.00, 'Herb Garden', 'default-tenant', 'default-property'),
('Fresh Lemons', 'ingredient', 'fruits', 'kg', 3.0, 0.5, 1.0, 2.0, 6.00, 'Citrus Grove', 'default-tenant', 'default-property');

-- Insert sample menu item ingredients (recipes)
INSERT INTO menu_item_ingredients (menu_item_id, inventory_item_id, quantity_required, unit_of_measure, tenant_id, property_id) VALUES
('menu_item_123', (SELECT id FROM inventory_items WHERE item_name = 'Fresh Salmon'), 0.3, 'kg', 'default-tenant', 'default-property'),
('menu_item_123', (SELECT id FROM inventory_items WHERE item_name = 'Olive Oil'), 0.02, 'liters', 'default-tenant', 'default-property'),
('menu_item_123', (SELECT id FROM inventory_items WHERE item_name = 'Sea Salt'), 0.005, 'kg', 'default-tenant', 'default-property'),
('menu_item_123', (SELECT id FROM inventory_items WHERE item_name = 'Black Pepper'), 0.002, 'kg', 'default-tenant', 'default-property'),
('menu_item_123', (SELECT id FROM inventory_items WHERE item_name = 'Fresh Rosemary'), 0.01, 'kg', 'default-tenant', 'default-property'),
('menu_item_123', (SELECT id FROM inventory_items WHERE item_name = 'Fresh Thyme'), 0.01, 'kg', 'default-tenant', 'default-property'),
('menu_item_123', (SELECT id FROM inventory_items WHERE item_name = 'Fresh Lemons'), 0.1, 'kg', 'default-tenant', 'default-property'),
('menu_item_124', (SELECT id FROM inventory_items WHERE item_name = 'Romaine Lettuce'), 0.2, 'kg', 'default-tenant', 'default-property'),
('menu_item_124', (SELECT id FROM inventory_items WHERE item_name = 'Parmesan Cheese'), 0.05, 'kg', 'default-tenant', 'default-property'),
('menu_item_124', (SELECT id FROM inventory_items WHERE item_name = 'Olive Oil'), 0.01, 'liters', 'default-tenant', 'default-property');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_item_ingredients_updated_at
    BEFORE UPDATE ON menu_item_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();