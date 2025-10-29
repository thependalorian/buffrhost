# 🛠️ **BUFFR HOST - DEVELOPMENT GUIDE**
*Production-Ready Development Environment with Complete Type Safety*

## 🚀 **GETTING STARTED**

### **Current Status**
- **Frontend**: 95% Complete - Production-ready with full type safety
- **Backend**: 90% Complete - Full API implementation with ML/AI integration
- **Database**: 100% Complete - Complete schema with type alignment
- **Microservices**: 85% Complete - All core services implemented
- **Overall**: 85% Complete - Production-ready hospitality platform

### **Prerequisites**
- **Node.js**: 18.x or higher
- **Python**: 3.11+ (required for ML libraries)
- **PostgreSQL**: 14.x or higher
- **Redis**: 6.x or higher
- **Docker**: 20.x or higher (for microservices)
- **Git**: Latest version

### **Quick Start**
```bash
# Clone repository
git clone https://github.com/your-org/buffr-host.git
cd buffr-host

# Environment setup
cp .env.example .env
cp frontend/.env.example frontend/.env.local

# Database setup
docker-compose up -d postgres redis

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -c "from database import create_tables; create_tables()"
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 🏗️ **PROJECT ARCHITECTURE**

### **Frontend Architecture**
```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin dashboard
│   ├── guest/             # Guest portal
│   ├── protected/         # Protected routes
│   └── api/               # API routes
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Core UI components
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components
│   │   └── etuna/        # Etuna-specific components
│   ├── lib/              # Utilities and configuration
│   │   ├── types/        # TypeScript type definitions
│   │   ├── schemas/      # Zod validation schemas
│   │   └── api-client.ts # API client configuration
│   └── hooks/            # Custom React hooks
├── __tests__/            # Test files
└── public/               # Static assets
```

### **Backend Architecture**
```
backend/
├── ai/                    # AI/ML Systems (18 systems)
│   ├── fraud_detection_system.py
│   ├── recommendation_engine.py
│   └── ... (15 more ML systems)
├── models/                # SQLAlchemy Models
│   ├── user.py           # User and authentication models
│   ├── hospitality_property.py
│   ├── booking.py
│   └── ... (all business models)
├── routes/                # FastAPI Routes
│   ├── auth.py           # Authentication endpoints
│   ├── analytics.py      # Analytics endpoints
│   ├── ml_routes.py      # ML/AI endpoints
│   └── ... (all API endpoints)
├── services/              # Business Logic
│   ├── customer_service.py
│   ├── ml_service.py
│   └── ... (all business services)
├── schemas/               # Pydantic Schemas
│   ├── user.py
│   ├── ml.py
│   └── ... (all data schemas)
├── auth/                  # Authentication
├── utils/                 # Utility functions
├── main.py               # FastAPI application
├── database.py           # Database configuration
└── config.py             # Application configuration
```

### **Microservices Architecture**
```
microservices/
├── api-gateway/           # API Gateway
├── auth-service/          # Authentication Service
├── customer-service/      # Customer Management
├── property-service/      # Property Management
├── booking-service/       # Booking Management
├── menu-service/          # Menu Management
├── order-service/         # Order Management
├── payment-service/       # Payment Processing
├── inventory-service/     # Inventory Management
├── analytics-service/     # Analytics Service
├── notification-service/  # Notification Service
├── audit-service/         # Audit Service
├── document-service/      # Document Service
├── hospitality-service/   # Hospitality Service
├── realtime-service/      # Real-time Service
├── signature-service/     # Signature Service
├── template-service/      # Template Service
├── workflow-service/      # Workflow Service
└── shared/               # Shared utilities
```

---

## 🔧 **DEVELOPMENT WORKFLOW**

### **Type Safety System**
The project uses a comprehensive type safety system:

#### **Frontend Type Safety**
```typescript
// TypeScript interfaces
import { Customer, Booking, Property } from '@/lib/types';

// Zod validation schemas
import { CustomerCreateSchema, BookingUpdateSchema } from '@/lib/schemas';

// API client with full type safety
import { apiServices } from '@/lib/api-client';

// React Query hooks with types
import { useCustomers, useBookings } from '@/hooks/use-customers';
```

#### **Backend Type Safety**
```python
# Pydantic models
from schemas.customer import CustomerCreate, CustomerUpdate
from schemas.booking import BookingCreate, BookingUpdate

# SQLAlchemy models
from models.user import User
from models.booking import Booking

# Type hints throughout
def create_customer(customer_data: CustomerCreate) -> Customer:
    # Implementation with full type safety
```

### **Database Development**
```bash
# Create new migration
cd backend
alembic revision --autogenerate -m "Add new field"

# Apply migrations
alembic upgrade head

# Create tables (development)
python -c "from database import create_tables; create_tables()"
```

### **API Development**
```python
# Add new endpoint
@router.post("/customers", response_model=CustomerResponse)
async def create_customer(
    customer: CustomerCreate,
    db: AsyncSession = Depends(get_db)
):
    # Implementation
```

### **Frontend Development**
```typescript
// Add new component
export function CustomerForm({ onSubmit }: CustomerFormProps) {
  const { mutate: createCustomer } = useCreateCustomer();
  
  const handleSubmit = (data: CustomerCreateInput) => {
    createCustomer(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form implementation */}
    </form>
  );
}
```

---

## 🧪 **TESTING STRATEGY**

### **Frontend Testing**
```bash
# Run all tests
npm test

# Run specific test file
npm test CustomerForm.test.tsx

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### **Backend Testing**
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_customer_service.py

# Run tests with coverage
pytest --cov=backend

# Run ML tests
pytest tests/test_ml_systems.py
```

### **API Testing**
```bash
# Test API endpoints
curl -X POST http://localhost:8000/api/v1/customers \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'

# Test with authentication
curl -X GET http://localhost:8000/api/v1/customers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔍 **DEBUGGING GUIDE**

### **Frontend Debugging**
```typescript
// Use React DevTools
// Enable TypeScript strict mode
// Use console.log for debugging
console.log('Customer data:', customerData);

// Use React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
```

### **Backend Debugging**
```python
# Use Python debugger
import pdb; pdb.set_trace()

# Use logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Use FastAPI debug mode
uvicorn main:app --reload --log-level debug
```

### **Database Debugging**
```sql
-- Check table structure
\d table_name

-- Check data
SELECT * FROM table_name LIMIT 10;

-- Check indexes
\di table_name
```

---

## 📊 **PERFORMANCE OPTIMIZATION**

### **Frontend Optimization**
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Next.js Image component
- **Caching**: React Query for API caching
- **Bundle Analysis**: `npm run analyze`

### **Backend Optimization**
- **Database Indexing**: Proper database indexes
- **Query Optimization**: Efficient SQL queries
- **Caching**: Redis for frequently accessed data
- **Connection Pooling**: Database connection pooling

### **ML/AI Optimization**
- **Model Caching**: Cache trained models
- **Batch Processing**: Process multiple predictions
- **Async Processing**: Non-blocking ML operations
- **Resource Management**: Efficient memory usage

---

## 🔒 **SECURITY BEST PRACTICES**

### **Authentication**
```typescript
// Frontend: Secure token storage
const token = localStorage.getItem('auth_token');
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
```

```python
# Backend: JWT token validation
@router.get("/protected")
async def protected_route(current_user: User = Depends(get_current_user)):
    return {"user": current_user.email}
```

### **Data Validation**
```typescript
// Frontend: Zod validation
const result = CustomerCreateSchema.safeParse(formData);
if (!result.success) {
  setErrors(result.error.issues);
}
```

```python
# Backend: Pydantic validation
@router.post("/customers")
async def create_customer(customer: CustomerCreate):
    # Pydantic automatically validates the data
    pass
```

### **Database Security**
```python
# Row Level Security (RLS)
# Enable RLS on sensitive tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

# Create RLS policies
CREATE POLICY customer_access ON customers
  FOR ALL TO authenticated_user
  USING (user_id = current_user_id());
```

---

## 🚀 **DEPLOYMENT**

### **Development Deployment**
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f service_name
```

### **Production Deployment**
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose exec backend alembic upgrade head
```

### **Microservices Deployment**
```bash
# Deploy individual services
cd microservices
./deploy.sh auth-service
./deploy.sh customer-service

# Deploy all services
./deploy-all.sh
```

---

## 📚 **DOCUMENTATION STANDARDS**

### **Code Documentation**
```typescript
/**
 * Customer management hook
 * @param customerId - The customer ID
 * @returns Customer data and management functions
 */
export function useCustomer(customerId: string) {
  // Implementation
}
```

```python
def create_customer(customer_data: CustomerCreate) -> Customer:
    """
    Create a new customer
    
    Args:
        customer_data: Customer creation data
        
    Returns:
        Created customer object
        
    Raises:
        ValidationError: If customer data is invalid
        DatabaseError: If database operation fails
    """
    # Implementation
```

### **API Documentation**
```python
@router.post(
    "/customers",
    response_model=CustomerResponse,
    status_code=201,
    summary="Create a new customer",
    description="Create a new customer with the provided data"
)
async def create_customer(customer: CustomerCreate):
    """Create a new customer"""
    # Implementation
```

---

## 🎯 **BEST PRACTICES**

### **Code Organization**
- **Single Responsibility**: Each function/component has one purpose
- **DRY Principle**: Don't repeat yourself
- **Consistent Naming**: Use clear, descriptive names
- **Type Safety**: Always use TypeScript types

### **Git Workflow**
```bash
# Create feature branch
git checkout -b feature/customer-management

# Make changes and commit
git add .
git commit -m "feat: add customer management functionality"

# Push and create PR
git push origin feature/customer-management
```

### **Code Review Checklist**
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Type safety is maintained
- [ ] Security best practices followed
- [ ] Performance considerations addressed

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

#### **Frontend Issues**
```bash
# Module not found
npm install missing-package

# TypeScript errors
npm run type-check

# Build errors
npm run build
```

#### **Backend Issues**
```bash
# Import errors
pip install -r requirements.txt

# Database connection
python -c "from database import engine; print(engine.url)"

# ML model errors
python test_all_ml_imports.py
```

#### **Database Issues**
```bash
# Connection issues
docker-compose logs postgres

# Migration issues
alembic current
alembic history
```

---

## 📞 **SUPPORT**

### **Getting Help**
- **Documentation**: Check this guide and other docs
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Code Review**: Request code reviews for complex changes

### **Resources**
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **FastAPI**: [FastAPI Documentation](https://fastapi.tiangolo.com/)
- **SQLAlchemy**: [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

---

**Happy Coding! 🚀**

*Last updated: October 10, 2025*