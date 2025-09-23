# Shandi: Comprehensive Hospitality Ecosystem Management
## Design and Planning Documentation

The Shandi platform is a comprehensive hospitality ecosystem management solution that supports restaurants, hotels, spas, conference facilities, and other hospitality services. The platform includes AI-powered features including RAG (Retrieval Augmented Generation) for knowledge management, conversational AI for guest services, and intelligent recommendations across all hospitality services.

## Table of Contents

1. [System Architecture](#system-architecture)
   - [Overview](#overview)
2. [Product Design](#product-design)
   - [Desktop Optimized Web App for Restaurants](#desktop-optimized-web-app-for-restaurants)
3. [Implementation](#implementation)
   - [Features for Restaurants](#features-for-restaurants)
   - [Features for Restaurant Customers](#features-for-restaurant-customers)
   - [Landing Page After QR Code is Scanned](#landing-page-after-qr-code-is-scanned)
   - [Menu Item Screen](#menu-item-screen)
   - [Check Out Cart](#check-out-cart)
   - [Features for Hospitality Services](#features-for-hospitality-services)
4. [Test Plan](#test-plan)
5. [Roll Out Plan and Objectives](#roll-out-plan-and-objectives)

## System Architecture

### Overview

The system architecture of this codebase is designed to provide a seamless and efficient user experience by leveraging modern web technologies and cloud services. The architecture is divided into several key components, each responsible for specific functionalities within the application.

#### 1. Frontend
The front end is built using Next.js, a React framework that enables server-side rendering and static site generation. The main components of the frontend include:

- **Pages**: Located in the app directory, these are the main entry points for different routes in the application.
- **Components**: Reusable UI components used throughout the application.
- **Hooks**: Custom hooks to encapsulate reusable logic.
- **Context**: Context providers for managing global state.
- **Styling**: Managed using Tailwind CSS, a utility-first CSS framework.

#### 2. Backend
The backend is primarily managed through FastAPI with PostgreSQL, which provides authentication, database management, and file storage capabilities.

- **FastAPI Configuration**: Configuration and initialization of FastAPI services.
- **API Routes**: Server-side logic for handling requests.
- **Database Models**: SQLAlchemy models for data persistence.
- **Authentication**: JWT-based authentication system.

#### 3. Authentication
Authentication is handled using JWT tokens with bcrypt password hashing. Users can sign in and sign out, and their sessions are managed securely.

#### 4. Database
PostgreSQL is used as the primary database with pgvector extension for AI features. It stores information about hospitality properties, menu items, orders, rooms, reservations, and categories. The database includes vector storage for AI embeddings and semantic search capabilities.

#### 5. Storage
File storage is handled through cloud services (AWS S3) for images and other files.

#### 6. Utilities
Utility functions and configurations that support various functionalities, such as JWT generation and custom hooks.

#### 7. AI and RAG Integration
The platform includes comprehensive AI features:
- **RAG Pipeline**: Document processing and semantic search for knowledge management
- **Conversational AI**: 24/7 guest support and automated customer service
- **Recommendation Engine**: AI-powered cross-service recommendations
- **Loyalty AI**: Intelligent campaign optimization and customer segmentation

#### 8. Deployment
The application is configured to be deployed on Vercel for frontend and cloud platforms for backend services.

*This overview provides a high-level understanding of the system architecture, highlighting the main components and their roles within the application.*

## Product Design

### Desktop Optimized Web App for Hospitality Management

The desktop application is designed for hospitality staff and management to efficiently manage all aspects of their operations across restaurants, hotels, spas, conference facilities, and other hospitality services. The interface is optimized for desktop use with comprehensive dashboards and management tools.

**Key Design Principles:**
- **Intuitive Navigation**: Clear menu structure with logical grouping of features
- **Real-time Updates**: Live data updates for orders, inventory, and analytics
- **Responsive Design**: Adapts to different screen sizes while maintaining functionality
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Performance**: Optimized for fast loading and smooth interactions

## Implementation

### Features for Hospitality Properties

#### Dashboard Features
- **Revenue Projections**: Projected number of guests and revenue for given time frames
- **Peak Time Analysis**: Identification of busiest periods and capacity planning
- **Best Selling Items**: Top-performing menu items with sales analytics
- **Supply Management**: Inventory tracking with automated reorder alerts
- **Revenue Comparison**: Monthly revenue vs. previous month or year-over-year analysis
- **Real-time Metrics**: Live updates on orders, customers, and performance indicators
- **AI-Powered Insights**: RAG-powered business intelligence and natural language queries
- **Cross-Service Analytics**: Comprehensive reporting across all hospitality services

#### Menu Management
- **Category Organization**: Hierarchical menu structure with drag-and-drop reordering
- **Item Management**: Complete CRUD operations for menu items
- **Media Management**: Image upload and optimization for menu items
- **Pricing Control**: Dynamic pricing with modifier and option pricing
- **Availability Toggle**: Real-time menu item availability management
- **Nutritional Information**: Dietary tags and allergen information management

#### Order Management
- **Order Queue**: Displays incoming orders in real-time with customizable sorting options
- **Order Details**: Complete order information including items, quantities, modifiers, and special instructions
- **Status Updates**: Order status management (received, in preparation, ready, completed)
- **Table/Room Assignment**: Assign orders to specific tables or rooms for dine-in or room service
- **Kitchen Display System (KDS)**: Integration with kitchen display systems for order preparation
- **Payment Management**: Payment status tracking, receipt generation, and refund processing
- **Customer Information**: Access to customer details for communication and order customization
- **Order History**: Historical order data for customer preference analysis
- **Issue Tracking**: Log and resolve order-related issues with customer communication

#### AI and RAG Features
- **Knowledge Base Management**:
  - Document upload and processing (PDF, TXT, MD, DOCX, HTML)
  - Semantic search and retrieval
  - Contextual Q&A with confidence scoring
  - Source attribution and citation
- **Conversational AI**:
  - 24/7 guest support and automated customer service
  - Multi-language support for international guests
  - Integration with booking and loyalty systems
  - Human escalation when needed
- **Intelligent Recommendations**:
  - Cross-service recommendations across all hospitality amenities
  - Personalized guest experiences based on preferences
  - Seasonal and contextual recommendations
  - AI-powered loyalty campaign optimization

#### Settings Management
- **General Settings**:
  - Language preferences and localization
  - Table layout configuration and QR code setup
  - Operating hours and service availability
- **Account Settings**:
  - Profile management and user roles
  - Subscription and billing management
- **Notifications**:
  - Customer feedback notifications
  - System alerts and inventory management notifications
  - Order and operational alerts
- **Order Management**:
  - Operating hours configuration
  - Order limits and capacity management
  - Preparation time settings
- **Payment Settings**:
  - Bank integration for payment processing
  - Payment method configuration
- **Reporting & Analytics**:
  - Order report controls
  - Dashboard customization options
- **AI Configuration**:
  - RAG pipeline settings and knowledge base management
  - Conversational AI configuration and training
  - Recommendation engine parameters
- **Support**:
  - Help documentation and contact information

### Features for Hospitality Customers

#### Landing Page After QR Code is Scanned

**Content Structure:**

| Content | Type | Details |
|---------|------|---------|
| Cover Image | Element - Image | Restaurant logo displayed at the top of the page |
| Welcome Text | Element - Text | "Welcome to {Restaurant Name}" |
| Specialties/Popular Carousel | Element - Horizontal Scroll | Label: "Our Specialties" or "Popular" |
| Menu Items - Carousel | Component - Card | Squircle card containing: |

**Menu Item Card Components:**

| Content | Type | Details |
|---------|------|---------|
| Item Image | Image | Large image of the food item |
| Item Name | Text | Name of food item |
| Item Price | Text | Price of item |
| Item Description | Text | Brief description |
| Nutrition (Optional) | Text | Dietary categories (Vegan, GF, etc.) |

**Menu Navigation:**

| Content | Type | Details |
|---------|------|---------|
| Categories | Components - Horizontal Scroll | Below menu items with search bar to the right |
| Menu Search | Element - Text Input | Text input for finding menu items by name |
| Menu Search Results | Component - Card | Long horizontal card containing: |

**Search Results Card:**

| Content | Type | Details |
|---------|------|---------|
| Item Image | Image | Image of the food item |
| Item Name | Text | Name of food item |
| Item Price | Text | Price of item |

**Category Display:**

| Content | Type | Details |
|---------|------|---------|
| Category Title | Component - Text | Large food item title located over all menu items |
| Menu Items - Categorized | Component - Card | Same format as main menu items |

**Cart Integration:**

| Content | Type | Details |
|---------|------|---------|
| Cart | Element - Dynamic Text | Hovering squircle with shopping cart and total price |

### Menu Item Screen

**Content Structure:**

| Content | Type | Details |
|---------|------|---------|
| Item Image | Element - Image | High resolution image of the item |
| Item Name | Element - Text | Name of item |
| Item Description | Element - Text | Full description of item |
| Item Nutrition | Element - Text | Optional dietary information (vegan, GF, etc.) |
| Item Customization | Component - Dropdown | Restaurant-customizable dropdown design |

**Customization Dropdown:**

| Content | Type | Details |
|---------|------|---------|
| Customization Name | Text | Type of customization |
| Required? | Text | Is this customization required or optional |
| Selection Requirement | Text | Number currently selected, required, max allowed |
| Selection Options | Component | See breakdown below |

**Selection Options Component:**

| Content | Type | Details |
|---------|------|---------|
| Box/Button | Icon | Radio for single select, checkbox for multiple |
| Selection Name | Text | Name of selection/add-on |
| Price Change | Text | Impact on listed price of item |

**Quantity and Actions:**

| Content | Type | Details |
|---------|------|---------|
| Quantity Toggle | Element - Multi-button | Plus/minus buttons with quantity display |
| Special Instructions | Element - Text Input | Text box for kitchen instructions |
| Add to Cart | Element - Button | "Add {item name}" with total price display |

### Check Out Cart

**Content Structure:**

| Content | Type | Details |
|---------|------|---------|
| Restaurant Logo | Element - Image | Same icon from initial page |
| Restaurant Name | Element - Text | Restaurant name |
| Cart Items | Component | Individual item management |

**Cart Item Components:**

| Content | Type | Details |
|---------|------|---------|
| Item Image | Image | Image of item |
| Item Name | Text | Item name |
| Customizations | Text | List of all customizations, comma separated |
| Price | Text | Total price considering quantity |
| Edit | Text | Link to edit screen (mimics Menu Item Screen) |
| Quantity Toggle | Multi-button | Add/subtract with quantity display |

**Additional Cart Features:**

| Content | Type | Details |
|---------|------|---------|
| Add More | Element - Button | Prompt to add more items |
| Recommendations | Element - Past Components | Use specialties/popular carousel format |
| Subtotal | Element - Text | Subtotal line |
| Tax | Element - Text | Tax line |
| Tip | Element - Text | Tip line calculated by tip card |

**Tip Selection Card:**

| Content | Type | Details |
|---------|------|---------|
| Title | Text | "Select Tip Amount" |
| Amounts | Buttons | 10%, 15%, 20%, etc. |
| Custom Amount | Text Input | "Type the amount" |
| No tip | Button | No tip option |

**Checkout Information:**

| Content | Type | Details |
|---------|------|---------|
| Total Cost | Element - Text | Total cost of the order |
| Customer Info | Element - Text | "Customer Information" |
| Description | Element - Text | Contact information usage explanation |
| Name | Element - Text Input | Customer name |
| Email | Element - Text Input | Customer email |
| Number | Element - Text Input | Customer phone number |
| Agreements | Elements - Check Boxes | Terms of Service and Privacy Policy agreement |
| Communication Agreement | Element - Check Box | SMS/Email communication consent |
| Check Out | Element - Button | "Check Out" button with total amount |

### Features for Hospitality Services

#### Dashboard
- **Guest Projections**: Projected number of guests in restaurants/revenue for given time frames
- **Peak Time Analysis**: Identification of peak times for restaurants
- **Best Selling Items**: Analysis of most popular menu items
- **Supply Management**: Inventory tracking and management
- **Revenue Analytics**: Monthly revenue vs. last month or year-over-year comparison
- **AI-Powered Insights**: RAG-powered business intelligence and natural language queries
- **Cross-Service Analytics**: Comprehensive reporting across all hospitality services

#### Restaurant Menu Management
- **Menu Organization**: Hierarchical menu structure with categories
- **Item Management**: Complete menu item lifecycle management
- **Pricing Control**: Dynamic pricing with modifiers and options
- **Availability Management**: Real-time menu item availability
- **Media Management**: Image and content management for menu items

#### Room Management
- **Room Assignment**: Table and room assignment for orders
- **Layout Management**: Visual table layout configuration
- **QR Code Setup**: QR code generation and management for tables/rooms
- **Service Areas**: Different service area management (dine-in, room service, takeout)

#### Comprehensive Hotel Services Management
- **Spa Services**: Booking management, treatment scheduling, and loyalty point integration
- **Conference Facilities**: Meeting room bookings, event hosting, and corporate event management
- **Shuttle Services**: Airport shuttles, local transportation, and tour service scheduling
- **Camping Facilities**: Campsite bookings, RV hookup management, and outdoor activity coordination
- **Recreation Services**: Golf, tennis, swimming, and recreational activity management
- **Business Center**: Printing, faxing, and business service management
- **Laundry Services**: Dry cleaning, laundry, and pressing service coordination
- **Valet Parking**: Valet service management and parking privilege tracking
- **Concierge Services**: Personalized assistance and local recommendation management
- **Gift Shop**: Merchandise sales and souvenir purchase tracking
- **Multi-Service Integration**: Unified loyalty system across all hotel amenities

#### AI and RAG Integration for Hospitality Services
- **Knowledge Base Management**: Document processing and semantic search for hospitality knowledge
- **Conversational AI**: 24/7 guest support across all hospitality services
- **Intelligent Recommendations**: AI-powered cross-service recommendations and personalization
- **Loyalty AI**: Intelligent campaign optimization and customer segmentation
- **Business Intelligence**: RAG-powered insights and natural language queries for operational data

#### Order Management
- **Order Queue**: Real-time order display with customizable sorting
- **Order Details**: Complete order information and customization tracking
- **Status Management**: Order status updates and workflow management
- **Table/Room Assignment**: Order assignment to specific locations
- **Kitchen Integration**: KDS integration for order preparation
- **Payment Processing**: Payment status and receipt management
- **Customer Communication**: Customer information access and communication tools
- **Order History**: Historical order analysis and customer preferences
- **Issue Resolution**: Order issue tracking and customer resolution

#### Settings
- **General Settings**:
  - Language preferences
  - Table layout and QR code setup
- **Account Settings**:
  - Profile management
  - Subscription and billing
- **Notifications**:
  - Customer feedback notifications
  - System alerts and inventory management
- **Order Management**:
  - Operating hours
  - Order limits and preparation times
- **Payment Settings**:
  - Bank integration for payment processing
- **Reporting & Analytics**:
  - Order reports and dashboard controls
- **AI Configuration**:
  - RAG pipeline settings and knowledge base management
  - Conversational AI configuration and training
  - Recommendation engine parameters
- **Support**:
  - Help documentation and contact information

#### Profile Management
- **User Profile**: Personal information and preferences
- **Role Management**: User roles and permissions
- **Hospitality Property Association**: Multi-property access management
- **Notification Preferences**: Customizable notification settings
- **AI Preferences**: Personalization settings for AI recommendations and interactions

## Test Plan

### Unit Testing
- **Component Testing**: Individual React component functionality
- **API Testing**: Backend endpoint validation
- **Database Testing**: Data integrity and relationship validation
- **Authentication Testing**: Login/logout and permission validation
- **AI Module Testing**: RAG pipeline, conversational AI, and recommendation engine functionality
- **Vector Store Testing**: Semantic search and embedding functionality

### Integration Testing
- **Order Workflow**: Complete order processing from creation to completion
- **Payment Integration**: Payment processing with external providers
- **Inventory Management**: Real-time inventory updates and alerts
- **Customer Management**: Customer profile and loyalty point management
- **AI Integration**: RAG pipeline integration with business operations
- **Cross-Service Integration**: Multi-service hospitality operations testing

### End-to-End Testing
- **Customer Journey**: Complete customer ordering experience
- **Hospitality Management**: Full hospitality operation workflow
- **Multi-tenant Testing**: Multiple hospitality property management
- **Performance Testing**: Load testing and performance validation
- **AI Feature Testing**: End-to-end AI functionality testing

### User Acceptance Testing
- **Hospitality Staff**: Staff workflow validation
- **Customer Experience**: Customer interface usability
- **Administrative Functions**: Management tool effectiveness
- **Mobile Responsiveness**: Cross-device compatibility
- **AI Feature Usability**: AI-powered feature user experience validation

## Roll Out Plan and Objectives

### Phase 1: Foundation (Weeks 1-2)
**Objectives:**
- Complete database schema implementation
- Establish core API endpoints
- Set up authentication system
- Create basic frontend structure

**Deliverables:**
- Functional database with all 20 tables
- Core REST API endpoints
- JWT authentication system
- Basic React component structure

### Phase 2: Core Features (Weeks 3-4)
**Objectives:**
- Implement restaurant management features
- Create customer ordering interface
- Set up order processing workflow
- Implement inventory management

**Deliverables:**
- Restaurant dashboard
- Customer mobile interface
- Order management system
- Inventory tracking system

### Phase 3: Advanced Features (Weeks 5-6)
**Objectives:**
- Implement analytics and reporting
- Add payment processing integration
- Create loyalty program features
- Set up notification systems
- Implement AI and RAG features

**Deliverables:**
- Business intelligence dashboard
- Payment processing integration
- Customer loyalty system
- Real-time notification system
- RAG pipeline for knowledge management
- Conversational AI for guest support
- Recommendation engine
- Loyalty AI optimization

### Phase 4: Testing & Optimization (Weeks 7-8)
**Objectives:**
- Comprehensive testing across all features
- Performance optimization
- Security audit and fixes
- User acceptance testing

**Deliverables:**
- Tested and optimized application
- Security audit report
- Performance benchmarks
- User feedback integration

### Phase 5: Deployment & Launch (Weeks 9-10)
**Objectives:**
- Production deployment setup
- User training and documentation
- Soft launch with select restaurants
- Full public launch

**Deliverables:**
- Production-ready application
- User documentation and training materials
- Launch marketing materials
- Customer support system

### Success Metrics
- **Technical Metrics**:
  - 99.9% uptime
  - <2 second page load times
  - Zero critical security vulnerabilities
  - 100% test coverage for core features
  - AI response time <3 seconds
  - RAG pipeline accuracy >90%

- **Business Metrics**:
  - 50+ hospitality properties onboarded in first month
  - 1000+ customer orders processed
  - 90%+ customer satisfaction rating
  - 25% increase in hospitality efficiency
  - 80%+ AI feature adoption rate

- **User Experience Metrics**:
  - <3 clicks to complete order
  - 95%+ mobile responsiveness score
  - 90%+ accessibility compliance
  - <5% user error rate
  - 85%+ AI feature satisfaction rating

### Risk Mitigation
- **Technical Risks**:
  - Database performance optimization
  - Payment processing reliability
  - Mobile compatibility testing
  - Security vulnerability management
  - AI model accuracy and reliability
  - RAG pipeline performance optimization

- **Business Risks**:
  - Hospitality property onboarding support
  - Customer adoption strategies
  - Competitive response planning
  - Regulatory compliance assurance
  - AI feature adoption and training

- **Operational Risks**:
  - Customer support scaling
  - Training and documentation
  - Quality assurance processes
  - Continuous improvement planning
  - AI model maintenance and updates