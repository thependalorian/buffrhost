# Buffr Host Development Guide

## Getting Started

This guide provides comprehensive instructions for setting up and contributing to Buffr Host comprehensive hospitality ecosystem management platform. The platform supports restaurants, hotels, spas, conference facilities, and other hospitality services with AI-powered features including RAG (Retrieval Augmented Generation) for knowledge management and Arcade MCP integration for authenticated AI tool calling.

## Prerequisites

### Required Software

- **Python 3.11+**: Backend development
- **Node.js 18+**: Frontend development
- **PostgreSQL 15+**: Database
- **Redis 7+**: Caching and sessions
- **Docker & Docker Compose**: Containerization
- **Git**: Version control

### Recommended Tools

- **VS Code**: Code editor with extensions
- **Postman/Insomnia**: API testing
- **pgAdmin**: Database management
- **RedisInsight**: Redis management

## Project Structure

```
buffr-host/
├── backend/                 # FastAPI backend application
│   ├── models/             # SQLAlchemy database models
│   ├── schemas/            # Pydantic request/response schemas
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   ├── ai/                 # AI modules (Conversational AI, RAG, Recommendations, Loyalty AI)
│   ├── rag/                # RAG pipeline for knowledge management
│   ├── tests/              # Backend tests
│   ├── main.py             # FastAPI application entry point
│   ├── config.py           # Configuration settings
│   ├── database.py         # Database connection setup
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend application
│   ├── app/                # Next.js 14 app directory
│   ├── components/         # React components
│   ├── lib/                # Utility libraries
│   ├── styles/             # CSS and styling
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   └── next.config.js      # Next.js configuration
├── database/               # Database schema and migrations
│   ├── schema.sql          # Complete database schema
│   ├── migrations/         # Alembic migration files
│   └── seeds/              # Sample data
├── docs/                   # Documentation
│   ├── architecture.md     # System architecture
│   ├── api-specification.md # API documentation
│   ├── deployment-guide.md # Deployment instructions
│   └── development-guide.md # This file
├── scripts/                # Utility scripts
│   ├── setup.sh            # Development setup
│   ├── test.sh             # Test runner
│   └── deploy.sh           # Deployment script
├── docker-compose.yml      # Docker development environment
├── .env.example            # Environment variables template
└── README.md               # Project overview
```

## Arcade MCP Integration

Buffr Host integrates with Arcade's MCP (Model Context Protocol) tools to enable AI agents to perform authenticated actions. This integration allows the platform to:

- Send booking confirmation emails via Gmail
- Create calendar events for staff scheduling
- Send Slack notifications for kitchen orders
- Manage guest profiles in Notion
- Execute marketing campaigns

### Arcade Setup

1. **Install Arcade Dependencies**:
   ```bash
   pip install arcade-ai arcade-google
   ```

2. **Configure Arcade API Key**:
   ```bash
   export ARCADE_API_KEY=your_arcade_api_key
   ```

3. **Test Arcade Integration**:
   ```bash
   curl -X GET "http://localhost:8000/api/v1/arcade/status"
   ```

## Development Setup

### 1. Clone and Initialize

```bash
# Clone the repository
git clone https://github.com/georgenekwaya/buffr-host.git
cd buffr-host

# Copy environment template
cp .env.example .env.development

# Edit environment variables
nano .env.development
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install -r requirements-dev.txt

# Set up pre-commit hooks
pre-commit install
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Create database
createdb theshandi_dev

# Run schema
psql theshandi_dev < ../database/schema.sql

# Run migrations
alembic upgrade head

# Seed with sample data
python scripts/seed_data.py
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Install development dependencies
npm install --save-dev

# Set up environment variables
cp .env.example .env.local
```

### 5. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Database (if not using Docker)
# Start PostgreSQL and Redis services
```

## Development Workflow

### Git Workflow

**Branch Naming:**
- `feature/feature-name`: New features
- `bugfix/bug-description`: Bug fixes
- `hotfix/critical-fix`: Critical production fixes
- `refactor/component-name`: Code refactoring

**Commit Messages:**
```
type(scope): description

feat(auth): add JWT token refresh functionality
fix(orders): resolve inventory deduction bug
docs(api): update authentication endpoints
test(menu): add unit tests for menu items
```

### Code Standards

**Python (Backend):**
```python
# Use type hints
def create_menu_item(
    restaurant_id: int,
    menu_data: MenuItemCreate,
    db: AsyncSession = Depends(get_db)
) -> MenuItemResponse:
    """Create a new menu item for a restaurant."""
    # Implementation here
    pass

# Use async/await for database operations
async def get_menu_items(
    restaurant_id: int,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
) -> List[MenuItemResponse]:
    """Get paginated menu items for a restaurant."""
    result = await db.execute(
        select(Menu)
        .where(Menu.restaurant_id == restaurant_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
```

**TypeScript (Frontend):**
```typescript
// Use interfaces for type definitions
interface MenuItem {
  menu_item_id: number;
  name: string;
  description?: string;
  base_price: number;
  is_available: boolean;
}

// Use React hooks properly
const useMenuItems = (restaurantId: number) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/restaurants/${restaurantId}/menu-items`);
        setMenuItems(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  return { menuItems, loading, error };
};
```

### Testing

**Backend Testing:**
```python
# tests/test_menu_items.py
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

@pytest.mark.asyncio
async def test_create_menu_item(
    client: AsyncClient,
    db: AsyncSession,
    restaurant: Restaurant,
    auth_headers: dict
):
    """Test creating a new menu item."""
    menu_data = {
        "category_id": 1,
        "name": "Test Burger",
        "description": "A test burger",
        "base_price": 9.99,
        "preparation_time": 15
    }
    
    response = await client.post(
        f"/restaurants/{restaurant.restaurant_id}/menu-items",
        json=menu_data,
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Test Burger"
    assert data["data"]["base_price"] == 9.99
```

**Frontend Testing:**
```typescript
// __tests__/components/MenuItemCard.test.tsx
import { render, screen } from '@testing-library/react';
import { MenuItemCard } from '@/components/MenuItemCard';

const mockMenuItem = {
  menu_item_id: 1,
  name: 'Test Burger',
  description: 'A test burger',
  base_price: 9.99,
  is_available: true
};

describe('MenuItemCard', () => {
  it('renders menu item information correctly', () => {
    render(<MenuItemCard menuItem={mockMenuItem} />);
    
    expect(screen.getByText('Test Burger')).toBeInTheDocument();
    expect(screen.getByText('A test burger')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('shows unavailable status when item is not available', () => {
    const unavailableItem = { ...mockMenuItem, is_available: false };
    render(<MenuItemCard menuItem={unavailableItem} />);
    
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=. --cov-report=html

# Frontend tests
cd frontend
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## API Development

### Creating New Endpoints

**1. Define Pydantic Schemas:**
```python
# schemas/menu.py
from pydantic import BaseModel, Field
from typing import Optional

class MenuItemCreate(BaseModel):
    category_id: int
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    base_price: float = Field(..., gt=0)
    preparation_time: Optional[int] = Field(None, ge=0)
    calories: Optional[int] = Field(None, ge=0)
    dietary_tags: Optional[str] = None
    for_type: str = Field(default="all", regex="^(dine-in|takeout|delivery|all)$")

class MenuItemResponse(BaseModel):
    menu_item_id: int
    restaurant_id: int
    category_id: int
    name: str
    description: Optional[str]
    base_price: float
    preparation_time: Optional[int]
    calories: Optional[int]
    dietary_tags: Optional[str]
    is_available: bool
    for_type: str
    is_popular: bool
    is_all: bool
    created_at: str
    updated_at: Optional[str]

    class Config:
        from_attributes = True
```

**2. Create Route Handler:**
```python
# routes/menu.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database import get_db
from models.menu import Menu
from schemas.menu import MenuItemCreate, MenuItemResponse
from services.auth import get_current_user
from services.menu import MenuService

router = APIRouter(prefix="/restaurants/{restaurant_id}/menu-items", tags=["menu-items"])

@router.post("/", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    restaurant_id: int,
    menu_data: MenuItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new menu item for a restaurant."""
    # Verify user has access to restaurant
    if current_user.restaurant_id != restaurant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this restaurant"
        )
    
    menu_service = MenuService(db)
    menu_item = await menu_service.create_menu_item(restaurant_id, menu_data)
    
    return MenuItemResponse.from_orm(menu_item)
```

**3. Implement Business Logic:**
```python
# services/menu.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.menu import Menu, MenuCategory
from schemas.menu import MenuItemCreate

class MenuService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_menu_item(
        self, 
        restaurant_id: int, 
        menu_data: MenuItemCreate
    ) -> Menu:
        """Create a new menu item."""
        # Verify category exists and belongs to restaurant
        category = await self.db.execute(
            select(MenuCategory)
            .where(
                MenuCategory.category_id == menu_data.category_id,
                MenuCategory.restaurant_id == restaurant_id
            )
        )
        if not category.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        
        # Create menu item
        menu_item = Menu(
            restaurant_id=restaurant_id,
            **menu_data.dict()
        )
        
        self.db.add(menu_item)
        await self.db.commit()
        await self.db.refresh(menu_item)
        
        return menu_item
```

### Database Migrations

**Creating Migrations:**
```bash
# Generate migration
alembic revision --autogenerate -m "Add menu item dietary tags"

# Review generated migration
cat alembic/versions/xxx_add_menu_item_dietary_tags.py

# Apply migration
alembic upgrade head
```

**Migration Example:**
```python
# alembic/versions/xxx_add_menu_item_dietary_tags.py
"""Add menu item dietary tags

Revision ID: xxx
Revises: yyy
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'xxx'
down_revision = 'yyy'
branch_labels = None
depends_on = None

def upgrade():
    # Add dietary_tags column to menu table
    op.add_column('menu', sa.Column('dietary_tags', sa.String(255), nullable=True))

def downgrade():
    # Remove dietary_tags column
    op.drop_column('menu', 'dietary_tags')
```

## Frontend Development

### Component Development

**Creating React Components:**
```typescript
// components/MenuItemCard.tsx
import React from 'react';
import { MenuItem } from '@/types/menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MenuItemCardProps {
  menuItem: MenuItem;
  onEdit?: (menuItem: MenuItem) => void;
  onDelete?: (menuItem: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  menuItem,
  onEdit,
  onDelete
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getDietaryBadges = (tags?: string) => {
    if (!tags) return null;
    
    return tags.split(',').map((tag, index) => (
      <Badge key={index} variant="secondary" className="mr-1">
        {tag.trim()}
      </Badge>
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{menuItem.name}</CardTitle>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(menuItem)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(menuItem)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {menuItem.description && (
          <p className="text-gray-600 mb-2">{menuItem.description}</p>
        )}
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-green-600">
            {formatPrice(menuItem.base_price)}
          </span>
          {!menuItem.is_available && (
            <Badge variant="destructive">Unavailable</Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {getDietaryBadges(menuItem.dietary_tags)}
        </div>
        
        {menuItem.preparation_time && (
          <p className="text-sm text-gray-500 mt-2">
            Prep time: {menuItem.preparation_time} minutes
          </p>
        )}
      </CardContent>
    </Card>
  );
};
```

### State Management

**Using Zustand for Global State:**
```typescript
// stores/menuStore.ts
import { create } from 'zustand';
import { MenuItem } from '@/types/menu';

interface MenuState {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedCategory: number | null;
  
  // Actions
  setMenuItems: (items: MenuItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (categoryId: number | null) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: number, updates: Partial<MenuItem>) => void;
  removeMenuItem: (id: number) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuItems: [],
  loading: false,
  error: null,
  selectedCategory: null,
  
  setMenuItems: (items) => set({ menuItems: items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
  
  addMenuItem: (item) => set((state) => ({
    menuItems: [...state.menuItems, item]
  })),
  
  updateMenuItem: (id, updates) => set((state) => ({
    menuItems: state.menuItems.map(item =>
      item.menu_item_id === id ? { ...item, ...updates } : item
    )
  })),
  
  removeMenuItem: (id) => set((state) => ({
    menuItems: state.menuItems.filter(item => item.menu_item_id !== id)
  }))
}));
```

### API Integration

**API Client Setup:**
```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1',
  timeout: 10000,
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**API Hooks:**
```typescript
// hooks/useMenuItems.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { MenuItem, MenuItemCreate } from '@/types/menu';

export const useMenuItems = (restaurantId: number) => {
  return useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      const response = await api.get(`/restaurants/${restaurantId}/menu-items`);
      return response.data.data;
    },
    enabled: !!restaurantId,
  });
};

export const useCreateMenuItem = (restaurantId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (menuData: MenuItemCreate) => {
      const response = await api.post(
        `/restaurants/${restaurantId}/menu-items`,
        menuData
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', restaurantId] });
    },
  });
};
```

## Debugging

### Backend Debugging

**Logging Configuration:**
```python
# backend/utils/logging.py
import logging
import sys
from typing import Any, Dict

def setup_logging(level: str = "INFO") -> None:
    """Set up structured logging for the application."""
    
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('app.log')
        ]
    )

def log_request(request_data: Dict[str, Any]) -> None:
    """Log incoming request data."""
    logger = logging.getLogger(__name__)
    logger.info(f"Request: {request_data}")

def log_response(response_data: Dict[str, Any]) -> None:
    """Log outgoing response data."""
    logger = logging.getLogger(__name__)
    logger.info(f"Response: {response_data}")
```

**Database Query Debugging:**
```python
# Enable SQL query logging
import logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Use SQLAlchemy echo for debugging
engine = create_async_engine(
    settings.database_url,
    echo=True  # This will log all SQL queries
)
```

### Frontend Debugging

**React Developer Tools:**
- Install React Developer Tools browser extension
- Use React Query DevTools for API state debugging
- Use Redux DevTools for state management debugging

**Console Debugging:**
```typescript
// Add debug logging
const useMenuItems = (restaurantId: number) => {
  const query = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: async () => {
      console.log('Fetching menu items for restaurant:', restaurantId);
      const response = await api.get(`/restaurants/${restaurantId}/menu-items`);
      console.log('Menu items response:', response.data);
      return response.data.data;
    },
  });

  console.log('Query state:', query);
  return query;
};
```

## Performance Optimization

### Backend Optimization

**Database Query Optimization:**
```python
# Use select_related for foreign key relationships
async def get_menu_items_with_categories(db: AsyncSession):
    result = await db.execute(
        select(Menu)
        .options(selectinload(Menu.category))
        .options(selectinload(Menu.media))
    )
    return result.scalars().all()

# Use pagination for large datasets
async def get_paginated_menu_items(
    db: AsyncSession,
    restaurant_id: int,
    skip: int = 0,
    limit: int = 20
):
    result = await db.execute(
        select(Menu)
        .where(Menu.restaurant_id == restaurant_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
```

**Caching Implementation:**
```python
# backend/utils/cache.py
import redis
import json
from typing import Any, Optional

redis_client = redis.Redis.from_url(settings.redis_url)

async def get_cached_data(key: str) -> Optional[Any]:
    """Get data from Redis cache."""
    try:
        data = redis_client.get(key)
        return json.loads(data) if data else None
    except Exception as e:
        logging.error(f"Cache get error: {e}")
        return None

async def set_cached_data(key: str, data: Any, ttl: int = 3600) -> None:
    """Set data in Redis cache with TTL."""
    try:
        redis_client.setex(key, ttl, json.dumps(data))
    except Exception as e:
        logging.error(f"Cache set error: {e}")
```

### Frontend Optimization

**Code Splitting:**
```typescript
// Lazy load components
import { lazy, Suspense } from 'react';

const MenuManagement = lazy(() => import('@/components/MenuManagement'));
const OrderManagement = lazy(() => import('@/components/OrderManagement'));

const Dashboard = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MenuManagement />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <OrderManagement />
      </Suspense>
    </div>
  );
};
```

**Memoization:**
```typescript
// Use React.memo for expensive components
const MenuItemCard = React.memo<MenuItemCardProps>(({ menuItem, onEdit, onDelete }) => {
  // Component implementation
});

// Use useMemo for expensive calculations
const filteredMenuItems = useMemo(() => {
  return menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [menuItems, searchTerm]);
```

## Contributing

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the coding standards
4. **Write tests** for new functionality
5. **Run tests** to ensure everything passes
6. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
7. **Push to your branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Code Review Checklist

**Backend:**
- [ ] Code follows Python style guidelines (PEP 8)
- [ ] Type hints are used for all functions
- [ ] Database queries are optimized
- [ ] Error handling is implemented
- [ ] Tests are written and passing
- [ ] Documentation is updated

**Frontend:**
- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Accessibility considerations are met
- [ ] Performance is optimized
- [ ] Tests are written and passing
- [ ] UI/UX is consistent with design system

### Issue Reporting

When reporting issues, please include:
- **Environment details** (OS, Node.js version, Python version)
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** or error messages
- **Relevant code** or configuration

This development guide provides a comprehensive foundation for contributing to The Shandi platform. Follow these guidelines to ensure consistent, high-quality code and smooth collaboration.
