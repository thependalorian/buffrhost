/**
 * DEVICE MANAGEMENT SYSTEM
 * Advanced device and IoT management for Buffr Host
 */

import { v4 as uuidv4 } from 'uuid';
import { createHash, createHmac } from 'crypto';

// Enums
export enum DeviceType {
  SENSOR = 'sensor',
  ACTUATOR = 'actuator',
  GATEWAY = 'gateway',
  CAMERA = 'camera',
  LOCK = 'lock',
  THERMOSTAT = 'thermostat',
  LIGHT = 'light',
  SWITCH = 'switch',
  SMOKE_DETECTOR = 'smoke_detector',
  MOTION_DETECTOR = 'motion_detector',
  DOOR_SENSOR = 'door_sensor',
  WINDOW_SENSOR = 'window_sensor',
  WATER_LEAK_DETECTOR = 'water_leak_detector',
  AIR_QUALITY_MONITOR = 'air_quality_monitor',
  ENERGY_MONITOR = 'energy_monitor',
  CUSTOM = 'custom'
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
  UNKNOWN = 'unknown'
}

export enum DeviceProtocol {
  WIFI = 'wifi',
  BLUETOOTH = 'bluetooth',
  ZIGBEE = 'zigbee',
  Z_WAVE = 'z_wave',
  THREAD = 'thread',
  LORA = 'lora',
  NB_IOT = 'nb_iot',
  MQTT = 'mqtt',
  HTTP = 'http',
  COAP = 'coap',
  MODBUS = 'modbus',
  BACNET = 'bacnet'
}

// Interfaces
export interface DeviceCapability {
  name: string;
  type: string; // sensor, actuator, both
  data_type: string; // boolean, integer, float, string, json
  unit?: string;
  min_value?: number;
  max_value?: number;
  precision?: number;
  description: string;
}

export interface DeviceConfiguration {
  protocol: DeviceProtocol;
  connection_params: Record<string, any>;
  polling_interval: number; // seconds
  timeout: number; // seconds
  retry_count: number;
  encryption_key?: string;
  authentication: Record<string, any>;
  custom_settings: Record<string, any>;
}

export interface Device {
  id: string;
  name: string;
  description?: string;
  type: DeviceType;
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  mac_address?: string;
  ip_address?: string;
  status: DeviceStatus;
  location_id?: string;
  property_id?: string;
  room_id?: string;
  capabilities: DeviceCapability[];
  configuration: DeviceConfiguration;
  protocol: DeviceProtocol;
  port?: number;
  endpoint?: string;
  last_seen?: Date;
  battery_level?: number;
  signal_strength?: number;
  firmware_version?: string;
  hardware_version?: string;
  metadata: Record<string, any>;
  is_active: boolean;
  is_public: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface DeviceTelemetry {
  id: string;
  device_id: string;
  capability: string;
  value: string;
  unit?: string;
  timestamp: Date;
  quality: number; // Data quality score 0-1
  metadata: Record<string, any>;
}

export interface DeviceAlert {
  id: string;
  device_id: string;
  alert_type: string;
  severity: string; // low, medium, high, critical
  message: string;
  data: Record<string, any>;
  is_acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: Date;
  resolved_at?: Date;
  created_at: Date;
}

export interface DeviceCommand {
  id: string;
  device_id: string;
  command: string;
  parameters: Record<string, any>;
  status: string; // pending, sent, completed, failed
  result?: Record<string, any>;
  error_message?: string;
  sent_at?: Date;
  completed_at?: Date;
  created_by: string;
  created_at: Date;
}

export interface DeviceManagerOptions {
  db: any; // Database session/connection
  maxWorkers?: number;
}

export class DeviceManager {
  private db: any;
  private deviceCache: Map<string, Device> = new Map();
  private commandHandlers: Map<string, (device: Device, parameters: Record<string, any>) => Promise<Record<string, any>>> = new Map();
  private telemetryProcessors: Map<string, (value: any) => Promise<any>> = new Map();

  constructor(options: DeviceManagerOptions) {
    this.db = options.db;
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers(): void {
    // Command handlers
    this.commandHandlers.set('turn_on', this.handleTurnOn.bind(this));
    this.commandHandlers.set('turn_off', this.handleTurnOff.bind(this));
    this.commandHandlers.set('set_temperature', this.handleSetTemperature.bind(this));
    this.commandHandlers.set('set_brightness', this.handleSetBrightness.bind(this));
    this.commandHandlers.set('lock', this.handleLock.bind(this));
    this.commandHandlers.set('unlock', this.handleUnlock.bind(this));
    this.commandHandlers.set('restart', this.handleRestart.bind(this));
    this.commandHandlers.set('update_firmware', this.handleUpdateFirmware.bind(this));
    this.commandHandlers.set('get_status', this.handleGetStatus.bind(this));

    // Telemetry processors
    this.telemetryProcessors.set('temperature', this.processTemperatureTelemetry.bind(this));
    this.telemetryProcessors.set('humidity', this.processHumidityTelemetry.bind(this));
    this.telemetryProcessors.set('motion', this.processMotionTelemetry.bind(this));
    this.telemetryProcessors.set('door_status', this.processDoorTelemetry.bind(this));
    this.telemetryProcessors.set('energy_usage', this.processEnergyTelemetry.bind(this));
  }

  async registerDevice(deviceData: Record<string, any>): Promise<Device> {
    try {
      // Validate device data
      if (!(await this.validateDeviceData(deviceData))) {
        throw new Error('Invalid device data');
      }

      // Check for duplicate serial number
      if (deviceData.serial_number) {
        const existing = await this.db.query(
          'SELECT * FROM devices WHERE serial_number = ?',
          [deviceData.serial_number]
        );
        if (existing.length > 0) {
          throw new Error('Device with this serial number already exists');
        }
      }

      // Create device
      const device: Device = {
        id: uuidv4(),
        name: deviceData.name,
        description: deviceData.description || '',
        type: deviceData.type,
        model: deviceData.model,
        manufacturer: deviceData.manufacturer,
        serial_number: deviceData.serial_number,
        mac_address: deviceData.mac_address,
        ip_address: deviceData.ip_address,
        status: DeviceStatus.OFFLINE,
        location_id: deviceData.location_id,
        property_id: deviceData.property_id,
        room_id: deviceData.room_id,
        capabilities: deviceData.capabilities || [],
        configuration: deviceData.configuration || {},
        protocol: deviceData.protocol,
        port: deviceData.port,
        endpoint: deviceData.endpoint,
        firmware_version: deviceData.firmware_version,
        hardware_version: deviceData.hardware_version,
        metadata: deviceData.metadata || {},
        is_active: true,
        is_public: false,
        created_by: deviceData.created_by || 'system',
        created_at: new Date(),
        updated_at: new Date()
      };

      // Insert into database
      await this.db.query(
        `INSERT INTO devices (
          id, name, description, type, model, manufacturer, serial_number, mac_address, ip_address,
          status, location_id, property_id, room_id, capabilities, configuration, protocol,
          port, endpoint, last_seen, battery_level, signal_strength, firmware_version,
          hardware_version, metadata, is_active, is_public, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          device.id, device.name, device.description, device.type, device.model, device.manufacturer,
          device.serial_number, device.mac_address, device.ip_address, device.status, device.location_id,
          device.property_id, device.room_id, JSON.stringify(device.capabilities), JSON.stringify(device.configuration),
          device.protocol, device.port, device.endpoint, device.last_seen, device.battery_level,
          device.signal_strength, device.firmware_version, device.hardware_version, JSON.stringify(device.metadata),
          device.is_active, device.is_public, device.created_by, device.created_at, device.updated_at
        ]
      );

      // Cache device
      this.deviceCache.set(device.id, device);

      return device;
    } catch (error) {
      throw new Error(`Failed to register device: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async validateDeviceData(deviceData: Record<string, any>): Promise<boolean> {
    const requiredFields = ['name', 'type', 'protocol'];
    for (const field of requiredFields) {
      if (!(field in deviceData)) {
        return false;
      }
    }

    // Validate device type
    if (!Object.values(DeviceType).includes(deviceData.type)) {
      return false;
    }

    // Validate protocol
    if (!Object.values(DeviceProtocol).includes(deviceData.protocol)) {
      return false;
    }

    return true;
  }

  async getDevice(deviceId: string): Promise<Device | null> {
    try {
      // Check cache first
      if (this.deviceCache.has(deviceId)) {
        return this.deviceCache.get(deviceId)!;
      }

      // Query database
      const result = await this.db.query('SELECT * FROM devices WHERE id = ?', [deviceId]);
      if (result.length === 0) {
        return null;
      }

      const device = this.mapRowToDevice(result[0]);
      this.deviceCache.set(deviceId, device);
      return device;
    } catch (error) {
      console.error('Error getting device:', error);
      return null;
    }
  }

  async getDevicesByType(
    deviceType: DeviceType,
    propertyId?: string,
    status?: DeviceStatus
  ): Promise<Device[]> {
    try {
      let query = 'SELECT * FROM devices WHERE type = ?';
      const params: any[] = [deviceType];

      if (propertyId) {
        query += ' AND property_id = ?';
        params.push(propertyId);
      }
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToDevice(row));
    } catch (error) {
      console.error('Error getting devices by type:', error);
      return [];
    }
  }

  async getDevicesByLocation(locationId: string): Promise<Device[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM devices WHERE location_id = ?',
        [locationId]
      );
      return result.map((row: any) => this.mapRowToDevice(row));
    } catch (error) {
      console.error('Error getting devices by location:', error);
      return [];
    }
  }

  async updateDeviceStatus(
    deviceId: string,
    status: DeviceStatus,
    batteryLevel?: number,
    signalStrength?: number
  ): Promise<boolean> {
    try {
      const device = await this.getDevice(deviceId);
      if (!device) {
        return false;
      }

      const updates: string[] = ['status = ?', 'last_seen = ?', 'updated_at = ?'];
      const params: any[] = [status, new Date(), new Date()];

      if (batteryLevel !== undefined) {
        updates.push('battery_level = ?');
        params.push(batteryLevel);
      }
      if (signalStrength !== undefined) {
        updates.push('signal_strength = ?');
        params.push(signalStrength);
      }

      params.push(deviceId);

      await this.db.query(
        `UPDATE devices SET ${updates.join(', ')} WHERE id = ?`,
        params
      );

      // Update cache
      device.status = status;
      device.last_seen = new Date();
      device.updated_at = new Date();
      if (batteryLevel !== undefined) device.battery_level = batteryLevel;
      if (signalStrength !== undefined) device.signal_strength = signalStrength;
      this.deviceCache.set(deviceId, device);

      return true;
    } catch (error) {
      console.error('Error updating device status:', error);
      return false;
    }
  }

  async sendDeviceCommand(
    deviceId: string,
    command: string,
    parameters: Record<string, any> = {},
    createdBy: string = 'system'
  ): Promise<DeviceCommand> {
    try {
      const device = await this.getDevice(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      if (device.status !== DeviceStatus.ONLINE) {
        throw new Error('Device is not online');
      }

      // Create command record
      const deviceCommand: DeviceCommand = {
        id: uuidv4(),
        device_id: deviceId,
        command,
        parameters,
        status: 'pending',
        created_by: createdBy,
        created_at: new Date()
      };

      await this.db.query(
        `INSERT INTO device_commands (id, device_id, command, parameters, status, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          deviceCommand.id, deviceCommand.device_id, deviceCommand.command,
          JSON.stringify(deviceCommand.parameters), deviceCommand.status,
          deviceCommand.created_by, deviceCommand.created_at
        ]
      );

      // Execute command asynchronously
      setImmediate(() => this.executeDeviceCommand(deviceCommand));

      return deviceCommand;
    } catch (error) {
      throw new Error(`Failed to send command: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeDeviceCommand(command: DeviceCommand): Promise<void> {
    try {
      const device = await this.getDevice(command.device_id);
      if (!device) {
        return;
      }

      // Update command status
      command.status = 'sent';
      command.sent_at = new Date();
      await this.db.query(
        'UPDATE device_commands SET status = ?, sent_at = ? WHERE id = ?',
        [command.status, command.sent_at, command.id]
      );

      // Get command handler
      const handler = this.commandHandlers.get(command.command);
      if (!handler) {
        throw new Error(`No handler for command: ${command.command}`);
      }

      // Execute command
      const result = await handler(device, command.parameters);

      // Update command with result
      command.status = 'completed';
      command.result = result;
      command.completed_at = new Date();
      await this.db.query(
        'UPDATE device_commands SET status = ?, result = ?, completed_at = ? WHERE id = ?',
        [command.status, JSON.stringify(command.result), command.completed_at, command.id]
      );
    } catch (error) {
      // Update command with error
      command.status = 'failed';
      command.error_message = error instanceof Error ? error.message : 'Unknown error';
      command.completed_at = new Date();
      await this.db.query(
        'UPDATE device_commands SET status = ?, error_message = ?, completed_at = ? WHERE id = ?',
        [command.status, command.error_message, command.completed_at, command.id]
      );
    }
  }

  // Command Handlers
  private async handleTurnOn(device: Device, parameters: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for turning on device
    return { status: 'on', timestamp: new Date().toISOString() };
  }

  private async handleTurnOff(device: Device, parameters: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for turning off device
    return { status: 'off', timestamp: new Date().toISOString() };
  }

  private async handleSetTemperature(device: Device, parameters: Record<string, any>): Promise<Record<string, any>> {
    const temperature = parameters.temperature;
    if (temperature === undefined) {
      throw new Error('Temperature parameter required');
    }
    return { temperature, timestamp: new Date().toISOString() };
  }

  private async handleSetBrightness(device: Device, parameters: Record<string, any>): Promise<Record<string, any>> {
    const brightness = parameters.brightness;
    if (brightness === undefined) {
      throw new Error('Brightness parameter required');
    }
    return { brightness, timestamp: new Date().toISOString() };
  }

  private async handleLock(device: Device, parameters: Record<string, any>): Promise<Record<string, any>> {
    return { status: 'locked', timestamp: new Date().toISOString() };
  }

  private async handleUnlock(device: Device, parameters: Record<string, any>): Promise<Record<string, any>> {
    return { status: 'unlocked', timestamp: new Date().toISOString() };
  }

  private async handleRestart(device: Device, parameters: Record<string, any>): Promise<Record<string, any>> {
    return { status: 'restarting', timestamp: new Date().toISOString() };
  }

  private async handleUpdateFirmware(device: Device, parameters: Record<string, any>): Promise<Record<string, any>> {
    const version = parameters.version;
    if (version === undefined) {
      throw new Error('Version parameter required');
    }
    return { firmware_version: version, timestamp: new Date().toISOString() };
  }

  private async handleGetStatus(device: Device, parameters: Record<string, any>): Promise<Record<string, any>> {
    return {
      status: device.status,
      battery_level: device.battery_level,
      signal_strength: device.signal_strength,
      last_seen: device.last_seen?.toISOString() || null,
      timestamp: new Date().toISOString()
    };
  }

  async receiveTelemetry(
    deviceId: string,
    capability: string,
    value: any,
    unit?: string,
    quality: number = 1.0
  ): Promise<DeviceTelemetry> {
    try {
      const device = await this.getDevice(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      // Process telemetry data
      const processedValue = await this.processTelemetryData(capability, value);

      // Create telemetry record
      const telemetry: DeviceTelemetry = {
        id: uuidv4(),
        device_id: deviceId,
        capability,
        value: String(processedValue),
        unit,
        quality,
        timestamp: new Date(),
        metadata: {}
      };

      await this.db.query(
        `INSERT INTO device_telemetry (id, device_id, capability, value, unit, timestamp, quality, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          telemetry.id, telemetry.device_id, telemetry.capability, telemetry.value,
          telemetry.unit, telemetry.timestamp, telemetry.quality, JSON.stringify(telemetry.metadata)
        ]
      );

      // Update device status
      await this.updateDeviceStatus(deviceId, DeviceStatus.ONLINE);

      // Check for alerts
      await this.checkTelemetryAlerts(device, capability, processedValue);

      return telemetry;
    } catch (error) {
      throw new Error(`Failed to receive telemetry: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async processTelemetryData(capability: string, value: any): Promise<any> {
    const processor = this.telemetryProcessors.get(capability);
    if (processor) {
      return await processor(value);
    }
    return value;
  }

  // Telemetry Processors
  private async processTemperatureTelemetry(value: any): Promise<number> {
    const temp = Number(value);
    if (isNaN(temp) || temp < -50 || temp > 100) {
      throw new Error('Temperature out of range');
    }
    return temp;
  }

  private async processHumidityTelemetry(value: any): Promise<number> {
    const humidity = Number(value);
    if (isNaN(humidity) || humidity < 0 || humidity > 100) {
      throw new Error('Humidity out of range');
    }
    return humidity;
  }

  private async processMotionTelemetry(value: any): Promise<boolean> {
    if (typeof value === 'boolean') {
      return value;
    } else if (typeof value === 'string') {
      return ['true', '1', 'yes', 'on', 'motion'].includes(value.toLowerCase());
    } else if (typeof value === 'number') {
      return Boolean(value);
    } else {
      throw new Error('Invalid motion value');
    }
  }

  private async processDoorTelemetry(value: any): Promise<string> {
    if (typeof value === 'string') {
      const status = value.toLowerCase();
      if (['open', 'closed', 'locked', 'unlocked'].includes(status)) {
        return status;
      }
    }
    throw new Error('Invalid door status value');
  }

  private async processEnergyTelemetry(value: any): Promise<number> {
    const energy = Number(value);
    if (isNaN(energy) || energy < 0) {
      throw new Error('Energy usage cannot be negative');
    }
    return energy;
  }

  private async checkTelemetryAlerts(device: Device, capability: string, value: any): Promise<void> {
    try {
      const thresholds: Record<string, { min?: number; max?: number }> = {
        temperature: { min: 10, max: 35 },
        humidity: { min: 20, max: 80 },
        battery_level: { min: 20 },
        signal_strength: { min: -80 }
      };

      if (capability in thresholds) {
        const threshold = thresholds[capability];
        const numValue = Number(value);

        if (threshold.min !== undefined && numValue < threshold.min) {
          await this.createDeviceAlert(
            device.id,
            `low_${capability}`,
            'high',
            `${capability} is below threshold: ${value}`
          );
        } else if (threshold.max !== undefined && numValue > threshold.max) {
          await this.createDeviceAlert(
            device.id,
            `high_${capability}`,
            'high',
            `${capability} is above threshold: ${value}`
          );
        }
      }
    } catch (error) {
      console.error('Error checking telemetry alerts:', error);
    }
  }

  private async createDeviceAlert(
    deviceId: string,
    alertType: string,
    severity: string,
    message: string,
    data: Record<string, any> = {}
  ): Promise<void> {
    try {
      const alert: DeviceAlert = {
        id: uuidv4(),
        device_id: deviceId,
        alert_type: alertType,
        severity,
        message,
        data,
        is_acknowledged: false,
        created_at: new Date()
      };

      await this.db.query(
        `INSERT INTO device_alerts (id, device_id, alert_type, severity, message, data, is_acknowledged, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          alert.id, alert.device_id, alert.alert_type, alert.severity,
          alert.message, JSON.stringify(alert.data), alert.is_acknowledged, alert.created_at
        ]
      );
    } catch (error) {
      console.error('Error creating device alert:', error);
    }
  }

  async getDeviceTelemetry(
    deviceId: string,
    capability?: string,
    startTime?: Date,
    endTime?: Date,
    limit: number = 100
  ): Promise<DeviceTelemetry[]> {
    try {
      let query = 'SELECT * FROM device_telemetry WHERE device_id = ?';
      const params: any[] = [deviceId];

      if (capability) {
        query += ' AND capability = ?';
        params.push(capability);
      }
      if (startTime) {
        query += ' AND timestamp >= ?';
        params.push(startTime);
      }
      if (endTime) {
        query += ' AND timestamp <= ?';
        params.push(endTime);
      }

      query += ' ORDER BY timestamp DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToTelemetry(row));
    } catch (error) {
      console.error('Error getting device telemetry:', error);
      return [];
    }
  }

  async getDeviceAlerts(
    deviceId?: string,
    severity?: string,
    acknowledged?: boolean,
    limit: number = 100
  ): Promise<DeviceAlert[]> {
    try {
      let query = 'SELECT * FROM device_alerts WHERE 1=1';
      const params: any[] = [];

      if (deviceId) {
        query += ' AND device_id = ?';
        params.push(deviceId);
      }
      if (severity) {
        query += ' AND severity = ?';
        params.push(severity);
      }
      if (acknowledged !== undefined) {
        query += ' AND is_acknowledged = ?';
        params.push(acknowledged);
      }

      query += ' ORDER BY created_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToAlert(row));
    } catch (error) {
      console.error('Error getting device alerts:', error);
      return [];
    }
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'UPDATE device_alerts SET is_acknowledged = ?, acknowledged_by = ?, acknowledged_at = ? WHERE id = ? AND is_acknowledged = ?',
        [true, acknowledgedBy, new Date(), alertId, false]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      return false;
    }
  }

  async getDeviceStatistics(propertyId?: string): Promise<Record<string, any>> {
    try {
      let query = 'SELECT * FROM devices';
      const params: any[] = [];

      if (propertyId) {
        query += ' WHERE property_id = ?';
        params.push(propertyId);
      }

      const devices = await this.db.query(query, params);
      const totalDevices = devices.length;
      const onlineDevices = devices.filter((d: any) => d.status === DeviceStatus.ONLINE).length;
      const offlineDevices = devices.filter((d: any) => d.status === DeviceStatus.OFFLINE).length;

      // Count by type
      const typeCounts: Record<string, number> = {};
      for (const deviceType of Object.values(DeviceType)) {
        typeCounts[deviceType] = devices.filter((d: any) => d.type === deviceType).length;
      }

      // Count alerts
      const alertQuery = propertyId
        ? 'SELECT COUNT(*) as count FROM device_alerts da JOIN devices d ON da.device_id = d.id WHERE d.property_id = ?'
        : 'SELECT COUNT(*) as count FROM device_alerts';
      const alertParams = propertyId ? [propertyId] : [];
      const totalAlerts = (await this.db.query(alertQuery, alertParams))[0].count;

      const unacknowledgedQuery = propertyId
        ? 'SELECT COUNT(*) as count FROM device_alerts da JOIN devices d ON da.device_id = d.id WHERE d.property_id = ? AND da.is_acknowledged = ?'
        : 'SELECT COUNT(*) as count FROM device_alerts WHERE is_acknowledged = ?';
      const unacknowledgedParams = propertyId ? [propertyId, false] : [false];
      const unacknowledgedAlerts = (await this.db.query(unacknowledgedQuery, unacknowledgedParams))[0].count;

      return {
        total_devices: totalDevices,
        online_devices: onlineDevices,
        offline_devices: offlineDevices,
        by_type: typeCounts,
        total_alerts: totalAlerts,
        unacknowledged_alerts: unacknowledgedAlerts
      };
    } catch (error) {
      console.error('Error getting device statistics:', error);
      return {};
    }
  }

  async cleanupOldTelemetry(days: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const result = await this.db.query(
        'DELETE FROM device_telemetry WHERE timestamp < ?',
        [cutoffDate]
      );
      return result.affectedRows;
    } catch (error) {
      console.error('Error cleaning up old telemetry:', error);
      return 0;
    }
  }

  // Helper methods
  private mapRowToDevice(row: any): Device {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as DeviceType,
      model: row.model,
      manufacturer: row.manufacturer,
      serial_number: row.serial_number,
      mac_address: row.mac_address,
      ip_address: row.ip_address,
      status: row.status as DeviceStatus,
      location_id: row.location_id,
      property_id: row.property_id,
      room_id: row.room_id,
      capabilities: JSON.parse(row.capabilities || '[]'),
      configuration: JSON.parse(row.configuration || '{}'),
      protocol: row.protocol as DeviceProtocol,
      port: row.port,
      endpoint: row.endpoint,
      last_seen: row.last_seen ? new Date(row.last_seen) : undefined,
      battery_level: row.battery_level,
      signal_strength: row.signal_strength,
      firmware_version: row.firmware_version,
      hardware_version: row.hardware_version,
      metadata: JSON.parse(row.metadata || '{}'),
      is_active: Boolean(row.is_active),
      is_public: Boolean(row.is_public),
      created_by: row.created_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }

  private mapRowToTelemetry(row: any): DeviceTelemetry {
    return {
      id: row.id,
      device_id: row.device_id,
      capability: row.capability,
      value: row.value,
      unit: row.unit,
      timestamp: new Date(row.timestamp),
      quality: row.quality,
      metadata: JSON.parse(row.metadata || '{}')
    };
  }

  private mapRowToAlert(row: any): DeviceAlert {
    return {
      id: row.id,
      device_id: row.device_id,
      alert_type: row.alert_type,
      severity: row.severity,
      message: row.message,
      data: JSON.parse(row.data || '{}'),
      is_acknowledged: Boolean(row.is_acknowledged),
      acknowledged_by: row.acknowledged_by,
      acknowledged_at: row.acknowledged_at ? new Date(row.acknowledged_at) : undefined,
      resolved_at: row.resolved_at ? new Date(row.resolved_at) : undefined,
      created_at: new Date(row.created_at)
    };
  }
}

export default DeviceManager;