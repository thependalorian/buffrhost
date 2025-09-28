"""
Modifier models for menu item customization options.
"""
from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer,
                        Numeric, String)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Modifiers(Base):
    __tablename__ = "modifiers"
    modifiers_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    name = Column(String(255), nullable=False)
    is_multiple = Column(Boolean, default=False)
    min_selections = Column(Integer, default=0)
    max_selections = Column(Integer, default=1)
    service_type = Column(String(50), default="restaurant")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    property = relationship("HospitalityProperty", back_populates="modifiers")
    option_values = relationship("OptionValue", back_populates="modifier")


class OptionValue(Base):
    __tablename__ = "optionvalue"
    option_value_id = Column(Integer, primary_key=True, index=True)
    modifiers_id = Column(Integer, ForeignKey("modifiers.modifiers_id"))
    value = Column(String(255), nullable=False)
    additional_price = Column(Numeric(10, 2), default=0.00)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    modifier = relationship("Modifiers", back_populates="option_values")


class MenuModifiers(Base):
    __tablename__ = "menumodifiers"
    modifiers_id = Column(
        Integer, ForeignKey("modifiers.modifiers_id"), primary_key=True
    )
    menu_item_id = Column(Integer, ForeignKey("menu.menu_item_id"), primary_key=True)
    is_required = Column(Boolean, default=False)
