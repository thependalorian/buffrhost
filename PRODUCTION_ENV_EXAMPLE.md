# Production Environment Configuration

## Environment Variables for Production Deployment

Copy these variables to your production environment:

### Backend Environment Variables

```env
# =====================================================
# DATABASE CONFIGURATION
# =====================================================
NEON_DATABASE_URL=postgresql://username:password@host/database
DATABASE_URL=${NEON_DATABASE_URL}

# =====================================================
# MEM0 AI MEMORY CONFIGURATION
# =====================================================
MEM0_COLLECTION_NAME=agent_memories
MEM0_EMBEDDING_MODEL=text-embedding-ada-002
MEM0_EMBEDDING_DIMENSIONS=1536
MEM0_SIMILARITY_THRESHOLD=0.7

# =====================================================
# DEEPSEEK LLM CONFIGURATION
# =====================================================
DEEPSEEK_API_KEY=your-deepseek-api-key-here
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=1000

# =====================================================
# ARCADE AI TOOLS CONFIGURATION
# =====================================================
ARCADE_API_KEY=your-arcade-api-key-here

# =====================================================
# JWT AUTHENTICATION
# =====================================================
JWT_SECRET_KEY=your-secure-random-string-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=60

# =====================================================
# EMAIL CONFIGURATION
# =====================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_NAME=Buffr Host
SMTP_FROM_EMAIL=noreply@buffr.ai

# =====================================================
# SECURITY CONFIGURATION
# =====================================================
CORS_ORIGINS=https://buffr-host.vercel.app,https://host.buffr.ai
CORS_CREDENTIALS=true

# =====================================================
# PRODUCTION SETTINGS
# =====================================================
NODE_ENV=production
PORT=3000
DEBUG=false
```

### Frontend Environment Variables

```env
# =====================================================
# DATABASE CONFIGURATION
# =====================================================
NEXT_PUBLIC_NEON_DATABASE_URL=postgresql://username:password@host/database
NEON_DATABASE_URL=postgresql://username:password@host/database

# =====================================================
# DEEPSEEK LLM CONFIGURATION
# =====================================================
NEXT_PUBLIC_DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_API_KEY=your-deepseek-api-key-here

# =====================================================
# ARCADE AI TOOLS CONFIGURATION
# =====================================================
NEXT_PUBLIC_ARCADE_API_KEY=your-arcade-api-key-here
ARCADE_API_KEY=your-arcade-api-key-here

# =====================================================
# APP CONFIGURATION
# =====================================================
NEXT_PUBLIC_APP_URL=https://buffr-host.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend.com/api
NEXT_PUBLIC_WS_URL=wss://your-backend.com/ws

# =====================================================
# FEATURE FLAGS
# =====================================================
NEXT_PUBLIC_FEATURE_MEM0_ENABLED=true
NEXT_PUBLIC_FEATURE_ARCADE_ENABLED=true
NEXT_PUBLIC_FEATURE_MULTI_TENANT=true
NEXT_PUBLIC_FEATURE_RBAC_ENABLED=true
```

## Vercel Deployment Environment Variables

Set these in your Vercel dashboard:

### Required Variables:
- `NEON_DATABASE_URL`
- `DEEPSEEK_API_KEY`
- `ARCADE_API_KEY`
- `NEXT_PUBLIC_APP_URL`

### Optional Variables:
- `NEXT_PUBLIC_FEATURE_MEM0_ENABLED=true`
- `NEXT_PUBLIC_FEATURE_ARCADE_ENABLED=true`
- `NEXT_PUBLIC_FEATURE_MULTI_TENANT=true`
- `NEXT_PUBLIC_FEATURE_RBAC_ENABLED=true`

## Neon DB Environment Variables

Set these in your Neon project:

### Database Connection:
- `NEON_DATABASE_URL` - Your connection string
- `NEON_PROJECT_ID` - Your project ID
- `NEON_API_KEY` - Your API key

### Mem0 Configuration:
- `MEM0_COLLECTION_NAME=agent_memories`
- `MEM0_EMBEDDING_DIMENSIONS=1536`
- `MEM0_SIMILARITY_THRESHOLD=0.7`

## Security Notes

1. **Never commit .env files to version control**
2. **Use strong, unique passwords for all services**
3. **Rotate API keys regularly**
4. **Enable 2FA on all accounts**
5. **Use environment-specific configurations**

## Testing Environment Variables

Before production deployment:

1. **Test database connection**
2. **Test Mem0 memory storage**
3. **Test Arcade tools authorization**
4. **Test multi-tenant isolation**
5. **Test RBAC permissions**

## Troubleshooting

### Common Issues:

1. **Database connection failed**:
   - Check NEON_DATABASE_URL format
   - Verify credentials
   - Test connection

2. **Mem0 not working**:
   - Check pgvector extension
   - Verify embedding dimensions
   - Test memory storage

3. **Arcade tools not working**:
   - Check ARCADE_API_KEY
   - Verify authorization flow
   - Test individual tools

4. **Multi-tenant issues**:
   - Check RLS policies
   - Verify tenant_id setting
   - Test data isolation
