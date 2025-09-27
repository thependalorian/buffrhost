# The Shandi Microservices - Operational Runbooks

## 🎯 **Overview**

This document provides comprehensive operational procedures for The Shandi microservices platform. It covers service management, database operations, configuration management, and environment-specific procedures.

## 📋 **Table of Contents**

1. [Service Management](#service-management)
2. [Database Operations](#database-operations)
3. [Configuration Management](#configuration-management)
4. [Environment Management](#environment-management)
5. [Scaling Procedures](#scaling-procedures)
6. [Health Checks](#health-checks)
7. [Log Management](#log-management)
8. [Backup Procedures](#backup-procedures)
9. [Emergency Procedures](#emergency-procedures)
10. [Troubleshooting](#troubleshooting)

## 🔧 **Service Management**

### **Service Startup Procedures**

#### **1. Start All Services (Development)**
```bash
# Navigate to project directory
cd the-shandi

# Start all services with Docker Compose
docker-compose -f docker-compose.dev.yml up -d

# Verify all services are running
docker-compose -f docker-compose.dev.yml ps

# Check service health
curl http://localhost:8000/health  # API Gateway
curl http://localhost:8001/health  # Auth Service
curl http://localhost:8002/health  # Property Service
# ... (repeat for all 15 services)
```

#### **2. Start Individual Service**
```bash
# Start specific service
docker-compose -f docker-compose.dev.yml up -d auth-service

# Check service logs
docker-compose -f docker-compose.dev.yml logs -f auth-service

# Verify service health
curl http://localhost:8001/health
```

#### **3. Start Services in Production**
```bash
# Production startup
docker-compose -f docker-compose.prod.yml up -d

# Verify production services
docker-compose -f docker-compose.prod.yml ps

# Check production health
curl https://api.theshandi.com/health
```

### **Service Shutdown Procedures**

#### **1. Graceful Shutdown**
```bash
# Stop all services gracefully
docker-compose -f docker-compose.dev.yml down

# Stop specific service
docker-compose -f docker-compose.dev.yml stop auth-service

# Force stop if needed
docker-compose -f docker-compose.dev.yml kill auth-service
```

#### **2. Emergency Shutdown**
```bash
# Emergency stop all services
docker-compose -f docker-compose.dev.yml kill

# Remove all containers
docker-compose -f docker-compose.dev.yml rm -f
```

### **Service Restart Procedures**

#### **1. Restart Individual Service**
```bash
# Restart specific service
docker-compose -f docker-compose.dev.yml restart auth-service

# Restart with rebuild
docker-compose -f docker-compose.dev.yml up -d --build auth-service
```

#### **2. Rolling Restart**
```bash
# Restart services in order (API Gateway last)
docker-compose -f docker-compose.dev.yml restart auth-service
docker-compose -f docker-compose.dev.yml restart property-service
docker-compose -f docker-compose.dev.yml restart menu-service
# ... (continue for all services)
docker-compose -f docker-compose.dev.yml restart api-gateway
```

## 🗄️ **Database Operations**

### **Database Connection**

#### **1. Connect to Database**
```bash
# Connect to main database
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db

# Connect to specific service database
psql -h localhost -p 5432 -U auth_user -d buffr_host_auth
psql -h localhost -p 5432 -U property_user -d buffr_host_properties
# ... (repeat for all service databases)
```

#### **2. Database Status Check**
```bash
# Check database status
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT version();"

# Check database size
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT pg_size_pretty(pg_database_size('theshandi_db'));"

# Check active connections
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT count(*) FROM pg_stat_activity;"
```

### **Database Migration**

#### **1. Run Migrations**
```bash
# Run all migrations
alembic upgrade head

# Run specific migration
alembic upgrade +1

# Check migration status
alembic current

# Show migration history
alembic history
```

#### **2. Rollback Migrations**
```bash
# Rollback one migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision_id>

# Rollback all migrations
alembic downgrade base
```

### **Database Maintenance**

#### **1. Database Backup**
```bash
# Full database backup
pg_dump -h localhost -p 5432 -U theshandi_user -d theshandi_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup specific service database
pg_dump -h localhost -p 5432 -U auth_user -d buffr_host_auth > auth_backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -h localhost -p 5432 -U theshandi_user -d theshandi_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

#### **2. Database Restore**
```bash
# Restore from backup
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db < backup_20250115_120000.sql

# Restore compressed backup
gunzip -c backup_20250115_120000.sql.gz | psql -h localhost -p 5432 -U theshandi_user -d theshandi_db
```

#### **3. Database Optimization**
```bash
# Analyze tables
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "ANALYZE;"

# Vacuum tables
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "VACUUM;"

# Reindex database
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "REINDEX DATABASE theshandi_db;"
```

## ⚙️ **Configuration Management**

### **Environment Configuration**

#### **1. Environment Variables**
```bash
# Check current environment variables
docker-compose -f docker-compose.dev.yml config

# Update environment variables
# Edit .env file
vim .env

# Reload configuration
docker-compose -f docker-compose.dev.yml up -d
```

#### **2. Service Configuration**
```bash
# Check service configuration
docker exec -it theshandi_auth-service_1 cat /app/.env

# Update service configuration
docker exec -it theshandi_auth-service_1 sh -c 'echo "NEW_VAR=value" >> /app/.env'

# Restart service to apply changes
docker-compose -f docker-compose.dev.yml restart auth-service
```

### **SSL/TLS Configuration**

#### **1. Certificate Management**
```bash
# Check SSL certificates
openssl x509 -in /path/to/certificate.crt -text -noout

# Verify certificate chain
openssl verify -CAfile /path/to/ca-bundle.crt /path/to/certificate.crt

# Check certificate expiration
openssl x509 -in /path/to/certificate.crt -noout -dates
```

#### **2. SSL Configuration Update**
```bash
# Update SSL certificates
cp new_certificate.crt /path/to/certificate.crt
cp new_private_key.key /path/to/private_key.key

# Restart services to apply new certificates
docker-compose -f docker-compose.prod.yml restart api-gateway
```

## 🌍 **Environment Management**

### **Environment-Specific Procedures**

#### **1. Development Environment**
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Check development services
docker-compose -f docker-compose.dev.yml ps

# View development logs
docker-compose -f docker-compose.dev.yml logs -f
```

#### **2. Staging Environment**
```bash
# Deploy to staging
docker-compose -f docker-compose.staging.yml up -d

# Run staging tests
pytest tests/staging/ -v

# Check staging health
curl https://staging-api.theshandi.com/health
```

#### **3. Production Environment**
```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Verify production deployment
docker-compose -f docker-compose.prod.yml ps

# Check production health
curl https://api.theshandi.com/health
```

### **Environment Synchronization**

#### **1. Sync Development to Staging**
```bash
# Export development data
pg_dump -h localhost -p 5432 -U theshandi_user -d theshandi_db > dev_data.sql

# Import to staging
psql -h staging-db-host -p 5432 -U staging_user -d staging_db < dev_data.sql
```

#### **2. Sync Staging to Production**
```bash
# Export staging data
pg_dump -h staging-db-host -p 5432 -U staging_user -d staging_db > staging_data.sql

# Import to production
psql -h prod-db-host -p 5432 -U prod_user -d prod_db < staging_data.sql
```

## 📈 **Scaling Procedures**

### **Horizontal Scaling**

#### **1. Scale Individual Service**
```bash
# Scale auth service to 3 instances
docker-compose -f docker-compose.prod.yml up -d --scale auth-service=3

# Scale multiple services
docker-compose -f docker-compose.prod.yml up -d --scale auth-service=3 --scale property-service=2
```

#### **2. Auto-scaling Configuration**
```bash
# Check current resource usage
docker stats

# Monitor service performance
curl http://localhost:8001/metrics

# Adjust scaling based on metrics
docker-compose -f docker-compose.prod.yml up -d --scale order-service=5
```

### **Vertical Scaling**

#### **1. Increase Service Resources**
```bash
# Update service resource limits in docker-compose.prod.yml
services:
  auth-service:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'

# Apply changes
docker-compose -f docker-compose.prod.yml up -d
```

#### **2. Database Scaling**
```bash
# Check database performance
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT * FROM pg_stat_activity;"

# Optimize database configuration
# Edit postgresql.conf
# Increase shared_buffers, work_mem, etc.

# Restart database
docker-compose -f docker-compose.prod.yml restart postgres
```

## 🏥 **Health Checks**

### **Service Health Monitoring**

#### **1. Check All Service Health**
```bash
# Check API Gateway
curl http://localhost:8000/health

# Check Auth Service
curl http://localhost:8001/health

# Check Property Service
curl http://localhost:8002/health

# Check all services with script
for port in {8000..8014}; do
  echo "Checking service on port $port..."
  curl -f http://localhost:$port/health || echo "Service on port $port is down"
done
```

#### **2. Detailed Health Check**
```bash
# Check service metrics
curl http://localhost:8001/metrics

# Check database connectivity
curl http://localhost:8001/health/database

# Check Redis connectivity
curl http://localhost:8001/health/redis
```

### **Health Check Automation**

#### **1. Health Check Script**
```bash
#!/bin/bash
# health_check.sh

SERVICES=(
  "8000:api-gateway"
  "8001:auth-service"
  "8002:property-service"
  "8003:menu-service"
  "8004:inventory-service"
  "8005:customer-service"
  "8006:order-service"
  "8007:payment-service"
  "8008:loyalty-service"
  "8009:staff-service"
  "8010:calendar-service"
  "8011:analytics-service"
  "8012:ai-service"
  "8013:communication-service"
  "8014:content-service"
)

for service in "${SERVICES[@]}"; do
  port=$(echo $service | cut -d: -f1)
  name=$(echo $service | cut -d: -f2)
  
  if curl -f http://localhost:$port/health > /dev/null 2>&1; then
    echo "✅ $name is healthy"
  else
    echo "❌ $name is unhealthy"
  fi
done
```

## 📝 **Log Management**

### **Log Collection**

#### **1. View Service Logs**
```bash
# View all service logs
docker-compose -f docker-compose.dev.yml logs

# View specific service logs
docker-compose -f docker-compose.dev.yml logs auth-service

# Follow logs in real-time
docker-compose -f docker-compose.dev.yml logs -f auth-service

# View logs with timestamps
docker-compose -f docker-compose.dev.yml logs -t auth-service
```

#### **2. Log Analysis**
```bash
# Search for errors
docker-compose -f docker-compose.dev.yml logs auth-service | grep -i error

# Search for specific patterns
docker-compose -f docker-compose.dev.yml logs auth-service | grep "authentication"

# Count log entries
docker-compose -f docker-compose.dev.yml logs auth-service | wc -l
```

### **Log Rotation**

#### **1. Configure Log Rotation**
```bash
# Configure Docker log rotation
# Edit docker-compose.prod.yml
services:
  auth-service:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

#### **2. Clean Old Logs**
```bash
# Clean Docker logs
docker system prune -f

# Clean specific service logs
docker-compose -f docker-compose.dev.yml logs --tail=0 auth-service
```

## 💾 **Backup Procedures**

### **Service Backup**

#### **1. Backup Service Data**
```bash
# Backup all service data
mkdir -p backups/$(date +%Y%m%d_%H%M%S)

# Backup each service database
for service in auth property menu inventory customer order payment loyalty staff calendar analytics ai communication content; do
  pg_dump -h localhost -p 5432 -U ${service}_user -d buffr_host_${service} > backups/$(date +%Y%m%d_%H%M%S)/${service}_backup.sql
done
```

#### **2. Backup Configuration**
```bash
# Backup configuration files
cp -r .env docker-compose*.yml terraform/ backups/$(date +%Y%m%d_%H%M%S)/config/

# Backup SSL certificates
cp -r ssl/ backups/$(date +%Y%m%d_%H%M%S)/ssl/
```

### **Automated Backup**

#### **1. Backup Script**
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup databases
for service in auth property menu inventory customer order payment loyalty staff calendar analytics ai communication content; do
  echo "Backing up $service database..."
  pg_dump -h localhost -p 5432 -U ${service}_user -d buffr_host_${service} > $BACKUP_DIR/${service}_backup.sql
done

# Backup configuration
cp -r .env docker-compose*.yml terraform/ $BACKUP_DIR/config/

# Compress backup
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "Backup completed: $BACKUP_DIR.tar.gz"
```

## 🚨 **Emergency Procedures**

### **Service Recovery**

#### **1. Service Down Recovery**
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Restart failed service
docker-compose -f docker-compose.prod.yml restart auth-service

# Check service health
curl http://localhost:8001/health

# If still failing, check logs
docker-compose -f docker-compose.prod.yml logs auth-service
```

#### **2. Database Recovery**
```bash
# Check database status
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT 1;"

# If database is down, restart
docker-compose -f docker-compose.prod.yml restart postgres

# Check database health
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT version();"
```

### **Emergency Contacts**

#### **1. Escalation Procedures**
```
Level 1: Development Team
- Primary: dev-team@theshandi.com
- Secondary: +1-555-0123

Level 2: DevOps Team
- Primary: devops@theshandi.com
- Secondary: +1-555-0124

Level 3: Management
- Primary: management@theshandi.com
- Secondary: +1-555-0125
```

#### **2. Emergency Response**
```bash
# Emergency shutdown
docker-compose -f docker-compose.prod.yml kill

# Emergency backup
./backup.sh

# Notify stakeholders
# Send alert to emergency contacts
```

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Service Won't Start**
```bash
# Check service logs
docker-compose -f docker-compose.dev.yml logs auth-service

# Check port conflicts
netstat -tulpn | grep :8001

# Check resource usage
docker stats

# Check configuration
docker-compose -f docker-compose.dev.yml config
```

#### **2. Database Connection Issues**
```bash
# Check database status
docker-compose -f docker-compose.dev.yml ps postgres

# Check database logs
docker-compose -f docker-compose.dev.yml logs postgres

# Test database connection
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT 1;"

# Check network connectivity
docker network ls
docker network inspect theshandi_default
```

#### **3. Performance Issues**
```bash
# Check resource usage
docker stats

# Check database performance
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT * FROM pg_stat_activity;"

# Check service metrics
curl http://localhost:8001/metrics

# Check Redis performance
redis-cli info stats
```

### **Diagnostic Commands**

#### **1. System Diagnostics**
```bash
# Check system resources
free -h
df -h
top

# Check Docker status
docker system df
docker system events

# Check network status
netstat -tulpn
ss -tulpn
```

#### **2. Service Diagnostics**
```bash
# Check service status
docker-compose -f docker-compose.dev.yml ps

# Check service resources
docker stats

# Check service logs
docker-compose -f docker-compose.dev.yml logs --tail=100 auth-service

# Check service configuration
docker-compose -f docker-compose.dev.yml config
```

## 📞 **Support Information**

### **Documentation References**
- [Architecture Documentation](architecture.md)
- [Deployment Guide](deployment-guide.md)
- [Development Guide](development-guide.md)
- [API Specification](api-specification.md)

### **Contact Information**
- **Technical Support**: support@theshandi.com
- **Emergency Hotline**: +1-555-0123
- **Documentation**: docs@theshandi.com

### **Update Information**
- **Last Updated**: January 2025
- **Version**: 1.0.0
- **Next Review**: February 2025

---

**Note**: This document should be reviewed and updated regularly to ensure accuracy and completeness.