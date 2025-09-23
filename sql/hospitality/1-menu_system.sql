-- Menu System Tables
-- Complete menu management for restaurants and food service

-- Menu Categories
CREATE TABLE MenuCategory (
    category_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL,
    UNIQUE(property_id, display_order)
);

-- Menu Items
CREATE TABLE Menu (
    menu_item_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    category_id INTEGER REFERENCES MenuCategory(category_id) ON DELETE CASCADE,
    preparation_time INTEGER,
    calories INTEGER,
    dietary_tags VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    for_type VARCHAR(50) DEFAULT 'all',
    is_popular BOOLEAN DEFAULT FALSE,
    is_all BOOLEAN DEFAULT TRUE,
    service_type VARCHAR(50) DEFAULT 'restaurant',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Menu Media
CREATE TABLE MenuMedia (
    media_id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES Menu(menu_item_id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modifiers (Option Groups)
CREATE TABLE Modifiers (
    modifiers_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_multiple BOOLEAN DEFAULT FALSE,
    min_selections INTEGER DEFAULT 0,
    max_selections INTEGER DEFAULT 1,
    service_type VARCHAR(50) DEFAULT 'restaurant',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Option Values
CREATE TABLE OptionValue (
    option_value_id SERIAL PRIMARY KEY,
    modifiers_id INTEGER REFERENCES Modifiers(modifiers_id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    additional_price DECIMAL(10,2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Modifiers Link
CREATE TABLE MenuModifiers (
    modifiers_id INTEGER REFERENCES Modifiers(modifiers_id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES Menu(menu_item_id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (modifiers_id, menu_item_id)
);

-- Create updated_at triggers
CREATE TRIGGER update_menu_updated_at 
    BEFORE UPDATE ON Menu 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
