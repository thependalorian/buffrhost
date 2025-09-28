"""
Pydantic schemas for Buffr Host API serialization.
"""

from .customer import CustomerCreate, CustomerResponse, CustomerUpdate
from .document_processing import (DocumentProcessingLogCreate,
                                  DocumentProcessingLogResponse,
                                  DocumentProcessingLogUpdate,
                                  DocumentProcessingStats,
                                  KnowledgeVectorCreate,
                                  KnowledgeVectorResponse, SitePageCreate,
                                  SitePageResponse, WebCrawlLogCreate,
                                  WebCrawlLogResponse, WebCrawlLogUpdate,
                                  WebCrawlStats)
from .inventory import (IngredientCreate, IngredientResponse,
                        InventoryItemCreate, InventoryItemResponse,
                        InventoryItemUpdate, UnitCreate, UnitResponse)
from .menu import (MenuCategoryCreate, MenuCategoryResponse,
                   MenuCategoryUpdate, MenuItemCreate, MenuItemResponse,
                   MenuItemUpdate, MenuMediaCreate, MenuMediaResponse)
from .modifiers import (ModifierCreate, ModifierResponse, ModifierUpdate,
                        OptionValueCreate, OptionValueResponse,
                        OptionValueUpdate)
from .order import (OrderCreate, OrderItemCreate, OrderItemOptionCreate,
                    OrderItemResponse, OrderResponse, OrderUpdate)
from .restaurant import RestaurantCreate, RestaurantResponse, RestaurantUpdate
from .staff import (StaffAttendance, StaffAttendanceCreate,
                    StaffAttendanceUpdate, StaffCommunication,
                    StaffCommunicationCreate, StaffDepartment,
                    StaffDepartmentCreate, StaffDepartmentUpdate,
                    StaffLeaveRequest, StaffLeaveRequestCreate,
                    StaffLeaveRequestUpdate, StaffPerformance,
                    StaffPerformanceCreate, StaffPerformanceUpdate,
                    StaffPosition, StaffPositionCreate, StaffPositionUpdate,
                    StaffProfile, StaffProfileCreate, StaffProfileUpdate,
                    StaffSchedule, StaffScheduleCreate, StaffScheduleUpdate,
                    StaffTask, StaffTaskCreate, StaffTaskUpdate)
from .user import UserCreate, UserLogin, UserResponse, UserUpdate
from .voice_models import (AudioFileCreate, AudioFileResponse,
                           VoiceInteractionCreate, VoiceInteractionResponse,
                           VoiceModelCreate, VoiceModelResponse,
                           VoiceModelUpdate)

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
    "StaffDepartmentCreate",
    "StaffDepartmentUpdate",
    "StaffDepartment",
    "StaffPositionCreate",
    "StaffPositionUpdate",
    "StaffPosition",
    "StaffProfileCreate",
    "StaffProfileUpdate",
    "StaffProfile",
    "StaffScheduleCreate",
    "StaffScheduleUpdate",
    "StaffSchedule",
    "StaffAttendanceCreate",
    "StaffAttendanceUpdate",
    "StaffAttendance",
    "StaffTaskCreate",
    "StaffTaskUpdate",
    "StaffTask",
    "StaffPerformanceCreate",
    "StaffPerformanceUpdate",
    "StaffPerformance",
    "StaffCommunicationCreate",
    "StaffCommunication",
    "StaffLeaveRequestCreate",
    "StaffLeaveRequestUpdate",
    "StaffLeaveRequest",
    # Voice Capabilities
    "VoiceModelCreate",
    "VoiceModelUpdate",
    "VoiceModelResponse",
    "VoiceInteractionCreate",
    "VoiceInteractionResponse",
    "AudioFileCreate",
    "AudioFileResponse",
    # Document Processing
    "SitePageCreate",
    "SitePageResponse",
    "DocumentProcessingLogCreate",
    "DocumentProcessingLogUpdate",
    "DocumentProcessingLogResponse",
    "WebCrawlLogCreate",
    "WebCrawlLogUpdate",
    "WebCrawlLogResponse",
    "KnowledgeVectorCreate",
    "KnowledgeVectorResponse",
    "DocumentProcessingStats",
    "WebCrawlStats",
]
