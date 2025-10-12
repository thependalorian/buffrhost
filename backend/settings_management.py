"""
SETTINGS MANAGEMENT SYSTEM
Advanced settings and configuration management for Buffr Host
"""

from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from enum import Enum
from dataclasses import dataclass, field
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import json
import uuid
import yaml
import os
from pathlib import Path

Base = declarative_base()

class SettingType(Enum):
    """Setting types"""
    STRING = "string"
    INTEGER = "integer"
    FLOAT = "float"
    BOOLEAN = "boolean"
    JSON = "json"
    YAML = "yaml"
    PASSWORD = "password"
    EMAIL = "email"
    URL = "url"
    FILE = "file"

class SettingScope(Enum):
    """Setting scopes"""
    GLOBAL = "global"
    PROPERTY = "property"
    USER = "user"
    ROLE = "role"
    MODULE = "module"

class SettingCategory(Enum):
    """Setting categories"""
    GENERAL = "general"
    EMAIL = "email"
    SMS = "sms"
    PAYMENT = "payment"
    INTEGRATION = "integration"
    SECURITY = "security"
    UI = "ui"
    NOTIFICATION = "notification"
    REPORTING = "reporting"
    BACKUP = "backup"
    CUSTOM = "custom"

@dataclass
class SettingValidation:
    """Setting validation rules"""
    required: bool = False
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    min_value: Optional[Union[int, float]] = None
    max_value: Optional[Union[int, float]] = None
    pattern: Optional[str] = None
    choices: List[Any] = field(default_factory=list)
    custom_validator: Optional[str] = None

@dataclass
class SettingDefinition:
    """Setting definition"""
    key: str
    name: str
    description: str
    type: SettingType
    scope: SettingScope
    category: SettingCategory
    default_value: Any = None
    validation: SettingValidation = field(default_factory=SettingValidation)
    is_encrypted: bool = False
    is_readonly: bool = False
    is_public: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)

class Setting(Base):
    """Setting model"""
    __tablename__ = 'settings'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String(255), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)
    scope = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False)
    value = Column(Text)
    encrypted_value = Column(Text)  # For sensitive data
    is_encrypted = Column(Boolean, default=False)
    is_readonly = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    validation_rules = Column(JSON)
    metadata = Column(JSON)
    property_id = Column(String(255))  # For property-specific settings
    user_id = Column(String(255))  # For user-specific settings
    role_id = Column(String(255))  # For role-specific settings
    module_id = Column(String(255))  # For module-specific settings
    created_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    history = relationship("SettingHistory", back_populates="setting")

class SettingHistory(Base):
    """Setting change history model"""
    __tablename__ = 'setting_history'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    setting_id = Column(String, ForeignKey('settings.id'))
    old_value = Column(Text)
    new_value = Column(Text)
    changed_by = Column(String(255))
    change_reason = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    setting = relationship("Setting", back_populates="history")

class SettingsManager:
    """Advanced settings management system"""
    
    def __init__(self, db_session, encryption_key: str = None):
        self.db = db_session
        self.encryption_key = encryption_key or os.getenv('ENCRYPTION_KEY', 'default-key')
        self.settings_cache: Dict[str, Any] = {}
        self.definitions: Dict[str, SettingDefinition] = {}
        self._load_default_definitions()
    
    def _load_default_definitions(self):
        """Load default setting definitions"""
        default_definitions = [
            # General Settings
            SettingDefinition(
                key="app_name",
                name="Application Name",
                description="The name of the application",
                type=SettingType.STRING,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.GENERAL,
                default_value="Buffr Host",
                validation=SettingValidation(required=True, min_length=1, max_length=100)
            ),
            SettingDefinition(
                key="app_version",
                name="Application Version",
                description="The version of the application",
                type=SettingType.STRING,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.GENERAL,
                default_value="1.0.0",
                validation=SettingValidation(required=True)
            ),
            SettingDefinition(
                key="timezone",
                name="Default Timezone",
                description="The default timezone for the application",
                type=SettingType.STRING,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.GENERAL,
                default_value="UTC",
                validation=SettingValidation(required=True)
            ),
            SettingDefinition(
                key="currency",
                name="Default Currency",
                description="The default currency for the application",
                type=SettingType.STRING,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.GENERAL,
                default_value="NAD",
                validation=SettingValidation(required=True, choices=["NAD", "USD", "EUR", "GBP"])
            ),
            
            # Email Settings
            SettingDefinition(
                key="smtp_host",
                name="SMTP Host",
                description="SMTP server hostname",
                type=SettingType.STRING,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.EMAIL,
                default_value="",
                validation=SettingValidation(required=True)
            ),
            SettingDefinition(
                key="smtp_port",
                name="SMTP Port",
                description="SMTP server port",
                type=SettingType.INTEGER,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.EMAIL,
                default_value=587,
                validation=SettingValidation(required=True, min_value=1, max_value=65535)
            ),
            SettingDefinition(
                key="smtp_username",
                name="SMTP Username",
                description="SMTP authentication username",
                type=SettingType.STRING,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.EMAIL,
                default_value="",
                validation=SettingValidation(required=True)
            ),
            SettingDefinition(
                key="smtp_password",
                name="SMTP Password",
                description="SMTP authentication password",
                type=SettingType.PASSWORD,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.EMAIL,
                default_value="",
                is_encrypted=True,
                validation=SettingValidation(required=True)
            ),
            
            # Security Settings
            SettingDefinition(
                key="session_timeout",
                name="Session Timeout",
                description="User session timeout in minutes",
                type=SettingType.INTEGER,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.SECURITY,
                default_value=30,
                validation=SettingValidation(required=True, min_value=5, max_value=1440)
            ),
            SettingDefinition(
                key="password_min_length",
                name="Minimum Password Length",
                description="Minimum password length requirement",
                type=SettingType.INTEGER,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.SECURITY,
                default_value=8,
                validation=SettingValidation(required=True, min_value=6, max_value=50)
            ),
            SettingDefinition(
                key="max_login_attempts",
                name="Maximum Login Attempts",
                description="Maximum failed login attempts before lockout",
                type=SettingType.INTEGER,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.SECURITY,
                default_value=5,
                validation=SettingValidation(required=True, min_value=3, max_value=20)
            ),
            
            # UI Settings
            SettingDefinition(
                key="theme",
                name="Default Theme",
                description="Default UI theme",
                type=SettingType.STRING,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.UI,
                default_value="light",
                validation=SettingValidation(required=True, choices=["light", "dark", "auto"])
            ),
            SettingDefinition(
                key="items_per_page",
                name="Items Per Page",
                description="Default number of items per page",
                type=SettingType.INTEGER,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.UI,
                default_value=20,
                validation=SettingValidation(required=True, min_value=5, max_value=100)
            ),
            
            # Notification Settings
            SettingDefinition(
                key="email_notifications",
                name="Email Notifications",
                description="Enable email notifications",
                type=SettingType.BOOLEAN,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.NOTIFICATION,
                default_value=True
            ),
            SettingDefinition(
                key="sms_notifications",
                name="SMS Notifications",
                description="Enable SMS notifications",
                type=SettingType.BOOLEAN,
                scope=SettingScope.GLOBAL,
                category=SettingCategory.NOTIFICATION,
                default_value=False
            ),
        ]
        
        for definition in default_definitions:
            self.definitions[definition.key] = definition
    
    async def get_setting(self, key: str, scope: SettingScope = SettingScope.GLOBAL, 
                         property_id: str = None, user_id: str = None, 
                         role_id: str = None, module_id: str = None) -> Any:
        """Get a setting value"""
        try:
            # Check cache first
            cache_key = f"{key}_{scope.value}_{property_id}_{user_id}_{role_id}_{module_id}"
            if cache_key in self.settings_cache:
                return self.settings_cache[cache_key]
            
            # Build query
            query = self.db.query(Setting).filter(Setting.key == key, Setting.scope == scope.value)
            
            if property_id:
                query = query.filter(Setting.property_id == property_id)
            if user_id:
                query = query.filter(Setting.user_id == user_id)
            if role_id:
                query = query.filter(Setting.role_id == role_id)
            if module_id:
                query = query.filter(Setting.module_id == module_id)
            
            setting = await query.first()
            
            if setting:
                value = setting.encrypted_value if setting.is_encrypted else setting.value
                if value:
                    # Parse value based on type
                    parsed_value = await self._parse_setting_value(value, setting.type)
                    self.settings_cache[cache_key] = parsed_value
                    return parsed_value
            
            # Return default value if setting not found
            definition = self.definitions.get(key)
            if definition:
                self.settings_cache[cache_key] = definition.default_value
                return definition.default_value
            
            return None
        except Exception as e:
            print(f"Error getting setting {key}: {e}")
            return None
    
    async def set_setting(self, key: str, value: Any, scope: SettingScope = SettingScope.GLOBAL,
                         property_id: str = None, user_id: str = None, role_id: str = None,
                         module_id: str = None, changed_by: str = "system") -> bool:
        """Set a setting value"""
        try:
            # Validate setting
            if not await self._validate_setting(key, value, scope):
                return False
            
            # Get or create setting
            query = self.db.query(Setting).filter(Setting.key == key, Setting.scope == scope.value)
            
            if property_id:
                query = query.filter(Setting.property_id == property_id)
            if user_id:
                query = query.filter(Setting.user_id == user_id)
            if role_id:
                query = query.filter(Setting.role_id == role_id)
            if module_id:
                query = query.filter(Setting.module_id == module_id)
            
            setting = await query.first()
            
            if not setting:
                # Create new setting
                definition = self.definitions.get(key)
                if not definition:
                    return False
                
                setting = Setting(
                    key=key,
                    name=definition.name,
                    description=definition.description,
                    type=definition.type.value,
                    scope=scope.value,
                    category=definition.category.value,
                    property_id=property_id,
                    user_id=user_id,
                    role_id=role_id,
                    module_id=module_id,
                    is_encrypted=definition.is_encrypted,
                    is_readonly=definition.is_readonly,
                    is_public=definition.is_public,
                    validation_rules=definition.validation.__dict__,
                    metadata=definition.metadata,
                    created_by=changed_by
                )
                self.db.add(setting)
            
            # Store old value for history
            old_value = setting.encrypted_value if setting.is_encrypted else setting.value
            
            # Set new value
            if setting.is_encrypted:
                setting.encrypted_value = await self._encrypt_value(str(value))
                setting.value = None
            else:
                setting.value = str(value)
                setting.encrypted_value = None
            
            setting.updated_at = datetime.utcnow()
            
            # Create history entry
            history = SettingHistory(
                setting_id=setting.id,
                old_value=old_value,
                new_value=str(value),
                changed_by=changed_by,
                change_reason="Setting updated"
            )
            self.db.add(history)
            
            await self.db.commit()
            
            # Update cache
            cache_key = f"{key}_{scope.value}_{property_id}_{user_id}_{role_id}_{module_id}"
            self.settings_cache[cache_key] = value
            
            return True
        except Exception as e:
            await self.db.rollback()
            print(f"Error setting {key}: {e}")
            return False
    
    async def _validate_setting(self, key: str, value: Any, scope: SettingScope) -> bool:
        """Validate setting value"""
        try:
            definition = self.definitions.get(key)
            if not definition:
                return False
            
            validation = definition.validation
            
            # Type validation
            if definition.type == SettingType.STRING and not isinstance(value, str):
                return False
            elif definition.type == SettingType.INTEGER and not isinstance(value, int):
                return False
            elif definition.type == SettingType.FLOAT and not isinstance(value, (int, float)):
                return False
            elif definition.type == SettingType.BOOLEAN and not isinstance(value, bool):
                return False
            
            # Required validation
            if validation.required and value is None:
                return False
            
            # String validations
            if isinstance(value, str):
                if validation.min_length and len(value) < validation.min_length:
                    return False
                if validation.max_length and len(value) > validation.max_length:
                    return False
                if validation.pattern and not re.match(validation.pattern, value):
                    return False
            
            # Numeric validations
            if isinstance(value, (int, float)):
                if validation.min_value is not None and value < validation.min_value:
                    return False
                if validation.max_value is not None and value > validation.max_value:
                    return False
            
            # Choices validation
            if validation.choices and value not in validation.choices:
                return False
            
            return True
        except Exception:
            return False
    
    async def _parse_setting_value(self, value: str, setting_type: str) -> Any:
        """Parse setting value based on type"""
        try:
            if setting_type == SettingType.STRING.value:
                return value
            elif setting_type == SettingType.INTEGER.value:
                return int(value)
            elif setting_type == SettingType.FLOAT.value:
                return float(value)
            elif setting_type == SettingType.BOOLEAN.value:
                return value.lower() in ['true', '1', 'yes', 'on']
            elif setting_type == SettingType.JSON.value:
                return json.loads(value)
            elif setting_type == SettingType.YAML.value:
                return yaml.safe_load(value)
            else:
                return value
        except Exception:
            return value
    
    async def _encrypt_value(self, value: str) -> str:
        """Encrypt sensitive value"""
        # Simple base64 encoding for demo (use proper encryption in production)
        import base64
        return base64.b64encode(value.encode()).decode()
    
    async def _decrypt_value(self, encrypted_value: str) -> str:
        """Decrypt sensitive value"""
        # Simple base64 decoding for demo (use proper decryption in production)
        import base64
        return base64.b64decode(encrypted_value.encode()).decode()
    
    async def get_settings_by_category(self, category: SettingCategory, 
                                     scope: SettingScope = SettingScope.GLOBAL,
                                     property_id: str = None) -> Dict[str, Any]:
        """Get all settings in a category"""
        try:
            query = self.db.query(Setting).filter(
                Setting.category == category.value,
                Setting.scope == scope.value
            )
            
            if property_id:
                query = query.filter(Setting.property_id == property_id)
            
            settings = await query.all()
            
            result = {}
            for setting in settings:
                value = setting.encrypted_value if setting.is_encrypted else setting.value
                if value:
                    result[setting.key] = await self._parse_setting_value(value, setting.type)
                else:
                    definition = self.definitions.get(setting.key)
                    if definition:
                        result[setting.key] = definition.default_value
            
            return result
        except Exception:
            return {}
    
    async def get_public_settings(self) -> Dict[str, Any]:
        """Get all public settings"""
        try:
            settings = await self.db.query(Setting).filter(
                Setting.is_public == True,
                Setting.scope == SettingScope.GLOBAL.value
            ).all()
            
            result = {}
            for setting in settings:
                value = setting.encrypted_value if setting.is_encrypted else setting.value
                if value:
                    result[setting.key] = await self._parse_setting_value(value, setting.type)
            
            return result
        except Exception:
            return {}
    
    async def export_settings(self, scope: SettingScope = SettingScope.GLOBAL,
                            property_id: str = None) -> Dict[str, Any]:
        """Export settings to dictionary"""
        try:
            query = self.db.query(Setting).filter(Setting.scope == scope.value)
            
            if property_id:
                query = query.filter(Setting.property_id == property_id)
            
            settings = await query.all()
            
            result = {
                "exported_at": datetime.utcnow().isoformat(),
                "scope": scope.value,
                "property_id": property_id,
                "settings": {}
            }
            
            for setting in settings:
                value = setting.encrypted_value if setting.is_encrypted else setting.value
                if value:
                    parsed_value = await self._parse_setting_value(value, setting.type)
                    result["settings"][setting.key] = {
                        "value": parsed_value,
                        "type": setting.type,
                        "category": setting.category,
                        "is_encrypted": setting.is_encrypted
                    }
            
            return result
        except Exception:
            return {}
    
    async def import_settings(self, settings_data: Dict[str, Any], 
                            scope: SettingScope = SettingScope.GLOBAL,
                            property_id: str = None, imported_by: str = "system") -> int:
        """Import settings from dictionary"""
        try:
            imported_count = 0
            
            for key, setting_data in settings_data.get("settings", {}).items():
                value = setting_data.get("value")
                if value is not None:
                    success = await self.set_setting(
                        key=key,
                        value=value,
                        scope=scope,
                        property_id=property_id,
                        changed_by=imported_by
                    )
                    if success:
                        imported_count += 1
            
            return imported_count
        except Exception:
            return 0
    
    async def get_setting_history(self, key: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get setting change history"""
        try:
            setting = await self.db.query(Setting).filter(Setting.key == key).first()
            if not setting:
                return []
            
            history = await self.db.query(SettingHistory).filter(
                SettingHistory.setting_id == setting.id
            ).order_by(SettingHistory.created_at.desc()).limit(limit).all()
            
            return [
                {
                    "id": entry.id,
                    "old_value": entry.old_value,
                    "new_value": entry.new_value,
                    "changed_by": entry.changed_by,
                    "change_reason": entry.change_reason,
                    "created_at": entry.created_at.isoformat()
                }
                for entry in history
            ]
        except Exception:
            return []
    
    async def reset_setting_to_default(self, key: str, scope: SettingScope = SettingScope.GLOBAL,
                                     property_id: str = None, user_id: str = None,
                                     role_id: str = None, module_id: str = None) -> bool:
        """Reset setting to default value"""
        try:
            definition = self.definitions.get(key)
            if not definition:
                return False
            
            return await self.set_setting(
                key=key,
                value=definition.default_value,
                scope=scope,
                property_id=property_id,
                user_id=user_id,
                role_id=role_id,
                module_id=module_id,
                changed_by="system"
            )
        except Exception:
            return False
    
    async def get_setting_statistics(self) -> Dict[str, Any]:
        """Get settings statistics"""
        try:
            total_settings = await self.db.query(Setting).count()
            global_settings = await self.db.query(Setting).filter(
                Setting.scope == SettingScope.GLOBAL.value
            ).count()
            property_settings = await self.db.query(Setting).filter(
                Setting.scope == SettingScope.PROPERTY.value
            ).count()
            user_settings = await self.db.query(Setting).filter(
                Setting.scope == SettingScope.USER.value
            ).count()
            encrypted_settings = await self.db.query(Setting).filter(
                Setting.is_encrypted == True
            ).count()
            
            return {
                "total_settings": total_settings,
                "global_settings": global_settings,
                "property_settings": property_settings,
                "user_settings": user_settings,
                "encrypted_settings": encrypted_settings
            }
        except Exception:
            return {}