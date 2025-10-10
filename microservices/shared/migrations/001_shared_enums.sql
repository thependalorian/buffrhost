-- Shared Enums and Types
-- Common enums used across multiple microservices

-- Currency enum
CREATE TYPE currency_code AS ENUM (
    'USD', 'EUR', 'GBP', 'NAD', 'ZAR', 'BWP'
);

-- Timezone enum (common ones)
CREATE TYPE timezone_type AS ENUM (
    'UTC', 'Africa/Windhoek', 'Africa/Johannesburg', 'America/New_York', 'Europe/London'
);

-- Language enum
CREATE TYPE language_code AS ENUM (
    'en', 'af', 'de', 'fr', 'pt'
);

-- Status enum (generic)
CREATE TYPE generic_status AS ENUM (
    'active',
    'inactive',
    'pending',
    'suspended',
    'cancelled',
    'completed'
);

-- Priority enum
CREATE TYPE priority_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'email',
    'sms',
    'push',
    'in_app',
    'webhook'
);

-- Audit event types
CREATE TYPE audit_event_type AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'login',
    'logout',
    'permission_change',
    'data_export',
    'data_import'
);