"""
TEMPLATE MANAGEMENT SYSTEM
Advanced template system for Buffr Host operations
"""

from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from enum import Enum
from dataclasses import dataclass, field
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Text, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import json
import uuid
import re
from jinja2 import Template, Environment, BaseLoader, TemplateNotFound
import base64

Base = declarative_base()

class TemplateType(Enum):
    """Template types"""
    EMAIL = "email"
    SMS = "sms"
    NOTIFICATION = "notification"
    REPORT = "report"
    DOCUMENT = "document"
    CONTRACT = "contract"
    INVOICE = "invoice"
    RECEIPT = "receipt"
    LABEL = "label"
    CUSTOM = "custom"

class TemplateStatus(Enum):
    """Template status"""
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"
    DEPRECATED = "deprecated"

class TemplateFormat(Enum):
    """Template formats"""
    HTML = "html"
    TEXT = "text"
    PDF = "pdf"
    DOCX = "docx"
    XLSX = "xlsx"
    JSON = "json"
    XML = "xml"

@dataclass
class TemplateVariable:
    """Template variable definition"""
    name: str
    type: str  # string, number, boolean, date, list, object
    required: bool = True
    default_value: Any = None
    description: str = ""
    validation_rules: Dict[str, Any] = field(default_factory=dict)

@dataclass
class TemplateConfig:
    """Template configuration"""
    variables: List[TemplateVariable] = field(default_factory=list)
    settings: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

class Template(Base):
    """Template model"""
    __tablename__ = 'templates'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)
    format = Column(String(50), nullable=False)
    status = Column(String(50), default=TemplateStatus.DRAFT.value)
    content = Column(Text, nullable=False)
    config = Column(JSON)  # TemplateConfig object
    version = Column(String(50), default="1.0.0")
    tags = Column(JSON)  # List of tags
    category = Column(String(100))
    is_public = Column(Boolean, default=False)
    usage_count = Column(Integer, default=0)
    last_used = Column(DateTime)
    created_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    versions = relationship("TemplateVersion", back_populates="template")
    usages = relationship("TemplateUsage", back_populates="template")

class TemplateVersion(Base):
    """Template version model"""
    __tablename__ = 'template_versions'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    template_id = Column(String, ForeignKey('templates.id'))
    version = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    config = Column(JSON)
    changelog = Column(Text)
    created_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    template = relationship("Template", back_populates="versions")

class TemplateUsage(Base):
    """Template usage log model"""
    __tablename__ = 'template_usages'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    template_id = Column(String, ForeignKey('templates.id'))
    used_by = Column(String(255))
    context = Column(JSON)  # Usage context
    result = Column(JSON)  # Generated result
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    template = relationship("Template", back_populates="usages")

class TemplateManager:
    """Advanced template management system"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.jinja_env = Environment(loader=BaseLoader())
        self.template_cache: Dict[str, Template] = {}
    
    async def create_template(self, template_data: Dict[str, Any]) -> Template:
        """Create a new template"""
        try:
            config = TemplateConfig(**template_data.get('config', {}))
            
            template = Template(
                name=template_data['name'],
                description=template_data.get('description', ''),
                type=template_data['type'],
                format=template_data['format'],
                content=template_data['content'],
                config=config.__dict__,
                tags=template_data.get('tags', []),
                category=template_data.get('category'),
                is_public=template_data.get('is_public', False),
                created_by=template_data.get('created_by', 'system')
            )
            
            self.db.add(template)
            await self.db.commit()
            await self.db.refresh(template)
            
            # Create initial version
            await self._create_template_version(template, template_data['content'], "Initial version")
            
            return template
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to create template: {str(e)}")
    
    async def _create_template_version(self, template: Template, content: str, changelog: str):
        """Create a template version"""
        version = TemplateVersion(
            template_id=template.id,
            version=template.version,
            content=content,
            config=template.config,
            changelog=changelog,
            created_by=template.created_by
        )
        self.db.add(version)
        await self.db.commit()
    
    async def update_template(self, template_id: str, updates: Dict[str, Any]) -> Template:
        """Update an existing template"""
        try:
            template = await self.db.get(Template, template_id)
            if not template:
                raise Exception("Template not found")
            
            # Store old content for versioning
            old_content = template.content
            old_config = template.config
            
            # Update template fields
            for key, value in updates.items():
                if hasattr(template, key) and key not in ['id', 'created_at', 'created_by']:
                    setattr(template, key, value)
            
            # Update version if content changed
            if 'content' in updates and updates['content'] != old_content:
                # Increment version
                version_parts = template.version.split('.')
                version_parts[-1] = str(int(version_parts[-1]) + 1)
                template.version = '.'.join(version_parts)
                
                # Create new version
                await self._create_template_version(
                    template, 
                    updates['content'], 
                    updates.get('changelog', 'Template updated')
                )
            
            template.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(template)
            
            return template
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to update template: {str(e)}")
    
    async def render_template(self, template_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Render a template with context"""
        try:
            template = await self.db.get(Template, template_id)
            if not template:
                raise Exception("Template not found")
            
            if template.status != TemplateStatus.ACTIVE.value:
                raise Exception("Template is not active")
            
            # Validate context against template variables
            await self._validate_context(template, context)
            
            # Get or create Jinja template
            jinja_template = await self._get_jinja_template(template)
            
            # Render template
            rendered_content = jinja_template.render(**context)
            
            # Log usage
            await self._log_template_usage(template, context, rendered_content)
            
            # Update template usage stats
            template.usage_count += 1
            template.last_used = datetime.utcnow()
            await self.db.commit()
            
            return {
                "content": rendered_content,
                "format": template.format,
                "template_id": template_id,
                "template_name": template.name,
                "rendered_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            raise Exception(f"Failed to render template: {str(e)}")
    
    async def _validate_context(self, template: Template, context: Dict[str, Any]):
        """Validate context against template variables"""
        config = TemplateConfig(**template.config)
        
        for variable in config.variables:
            if variable.required and variable.name not in context:
                raise Exception(f"Required variable '{variable.name}' not provided")
            
            if variable.name in context:
                value = context[variable.name]
                # Basic type validation
                if variable.type == 'number' and not isinstance(value, (int, float)):
                    raise Exception(f"Variable '{variable.name}' must be a number")
                elif variable.type == 'boolean' and not isinstance(value, bool):
                    raise Exception(f"Variable '{variable.name}' must be a boolean")
                elif variable.type == 'date' and not isinstance(value, (str, datetime)):
                    raise Exception(f"Variable '{variable.name}' must be a date")
                elif variable.type == 'list' and not isinstance(value, list):
                    raise Exception(f"Variable '{variable.name}' must be a list")
                elif variable.type == 'object' and not isinstance(value, dict):
                    raise Exception(f"Variable '{variable.name}' must be an object")
    
    async def _get_jinja_template(self, template: Template) -> Template:
        """Get or create Jinja template"""
        template_key = f"{template.id}_{template.version}"
        
        if template_key not in self.template_cache:
            try:
                jinja_template = self.jinja_env.from_string(template.content)
                self.template_cache[template_key] = jinja_template
            except Exception as e:
                raise Exception(f"Invalid template syntax: {str(e)}")
        
        return self.template_cache[template_key]
    
    async def _log_template_usage(self, template: Template, context: Dict[str, Any], result: str):
        """Log template usage"""
        usage = TemplateUsage(
            template_id=template.id,
            used_by=context.get('used_by', 'system'),
            context=context,
            result={"content": result, "format": template.format}
        )
        self.db.add(usage)
        await self.db.commit()
    
    async def get_templates(self, template_type: str = None, status: str = None, 
                          category: str = None, tags: List[str] = None, 
                          limit: int = 100) -> List[Dict[str, Any]]:
        """Get templates with filters"""
        try:
            query = self.db.query(Template)
            
            if template_type:
                query = query.filter(Template.type == template_type)
            if status:
                query = query.filter(Template.status == status)
            if category:
                query = query.filter(Template.category == category)
            if tags:
                for tag in tags:
                    query = query.filter(Template.tags.contains([tag]))
            
            templates = await query.order_by(Template.created_at.desc()).limit(limit).all()
            
            return [
                {
                    "id": template.id,
                    "name": template.name,
                    "type": template.type,
                    "format": template.format,
                    "status": template.status,
                    "version": template.version,
                    "category": template.category,
                    "tags": template.tags,
                    "usage_count": template.usage_count,
                    "last_used": template.last_used.isoformat() if template.last_used else None,
                    "created_at": template.created_at.isoformat()
                }
                for template in templates
            ]
        except Exception:
            return []
    
    async def get_template_versions(self, template_id: str) -> List[Dict[str, Any]]:
        """Get template versions"""
        try:
            versions = await self.db.query(TemplateVersion).filter(
                TemplateVersion.template_id == template_id
            ).order_by(TemplateVersion.created_at.desc()).all()
            
            return [
                {
                    "id": version.id,
                    "version": version.version,
                    "changelog": version.changelog,
                    "created_at": version.created_at.isoformat(),
                    "created_by": version.created_by
                }
                for version in versions
            ]
        except Exception:
            return []
    
    async def get_template_usage(self, template_id: str = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Get template usage logs"""
        try:
            query = self.db.query(TemplateUsage)
            
            if template_id:
                query = query.filter(TemplateUsage.template_id == template_id)
            
            usages = await query.order_by(TemplateUsage.created_at.desc()).limit(limit).all()
            
            return [
                {
                    "id": usage.id,
                    "template_id": usage.template_id,
                    "used_by": usage.used_by,
                    "created_at": usage.created_at.isoformat(),
                    "context_keys": list(usage.context.keys()) if usage.context else []
                }
                for usage in usages
            ]
        except Exception:
            return []
    
    async def clone_template(self, template_id: str, new_name: str, created_by: str) -> Template:
        """Clone an existing template"""
        try:
            original_template = await self.db.get(Template, template_id)
            if not original_template:
                raise Exception("Template not found")
            
            # Create new template
            new_template = Template(
                name=new_name,
                description=f"Cloned from {original_template.name}",
                type=original_template.type,
                format=original_template.format,
                content=original_template.content,
                config=original_template.config,
                tags=original_template.tags.copy() if original_template.tags else [],
                category=original_template.category,
                is_public=False,  # Cloned templates are private by default
                created_by=created_by
            )
            
            self.db.add(new_template)
            await self.db.commit()
            await self.db.refresh(new_template)
            
            # Create initial version
            await self._create_template_version(new_template, original_template.content, "Cloned template")
            
            return new_template
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to clone template: {str(e)}")
    
    async def archive_template(self, template_id: str) -> bool:
        """Archive a template"""
        try:
            template = await self.db.get(Template, template_id)
            if template:
                template.status = TemplateStatus.ARCHIVED.value
                template.is_public = False
                await self.db.commit()
                return True
            return False
        except Exception:
            return False
    
    async def get_template_statistics(self) -> Dict[str, Any]:
        """Get template statistics"""
        try:
            total_templates = await self.db.query(Template).count()
            active_templates = await self.db.query(Template).filter(
                Template.status == TemplateStatus.ACTIVE.value
            ).count()
            total_usage = await self.db.query(TemplateUsage).count()
            
            # Get usage by type
            usage_by_type = {}
            templates = await self.db.query(Template).all()
            for template in templates:
                usage_count = await self.db.query(TemplateUsage).filter(
                    TemplateUsage.template_id == template.id
                ).count()
                usage_by_type[template.type] = usage_by_type.get(template.type, 0) + usage_count
            
            return {
                "total_templates": total_templates,
                "active_templates": active_templates,
                "total_usage": total_usage,
                "usage_by_type": usage_by_type
            }
        except Exception:
            return {}
    
    async def search_templates(self, query: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Search templates by name, description, or content"""
        try:
            # Simple text search (can be enhanced with full-text search)
            templates = await self.db.query(Template).filter(
                Template.name.ilike(f"%{query}%") |
                Template.description.ilike(f"%{query}%") |
                Template.content.ilike(f"%{query}%")
            ).limit(limit).all()
            
            return [
                {
                    "id": template.id,
                    "name": template.name,
                    "type": template.type,
                    "format": template.format,
                    "status": template.status,
                    "category": template.category,
                    "tags": template.tags,
                    "usage_count": template.usage_count
                }
                for template in templates
            ]
        except Exception:
            return []
    
    async def validate_template_syntax(self, content: str) -> Dict[str, Any]:
        """Validate template syntax"""
        try:
            jinja_template = self.jinja_env.from_string(content)
            return {
                "valid": True,
                "errors": [],
                "variables": self._extract_variables(content)
            }
        except Exception as e:
            return {
                "valid": False,
                "errors": [str(e)],
                "variables": []
            }
    
    def _extract_variables(self, content: str) -> List[str]:
        """Extract variables from template content"""
        # Simple regex to find Jinja2 variables
        pattern = r'\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}'
        variables = re.findall(pattern, content)
        return list(set(variables))  # Remove duplicates