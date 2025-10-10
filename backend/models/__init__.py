"""
Database models for Buffr Host comprehensive hospitality ecosystem platform.
"""

from .hospitality_property import HospitalityProperty
from .user import User, UserPreference
from .user_type import UserType
from .menu import MenuCategory, Menu, MenuMedia
from .modifiers import Modifiers, OptionValue, MenuModifiers
from .inventory import (
    UnitOfMeasurement,
    InventoryItem,
    MenuItemRawMaterial,
    Ingredient,
    OptionValueIngredient,
    OptionValueIngredientMultiplier,
)

# Customer models are now part of the unified User/Profile schema
from .order import Order, OrderItem, OrderItemOption
from .room import (
    RoomType,
    Room,
    RoomAmenity,
    RoomTypeAmenity,
    RoomReservation,
    RoomRate,
    RoomServiceOrder,
    RoomServiceItem,
)
from .cms import (
    CMSContent,
    ContentVersion,
    ContentTemplate,
    MediaLibrary,
    ContentCollection,
    CollectionContent,
    ContentWorkflow,
)
from .services import (
    SpaService,
    ConferenceRoom,
    TransportationService,
    RecreationService,
    SpecializedService,
    ServiceBooking,
)
from .loyalty import CrossBusinessLoyalty, LoyaltyTransaction
from .corporate import (
    CorporateCustomer,
    CorporateBooking,
    CorporateBookingItem,
    QuotationItem,
    InvoiceItem,
)
from .compliance import KYCKYBDocument
from .ai_knowledge import (
    KnowledgeBase,
    AIAgentSession,
    AIAgentMessage,
    AIAgentWorkflow,
    AIAgentExecution,
)
from .documents import DocumentManagement, DocumentAccessLog
from .staff import (
    StaffDepartment,
    StaffPosition,
    StaffProfile,
    StaffSchedule,
    StaffAttendance,
    StaffTask,
    StaffPerformance,
    StaffCommunication,
    StaffLeaveRequest,
)
from .voice_models import VoiceModel, VoiceInteraction, AudioFile
from .document_processing import (
    SitePage,
    DocumentProcessingLog,
    WebCrawlLog,
    KnowledgeVector,
)
from .recommendation_model import (
    UserPreference,
    RecommendationCache,
    UserBehaviorAnalytics,
    BookingInquiry,
    UserFavorite,
    RecommendationEngine,
    RecommendationFeedback,
)
from .restaurant import Restaurant


__all__ = [
    # Property & User
    "HospitalityProperty",
    "User",
    "Profile",
    "UserPreferences",
    "UserType",
    "Restaurant",
    # Menu & Inventory
    "MenuCategory",
    "Menu",
    "MenuMedia",
    "Modifiers",
    "OptionValue",
    "MenuModifiers",
    "UnitOfMeasurement",
    "InventoryItem",
    "MenuItemRawMaterial",
    "Ingredient",
    "OptionValueIngredient",
    "OptionValueIngredientMultiplier",
    # Customer & Order (Customer is now part of unified User/Profile schema)
    "Order",
    "OrderItem",
    "OrderItemOption",
    # Room Management
    "RoomType",
    "Room",
    "RoomAmenity",
    "RoomTypeAmenity",
    "RoomReservation",
    "RoomRate",
    "RoomServiceOrder",
    "RoomServiceItem",
    # CMS
    "CMSContent",
    "ContentVersion",
    "ContentTemplate",
    "MediaLibrary",
    "ContentCollection",
    "CollectionContent",
    "ContentWorkflow",
    # Hospitality Services
    "SpaService",
    "ConferenceRoom",
    "TransportationService",
    "RecreationService",
    "SpecializedService",
    "ServiceBooking",
    # Loyalty
    "CrossBusinessLoyalty",
    "LoyaltyTransaction",
    # Corporate & Financial
    "CorporateCustomer",
    "CorporateBooking",
    "CorporateBookingItem",
    "QuotationItem",
    "InvoiceItem",
    # Compliance
    "KYCKYBDocument",
    # AI & Knowledge Base
    "KnowledgeBase",
    "AIAgentSession",
    "AIAgentMessage",
    "AIAgentWorkflow",
    "AIAgentExecution",
    # Document Management
    "DocumentManagement",
    "DocumentAccessLog",
    # Staff Management
    "StaffDepartment",
    "StaffPosition",
    "StaffProfile",
    "StaffSchedule",
    "StaffAttendance",
    "StaffTask",
    "StaffPerformance",
    "StaffCommunication",
    "StaffLeaveRequest",
    # Voice Capabilities
    "VoiceModel",
    "VoiceInteraction",
    "AudioFile",
    # Document Processing
    "SitePage",
    "DocumentProcessingLog",
    "WebCrawlLog",
    "KnowledgeVector",
    # Recommendation System
    "UserPreference",
    "RecommendationCache",
    "UserBehaviorAnalytics",
    "BookingInquiry",
    "UserFavorite",
    "RecommendationEngine",
    "RecommendationFeedback",
]
