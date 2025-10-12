/**
 * SETTINGS MANAGEMENT SYSTEM
 * Advanced settings and configuration management for Buffr Host
 */

import { v4 as uuidv4 } from 'uuid';
import { createHash, randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';

// Enums
export enum SettingType {
  STRING = 'string',
  INTEGER = 'integer',
  FLOAT = 'float',
  BOOLEAN = 'boolean',
  JSON = 'json',
  ARRAY = 'array',
  OBJECT = 'object',
  PASSWORD = 'password',
  EMAIL = 'email',
  URL = 'url',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  COLOR = 'color',
  FILE = 'file',
  ENCRYPTED = 'encrypted'
}

export enum SettingScope {
  GLOBAL = 'global',
  PROPERTY = 'property',
  USER = 'user',
  ROLE = 'role',
  MODULE = 'module',
  TENANT = 'tenant'
}

export enum SettingCategory {
  GENERAL = 'general',
  SECURITY = 'security',
  NOTIFICATIONS = 'notifications',
  INTEGRATIONS = 'integrations',
  APPEARANCE = 'appearance',
  PERFORMANCE = 'performance',
  BACKUP = 'backup',
  ANALYTICS = 'analytics',
  PAYMENTS = 'payments',
  BOOKINGS = 'bookings',
  CUSTOM = 'custom'
}

// Interfaces
export interface SettingValidation {
  required: boolean;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  enum_values?: any[];
  custom_validator?: (value: any) => boolean;
  error_message?: string;
}

export interface SettingDefinition {
  key: string;
  name: string;
  description: string;
  type: SettingType;
  category: SettingCategory;
  scope: SettingScope;
  default_value: any;
  validation: SettingValidation;
  is_encrypted: boolean;
  is_sensitive: boolean;
  is_readonly: boolean;
  metadata: Record<string, any>;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  type: SettingType;
  scope: SettingScope;
  scope_id?: string; // ID of the scope (property_id, user_id, etc.)
  category: SettingCategory;
  is_encrypted: boolean;
  is_sensitive: boolean;
  is_readonly: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface SettingHistory {
  id: string;
  setting_id: string;
  old_value: any;
  new_value: any;
  changed_by: string;
  change_reason?: string;
  created_at: Date;
}

export interface SettingsManagerOptions {
  db: any; // Database session/connection
  redisClient?: any; // Redis client for caching
  encryptionKey?: string;
  defaultSettings?: SettingDefinition[];
}

export class SettingsManager {
  private db: any;
  private redis?: any;
  private encryptionKey: string;
  private settingDefinitions: Map<string, SettingDefinition> = new Map();
  private settingsCache: Map<string, Setting> = new Map();
  private defaultSettings: SettingDefinition[];

  constructor(options: SettingsManagerOptions) {
    this.db = options.db;
    this.redis = options.redisClient;
    this.encryptionKey = options.encryptionKey || this.generateEncryptionKey();
    this.defaultSettings = options.defaultSettings || this.getDefaultSettings();
    this.initializeSettings();
  }

  private generateEncryptionKey(): string {
    return randomBytes(32).toString('hex');
  }

  private getDefaultSettings(): SettingDefinition[] {
    return [
      {
        key: 'app_name',
        name: 'Application Name',
        description: 'The name of the application',
        type: SettingType.STRING,
        category: SettingCategory.GENERAL,
        scope: SettingScope.GLOBAL,
        default_value: 'Buffr Host',
        validation: { required: true, min_length: 1, max_length: 100 },
        is_encrypted: false,
        is_sensitive: false,
        is_readonly: false,
        metadata: {}
      },
      {
        key: 'app_version',
        name: 'Application Version',
        description: 'The current version of the application',
        type: SettingType.STRING,
        category: SettingCategory.GENERAL,
        scope: SettingScope.GLOBAL,
        default_value: '1.0.0',
        validation: { required: true, pattern: '^\\d+\\.\\d+\\.\\d+$' },
        is_encrypted: false,
        is_sensitive: false,
        is_readonly: true,
        metadata: {}
      },
      {
        key: 'session_timeout',
        name: 'Session Timeout',
        description: 'Session timeout in minutes',
        type: SettingType.INTEGER,
        category: SettingCategory.SECURITY,
        scope: SettingScope.GLOBAL,
        default_value: 30,
        validation: { required: true, min_value: 1, max_value: 1440 },
        is_encrypted: false,
        is_sensitive: false,
        is_readonly: false,
        metadata: {}
      },
      {
        key: 'max_login_attempts',
        name: 'Maximum Login Attempts',
        description: 'Maximum number of failed login attempts before lockout',
        type: SettingType.INTEGER,
        category: SettingCategory.SECURITY,
        scope: SettingScope.GLOBAL,
        default_value: 5,
        validation: { required: true, min_value: 1, max_value: 20 },
        is_encrypted: false,
        is_sensitive: false,
        is_readonly: false,
        metadata: {}
      },
      {
        key: 'email_notifications',
        name: 'Email Notifications',
        description: 'Enable email notifications',
        type: SettingType.BOOLEAN,
        category: SettingCategory.NOTIFICATIONS,
        scope: SettingScope.GLOBAL,
        default_value: true,
        validation: { required: true },
        is_encrypted: false,
        is_sensitive: false,
        is_readonly: false,
        metadata: {}
      },
      {
        key: 'smtp_password',
        name: 'SMTP Password',
        description: 'SMTP server password',
        type: SettingType.PASSWORD,
        category: SettingCategory.INTEGRATIONS,
        scope: SettingScope.GLOBAL,
        default_value: '',
        validation: { required: false },
        is_encrypted: true,
        is_sensitive: true,
        is_readonly: false,
        metadata: {}
      }
    ];
  }

  private async initializeSettings(): Promise<void> {
    try {
      // Load setting definitions
      for (const definition of this.defaultSettings) {
        this.settingDefinitions.set(definition.key, definition);
      }

      // Load existing settings from database
      await this.loadSettingsFromDatabase();
    } catch (error) {
      console.error('Error initializing settings:', error);
    }
  }

  private async loadSettingsFromDatabase(): Promise<void> {
    try {
      const result = await this.db.query('SELECT * FROM settings');
      for (const row of result) {
        const setting = this.mapRowToSetting(row);
        this.settingsCache.set(this.getCacheKey(setting.key, setting.scope, setting.scope_id), setting);
      }
    } catch (error) {
      console.error('Error loading settings from database:', error);
    }
  }

  private getCacheKey(key: string, scope: SettingScope, scopeId?: string): string {
    return `${key}:${scope}:${scopeId || 'default'}`;
  }

  async getSetting(
    key: string,
    scope: SettingScope = SettingScope.GLOBAL,
    scopeId?: string
  ): Promise<any> {
    try {
      const cacheKey = this.getCacheKey(key, scope, scopeId);
      
      // Check cache first
      if (this.settingsCache.has(cacheKey)) {
        const setting = this.settingsCache.get(cacheKey)!;
        return this.decryptValue(setting.value, setting.is_encrypted);
      }

      // Check Redis cache
      if (this.redis) {
        const cachedValue = await this.redis.get(`setting:${cacheKey}`);
        if (cachedValue) {
          const setting = JSON.parse(cachedValue);
          return this.decryptValue(setting.value, setting.is_encrypted);
        }
      }

      // Query database
      let query = 'SELECT * FROM settings WHERE key = ? AND scope = ?';
      const params: any[] = [key, scope];

      if (scopeId) {
        query += ' AND scope_id = ?';
        params.push(scopeId);
      } else {
        query += ' AND scope_id IS NULL';
      }

      const result = await this.db.query(query, params);
      if (result.length === 0) {
        // Return default value if setting doesn't exist
        const definition = this.settingDefinitions.get(key);
        if (definition) {
          return definition.default_value;
        }
        return null;
      }

      const setting = this.mapRowToSetting(result[0]);
      this.settingsCache.set(cacheKey, setting);

      // Store in Redis
      if (this.redis) {
        await this.redis.setex(`setting:${cacheKey}`, 3600, JSON.stringify(setting));
      }

      return this.decryptValue(setting.value, setting.is_encrypted);
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  }

  async setSetting(
    key: string,
    value: any,
    scope: SettingScope = SettingScope.GLOBAL,
    scopeId?: string,
    userId: string = 'system'
  ): Promise<boolean> {
    try {
      // Get setting definition
      const definition = this.settingDefinitions.get(key);
      if (!definition) {
        throw new Error(`Setting definition not found for key: ${key}`);
      }

      // Validate value
      if (!this.validateSettingValue(value, definition)) {
        throw new Error(`Invalid value for setting: ${key}`);
      }

      // Encrypt value if needed
      const encryptedValue = definition.is_encrypted ? this.encryptValue(value) : value;

      // Check if setting exists
      const cacheKey = this.getCacheKey(key, scope, scopeId);
      const existingSetting = this.settingsCache.get(cacheKey);

      if (existingSetting) {
        // Update existing setting
        const oldValue = this.decryptValue(existingSetting.value, existingSetting.is_encrypted);
        
        await this.db.query(
          'UPDATE settings SET value = ?, updated_at = ? WHERE id = ?',
          [JSON.stringify(encryptedValue), new Date(), existingSetting.id]
        );

        // Log change
        await this.logSettingChange(existingSetting.id, oldValue, value, userId);

        // Update cache
        existingSetting.value = encryptedValue;
        existingSetting.updated_at = new Date();
        this.settingsCache.set(cacheKey, existingSetting);
      } else {
        // Create new setting
        const setting: Setting = {
          id: uuidv4(),
          key,
          value: encryptedValue,
          type: definition.type,
          scope,
          scope_id: scopeId,
          category: definition.category,
          is_encrypted: definition.is_encrypted,
          is_sensitive: definition.is_sensitive,
          is_readonly: definition.is_readonly,
          created_by: userId,
          created_at: new Date(),
          updated_at: new Date()
        };

        await this.db.query(
          `INSERT INTO settings (id, key, value, type, scope, scope_id, category, is_encrypted, is_sensitive, is_readonly, created_by, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            setting.id, setting.key, JSON.stringify(setting.value), setting.type, setting.scope,
            setting.scope_id, setting.category, setting.is_encrypted, setting.is_sensitive,
            setting.is_readonly, setting.created_by, setting.created_at, setting.updated_at
          ]
        );

        // Log change
        await this.logSettingChange(setting.id, null, value, userId);

        // Update cache
        this.settingsCache.set(cacheKey, setting);
      }

      // Update Redis cache
      if (this.redis) {
        const setting = this.settingsCache.get(cacheKey)!;
        await this.redis.setex(`setting:${cacheKey}`, 3600, JSON.stringify(setting));
      }

      return true;
    } catch (error) {
      console.error('Error setting setting:', error);
      return false;
    }
  }

  private validateSettingValue(value: any, definition: SettingDefinition): boolean {
    const validation = definition.validation;

    // Check required
    if (validation.required && (value === null || value === undefined || value === '')) {
      return false;
    }

    // Type validation
    if (!this.validateType(value, definition.type)) {
      return false;
    }

    // String validation
    if (definition.type === SettingType.STRING || definition.type === SettingType.PASSWORD) {
      if (typeof value !== 'string') {
        return false;
      }
      if (validation.min_length && value.length < validation.min_length) {
        return false;
      }
      if (validation.max_length && value.length > validation.max_length) {
        return false;
      }
      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        return false;
      }
    }

    // Number validation
    if (definition.type === SettingType.INTEGER || definition.type === SettingType.FLOAT) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return false;
      }
      if (validation.min_value !== undefined && numValue < validation.min_value) {
        return false;
      }
      if (validation.max_value !== undefined && numValue > validation.max_value) {
        return false;
      }
    }

    // Enum validation
    if (validation.enum_values && !validation.enum_values.includes(value)) {
      return false;
    }

    // Custom validation
    if (validation.custom_validator && !validation.custom_validator(value)) {
      return false;
    }

    return true;
  }

  private validateType(value: any, type: SettingType): boolean {
    switch (type) {
      case SettingType.STRING:
      case SettingType.PASSWORD:
      case SettingType.EMAIL:
      case SettingType.URL:
      case SettingType.COLOR:
        return typeof value === 'string';
      case SettingType.INTEGER:
        return Number.isInteger(Number(value));
      case SettingType.FLOAT:
        return !isNaN(Number(value));
      case SettingType.BOOLEAN:
        return typeof value === 'boolean';
      case SettingType.JSON:
      case SettingType.OBJECT:
        return typeof value === 'object' && value !== null;
      case SettingType.ARRAY:
        return Array.isArray(value);
      case SettingType.DATE:
      case SettingType.TIME:
      case SettingType.DATETIME:
        return value instanceof Date || !isNaN(Date.parse(value));
      case SettingType.FILE:
        return typeof value === 'string' || value instanceof File;
      case SettingType.ENCRYPTED:
        return true; // Can be any type
      default:
        return true;
    }
  }

  private encryptValue(value: any): string {
    // Simple encryption for demo (use proper encryption in production)
    const cipher = createHash('sha256').update(this.encryptionKey).digest();
    return Buffer.from(JSON.stringify(value)).toString('base64');
  }

  private decryptValue(value: any, isEncrypted: boolean): any {
    if (!isEncrypted) {
      return value;
    }
    try {
      // Simple decryption for demo (use proper decryption in production)
      return JSON.parse(Buffer.from(value, 'base64').toString());
    } catch (error) {
      console.error('Error decrypting value:', error);
      return value;
    }
  }

  private async logSettingChange(
    settingId: string,
    oldValue: any,
    newValue: any,
    userId: string,
    reason?: string
  ): Promise<void> {
    try {
      const history: SettingHistory = {
        id: uuidv4(),
        setting_id: settingId,
        old_value: oldValue,
        new_value: newValue,
        changed_by: userId,
        change_reason: reason,
        created_at: new Date()
      };

      await this.db.query(
        `INSERT INTO setting_histories (id, setting_id, old_value, new_value, changed_by, change_reason, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          history.id, history.setting_id, JSON.stringify(history.old_value),
          JSON.stringify(history.new_value), history.changed_by, history.change_reason,
          history.created_at
        ]
      );
    } catch (error) {
      console.error('Error logging setting change:', error);
    }
  }

  async getSettingsByCategory(
    category: SettingCategory,
    scope: SettingScope = SettingScope.GLOBAL,
    scopeId?: string
  ): Promise<Record<string, any>> {
    try {
      const settings: Record<string, any> = {};
      
      for (const [key, definition] of this.settingDefinitions) {
        if (definition.category === category && definition.scope === scope) {
          const value = await this.getSetting(key, scope, scopeId);
          if (value !== null) {
            settings[key] = value;
          }
        }
      }

      return settings;
    } catch (error) {
      console.error('Error getting settings by category:', error);
      return {};
    }
  }

  async getSettingsByScope(
    scope: SettingScope,
    scopeId?: string
  ): Promise<Record<string, any>> {
    try {
      const settings: Record<string, any> = {};
      
      for (const [key, definition] of this.settingDefinitions) {
        if (definition.scope === scope) {
          const value = await this.getSetting(key, scope, scopeId);
          if (value !== null) {
            settings[key] = value;
          }
        }
      }

      return settings;
    } catch (error) {
      console.error('Error getting settings by scope:', error);
      return {};
    }
  }

  async deleteSetting(
    key: string,
    scope: SettingScope = SettingScope.GLOBAL,
    scopeId?: string
  ): Promise<boolean> {
    try {
      const cacheKey = this.getCacheKey(key, scope, scopeId);
      
      // Check if setting exists
      const setting = this.settingsCache.get(cacheKey);
      if (!setting) {
        return false;
      }

      // Delete from database
      let query = 'DELETE FROM settings WHERE key = ? AND scope = ?';
      const params: any[] = [key, scope];

      if (scopeId) {
        query += ' AND scope_id = ?';
        params.push(scopeId);
      } else {
        query += ' AND scope_id IS NULL';
      }

      const result = await this.db.query(query, params);
      if (result.affectedRows === 0) {
        return false;
      }

      // Remove from cache
      this.settingsCache.delete(cacheKey);

      // Remove from Redis
      if (this.redis) {
        await this.redis.del(`setting:${cacheKey}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting setting:', error);
      return false;
    }
  }

  async getSettingHistory(
    settingId: string,
    limit: number = 100
  ): Promise<SettingHistory[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM setting_histories WHERE setting_id = ? ORDER BY created_at DESC LIMIT ?',
        [settingId, limit]
      );
      return result.map((row: any) => this.mapRowToSettingHistory(row));
    } catch (error) {
      console.error('Error getting setting history:', error);
      return [];
    }
  }

  async exportSettings(
    scope: SettingScope,
    scopeId?: string,
    includeSensitive: boolean = false
  ): Promise<Record<string, any>> {
    try {
      const settings: Record<string, any> = {};
      
      for (const [key, definition] of this.settingDefinitions) {
        if (definition.scope === scope && (!definition.is_sensitive || includeSensitive)) {
          const value = await this.getSetting(key, scope, scopeId);
          if (value !== null) {
            settings[key] = {
              value,
              type: definition.type,
              category: definition.category,
              description: definition.description
            };
          }
        }
      }

      return settings;
    } catch (error) {
      console.error('Error exporting settings:', error);
      return {};
    }
  }

  async importSettings(
    settings: Record<string, any>,
    scope: SettingScope,
    scopeId?: string,
    userId: string = 'system'
  ): Promise<{ success: number; errors: string[] }> {
    const results = { success: 0, errors: [] as string[] };

    for (const [key, settingData] of Object.entries(settings)) {
      try {
        const value = settingData.value || settingData;
        await this.setSetting(key, value, scope, scopeId, userId);
        results.success++;
      } catch (error) {
        results.errors.push(`${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }

  async getSettingStatistics(): Promise<Record<string, any>> {
    try {
      const totalSettings = (await this.db.query('SELECT COUNT(*) as count FROM settings'))[0].count;
      const encryptedSettings = (await this.db.query('SELECT COUNT(*) as count FROM settings WHERE is_encrypted = ?', [true]))[0].count;
      const sensitiveSettings = (await this.db.query('SELECT COUNT(*) as count FROM settings WHERE is_sensitive = ?', [true]))[0].count;
      const readonlySettings = (await this.db.query('SELECT COUNT(*) as count FROM settings WHERE is_readonly = ?', [true]))[0].count;

      // Count by scope
      const scopeCounts: Record<string, number> = {};
      for (const scope of Object.values(SettingScope)) {
        const count = (await this.db.query('SELECT COUNT(*) as count FROM settings WHERE scope = ?', [scope]))[0].count;
        scopeCounts[scope] = count;
      }

      // Count by category
      const categoryCounts: Record<string, number> = {};
      for (const category of Object.values(SettingCategory)) {
        const count = (await this.db.query('SELECT COUNT(*) as count FROM settings WHERE category = ?', [category]))[0].count;
        categoryCounts[category] = count;
      }

      return {
        total_settings: totalSettings,
        encrypted_settings: encryptedSettings,
        sensitive_settings: sensitiveSettings,
        readonly_settings: readonlySettings,
        by_scope: scopeCounts,
        by_category: categoryCounts
      };
    } catch (error) {
      console.error('Error getting setting statistics:', error);
      return {};
    }
  }

  // Helper methods
  private mapRowToSetting(row: any): Setting {
    return {
      id: row.id,
      key: row.key,
      value: JSON.parse(row.value),
      type: row.type as SettingType,
      scope: row.scope as SettingScope,
      scope_id: row.scope_id,
      category: row.category as SettingCategory,
      is_encrypted: Boolean(row.is_encrypted),
      is_sensitive: Boolean(row.is_sensitive),
      is_readonly: Boolean(row.is_readonly),
      created_by: row.created_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }

  private mapRowToSettingHistory(row: any): SettingHistory {
    return {
      id: row.id,
      setting_id: row.setting_id,
      old_value: JSON.parse(row.old_value || 'null'),
      new_value: JSON.parse(row.new_value || 'null'),
      changed_by: row.changed_by,
      change_reason: row.change_reason,
      created_at: new Date(row.created_at)
    };
  }
}

export default SettingsManager;