"""
Buffr Host Analytics Service - Microservice
Handles business intelligence, reporting, and data analytics for Buffr Host platform
"""

import os
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from enum import Enum

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, status, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, create_engine, ForeignKey, Float, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import jwt
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_analytics")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = None

# Security
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")

# Service configuration
SERVICE_NAME = "analytics-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8011))

# Enums
class ReportType(str, Enum):
    SALES = "sales"
    CUSTOMER = "customer"
    INVENTORY = "inventory"
    STAFF = "staff"
    FINANCIAL = "financial"
    OPERATIONAL = "operational"

class MetricType(str, Enum):
    REVENUE = "revenue"
    PROFIT = "profit"
    CUSTOMERS = "customers"
    ORDERS = "orders"
    INVENTORY = "inventory"
    STAFF = "staff"
    PERFORMANCE = "performance"

class TimePeriod(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"

# Database Models
class AnalyticsReport(Base):
    __tablename__ = "analytics_reports"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    report_name = Column(String, nullable=False, index=True)
    report_type = Column(String, nullable=False)
    
    # Report Configuration
    description = Column(Text, nullable=True)
    parameters = Column(JSON, default=dict)
    filters = Column(JSON, default=dict)
    
    # Report Data
    report_data = Column(JSON, default=dict)
    summary = Column(JSON, default=dict)
    
    # Report Status
    status = Column(String, default="generating")  # generating, completed, failed
    generated_at = Column(DateTime, nullable=True)
    generated_by = Column(String, nullable=True)
    
    # Report Settings
    is_scheduled = Column(Boolean, default=False)
    schedule_frequency = Column(String, nullable=True)
    next_run = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Dashboard(Base):
    __tablename__ = "dashboards"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Dashboard Configuration
    layout = Column(JSON, default=dict)
    widgets = Column(JSON, default=list)
    
    # Dashboard Settings
    is_public = Column(Boolean, default=False)
    is_default = Column(Boolean, default=False)
    
    # User Information
    created_by = Column(String, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Metric(Base):
    __tablename__ = "metrics"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    metric_name = Column(String, nullable=False, index=True)
    metric_type = Column(String, nullable=False)
    
    # Metric Configuration
    description = Column(Text, nullable=True)
    calculation_method = Column(String, nullable=False)
    data_source = Column(String, nullable=False)
    
    # Metric Values
    current_value = Column(Numeric(15, 4), nullable=True)
    previous_value = Column(Numeric(15, 4), nullable=True)
    target_value = Column(Numeric(15, 4), nullable=True)
    
    # Metric Settings
    unit = Column(String, nullable=True)
    format_type = Column(String, default="number")  # number, currency, percentage
    is_trending_up = Column(Boolean, nullable=True)
    
    # Timestamps
    last_updated = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class KPI(Base):
    __tablename__ = "kpis"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # KPI Configuration
    metric_id = Column(String, ForeignKey("metrics.id"), nullable=False, index=True)
    target_value = Column(Numeric(15, 4), nullable=True)
    threshold_warning = Column(Numeric(15, 4), nullable=True)
    threshold_critical = Column(Numeric(15, 4), nullable=True)
    
    # KPI Status
    current_status = Column(String, default="normal")  # normal, warning, critical
    last_evaluated = Column(DateTime, nullable=True)
    
    # KPI Settings
    evaluation_frequency = Column(String, default="daily")
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DataExport(Base):
    __tablename__ = "data_exports"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    export_name = Column(String, nullable=False)
    
    # Export Configuration
    export_type = Column(String, nullable=False)  # csv, excel, pdf, json
    data_source = Column(String, nullable=False)
    filters = Column(JSON, default=dict)
    columns = Column(JSON, default=list)
    
    # Export Status
    status = Column(String, default="pending")  # pending, processing, completed, failed
    file_path = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    
    # Export Information
    record_count = Column(Integer, nullable=True)
    exported_by = Column(String, nullable=False)
    exported_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class ReportCreate(BaseModel):
    property_id: str
    report_name: str
    report_type: ReportType
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = {}
    filters: Optional[Dict[str, Any]] = {}
    is_scheduled: bool = False
    schedule_frequency: Optional[str] = None

class DashboardCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    layout: Optional[Dict[str, Any]] = {}
    widgets: Optional[List[Dict[str, Any]]] = []
    is_public: bool = False
    is_default: bool = False

class MetricCreate(BaseModel):
    property_id: str
    metric_name: str
    metric_type: MetricType
    description: Optional[str] = None
    calculation_method: str
    data_source: str
    unit: Optional[str] = None
    format_type: str = "number"

class KPICreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    metric_id: str
    target_value: Optional[float] = None
    threshold_warning: Optional[float] = None
    threshold_critical: Optional[float] = None
    evaluation_frequency: str = "daily"

class ExportCreate(BaseModel):
    property_id: str
    export_name: str
    export_type: str
    data_source: str
    filters: Optional[Dict[str, Any]] = {}
    columns: Optional[List[str]] = []

class SalesAnalytics(BaseModel):
    total_revenue: float
    revenue_growth: float
    total_orders: int
    average_order_value: float
    top_selling_items: List[Dict[str, Any]]
    revenue_by_period: Dict[str, float]
    orders_by_status: Dict[str, int]
    customer_acquisition: int
    customer_retention: float

class CustomerAnalytics(BaseModel):
    total_customers: int
    new_customers: int
    active_customers: int
    customer_growth: float
    average_customer_value: float
    customer_segments: Dict[str, int]
    loyalty_points_issued: int
    loyalty_points_redeemed: int
    customer_satisfaction: float

class InventoryAnalytics(BaseModel):
    total_items: int
    low_stock_items: int
    out_of_stock_items: int
    inventory_value: float
    turnover_rate: float
    items_by_category: Dict[str, int]
    supplier_performance: Dict[str, float]
    waste_percentage: float

class StaffAnalytics(BaseModel):
    total_employees: int
    active_employees: int
    employee_turnover: float
    average_salary: float
    attendance_rate: float
    performance_rating: float
    departments: Dict[str, int]
    positions: Dict[str, int]

class FinancialAnalytics(BaseModel):
    total_revenue: float
    total_costs: float
    gross_profit: float
    net_profit: float
    profit_margin: float
    revenue_growth: float
    cost_growth: float
    cash_flow: float
    payment_methods: Dict[str, float]

class OperationalAnalytics(BaseModel):
    total_bookings: int
    booking_cancellation_rate: float
    average_booking_duration: float
    resource_utilization: float
    customer_satisfaction: float
    service_quality: float
    operational_efficiency: float

class AnalyticsMetrics(BaseModel):
    total_reports: int
    scheduled_reports: int
    total_dashboards: int
    public_dashboards: int
    total_metrics: int
    active_kpis: int
    total_exports: int
    exports_today: int

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Redis connection
async def connect_redis():
    global redis_client
    try:
        redis_client = redis.from_url(REDIS_URL)
        await redis_client.ping()
        logger.info("✅ Redis connected for analytics service")
    except Exception as e:
        logger.warning(f"⚠️ Redis not available: {e}")
        redis_client = None

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"user_id": user_id, "email": payload.get("email"), "role": payload.get("role")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Utility functions
def calculate_growth_rate(current: float, previous: float) -> float:
    """Calculate growth rate percentage"""
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return ((current - previous) / previous) * 100

def calculate_turnover_rate(cost_of_goods_sold: float, average_inventory: float) -> float:
    """Calculate inventory turnover rate"""
    if average_inventory == 0:
        return 0.0
    return cost_of_goods_sold / average_inventory

def calculate_profit_margin(revenue: float, costs: float) -> float:
    """Calculate profit margin percentage"""
    if revenue == 0:
        return 0.0
    return ((revenue - costs) / revenue) * 100

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"🚀 Starting {SERVICE_NAME} v{SERVICE_VERSION}")
    await connect_redis()
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created/verified")
    
    yield
    
    # Shutdown
    if redis_client:
        await redis_client.close()
    logger.info(f"🛑 {SERVICE_NAME} shutdown complete")

# FastAPI app
app = FastAPI(
    title=f"{SERVICE_NAME.title()}",
    description="Business intelligence and analytics microservice",
    version=SERVICE_VERSION,
    lifespan=lifespan
)

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "description": "Business intelligence and analytics",
        "endpoints": {
            "health": "/health",
            "reports": "/api/analytics/reports",
            "dashboards": "/api/analytics/dashboards",
            "metrics": "/api/analytics/metrics",
            "kpis": "/api/analytics/kpis",
            "exports": "/api/analytics/exports",
            "sales": "/api/analytics/sales",
            "customers": "/api/analytics/customers",
            "inventory": "/api/analytics/inventory",
            "staff": "/api/analytics/staff",
            "financial": "/api/analytics/financial",
            "operational": "/api/analytics/operational"
        }
    }

@app.get("/api/analytics/sales", response_model=SalesAnalytics)
async def get_sales_analytics(
    property_id: Optional[str] = None,
    period: TimePeriod = TimePeriod.MONTHLY,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get sales analytics"""
    # This would typically integrate with other services to get real data
    # For now, returning mock data structure
    
    return SalesAnalytics(
        total_revenue=125000.0,
        revenue_growth=15.5,
        total_orders=1250,
        average_order_value=100.0,
        top_selling_items=[
            {"name": "Signature Burger", "quantity": 150, "revenue": 7500.0},
            {"name": "Caesar Salad", "quantity": 120, "revenue": 3600.0},
            {"name": "Chicken Wings", "quantity": 100, "revenue": 2500.0}
        ],
        revenue_by_period={
            "week_1": 30000.0,
            "week_2": 32000.0,
            "week_3": 31000.0,
            "week_4": 32000.0
        },
        orders_by_status={
            "completed": 1200,
            "pending": 30,
            "cancelled": 20
        },
        customer_acquisition=85,
        customer_retention=78.5
    )

@app.get("/api/analytics/customers", response_model=CustomerAnalytics)
async def get_customer_analytics(
    property_id: Optional[str] = None,
    period: TimePeriod = TimePeriod.MONTHLY,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get customer analytics"""
    return CustomerAnalytics(
        total_customers=2500,
        new_customers=150,
        active_customers=1800,
        customer_growth=12.3,
        average_customer_value=85.0,
        customer_segments={
            "bronze": 1200,
            "silver": 800,
            "gold": 400,
            "platinum": 100
        },
        loyalty_points_issued=25000,
        loyalty_points_redeemed=18000,
        customer_satisfaction=4.2
    )

@app.get("/api/analytics/inventory", response_model=InventoryAnalytics)
async def get_inventory_analytics(
    property_id: Optional[str] = None,
    period: TimePeriod = TimePeriod.MONTHLY,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get inventory analytics"""
    return InventoryAnalytics(
        total_items=500,
        low_stock_items=25,
        out_of_stock_items=5,
        inventory_value=45000.0,
        turnover_rate=6.5,
        items_by_category={
            "food": 300,
            "beverages": 150,
            "supplies": 50
        },
        supplier_performance={
            "Supplier A": 95.0,
            "Supplier B": 88.0,
            "Supplier C": 92.0
        },
        waste_percentage=3.2
    )

@app.get("/api/analytics/staff", response_model=StaffAnalytics)
async def get_staff_analytics(
    property_id: Optional[str] = None,
    period: TimePeriod = TimePeriod.MONTHLY,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get staff analytics"""
    return StaffAnalytics(
        total_employees=45,
        active_employees=42,
        employee_turnover=8.5,
        average_salary=25000.0,
        attendance_rate=94.2,
        performance_rating=4.1,
        departments={
            "Kitchen": 15,
            "Service": 20,
            "Management": 5,
            "Support": 5
        },
        positions={
            "Chef": 8,
            "Server": 15,
            "Manager": 5,
            "Host": 5
        }
    )

@app.get("/api/analytics/financial", response_model=FinancialAnalytics)
async def get_financial_analytics(
    property_id: Optional[str] = None,
    period: TimePeriod = TimePeriod.MONTHLY,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get financial analytics"""
    return FinancialAnalytics(
        total_revenue=125000.0,
        total_costs=85000.0,
        gross_profit=40000.0,
        net_profit=25000.0,
        profit_margin=20.0,
        revenue_growth=15.5,
        cost_growth=12.0,
        cash_flow=22000.0,
        payment_methods={
            "card": 75000.0,
            "cash": 30000.0,
            "mobile_money": 20000.0
        }
    )

@app.get("/api/analytics/operational", response_model=OperationalAnalytics)
async def get_operational_analytics(
    property_id: Optional[str] = None,
    period: TimePeriod = TimePeriod.MONTHLY,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get operational analytics"""
    return OperationalAnalytics(
        total_bookings=800,
        booking_cancellation_rate=5.2,
        average_booking_duration=2.5,
        resource_utilization=78.5,
        customer_satisfaction=4.2,
        service_quality=4.3,
        operational_efficiency=85.0
    )

@app.post("/api/analytics/reports")
async def create_report(
    report_data: ReportCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new analytics report"""
    new_report = AnalyticsReport(
        property_id=report_data.property_id,
        report_name=report_data.report_name,
        report_type=report_data.report_type,
        description=report_data.description,
        parameters=report_data.parameters,
        filters=report_data.filters,
        is_scheduled=report_data.is_scheduled,
        schedule_frequency=report_data.schedule_frequency,
        generated_by=current_user["user_id"]
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    logger.info(f"✅ Analytics report created: {new_report.report_name}")
    
    return {
        "message": "Report created successfully",
        "report_id": new_report.id,
        "report_name": new_report.report_name,
        "status": new_report.status
    }

@app.post("/api/analytics/dashboards")
async def create_dashboard(
    dashboard_data: DashboardCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new dashboard"""
    new_dashboard = Dashboard(
        property_id=dashboard_data.property_id,
        name=dashboard_data.name,
        description=dashboard_data.description,
        layout=dashboard_data.layout,
        widgets=dashboard_data.widgets,
        is_public=dashboard_data.is_public,
        is_default=dashboard_data.is_default,
        created_by=current_user["user_id"]
    )
    
    db.add(new_dashboard)
    db.commit()
    db.refresh(new_dashboard)
    
    logger.info(f"✅ Dashboard created: {new_dashboard.name}")
    
    return {
        "message": "Dashboard created successfully",
        "dashboard_id": new_dashboard.id,
        "name": new_dashboard.name
    }

@app.post("/api/analytics/exports")
async def create_data_export(
    export_data: ExportCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a data export"""
    new_export = DataExport(
        property_id=export_data.property_id,
        export_name=export_data.export_name,
        export_type=export_data.export_type,
        data_source=export_data.data_source,
        filters=export_data.filters,
        columns=export_data.columns,
        exported_by=current_user["user_id"]
    )
    
    db.add(new_export)
    db.commit()
    db.refresh(new_export)
    
    logger.info(f"✅ Data export created: {new_export.export_name}")
    
    return {
        "message": "Data export created successfully",
        "export_id": new_export.id,
        "export_name": new_export.export_name,
        "status": new_export.status
    }

@app.get("/api/analytics/metrics", response_model=AnalyticsMetrics)
async def get_analytics_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics service metrics"""
    # Get report counts
    report_query = db.query(AnalyticsReport)
    if property_id:
        report_query = report_query.filter(AnalyticsReport.property_id == property_id)
    
    total_reports = report_query.count()
    scheduled_reports = report_query.filter(AnalyticsReport.is_scheduled == True).count()
    
    # Get dashboard counts
    dashboard_query = db.query(Dashboard)
    if property_id:
        dashboard_query = dashboard_query.filter(Dashboard.property_id == property_id)
    
    total_dashboards = dashboard_query.count()
    public_dashboards = dashboard_query.filter(Dashboard.is_public == True).count()
    
    # Get metric counts
    metric_query = db.query(Metric)
    if property_id:
        metric_query = metric_query.filter(Metric.property_id == property_id)
    
    total_metrics = metric_query.count()
    
    # Get KPI counts
    kpi_query = db.query(KPI)
    if property_id:
        kpi_query = kpi_query.filter(KPI.property_id == property_id)
    
    active_kpis = kpi_query.filter(KPI.is_active == True).count()
    
    # Get export counts
    export_query = db.query(DataExport)
    if property_id:
        export_query = export_query.filter(DataExport.property_id == property_id)
    
    total_exports = export_query.count()
    
    # Get exports today
    today = datetime.utcnow().date()
    exports_today = export_query.filter(db.func.date(DataExport.created_at) == today).count()
    
    return AnalyticsMetrics(
        total_reports=total_reports,
        scheduled_reports=scheduled_reports,
        total_dashboards=total_dashboards,
        public_dashboards=public_dashboards,
        total_metrics=total_metrics,
        active_kpis=active_kpis,
        total_exports=total_exports,
        exports_today=exports_today
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )