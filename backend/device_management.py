"""
DEVICE MANAGEMENT SYSTEM
Advanced device and IoT management for Buffr Host
"""

from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import json
import uuid
import asyncio
import hashlib
import hmac

Base = declarative_base()

class DeviceType(Enum):
    """Device types"""
    SENSOR = "sensor"
    ACTUATOR = "actuator"
    GATEWAY = "gateway"
    CAMERA = "camera"
    LOCK = "lock"
    THERMOSTAT = "thermostat"
    LIGHT = "light"
    SWITCH = "switch"
    SMOKE_DETECTOR = "smoke_detector"
    MOTION_DETECTOR = "motion_detector"
    DOOR_SENSOR = "door_sensor"
    WINDOW_SENSOR = "window_sensor"
    WATER_LEAK_DETECTOR = "water_leak_detector"
    AIR_QUALITY_MONITOR = "air_quality_monitor"
    ENERGY_MONITOR = "energy_monitor"
    CUSTOM = "custom"

class DeviceStatus(Enum):
    """Device status"""
    ONLINE = "online"
    OFFLINE = "offline"
    MAINTENANCE = "maintenance"
    ERROR = "error"
    UNKNOWN = "unknown"

class DeviceProtocol(Enum):
    """Device communication protocols"""
    WIFI = "wifi"
    BLUETOOTH = "bluetooth"
    ZIGBEE = "zigbee"
    Z_WAVE = "z_wave"
    THREAD = "thread"
    LORA = "lora"
    NB_IOT = "nb_iot"
    MQTT = "mqtt"
    HTTP = "http"
    COAP = "coap"
    MODBUS = "modbus"
    BACNET = "bacnet"

@dataclass
class DeviceCapability:
    """Device capability definition"""
    name: str
    type: str  # sensor, actuator, both
    data_type: str  # boolean, integer, float, string, json
    unit: Optional[str] = None
    min_value: Optional[Union[int, float]] = None
    max_value: Optional[Union[int, float]] = None
    precision: Optional[int] = None
    description: str = ""

@dataclass
class DeviceConfiguration:
    """Device configuration"""
    protocol: DeviceProtocol
    connection_params: Dict[str, Any] = field(default_factory=dict)
    polling_interval: int = 60  # seconds
    timeout: int = 30  # seconds
    retry_count: int = 3
    encryption_key: Optional[str] = None
    authentication: Dict[str, Any] = field(default_factory=dict)
    custom_settings: Dict[str, Any] = field(default_factory=dict)

class Device(Base):
    """Device model"""
    __tablename__ = 'devices'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)
    model = Column(String(100))
    manufacturer = Column(String(100))
    serial_number = Column(String(100), unique=True)
    mac_address = Column(String(17))  # MAC address format
    ip_address = Column(String(45))  # IPv6 compatible
    status = Column(String(50), default=DeviceStatus.OFFLINE.value)
    
    # Location and hierarchy
    location_id = Column(String, ForeignKey('locations.id'))
    property_id = Column(String(255))
    room_id = Column(String(255))
    
    # Device configuration
    capabilities = Column(JSON)  # List of DeviceCapability objects
    configuration = Column(JSON)  # DeviceConfiguration object
    
    # Network and communication
    protocol = Column(String(50), nullable=False)
    port = Column(Integer)
    endpoint = Column(String(255))
    
    # Status and monitoring
    last_seen = Column(DateTime)
    battery_level = Column(Float)  # 0-100
    signal_strength = Column(Float)  # dBm
    firmware_version = Column(String(50))
    hardware_version = Column(String(50))
    
    # Metadata
    metadata = Column(JSON)
    is_active = Column(Boolean, default=True)
    is_public = Column(Boolean, default=False)
    
    # Timestamps
    created_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    location = relationship("Location")
    telemetry = relationship("DeviceTelemetry", back_populates="device")
    alerts = relationship("DeviceAlert", back_populates="device")
    commands = relationship("DeviceCommand", back_populates="device")

class DeviceTelemetry(Base):
    """Device telemetry data model"""
    __tablename__ = 'device_telemetry'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, ForeignKey('devices.id'))
    capability = Column(String(100), nullable=False)
    value = Column(Text, nullable=False)
    unit = Column(String(20))
    timestamp = Column(DateTime, default=datetime.utcnow)
    quality = Column(Float)  # Data quality score 0-1
    metadata = Column(JSON)
    
    # Relationships
    device = relationship("Device", back_populates="telemetry")

class DeviceAlert(Base):
    """Device alert model"""
    __tablename__ = 'device_alerts'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, ForeignKey('devices.id'))
    alert_type = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)  # low, medium, high, critical
    message = Column(Text, nullable=False)
    data = Column(JSON)
    is_acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(255))
    acknowledged_at = Column(DateTime)
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    device = relationship("Device", back_populates="alerts")

class DeviceCommand(Base):
    """Device command model"""
    __tablename__ = 'device_commands'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, ForeignKey('devices.id'))
    command = Column(String(100), nullable=False)
    parameters = Column(JSON)
    status = Column(String(50), default="pending")  # pending, sent, completed, failed
    result = Column(JSON)
    error_message = Column(Text)
    sent_at = Column(DateTime)
    completed_at = Column(DateTime)
    created_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    device = relationship("Device", back_populates="commands")

class DeviceManager:
    """Advanced device management system"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.device_cache: Dict[str, Device] = {}
        self.command_handlers: Dict[str, callable] = {}
        self.telemetry_processors: Dict[str, callable] = {}
        self._register_default_handlers()
    
    def _register_default_handlers(self):
        """Register default device handlers"""
        self.command_handlers.update({
            'turn_on': self._handle_turn_on,
            'turn_off': self._handle_turn_off,
            'set_temperature': self._handle_set_temperature,
            'set_brightness': self._handle_set_brightness,
            'lock': self._handle_lock,
            'unlock': self._handle_unlock,
            'restart': self._handle_restart,
            'update_firmware': self._handle_update_firmware,
            'get_status': self._handle_get_status
        })
        
        self.telemetry_processors.update({
            'temperature': self._process_temperature_telemetry,
            'humidity': self._process_humidity_telemetry,
            'motion': self._process_motion_telemetry,
            'door_status': self._process_door_telemetry,
            'energy_usage': self._process_energy_telemetry
        })
    
    async def register_device(self, device_data: Dict[str, Any]) -> Device:
        """Register a new device"""
        try:
            # Validate device data
            if not await self._validate_device_data(device_data):
                raise Exception("Invalid device data")
            
            # Check for duplicate serial number
            if device_data.get('serial_number'):
                existing = await self.db.query(Device).filter(
                    Device.serial_number == device_data['serial_number']
                ).first()
                if existing:
                    raise Exception("Device with this serial number already exists")
            
            # Create device
            device = Device(
                name=device_data['name'],
                description=device_data.get('description', ''),
                type=device_data['type'],
                model=device_data.get('model'),
                manufacturer=device_data.get('manufacturer'),
                serial_number=device_data.get('serial_number'),
                mac_address=device_data.get('mac_address'),
                ip_address=device_data.get('ip_address'),
                location_id=device_data.get('location_id'),
                property_id=device_data.get('property_id'),
                room_id=device_data.get('room_id'),
                capabilities=device_data.get('capabilities', []),
                configuration=device_data.get('configuration', {}),
                protocol=device_data['protocol'],
                port=device_data.get('port'),
                endpoint=device_data.get('endpoint'),
                firmware_version=device_data.get('firmware_version'),
                hardware_version=device_data.get('hardware_version'),
                metadata=device_data.get('metadata', {}),
                created_by=device_data.get('created_by', 'system')
            )
            
            self.db.add(device)
            await self.db.commit()
            await self.db.refresh(device)
            
            # Cache device
            self.device_cache[device.id] = device
            
            return device
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to register device: {str(e)}")
    
    async def _validate_device_data(self, device_data: Dict[str, Any]) -> bool:
        """Validate device registration data"""
        required_fields = ['name', 'type', 'protocol']
        for field in required_fields:
            if field not in device_data:
                return False
        
        # Validate device type
        try:
            DeviceType(device_data['type'])
        except ValueError:
            return False
        
        # Validate protocol
        try:
            DeviceProtocol(device_data['protocol'])
        except ValueError:
            return False
        
        return True
    
    async def get_device(self, device_id: str) -> Optional[Device]:
        """Get device by ID"""
        try:
            if device_id in self.device_cache:
                return self.device_cache[device_id]
            
            device = await self.db.get(Device, device_id)
            if device:
                self.device_cache[device_id] = device
            
            return device
        except Exception:
            return None
    
    async def get_devices_by_type(self, device_type: DeviceType, 
                                property_id: str = None,
                                status: DeviceStatus = None) -> List[Device]:
        """Get devices by type"""
        try:
            query = self.db.query(Device).filter(Device.type == device_type.value)
            
            if property_id:
                query = query.filter(Device.property_id == property_id)
            if status:
                query = query.filter(Device.status == status.value)
            
            return await query.all()
        except Exception:
            return []
    
    async def get_devices_by_location(self, location_id: str) -> List[Device]:
        """Get devices by location"""
        try:
            return await self.db.query(Device).filter(
                Device.location_id == location_id
            ).all()
        except Exception:
            return []
    
    async def update_device_status(self, device_id: str, status: DeviceStatus, 
                                 battery_level: float = None,
                                 signal_strength: float = None) -> bool:
        """Update device status"""
        try:
            device = await self.get_device(device_id)
            if not device:
                return False
            
            device.status = status.value
            device.last_seen = datetime.utcnow()
            
            if battery_level is not None:
                device.battery_level = battery_level
            if signal_strength is not None:
                device.signal_strength = signal_strength
            
            device.updated_at = datetime.utcnow()
            await self.db.commit()
            
            return True
        except Exception:
            return False
    
    async def send_device_command(self, device_id: str, command: str, 
                                parameters: Dict[str, Any] = None,
                                created_by: str = "system") -> DeviceCommand:
        """Send command to device"""
        try:
            device = await self.get_device(device_id)
            if not device:
                raise Exception("Device not found")
            
            if device.status != DeviceStatus.ONLINE.value:
                raise Exception("Device is not online")
            
            # Create command record
            device_command = DeviceCommand(
                device_id=device_id,
                command=command,
                parameters=parameters or {},
                created_by=created_by
            )
            
            self.db.add(device_command)
            await self.db.commit()
            await self.db.refresh(device_command)
            
            # Execute command
            asyncio.create_task(self._execute_device_command(device_command))
            
            return device_command
        except Exception as e:
            raise Exception(f"Failed to send command: {str(e)}")
    
    async def _execute_device_command(self, command: DeviceCommand):
        """Execute device command"""
        try:
            device = await self.get_device(command.device_id)
            if not device:
                return
            
            # Update command status
            command.status = "sent"
            command.sent_at = datetime.utcnow()
            await self.db.commit()
            
            # Get command handler
            handler = self.command_handlers.get(command.command)
            if not handler:
                raise Exception(f"No handler for command: {command.command}")
            
            # Execute command
            result = await handler(device, command.parameters)
            
            # Update command with result
            command.status = "completed"
            command.result = result
            command.completed_at = datetime.utcnow()
            await self.db.commit()
            
        except Exception as e:
            # Update command with error
            command.status = "failed"
            command.error_message = str(e)
            command.completed_at = datetime.utcnow()
            await self.db.commit()
    
    # Command Handlers
    async def _handle_turn_on(self, device: Device, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle turn on command"""
        # Implementation for turning on device
        return {"status": "on", "timestamp": datetime.utcnow().isoformat()}
    
    async def _handle_turn_off(self, device: Device, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle turn off command"""
        # Implementation for turning off device
        return {"status": "off", "timestamp": datetime.utcnow().isoformat()}
    
    async def _handle_set_temperature(self, device: Device, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle set temperature command"""
        temperature = parameters.get('temperature')
        if temperature is None:
            raise Exception("Temperature parameter required")
        
        # Implementation for setting temperature
        return {"temperature": temperature, "timestamp": datetime.utcnow().isoformat()}
    
    async def _handle_set_brightness(self, device: Device, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle set brightness command"""
        brightness = parameters.get('brightness')
        if brightness is None:
            raise Exception("Brightness parameter required")
        
        # Implementation for setting brightness
        return {"brightness": brightness, "timestamp": datetime.utcnow().isoformat()}
    
    async def _handle_lock(self, device: Device, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle lock command"""
        # Implementation for locking device
        return {"status": "locked", "timestamp": datetime.utcnow().isoformat()}
    
    async def _handle_unlock(self, device: Device, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle unlock command"""
        # Implementation for unlocking device
        return {"status": "unlocked", "timestamp": datetime.utcnow().isoformat()}
    
    async def _handle_restart(self, device: Device, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle restart command"""
        # Implementation for restarting device
        return {"status": "restarting", "timestamp": datetime.utcnow().isoformat()}
    
    async def _handle_update_firmware(self, device: Device, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle firmware update command"""
        version = parameters.get('version')
        if version is None:
            raise Exception("Version parameter required")
        
        # Implementation for firmware update
        return {"firmware_version": version, "timestamp": datetime.utcnow().isoformat()}
    
    async def _handle_get_status(self, device: Device, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Handle get status command"""
        return {
            "status": device.status,
            "battery_level": device.battery_level,
            "signal_strength": device.signal_strength,
            "last_seen": device.last_seen.isoformat() if device.last_seen else None,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def receive_telemetry(self, device_id: str, capability: str, 
                              value: Any, unit: str = None,
                              quality: float = 1.0) -> DeviceTelemetry:
        """Receive telemetry data from device"""
        try:
            device = await self.get_device(device_id)
            if not device:
                raise Exception("Device not found")
            
            # Process telemetry data
            processed_value = await self._process_telemetry_data(capability, value)
            
            # Create telemetry record
            telemetry = DeviceTelemetry(
                device_id=device_id,
                capability=capability,
                value=str(processed_value),
                unit=unit,
                quality=quality
            )
            
            self.db.add(telemetry)
            await self.db.commit()
            await self.db.refresh(telemetry)
            
            # Update device status
            await self.update_device_status(device_id, DeviceStatus.ONLINE)
            
            # Check for alerts
            await self._check_telemetry_alerts(device, capability, processed_value)
            
            return telemetry
        except Exception as e:
            raise Exception(f"Failed to receive telemetry: {str(e)}")
    
    async def _process_telemetry_data(self, capability: str, value: Any) -> Any:
        """Process telemetry data based on capability"""
        processor = self.telemetry_processors.get(capability)
        if processor:
            return await processor(value)
        return value
    
    # Telemetry Processors
    async def _process_temperature_telemetry(self, value: Any) -> float:
        """Process temperature telemetry"""
        try:
            temp = float(value)
            # Validate temperature range
            if temp < -50 or temp > 100:
                raise ValueError("Temperature out of range")
            return temp
        except (ValueError, TypeError):
            raise ValueError("Invalid temperature value")
    
    async def _process_humidity_telemetry(self, value: Any) -> float:
        """Process humidity telemetry"""
        try:
            humidity = float(value)
            # Validate humidity range
            if humidity < 0 or humidity > 100:
                raise ValueError("Humidity out of range")
            return humidity
        except (ValueError, TypeError):
            raise ValueError("Invalid humidity value")
    
    async def _process_motion_telemetry(self, value: Any) -> bool:
        """Process motion telemetry"""
        if isinstance(value, bool):
            return value
        elif isinstance(value, str):
            return value.lower() in ['true', '1', 'yes', 'on', 'motion']
        elif isinstance(value, (int, float)):
            return bool(value)
        else:
            raise ValueError("Invalid motion value")
    
    async def _process_door_telemetry(self, value: Any) -> str:
        """Process door status telemetry"""
        if isinstance(value, str):
            status = value.lower()
            if status in ['open', 'closed', 'locked', 'unlocked']:
                return status
        raise ValueError("Invalid door status value")
    
    async def _process_energy_telemetry(self, value: Any) -> float:
        """Process energy usage telemetry"""
        try:
            energy = float(value)
            if energy < 0:
                raise ValueError("Energy usage cannot be negative")
            return energy
        except (ValueError, TypeError):
            raise ValueError("Invalid energy value")
    
    async def _check_telemetry_alerts(self, device: Device, capability: str, value: Any):
        """Check for alerts based on telemetry data"""
        try:
            # Define alert thresholds
            thresholds = {
                'temperature': {'min': 10, 'max': 35},
                'humidity': {'min': 20, 'max': 80},
                'battery_level': {'min': 20},
                'signal_strength': {'min': -80}
            }
            
            if capability in thresholds:
                threshold = thresholds[capability]
                
                # Check thresholds
                if 'min' in threshold and value < threshold['min']:
                    await self._create_device_alert(
                        device.id, f"low_{capability}", "high",
                        f"{capability} is below threshold: {value}"
                    )
                elif 'max' in threshold and value > threshold['max']:
                    await self._create_device_alert(
                        device.id, f"high_{capability}", "high",
                        f"{capability} is above threshold: {value}"
                    )
        except Exception as e:
            print(f"Error checking telemetry alerts: {e}")
    
    async def _create_device_alert(self, device_id: str, alert_type: str, 
                                 severity: str, message: str, data: Dict[str, Any] = None):
        """Create device alert"""
        try:
            alert = DeviceAlert(
                device_id=device_id,
                alert_type=alert_type,
                severity=severity,
                message=message,
                data=data or {}
            )
            
            self.db.add(alert)
            await self.db.commit()
        except Exception as e:
            print(f"Error creating device alert: {e}")
    
    async def get_device_telemetry(self, device_id: str, capability: str = None,
                                 start_time: datetime = None, end_time: datetime = None,
                                 limit: int = 100) -> List[DeviceTelemetry]:
        """Get device telemetry data"""
        try:
            query = self.db.query(DeviceTelemetry).filter(
                DeviceTelemetry.device_id == device_id
            )
            
            if capability:
                query = query.filter(DeviceTelemetry.capability == capability)
            if start_time:
                query = query.filter(DeviceTelemetry.timestamp >= start_time)
            if end_time:
                query = query.filter(DeviceTelemetry.timestamp <= end_time)
            
            return await query.order_by(DeviceTelemetry.timestamp.desc()).limit(limit).all()
        except Exception:
            return []
    
    async def get_device_alerts(self, device_id: str = None, severity: str = None,
                              acknowledged: bool = None, limit: int = 100) -> List[DeviceAlert]:
        """Get device alerts"""
        try:
            query = self.db.query(DeviceAlert)
            
            if device_id:
                query = query.filter(DeviceAlert.device_id == device_id)
            if severity:
                query = query.filter(DeviceAlert.severity == severity)
            if acknowledged is not None:
                query = query.filter(DeviceAlert.is_acknowledged == acknowledged)
            
            return await query.order_by(DeviceAlert.created_at.desc()).limit(limit).all()
        except Exception:
            return []
    
    async def acknowledge_alert(self, alert_id: str, acknowledged_by: str) -> bool:
        """Acknowledge device alert"""
        try:
            alert = await self.db.get(DeviceAlert, alert_id)
            if alert and not alert.is_acknowledged:
                alert.is_acknowledged = True
                alert.acknowledged_by = acknowledged_by
                alert.acknowledged_at = datetime.utcnow()
                await self.db.commit()
                return True
            return False
        except Exception:
            return False
    
    async def get_device_statistics(self, property_id: str = None) -> Dict[str, Any]:
        """Get device statistics"""
        try:
            query = self.db.query(Device)
            if property_id:
                query = query.filter(Device.property_id == property_id)
            
            total_devices = await query.count()
            online_devices = await query.filter(Device.status == DeviceStatus.ONLINE.value).count()
            offline_devices = await query.filter(Device.status == DeviceStatus.OFFLINE.value).count()
            
            # Count by type
            type_counts = {}
            for device_type in DeviceType:
                count = await query.filter(Device.type == device_type.value).count()
                type_counts[device_type.value] = count
            
            # Count alerts
            total_alerts = await self.db.query(DeviceAlert).count()
            unacknowledged_alerts = await self.db.query(DeviceAlert).filter(
                DeviceAlert.is_acknowledged == False
            ).count()
            
            return {
                "total_devices": total_devices,
                "online_devices": online_devices,
                "offline_devices": offline_devices,
                "by_type": type_counts,
                "total_alerts": total_alerts,
                "unacknowledged_alerts": unacknowledged_alerts
            }
        except Exception:
            return {}
    
    async def cleanup_old_telemetry(self, days: int = 30) -> int:
        """Clean up old telemetry data"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            old_telemetry = await self.db.query(DeviceTelemetry).filter(
                DeviceTelemetry.timestamp < cutoff_date
            ).all()
            
            count = len(old_telemetry)
            for telemetry in old_telemetry:
                await self.db.delete(telemetry)
            
            await self.db.commit()
            return count
        except Exception:
            return 0