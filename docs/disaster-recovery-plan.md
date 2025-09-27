# The Shandi Microservices - Disaster Recovery Plan

## 🎯 **Overview**

This document outlines the comprehensive disaster recovery plan for The Shandi microservices platform. It defines procedures for data recovery, service failover, business continuity, and emergency response in case of system failures or disasters.

## 📋 **Table of Contents**

1. [Executive Summary](#executive-summary)
2. [Disaster Recovery Objectives](#disaster-recovery-objectives)
3. [Risk Assessment](#risk-assessment)
4. [Recovery Procedures](#recovery-procedures)
5. [Data Recovery](#data-recovery)
6. [Service Failover](#service-failover)
7. [Business Continuity](#business-continuity)
8. [Emergency Response](#emergency-response)
9. [Testing Procedures](#testing-procedures)
10. [Contact Information](#contact-information)

## 📊 **Executive Summary**

### **Recovery Time Objectives (RTO)**
- **Critical Services**: 15 minutes
- **Non-Critical Services**: 1 hour
- **Full System Recovery**: 4 hours

### **Recovery Point Objectives (RPO)**
- **Critical Data**: 5 minutes
- **Non-Critical Data**: 1 hour
- **Full Data Recovery**: 4 hours

### **Service Priority Levels**
- **Priority 1 (Critical)**: API Gateway, Auth Service, Order Service, Payment Service
- **Priority 2 (Important)**: Property Service, Menu Service, Inventory Service, Customer Service
- **Priority 3 (Standard)**: Loyalty Service, Staff Service, Calendar Service, Analytics Service
- **Priority 4 (Low)**: AI Service, Communication Service, Content Service

## 🎯 **Disaster Recovery Objectives**

### **Primary Objectives**
1. **Minimize Downtime**: Restore critical services within 15 minutes
2. **Data Protection**: Ensure no data loss for critical operations
3. **Service Continuity**: Maintain business operations during recovery
4. **Communication**: Keep stakeholders informed throughout the process

### **Secondary Objectives**
1. **Documentation**: Maintain detailed recovery logs
2. **Learning**: Conduct post-incident reviews
3. **Improvement**: Update procedures based on lessons learned
4. **Training**: Ensure team readiness for disaster scenarios

## ⚠️ **Risk Assessment**

### **High-Risk Scenarios**

#### **1. Data Center Failure**
- **Probability**: Low
- **Impact**: High
- **Recovery Time**: 2-4 hours
- **Mitigation**: Multi-region deployment, automated failover

#### **2. Database Corruption**
- **Probability**: Medium
- **Impact**: High
- **Recovery Time**: 1-2 hours
- **Mitigation**: Regular backups, point-in-time recovery

#### **3. Service Outage**
- **Probability**: Medium
- **Impact**: Medium
- **Recovery Time**: 15-30 minutes
- **Mitigation**: Health checks, automatic restart

#### **4. Security Breach**
- **Probability**: Low
- **Impact**: High
- **Recovery Time**: 2-6 hours
- **Mitigation**: Security monitoring, incident response plan

### **Medium-Risk Scenarios**

#### **1. Network Connectivity Issues**
- **Probability**: Medium
- **Impact**: Medium
- **Recovery Time**: 30-60 minutes
- **Mitigation**: Multiple network providers, failover

#### **2. Configuration Errors**
- **Probability**: Medium
- **Impact**: Medium
- **Recovery Time**: 30-60 minutes
- **Mitigation**: Configuration management, rollback procedures

#### **3. Resource Exhaustion**
- **Probability**: Medium
- **Impact**: Medium
- **Recovery Time**: 15-30 minutes
- **Mitigation**: Auto-scaling, resource monitoring

## 🔄 **Recovery Procedures**

### **Phase 1: Immediate Response (0-15 minutes)**

#### **1. Incident Detection**
```bash
# Check service health
curl http://localhost:8000/health
curl http://localhost:8001/health
# ... (check all services)

# Check system resources
docker stats
free -h
df -h

# Check database status
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT 1;"
```

#### **2. Incident Assessment**
```bash
# Identify affected services
docker-compose -f docker-compose.prod.yml ps

# Check service logs
docker-compose -f docker-compose.prod.yml logs --tail=100

# Assess impact
curl http://localhost:8000/metrics
```

#### **3. Emergency Notification**
```bash
# Send alert to emergency contacts
# Email: emergency@theshandi.com
# SMS: +1-555-0123
# Slack: #emergency-alerts

# Update status page
# Update: https://status.theshandi.com
```

### **Phase 2: Critical Service Recovery (15-60 minutes)**

#### **1. Restart Failed Services**
```bash
# Restart critical services first
docker-compose -f docker-compose.prod.yml restart api-gateway
docker-compose -f docker-compose.prod.yml restart auth-service
docker-compose -f docker-compose.prod.yml restart order-service
docker-compose -f docker-compose.prod.yml restart payment-service

# Verify service health
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8006/health
curl http://localhost:8007/health
```

#### **2. Database Recovery**
```bash
# Check database status
docker-compose -f docker-compose.prod.yml ps postgres

# Restart database if needed
docker-compose -f docker-compose.prod.yml restart postgres

# Verify database connectivity
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT version();"
```

#### **3. Service Failover**
```bash
# Activate backup services
docker-compose -f docker-compose.backup.yml up -d

# Update load balancer configuration
# Redirect traffic to backup services

# Verify failover
curl http://backup-api.theshandi.com/health
```

### **Phase 3: Full System Recovery (1-4 hours)**

#### **1. Restore All Services**
```bash
# Restart all services
docker-compose -f docker-compose.prod.yml up -d

# Verify all services
for port in {8000..8014}; do
  curl http://localhost:$port/health
done
```

#### **2. Data Synchronization**
```bash
# Sync data from backup
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db < latest_backup.sql

# Verify data integrity
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db -c "SELECT count(*) FROM users;"
```

#### **3. System Validation**
```bash
# Run health checks
./health_check.sh

# Run integration tests
pytest tests/integration/ -v

# Verify business functionality
curl http://localhost:8000/api/orders
curl http://localhost:8000/api/payments
```

## 💾 **Data Recovery**

### **Backup Strategy**

#### **1. Database Backups**
```bash
# Daily full backup
pg_dump -h localhost -p 5432 -U theshandi_user -d theshandi_db > daily_backup_$(date +%Y%m%d).sql

# Hourly incremental backup
pg_dump -h localhost -p 5432 -U theshandi_user -d theshandi_db --format=custom > hourly_backup_$(date +%Y%m%d_%H).dump

# Continuous WAL archiving
# Configure postgresql.conf:
# wal_level = replica
# archive_mode = on
# archive_command = 'cp %p /backup/wal/%f'
```

#### **2. Service Data Backups**
```bash
# Backup Redis data
redis-cli BGSAVE
cp /var/lib/redis/dump.rdb /backup/redis_$(date +%Y%m%d_%H%M%S).rdb

# Backup configuration files
tar -czf config_backup_$(date +%Y%m%d_%H%M%S).tar.gz .env docker-compose*.yml terraform/

# Backup SSL certificates
cp -r ssl/ /backup/ssl_$(date +%Y%m%d_%H%M%S)/
```

### **Recovery Procedures**

#### **1. Point-in-Time Recovery**
```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore base backup
psql -h localhost -p 5432 -U theshandi_user -d theshandi_db < base_backup.sql

# Apply WAL files to specific point in time
pg_receivewal -D /backup/wal/ --target-time="2025-01-15 12:00:00"
```

#### **2. Service Data Recovery**
```bash
# Restore Redis data
cp /backup/redis_20250115_120000.rdb /var/lib/redis/dump.rdb
docker-compose -f docker-compose.prod.yml restart redis

# Restore configuration
tar -xzf config_backup_20250115_120000.tar.gz

# Restore SSL certificates
cp -r /backup/ssl_20250115_120000/* ssl/
```

## 🔄 **Service Failover**

### **Automatic Failover**

#### **1. Health Check Configuration**
```bash
# Configure health checks in docker-compose.prod.yml
services:
  api-gateway:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### **2. Load Balancer Configuration**
```bash
# Configure nginx for failover
upstream api_gateway {
    server api-gateway-1:8000 max_fails=3 fail_timeout=30s;
    server api-gateway-2:8000 max_fails=3 fail_timeout=30s backup;
}

server {
    listen 80;
    location / {
        proxy_pass http://api_gateway;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
    }
}
```

### **Manual Failover**

#### **1. Service Failover**
```bash
# Stop primary service
docker-compose -f docker-compose.prod.yml stop api-gateway

# Start backup service
docker-compose -f docker-compose.backup.yml up -d api-gateway

# Update DNS/load balancer
# Redirect traffic to backup service
```

#### **2. Database Failover**
```bash
# Promote standby database
psql -h standby-db-host -p 5432 -U standby_user -d standby_db -c "SELECT pg_promote();"

# Update connection strings
# Update all services to use new database host
```

## 🏢 **Business Continuity**

### **Communication Plan**

#### **1. Stakeholder Notification**
```
Immediate (0-15 minutes):
- Emergency contacts notified
- Status page updated
- Internal team alerted

Short-term (15-60 minutes):
- Customers notified via email/SMS
- Partners informed
- Media statement prepared

Long-term (1-4 hours):
- Detailed status update
- Recovery timeline provided
- Post-incident review scheduled
```

#### **2. Status Page Updates**
```bash
# Update status page
curl -X POST https://status.theshandi.com/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Service Outage",
    "status": "investigating",
    "message": "We are investigating reports of service issues."
  }'
```

### **Alternative Operations**

#### **1. Manual Processes**
- **Order Processing**: Manual order entry system
- **Payment Processing**: Alternative payment methods
- **Customer Support**: Phone-based support
- **Inventory Management**: Manual inventory tracking

#### **2. Reduced Functionality Mode**
```bash
# Enable maintenance mode
echo "MAINTENANCE_MODE=true" >> .env
docker-compose -f docker-compose.prod.yml up -d

# Provide basic functionality
# Essential services only
# Limited feature set
```

## 🚨 **Emergency Response**

### **Emergency Contacts**

#### **1. Internal Team**
```
Primary On-Call: +1-555-0123
Secondary On-Call: +1-555-0124
DevOps Team: +1-555-0125
Management: +1-555-0126
```

#### **2. External Partners**
```
Cloud Provider: +1-555-0200
Database Provider: +1-555-0201
CDN Provider: +1-555-0202
Security Provider: +1-555-0203
```

### **Emergency Procedures**

#### **1. Security Incident**
```bash
# Immediate response
docker-compose -f docker-compose.prod.yml kill
docker system prune -f

# Isolate affected systems
# Block suspicious IPs
# Preserve evidence

# Notify security team
# Contact law enforcement if needed
```

#### **2. Data Breach**
```bash
# Immediate response
docker-compose -f docker-compose.prod.yml down

# Preserve evidence
# Document incident
# Notify authorities
# Inform affected users
```

## 🧪 **Testing Procedures**

### **Recovery Testing**

#### **1. Monthly Tests**
```bash
# Test backup restoration
psql -h localhost -p 5432 -U test_user -d test_db < latest_backup.sql

# Test service failover
docker-compose -f docker-compose.test.yml up -d
curl http://localhost:8000/health

# Test data recovery
./test_data_recovery.sh
```

#### **2. Quarterly Tests**
```bash
# Full disaster recovery test
# Simulate complete system failure
# Test all recovery procedures
# Validate business continuity

# Test communication procedures
# Verify contact information
# Test notification systems
```

### **Test Scenarios**

#### **1. Service Failure Test**
```bash
# Simulate service failure
docker-compose -f docker-compose.prod.yml stop auth-service

# Test automatic restart
# Verify health checks
# Test failover procedures
```

#### **2. Database Failure Test**
```bash
# Simulate database failure
docker-compose -f docker-compose.prod.yml stop postgres

# Test backup restoration
# Verify data integrity
# Test service recovery
```

## 📞 **Contact Information**

### **Emergency Contacts**
- **Primary On-Call**: +1-555-0123
- **Secondary On-Call**: +1-555-0124
- **DevOps Team**: +1-555-0125
- **Management**: +1-555-0126

### **External Contacts**
- **Cloud Provider**: +1-555-0200
- **Database Provider**: +1-555-0201
- **CDN Provider**: +1-555-0202
- **Security Provider**: +1-555-0203

### **Communication Channels**
- **Email**: emergency@theshandi.com
- **SMS**: +1-555-0123
- **Slack**: #emergency-alerts
- **Status Page**: https://status.theshandi.com

## 📋 **Recovery Checklist**

### **Immediate Response (0-15 minutes)**
- [ ] Detect and assess incident
- [ ] Notify emergency contacts
- [ ] Update status page
- [ ] Begin recovery procedures

### **Critical Recovery (15-60 minutes)**
- [ ] Restart critical services
- [ ] Restore database connectivity
- [ ] Activate failover systems
- [ ] Verify critical functionality

### **Full Recovery (1-4 hours)**
- [ ] Restore all services
- [ ] Synchronize data
- [ ] Validate system functionality
- [ ] Complete recovery testing

### **Post-Recovery (4+ hours)**
- [ ] Conduct post-incident review
- [ ] Update procedures
- [ ] Notify stakeholders
- [ ] Schedule follow-up actions

## 📊 **Recovery Metrics**

### **Key Performance Indicators**
- **Mean Time to Recovery (MTTR)**: Target < 2 hours
- **Recovery Time Objective (RTO)**: Target < 4 hours
- **Recovery Point Objective (RPO)**: Target < 1 hour
- **Service Availability**: Target > 99.9%

### **Reporting**
- **Daily**: Service health reports
- **Weekly**: Backup status reports
- **Monthly**: Recovery test results
- **Quarterly**: Disaster recovery review

## 🔄 **Plan Maintenance**

### **Review Schedule**
- **Monthly**: Review and update contact information
- **Quarterly**: Review and test procedures
- **Annually**: Complete plan review and update

### **Update Triggers**
- System architecture changes
- New service deployments
- Contact information changes
- Lessons learned from incidents

---

**Document Information**
- **Version**: 1.0.0
- **Last Updated**: January 2025
- **Next Review**: February 2025
- **Approved By**: DevOps Team Lead
- **Distribution**: All Operations Team Members