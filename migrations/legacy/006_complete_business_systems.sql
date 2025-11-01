-- =====================================================
-- 006_complete_business_systems.sql
-- Complete Business Systems Migration
-- =====================================================
-- This migration adds all missing business system tables:
-- CMS (4 tables), HR (4 tables), Staff (4 tables), 
-- CRM (4 tables), Auth/RBAC (4 tables), Payments/Orders/Menu (3 tables), Email (1 table)

-- =====================================================
-- 1. CMS TABLES
-- =====================================================

-- Create CMS enums
CREATE TYPE content_status_enum AS ENUM ('draft', 'published', 'archived');
CREATE TYPE content_type_enum AS ENUM ('page', 'blog', 'document', 'image', 'video');

-- CMS Content table
CREATE TABLE IF NOT EXISTS cms_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content_type content_type_enum NOT NULL,
    status content_status_enum DEFAULT 'draft',
    body TEXT,
    excerpt TEXT,
    featured_image_id UUID REFERENCES files(id),
    author_id UUID REFERENCES users(id),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}',
    seo_title VARCHAR(255),
    seo_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CMS Collections table
CREATE TABLE IF NOT EXISTS cms_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CMS Templates table
CREATE TABLE IF NOT EXISTS cms_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL,
    template_content TEXT NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CMS Media Library table
CREATE TABLE IF NOT EXISTS cms_media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    alt_text VARCHAR(255),
    caption TEXT,
    tags JSONB DEFAULT '[]',
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. HR/PAYROLL TABLES
-- =====================================================

-- Create HR enums
CREATE TYPE employment_status_enum AS ENUM ('active', 'on_leave', 'terminated', 'resigned');
CREATE TYPE payroll_status_enum AS ENUM ('pending', 'processed', 'paid', 'failed');

-- HR Employees table
CREATE TABLE IF NOT EXISTS hr_employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) UNIQUE,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    hire_date DATE NOT NULL,
    termination_date DATE,
    job_title VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    employment_status employment_status_enum DEFAULT 'active',
    salary DECIMAL(12, 2),
    hourly_rate DECIMAL(10, 2),
    bank_account_number VARCHAR(255),
    tax_id VARCHAR(50),
    emergency_contact JSONB,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HR Payroll table
CREATE TABLE IF NOT EXISTS hr_payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES hr_employees(id) ON DELETE CASCADE,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    gross_pay DECIMAL(12, 2) NOT NULL,
    deductions DECIMAL(12, 2) DEFAULT 0,
    net_pay DECIMAL(12, 2) NOT NULL,
    status payroll_status_enum DEFAULT 'pending',
    paid_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HR Timesheets table
CREATE TABLE IF NOT EXISTS hr_timesheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES hr_employees(id) ON DELETE CASCADE,
    clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
    clock_out TIMESTAMP WITH TIME ZONE,
    hours_worked DECIMAL(5, 2),
    notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HR Attendance table
CREATE TABLE IF NOT EXISTS hr_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES hr_employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL, -- present, absent, late, half_day
    notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- =====================================================
-- 3. STAFF MANAGEMENT TABLES
-- =====================================================

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    employee_id UUID REFERENCES hr_employees(id),
    property_id UUID REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Roles table
CREATE TABLE IF NOT EXISTS staff_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL,
    property_id UUID REFERENCES hospitality_properties(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(staff_id, role, property_id)
);

-- Staff Schedules table
CREATE TABLE IF NOT EXISTS staff_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    shift_start TIMESTAMP WITH TIME ZONE NOT NULL,
    shift_end TIMESTAMP WITH TIME ZONE NOT NULL,
    break_duration INTEGER DEFAULT 0,
    notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Assignments table
CREATE TABLE IF NOT EXISTS staff_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    assignment_type VARCHAR(100) NOT NULL, -- room, event, task
    resource_id UUID, -- booking_id, event_id, etc
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'assigned',
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE
);

-- =====================================================
-- 4. CRM/CUSTOMER TABLES
-- =====================================================

-- Create CRM enums
CREATE TYPE customer_tier_enum AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'vip');

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    customer_tier customer_tier_enum DEFAULT 'bronze',
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Interactions table
CREATE TABLE IF NOT EXISTS customer_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    interaction_type VARCHAR(100) NOT NULL, -- call, email, chat, in_person
    subject VARCHAR(255),
    notes TEXT,
    staff_id UUID REFERENCES staff(id),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Preferences table
CREATE TABLE IF NOT EXISTS customer_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    preference_key VARCHAR(100) NOT NULL,
    preference_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, preference_key)
);

-- Customer Loyalty table
CREATE TABLE IF NOT EXISTS customer_loyalty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    points_balance INTEGER DEFAULT 0,
    tier customer_tier_enum DEFAULT 'bronze',
    transaction_type VARCHAR(100) NOT NULL, -- earned, redeemed, adjusted
    reference_id UUID, -- booking_id or order_id
    notes TEXT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. AUTH/RBAC TABLES (73 PERMISSIONS SYSTEM)
-- =====================================================

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'bookings:read', 'users:write'
    resource VARCHAR(100) NOT NULL, -- bookings, users, properties
    action VARCHAR(50) NOT NULL, -- create, read, update, delete, manage
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- User Permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    resource_id UUID, -- Specific resource this permission applies to
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, permission_id, resource_id)
);

-- =====================================================
-- 6. PAYMENT/ORDERS/MENU TABLES
-- =====================================================

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES customers(id),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    payment_status payment_status_enum DEFAULT 'pending',
    transaction_id VARCHAR(255),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    property_id UUID REFERENCES hospitality_properties(id),
    order_type VARCHAR(50) NOT NULL, -- restaurant, room_service, spa
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    property_id UUID REFERENCES hospitality_properties(id),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. EMAIL QUEUE TABLE
-- =====================================================

-- Email Queue table
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT,
    status VARCHAR(50) DEFAULT 'queued',
    sent_at TIMESTAMP WITH TIME ZONE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- CMS Content indexes
CREATE INDEX IF NOT EXISTS idx_cms_content_tenant ON cms_content(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cms_content_slug ON cms_content(slug);
CREATE INDEX IF NOT EXISTS idx_cms_content_status ON cms_content(status);
CREATE INDEX IF NOT EXISTS idx_cms_content_type ON cms_content(content_type);
CREATE INDEX IF NOT EXISTS idx_cms_content_author ON cms_content(author_id);

-- CMS Collections indexes
CREATE INDEX IF NOT EXISTS idx_cms_collections_tenant ON cms_collections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cms_collections_slug ON cms_collections(slug);

-- CMS Templates indexes
CREATE INDEX IF NOT EXISTS idx_cms_templates_tenant ON cms_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cms_templates_type ON cms_templates(template_type);

-- CMS Media Library indexes
CREATE INDEX IF NOT EXISTS idx_cms_media_tenant ON cms_media_library(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cms_media_file ON cms_media_library(file_id);

-- HR Employees indexes
CREATE INDEX IF NOT EXISTS idx_hr_employees_tenant ON hr_employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hr_employees_user ON hr_employees(user_id);
CREATE INDEX IF NOT EXISTS idx_hr_employees_number ON hr_employees(employee_number);
CREATE INDEX IF NOT EXISTS idx_hr_employees_status ON hr_employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_hr_employees_department ON hr_employees(department);

-- HR Payroll indexes
CREATE INDEX IF NOT EXISTS idx_hr_payroll_employee ON hr_payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_hr_payroll_tenant ON hr_payroll(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hr_payroll_status ON hr_payroll(status);
CREATE INDEX IF NOT EXISTS idx_hr_payroll_period ON hr_payroll(pay_period_start, pay_period_end);

-- HR Timesheets indexes
CREATE INDEX IF NOT EXISTS idx_hr_timesheets_employee ON hr_timesheets(employee_id);
CREATE INDEX IF NOT EXISTS idx_hr_timesheets_tenant ON hr_timesheets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hr_timesheets_clock_in ON hr_timesheets(clock_in);

-- HR Attendance indexes
CREATE INDEX IF NOT EXISTS idx_hr_attendance_employee ON hr_attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_hr_attendance_tenant ON hr_attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hr_attendance_date ON hr_attendance(date);

-- Staff indexes
CREATE INDEX IF NOT EXISTS idx_staff_tenant ON staff(tenant_id);
CREATE INDEX IF NOT EXISTS idx_staff_property ON staff(property_id);
CREATE INDEX IF NOT EXISTS idx_staff_user ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_employee ON staff(employee_id);
CREATE INDEX IF NOT EXISTS idx_staff_active ON staff(is_active);

-- Staff Roles indexes
CREATE INDEX IF NOT EXISTS idx_staff_roles_staff ON staff_roles(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_roles_role ON staff_roles(role);
CREATE INDEX IF NOT EXISTS idx_staff_roles_property ON staff_roles(property_id);

-- Staff Schedules indexes
CREATE INDEX IF NOT EXISTS idx_staff_schedules_staff ON staff_schedules(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_tenant ON staff_schedules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_shift ON staff_schedules(shift_start, shift_end);

-- Staff Assignments indexes
CREATE INDEX IF NOT EXISTS idx_staff_assignments_staff ON staff_assignments(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_tenant ON staff_assignments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_type ON staff_assignments(assignment_type);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_status ON staff_assignments(status);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_user ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(customer_tier);
CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);
CREATE INDEX IF NOT EXISTS idx_customers_country ON customers(country);

-- Customer Interactions indexes
CREATE INDEX IF NOT EXISTS idx_customer_interactions_customer ON customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_tenant ON customer_interactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_type ON customer_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_staff ON customer_interactions(staff_id);

-- Customer Preferences indexes
CREATE INDEX IF NOT EXISTS idx_customer_preferences_customer ON customer_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_preferences_key ON customer_preferences(preference_key);

-- Customer Loyalty indexes
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_customer ON customer_loyalty(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_tenant ON customer_loyalty(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_tier ON customer_loyalty(tier);
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_type ON customer_loyalty(transaction_type);

-- Permissions indexes
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions(action);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions(name);

-- Roles indexes
CREATE INDEX IF NOT EXISTS idx_roles_tenant ON roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_roles_system ON roles(is_system_role);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- Role Permissions indexes
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);

-- User Permissions indexes
CREATE INDEX IF NOT EXISTS idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission ON user_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_resource ON user_permissions(resource_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_expires ON user_permissions(expires_at);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payments(transaction_id);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_property ON orders(property_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Menu Items indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_property ON menu_items(property_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_tenant ON menu_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);

-- Email Queue indexes
CREATE INDEX IF NOT EXISTS idx_email_queue_tenant ON email_queue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_to_email ON email_queue(to_email);
CREATE INDEX IF NOT EXISTS idx_email_queue_created ON email_queue(created_at);

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policies for all tables
CREATE POLICY "cms_content_tenant_policy" ON cms_content
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "cms_collections_tenant_policy" ON cms_collections
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "cms_templates_tenant_policy" ON cms_templates
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "cms_media_library_tenant_policy" ON cms_media_library
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "hr_employees_tenant_policy" ON hr_employees
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "hr_payroll_tenant_policy" ON hr_payroll
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "hr_timesheets_tenant_policy" ON hr_timesheets
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "hr_attendance_tenant_policy" ON hr_attendance
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "staff_tenant_policy" ON staff
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "staff_roles_tenant_policy" ON staff_roles
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "staff_schedules_tenant_policy" ON staff_schedules
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "staff_assignments_tenant_policy" ON staff_assignments
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "customers_tenant_policy" ON customers
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "customer_interactions_tenant_policy" ON customer_interactions
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "customer_preferences_tenant_policy" ON customer_preferences
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "customer_loyalty_tenant_policy" ON customer_loyalty
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "permissions_tenant_policy" ON permissions
    FOR ALL
    USING (true); -- Permissions are global

CREATE POLICY "roles_tenant_policy" ON roles
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID OR is_system_role = true);

CREATE POLICY "role_permissions_tenant_policy" ON role_permissions
    FOR ALL
    USING (true); -- Junction table, controlled by role/tenant

CREATE POLICY "user_permissions_tenant_policy" ON user_permissions
    FOR ALL
    USING (true); -- Controlled by user/tenant

CREATE POLICY "payments_tenant_policy" ON payments
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "orders_tenant_policy" ON orders
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "menu_items_tenant_policy" ON menu_items
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "email_queue_tenant_policy" ON email_queue
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- =====================================================
-- 10. INSERT DEFAULT DATA
-- =====================================================

-- Insert 73 permissions for RBAC system
INSERT INTO permissions (name, resource, action, description) VALUES
-- User Management (8 permissions)
('users:create', 'users', 'create', 'Create new users'),
('users:read', 'users', 'read', 'View user information'),
('users:update', 'users', 'update', 'Update user information'),
('users:delete', 'users', 'delete', 'Delete users'),
('users:manage', 'users', 'manage', 'Full user management'),
('users:assign_roles', 'users', 'assign_roles', 'Assign roles to users'),
('users:view_activity', 'users', 'view_activity', 'View user activity logs'),
('users:reset_password', 'users', 'reset_password', 'Reset user passwords'),

-- Tenant Management (6 permissions)
('tenants:create', 'tenants', 'create', 'Create new tenants'),
('tenants:read', 'tenants', 'read', 'View tenant information'),
('tenants:update', 'tenants', 'update', 'Update tenant settings'),
('tenants:delete', 'tenants', 'delete', 'Delete tenants'),
('tenants:manage', 'tenants', 'manage', 'Full tenant management'),
('tenants:view_analytics', 'tenants', 'view_analytics', 'View tenant analytics'),

-- Property Management (8 permissions)
('properties:create', 'properties', 'create', 'Create new properties'),
('properties:read', 'properties', 'read', 'View property information'),
('properties:update', 'properties', 'update', 'Update property details'),
('properties:delete', 'properties', 'delete', 'Delete properties'),
('properties:manage', 'properties', 'manage', 'Full property management'),
('properties:view_analytics', 'properties', 'view_analytics', 'View property analytics'),
('properties:manage_amenities', 'properties', 'manage_amenities', 'Manage property amenities'),
('properties:upload_media', 'properties', 'upload_media', 'Upload property media'),

-- Booking Management (10 permissions)
('bookings:create', 'bookings', 'create', 'Create new bookings'),
('bookings:read', 'bookings', 'read', 'View booking information'),
('bookings:update', 'bookings', 'update', 'Update booking details'),
('bookings:delete', 'bookings', 'delete', 'Cancel bookings'),
('bookings:manage', 'bookings', 'manage', 'Full booking management'),
('bookings:check_in', 'bookings', 'check_in', 'Check in guests'),
('bookings:check_out', 'bookings', 'check_out', 'Check out guests'),
('bookings:view_analytics', 'bookings', 'view_analytics', 'View booking analytics'),
('bookings:manage_availability', 'bookings', 'manage_availability', 'Manage room availability'),
('bookings:process_payments', 'bookings', 'process_payments', 'Process booking payments'),

-- Customer Management (8 permissions)
('customers:create', 'customers', 'create', 'Create new customers'),
('customers:read', 'customers', 'read', 'View customer information'),
('customers:update', 'customers', 'update', 'Update customer details'),
('customers:delete', 'customers', 'delete', 'Delete customers'),
('customers:manage', 'customers', 'manage', 'Full customer management'),
('customers:view_interactions', 'customers', 'view_interactions', 'View customer interactions'),
('customers:manage_loyalty', 'customers', 'manage_loyalty', 'Manage customer loyalty points'),
('customers:view_analytics', 'customers', 'view_analytics', 'View customer analytics'),

-- Staff Management (8 permissions)
('staff:create', 'staff', 'create', 'Create new staff members'),
('staff:read', 'staff', 'read', 'View staff information'),
('staff:update', 'staff', 'update', 'Update staff details'),
('staff:delete', 'staff', 'delete', 'Delete staff members'),
('staff:manage', 'staff', 'manage', 'Full staff management'),
('staff:manage_schedules', 'staff', 'manage_schedules', 'Manage staff schedules'),
('staff:view_attendance', 'staff', 'view_attendance', 'View staff attendance'),
('staff:assign_tasks', 'staff', 'assign_tasks', 'Assign tasks to staff'),

-- HR Management (8 permissions)
('hr:create_employee', 'hr', 'create_employee', 'Create new employees'),
('hr:read_employee', 'hr', 'read_employee', 'View employee information'),
('hr:update_employee', 'hr', 'update_employee', 'Update employee details'),
('hr:delete_employee', 'hr', 'delete_employee', 'Delete employees'),
('hr:manage_payroll', 'hr', 'manage_payroll', 'Manage payroll'),
('hr:view_timesheets', 'hr', 'view_timesheets', 'View timesheets'),
('hr:manage_attendance', 'hr', 'manage_attendance', 'Manage attendance'),
('hr:view_analytics', 'hr', 'view_analytics', 'View HR analytics'),

-- CMS Management (6 permissions)
('cms:create_content', 'cms', 'create_content', 'Create content'),
('cms:read_content', 'cms', 'read_content', 'View content'),
('cms:update_content', 'cms', 'update_content', 'Update content'),
('cms:delete_content', 'cms', 'delete_content', 'Delete content'),
('cms:manage_templates', 'cms', 'manage_templates', 'Manage content templates'),
('cms:manage_media', 'cms', 'manage_media', 'Manage media library'),

-- Analytics & Reporting (5 permissions)
('analytics:view_dashboard', 'analytics', 'view_dashboard', 'View analytics dashboard'),
('analytics:view_reports', 'analytics', 'view_reports', 'View reports'),
('analytics:export_data', 'analytics', 'export_data', 'Export analytics data'),
('analytics:view_ml_insights', 'analytics', 'view_ml_insights', 'View ML insights'),
('analytics:manage_alerts', 'analytics', 'manage_alerts', 'Manage analytics alerts'),

-- System Administration (6 permissions)
('system:view_logs', 'system', 'view_logs', 'View system logs'),
('system:manage_settings', 'system', 'manage_settings', 'Manage system settings'),
('system:view_health', 'system', 'view_health', 'View system health'),
('system:manage_integrations', 'system', 'manage_integrations', 'Manage integrations'),
('system:view_audit', 'system', 'view_audit', 'View audit logs'),
('system:manage_backups', 'system', 'manage_backups', 'Manage system backups');

-- Insert default roles
INSERT INTO roles (name, description, is_system_role) VALUES
('super_admin', 'Super Administrator with full system access', true),
('admin', 'Administrator with tenant-level access', false),
('manager', 'Manager with property-level access', false),
('staff', 'Staff member with limited access', false),
('guest', 'Guest with read-only access', false);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- This migration adds 24 new tables with comprehensive business functionality:
-- - CMS: 4 tables (content, collections, templates, media_library)
-- - HR: 4 tables (employees, payroll, timesheets, attendance)
-- - Staff: 4 tables (staff, staff_roles, staff_schedules, staff_assignments)
-- - CRM: 4 tables (customers, customer_interactions, customer_preferences, customer_loyalty)
-- - Auth/RBAC: 4 tables (permissions, roles, role_permissions, user_permissions)
-- - Payments/Orders/Menu: 3 tables (payments, orders, menu_items)
-- - Email: 1 table (email_queue)
-- - 73 permissions for comprehensive RBAC
-- - 5 default roles
-- - Complete RLS policies for multi-tenant isolation
-- - Performance indexes for all tables
