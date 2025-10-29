-- =============================================================================
-- BUFFR HOST - AVAILABILITY ENGINE MIGRATION
-- =============================================================================
-- Phase 1: Core Availability Engine
-- Real-time inventory tracking, service availability, and reservation validation

-- =============================================================================
-- 1. REAL-TIME INVENTORY AVAILABILITY
-- =============================================================================

-- Real-time inventory tracking with reserved stock
CREATE TABLE IF NOT EXISTS inventory_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    current_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    reserved_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    available_stock DECIMAL(10,3) GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
    minimum_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    maximum_stock DECIMAL(10,3),
    is_low_stock BOOLEAN GENERATED ALWAYS AS ((current_stock - reserved_stock) <= minimum_stock) STORED,
    is_out_of_stock BOOLEAN GENERATED ALWAYS AS ((current_stock - reserved_stock) <= 0) STORED,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(property_id, inventory_item_id)
);

-- Inventory stock movements for tracking
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'reservation', 'release')),
    quantity DECIMAL(10,3) NOT NULL,
    reason VARCHAR(100),
    reference_id UUID, -- Order ID, purchase order ID, etc.
    reference_type VARCHAR(50), -- 'order', 'purchase', 'adjustment', 'reservation'
    staff_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. SERVICE AVAILABILITY CALENDAR
-- =============================================================================

-- Service availability calendar for spa, conference, transportation services
CREATE TABLE IF NOT EXISTS service_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    service_id UUID NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('spa', 'conference', 'transportation', 'recreation', 'specialized')),
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 1,
    current_bookings INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN GENERATED ALWAYS AS (current_bookings < max_capacity) STORED,
    price DECIMAL(10,2),
    special_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(property_id, service_id, available_date, start_time)
);

-- Service booking slots for granular availability
CREATE TABLE IF NOT EXISTS service_booking_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    availability_id UUID REFERENCES service_availability(id) ON DELETE CASCADE,
    slot_start_time TIME NOT NULL,
    slot_end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT false,
    booking_id UUID, -- References the actual booking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 3. TABLE AVAILABILITY ENHANCEMENTS
-- =============================================================================

-- Enhanced table availability tracking
CREATE TABLE IF NOT EXISTS table_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    table_id UUID REFERENCES restaurant_tables(id) ON DELETE CASCADE,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    reservation_id UUID REFERENCES table_reservations(id),
    party_size INTEGER,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(table_id, available_date, start_time)
);

-- Table capacity and status tracking
CREATE TABLE IF NOT EXISTS table_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID REFERENCES restaurant_tables(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance', 'cleaning')),
    occupied_at TIMESTAMP WITH TIME ZONE,
    estimated_vacancy TIMESTAMP WITH TIME ZONE,
    current_party_size INTEGER,
    staff_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 4. ROOM AVAILABILITY ENHANCEMENTS
-- =============================================================================

-- Enhanced room availability tracking
CREATE TABLE IF NOT EXISTS room_availability_enhanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    available_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    booking_id UUID REFERENCES bookings(id),
    check_in_date DATE,
    check_out_date DATE,
    room_status VARCHAR(20) DEFAULT 'available' CHECK (room_status IN ('available', 'occupied', 'maintenance', 'cleaning', 'out_of_order')),
    maintenance_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(room_id, available_date)
);

-- Room status tracking
CREATE TABLE IF NOT EXISTS room_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'out_of_order')),
    occupied_at TIMESTAMP WITH TIME ZONE,
    estimated_vacancy TIMESTAMP WITH TIME ZONE,
    current_guest_id UUID REFERENCES users(id),
    housekeeping_notes TEXT,
    maintenance_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 5. AVAILABILITY ALERTS AND NOTIFICATIONS
-- =============================================================================

-- Low stock alerts
CREATE TABLE IF NOT EXISTS inventory_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock', 'expiring_soon')),
    severity VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability notifications
CREATE TABLE IF NOT EXISTS availability_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('table_unavailable', 'room_unavailable', 'service_unavailable', 'inventory_low', 'maintenance_scheduled')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    target_audience VARCHAR(20) NOT NULL CHECK (target_audience IN ('guests', 'staff', 'management', 'all')),
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 6. INDEXES FOR PERFORMANCE
-- =============================================================================

-- Inventory availability indexes
CREATE INDEX IF NOT EXISTS idx_inventory_availability_property_id ON inventory_availability(property_id);
CREATE INDEX IF NOT EXISTS idx_inventory_availability_item_id ON inventory_availability(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_availability_low_stock ON inventory_availability(is_low_stock) WHERE is_low_stock = true;
CREATE INDEX IF NOT EXISTS idx_inventory_availability_out_of_stock ON inventory_availability(is_out_of_stock) WHERE is_out_of_stock = true;

-- Inventory movements indexes
CREATE INDEX IF NOT EXISTS idx_inventory_movements_property_id ON inventory_movements(property_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item_id ON inventory_movements(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_type ON inventory_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at);

-- Service availability indexes
CREATE INDEX IF NOT EXISTS idx_service_availability_property_id ON service_availability(property_id);
CREATE INDEX IF NOT EXISTS idx_service_availability_service_id ON service_availability(service_id);
CREATE INDEX IF NOT EXISTS idx_service_availability_date ON service_availability(available_date);
CREATE INDEX IF NOT EXISTS idx_service_availability_available ON service_availability(is_available) WHERE is_available = true;

-- Table availability indexes
CREATE INDEX IF NOT EXISTS idx_table_availability_property_id ON table_availability(property_id);
CREATE INDEX IF NOT EXISTS idx_table_availability_table_id ON table_availability(table_id);
CREATE INDEX IF NOT EXISTS idx_table_availability_date ON table_availability(available_date);
CREATE INDEX IF NOT EXISTS idx_table_availability_available ON table_availability(is_available) WHERE is_available = true;

-- Room availability indexes
CREATE INDEX IF NOT EXISTS idx_room_availability_enhanced_property_id ON room_availability_enhanced(property_id);
CREATE INDEX IF NOT EXISTS idx_room_availability_enhanced_room_id ON room_availability_enhanced(room_id);
CREATE INDEX IF NOT EXISTS idx_room_availability_enhanced_date ON room_availability_enhanced(available_date);
CREATE INDEX IF NOT EXISTS idx_room_availability_enhanced_available ON room_availability_enhanced(is_available) WHERE is_available = true;

-- Alert indexes
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_property_id ON inventory_alerts(property_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_resolved ON inventory_alerts(is_resolved) WHERE is_resolved = false;
CREATE INDEX IF NOT EXISTS idx_availability_notifications_property_id ON availability_notifications(property_id);
CREATE INDEX IF NOT EXISTS idx_availability_notifications_sent ON availability_notifications(is_sent) WHERE is_sent = false;

-- =============================================================================
-- 7. TRIGGERS FOR REAL-TIME UPDATES
-- =============================================================================

-- Update inventory availability when movements occur
CREATE OR REPLACE FUNCTION update_inventory_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Update inventory availability based on movement
    INSERT INTO inventory_availability (property_id, inventory_item_id, current_stock, reserved_stock)
    VALUES (NEW.property_id, NEW.inventory_item_id, 
            CASE 
                WHEN NEW.movement_type = 'in' THEN NEW.quantity
                WHEN NEW.movement_type = 'out' THEN -NEW.quantity
                WHEN NEW.movement_type = 'adjustment' THEN NEW.quantity
                ELSE 0
            END,
            CASE 
                WHEN NEW.movement_type = 'reservation' THEN NEW.quantity
                WHEN NEW.movement_type = 'release' THEN -NEW.quantity
                ELSE 0
            END)
    ON CONFLICT (property_id, inventory_item_id) 
    DO UPDATE SET
        current_stock = inventory_availability.current_stock + 
            CASE 
                WHEN NEW.movement_type = 'in' THEN NEW.quantity
                WHEN NEW.movement_type = 'out' THEN -NEW.quantity
                WHEN NEW.movement_type = 'adjustment' THEN NEW.quantity
                ELSE 0
            END,
        reserved_stock = inventory_availability.reserved_stock + 
            CASE 
                WHEN NEW.movement_type = 'reservation' THEN NEW.quantity
                WHEN NEW.movement_type = 'release' THEN -NEW.quantity
                ELSE 0
            END,
        last_updated = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_availability
    AFTER INSERT ON inventory_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_availability();

-- Update service availability when bookings change
CREATE OR REPLACE FUNCTION update_service_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current bookings count
    UPDATE service_availability 
    SET current_bookings = (
        SELECT COUNT(*) 
        FROM service_booking_slots 
        WHERE availability_id = service_availability.id 
        AND is_booked = true
    )
    WHERE id = NEW.availability_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_service_availability
    AFTER INSERT OR UPDATE OR DELETE ON service_booking_slots
    FOR EACH ROW
    EXECUTE FUNCTION update_service_availability();

-- =============================================================================
-- 8. VIEWS FOR EASY QUERYING
-- =============================================================================

-- Inventory availability summary view
CREATE OR REPLACE VIEW inventory_availability_summary AS
SELECT 
    ia.property_id,
    p.name as property_name,
    ii.item_name,
    ia.current_stock,
    ia.reserved_stock,
    ia.available_stock,
    ia.minimum_stock,
    ia.is_low_stock,
    ia.is_out_of_stock,
    ia.last_updated
FROM inventory_availability ia
JOIN properties p ON ia.property_id = p.id
JOIN inventory_items ii ON ia.inventory_item_id = ii.id;

-- Service availability summary view
CREATE OR REPLACE VIEW service_availability_summary AS
SELECT 
    sa.property_id,
    p.name as property_name,
    sa.service_type,
    sa.available_date,
    sa.start_time,
    sa.end_time,
    sa.max_capacity,
    sa.current_bookings,
    sa.is_available,
    sa.price
FROM service_availability sa
JOIN properties p ON sa.property_id = p.id;

-- Table availability summary view
CREATE OR REPLACE VIEW table_availability_summary AS
SELECT 
    ta.property_id,
    p.name as property_name,
    rt.table_number,
    rt.capacity,
    ta.available_date,
    ta.start_time,
    ta.end_time,
    ta.is_available,
    ta.party_size
FROM table_availability ta
JOIN properties p ON ta.property_id = p.id
JOIN restaurant_tables rt ON ta.table_id = rt.id;

-- Room availability summary view
CREATE OR REPLACE VIEW room_availability_summary AS
SELECT 
    rae.property_id,
    p.name as property_name,
    r.room_number,
    rt.type_name as room_type,
    rae.available_date,
    rae.is_available,
    rae.room_status,
    rae.check_in_date,
    rae.check_out_date
FROM room_availability_enhanced rae
JOIN properties p ON rae.property_id = p.id
JOIN rooms r ON rae.room_id = r.id
JOIN room_types rt ON r.room_type_id = rt.id;

-- =============================================================================
-- 9. INITIAL DATA POPULATION
-- =============================================================================

-- Populate inventory availability from existing inventory items
INSERT INTO inventory_availability (property_id, inventory_item_id, current_stock, minimum_stock)
SELECT 
    ii.property_id,
    ii.id,
    COALESCE(ii.current_stock, 0),
    COALESCE(ii.reorder_level, 0)
FROM inventory_items ii
WHERE NOT EXISTS (
    SELECT 1 FROM inventory_availability ia 
    WHERE ia.property_id = ii.property_id 
    AND ia.inventory_item_id = ii.id
);

-- Populate table availability for next 30 days
INSERT INTO table_availability (property_id, table_id, available_date, start_time, end_time)
SELECT 
    rt.property_id,
    rt.id,
    generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day')::date,
    '09:00'::time,
    '22:00'::time
FROM restaurant_tables rt
WHERE rt.is_active = true
AND NOT EXISTS (
    SELECT 1 FROM table_availability ta 
    WHERE ta.table_id = rt.id 
    AND ta.available_date = generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day')::date
);

-- Populate room availability for next 30 days
INSERT INTO room_availability_enhanced (property_id, room_id, available_date)
SELECT 
    r.property_id,
    r.id,
    generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day')::date
FROM rooms r
WHERE r.is_active = true
AND NOT EXISTS (
    SELECT 1 FROM room_availability_enhanced rae 
    WHERE rae.room_id = r.id 
    AND rae.available_date = generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day')::date
);

-- =============================================================================
-- 10. COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE inventory_availability IS 'Real-time inventory availability tracking with reserved stock management';
COMMENT ON TABLE inventory_movements IS 'Audit trail of all inventory movements (in, out, adjustments, reservations)';
COMMENT ON TABLE service_availability IS 'Service availability calendar for spa, conference, transportation services';
COMMENT ON TABLE table_availability IS 'Enhanced table availability tracking with time slots';
COMMENT ON TABLE room_availability_enhanced IS 'Enhanced room availability tracking with status management';
COMMENT ON TABLE inventory_alerts IS 'Low stock and inventory alerts for property management';
COMMENT ON TABLE availability_notifications IS 'Availability change notifications for guests and staff';

COMMENT ON COLUMN inventory_availability.available_stock IS 'Calculated as current_stock - reserved_stock';
COMMENT ON COLUMN inventory_availability.is_low_stock IS 'Automatically calculated when available_stock <= minimum_stock';
COMMENT ON COLUMN inventory_availability.is_out_of_stock IS 'Automatically calculated when available_stock <= 0';
COMMENT ON COLUMN service_availability.is_available IS 'Automatically calculated when current_bookings < max_capacity';
COMMENT ON COLUMN inventory_movements.movement_type IS 'Type of inventory movement: in, out, adjustment, reservation, release';
COMMENT ON COLUMN service_availability.service_type IS 'Type of service: spa, conference, transportation, recreation, specialized';