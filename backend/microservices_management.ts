/**
 * MICROSERVICES MANAGEMENT SYSTEM
 * Comprehensive backend API for managing microservices, health monitoring, and service administration
 */

import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Enums
export enum ServiceStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  ERROR = 'error',
  UNKNOWN = 'unknown'
}

export enum ServiceType {
  GATEWAY = 'gateway',
  AUTHENTICATION = 'authentication',
  HOSPITALITY = 'hospitality',
  COMMUNICATION = 'communication',
  MONITORING = 'monitoring',
  AUTOMATION = 'automation',
  DOCUMENT = 'document'
}

export enum AlertType {
  HEALTH = 'health',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  SECURITY = 'security',
  CAPACITY = 'capacity'
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Validation Schemas
const ServiceRegistryCreateSchema = z.object({
  service_name: z.string().min(1).max(100),
  service_type: z.nativeEnum(ServiceType),
  version: z.string().min(1).max(20),
  port: z.number().min(1000).max(65535),
  host: z.string().min(1).max(255),
  health_check_url: z.string().max(500).optional()
});

const ServiceRegistryUpdateSchema = z.object({
  service_name: z.string().min(1).max(100).optional(),
  service_type: z.nativeEnum(ServiceType).optional(),
  version: z.string().min(1).max(20).optional(),
  port: z.number().min(1000).max(65535).optional(),
  host: z.string().min(1).max(255).optional(),
  health_check_url: z.string().max(500).optional(),
  status: z.nativeEnum(ServiceStatus).optional()
});

const HealthCheckCreateSchema = z.object({
  service_id: z.string(),
  check_type: z.string().min(1).max(50),
  check_url: z.string().max(500).optional(),
  check_interval_seconds: z.number().min(10).max(3600).default(30),
  timeout_seconds: z.number().min(1).max(300).default(10),
  retry_count: z.number().min(0).max(10).default(3),
  is_active: z.boolean().default(true)
});

const ServiceMetricCreateSchema = z.object({
  service_id: z.string(),
  metric_name: z.string().min(1).max(100),
  metric_value: z.number(),
  metric_unit: z.string().max(20).optional(),
  metric_type: z.enum(['gauge', 'counter', 'histogram', 'summary']).default('gauge'),
  labels: z.record(z.any()).default({})
});

const ServiceLogCreateSchema = z.object({
  service_id: z.string(),
  log_level: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']),
  message: z.string().min(1),
  context: z.record(z.any()).default({}),
  trace_id: z.string().max(100).optional(),
  span_id: z.string().max(100).optional(),
  user_id: z.string().optional(),
  session_id: z.string().max(100).optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional()
});

const ApiRouteCreateSchema = z.object({
  route_name: z.string().min(1).max(100),
  service_id: z.string(),
  path: z.string().min(1).max(500),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']),
  target_url: z.string().min(1).max(500),
  is_active: z.boolean().default(true),
  rate_limit_per_minute: z.number().min(1).max(10000).default(100),
  timeout_seconds: z.number().min(1).max(300).default(30),
  retry_count: z.number().min(0).max(10).default(3),
  circuit_breaker_enabled: z.boolean().default(false),
  circuit_breaker_threshold: z.number().min(1).max(100).default(5),
  authentication_required: z.boolean().default(true),
  cors_enabled: z.boolean().default(true),
  cors_origins: z.array(z.string()).default([]),
  middleware_config: z.record(z.any()).default({})
});

const ServiceAlertCreateSchema = z.object({
  alert_name: z.string().min(1).max(100),
  service_id: z.string().optional(),
  alert_type: z.nativeEnum(AlertType),
  condition_config: z.record(z.any()),
  severity: z.nativeEnum(AlertSeverity).default(AlertSeverity.MEDIUM),
  is_active: z.boolean().default(true),
  notification_channels: z.array(z.string()).default([]),
  escalation_rules: z.record(z.any()).default({})
});

const ServiceConfigCreateSchema = z.object({
  service_id: z.string(),
  config_key: z.string().min(1).max(200),
  config_value: z.string().min(1),
  config_type: z.enum(['string', 'number', 'boolean', 'json', 'secret']).default('string'),
  is_secret: z.boolean().default(false),
  environment: z.string().min(1).max(50).default('production'),
  is_active: z.boolean().default(true)
});

// Interfaces
export interface ServiceRegistry {
  id: string;
  service_name: string;
  service_type: ServiceType;
  version: string;
  port: number;
  host: string;
  health_check_url?: string;
  status: ServiceStatus;
  last_health_check?: Date;
  response_time_ms?: number;
  uptime_percentage: number;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceHealthCheck {
  id: string;
  service_id: string;
  check_type: string;
  check_url?: string;
  check_interval_seconds: number;
  timeout_seconds: number;
  retry_count: number;
  is_active: boolean;
  last_check?: Date;
  last_status?: string;
  last_response_time_ms?: number;
  consecutive_failures: number;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceMetric {
  id: string;
  service_id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  metric_type: string;
  labels: Record<string, any>;
  timestamp: Date;
}

export interface ServiceLog {
  id: string;
  service_id: string;
  log_level: string;
  message: string;
  context: Record<string, any>;
  trace_id?: string;
  span_id?: string;
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
}

export interface ApiGatewayRoute {
  id: string;
  route_name: string;
  service_id: string;
  path: string;
  method: string;
  target_url: string;
  is_active: boolean;
  rate_limit_per_minute: number;
  timeout_seconds: number;
  retry_count: number;
  circuit_breaker_enabled: boolean;
  circuit_breaker_threshold: number;
  authentication_required: boolean;
  cors_enabled: boolean;
  cors_origins: string[];
  middleware_config: Record<string, any>;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceAlert {
  id: string;
  alert_name: string;
  service_id?: string;
  alert_type: AlertType;
  condition_config: Record<string, any>;
  severity: AlertSeverity;
  is_active: boolean;
  notification_channels: string[];
  escalation_rules: Record<string, any>;
  last_triggered?: Date;
  trigger_count: number;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceConfiguration {
  id: string;
  service_id: string;
  config_key: string;
  config_value: string;
  config_type: string;
  is_secret: boolean;
  environment: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceHealthOverview {
  service_name: string;
  service_type: string;
  version: string;
  status: string;
  response_time_ms?: number;
  uptime_percentage: number;
  last_health_check?: Date;
  health_check_count: number;
  healthy_checks: number;
  error_checks: number;
}

export interface ServiceMetricsSummary {
  service_name: string;
  metric_name: string;
  avg_value: number;
  min_value: number;
  max_value: number;
  metric_count: number;
  last_metric_time?: Date;
}

export interface ApiGatewayRoutesSummary {
  service_name: string;
  route_count: number;
  active_routes: number;
  avg_rate_limit: number;
  avg_timeout: number;
}

export interface MicroservicesManagerOptions {
  db: any; // Database session/connection
  redisClient?: any; // Redis client for caching
}

export class MicroservicesManager {
  private db: any;
  private redis?: any;
  private healthCheckInterval?: NodeJS.Timeout;
  private isRunning: boolean = false;

  constructor(options: MicroservicesManagerOptions) {
    this.db = options.db;
    this.redis = options.redisClient;
  }

  // Service Registry Management
  async createService(serviceData: z.infer<typeof ServiceRegistryCreateSchema>, userId: string): Promise<ServiceRegistry> {
    try {
      // Validate input
      const validatedData = ServiceRegistryCreateSchema.parse(serviceData);

      // Check if service name already exists
      const existingService = await this.db.query(
        'SELECT * FROM service_registry WHERE service_name = ?',
        [validatedData.service_name]
      );

      if (existingService.length > 0) {
        throw new Error('Service name already exists');
      }

      const service: ServiceRegistry = {
        id: uuidv4(),
        service_name: validatedData.service_name,
        service_type: validatedData.service_type,
        version: validatedData.version,
        port: validatedData.port,
        host: validatedData.host,
        health_check_url: validatedData.health_check_url,
        status: ServiceStatus.UNKNOWN,
        uptime_percentage: 0,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      };

      await this.db.query(
        `INSERT INTO service_registry (
          id, service_name, service_type, version, port, host, health_check_url,
          status, uptime_percentage, created_by, updated_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          service.id, service.service_name, service.service_type, service.version,
          service.port, service.host, service.health_check_url, service.status,
          service.uptime_percentage, service.created_by, service.updated_by,
          service.created_at, service.updated_at
        ]
      );

      console.log(`Created service: ${service.service_name} by user ${userId}`);
      return service;
    } catch (error) {
      throw new Error(`Failed to create service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getServices(
    skip: number = 0,
    limit: number = 100,
    serviceType?: ServiceType,
    status?: ServiceStatus
  ): Promise<ServiceRegistry[]> {
    try {
      let query = 'SELECT * FROM service_registry WHERE 1=1';
      const params: any[] = [];

      if (serviceType) {
        query += ' AND service_type = ?';
        params.push(serviceType);
      }
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, skip);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToServiceRegistry(row));
    } catch (error) {
      console.error('Error getting services:', error);
      return [];
    }
  }

  async getService(serviceId: string): Promise<ServiceRegistry | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM service_registry WHERE id = ?',
        [serviceId]
      );

      if (result.length === 0) {
        return null;
      }

      return this.mapRowToServiceRegistry(result[0]);
    } catch (error) {
      console.error('Error getting service:', error);
      return null;
    }
  }

  async updateService(
    serviceId: string,
    serviceData: z.infer<typeof ServiceRegistryUpdateSchema>,
    userId: string
  ): Promise<ServiceRegistry> {
    try {
      const validatedData = ServiceRegistryUpdateSchema.parse(serviceData);

      const service = await this.getService(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      // Update fields if provided
      const updateFields: string[] = [];
      const params: any[] = [];

      for (const [key, value] of Object.entries(validatedData)) {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`);
          params.push(value);
        }
      }

      if (updateFields.length === 0) {
        return service;
      }

      updateFields.push('updated_by = ?', 'updated_at = ?');
      params.push(userId, new Date(), serviceId);

      await this.db.query(
        `UPDATE service_registry SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      console.log(`Updated service: ${service.service_name} by user ${userId}`);
      return await this.getService(serviceId)!;
    } catch (error) {
      throw new Error(`Failed to update service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteService(serviceId: string, userId: string): Promise<boolean> {
    try {
      const service = await this.getService(serviceId);
      if (!service) {
        return false;
      }

      const serviceName = service.service_name;
      await this.db.query('DELETE FROM service_registry WHERE id = ?', [serviceId]);

      console.log(`Deleted service: ${serviceName} by user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  }

  // Health Check Management
  async createHealthCheck(
    serviceId: string,
    healthCheckData: z.infer<typeof HealthCheckCreateSchema>
  ): Promise<ServiceHealthCheck> {
    try {
      const validatedData = HealthCheckCreateSchema.parse(healthCheckData);

      // Verify service exists
      const service = await this.getService(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      const healthCheck: ServiceHealthCheck = {
        id: uuidv4(),
        service_id: serviceId,
        check_type: validatedData.check_type,
        check_url: validatedData.check_url,
        check_interval_seconds: validatedData.check_interval_seconds,
        timeout_seconds: validatedData.timeout_seconds,
        retry_count: validatedData.retry_count,
        is_active: validatedData.is_active,
        consecutive_failures: 0,
        created_at: new Date(),
        updated_at: new Date()
      };

      await this.db.query(
        `INSERT INTO service_health_checks (
          id, service_id, check_type, check_url, check_interval_seconds,
          timeout_seconds, retry_count, is_active, consecutive_failures,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          healthCheck.id, healthCheck.service_id, healthCheck.check_type,
          healthCheck.check_url, healthCheck.check_interval_seconds,
          healthCheck.timeout_seconds, healthCheck.retry_count,
          healthCheck.is_active, healthCheck.consecutive_failures,
          healthCheck.created_at, healthCheck.updated_at
        ]
      );

      console.log(`Created health check for service ${service.service_name}`);
      return healthCheck;
    } catch (error) {
      throw new Error(`Failed to create health check: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getServiceHealthChecks(serviceId: string): Promise<ServiceHealthCheck[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM service_health_checks WHERE service_id = ?',
        [serviceId]
      );
      return result.map((row: any) => this.mapRowToServiceHealthCheck(row));
    } catch (error) {
      console.error('Error getting service health checks:', error);
      return [];
    }
  }

  async runHealthCheck(serviceId: string): Promise<void> {
    try {
      const service = await this.getService(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      // Run health check in background
      setImmediate(() => this.performHealthCheck(serviceId));
    } catch (error) {
      console.error('Error running health check:', error);
    }
  }

  private async performHealthCheck(serviceId: string): Promise<void> {
    try {
      const service = await this.getService(serviceId);
      if (!service) {
        console.error(`Service ${serviceId} not found for health check`);
        return;
      }

      const healthChecks = await this.getServiceHealthChecks(serviceId);
      const activeHealthChecks = healthChecks.filter(check => check.is_active);

      if (activeHealthChecks.length === 0) {
        console.warn(`No active health checks found for service ${service.service_name}`);
        return;
      }

      // Perform health checks
      for (const healthCheck of activeHealthChecks) {
        try {
          const startTime = new Date();
          const response = await fetch(healthCheck.check_url || service.health_check_url || `http://${service.host}:${service.port}/health`);
          const endTime = new Date();

          const responseTime = endTime.getTime() - startTime.getTime();
          const status = response.status === 200 ? 'healthy' : 'warning';

          // Update health check
          await this.db.query(
            'UPDATE service_health_checks SET last_check = ?, last_status = ?, last_response_time_ms = ?, consecutive_failures = 0 WHERE id = ?',
            [endTime, status, responseTime, healthCheck.id]
          );

          // Update service status
          await this.db.query(
            'UPDATE service_registry SET status = ?, last_health_check = ?, response_time_ms = ? WHERE id = ?',
            [status, endTime, responseTime, serviceId]
          );

        } catch (error) {
          console.error(`Health check failed for service ${service.service_name}:`, error);

          // Update health check
          await this.db.query(
            'UPDATE service_health_checks SET last_check = ?, last_status = ?, consecutive_failures = consecutive_failures + 1 WHERE id = ?',
            [new Date(), 'error', healthCheck.id]
          );

          // Update service status
          await this.db.query(
            'UPDATE service_registry SET status = ?, last_health_check = ? WHERE id = ?',
            ['error', new Date(), serviceId]
          );
        }
      }

      console.log(`Health check completed for service ${service.service_name}`);
    } catch (error) {
      console.error(`Error performing health check for service ${serviceId}:`, error);
    }
  }

  // Metrics Management
  async createServiceMetric(metricData: z.infer<typeof ServiceMetricCreateSchema>): Promise<ServiceMetric> {
    try {
      const validatedData = ServiceMetricCreateSchema.parse(metricData);

      // Verify service exists
      const service = await this.getService(validatedData.service_id);
      if (!service) {
        throw new Error('Service not found');
      }

      const metric: ServiceMetric = {
        id: uuidv4(),
        service_id: validatedData.service_id,
        metric_name: validatedData.metric_name,
        metric_value: validatedData.metric_value,
        metric_unit: validatedData.metric_unit,
        metric_type: validatedData.metric_type,
        labels: validatedData.labels,
        timestamp: new Date()
      };

      await this.db.query(
        `INSERT INTO service_metrics (
          id, service_id, metric_name, metric_value, metric_unit,
          metric_type, labels, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          metric.id, metric.service_id, metric.metric_name, metric.metric_value,
          metric.metric_unit, metric.metric_type, JSON.stringify(metric.labels),
          metric.timestamp
        ]
      );

      return metric;
    } catch (error) {
      throw new Error(`Failed to create service metric: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getServiceMetrics(
    serviceId: string,
    skip: number = 0,
    limit: number = 100,
    metricName?: string,
    startTime?: Date,
    endTime?: Date
  ): Promise<ServiceMetric[]> {
    try {
      let query = 'SELECT * FROM service_metrics WHERE service_id = ?';
      const params: any[] = [serviceId];

      if (metricName) {
        query += ' AND metric_name = ?';
        params.push(metricName);
      }
      if (startTime) {
        query += ' AND timestamp >= ?';
        params.push(startTime);
      }
      if (endTime) {
        query += ' AND timestamp <= ?';
        params.push(endTime);
      }

      query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
      params.push(limit, skip);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToServiceMetric(row));
    } catch (error) {
      console.error('Error getting service metrics:', error);
      return [];
    }
  }

  // Logs Management
  async createServiceLog(logData: z.infer<typeof ServiceLogCreateSchema>): Promise<ServiceLog> {
    try {
      const validatedData = ServiceLogCreateSchema.parse(logData);

      // Verify service exists
      const service = await this.getService(validatedData.service_id);
      if (!service) {
        throw new Error('Service not found');
      }

      const log: ServiceLog = {
        id: uuidv4(),
        service_id: validatedData.service_id,
        log_level: validatedData.log_level,
        message: validatedData.message,
        context: validatedData.context,
        trace_id: validatedData.trace_id,
        span_id: validatedData.span_id,
        user_id: validatedData.user_id,
        session_id: validatedData.session_id,
        ip_address: validatedData.ip_address,
        user_agent: validatedData.user_agent,
        timestamp: new Date()
      };

      await this.db.query(
        `INSERT INTO service_logs (
          id, service_id, log_level, message, context, trace_id, span_id,
          user_id, session_id, ip_address, user_agent, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          log.id, log.service_id, log.log_level, log.message,
          JSON.stringify(log.context), log.trace_id, log.span_id,
          log.user_id, log.session_id, log.ip_address, log.user_agent,
          log.timestamp
        ]
      );

      return log;
    } catch (error) {
      throw new Error(`Failed to create service log: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getServiceLogs(
    serviceId: string,
    skip: number = 0,
    limit: number = 100,
    logLevel?: string,
    startTime?: Date,
    endTime?: Date,
    search?: string
  ): Promise<ServiceLog[]> {
    try {
      let query = 'SELECT * FROM service_logs WHERE service_id = ?';
      const params: any[] = [serviceId];

      if (logLevel) {
        query += ' AND log_level = ?';
        params.push(logLevel);
      }
      if (startTime) {
        query += ' AND timestamp >= ?';
        params.push(startTime);
      }
      if (endTime) {
        query += ' AND timestamp <= ?';
        params.push(endTime);
      }
      if (search) {
        query += ' AND message LIKE ?';
        params.push(`%${search}%`);
      }

      query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
      params.push(limit, skip);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToServiceLog(row));
    } catch (error) {
      console.error('Error getting service logs:', error);
      return [];
    }
  }

  // API Gateway Routes Management
  async createApiRoute(
    routeData: z.infer<typeof ApiRouteCreateSchema>,
    userId: string
  ): Promise<ApiGatewayRoute> {
    try {
      const validatedData = ApiRouteCreateSchema.parse(routeData);

      // Check if route name already exists
      const existingRoute = await this.db.query(
        'SELECT * FROM api_gateway_routes WHERE route_name = ?',
        [validatedData.route_name]
      );

      if (existingRoute.length > 0) {
        throw new Error('Route name already exists');
      }

      // Verify service exists
      const service = await this.getService(validatedData.service_id);
      if (!service) {
        throw new Error('Service not found');
      }

      const route: ApiGatewayRoute = {
        id: uuidv4(),
        route_name: validatedData.route_name,
        service_id: validatedData.service_id,
        path: validatedData.path,
        method: validatedData.method,
        target_url: validatedData.target_url,
        is_active: validatedData.is_active,
        rate_limit_per_minute: validatedData.rate_limit_per_minute,
        timeout_seconds: validatedData.timeout_seconds,
        retry_count: validatedData.retry_count,
        circuit_breaker_enabled: validatedData.circuit_breaker_enabled,
        circuit_breaker_threshold: validatedData.circuit_breaker_threshold,
        authentication_required: validatedData.authentication_required,
        cors_enabled: validatedData.cors_enabled,
        cors_origins: validatedData.cors_origins,
        middleware_config: validatedData.middleware_config,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      };

      await this.db.query(
        `INSERT INTO api_gateway_routes (
          id, route_name, service_id, path, method, target_url, is_active,
          rate_limit_per_minute, timeout_seconds, retry_count, circuit_breaker_enabled,
          circuit_breaker_threshold, authentication_required, cors_enabled,
          cors_origins, middleware_config, created_by, updated_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          route.id, route.route_name, route.service_id, route.path, route.method,
          route.target_url, route.is_active, route.rate_limit_per_minute,
          route.timeout_seconds, route.retry_count, route.circuit_breaker_enabled,
          route.circuit_breaker_threshold, route.authentication_required,
          route.cors_enabled, JSON.stringify(route.cors_origins),
          JSON.stringify(route.middleware_config), route.created_by,
          route.updated_by, route.created_at, route.updated_at
        ]
      );

      console.log(`Created API route: ${route.route_name}`);
      return route;
    } catch (error) {
      throw new Error(`Failed to create API route: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getApiRoutes(
    skip: number = 0,
    limit: number = 100,
    serviceId?: string,
    isActive?: boolean
  ): Promise<ApiGatewayRoute[]> {
    try {
      let query = 'SELECT * FROM api_gateway_routes WHERE 1=1';
      const params: any[] = [];

      if (serviceId) {
        query += ' AND service_id = ?';
        params.push(serviceId);
      }
      if (isActive !== undefined) {
        query += ' AND is_active = ?';
        params.push(isActive);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, skip);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToApiGatewayRoute(row));
    } catch (error) {
      console.error('Error getting API routes:', error);
      return [];
    }
  }

  // Service Alerts Management
  async createServiceAlert(
    alertData: z.infer<typeof ServiceAlertCreateSchema>,
    userId: string
  ): Promise<ServiceAlert> {
    try {
      const validatedData = ServiceAlertCreateSchema.parse(alertData);

      // Verify service exists if provided
      if (validatedData.service_id) {
        const service = await this.getService(validatedData.service_id);
        if (!service) {
          throw new Error('Service not found');
        }
      }

      const alert: ServiceAlert = {
        id: uuidv4(),
        alert_name: validatedData.alert_name,
        service_id: validatedData.service_id,
        alert_type: validatedData.alert_type,
        condition_config: validatedData.condition_config,
        severity: validatedData.severity,
        is_active: validatedData.is_active,
        notification_channels: validatedData.notification_channels,
        escalation_rules: validatedData.escalation_rules,
        trigger_count: 0,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      };

      await this.db.query(
        `INSERT INTO service_alerts (
          id, alert_name, service_id, alert_type, condition_config, severity,
          is_active, notification_channels, escalation_rules, trigger_count,
          created_by, updated_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          alert.id, alert.alert_name, alert.service_id, alert.alert_type,
          JSON.stringify(alert.condition_config), alert.severity, alert.is_active,
          JSON.stringify(alert.notification_channels), JSON.stringify(alert.escalation_rules),
          alert.trigger_count, alert.created_by, alert.updated_by,
          alert.created_at, alert.updated_at
        ]
      );

      console.log(`Created alert: ${alert.alert_name}`);
      return alert;
    } catch (error) {
      throw new Error(`Failed to create service alert: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getServiceAlerts(
    skip: number = 0,
    limit: number = 100,
    serviceId?: string,
    alertType?: AlertType,
    severity?: AlertSeverity,
    isActive?: boolean
  ): Promise<ServiceAlert[]> {
    try {
      let query = 'SELECT * FROM service_alerts WHERE 1=1';
      const params: any[] = [];

      if (serviceId) {
        query += ' AND service_id = ?';
        params.push(serviceId);
      }
      if (alertType) {
        query += ' AND alert_type = ?';
        params.push(alertType);
      }
      if (severity) {
        query += ' AND severity = ?';
        params.push(severity);
      }
      if (isActive !== undefined) {
        query += ' AND is_active = ?';
        params.push(isActive);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, skip);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToServiceAlert(row));
    } catch (error) {
      console.error('Error getting service alerts:', error);
      return [];
    }
  }

  // Service Configuration Management
  async createServiceConfiguration(
    serviceId: string,
    configData: z.infer<typeof ServiceConfigCreateSchema>,
    userId: string
  ): Promise<ServiceConfiguration> {
    try {
      const validatedData = ServiceConfigCreateSchema.parse(configData);

      // Verify service exists
      const service = await this.getService(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      // Check if configuration already exists
      const existingConfig = await this.db.query(
        'SELECT * FROM service_configurations WHERE service_id = ? AND config_key = ? AND environment = ?',
        [serviceId, validatedData.config_key, validatedData.environment]
      );

      if (existingConfig.length > 0) {
        throw new Error('Configuration already exists for this service and environment');
      }

      const configuration: ServiceConfiguration = {
        id: uuidv4(),
        service_id: serviceId,
        config_key: validatedData.config_key,
        config_value: validatedData.config_value,
        config_type: validatedData.config_type,
        is_secret: validatedData.is_secret,
        environment: validatedData.environment,
        is_active: validatedData.is_active,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      };

      await this.db.query(
        `INSERT INTO service_configurations (
          id, service_id, config_key, config_value, config_type, is_secret,
          environment, is_active, created_by, updated_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          configuration.id, configuration.service_id, configuration.config_key,
          configuration.config_value, configuration.config_type, configuration.is_secret,
          configuration.environment, configuration.is_active, configuration.created_by,
          configuration.updated_by, configuration.created_at, configuration.updated_at
        ]
      );

      console.log(`Created configuration for service ${service.service_name}`);
      return configuration;
    } catch (error) {
      throw new Error(`Failed to create service configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getServiceConfigurations(
    serviceId: string,
    environment?: string,
    isActive?: boolean
  ): Promise<ServiceConfiguration[]> {
    try {
      let query = 'SELECT * FROM service_configurations WHERE service_id = ?';
      const params: any[] = [serviceId];

      if (environment) {
        query += ' AND environment = ?';
        params.push(environment);
      }
      if (isActive !== undefined) {
        query += ' AND is_active = ?';
        params.push(isActive);
      }

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToServiceConfiguration(row));
    } catch (error) {
      console.error('Error getting service configurations:', error);
      return [];
    }
  }

  // Overview and Summary Methods
  async getServiceHealthOverview(): Promise<ServiceHealthOverview[]> {
    try {
      const result = await this.db.query('SELECT * FROM service_health_overview');
      return result.map((row: any) => ({
        service_name: row[0],
        service_type: row[1],
        version: row[2],
        status: row[3],
        response_time_ms: row[4],
        uptime_percentage: row[5],
        last_health_check: row[6],
        health_check_count: row[7],
        healthy_checks: row[8],
        error_checks: row[9]
      }));
    } catch (error) {
      console.error('Error getting service health overview:', error);
      return [];
    }
  }

  async getServiceMetricsSummary(): Promise<ServiceMetricsSummary[]> {
    try {
      const result = await this.db.query('SELECT * FROM service_metrics_summary');
      return result.map((row: any) => ({
        service_name: row[0],
        metric_name: row[1],
        avg_value: row[2],
        min_value: row[3],
        max_value: row[4],
        metric_count: row[5],
        last_metric_time: row[6]
      }));
    } catch (error) {
      console.error('Error getting service metrics summary:', error);
      return [];
    }
  }

  async getApiGatewayRoutesSummary(): Promise<ApiGatewayRoutesSummary[]> {
    try {
      const result = await this.db.query('SELECT * FROM api_gateway_routes_summary');
      return result.map((row: any) => ({
        service_name: row[0],
        route_count: row[1],
        active_routes: row[2],
        avg_rate_limit: row[3],
        avg_timeout: row[4]
      }));
    } catch (error) {
      console.error('Error getting API Gateway routes summary:', error);
      return [];
    }
  }

  // Cleanup Methods
  async cleanupOldLogs(days: number = 30): Promise<{ deletedLogs: number; deletedMetrics: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Delete old logs
      const deletedLogs = await this.db.query(
        'DELETE FROM service_logs WHERE timestamp < ?',
        [cutoffDate]
      );

      // Delete old metrics (keep only last 90 days)
      const cutoffMetrics = new Date();
      cutoffMetrics.setDate(cutoffMetrics.getDate() - 90);
      const deletedMetrics = await this.db.query(
        'DELETE FROM service_metrics WHERE timestamp < ?',
        [cutoffMetrics]
      );

      console.log(`Cleanup completed: ${deletedLogs.affectedRows} logs and ${deletedMetrics.affectedRows} metrics deleted`);
      return {
        deletedLogs: deletedLogs.affectedRows,
        deletedMetrics: deletedMetrics.affectedRows
      };
    } catch (error) {
      console.error('Error during cleanup:', error);
      return { deletedLogs: 0, deletedMetrics: 0 };
    }
  }

  // Health Check Methods
  async checkServiceHealth(serviceName: string): Promise<any> {
    try {
      const result = await this.db.query(
        'SELECT * FROM check_service_health(?)',
        [serviceName]
      );

      if (result.length === 0) {
        throw new Error('Service not found');
      }

      const healthData = result[0];
      return {
        service_name: healthData[0],
        status: healthData[1],
        response_time_ms: healthData[2],
        last_check: healthData[3],
        uptime_percentage: healthData[4]
      };
    } catch (error) {
      console.error('Error checking service health:', error);
      throw error;
    }
  }

  // Helper Methods
  private mapRowToServiceRegistry(row: any): ServiceRegistry {
    return {
      id: row.id,
      service_name: row.service_name,
      service_type: row.service_type as ServiceType,
      version: row.version,
      port: row.port,
      host: row.host,
      health_check_url: row.health_check_url,
      status: row.status as ServiceStatus,
      last_health_check: row.last_health_check ? new Date(row.last_health_check) : undefined,
      response_time_ms: row.response_time_ms,
      uptime_percentage: row.uptime_percentage,
      created_by: row.created_by,
      updated_by: row.updated_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }

  private mapRowToServiceHealthCheck(row: any): ServiceHealthCheck {
    return {
      id: row.id,
      service_id: row.service_id,
      check_type: row.check_type,
      check_url: row.check_url,
      check_interval_seconds: row.check_interval_seconds,
      timeout_seconds: row.timeout_seconds,
      retry_count: row.retry_count,
      is_active: Boolean(row.is_active),
      last_check: row.last_check ? new Date(row.last_check) : undefined,
      last_status: row.last_status,
      last_response_time_ms: row.last_response_time_ms,
      consecutive_failures: row.consecutive_failures,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }

  private mapRowToServiceMetric(row: any): ServiceMetric {
    return {
      id: row.id,
      service_id: row.service_id,
      metric_name: row.metric_name,
      metric_value: row.metric_value,
      metric_unit: row.metric_unit,
      metric_type: row.metric_type,
      labels: JSON.parse(row.labels || '{}'),
      timestamp: new Date(row.timestamp)
    };
  }

  private mapRowToServiceLog(row: any): ServiceLog {
    return {
      id: row.id,
      service_id: row.service_id,
      log_level: row.log_level,
      message: row.message,
      context: JSON.parse(row.context || '{}'),
      trace_id: row.trace_id,
      span_id: row.span_id,
      user_id: row.user_id,
      session_id: row.session_id,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      timestamp: new Date(row.timestamp)
    };
  }

  private mapRowToApiGatewayRoute(row: any): ApiGatewayRoute {
    return {
      id: row.id,
      route_name: row.route_name,
      service_id: row.service_id,
      path: row.path,
      method: row.method,
      target_url: row.target_url,
      is_active: Boolean(row.is_active),
      rate_limit_per_minute: row.rate_limit_per_minute,
      timeout_seconds: row.timeout_seconds,
      retry_count: row.retry_count,
      circuit_breaker_enabled: Boolean(row.circuit_breaker_enabled),
      circuit_breaker_threshold: row.circuit_breaker_threshold,
      authentication_required: Boolean(row.authentication_required),
      cors_enabled: Boolean(row.cors_enabled),
      cors_origins: JSON.parse(row.cors_origins || '[]'),
      middleware_config: JSON.parse(row.middleware_config || '{}'),
      created_by: row.created_by,
      updated_by: row.updated_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }

  private mapRowToServiceAlert(row: any): ServiceAlert {
    return {
      id: row.id,
      alert_name: row.alert_name,
      service_id: row.service_id,
      alert_type: row.alert_type as AlertType,
      condition_config: JSON.parse(row.condition_config || '{}'),
      severity: row.severity as AlertSeverity,
      is_active: Boolean(row.is_active),
      notification_channels: JSON.parse(row.notification_channels || '[]'),
      escalation_rules: JSON.parse(row.escalation_rules || '{}'),
      last_triggered: row.last_triggered ? new Date(row.last_triggered) : undefined,
      trigger_count: row.trigger_count,
      created_by: row.created_by,
      updated_by: row.updated_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }

  private mapRowToServiceConfiguration(row: any): ServiceConfiguration {
    return {
      id: row.id,
      service_id: row.service_id,
      config_key: row.config_key,
      config_value: row.config_value,
      config_type: row.config_type,
      is_secret: Boolean(row.is_secret),
      environment: row.environment,
      is_active: Boolean(row.is_active),
      created_by: row.created_by,
      updated_by: row.updated_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }
}

export default MicroservicesManager;