/**
 * SCHEDULE MANAGEMENT SYSTEM
 * Advanced scheduling system for Buffr Host operations
 */

import { v4 as uuidv4 } from 'uuid';
import * as cron from 'cron-parser';

// Enums
export enum ScheduleType {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CRON = 'cron',
  CUSTOM = 'custom'
}

export enum ScheduleStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum RecurrencePattern {
  EVERY_DAY = 'every_day',
  WEEKDAYS = 'weekdays',
  WEEKENDS = 'weekends',
  CUSTOM_DAYS = 'custom_days',
  EVERY_N_DAYS = 'every_n_days',
  EVERY_WEEK = 'every_week',
  EVERY_MONTH = 'every_month',
  EVERY_YEAR = 'every_year'
}

// Interfaces
export interface ScheduleConfig {
  timezone: string;
  start_date?: Date;
  end_date?: Date;
  max_occurrences?: number;
  recurrence_pattern: RecurrencePattern;
  custom_days: number[]; // 0=Monday, 6=Sunday
  interval: number; // Every N days/weeks/months
  cron_expression?: string;
  metadata: Record<string, any>;
}

export interface Schedule {
  id: string;
  name: string;
  description?: string;
  type: ScheduleType;
  status: ScheduleStatus;
  config: ScheduleConfig;
  action_type: string; // What to execute
  action_config: Record<string, any>; // Action configuration
  next_run?: Date;
  last_run?: Date;
  run_count: number;
  max_runs?: number;
  is_active: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface ScheduleExecution {
  id: string;
  schedule_id: string;
  scheduled_at: Date;
  started_at?: Date;
  completed_at?: Date;
  status: string; // pending, running, completed, failed
  result?: Record<string, any>;
  error_message?: string;
}

export interface ScheduleManagerOptions {
  db: any; // Database session/connection
  maxWorkers?: number;
}

export class ScheduleManager {
  private db: any;
  private schedulerRunning: boolean = false;
  private actionHandlers: Map<string, (config: Record<string, any>) => Promise<Record<string, any>>> = new Map();
  private schedulerInterval?: NodeJS.Timeout;

  constructor(options: ScheduleManagerOptions) {
    this.db = options.db;
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers(): void {
    // Action handlers
    this.actionHandlers.set('send_email', this.handleSendEmail.bind(this));
    this.actionHandlers.set('generate_report', this.handleGenerateReport.bind(this));
    this.actionHandlers.set('cleanup_data', this.handleCleanupData.bind(this));
    this.actionHandlers.set('backup_database', this.handleBackupDatabase.bind(this));
    this.actionHandlers.set('sync_integrations', this.handleSyncIntegrations.bind(this));
    this.actionHandlers.set('send_notifications', this.handleSendNotifications.bind(this));
    this.actionHandlers.set('update_analytics', this.handleUpdateAnalytics.bind(this));
    this.actionHandlers.set('custom_action', this.handleCustomAction.bind(this));
  }

  async createSchedule(scheduleData: Record<string, any>): Promise<Schedule> {
    try {
      const config: ScheduleConfig = {
        timezone: 'UTC',
        recurrence_pattern: RecurrencePattern.EVERY_DAY,
        custom_days: [],
        interval: 1,
        metadata: {},
        ...scheduleData.config
      };

      const schedule: Schedule = {
        id: uuidv4(),
        name: scheduleData.name,
        description: scheduleData.description || '',
        type: scheduleData.type,
        status: ScheduleStatus.ACTIVE,
        config,
        action_type: scheduleData.action_type,
        action_config: scheduleData.action_config || {},
        max_runs: scheduleData.max_runs,
        is_active: true,
        created_by: scheduleData.created_by || 'system',
        created_at: new Date(),
        updated_at: new Date(),
        run_count: 0
      };

      // Calculate next run time
      schedule.next_run = await this.calculateNextRun(schedule);

      // Insert into database
      await this.db.query(
        `INSERT INTO schedules (
          id, name, description, type, status, config, action_type, action_config,
          next_run, run_count, max_runs, is_active, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          schedule.id, schedule.name, schedule.description, schedule.type, schedule.status,
          JSON.stringify(schedule.config), schedule.action_type, JSON.stringify(schedule.action_config),
          schedule.next_run, schedule.run_count, schedule.max_runs, schedule.is_active,
          schedule.created_by, schedule.created_at, schedule.updated_at
        ]
      );

      return schedule;
    } catch (error) {
      throw new Error(`Failed to create schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async calculateNextRun(schedule: Schedule): Promise<Date | undefined> {
    try {
      const config = schedule.config;
      const now = new Date();

      switch (schedule.type) {
        case ScheduleType.ONCE:
          if (config.start_date && config.start_date > now) {
            return config.start_date;
          }
          return undefined;

        case ScheduleType.DAILY:
          return this.calculateDailyNextRun(config, now);

        case ScheduleType.WEEKLY:
          return this.calculateWeeklyNextRun(config, now);

        case ScheduleType.MONTHLY:
          return this.calculateMonthlyNextRun(config, now);

        case ScheduleType.YEARLY:
          return this.calculateYearlyNextRun(config, now);

        case ScheduleType.CRON:
          return this.calculateCronNextRun(config, now);

        case ScheduleType.CUSTOM:
          return this.calculateCustomNextRun(config, now);

        default:
          return undefined;
      }
    } catch (error) {
      console.error('Error calculating next run:', error);
      return undefined;
    }
  }

  private calculateDailyNextRun(config: ScheduleConfig, now: Date): Date {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (config.recurrence_pattern) {
      case RecurrencePattern.EVERY_DAY:
        return new Date(now.getTime() + config.interval * 24 * 60 * 60 * 1000);

      case RecurrencePattern.WEEKDAYS:
        let nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        while (nextDay.getDay() > 5) { // Skip weekends (0=Sunday, 6=Saturday)
          nextDay.setDate(nextDay.getDate() + 1);
        }
        return nextDay;

      case RecurrencePattern.WEEKENDS:
        let nextWeekend = new Date(now);
        nextWeekend.setDate(nextWeekend.getDate() + 1);
        while (nextWeekend.getDay() < 6) { // Skip weekdays
          nextWeekend.setDate(nextWeekend.getDate() + 1);
        }
        return nextWeekend;

      case RecurrencePattern.CUSTOM_DAYS:
        let nextCustom = new Date(now);
        nextCustom.setDate(nextCustom.getDate() + 1);
        while (!config.custom_days.includes(nextCustom.getDay())) {
          nextCustom.setDate(nextCustom.getDate() + 1);
        }
        return nextCustom;

      case RecurrencePattern.EVERY_N_DAYS:
        return new Date(now.getTime() + config.interval * 24 * 60 * 60 * 1000);

      default:
        return tomorrow;
    }
  }

  private calculateWeeklyNextRun(config: ScheduleConfig, now: Date): Date {
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7 * config.interval);
    return nextWeek;
  }

  private calculateMonthlyNextRun(config: ScheduleConfig, now: Date): Date {
    const nextMonth = new Date(now);
    if (now.getMonth() === 11) {
      nextMonth.setFullYear(now.getFullYear() + 1, 0);
    } else {
      nextMonth.setMonth(now.getMonth() + config.interval);
    }
    return nextMonth;
  }

  private calculateYearlyNextRun(config: ScheduleConfig, now: Date): Date {
    const nextYear = new Date(now);
    nextYear.setFullYear(now.getFullYear() + config.interval);
    return nextYear;
  }

  private calculateCronNextRun(config: ScheduleConfig, now: Date): Date | undefined {
    if (!config.cron_expression) {
      return undefined;
    }

    try {
      const interval = cron.parseExpression(config.cron_expression, {
        currentDate: now,
        tz: config.timezone
      });
      return interval.next().toDate();
    } catch (error) {
      console.error('Invalid cron expression:', error);
      return undefined;
    }
  }

  private calculateCustomNextRun(config: ScheduleConfig, now: Date): Date {
    // Implementation for custom recurrence patterns
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  async updateSchedule(scheduleId: string, updates: Record<string, any>): Promise<Schedule> {
    try {
      const schedule = await this.getSchedule(scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }

      // Update fields
      const updateFields: string[] = [];
      const params: any[] = [];

      for (const [key, value] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'created_at' && key !== 'created_by' && schedule.hasOwnProperty(key)) {
          updateFields.push(`${key} = ?`);
          if (key === 'config') {
            params.push(JSON.stringify(value));
          } else {
            params.push(value);
          }
        }
      }

      if (updateFields.length === 0) {
        return schedule;
      }

      updateFields.push('updated_at = ?');
      params.push(new Date());
      params.push(scheduleId);

      await this.db.query(
        `UPDATE schedules SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      // Recalculate next run if config changed
      if ('config' in updates) {
        const updatedSchedule = await this.getSchedule(scheduleId);
        if (updatedSchedule) {
          updatedSchedule.next_run = await this.calculateNextRun(updatedSchedule);
          await this.db.query(
            'UPDATE schedules SET next_run = ? WHERE id = ?',
            [updatedSchedule.next_run, scheduleId]
          );
        }
      }

      return await this.getSchedule(scheduleId)!;
    } catch (error) {
      throw new Error(`Failed to update schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async pauseSchedule(scheduleId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'UPDATE schedules SET status = ?, is_active = ? WHERE id = ?',
        [ScheduleStatus.PAUSED, false, scheduleId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error pausing schedule:', error);
      return false;
    }
  }

  async resumeSchedule(scheduleId: string): Promise<boolean> {
    try {
      const schedule = await this.getSchedule(scheduleId);
      if (!schedule || schedule.status !== ScheduleStatus.PAUSED) {
        return false;
      }

      const nextRun = await this.calculateNextRun(schedule);
      await this.db.query(
        'UPDATE schedules SET status = ?, is_active = ?, next_run = ? WHERE id = ?',
        [ScheduleStatus.ACTIVE, true, nextRun, scheduleId]
      );
      return true;
    } catch (error) {
      console.error('Error resuming schedule:', error);
      return false;
    }
  }

  async cancelSchedule(scheduleId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'UPDATE schedules SET status = ?, is_active = ? WHERE id = ?',
        [ScheduleStatus.CANCELLED, false, scheduleId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      return false;
    }
  }

  async startScheduler(): Promise<void> {
    if (this.schedulerRunning) {
      return;
    }

    this.schedulerRunning = true;
    this.schedulerInterval = setInterval(() => {
      this.schedulerLoop();
    }, 30000); // Check every 30 seconds
  }

  async stopScheduler(): Promise<void> {
    this.schedulerRunning = false;
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = undefined;
    }
  }

  private async schedulerLoop(): Promise<void> {
    try {
      // Get schedules ready to run
      const now = new Date();
      const result = await this.db.query(
        'SELECT * FROM schedules WHERE is_active = ? AND status = ? AND next_run <= ?',
        [true, ScheduleStatus.ACTIVE, now]
      );

      const readySchedules = result.map((row: any) => this.mapRowToSchedule(row));

      // Execute ready schedules
      for (const schedule of readySchedules) {
        setImmediate(() => this.executeSchedule(schedule));
      }
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  }

  private async executeSchedule(schedule: Schedule): Promise<void> {
    try {
      // Create execution log
      const execution: ScheduleExecution = {
        id: uuidv4(),
        schedule_id: schedule.id,
        scheduled_at: schedule.next_run!,
        started_at: new Date(),
        status: 'running'
      };

      await this.db.query(
        `INSERT INTO schedule_executions (id, schedule_id, scheduled_at, started_at, status)
         VALUES (?, ?, ?, ?, ?)`,
        [execution.id, execution.schedule_id, execution.scheduled_at, execution.started_at, execution.status]
      );

      // Execute action
      const handler = this.actionHandlers.get(schedule.action_type);
      if (!handler) {
        throw new Error(`No handler for action type: ${schedule.action_type}`);
      }

      const result = await handler(schedule.action_config);

      // Update execution
      execution.status = 'completed';
      execution.completed_at = new Date();
      execution.result = result;

      await this.db.query(
        'UPDATE schedule_executions SET status = ?, completed_at = ?, result = ? WHERE id = ?',
        [execution.status, execution.completed_at, JSON.stringify(execution.result), execution.id]
      );

      // Update schedule
      const nextRun = await this.calculateNextRun(schedule);
      const shouldContinue = !schedule.max_runs || schedule.run_count + 1 < schedule.max_runs;

      if (shouldContinue && nextRun) {
        await this.db.query(
          'UPDATE schedules SET last_run = ?, run_count = ?, next_run = ? WHERE id = ?',
          [new Date(), schedule.run_count + 1, nextRun, schedule.id]
        );
      } else {
        await this.db.query(
          'UPDATE schedules SET last_run = ?, run_count = ?, status = ?, is_active = ? WHERE id = ?',
          [new Date(), schedule.run_count + 1, ScheduleStatus.COMPLETED, false, schedule.id]
        );
      }
    } catch (error) {
      // Handle execution failure
      try {
        await this.db.query(
          'UPDATE schedule_executions SET status = ?, completed_at = ?, error_message = ? WHERE schedule_id = ? AND status = ?',
          ['failed', new Date(), error instanceof Error ? error.message : 'Unknown error', schedule.id, 'running']
        );
      } catch (updateError) {
        console.error('Error updating failed execution:', updateError);
      }
    }
  }

  // Action Handlers
  private async handleSendEmail(config: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for sending emails
    return { emails_sent: 1, recipients: config.recipients || [] };
  }

  private async handleGenerateReport(config: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for generating reports
    return { report_generated: true, file_path: `/reports/${uuidv4()}.pdf` };
  }

  private async handleCleanupData(config: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for data cleanup
    return { cleanup_completed: true, records_cleaned: config.count || 0 };
  }

  private async handleBackupDatabase(config: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for database backup
    return { backup_completed: true, backup_path: `/backups/${uuidv4()}.sql` };
  }

  private async handleSyncIntegrations(config: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for integration sync
    return { sync_completed: true, integrations_synced: config.count || 0 };
  }

  private async handleSendNotifications(config: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for sending notifications
    return { notifications_sent: 1, channels: config.channels || [] };
  }

  private async handleUpdateAnalytics(config: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for analytics update
    return { analytics_updated: true, metrics_processed: config.count || 0 };
  }

  private async handleCustomAction(config: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for custom actions
    return { custom_action_completed: true, result: config.result || {} };
  }

  async getSchedules(
    status?: string,
    scheduleType?: string,
    limit: number = 100
  ): Promise<Array<Record<string, any>>> {
    try {
      let query = 'SELECT * FROM schedules';
      const params: any[] = [];

      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }
      if (scheduleType) {
        query += status ? ' AND type = ?' : ' WHERE type = ?';
        params.push(scheduleType);
      }

      query += ' ORDER BY created_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => {
        const schedule = this.mapRowToSchedule(row);
        return {
          id: schedule.id,
          name: schedule.name,
          type: schedule.type,
          status: schedule.status,
          next_run: schedule.next_run?.toISOString() || null,
          last_run: schedule.last_run?.toISOString() || null,
          run_count: schedule.run_count,
          is_active: schedule.is_active
        };
      });
    } catch (error) {
      console.error('Error getting schedules:', error);
      return [];
    }
  }

  async getScheduleExecutions(scheduleId?: string, limit: number = 100): Promise<Array<Record<string, any>>> {
    try {
      let query = 'SELECT * FROM schedule_executions';
      const params: any[] = [];

      if (scheduleId) {
        query += ' WHERE schedule_id = ?';
        params.push(scheduleId);
      }

      query += ' ORDER BY scheduled_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => ({
        id: row.id,
        schedule_id: row.schedule_id,
        scheduled_at: new Date(row.scheduled_at).toISOString(),
        started_at: row.started_at ? new Date(row.started_at).toISOString() : null,
        completed_at: row.completed_at ? new Date(row.completed_at).toISOString() : null,
        status: row.status,
        error_message: row.error_message
      }));
    } catch (error) {
      console.error('Error getting schedule executions:', error);
      return [];
    }
  }

  async getScheduleStatistics(): Promise<Record<string, any>> {
    try {
      const totalSchedules = (await this.db.query('SELECT COUNT(*) as count FROM schedules'))[0].count;
      const activeSchedules = (await this.db.query('SELECT COUNT(*) as count FROM schedules WHERE is_active = ?', [true]))[0].count;
      const totalExecutions = (await this.db.query('SELECT COUNT(*) as count FROM schedule_executions'))[0].count;
      const successfulExecutions = (await this.db.query('SELECT COUNT(*) as count FROM schedule_executions WHERE status = ?', ['completed']))[0].count;

      return {
        total_schedules: totalSchedules,
        active_schedules: activeSchedules,
        total_executions: totalExecutions,
        successful_executions: successfulExecutions,
        success_rate: totalExecutions > 0 ? (successfulExecutions / totalExecutions * 100) : 0
      };
    } catch (error) {
      console.error('Error getting schedule statistics:', error);
      return {};
    }
  }

  async getSchedule(scheduleId: string): Promise<Schedule | null> {
    try {
      const result = await this.db.query('SELECT * FROM schedules WHERE id = ?', [scheduleId]);
      if (result.length === 0) {
        return null;
      }
      return this.mapRowToSchedule(result[0]);
    } catch (error) {
      console.error('Error getting schedule:', error);
      return null;
    }
  }

  // Helper methods
  private mapRowToSchedule(row: any): Schedule {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as ScheduleType,
      status: row.status as ScheduleStatus,
      config: JSON.parse(row.config || '{}'),
      action_type: row.action_type,
      action_config: JSON.parse(row.action_config || '{}'),
      next_run: row.next_run ? new Date(row.next_run) : undefined,
      last_run: row.last_run ? new Date(row.last_run) : undefined,
      run_count: row.run_count,
      max_runs: row.max_runs,
      is_active: Boolean(row.is_active),
      created_by: row.created_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }
}

export default ScheduleManager;