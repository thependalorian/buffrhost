-- Buffr Host Users Table
-- System users who manage hospitality properties

CREATE TABLE BuffrHostUser (
    owner_id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    user_type_id INTEGER REFERENCES UserType(user_type_id) DEFAULT 5,
    role user_role_enum NOT NULL DEFAULT 'hospitality_staff',
    permissions TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER update_buffr_host_user_updated_at 
    BEFORE UPDATE ON BuffrHostUser 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
