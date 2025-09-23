"""
Pydantic schemas for Buffr Host API serialization.
"""

from .restaurant import RestaurantCreate, RestaurantUpdate, RestaurantResponse
from .user import UserCreate, UserUpdate, UserResponse, UserLogin
from .menu import (
    MenuCategoryCreate, MenuCategoryUpdate, MenuCategoryResponse,
    MenuItemCreate, MenuItemUpdate, MenuItemResponse,
    MenuMediaCreate, MenuMediaResponse
)
from .modifiers import (
    ModifierCreate, ModifierUpdate, ModifierResponse,
    OptionValueCreate, OptionValueUpdate, OptionValueResponse
)
from .inventory import (
    UnitCreate, UnitResponse,
    InventoryItemCreate, InventoryItemUpdate, InventoryItemResponse,
    IngredientCreate, IngredientResponse
)
from .customer import CustomerCreate, CustomerUpdate, CustomerResponse
from .order import (
    OrderCreate, OrderUpdate, OrderResponse,
    OrderItemCreate, OrderItemResponse,
    OrderItemOptionCreate
)
from .staff import (
    StaffDepartmentCreate, StaffDepartmentUpdate, StaffDepartment,
    StaffPositionCreate, StaffPositionUpdate, StaffPosition,
    StaffProfileCreate, StaffProfileUpdate, StaffProfile,
    StaffScheduleCreate, StaffScheduleUpdate, StaffSchedule,
    StaffAttendanceCreate, StaffAttendanceUpdate, StaffAttendance,
    StaffTaskCreate, StaffTaskUpdate, StaffTask,
    StaffPerformanceCreate, StaffPerformanceUpdate, StaffPerformance,
    StaffCommunicationCreate, StaffCommunication,
    StaffLeaveRequestCreate, StaffLeaveRequestUpdate, StaffLeaveRequest
)
from .voice_models import (
    VoiceModelCreate, VoiceModelUpdate, VoiceModelResponse,
    VoiceInteractionCreate, VoiceInteractionResponse,
    AudioFileCreate, AudioFileResponse
)
from .document_processing import (
    SitePageCreate, SitePageResponse,
    DocumentProcessingLogCreate, DocumentProcessingLogUpdate, DocumentProcessingLogResponse,
    WebCrawlLogCreate, WebCrawlLogUpdate, WebCrawlLogResponse,
    KnowledgeVectorCreate, KnowledgeVectorResponse,
    DocumentProcessingStats, WebCrawlStats
)

__all__ = [
    # Restaurant
    "RestaurantCreate",
    "RestaurantUpdate", 
    "RestaurantResponse",
    
    # User
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserLogin",
    
    # Menu
    "MenuCategoryCreate",
    "MenuCategoryUpdate",
    "MenuCategoryResponse",
    "MenuItemCreate",
    "MenuItemUpdate",
    "MenuItemResponse",
    "MenuMediaCreate",
    "MenuMediaResponse",
    
    # Modifiers
    "ModifierCreate",
    "ModifierUpdate",
    "ModifierResponse",
    "OptionValueCreate",
    "OptionValueUpdate",
    "OptionValueResponse",
    
    # Inventory
    "UnitCreate",
    "UnitResponse",
    "InventoryItemCreate",
    "InventoryItemUpdate",
    "InventoryItemResponse",
    "IngredientCreate",
    "IngredientResponse",
    
    # Customer
    "CustomerCreate",
    "CustomerUpdate",
    "CustomerResponse",
    
    # Order
    "OrderCreate",
    "OrderUpdate",
    "OrderResponse",
    "OrderItemCreate",
    "OrderItemResponse",
    "OrderItemOptionCreate",
    
    # Staff Management
    "StaffDepartmentCreate", "StaffDepartmentUpdate", "StaffDepartment",
    "StaffPositionCreate", "StaffPositionUpdate", "StaffPosition",
    "StaffProfileCreate", "StaffProfileUpdate", "StaffProfile",
    "StaffScheduleCreate", "StaffScheduleUpdate", "StaffSchedule",
    "StaffAttendanceCreate", "StaffAttendanceUpdate", "StaffAttendance",
    "StaffTaskCreate", "StaffTaskUpdate", "StaffTask",
    "StaffPerformanceCreate", "StaffPerformanceUpdate", "StaffPerformance",
    "StaffCommunicationCreate", "StaffCommunication",
    "StaffLeaveRequestCreate", "StaffLeaveRequestUpdate", "StaffLeaveRequest",
    
    # Voice Capabilities
    "VoiceModelCreate", "VoiceModelUpdate", "VoiceModelResponse",
    "VoiceInteractionCreate", "VoiceInteractionResponse",
    "AudioFileCreate", "AudioFileResponse",
    
    # Document Processing
    "SitePageCreate", "SitePageResponse",
    "DocumentProcessingLogCreate", "DocumentProcessingLogUpdate", "DocumentProcessingLogResponse",
    "WebCrawlLogCreate", "WebCrawlLogUpdate", "WebCrawlLogResponse",
    "KnowledgeVectorCreate", "KnowledgeVectorResponse",
    "DocumentProcessingStats", "WebCrawlStats",
]
