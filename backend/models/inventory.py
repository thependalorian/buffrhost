"""
Inventory and ingredient models for Buffr Host.
"""
from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

class UnitOfMeasurement(Base):
    __tablename__ = "unitofmeasurement"
    unit_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"), nullable=False)
    name = Column(String(100), nullable=False)
    abbreviation = Column(String(20), nullable=False)
    service_type = Column(String(50), default='restaurant')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InventoryItem(Base):
    __tablename__ = "inventoryitem"
    inventory_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"), nullable=False)
    name = Column(String(255), nullable=False, index=True)
    current_stock = Column(Numeric(10, 3), default=0)
    reorder_level = Column(Numeric(10, 3), default=0)
    cost_per_unit = Column(Numeric(10, 2))
    supplier_id = Column(String(255))
    expiration_date = Column(Date)
    batch_number = Column(String(100))
    unit_id = Column(Integer, ForeignKey("unitofmeasurement.unit_id"))
    service_type = Column(String(50), default='restaurant')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    property = relationship("HospitalityProperty", back_populates="inventory_items")

class MenuItemRawMaterial(Base):
    __tablename__ = "menuitemrawmaterial"
    menu_item_id = Column(Integer, ForeignKey("menu.menu_item_id"), primary_key=True)
    inventory_id = Column(Integer, ForeignKey("inventoryitem.inventory_id"), primary_key=True)

class Ingredient(Base):
    __tablename__ = "ingredient"
    ingredient_id = Column(Integer, primary_key=True, index=True)
    menu_item_id = Column(Integer, ForeignKey("menu.menu_item_id"))
    inventory_id = Column(Integer, ForeignKey("inventoryitem.inventory_id"))
    unit_id = Column(Integer, ForeignKey("unitofmeasurement.unit_id"))
    quantity = Column(Numeric(10, 3), nullable=False)
    is_visible = Column(Boolean, default=True)
    display_order = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OptionValueIngredient(Base):
    __tablename__ = "optionvalueingredient"
    option_value_id = Column(Integer, ForeignKey("optionvalue.option_value_id"), primary_key=True)
    inventory_id = Column(Integer, ForeignKey("inventoryitem.inventory_id"), primary_key=True)
    unit_id = Column(Integer, ForeignKey("unitofmeasurement.unit_id"))
    quantity = Column(Numeric(10, 3), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OptionValueIngredientMultiplier(Base):
    __tablename__ = "optionvalueingredientmultiplier"
    option_value_id = Column(Integer, ForeignKey("optionvalue.option_value_id"), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey("ingredient.ingredient_id"), primary_key=True)
    multiplier = Column(Numeric(10, 3), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
