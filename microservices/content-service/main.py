"""
Buffr Host Content Service - Microservice
Handles content management, media, and digital assets for Buffr Host platform
"""

import os
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from enum import Enum

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, status, Depends, Query, UploadFile, File
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
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_content")
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
SERVICE_NAME = "content-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8014))

# Enums
class ContentType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"
    TEXT = "text"
    HTML = "html"
    JSON = "json"

class MediaType(str, Enum):
    JPEG = "jpeg"
    PNG = "png"
    GIF = "gif"
    WEBP = "webp"
    MP4 = "mp4"
    AVI = "avi"
    MOV = "mov"
    MP3 = "mp3"
    WAV = "wav"
    PDF = "pdf"
    DOC = "doc"
    DOCX = "docx"
    TXT = "txt"

class ContentStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    DELETED = "deleted"

class ContentCategory(str, Enum):
    MENU = "menu"
    PROMOTION = "promotion"
    EVENT = "event"
    NEWS = "news"
    GALLERY = "gallery"
    DOCUMENT = "document"
    TEMPLATE = "template"
    GENERAL = "general"

# Database Models
class Content(Base):
    __tablename__ = "content"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Content Information
    content_type = Column(String, nullable=False)
    media_type = Column(String, nullable=True)
    category = Column(String, nullable=False)
    status = Column(String, default=ContentStatus.DRAFT)
    
    # Content Data
    content_data = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)
    file_url = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    
    # Media Information
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    duration = Column(Integer, nullable=True)  # for video/audio in seconds
    thumbnail_url = Column(String, nullable=True)
    
    # Content Metadata
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    alt_text = Column(String, nullable=True)
    caption = Column(Text, nullable=True)
    
    # SEO Information
    seo_title = Column(String, nullable=True)
    seo_description = Column(Text, nullable=True)
    seo_keywords = Column(JSON, default=list)
    
    # Content Settings
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    
    # User Information
    created_by = Column(String, nullable=False)
    updated_by = Column(String, nullable=True)
    
    # Timestamps
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ContentTemplate(Base):
    __tablename__ = "content_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Template Configuration
    template_type = Column(String, nullable=False)  # email, sms, web, document
    category = Column(String, nullable=False)
    
    # Template Content
    template_data = Column(Text, nullable=False)
    variables = Column(JSON, default=list)
    
    # Template Settings
    is_active = Column(Boolean, default=True)
    is_public = Column(Boolean, default=False)
    
    # Template Metadata
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    
    # User Information
    created_by = Column(String, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MediaLibrary(Base):
    __tablename__ = "media_library"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    filename = Column(String, nullable=False, index=True)
    original_filename = Column(String, nullable=False)
    
    # Media Information
    content_type = Column(String, nullable=False)
    media_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    file_path = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    
    # Media Properties
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    duration = Column(Integer, nullable=True)
    bitrate = Column(Integer, nullable=True)
    
    # Media Metadata
    metadata = Column(JSON, default=dict)
    exif_data = Column(JSON, default=dict)
    
    # Media Status
    is_processed = Column(Boolean, default=False)
    processing_status = Column(String, default="pending")
    thumbnail_generated = Column(Boolean, default=False)
    thumbnail_url = Column(String, nullable=True)
    
    # Usage Information
    usage_count = Column(Integer, default=0)
    last_used_at = Column(DateTime, nullable=True)
    
    # User Information
    uploaded_by = Column(String, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ContentVersion(Base):
    __tablename__ = "content_versions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content_id = Column(String, ForeignKey("content.id"), nullable=False, index=True)
    
    # Version Information
    version_number = Column(Integer, nullable=False)
    version_notes = Column(Text, nullable=True)
    
    # Version Data
    content_data = Column(Text, nullable=True)
    file_path = Column(String, nullable=True)
    file_url = Column(String, nullable=True)
    
    # Version Metadata
    changes = Column(JSON, default=dict)
    metadata = Column(JSON, default=dict)
    
    # User Information
    created_by = Column(String, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

class ContentCollection(Base):
    __tablename__ = "content_collections"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Collection Information
    collection_type = Column(String, nullable=False)  # gallery, album, playlist, etc.
    status = Column(String, default=ContentStatus.DRAFT)
    
    # Collection Settings
    is_public = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    
    # Collection Metadata
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    
    # User Information
    created_by = Column(String, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CollectionItem(Base):
    __tablename__ = "collection_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    collection_id = Column(String, ForeignKey("content_collections.id"), nullable=False, index=True)
    content_id = Column(String, ForeignKey("content.id"), nullable=False, index=True)
    
    # Item Information
    sort_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    
    # Item Metadata
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    added_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class ContentCreate(BaseModel):
    property_id: str
    title: str
    description: Optional[str] = None
    content_type: ContentType
    media_type: Optional[MediaType] = None
    category: ContentCategory
    content_data: Optional[str] = None
    file_path: Optional[str] = None
    file_url: Optional[str] = None
    file_size: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[int] = None
    thumbnail_url: Optional[str] = None
    tags: Optional[List[str]] = []
    metadata: Optional[Dict[str, Any]] = {}
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[List[str]] = []
    is_public: bool = True
    is_featured: bool = False
    sort_order: int = 0

class ContentTemplateCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    template_type: str
    category: ContentCategory
    template_data: str
    variables: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    metadata: Optional[Dict[str, Any]] = {}

class ContentCollectionCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    collection_type: str
    tags: Optional[List[str]] = []
    metadata: Optional[Dict[str, Any]] = {}
    is_public: bool = True
    sort_order: int = 0

class ContentResponse(BaseModel):
    id: str
    property_id: str
    title: str
    description: Optional[str]
    content_type: str
    media_type: Optional[str]
    category: str
    status: str
    content_data: Optional[str]
    file_path: Optional[str]
    file_url: Optional[str]
    file_size: Optional[int]
    width: Optional[int]
    height: Optional[int]
    duration: Optional[int]
    thumbnail_url: Optional[str]
    tags: List[str]
    metadata: Dict[str, Any]
    alt_text: Optional[str]
    caption: Optional[str]
    seo_title: Optional[str]
    seo_description: Optional[str]
    seo_keywords: List[str]
    is_public: bool
    is_featured: bool
    sort_order: int
    created_by: str
    updated_by: Optional[str]
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

class ContentMetrics(BaseModel):
    total_content: int
    published_content: int
    draft_content: int
    archived_content: int
    total_templates: int
    active_templates: int
    total_media: int
    total_collections: int
    content_by_type: Dict[str, int]
    content_by_category: Dict[str, int]
    media_by_type: Dict[str, int]
    storage_used_mb: float
    average_file_size: float

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
        logger.info("✅ Redis connected for content service")
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
def generate_content_id() -> str:
    """Generate unique content ID"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"CNT-{timestamp}-{random_suffix}"

def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return filename.split('.')[-1].lower() if '.' in filename else ''

def get_content_type_from_extension(extension: str) -> str:
    """Determine content type from file extension"""
    image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
    video_extensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
    audio_extensions = ['mp3', 'wav', 'aac', 'flac', 'ogg']
    document_extensions = ['pdf', 'doc', 'docx', 'txt', 'rtf']
    
    if extension in image_extensions:
        return ContentType.IMAGE
    elif extension in video_extensions:
        return ContentType.VIDEO
    elif extension in audio_extensions:
        return ContentType.AUDIO
    elif extension in document_extensions:
        return ContentType.DOCUMENT
    else:
        return ContentType.DOCUMENT

def format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format"""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"

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
    description="Content management and media handling microservice",
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
        "description": "Content management and media handling",
        "endpoints": {
            "health": "/health",
            "content": "/api/content",
            "templates": "/api/content/templates",
            "media": "/api/content/media",
            "collections": "/api/content/collections",
            "upload": "/api/content/upload",
            "metrics": "/api/content/metrics"
        }
    }

@app.post("/api/content", response_model=ContentResponse)
async def create_content(
    content_data: ContentCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new content"""
    new_content = Content(
        property_id=content_data.property_id,
        title=content_data.title,
        description=content_data.description,
        content_type=content_data.content_type,
        media_type=content_data.media_type,
        category=content_data.category,
        content_data=content_data.content_data,
        file_path=content_data.file_path,
        file_url=content_data.file_url,
        file_size=content_data.file_size,
        width=content_data.width,
        height=content_data.height,
        duration=content_data.duration,
        thumbnail_url=content_data.thumbnail_url,
        tags=content_data.tags,
        metadata=content_data.metadata,
        alt_text=content_data.alt_text,
        caption=content_data.caption,
        seo_title=content_data.seo_title,
        seo_description=content_data.seo_description,
        seo_keywords=content_data.seo_keywords,
        is_public=content_data.is_public,
        is_featured=content_data.is_featured,
        sort_order=content_data.sort_order,
        created_by=current_user["user_id"]
    )
    
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    
    logger.info(f"✅ Content created: {new_content.title}")
    
    return ContentResponse(
        id=new_content.id,
        property_id=new_content.property_id,
        title=new_content.title,
        description=new_content.description,
        content_type=new_content.content_type,
        media_type=new_content.media_type,
        category=new_content.category,
        status=new_content.status,
        content_data=new_content.content_data,
        file_path=new_content.file_path,
        file_url=new_content.file_url,
        file_size=new_content.file_size,
        width=new_content.width,
        height=new_content.height,
        duration=new_content.duration,
        thumbnail_url=new_content.thumbnail_url,
        tags=new_content.tags,
        metadata=new_content.metadata,
        alt_text=new_content.alt_text,
        caption=new_content.caption,
        seo_title=new_content.seo_title,
        seo_description=new_content.seo_description,
        seo_keywords=new_content.seo_keywords,
        is_public=new_content.is_public,
        is_featured=new_content.is_featured,
        sort_order=new_content.sort_order,
        created_by=new_content.created_by,
        updated_by=new_content.updated_by,
        published_at=new_content.published_at,
        created_at=new_content.created_at,
        updated_at=new_content.updated_at
    )

@app.get("/api/content", response_model=List[ContentResponse])
async def get_content(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    content_type: Optional[ContentType] = None,
    category: Optional[ContentCategory] = None,
    status: Optional[ContentStatus] = None,
    is_public: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get content with filtering and search"""
    query = db.query(Content)
    
    if property_id:
        query = query.filter(Content.property_id == property_id)
    if content_type:
        query = query.filter(Content.content_type == content_type)
    if category:
        query = query.filter(Content.category == category)
    if status:
        query = query.filter(Content.status == status)
    if is_public is not None:
        query = query.filter(Content.is_public == is_public)
    if is_featured is not None:
        query = query.filter(Content.is_featured == is_featured)
    if search:
        query = query.filter(
            (Content.title.ilike(f"%{search}%")) |
            (Content.description.ilike(f"%{search}%")) |
            (Content.alt_text.ilike(f"%{search}%"))
        )
    
    content_items = query.order_by(Content.sort_order.asc(), Content.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        ContentResponse(
            id=content.id,
            property_id=content.property_id,
            title=content.title,
            description=content.description,
            content_type=content.content_type,
            media_type=content.media_type,
            category=content.category,
            status=content.status,
            content_data=content.content_data,
            file_path=content.file_path,
            file_url=content.file_url,
            file_size=content.file_size,
            width=content.width,
            height=content.height,
            duration=content.duration,
            thumbnail_url=content.thumbnail_url,
            tags=content.tags,
            metadata=content.metadata,
            alt_text=content.alt_text,
            caption=content.caption,
            seo_title=content.seo_title,
            seo_description=content.seo_description,
            seo_keywords=content.seo_keywords,
            is_public=content.is_public,
            is_featured=content.is_featured,
            sort_order=content.sort_order,
            created_by=content.created_by,
            updated_by=content.updated_by,
            published_at=content.published_at,
            created_at=content.created_at,
            updated_at=content.updated_at
        )
        for content in content_items
    ]

@app.post("/api/content/upload")
async def upload_media(
    file: UploadFile = File(...),
    property_id: str = Query(...),
    category: ContentCategory = Query(ContentCategory.GENERAL),
    tags: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload media file"""
    # Validate file
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    # Get file information
    file_extension = get_file_extension(file.filename)
    content_type = get_content_type_from_extension(file_extension)
    
    # Read file content
    file_content = await file.read()
    file_size = len(file_content)
    
    # Generate file path (in production, this would be stored in cloud storage)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = f"/uploads/{filename}"
    file_url = f"/media/{filename}"
    
    # Create media library entry
    media_entry = MediaLibrary(
        property_id=property_id,
        filename=filename,
        original_filename=file.filename,
        content_type=content_type,
        media_type=file_extension,
        file_size=file_size,
        file_path=file_path,
        file_url=file_url,
        uploaded_by=current_user["user_id"]
    )
    
    db.add(media_entry)
    db.commit()
    db.refresh(media_entry)
    
    # Create content entry
    content_entry = Content(
        property_id=property_id,
        title=file.filename,
        content_type=content_type,
        media_type=file_extension,
        category=category,
        file_path=file_path,
        file_url=file_url,
        file_size=file_size,
        tags=tags.split(',') if tags else [],
        created_by=current_user["user_id"]
    )
    
    db.add(content_entry)
    db.commit()
    db.refresh(content_entry)
    
    logger.info(f"✅ Media uploaded: {file.filename}")
    
    return {
        "message": "File uploaded successfully",
        "content_id": content_entry.id,
        "media_id": media_entry.id,
        "filename": file.filename,
        "file_size": format_file_size(file_size),
        "content_type": content_type,
        "file_url": file_url
    }

@app.post("/api/content/templates")
async def create_template(
    template_data: ContentTemplateCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create content template"""
    new_template = ContentTemplate(
        property_id=template_data.property_id,
        name=template_data.name,
        description=template_data.description,
        template_type=template_data.template_type,
        category=template_data.category,
        template_data=template_data.template_data,
        variables=template_data.variables,
        tags=template_data.tags,
        metadata=template_data.metadata,
        created_by=current_user["user_id"]
    )
    
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    
    logger.info(f"✅ Template created: {new_template.name}")
    
    return {
        "message": "Template created successfully",
        "template_id": new_template.id,
        "name": new_template.name,
        "template_type": new_template.template_type
    }

@app.get("/api/content/metrics", response_model=ContentMetrics)
async def get_content_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get content service metrics"""
    # Get content counts
    content_query = db.query(Content)
    if property_id:
        content_query = content_query.filter(Content.property_id == property_id)
    
    total_content = content_query.count()
    published_content = content_query.filter(Content.status == ContentStatus.PUBLISHED).count()
    draft_content = content_query.filter(Content.status == ContentStatus.DRAFT).count()
    archived_content = content_query.filter(Content.status == ContentStatus.ARCHIVED).count()
    
    # Get template counts
    template_query = db.query(ContentTemplate)
    if property_id:
        template_query = template_query.filter(ContentTemplate.property_id == property_id)
    
    total_templates = template_query.count()
    active_templates = template_query.filter(ContentTemplate.is_active == True).count()
    
    # Get media counts
    media_query = db.query(MediaLibrary)
    if property_id:
        media_query = media_query.filter(MediaLibrary.property_id == property_id)
    
    total_media = media_query.count()
    
    # Get collection counts
    collection_query = db.query(ContentCollection)
    if property_id:
        collection_query = collection_query.filter(ContentCollection.property_id == property_id)
    
    total_collections = collection_query.count()
    
    # Get content by type
    content_by_type = {}
    for content_type in ContentType:
        count = content_query.filter(Content.content_type == content_type).count()
        content_by_type[content_type] = count
    
    # Get content by category
    content_by_category = {}
    for category in ContentCategory:
        count = content_query.filter(Content.category == category).count()
        content_by_category[category] = count
    
    # Get media by type
    media_by_type = {}
    media_files = media_query.all()
    for media in media_files:
        media_type = media.media_type
        media_by_type[media_type] = media_by_type.get(media_type, 0) + 1
    
    # Calculate storage usage
    total_storage_bytes = sum(media.file_size for media in media_files)
    storage_used_mb = total_storage_bytes / (1024 * 1024) if total_storage_bytes > 0 else 0.0
    
    # Calculate average file size
    average_file_size = total_storage_bytes / len(media_files) if media_files else 0.0
    
    return ContentMetrics(
        total_content=total_content,
        published_content=published_content,
        draft_content=draft_content,
        archived_content=archived_content,
        total_templates=total_templates,
        active_templates=active_templates,
        total_media=total_media,
        total_collections=total_collections,
        content_by_type=content_by_type,
        content_by_category=content_by_category,
        media_by_type=media_by_type,
        storage_used_mb=storage_used_mb,
        average_file_size=average_file_size
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )