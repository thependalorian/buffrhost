-- Menu Service Database Schema
-- Handles menu management for hospitality properties

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Item status enum
CREATE TYPE item_status AS ENUM (
    'active',
    'inactive',
    'out_of_stock',
    'seasonal'
);

-- Item category enum
CREATE TYPE item_category AS ENUM (
    'appetizer',
    'main_course',
    'dessert',
    'beverage',
    'side_dish',
    'salad',
    'soup',
    'breakfast',
    'lunch',
    'dinner'
);

-- Allergen types enum
CREATE TYPE allergen_type AS ENUM (
    'gluten',
    'dairy',
    'nuts',
    'peanuts',
    'soy',
    'eggs',
    'fish',
    'shellfish',
    'sesame'
);

-- Dietary types enum
CREATE TYPE dietary_type AS ENUM (
    'vegetarian',
    'vegan',
    'gluten_free',
    'dairy_free',
    'keto',
    'paleo',
    'low_carb',
    'high_protein'
);

-- Menus table
CREATE TABLE IF NOT EXISTS menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL, -- Reference to property service
    name VARCHAR(255) NOT NULL,
    description TEXT,
    categories JSONB DEFAULT '[]', -- Array of category objects
    items JSONB DEFAULT '[]', -- Array of item objects
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL, -- Reference to auth service users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu categories table (normalized for better querying)
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table (normalized for better querying)
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    category item_category NOT NULL,
    status item_status DEFAULT 'active',
    allergens allergen_type[] DEFAULT '{}',
    dietary_info dietary_type[] DEFAULT '{}',
    calories INTEGER CHECK (calories >= 0),
    preparation_time INTEGER CHECK (preparation_time >= 0), -- minutes
    images TEXT[] DEFAULT '{}',
    modifiers JSONB DEFAULT '[]', -- Array of modifier objects
    ingredients TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu item modifiers table
CREATE TABLE IF NOT EXISTS menu_item_modifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    is_required BOOLEAN DEFAULT FALSE,
    options TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu analytics table
CREATE TABLE IF NOT EXISTS menu_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_menus_property_id ON menus(property_id);
CREATE INDEX idx_menus_active ON menus(is_active);
CREATE INDEX idx_menu_categories_menu_id ON menu_categories(menu_id);
CREATE INDEX idx_menu_categories_active ON menu_categories(is_active);
CREATE INDEX idx_menu_items_menu_id ON menu_items(menu_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_status ON menu_items(status);
CREATE INDEX idx_menu_items_featured ON menu_items(is_featured);
CREATE INDEX idx_menu_item_modifiers_item_id ON menu_item_modifiers(menu_item_id);
CREATE INDEX idx_menu_analytics_menu_id ON menu_analytics(menu_id);
CREATE INDEX idx_menu_analytics_item_id ON menu_analytics(menu_item_id);
CREATE INDEX idx_menu_analytics_date ON menu_analytics(metric_date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_menus_updated_at
    BEFORE UPDATE ON menus
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at
    BEFORE UPDATE ON menu_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_item_modifiers_updated_at
    BEFORE UPDATE ON menu_item_modifiers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Menu access based on property ownership" ON menus FOR ALL USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))
);

CREATE POLICY "Menu categories follow menu access" ON menu_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND (
        EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
            owner_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
        ))
    ))
);

CREATE POLICY "Menu items follow menu access" ON menu_items FOR ALL USING (
    EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND (
        EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
            owner_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
        ))
    ))
);

CREATE POLICY "Menu item modifiers follow item access" ON menu_item_modifiers FOR ALL USING (
    EXISTS (SELECT 1 FROM menu_items WHERE id = menu_item_id AND (
        EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND (
            EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
                owner_id = auth.uid() OR 
                EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
            ))
        ))
    ))
);

CREATE POLICY "Menu analytics follow menu access" ON menu_analytics FOR ALL USING (
    (menu_id IS NULL OR EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND (
        EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
            owner_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
        ))
    ))) AND
    (menu_item_id IS NULL OR EXISTS (SELECT 1 FROM menu_items WHERE id = menu_item_id AND (
        EXISTS (SELECT 1 FROM menus WHERE id = menu_id AND (
            EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
                owner_id = auth.uid() OR 
                EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
            ))
        ))
    )))
);

-- Grant permissions
GRANT ALL ON menus TO authenticated;
GRANT ALL ON menu_categories TO authenticated;
GRANT ALL ON menu_items TO authenticated;
GRANT ALL ON menu_item_modifiers TO authenticated;
GRANT ALL ON menu_analytics TO authenticated;