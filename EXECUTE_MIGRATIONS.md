# Execute All Database Migrations on Neon DB

## Manual Migration Execution Guide

Since the Neon MCP tools require authentication, execute these migrations manually in the Neon Console SQL Editor.

### Step 1: Access Neon Console
1. Go to [Neon Console](https://console.neon.tech/)
2. Select your `buffr-host` project
3. Navigate to **SQL Editor**

### Step 2: Execute Migrations in Order

#### Migration 001: Hotel Configuration Tables
```sql
-- Copy and paste the entire content of:
-- /backend/migrations/001_hotel_configuration_tables.sql
```

#### Migration 002: Hotel Configuration Data
```sql
-- Copy and paste the entire content of:
-- /backend/migrations/002_hotel_configuration_data.sql
```

#### Migration 003: ML/AI Tables
```sql
-- Copy and paste the entire content of:
-- /backend/migrations/003_ml_ai_tables.sql
```

#### Migration 004: Tenant Onboarding Tables
```sql
-- Copy and paste the entire content of:
-- /backend/migrations/004_tenant_onboarding_tables.sql
```

#### Migration 005: Complete Database Setup
```sql
-- Copy and paste the entire content of:
-- /backend/migrations/005_complete_database_setup.sql
```

#### Migration 006: Complete Business Systems ⭐ **NEW**
```sql
-- Copy and paste the entire content of:
-- /backend/migrations/006_complete_business_systems.sql
```

#### Migration 007: Mem0 Agent Memory ⭐ **NEW**
```sql
-- Copy and paste the entire content of:
-- /backend/migrations/007_mem0_agent_memory.sql
```

### Step 3: Verify Migrations
After executing all migrations, run these verification queries:

```sql
-- Check extensions
SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'vector');

-- Check tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Test RLS policies
SET app.current_tenant_id = 'test-tenant-id';
SELECT COUNT(*) FROM users;
```

### Expected Results
- **Extensions**: uuid-ossp, vector
- **Tables**: 35+ tables including agent_memories, cms_content, hr_employees, etc.
- **RLS**: Multi-tenant isolation working
- **Vector**: pgvector extension operational
