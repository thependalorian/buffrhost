"""
Menu-related models for Buffr Host.
"""
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

class MenuCategory(Base):
    __tablename__ = "menucategory"
    category_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    name = Column(String(255), nullable=False)
    display_order = Column(Integer, nullable=False)
    property = relationship("HospitalityProperty", back_populates="menu_categories")
    menu_items = relationship("Menu", back_populates="category")

class Menu(Base):
    __tablename__ = "menu"
    menu_item_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    base_price = Column(Numeric(10, 2), nullable=False)
    category_id = Column(Integer, ForeignKey("menucategory.category_id"))
    preparation_time = Column(Integer)
    calories = Column(Integer)
    dietary_tags = Column(String(255))
    is_available = Column(Boolean, default=True)
    for_type = Column(String(50), default='all')
    is_popular = Column(Boolean, default=False)
    is_all = Column(Boolean, default=True)
    service_type = Column(String(50), default='restaurant')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    property = relationship("HospitalityProperty", back_populates="menu_items")
    category = relationship("MenuCategory", back_populates="menu_items")
    media = relationship("MenuMedia", back_populates="menu_item")
    order_items = relationship("OrderItem", back_populates="menu_item")
    option_groups = relationship("MenuItemOptionLink", back_populates="menu_item")

class MenuOptionGroup(Base):
    __tablename__ = "menuoptiongroup"
    option_group_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    name = Column(String(255), nullable=False)
    selection_type = Column(String(50), default="single")  # single, multiple
    property = relationship("HospitalityProperty", back_populates="menu_option_groups")
    option_values = relationship("MenuOptionValue", back_populates="option_group")

class MenuOptionValue(Base):
    __tablename__ = "menuoptionvalue"
    option_value_id = Column(Integer, primary_key=True, index=True)
    option_group_id = Column(Integer, ForeignKey("menuoptiongroup.option_group_id"))
    value = Column(String(255), nullable=False)
    additional_price = Column(Numeric(10, 2), default=0)
    option_group = relationship("MenuOptionGroup", back_populates="option_values")

class MenuItemOptionLink(Base):
    __tablename__ = "menuitemoptionlink"
    menu_item_id = Column(Integer, ForeignKey("menu.menu_item_id"), primary_key=True)
    option_group_id = Column(Integer, ForeignKey("menuoptiongroup.option_group_id"), primary_key=True)
    menu_item = relationship("Menu", back_populates="option_groups")
    option_group = relationship("MenuOptionGroup")

class MenuMedia(Base):
    __tablename__ = "menumedia"
    media_id = Column(Integer, primary_key=True, index=True)
    menu_item_id = Column(Integer, ForeignKey("menu.menu_item_id"))
    url = Column(String(500), nullable=False)
    alt_text = Column(String(255))
    display_order = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    menu_item = relationship("Menu", back_populates="media")
