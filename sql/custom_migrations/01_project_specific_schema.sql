-- Create rate_limit_type enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rate_limit_type_enum') THEN
        CREATE TYPE rate_limit_type_enum AS ENUM (
            'ip_address',
            'user_id',
            'api_key',
            'endpoint',
            'global'
        );
    END IF;
END $$;

-- Create the unified rate_limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- e.g., 'login_attempts', 'api_requests_per_minute'
    limit_value INTEGER NOT NULL, -- Max requests allowed
    time_window_seconds INTEGER NOT NULL, -- Time window in seconds
    type rate_limit_type_enum NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the unified rate_limit_status table to track current usage
CREATE TABLE IF NOT EXISTS public.rate_limit_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_limit_id UUID REFERENCES public.rate_limits(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL, -- IP address, user_id, API key, or endpoint path
    current_requests INTEGER DEFAULT 0,
    last_reset_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (rate_limit_id, identifier)
);

-- Create the unified rate_limiting_exemptions table
CREATE TABLE IF NOT EXISTS public.rate_limiting_exemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_limit_id UUID REFERENCES public.rate_limits(id) ON DELETE CASCADE,
    exempt_identifier TEXT NOT NULL, -- IP address, user_id, API key, etc.
    exemption_reason TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (rate_limit_id, exempt_identifier)
);

-- Set up RLS for all new tables
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limits" ON public.rate_limits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limits" ON public.rate_limits FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

ALTER TABLE public.rate_limit_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limit status" ON public.rate_limit_status FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limit status" ON public.rate_limit_status FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

ALTER TABLE public.rate_limiting_exemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limiting exemptions" ON public.rate_limiting_exemptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limiting exemptions" ON public.rate_limiting_exemptions FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));
\n-- End of the-shandi/sql/004_create_unified_rate_limiting.sql --\n
-- Create rate_limit_type enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rate_limit_type_enum') THEN
        CREATE TYPE rate_limit_type_enum AS ENUM (
            'ip_address',
            'user_id',
            'api_key',
            'endpoint',
            'global'
        );
    END IF;
END $$;

-- Create the unified rate_limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- e.g., 'login_attempts', 'api_requests_per_minute'
    limit_value INTEGER NOT NULL, -- Max requests allowed
    time_window_seconds INTEGER NOT NULL, -- Time window in seconds
    type rate_limit_type_enum NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the unified rate_limit_status table to track current usage
CREATE TABLE IF NOT EXISTS public.rate_limit_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_limit_id UUID REFERENCES public.rate_limits(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL, -- IP address, user_id, API key, or endpoint path
    current_requests INTEGER DEFAULT 0,
    last_reset_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (rate_limit_id, identifier)
);

-- Create the unified rate_limiting_exemptions table
CREATE TABLE IF NOT EXISTS public.rate_limiting_exemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_limit_id UUID REFERENCES public.rate_limits(id) ON DELETE CASCADE,
    exempt_identifier TEXT NOT NULL, -- IP address, user_id, API key, etc.
    exemption_reason TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (rate_limit_id, exempt_identifier)
);

-- Set up RLS for all new tables
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limits" ON public.rate_limits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limits" ON public.rate_limits FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

ALTER TABLE public.rate_limit_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limit status" ON public.rate_limit_status FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limit status" ON public.rate_limit_status FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

ALTER TABLE public.rate_limiting_exemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limiting exemptions" ON public.rate_limiting_exemptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limiting exemptions" ON public.rate_limiting_exemptions FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));
\n-- End of the-shandi/sql/004_create_unified_rate_limiting.sql --\n
-- Create a unified user_roles enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM (
            'individual',
            'sme_user',
            'enterprise_user',
            'admin',
            'hospitality_staff',
            'customer',
            'corporate_customer'
        );
    END IF;
END $$;

-- Create the profiles table, linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    company_name TEXT,
    user_role user_role_enum DEFAULT 'individual'::user_role_enum,
    plan_type TEXT DEFAULT 'free', -- e.g., 'free', 'basic', 'premium', 'enterprise'
    status TEXT DEFAULT 'active', -- e.g., 'active', 'suspended', 'inactive', 'pending_verification'
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Additional fields from BuffrSign's User model
    preferences JSONB DEFAULT '{}'::jsonb,
    biometric_data JSONB DEFAULT '[]'::jsonb,
    behavioral_metrics JSONB DEFAULT '{}'::jsonb,
    subscription_expires_at TIMESTAMPTZ,
    -- Additional fields from BuffrLend's profiles
    first_name TEXT,
    last_name TEXT,
    -- Additional fields from The Shandi's BuffrHostUser (if applicable, linked via profiles)
    property_id INTEGER, -- Link to hospitality_property if applicable
    user_type_id INTEGER, -- Link to user_type if applicable
    permissions TEXT[] DEFAULT '{}'::TEXT[],
    -- KYC Information (from BuffrSign's UserRegistrationWithKYC)
    country_code TEXT,
    national_id_number TEXT,
    national_id_type TEXT,
    id_document_url TEXT,
    kyc_status TEXT DEFAULT 'pending', -- e.g., 'pending', 'verified', 'rejected'
    consent_given BOOLEAN DEFAULT FALSE,
    legal_basis TEXT,
    retention_period INTEGER -- in days
);

-- Set up Row Level Security (RLS) for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create functions to keep profiles table in sync with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, last_login_at)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.created_at, NEW.last_sign_in_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to call handle_new_user function on new auth.users inserts
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profiles table when auth.users is updated
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    email = NEW.email,
    full_name = NEW.raw_user_meta_data->>'name',
    last_login_at = NEW.last_sign_in_at,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create trigger to call handle_user_update function on auth.users updates
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Create function to delete profiles table when auth.users is deleted
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Create trigger to call handle_user_delete function on auth.users deletes
CREATE TRIGGER on_auth_user_deleted
AFTER DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- Create the customer table, linking to the unified profiles table
CREATE TABLE IF NOT EXISTS public.customers (
    customer_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_type TEXT NOT NULL DEFAULT 'individual', -- 'individual', 'corporate'
    loyalty_score INTEGER DEFAULT 0,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Set up Row Level Security (RLS) for customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies for customers table
DROP POLICY IF EXISTS "Customers are viewable by authenticated users." ON public.customers;
CREATE POLICY "Customers are viewable by authenticated users." ON public.customers FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert their own customer record." ON public.customers;
CREATE POLICY "Users can insert their own customer record." ON public.customers FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can update own customer record." ON public.customers;
CREATE POLICY "Users can update own customer record." ON public.customers FOR UPDATE USING (auth.uid() = customer_id);

-- Create the corporate_customers table, linking to the unified profiles table
CREATE TABLE IF NOT EXISTS public.corporate_customers (
    corporate_customer_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_registration_number TEXT UNIQUE NOT NULL,
    industry TEXT,
    contact_person_id UUID REFERENCES public.profiles(id), -- Link to a profile that is the main contact
    billing_address JSONB,
    tax_information JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for corporate_customers table
ALTER TABLE public.corporate_customers ENABLE ROW LEVEL SECURITY;

-- Policies for corporate_customers table
DROP POLICY IF EXISTS "Corporate customers are viewable by authenticated users." ON public.corporate_customers;
CREATE POLICY "Corporate customers are viewable by authenticated users." ON public.corporate_customers FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert their own corporate customer record." ON public.corporate_customers;
CREATE POLICY "Users can insert their own corporate customer record." ON public.corporate_customers FOR INSERT WITH CHECK (auth.uid() = corporate_customer_id);

DROP POLICY IF EXISTS "Users can update own corporate customer record." ON public.corporate_customers;
CREATE POLICY "Users can update own corporate customer record." ON public.corporate_customers FOR UPDATE USING (auth.uid() = corporate_customer_id);
\n-- End of the-shandi/sql/001_create_unified_users_and_profiles.sql --\n
-- Create audit_event_type enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_event_type_enum') THEN
        CREATE TYPE audit_event_type_enum AS ENUM (
            'user_login',
            'user_logout',
            'user_registration',
            'user_profile_update',
            'document_upload',
            'document_view',
            'document_sign',
            'document_workflow_start',
            'document_workflow_update',
            'document_workflow_complete',
            'kyc_workflow_start',
            'kyc_workflow_update',
            'kyc_workflow_complete',
            'payment_transaction',
            'system_config_update',
            'security_alert',
            'data_export',
            'data_import',
            'api_call',
            'error',
            'other'
        );
    END IF;
END $$;

-- Create audit_severity_enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_severity_enum') THEN
        CREATE TYPE audit_severity_enum AS ENUM (
            'info',
            'low',
            'medium',
            'high',
            'critical'
        );
    END IF;
END $$;

-- Create the unified audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type audit_event_type_enum NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who performed the action
    target_id TEXT, -- ID of the resource affected (e.g., document_id, user_id, workflow_id)
    target_table TEXT, -- Table name of the resource affected
    event_description TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb, -- Flexible JSONB for specific event details
    severity audit_severity_enum DEFAULT 'info'::audit_severity_enum,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Compliance-related fields
    legal_basis TEXT,
    consent_given BOOLEAN,
    retention_period INTEGER -- in days
);

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON public.audit_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON public.audit_logs (target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- Set up Row Level Security (RLS) for audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs table (only admins can view all, users can view their own)
DROP POLICY IF EXISTS "Admins can view all audit logs." ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs." ON public.audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

DROP POLICY IF EXISTS "Users can view their own audit logs." ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs." ON public.audit_logs FOR SELECT USING (auth.uid() = actor_id);

-- Create audit_config table for standardized audit configuration
CREATE TABLE IF NOT EXISTS public.audit_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type audit_event_type_enum UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    retention_policy_days INTEGER DEFAULT 365, -- Default retention for this event type
    alert_on_severity audit_severity_enum[] DEFAULT '{high,critical}'::audit_severity_enum[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up RLS for audit_config (only admins can manage)
ALTER TABLE public.audit_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage audit config." ON public.audit_config;
CREATE POLICY "Admins can manage audit config." ON public.audit_config FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));
\n-- End of the-shandi/sql/002_create_unified_audit_logging.sql --\n
\n-- End of the-shandi/sql/01_project_specific_schema.sql --\n
-- Create a unified user_roles enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM (
            'individual',
            'sme_user',
            'enterprise_user',
            'admin',
            'hospitality_staff',
            'customer',
            'corporate_customer'
        );
    END IF;
END $$;

-- Create the profiles table, linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    company_name TEXT,
    user_role user_role_enum DEFAULT 'individual'::user_role_enum,
    plan_type TEXT DEFAULT 'free', -- e.g., 'free', 'basic', 'premium', 'enterprise'
    status TEXT DEFAULT 'active', -- e.g., 'active', 'suspended', 'inactive', 'pending_verification'
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Additional fields from BuffrSign's User model
    preferences JSONB DEFAULT '{}'::jsonb,
    biometric_data JSONB DEFAULT '[]'::jsonb,
    behavioral_metrics JSONB DEFAULT '{}'::jsonb,
    subscription_expires_at TIMESTAMPTZ,
    -- Additional fields from BuffrLend's profiles
    first_name TEXT,
    last_name TEXT,
    -- Additional fields from The Shandi's BuffrHostUser (if applicable, linked via profiles)
    property_id INTEGER, -- Link to hospitality_property if applicable
    user_type_id INTEGER, -- Link to user_type if applicable
    permissions TEXT[] DEFAULT '{}'::TEXT[],
    -- KYC Information (from BuffrSign's UserRegistrationWithKYC)
    country_code TEXT,
    national_id_number TEXT,
    national_id_type TEXT,
    id_document_url TEXT,
    kyc_status TEXT DEFAULT 'pending', -- e.g., 'pending', 'verified', 'rejected'
    consent_given BOOLEAN DEFAULT FALSE,
    legal_basis TEXT,
    retention_period INTEGER -- in days
);

-- Set up Row Level Security (RLS) for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create functions to keep profiles table in sync with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, last_login_at)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.created_at, NEW.last_sign_in_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to call handle_new_user function on new auth.users inserts
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profiles table when auth.users is updated
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    email = NEW.email,
    full_name = NEW.raw_user_meta_data->>'name',
    last_login_at = NEW.last_sign_in_at,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create trigger to call handle_user_update function on auth.users updates
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Create function to delete profiles table when auth.users is deleted
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Create trigger to call handle_user_delete function on auth.users deletes
CREATE TRIGGER on_auth_user_deleted
AFTER DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- Create the customer table, linking to the unified profiles table
CREATE TABLE IF NOT EXISTS public.customers (
    customer_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_type TEXT NOT NULL DEFAULT 'individual', -- 'individual', 'corporate'
    loyalty_score INTEGER DEFAULT 0,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Set up Row Level Security (RLS) for customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies for customers table
DROP POLICY IF EXISTS "Customers are viewable by authenticated users." ON public.customers;
CREATE POLICY "Customers are viewable by authenticated users." ON public.customers FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert their own customer record." ON public.customers;
CREATE POLICY "Users can insert their own customer record." ON public.customers FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can update own customer record." ON public.customers;
CREATE POLICY "Users can update own customer record." ON public.customers FOR UPDATE USING (auth.uid() = customer_id);

-- Create the corporate_customers table, linking to the unified profiles table
CREATE TABLE IF NOT EXISTS public.corporate_customers (
    corporate_customer_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_registration_number TEXT UNIQUE NOT NULL,
    industry TEXT,
    contact_person_id UUID REFERENCES public.profiles(id), -- Link to a profile that is the main contact
    billing_address JSONB,
    tax_information JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for corporate_customers table
ALTER TABLE public.corporate_customers ENABLE ROW LEVEL SECURITY;

-- Policies for corporate_customers table
DROP POLICY IF EXISTS "Corporate customers are viewable by authenticated users." ON public.corporate_customers;
CREATE POLICY "Corporate customers are viewable by authenticated users." ON public.corporate_customers FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert their own corporate customer record." ON public.corporate_customers;
CREATE POLICY "Users can insert their own corporate customer record." ON public.corporate_customers FOR INSERT WITH CHECK (auth.uid() = corporate_customer_id);

DROP POLICY IF EXISTS "Users can update own corporate customer record." ON public.corporate_customers;
CREATE POLICY "Users can update own corporate customer record." ON public.corporate_customers FOR UPDATE USING (auth.uid() = corporate_customer_id);
\n-- End of the-shandi/sql/001_create_unified_users_and_profiles.sql --\n
-- Create audit_event_type enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_event_type_enum') THEN
        CREATE TYPE audit_event_type_enum AS ENUM (
            'user_login',
            'user_logout',
            'user_registration',
            'user_profile_update',
            'document_upload',
            'document_view',
            'document_sign',
            'document_workflow_start',
            'document_workflow_update',
            'document_workflow_complete',
            'kyc_workflow_start',
            'kyc_workflow_update',
            'kyc_workflow_complete',
            'payment_transaction',
            'system_config_update',
            'security_alert',
            'data_export',
            'data_import',
            'api_call',
            'error',
            'other'
        );
    END IF;
END $$;

-- Create audit_severity_enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_severity_enum') THEN
        CREATE TYPE audit_severity_enum AS ENUM (
            'info',
            'low',
            'medium',
            'high',
            'critical'
        );
    END IF;
END $$;

-- Create the unified audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type audit_event_type_enum NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who performed the action
    target_id TEXT, -- ID of the resource affected (e.g., document_id, user_id, workflow_id)
    target_table TEXT, -- Table name of the resource affected
    event_description TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb, -- Flexible JSONB for specific event details
    severity audit_severity_enum DEFAULT 'info'::audit_severity_enum,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Compliance-related fields
    legal_basis TEXT,
    consent_given BOOLEAN,
    retention_period INTEGER -- in days
);

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON public.audit_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON public.audit_logs (target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- Set up Row Level Security (RLS) for audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs table (only admins can view all, users can view their own)
DROP POLICY IF EXISTS "Admins can view all audit logs." ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs." ON public.audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

DROP POLICY IF EXISTS "Users can view their own audit logs." ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs." ON public.audit_logs FOR SELECT USING (auth.uid() = actor_id);

-- Create audit_config table for standardized audit configuration
CREATE TABLE IF NOT EXISTS public.audit_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type audit_event_type_enum UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    retention_policy_days INTEGER DEFAULT 365, -- Default retention for this event type
    alert_on_severity audit_severity_enum[] DEFAULT '{high,critical}'::audit_severity_enum[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up RLS for audit_config (only admins can manage)
ALTER TABLE public.audit_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage audit config." ON public.audit_config;
CREATE POLICY "Admins can manage audit config." ON public.audit_config FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));
\n-- End of the-shandi/sql/002_create_unified_audit_logging.sql --\n
-- Create rate_limit_type enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rate_limit_type_enum') THEN
        CREATE TYPE rate_limit_type_enum AS ENUM (
            'ip_address',
            'user_id',
            'api_key',
            'endpoint',
            'global'
        );
    END IF;
END $$;

-- Create the unified rate_limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- e.g., 'login_attempts', 'api_requests_per_minute'
    limit_value INTEGER NOT NULL, -- Max requests allowed
    time_window_seconds INTEGER NOT NULL, -- Time window in seconds
    type rate_limit_type_enum NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the unified rate_limit_status table to track current usage
CREATE TABLE IF NOT EXISTS public.rate_limit_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_limit_id UUID REFERENCES public.rate_limits(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL, -- IP address, user_id, API key, or endpoint path
    current_requests INTEGER DEFAULT 0,
    last_reset_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (rate_limit_id, identifier)
);

-- Create the unified rate_limiting_exemptions table
CREATE TABLE IF NOT EXISTS public.rate_limiting_exemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_limit_id UUID REFERENCES public.rate_limits(id) ON DELETE CASCADE,
    exempt_identifier TEXT NOT NULL, -- IP address, user_id, API key, etc.
    exemption_reason TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (rate_limit_id, exempt_identifier)
);

-- Set up RLS for all new tables
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limits" ON public.rate_limits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limits" ON public.rate_limits FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

ALTER TABLE public.rate_limit_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limit status" ON public.rate_limit_status FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limit status" ON public.rate_limit_status FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

ALTER TABLE public.rate_limiting_exemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limiting exemptions" ON public.rate_limiting_exemptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limiting exemptions" ON public.rate_limiting_exemptions FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));
\n-- End of the-shandi/sql/004_create_unified_rate_limiting.sql --\n
-- Adumo Online Payment Gateway Integrations
-- Tables for managing Adumo Online configurations, transactions, and tokenized cards.

-- Adumo Configuration Table
CREATE TABLE adumo_configs (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE, -- Optional, for Buffr Host
    project_name VARCHAR(100) NOT NULL, -- e.g., 'buffrlend', 'buffrsign', 'buffrhost'
    merchant_id VARCHAR(255) NOT NULL,
    application_id VARCHAR(255) NOT NULL,
    jwt_secret TEXT NOT NULL,
    test_mode BOOLEAN DEFAULT TRUE,
    live_url TEXT,
    test_url TEXT,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Adumo Transactions Table
CREATE TABLE adumo_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES adumo_configs(config_id),
    user_id UUID REFERENCES profiles(id), -- Link to unified profiles table
    merchant_reference VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'NAD',
    transaction_index UUID, -- Adumo's unique transaction identifier
    status VARCHAR(50) NOT NULL, -- e.g., 'APPROVED', 'DECLINED', 'PENDING'
    result INTEGER, -- Adumo's _RESULT code (0=success, -1=failed, 1=warning)
    error_code VARCHAR(10),
    error_message TEXT,
    bank_error_code VARCHAR(10),
    bank_error_message TEXT,
    payment_method VARCHAR(50),
    acquirer_datetime TIMESTAMP WITH TIME ZONE,
    redirect_successful_url TEXT,
    redirect_failed_url TEXT,
    request_payload JSONB,
    response_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Adumo Tokenized Cards (for 1Click payments)
CREATE TABLE adumo_tokenized_cards (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES adumo_configs(config_id),
    user_id UUID REFERENCES profiles(id), -- Link to unified profiles table
    puid UUID NOT NULL UNIQUE, -- Adumo's Profile Unique Identifier
    card_type VARCHAR(50),
    pan_hashed VARCHAR(16), -- First six and last four digits
    card_country VARCHAR(50),
    expiry_date DATE, -- Stored as month/year, but can be parsed to date
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Adumo Webhook Logs
CREATE TABLE adumo_webhook_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES adumo_configs(config_id),
    transaction_id UUID REFERENCES adumo_transactions(transaction_id),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) -- e.g., 'processed', 'failed', 'pending'
);

-- Indexes for performance
CREATE INDEX idx_adumo_transactions_user ON adumo_transactions(user_id);
CREATE INDEX idx_adumo_transactions_merchant_ref ON adumo_transactions(merchant_reference);
CREATE INDEX idx_adumo_transactions_status ON adumo_transactions(status);
CREATE INDEX idx_adumo_tokenized_cards_user ON adumo_tokenized_cards(user_id);
CREATE INDEX idx_adumo_webhook_logs_transaction ON adumo_webhook_logs(transaction_id);

-- Add updated_at triggers (assuming update_updated_at_column() function exists)
CREATE TRIGGER update_adumo_configs_updated_at
BEFORE UPDATE ON adumo_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adumo_transactions_updated_at
BEFORE UPDATE ON adumo_transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adumo_tokenized_cards_updated_at
BEFORE UPDATE ON adumo_tokenized_cards
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\n-- End of the-shandi/sql/18_adumo_integrations.sql --\n
-- Create a unified user_roles enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM (
            'individual',
            'sme_user',
            'enterprise_user',
            'admin',
            'hospitality_staff',
            'customer',
            'corporate_customer'
        );
    END IF;
END $$;

-- Create the profiles table, linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    company_name TEXT,
    user_role user_role_enum DEFAULT 'individual'::user_role_enum,
    plan_type TEXT DEFAULT 'free', -- e.g., 'free', 'basic', 'premium', 'enterprise'
    status TEXT DEFAULT 'active', -- e.g., 'active', 'suspended', 'inactive', 'pending_verification'
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Additional fields from BuffrSign's User model
    preferences JSONB DEFAULT '{}'::jsonb,
    biometric_data JSONB DEFAULT '[]'::jsonb,
    behavioral_metrics JSONB DEFAULT '{}'::jsonb,
    subscription_expires_at TIMESTAMPTZ,
    -- Additional fields from BuffrLend's profiles
    first_name TEXT,
    last_name TEXT,
    -- Additional fields from The Shandi's BuffrHostUser (if applicable, linked via profiles)
    property_id INTEGER, -- Link to hospitality_property if applicable
    user_type_id INTEGER, -- Link to user_type if applicable
    permissions TEXT[] DEFAULT '{}'::TEXT[],
    -- KYC Information (from BuffrSign's UserRegistrationWithKYC)
    country_code TEXT,
    national_id_number TEXT,
    national_id_type TEXT,
    id_document_url TEXT,
    kyc_status TEXT DEFAULT 'pending', -- e.g., 'pending', 'verified', 'rejected'
    consent_given BOOLEAN DEFAULT FALSE,
    legal_basis TEXT,
    retention_period INTEGER -- in days
);

-- Set up Row Level Security (RLS) for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create functions to keep profiles table in sync with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, last_login_at)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.created_at, NEW.last_sign_in_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to call handle_new_user function on new auth.users inserts
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profiles table when auth.users is updated
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    email = NEW.email,
    full_name = NEW.raw_user_meta_data->>'name',
    last_login_at = NEW.last_sign_in_at,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create trigger to call handle_user_update function on auth.users updates
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Create function to delete profiles table when auth.users is deleted
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Create trigger to call handle_user_delete function on auth.users deletes
CREATE TRIGGER on_auth_user_deleted
AFTER DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- Create the customer table, linking to the unified profiles table
CREATE TABLE IF NOT EXISTS public.customers (
    customer_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_type TEXT NOT NULL DEFAULT 'individual', -- 'individual', 'corporate'
    loyalty_score INTEGER DEFAULT 0,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Set up Row Level Security (RLS) for customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies for customers table
DROP POLICY IF EXISTS "Customers are viewable by authenticated users." ON public.customers;
CREATE POLICY "Customers are viewable by authenticated users." ON public.customers FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert their own customer record." ON public.customers;
CREATE POLICY "Users can insert their own customer record." ON public.customers FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can update own customer record." ON public.customers;
CREATE POLICY "Users can update own customer record." ON public.customers FOR UPDATE USING (auth.uid() = customer_id);

-- Create the corporate_customers table, linking to the unified profiles table
CREATE TABLE IF NOT EXISTS public.corporate_customers (
    corporate_customer_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_registration_number TEXT UNIQUE NOT NULL,
    industry TEXT,
    contact_person_id UUID REFERENCES public.profiles(id), -- Link to a profile that is the main contact
    billing_address JSONB,
    tax_information JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for corporate_customers table
ALTER TABLE public.corporate_customers ENABLE ROW LEVEL SECURITY;

-- Policies for corporate_customers table
DROP POLICY IF EXISTS "Corporate customers are viewable by authenticated users." ON public.corporate_customers;
CREATE POLICY "Corporate customers are viewable by authenticated users." ON public.corporate_customers FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert their own corporate customer record." ON public.corporate_customers;
CREATE POLICY "Users can insert their own corporate customer record." ON public.corporate_customers FOR INSERT WITH CHECK (auth.uid() = corporate_customer_id);

DROP POLICY IF EXISTS "Users can update own corporate customer record." ON public.corporate_customers;
CREATE POLICY "Users can update own corporate customer record." ON public.corporate_customers FOR UPDATE USING (auth.uid() = corporate_customer_id);
\n-- End of the-shandi/sql/001_create_unified_users_and_profiles.sql --\n
-- Create audit_event_type enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_event_type_enum') THEN
        CREATE TYPE audit_event_type_enum AS ENUM (
            'user_login',
            'user_logout',
            'user_registration',
            'user_profile_update',
            'document_upload',
            'document_view',
            'document_sign',
            'document_workflow_start',
            'document_workflow_update',
            'document_workflow_complete',
            'kyc_workflow_start',
            'kyc_workflow_update',
            'kyc_workflow_complete',
            'payment_transaction',
            'system_config_update',
            'security_alert',
            'data_export',
            'data_import',
            'api_call',
            'error',
            'other'
        );
    END IF;
END $$;

-- Create audit_severity_enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_severity_enum') THEN
        CREATE TYPE audit_severity_enum AS ENUM (
            'info',
            'low',
            'medium',
            'high',
            'critical'
        );
    END IF;
END $$;

-- Create the unified audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type audit_event_type_enum NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who performed the action
    target_id TEXT, -- ID of the resource affected (e.g., document_id, user_id, workflow_id)
    target_table TEXT, -- Table name of the resource affected
    event_description TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb, -- Flexible JSONB for specific event details
    severity audit_severity_enum DEFAULT 'info'::audit_severity_enum,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Compliance-related fields
    legal_basis TEXT,
    consent_given BOOLEAN,
    retention_period INTEGER -- in days
);

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON public.audit_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON public.audit_logs (target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- Set up Row Level Security (RLS) for audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs table (only admins can view all, users can view their own)
DROP POLICY IF EXISTS "Admins can view all audit logs." ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs." ON public.audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

DROP POLICY IF EXISTS "Users can view their own audit logs." ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs." ON public.audit_logs FOR SELECT USING (auth.uid() = actor_id);

-- Create audit_config table for standardized audit configuration
CREATE TABLE IF NOT EXISTS public.audit_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type audit_event_type_enum UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    retention_policy_days INTEGER DEFAULT 365, -- Default retention for this event type
    alert_on_severity audit_severity_enum[] DEFAULT '{high,critical}'::audit_severity_enum[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up RLS for audit_config (only admins can manage)
ALTER TABLE public.audit_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage audit config." ON public.audit_config;
CREATE POLICY "Admins can manage audit config." ON public.audit_config FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));
\n-- End of the-shandi/sql/002_create_unified_audit_logging.sql --\n
-- RealPay Payment Gateway Integrations
-- Tables for managing RealPay configurations, mandates, instalments, and callbacks.

-- RealPay Configuration Table
CREATE TABLE realpay_configs (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE, -- Optional, for Buffr Host
    project_name VARCHAR(100) NOT NULL, -- e.g., 'buffrlend', 'buffrsign', 'buffrhost'
    api_key TEXT NOT NULL,
    hmac_secret TEXT NOT NULL,
    beneficiary_user VARCHAR(255),
    test_mode BOOLEAN DEFAULT TRUE,
    live_callback_url TEXT,
    test_callback_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- RealPay Mandates Table (for Debicheck products)
CREATE TABLE realpay_mandates (
    mandate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES realpay_configs(config_id),
    customer_id UUID REFERENCES profiles(id), -- Link to unified profiles table
    mandate_reference VARCHAR(255) UNIQUE NOT NULL,
    bank_account_id UUID REFERENCES banking_details(id), -- Link to unified banking_details
    mandate_status VARCHAR(50) NOT NULL, -- e.g., 'ACTIVE', 'CANCELLED', 'PENDING'
    mandate_type VARCHAR(50), -- e.g., 'DEBICHECK', 'EFT'
    start_date DATE,
    end_date DATE,
    amount DECIMAL(10,2), -- Max amount for variable mandates
    frequency VARCHAR(50), -- e.g., 'MONTHLY', 'WEEKLY'
    realpay_mandate_id VARCHAR(255), -- RealPay's internal mandate ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- RealPay Instalments Table
CREATE TABLE realpay_instalments (
    instalment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mandate_id UUID REFERENCES realpay_mandates(mandate_id),
    instalment_reference VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    collection_date DATE NOT NULL,
    instalment_status VARCHAR(50) NOT NULL, -- e.g., 'SUCCESS', 'FAILED', 'PENDING'
    realpay_instalment_id VARCHAR(255), -- RealPay's internal instalment ID
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- RealPay Callback Logs (Webhooks)
CREATE TABLE realpay_callbacks (
    callback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES realpay_configs(config_id),
    mandate_id UUID REFERENCES realpay_mandates(mandate_id),
    instalment_id UUID REFERENCES realpay_instalments(instalment_id),
    x_callback_header VARCHAR(100) NOT NULL, -- e.g., 'MANDATE', 'INSTALMENT'
    x_hmac_header TEXT NOT NULL,
    x_beneficiary_user_header VARCHAR(255),
    payload JSONB NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) -- e.g., 'processed', 'failed', 'pending'
);

-- RealPay Pricing Configuration Table
CREATE TABLE realpay_pricing_configs (
    pricing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES realpay_configs(config_id),
    service_type VARCHAR(100) NOT NULL, -- e.g., 'EnDO', 'Payouts', 'VAS'
    fee_type VARCHAR(100) NOT NULL, -- e.g., 'monthly_fee', 'transaction_fee', 'once_off_fee'
    min_transactions INTEGER,
    max_transactions INTEGER,
    amount DECIMAL(10,2),
    percentage DECIMAL(5,4),
    unit_cost DECIMAL(10,2),
    description TEXT,
    effective_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_realpay_mandates_customer ON realpay_mandates(customer_id);
CREATE INDEX idx_realpay_mandates_reference ON realpay_mandates(mandate_reference);
CREATE INDEX idx_realpay_instalments_mandate ON realpay_instalments(mandate_id);
CREATE INDEX idx_realpay_instalments_reference ON realpay_instalments(instalment_reference);
CREATE INDEX idx_realpay_callbacks_mandate ON realpay_callbacks(mandate_id);
CREATE INDEX idx_realpay_callbacks_instalment ON realpay_callbacks(instalment_id);

-- Add updated_at triggers (assuming update_updated_at_column() function exists)
CREATE TRIGGER update_realpay_configs_updated_at
BEFORE UPDATE ON realpay_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realpay_mandates_updated_at
BEFORE UPDATE ON realpay_mandates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realpay_instalments_updated_at
BEFORE UPDATE ON realpay_instalments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realpay_pricing_configs_updated_at
BEFORE UPDATE ON realpay_pricing_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\n-- End of the-shandi/sql/19_realpay_integrations.sql --\n
-- Buffr API Integrations
-- Tables for managing cross-project API integrations and configurations.

-- Buffr API Integration Configurations
CREATE TABLE buffr_api_integrations (
    integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_project VARCHAR(100) NOT NULL, -- e.g., 'buffrlend', 'buffrsign', 'buffrhost'
    target_project VARCHAR(100) NOT NULL, -- e.g., 'buffrlend', 'buffrsign', 'buffrhost'
    integration_name VARCHAR(255) NOT NULL, -- e.g., 'BuffrLend_to_BuffrSign_LoanSigning'
    api_base_url TEXT NOT NULL,
    api_key_encrypted TEXT, -- Encrypted API key for authentication
    api_key_hash TEXT, -- Hash of the API key for verification
    is_active BOOLEAN DEFAULT TRUE,
    configuration JSONB, -- JSONB field for flexible configuration parameters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(source_project, target_project, integration_name)
);

-- Buffr API Integration Logs (for auditing cross-project calls)
CREATE TABLE buffr_api_integration_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID REFERENCES buffr_api_integrations(integration_id),
    request_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    request_method VARCHAR(10) NOT NULL, -- e.g., 'GET', 'POST'
    request_endpoint TEXT NOT NULL,
    request_payload JSONB,
    response_timestamp TIMESTAMP WITH TIME ZONE,
    response_status_code INTEGER,
    response_payload JSONB,
    error_message TEXT,
    user_id UUID REFERENCES profiles(id), -- User who initiated the action, if applicable
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_buffr_api_integrations_source_target ON buffr_api_integrations(source_project, target_project);
CREATE INDEX idx_buffr_api_integration_logs_integration ON buffr_api_integration_logs(integration_id);
CREATE INDEX idx_buffr_api_integration_logs_user ON buffr_api_integration_logs(user_id);

-- Add updated_at triggers (assuming update_updated_at_column() function exists)
CREATE TRIGGER update_buffr_api_integrations_updated_at
BEFORE UPDATE ON buffr_api_integrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\n-- End of the-shandi/sql/20_buffr_api_integrations.sql --\n
-- Create rate_limit_type enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rate_limit_type_enum') THEN
        CREATE TYPE rate_limit_type_enum AS ENUM (
            'ip_address',
            'user_id',
            'api_key',
            'endpoint',
            'global'
        );
    END IF;
END $$;

-- Create the unified rate_limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- e.g., 'login_attempts', 'api_requests_per_minute'
    limit_value INTEGER NOT NULL, -- Max requests allowed
    time_window_seconds INTEGER NOT NULL, -- Time window in seconds
    type rate_limit_type_enum NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the unified rate_limit_status table to track current usage
CREATE TABLE IF NOT EXISTS public.rate_limit_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_limit_id UUID REFERENCES public.rate_limits(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL, -- IP address, user_id, API key, or endpoint path
    current_requests INTEGER DEFAULT 0,
    last_reset_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (rate_limit_id, identifier)
);

-- Create the unified rate_limiting_exemptions table
CREATE TABLE IF NOT EXISTS public.rate_limiting_exemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rate_limit_id UUID REFERENCES public.rate_limits(id) ON DELETE CASCADE,
    exempt_identifier TEXT NOT NULL, -- IP address, user_id, API key, etc.
    exemption_reason TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (rate_limit_id, exempt_identifier)
);

-- Set up RLS for all new tables
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limits" ON public.rate_limits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limits" ON public.rate_limits FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

ALTER TABLE public.rate_limit_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limit status" ON public.rate_limit_status FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limit status" ON public.rate_limit_status FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

ALTER TABLE public.rate_limiting_exemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read rate limiting exemptions" ON public.rate_limiting_exemptions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage rate limiting exemptions" ON public.rate_limiting_exemptions FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));
\n-- End of the-shandi/sql/004_create_unified_rate_limiting.sql --\n
-- Adumo Online Payment Gateway Integrations
-- Tables for managing Adumo Online configurations, transactions, and tokenized cards.

-- Adumo Configuration Table
CREATE TABLE adumo_configs (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE, -- Optional, for Buffr Host
    project_name VARCHAR(100) NOT NULL, -- e.g., 'buffrlend', 'buffrsign', 'buffrhost'
    merchant_id VARCHAR(255) NOT NULL,
    application_id VARCHAR(255) NOT NULL,
    jwt_secret TEXT NOT NULL,
    test_mode BOOLEAN DEFAULT TRUE,
    live_url TEXT,
    test_url TEXT,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Adumo Transactions Table
CREATE TABLE adumo_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES adumo_configs(config_id),
    user_id UUID REFERENCES profiles(id), -- Link to unified profiles table
    merchant_reference VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'NAD',
    transaction_index UUID, -- Adumo's unique transaction identifier
    status VARCHAR(50) NOT NULL, -- e.g., 'APPROVED', 'DECLINED', 'PENDING'
    result INTEGER, -- Adumo's _RESULT code (0=success, -1=failed, 1=warning)
    error_code VARCHAR(10),
    error_message TEXT,
    bank_error_code VARCHAR(10),
    bank_error_message TEXT,
    payment_method VARCHAR(50),
    acquirer_datetime TIMESTAMP WITH TIME ZONE,
    redirect_successful_url TEXT,
    redirect_failed_url TEXT,
    request_payload JSONB,
    response_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Adumo Tokenized Cards (for 1Click payments)
CREATE TABLE adumo_tokenized_cards (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES adumo_configs(config_id),
    user_id UUID REFERENCES profiles(id), -- Link to unified profiles table
    puid UUID NOT NULL UNIQUE, -- Adumo's Profile Unique Identifier
    card_type VARCHAR(50),
    pan_hashed VARCHAR(16), -- First six and last four digits
    card_country VARCHAR(50),
    expiry_date DATE, -- Stored as month/year, but can be parsed to date
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Adumo Webhook Logs
CREATE TABLE adumo_webhook_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES adumo_configs(config_id),
    transaction_id UUID REFERENCES adumo_transactions(transaction_id),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) -- e.g., 'processed', 'failed', 'pending'
);

-- Indexes for performance
CREATE INDEX idx_adumo_transactions_user ON adumo_transactions(user_id);
CREATE INDEX idx_adumo_transactions_merchant_ref ON adumo_transactions(merchant_reference);
CREATE INDEX idx_adumo_transactions_status ON adumo_transactions(status);
CREATE INDEX idx_adumo_tokenized_cards_user ON adumo_tokenized_cards(user_id);
CREATE INDEX idx_adumo_webhook_logs_transaction ON adumo_webhook_logs(transaction_id);

-- Add updated_at triggers (assuming update_updated_at_column() function exists)
CREATE TRIGGER update_adumo_configs_updated_at
BEFORE UPDATE ON adumo_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adumo_transactions_updated_at
BEFORE UPDATE ON adumo_transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adumo_tokenized_cards_updated_at
BEFORE UPDATE ON adumo_tokenized_cards
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\n-- End of the-shandi/sql/18_adumo_integrations.sql --\n
-- Create a unified user_roles enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM (
            'individual',
            'sme_user',
            'enterprise_user',
            'admin',
            'hospitality_staff',
            'customer',
            'corporate_customer'
        );
    END IF;
END $$;

-- Create the profiles table, linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    company_name TEXT,
    user_role user_role_enum DEFAULT 'individual'::user_role_enum,
    plan_type TEXT DEFAULT 'free', -- e.g., 'free', 'basic', 'premium', 'enterprise'
    status TEXT DEFAULT 'active', -- e.g., 'active', 'suspended', 'inactive', 'pending_verification'
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Additional fields from BuffrSign's User model
    preferences JSONB DEFAULT '{}'::jsonb,
    biometric_data JSONB DEFAULT '[]'::jsonb,
    behavioral_metrics JSONB DEFAULT '{}'::jsonb,
    subscription_expires_at TIMESTAMPTZ,
    -- Additional fields from BuffrLend's profiles
    first_name TEXT,
    last_name TEXT,
    -- Additional fields from The Shandi's BuffrHostUser (if applicable, linked via profiles)
    property_id INTEGER, -- Link to hospitality_property if applicable
    user_type_id INTEGER, -- Link to user_type if applicable
    permissions TEXT[] DEFAULT '{}'::TEXT[],
    -- KYC Information (from BuffrSign's UserRegistrationWithKYC)
    country_code TEXT,
    national_id_number TEXT,
    national_id_type TEXT,
    id_document_url TEXT,
    kyc_status TEXT DEFAULT 'pending', -- e.g., 'pending', 'verified', 'rejected'
    consent_given BOOLEAN DEFAULT FALSE,
    legal_basis TEXT,
    retention_period INTEGER -- in days
);

-- Set up Row Level Security (RLS) for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create functions to keep profiles table in sync with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, last_login_at)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.created_at, NEW.last_sign_in_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to call handle_new_user function on new auth.users inserts
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profiles table when auth.users is updated
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    email = NEW.email,
    full_name = NEW.raw_user_meta_data->>'name',
    last_login_at = NEW.last_sign_in_at,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create trigger to call handle_user_update function on auth.users updates
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Create function to delete profiles table when auth.users is deleted
CREATE OR REPLACE FUNCTION public.handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Create trigger to call handle_user_delete function on auth.users deletes
CREATE TRIGGER on_auth_user_deleted
AFTER DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_delete();

-- Create the customer table, linking to the unified profiles table
CREATE TABLE IF NOT EXISTS public.customers (
    customer_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_type TEXT NOT NULL DEFAULT 'individual', -- 'individual', 'corporate'
    loyalty_score INTEGER DEFAULT 0,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Set up Row Level Security (RLS) for customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies for customers table
DROP POLICY IF EXISTS "Customers are viewable by authenticated users." ON public.customers;
CREATE POLICY "Customers are viewable by authenticated users." ON public.customers FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert their own customer record." ON public.customers;
CREATE POLICY "Users can insert their own customer record." ON public.customers FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can update own customer record." ON public.customers;
CREATE POLICY "Users can update own customer record." ON public.customers FOR UPDATE USING (auth.uid() = customer_id);

-- Create the corporate_customers table, linking to the unified profiles table
CREATE TABLE IF NOT EXISTS public.corporate_customers (
    corporate_customer_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_registration_number TEXT UNIQUE NOT NULL,
    industry TEXT,
    contact_person_id UUID REFERENCES public.profiles(id), -- Link to a profile that is the main contact
    billing_address JSONB,
    tax_information JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for corporate_customers table
ALTER TABLE public.corporate_customers ENABLE ROW LEVEL SECURITY;

-- Policies for corporate_customers table
DROP POLICY IF EXISTS "Corporate customers are viewable by authenticated users." ON public.corporate_customers;
CREATE POLICY "Corporate customers are viewable by authenticated users." ON public.corporate_customers FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert their own corporate customer record." ON public.corporate_customers;
CREATE POLICY "Users can insert their own corporate customer record." ON public.corporate_customers FOR INSERT WITH CHECK (auth.uid() = corporate_customer_id);

DROP POLICY IF EXISTS "Users can update own corporate customer record." ON public.corporate_customers;
CREATE POLICY "Users can update own corporate customer record." ON public.corporate_customers FOR UPDATE USING (auth.uid() = corporate_customer_id);
\n-- End of the-shandi/sql/001_create_unified_users_and_profiles.sql --\n
-- Create audit_event_type enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_event_type_enum') THEN
        CREATE TYPE audit_event_type_enum AS ENUM (
            'user_login',
            'user_logout',
            'user_registration',
            'user_profile_update',
            'document_upload',
            'document_view',
            'document_sign',
            'document_workflow_start',
            'document_workflow_update',
            'document_workflow_complete',
            'kyc_workflow_start',
            'kyc_workflow_update',
            'kyc_workflow_complete',
            'payment_transaction',
            'system_config_update',
            'security_alert',
            'data_export',
            'data_import',
            'api_call',
            'error',
            'other'
        );
    END IF;
END $$;

-- Create audit_severity_enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_severity_enum') THEN
        CREATE TYPE audit_severity_enum AS ENUM (
            'info',
            'low',
            'medium',
            'high',
            'critical'
        );
    END IF;
END $$;

-- Create the unified audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type audit_event_type_enum NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who performed the action
    target_id TEXT, -- ID of the resource affected (e.g., document_id, user_id, workflow_id)
    target_table TEXT, -- Table name of the resource affected
    event_description TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb, -- Flexible JSONB for specific event details
    severity audit_severity_enum DEFAULT 'info'::audit_severity_enum,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Compliance-related fields
    legal_basis TEXT,
    consent_given BOOLEAN,
    retention_period INTEGER -- in days
);

-- Add index for faster querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON public.audit_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON public.audit_logs (target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- Set up Row Level Security (RLS) for audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs table (only admins can view all, users can view their own)
DROP POLICY IF EXISTS "Admins can view all audit logs." ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs." ON public.audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));

DROP POLICY IF EXISTS "Users can view their own audit logs." ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs." ON public.audit_logs FOR SELECT USING (auth.uid() = actor_id);

-- Create audit_config table for standardized audit configuration
CREATE TABLE IF NOT EXISTS public.audit_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type audit_event_type_enum UNIQUE NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    retention_policy_days INTEGER DEFAULT 365, -- Default retention for this event type
    alert_on_severity audit_severity_enum[] DEFAULT '{high,critical}'::audit_severity_enum[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up RLS for audit_config (only admins can manage)
ALTER TABLE public.audit_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage audit config." ON public.audit_config;
CREATE POLICY "Admins can manage audit config." ON public.audit_config FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin'));
\n-- End of the-shandi/sql/002_create_unified_audit_logging.sql --\n
-- RealPay Payment Gateway Integrations
-- Tables for managing RealPay configurations, mandates, instalments, and callbacks.

-- RealPay Configuration Table
CREATE TABLE realpay_configs (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE, -- Optional, for Buffr Host
    project_name VARCHAR(100) NOT NULL, -- e.g., 'buffrlend', 'buffrsign', 'buffrhost'
    api_key TEXT NOT NULL,
    hmac_secret TEXT NOT NULL,
    beneficiary_user VARCHAR(255),
    test_mode BOOLEAN DEFAULT TRUE,
    live_callback_url TEXT,
    test_callback_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- RealPay Mandates Table (for Debicheck products)
CREATE TABLE realpay_mandates (
    mandate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES realpay_configs(config_id),
    customer_id UUID REFERENCES profiles(id), -- Link to unified profiles table
    mandate_reference VARCHAR(255) UNIQUE NOT NULL,
    bank_account_id UUID REFERENCES banking_details(id), -- Link to unified banking_details
    mandate_status VARCHAR(50) NOT NULL, -- e.g., 'ACTIVE', 'CANCELLED', 'PENDING'
    mandate_type VARCHAR(50), -- e.g., 'DEBICHECK', 'EFT'
    start_date DATE,
    end_date DATE,
    amount DECIMAL(10,2), -- Max amount for variable mandates
    frequency VARCHAR(50), -- e.g., 'MONTHLY', 'WEEKLY'
    realpay_mandate_id VARCHAR(255), -- RealPay's internal mandate ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- RealPay Instalments Table
CREATE TABLE realpay_instalments (
    instalment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mandate_id UUID REFERENCES realpay_mandates(mandate_id),
    instalment_reference VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    collection_date DATE NOT NULL,
    instalment_status VARCHAR(50) NOT NULL, -- e.g., 'SUCCESS', 'FAILED', 'PENDING'
    realpay_instalment_id VARCHAR(255), -- RealPay's internal instalment ID
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- RealPay Callback Logs (Webhooks)
CREATE TABLE realpay_callbacks (
    callback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES realpay_configs(config_id),
    mandate_id UUID REFERENCES realpay_mandates(mandate_id),
    instalment_id UUID REFERENCES realpay_instalments(instalment_id),
    x_callback_header VARCHAR(100) NOT NULL, -- e.g., 'MANDATE', 'INSTALMENT'
    x_hmac_header TEXT NOT NULL,
    x_beneficiary_user_header VARCHAR(255),
    payload JSONB NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) -- e.g., 'processed', 'failed', 'pending'
);

-- RealPay Pricing Configuration Table
CREATE TABLE realpay_pricing_configs (
    pricing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES realpay_configs(config_id),
    service_type VARCHAR(100) NOT NULL, -- e.g., 'EnDO', 'Payouts', 'VAS'
    fee_type VARCHAR(100) NOT NULL, -- e.g., 'monthly_fee', 'transaction_fee', 'once_off_fee'
    min_transactions INTEGER,
    max_transactions INTEGER,
    amount DECIMAL(10,2),
    percentage DECIMAL(5,4),
    unit_cost DECIMAL(10,2),
    description TEXT,
    effective_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_realpay_mandates_customer ON realpay_mandates(customer_id);
CREATE INDEX idx_realpay_mandates_reference ON realpay_mandates(mandate_reference);
CREATE INDEX idx_realpay_instalments_mandate ON realpay_instalments(mandate_id);
CREATE INDEX idx_realpay_instalments_reference ON realpay_instalments(instalment_reference);
CREATE INDEX idx_realpay_callbacks_mandate ON realpay_callbacks(mandate_id);
CREATE INDEX idx_realpay_callbacks_instalment ON realpay_callbacks(instalment_id);

-- Add updated_at triggers (assuming update_updated_at_column() function exists)
CREATE TRIGGER update_realpay_configs_updated_at
BEFORE UPDATE ON realpay_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realpay_mandates_updated_at
BEFORE UPDATE ON realpay_mandates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realpay_instalments_updated_at
BEFORE UPDATE ON realpay_instalments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realpay_pricing_configs_updated_at
BEFORE UPDATE ON realpay_pricing_configs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\n-- End of the-shandi/sql/19_realpay_integrations.sql --\n
-- Buffr API Integrations
-- Tables for managing cross-project API integrations and configurations.

-- Buffr API Integration Configurations
CREATE TABLE buffr_api_integrations (
    integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_project VARCHAR(100) NOT NULL, -- e.g., 'buffrlend', 'buffrsign', 'buffrhost'
    target_project VARCHAR(100) NOT NULL, -- e.g., 'buffrlend', 'buffrsign', 'buffrhost'
    integration_name VARCHAR(255) NOT NULL, -- e.g., 'BuffrLend_to_BuffrSign_LoanSigning'
    api_base_url TEXT NOT NULL,
    api_key_encrypted TEXT, -- Encrypted API key for authentication
    api_key_hash TEXT, -- Hash of the API key for verification
    is_active BOOLEAN DEFAULT TRUE,
    configuration JSONB, -- JSONB field for flexible configuration parameters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(source_project, target_project, integration_name)
);

-- Buffr API Integration Logs (for auditing cross-project calls)
CREATE TABLE buffr_api_integration_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID REFERENCES buffr_api_integrations(integration_id),
    request_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    request_method VARCHAR(10) NOT NULL, -- e.g., 'GET', 'POST'
    request_endpoint TEXT NOT NULL,
    request_payload JSONB,
    response_timestamp TIMESTAMP WITH TIME ZONE,
    response_status_code INTEGER,
    response_payload JSONB,
    error_message TEXT,
    user_id UUID REFERENCES profiles(id), -- User who initiated the action, if applicable
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_buffr_api_integrations_source_target ON buffr_api_integrations(source_project, target_project);
CREATE INDEX idx_buffr_api_integration_logs_integration ON buffr_api_integration_logs(integration_id);
CREATE INDEX idx_buffr_api_integration_logs_user ON buffr_api_integration_logs(user_id);

-- Add updated_at triggers (assuming update_updated_at_column() function exists)
CREATE TRIGGER update_buffr_api_integrations_updated_at
BEFORE UPDATE ON buffr_api_integrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\n-- End of the-shandi/sql/20_buffr_api_integrations.sql --\n
