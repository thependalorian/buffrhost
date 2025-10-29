# Buffr Host - Role-Based Architecture Documentation

## 🏗️ **System Overview**

Buffr Host is a multi-tenant fintech platform that connects customers, property owners, and platform administrators through a sophisticated role-based access control system. The platform handles payments, disbursements, and analytics with clear separation of concerns.

## 👥 **User Roles & Permissions**

### 🏢 **Property Owners** (Restaurant/Hotel Owners)

**Primary Function:** Manage their individual business operations

#### **What Property Owners Have Access To:**

- **Property Dashboard** - Real-time analytics for their specific business
- **Order Management** - View, process, and manage orders for their property
- **Inventory Management** - Manage menu items, rooms, services, and pricing
- **Review Management** - Respond to customer reviews and manage reputation
- **Disbursement Tracking** - Monitor when they receive payments from Buffr
- **Customer Insights** - Analytics and customer behavior for their property
- **Revenue Reports** - Track their earnings after Buffr fees
- **Staff Management** - Manage their own staff and permissions

#### **What Property Owners DON'T Have:**

- ❌ Access to other properties' data or analytics
- ❌ System-wide platform analytics
- ❌ User management across the platform
- ❌ Payment processing controls (Adumo/RealPay)
- ❌ Platform configuration settings
- ❌ Access to Buffr's service fee revenue
- ❌ Cross-tenant data access

#### **Financial Flow for Property Owners:**

```
Customer Payment → Adumo Processing → Buffr Host (Service Fee) → RealPay → Property Owner
Order Amount: N$ 100
+ VAT (15%): N$ 15
+ Buffr Service Fee (10%): N$ 10
+ Adumo Processing Fee: N$ 2.9
= Total Customer Pays: N$ 127.9

Property Owner Receives: N$ 100 + N$ 15 (VAT) - RealPay Fee = N$ 115 - RealPay Fee
```

---

### 🎛️ **Buffr Host Admin** (Platform Administrators)

**Primary Function:** Manage the entire platform and financial operations

#### **What Buffr Host Admins Have Access To:**

- **Multi-Property Dashboard** - Overview of ALL properties and system health
- **Payment Management** - Adumo/RealPay integration controls and monitoring
- **Disbursement Management** - Process daily disbursements to property owners
- **User Management** - Manage all users across the platform
- **Analytics & BI** - System-wide analytics and business intelligence
- **Revenue Analytics** - Track Buffr's service fees from all properties
- **System Health** - Monitor platform performance and uptime
- **Tenant Management** - Manage different business groups and configurations
- **Financial Controls** - Fee structure management and payment processing
- **Security Management** - Platform security and access controls
- **Audit Logs** - Complete system audit trail and compliance

#### **What Buffr Host Admins DON'T Have:**

- ❌ Direct access to individual property operations
- ❌ Ability to modify property-specific settings without permission
- ❌ Access to property owners' private customer data
- ❌ Ability to bypass tenant isolation

#### **Financial Flow for Buffr Host:**

```
Total Platform Revenue = Sum of all Buffr Service Fees (10% of each order)
+ Adumo Processing Fees (collected from customers)
- RealPay Disbursement Fees
- Platform Operating Costs
= Buffr Host Net Revenue
```

---

### 👤 **Customers** (End Users)

**Primary Function:** Place orders and make payments

#### **What Customers Have Access To:**

- **Browse Properties** - View available restaurants, hotels, services
- **Place Orders** - Order food, book rooms, purchase services
- **Payment Processing** - Secure payment through Adumo integration
- **Order Tracking** - Track order status and delivery
- **Review System** - Leave reviews and ratings
- **Order History** - View past orders and receipts
- **Profile Management** - Manage personal information

#### **What Customers DON'T Have:**

- ❌ Access to property management functions
- ❌ Platform administration capabilities
- ❌ Access to other customers' data
- ❌ Financial management tools

---

## 🔄 **Complete Payment Flow**

### **1. Customer Places Order**

```
Customer → Property Website → Buffr Checkout Flow → Order Created
```

### **2. Payment Processing**

```
Customer Payment → Adumo Online → 3DS Authentication → Payment Confirmed
```

### **3. Financial Distribution**

```
Adumo → Buffr Host Account → RealPay → Property Owner Account
```

### **4. Order Fulfillment**

```
Property Owner → Order Processing → Customer Notification → Order Complete
```

---

## 🛡️ **Security & Data Isolation**

### **Tenant Isolation**

- Each property operates in its own data silo
- Property owners can only access their own data
- Cross-tenant queries are strictly prohibited
- Row-level security (RLS) enforced at database level

### **Role-Based Access Control (RBAC)**

- JWT tokens contain role and tenant information
- API endpoints validate user permissions
- Frontend components render based on user role
- Database queries filtered by tenant ID

### **Financial Security**

- PCI DSS compliance for payment processing
- Encrypted storage of sensitive financial data
- Audit trails for all financial transactions
- Secure API endpoints with proper authentication

---

## 📊 **Analytics & Reporting**

### **Property Owner Analytics**

- Order volume and revenue trends
- Customer satisfaction scores
- Popular menu items and services
- Staff performance metrics
- Disbursement history and timing

### **Buffr Host Admin Analytics**

- Platform-wide revenue and growth metrics
- Property performance comparisons
- Payment processing success rates
- System health and uptime statistics
- User engagement and retention metrics

---

## 🔧 **Technical Implementation**

### **Database Schema**

```sql
-- Tenant isolation enforced at database level
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  property_id VARCHAR(50) NOT NULL,
  tenant_id VARCHAR(50) NOT NULL,
  -- ... other fields
);

-- Row Level Security policies
CREATE POLICY tenant_isolation ON orders
  FOR ALL TO authenticated
  USING (tenant_id = current_setting('app.current_tenant'));
```

### **API Security**

```typescript
// Role-based API access
export async function GET(request: NextRequest) {
  const user = await authenticateUser(request);

  if (user.role === 'property_owner') {
    // Only return data for user's property
    return getPropertyData(user.propertyId);
  } else if (user.role === 'admin') {
    // Return system-wide data
    return getAllPropertiesData();
  }
}
```

### **Frontend Role Guards**

```typescript
// Component-level access control
function PropertyDashboard() {
  const { user } = useAuth();

  if (user.role !== 'property_owner') {
    return <UnauthorizedAccess />;
  }

  return <PropertyOwnerDashboard />;
}
```

---

## 📈 **Business Model**

### **Revenue Streams**

1. **Service Fees** - 10% of each order value
2. **Processing Fees** - Adumo transaction fees
3. **Disbursement Fees** - RealPay daily disbursement charges
4. **Premium Features** - Advanced analytics and tools

### **Cost Structure**

1. **Payment Processing** - Adumo integration costs
2. **Disbursement Processing** - RealPay fees
3. **Platform Operations** - Infrastructure and maintenance
4. **Support & Development** - Customer support and feature development

---

## 🚀 **Deployment Architecture**

### **Multi-Tenant Database**

- Single database with tenant isolation
- Row-level security policies
- Automated backup and recovery
- Performance monitoring and optimization

### **API Gateway**

- Rate limiting per tenant
- Authentication and authorization
- Request/response logging
- Error handling and monitoring

### **Frontend Applications**

- Role-based routing and components
- Tenant-specific theming and branding
- Responsive design for all devices
- Progressive Web App (PWA) capabilities

---

## 🔍 **Monitoring & Compliance**

### **Audit Logging**

- All user actions logged with timestamps
- Financial transactions tracked end-to-end
- Security events monitored and alerted
- Compliance reporting automated

### **Performance Monitoring**

- Real-time system health dashboards
- API response time tracking
- Database performance metrics
- User experience monitoring

### **Security Monitoring**

- Failed authentication attempts
- Unusual access patterns
- Data breach detection
- Compliance violation alerts

---

## 📋 **Implementation Checklist**

### **For Property Owners:**

- [ ] Property dashboard setup
- [ ] Order management system
- [ ] Inventory management tools
- [ ] Review response system
- [ ] Disbursement tracking
- [ ] Customer analytics
- [ ] Staff management

### **For Buffr Host Admins:**

- [ ] Multi-tenant dashboard
- [ ] Payment processing controls
- [ ] Disbursement management
- [ ] User management system
- [ ] Analytics and BI tools
- [ ] System health monitoring
- [ ] Security management

### **For Customers:**

- [ ] Property browsing
- [ ] Order placement
- [ ] Payment processing
- [ ] Order tracking
- [ ] Review system
- [ ] Order history
- [ ] Profile management

---

This role-based architecture ensures **data privacy**, **security**, **scalability**, and **clear financial boundaries** while providing each user type with the tools they need to succeed in their specific role within the Buffr Host ecosystem.
