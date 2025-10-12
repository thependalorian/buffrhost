/**
 * TEMPLATE MANAGEMENT SYSTEM
 * Advanced template system with rendering, versioning, and usage tracking for Buffr Host
 */

import { v4 as uuidv4 } from 'uuid';

// Enums
export enum TemplateType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH_NOTIFICATION = 'push_notification',
  PDF = 'pdf',
  HTML = 'html',
  TEXT = 'text',
  JSON = 'json',
  XML = 'xml',
  CSV = 'csv',
  EXCEL = 'excel',
  REPORT = 'report',
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  CONTRACT = 'contract',
  CUSTOM = 'custom'
}

export enum TemplateStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export enum TemplateFormat {
  HTML = 'html',
  TEXT = 'text',
  MARKDOWN = 'markdown',
  HANDLEBARS = 'handlebars',
  MUSTACHE = 'mustache',
  EJS = 'ejs',
  PUG = 'pug',
  JINJA2 = 'jinja2',
  TWIG = 'twig',
  LIQUID = 'liquid',
  CUSTOM = 'custom'
}

// Interfaces
export interface TemplateVariable {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default_value?: any;
  validation?: {
    pattern?: string;
    min_length?: number;
    max_length?: number;
    min_value?: number;
    max_value?: number;
    enum_values?: any[];
  };
}

export interface TemplateConfig {
  format: TemplateFormat;
  variables: TemplateVariable[];
  metadata: Record<string, any>;
  styling?: {
    css?: string;
    theme?: string;
    responsive?: boolean;
  };
  validation?: {
    syntax_check: boolean;
    variable_validation: boolean;
    output_validation: boolean;
  };
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  type: TemplateType;
  status: TemplateStatus;
  format: TemplateFormat;
  content: string;
  config: TemplateConfig;
  version: number;
  is_latest: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  tags: string[];
  category?: string;
  language: string;
}

export interface TemplateVersion {
  id: string;
  template_id: string;
  version: number;
  content: string;
  config: TemplateConfig;
  created_by: string;
  created_at: Date;
  change_notes?: string;
}

export interface TemplateUsage {
  id: string;
  template_id: string;
  version: number;
  rendered_at: Date;
  rendered_by: string;
  context: Record<string, any>;
  output_size: number;
  render_time: number; // in milliseconds
  success: boolean;
  error_message?: string;
  metadata: Record<string, any>;
}

export interface TemplateManagerOptions {
  db: any; // Database session/connection
  redisClient?: any; // Redis client for caching
  templateEngine?: any; // Template engine instance
}

export class TemplateManager {
  private db: any;
  private redis?: any;
  private templateEngine: any;
  private templateCache: Map<string, Template> = new Map();
  private renderCache: Map<string, string> = new Map();

  constructor(options: TemplateManagerOptions) {
    this.db = options.db;
    this.redis = options.redisClient;
    this.templateEngine = options.templateEngine || this.createDefaultTemplateEngine();
  }

  private createDefaultTemplateEngine(): any {
    // Simple template engine implementation
    return {
      render: (template: string, context: Record<string, any>): string => {
        let result = template;
        
        // Simple variable substitution
        for (const [key, value] of Object.entries(context)) {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
          result = result.replace(regex, String(value));
        }
        
        return result;
      },
      
      validate: (template: string): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];
        
        // Check for unclosed braces
        const openBraces = (template.match(/\{\{/g) || []).length;
        const closeBraces = (template.match(/\}\}/g) || []).length;
        
        if (openBraces !== closeBraces) {
          errors.push('Unmatched braces in template');
        }
        
        return {
          valid: errors.length === 0,
          errors
        };
      }
    };
  }

  async createTemplate(
    name: string,
    type: TemplateType,
    content: string,
    config: Partial<TemplateConfig> = {},
    createdBy: string = 'system',
    description?: string,
    tags: string[] = [],
    category?: string,
    language: string = 'en'
  ): Promise<Template> {
    try {
      // Validate template syntax
      const validation = this.templateEngine.validate(content);
      if (!validation.valid) {
        throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
      }

      const templateConfig: TemplateConfig = {
        format: TemplateFormat.HANDLEBARS,
        variables: [],
        metadata: {},
        validation: {
          syntax_check: true,
          variable_validation: true,
          output_validation: true
        },
        ...config
      };

      // Extract variables from template
      templateConfig.variables = this.extractVariables(content);

      const template: Template = {
        id: uuidv4(),
        name,
        description,
        type,
        status: TemplateStatus.DRAFT,
        format: templateConfig.format,
        content,
        config: templateConfig,
        version: 1,
        is_latest: true,
        created_by: createdBy,
        created_at: new Date(),
        updated_at: new Date(),
        tags,
        category,
        language
      };

      // Insert into database
      await this.db.query(
        `INSERT INTO templates (
          id, name, description, type, status, format, content, config, version,
          is_latest, created_by, created_at, updated_at, tags, category, language
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          template.id, template.name, template.description, template.type, template.status,
          template.format, template.content, JSON.stringify(template.config), template.version,
          template.is_latest, template.created_by, template.created_at, template.updated_at,
          JSON.stringify(template.tags), template.category, template.language
        ]
      );

      // Create initial version
      await this.createTemplateVersion(template.id, 1, content, templateConfig, createdBy);

      return template;
    } catch (error) {
      throw new Error(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractVariables(content: string): TemplateVariable[] {
    const variables: TemplateVariable[] = [];
    const variableRegex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
    const foundVariables = new Set<string>();
    
    let match;
    while ((match = variableRegex.exec(content)) !== null) {
      const variableName = match[1];
      if (!foundVariables.has(variableName)) {
        foundVariables.add(variableName);
        variables.push({
          name: variableName,
          type: 'string',
          description: `Variable: ${variableName}`,
          required: true
        });
      }
    }
    
    return variables;
  }

  private async createTemplateVersion(
    templateId: string,
    version: number,
    content: string,
    config: TemplateConfig,
    createdBy: string,
    changeNotes?: string
  ): Promise<TemplateVersion> {
    const templateVersion: TemplateVersion = {
      id: uuidv4(),
      template_id: templateId,
      version,
      content,
      config,
      created_by: createdBy,
      created_at: new Date(),
      change_notes: changeNotes
    };

    await this.db.query(
      `INSERT INTO template_versions (
        id, template_id, version, content, config, created_by, created_at, change_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        templateVersion.id, templateVersion.template_id, templateVersion.version,
        templateVersion.content, JSON.stringify(templateVersion.config),
        templateVersion.created_by, templateVersion.created_at, templateVersion.change_notes
      ]
    );

    return templateVersion;
  }

  async updateTemplate(
    templateId: string,
    updates: Partial<{
      name: string;
      description: string;
      content: string;
      config: TemplateConfig;
      status: TemplateStatus;
      tags: string[];
      category: string;
      language: string;
    }>,
    updatedBy: string = 'system',
    changeNotes?: string
  ): Promise<Template> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Validate content if provided
      if (updates.content) {
        const validation = this.templateEngine.validate(updates.content);
        if (!validation.valid) {
          throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
        }
      }

      // Update fields
      const updateFields: string[] = [];
      const params: any[] = [];

      for (const [key, value] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'created_at' && key !== 'created_by' && template.hasOwnProperty(key)) {
          updateFields.push(`${key} = ?`);
          if (key === 'config') {
            params.push(JSON.stringify(value));
          } else if (key === 'tags') {
            params.push(JSON.stringify(value));
          } else {
            params.push(value);
          }
        }
      }

      if (updateFields.length === 0) {
        return template;
      }

      // Increment version if content or config changed
      let newVersion = template.version;
      if (updates.content || updates.config) {
        newVersion = template.version + 1;
        updateFields.push('version = ?');
        params.push(newVersion);
      }

      updateFields.push('updated_at = ?');
      params.push(new Date());
      params.push(templateId);

      await this.db.query(
        `UPDATE templates SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      // Create new version if content or config changed
      if (updates.content || updates.config) {
        const newConfig = updates.config || template.config;
        const newContent = updates.content || template.content;
        await this.createTemplateVersion(templateId, newVersion, newContent, newConfig, updatedBy, changeNotes);
      }

      // Clear cache
      this.templateCache.delete(templateId);

      return await this.getTemplate(templateId)!;
    } catch (error) {
      throw new Error(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTemplate(templateId: string): Promise<Template | null> {
    try {
      // Check cache first
      if (this.templateCache.has(templateId)) {
        return this.templateCache.get(templateId)!;
      }

      // Check Redis cache
      if (this.redis) {
        const cachedTemplate = await this.redis.get(`template:${templateId}`);
        if (cachedTemplate) {
          const template = JSON.parse(cachedTemplate);
          this.templateCache.set(templateId, template);
          return template;
        }
      }

      // Query database
      const result = await this.db.query('SELECT * FROM templates WHERE id = ?', [templateId]);
      if (result.length === 0) {
        return null;
      }

      const template = this.mapRowToTemplate(result[0]);
      this.templateCache.set(templateId, template);

      // Store in Redis
      if (this.redis) {
        await this.redis.setex(`template:${templateId}`, 3600, JSON.stringify(template));
      }

      return template;
    } catch (error) {
      console.error('Error getting template:', error);
      return null;
    }
  }

  async getTemplates(
    type?: TemplateType,
    status?: TemplateStatus,
    category?: string,
    tags?: string[],
    limit: number = 100
  ): Promise<Template[]> {
    try {
      let query = 'SELECT * FROM templates WHERE 1=1';
      const params: any[] = [];

      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }
      if (tags && tags.length > 0) {
        query += ' AND JSON_OVERLAPS(tags, ?)';
        params.push(JSON.stringify(tags));
      }

      query += ' ORDER BY updated_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToTemplate(row));
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  async renderTemplate(
    templateId: string,
    context: Record<string, any>,
    version?: number,
    renderedBy: string = 'system'
  ): Promise<{ content: string; usage: TemplateUsage }> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Get specific version if requested
      let templateContent = template.content;
      let templateConfig = template.config;
      let templateVersion = template.version;

      if (version && version !== template.version) {
        const versionData = await this.getTemplateVersion(templateId, version);
        if (versionData) {
          templateContent = versionData.content;
          templateConfig = versionData.config;
          templateVersion = versionData.version;
        }
      }

      // Check cache
      const cacheKey = `${templateId}:${templateVersion}:${JSON.stringify(context)}`;
      if (this.renderCache.has(cacheKey)) {
        const cachedContent = this.renderCache.get(cacheKey)!;
        return {
          content: cachedContent,
          usage: await this.logTemplateUsage(templateId, templateVersion, context, cachedContent, renderedBy)
        };
      }

      // Validate context against template variables
      if (templateConfig.validation?.variable_validation) {
        this.validateContext(context, templateConfig.variables);
      }

      // Render template
      const startTime = Date.now();
      let renderedContent: string;
      let success = true;
      let errorMessage: string | undefined;

      try {
        renderedContent = this.templateEngine.render(templateContent, context);
      } catch (error) {
        success = false;
        errorMessage = error instanceof Error ? error.message : 'Unknown rendering error';
        renderedContent = '';
      }

      const renderTime = Date.now() - startTime;

      // Log usage
      const usage = await this.logTemplateUsage(
        templateId,
        templateVersion,
        context,
        renderedContent,
        renderedBy,
        renderTime,
        success,
        errorMessage
      );

      // Cache successful renders
      if (success) {
        this.renderCache.set(cacheKey, renderedContent);
      }

      return { content: renderedContent, usage };
    } catch (error) {
      throw new Error(`Failed to render template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateContext(context: Record<string, any>, variables: TemplateVariable[]): void {
    for (const variable of variables) {
      if (variable.required && !(variable.name in context)) {
        throw new Error(`Required variable '${variable.name}' not provided`);
      }

      if (variable.name in context) {
        const value = context[variable.name];
        const validation = variable.validation;

        if (validation) {
          if (validation.pattern && !new RegExp(validation.pattern).test(String(value))) {
            throw new Error(`Variable '${variable.name}' does not match required pattern`);
          }

          if (validation.min_length && String(value).length < validation.min_length) {
            throw new Error(`Variable '${variable.name}' is too short`);
          }

          if (validation.max_length && String(value).length > validation.max_length) {
            throw new Error(`Variable '${variable.name}' is too long`);
          }

          if (validation.min_value !== undefined && Number(value) < validation.min_value) {
            throw new Error(`Variable '${variable.name}' is below minimum value`);
          }

          if (validation.max_value !== undefined && Number(value) > validation.max_value) {
            throw new Error(`Variable '${variable.name}' exceeds maximum value`);
          }

          if (validation.enum_values && !validation.enum_values.includes(value)) {
            throw new Error(`Variable '${variable.name}' has invalid value`);
          }
        }
      }
    }
  }

  private async logTemplateUsage(
    templateId: string,
    version: number,
    context: Record<string, any>,
    content: string,
    renderedBy: string,
    renderTime?: number,
    success: boolean = true,
    errorMessage?: string
  ): Promise<TemplateUsage> {
    const usage: TemplateUsage = {
      id: uuidv4(),
      template_id: templateId,
      version,
      rendered_at: new Date(),
      rendered_by: renderedBy,
      context,
      output_size: content.length,
      render_time: renderTime || 0,
      success,
      error_message: errorMessage,
      metadata: {}
    };

    try {
      await this.db.query(
        `INSERT INTO template_usages (
          id, template_id, version, rendered_at, rendered_by, context, output_size,
          render_time, success, error_message, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          usage.id, usage.template_id, usage.version, usage.rendered_at, usage.rendered_by,
          JSON.stringify(usage.context), usage.output_size, usage.render_time, usage.success,
          usage.error_message, JSON.stringify(usage.metadata)
        ]
      );
    } catch (error) {
      console.error('Error logging template usage:', error);
    }

    return usage;
  }

  async getTemplateVersion(templateId: string, version: number): Promise<TemplateVersion | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM template_versions WHERE template_id = ? AND version = ?',
        [templateId, version]
      );
      if (result.length === 0) {
        return null;
      }
      return this.mapRowToTemplateVersion(result[0]);
    } catch (error) {
      console.error('Error getting template version:', error);
      return null;
    }
  }

  async getTemplateVersions(templateId: string, limit: number = 50): Promise<TemplateVersion[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM template_versions WHERE template_id = ? ORDER BY version DESC LIMIT ?',
        [templateId, limit]
      );
      return result.map((row: any) => this.mapRowToTemplateVersion(row));
    } catch (error) {
      console.error('Error getting template versions:', error);
      return [];
    }
  }

  async getTemplateUsage(
    templateId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100
  ): Promise<TemplateUsage[]> {
    try {
      let query = 'SELECT * FROM template_usages WHERE template_id = ?';
      const params: any[] = [templateId];

      if (startDate) {
        query += ' AND rendered_at >= ?';
        params.push(startDate);
      }
      if (endDate) {
        query += ' AND rendered_at <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY rendered_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToTemplateUsage(row));
    } catch (error) {
      console.error('Error getting template usage:', error);
      return [];
    }
  }

  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        return false;
      }

      // Delete template versions
      await this.db.query('DELETE FROM template_versions WHERE template_id = ?', [templateId]);

      // Delete template usage logs
      await this.db.query('DELETE FROM template_usages WHERE template_id = ?', [templateId]);

      // Delete template
      await this.db.query('DELETE FROM templates WHERE id = ?', [templateId]);

      // Clear cache
      this.templateCache.delete(templateId);

      // Clear Redis cache
      if (this.redis) {
        await this.redis.del(`template:${templateId}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }

  async getTemplateStatistics(templateId?: string): Promise<Record<string, any>> {
    try {
      let query = 'SELECT * FROM templates';
      const params: any[] = [];

      if (templateId) {
        query += ' WHERE id = ?';
        params.push(templateId);
      }

      const result = await this.db.query(query, params);
      const totalTemplates = result.length;

      // Count by type
      const typeCounts: Record<string, number> = {};
      for (const type of Object.values(TemplateType)) {
        typeCounts[type] = result.filter((row: any) => row.type === type).length;
      }

      // Count by status
      const statusCounts: Record<string, number> = {};
      for (const status of Object.values(TemplateStatus)) {
        statusCounts[status] = result.filter((row: any) => row.status === status).length;
      }

      // Get usage statistics
      let usageQuery = 'SELECT COUNT(*) as total_usage, AVG(render_time) as avg_render_time FROM template_usages';
      const usageParams: any[] = [];

      if (templateId) {
        usageQuery += ' WHERE template_id = ?';
        usageParams.push(templateId);
      }

      const usageResult = await this.db.query(usageQuery, usageParams);
      const usageStats = usageResult[0];

      return {
        total_templates: totalTemplates,
        by_type: typeCounts,
        by_status: statusCounts,
        total_usage: usageStats.total_usage || 0,
        average_render_time: usageStats.avg_render_time || 0
      };
    } catch (error) {
      console.error('Error getting template statistics:', error);
      return {};
    }
  }

  // Helper methods
  private mapRowToTemplate(row: any): Template {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as TemplateType,
      status: row.status as TemplateStatus,
      format: row.format as TemplateFormat,
      content: row.content,
      config: JSON.parse(row.config || '{}'),
      version: row.version,
      is_latest: Boolean(row.is_latest),
      created_by: row.created_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: JSON.parse(row.tags || '[]'),
      category: row.category,
      language: row.language
    };
  }

  private mapRowToTemplateVersion(row: any): TemplateVersion {
    return {
      id: row.id,
      template_id: row.template_id,
      version: row.version,
      content: row.content,
      config: JSON.parse(row.config || '{}'),
      created_by: row.created_by,
      created_at: new Date(row.created_at),
      change_notes: row.change_notes
    };
  }

  private mapRowToTemplateUsage(row: any): TemplateUsage {
    return {
      id: row.id,
      template_id: row.template_id,
      version: row.version,
      rendered_at: new Date(row.rendered_at),
      rendered_by: row.rendered_by,
      context: JSON.parse(row.context || '{}'),
      output_size: row.output_size,
      render_time: row.render_time,
      success: Boolean(row.success),
      error_message: row.error_message,
      metadata: JSON.parse(row.metadata || '{}')
    };
  }
}

export default TemplateManager;