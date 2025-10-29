/**
 * TASK MANAGEMENT SYSTEM
 * Advanced task scheduling and execution system for Buffr Host
 */

import { v4 as uuidv4 } from 'uuid';

// Enums
export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  RETRYING = 'retrying'
}

export enum TaskPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum TaskType {
  BACKGROUND = 'background',
  SCHEDULED = 'scheduled',
  IMMEDIATE = 'immediate',
  BATCH = 'batch',
  REAL_TIME = 'real_time',
  MAINTENANCE = 'maintenance',
  CLEANUP = 'cleanup',
  SYNC = 'sync',
  NOTIFICATION = 'notification',
  REPORT = 'report',
  CUSTOM = 'custom'
}

// Interfaces
export interface TaskConfig {
  max_retries: number;
  retry_delay: number; // in milliseconds
  timeout: number; // in milliseconds
  priority: TaskPriority;
  parallel_execution: boolean;
  dependencies: string[]; // Task IDs that must complete first
  metadata: Record<string, any>;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  config: TaskConfig;
  payload: Record<string, any>;
  result?: Record<string, any>;
  error_message?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  scheduled_at?: Date;
  started_at?: Date;
  completed_at?: Date;
  retry_count: number;
  max_retries: number;
}

export interface TaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  created_at: Date;
}

export interface TaskExecution {
  id: string;
  task_id: string;
  started_at: Date;
  completed_at?: Date;
  status: TaskStatus;
  result?: Record<string, any>;
  error_message?: string;
  execution_time: number; // in milliseconds
  memory_usage?: number; // in MB
  cpu_usage?: number; // percentage
}

export interface TaskManagerOptions {
  db: any; // Database session/connection
  maxWorkers?: number;
  taskTimeout?: number;
  retryDelay?: number;
}

export class TaskManager {
  private db: any;
  private maxWorkers: number;
  private taskTimeout: number;
  private retryDelay: number;
  private workers: Map<string, Worker> = new Map();
  private taskHandlers: Map<string, (payload: Record<string, any>) => Promise<Record<string, any>>> = new Map();
  private isRunning: boolean = false;
  private schedulerInterval?: NodeJS.Timeout;

  constructor(options: TaskManagerOptions) {
    this.db = options.db;
    this.maxWorkers = options.maxWorkers || 5;
    this.taskTimeout = options.taskTimeout || 300000; // 5 minutes default
    this.retryDelay = options.retryDelay || 60000; // 1 minute default
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers(): void {
    // Task handlers
    this.taskHandlers.set('send_email', this.handleSendEmail.bind(this));
    this.taskHandlers.set('generate_report', this.handleGenerateReport.bind(this));
    this.taskHandlers.set('cleanup_data', this.handleCleanupData.bind(this));
    this.taskHandlers.set('backup_database', this.handleBackupDatabase.bind(this));
    this.taskHandlers.set('sync_integration', this.handleSyncIntegration.bind(this));
    this.taskHandlers.set('process_payment', this.handleProcessPayment.bind(this));
    this.taskHandlers.set('send_notification', this.handleSendNotification.bind(this));
    this.taskHandlers.set('update_analytics', this.handleUpdateAnalytics.bind(this));
    this.taskHandlers.set('custom_task', this.handleCustomTask.bind(this));
  }

  async createTask(
    name: string,
    type: TaskType,
    payload: Record<string, any>,
    config: Partial<TaskConfig> = {},
    createdBy: string = 'system',
    scheduledAt?: Date
  ): Promise<Task> {
    try {
      const taskConfig: TaskConfig = {
        max_retries: 3,
        retry_delay: this.retryDelay,
        timeout: this.taskTimeout,
        priority: TaskPriority.NORMAL,
        parallel_execution: false,
        dependencies: [],
        metadata: {},
        ...config
      };

      const task: Task = {
        id: uuidv4(),
        name,
        description: payload.description || '',
        type,
        status: TaskStatus.PENDING,
        priority: taskConfig.priority,
        config: taskConfig,
        payload,
        created_by: createdBy,
        created_at: new Date(),
        updated_at: new Date(),
        scheduled_at: scheduledAt,
        retry_count: 0,
        max_retries: taskConfig.max_retries
      };

      // Insert into database
      await this.db.query(
        `INSERT INTO tasks (
          id, name, description, type, status, priority, config, payload,
          created_by, created_at, updated_at, scheduled_at, retry_count, max_retries
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.id, task.name, task.description, task.type, task.status, task.priority,
          JSON.stringify(task.config), JSON.stringify(task.payload), task.created_by,
          task.created_at, task.updated_at, task.scheduled_at, task.retry_count, task.max_retries
        ]
      );

      // Create dependencies
      if (taskConfig.dependencies.length > 0) {
        for (const dependencyId of taskConfig.dependencies) {
          await this.createTaskDependency(task.id, dependencyId);
        }
      }

      return task;
    } catch (error) {
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async createTaskDependency(taskId: string, dependsOnTaskId: string): Promise<void> {
    try {
      const dependency: TaskDependency = {
        id: uuidv4(),
        task_id: taskId,
        depends_on_task_id: dependsOnTaskId,
        created_at: new Date()
      };

      await this.db.query(
        'INSERT INTO task_dependencies (id, task_id, depends_on_task_id, created_at) VALUES (?, ?, ?, ?)',
        [dependency.id, dependency.task_id, dependency.depends_on_task_id, dependency.created_at]
      );
    } catch (error) {
      console.error('Error creating task dependency:', error);
    }
  }

  async startScheduler(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.schedulerInterval = setInterval(() => {
      this.schedulerLoop();
    }, 5000); // Check every 5 seconds
  }

  async stopScheduler(): Promise<void> {
    this.isRunning = false;
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = undefined;
    }

    // Stop all workers
    for (const worker of this.workers.values()) {
      worker.stop();
    }
    this.workers.clear();
  }

  private async schedulerLoop(): Promise<void> {
    try {
      // Get pending tasks
      const pendingTasks = await this.getPendingTasks();
      
      // Filter tasks that are ready to run (dependencies satisfied)
      const readyTasks = [];
      for (const task of pendingTasks) {
        if (await this.areDependenciesSatisfied(task.id)) {
          readyTasks.push(task);
        }
      }

      // Sort by priority and creation time
      readyTasks.sort((a, b) => {
        const priorityOrder = { [TaskPriority.CRITICAL]: 5, [TaskPriority.URGENT]: 4, [TaskPriority.HIGH]: 3, [TaskPriority.NORMAL]: 2, [TaskPriority.LOW]: 1 };
        const aPriority = priorityOrder[a.priority] || 0;
        const bPriority = priorityOrder[b.priority] || 0;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        return a.created_at.getTime() - b.created_at.getTime();
      });

      // Execute tasks up to max workers
      const availableWorkers = this.maxWorkers - this.workers.size;
      const tasksToExecute = readyTasks.slice(0, availableWorkers);

      for (const task of tasksToExecute) {
        this.executeTask(task);
      }
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  }

  private async getPendingTasks(): Promise<Task[]> {
    try {
      const now = new Date();
      const result = await this.db.query(
        'SELECT * FROM tasks WHERE status = ? AND (scheduled_at IS NULL OR scheduled_at <= ?) ORDER BY priority DESC, created_at ASC',
        [TaskStatus.PENDING, now]
      );
      return result.map((row: any) => this.mapRowToTask(row));
    } catch (error) {
      console.error('Error getting pending tasks:', error);
      return [];
    }
  }

  private async areDependenciesSatisfied(taskId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'SELECT depends_on_task_id FROM task_dependencies WHERE task_id = ?',
        [taskId]
      );

      if (result.length === 0) {
        return true; // No dependencies
      }

      for (const row of result) {
        const dependencyTask = await this.getTask(row.depends_on_task_id);
        if (!dependencyTask || dependencyTask.status !== TaskStatus.COMPLETED) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking dependencies:', error);
      return false;
    }
  }

  private async executeTask(task: Task): Promise<void> {
    const worker = new Worker(task, this);
    this.workers.set(task.id, worker);
    
    try {
      await worker.execute();
    } finally {
      this.workers.delete(task.id);
    }
  }

  async getTask(taskId: string): Promise<Task | null> {
    try {
      const result = await this.db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
      if (result.length === 0) {
        return null;
      }
      return this.mapRowToTask(result[0]);
    } catch (error) {
      console.error('Error getting task:', error);
      return null;
    }
  }

  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    result?: Record<string, any>,
    errorMessage?: string
  ): Promise<boolean> {
    try {
      const updateFields: string[] = ['status = ?', 'updated_at = ?'];
      const params: any[] = [status, new Date()];

      if (result) {
        updateFields.push('result = ?');
        params.push(JSON.stringify(result));
      }

      if (errorMessage) {
        updateFields.push('error_message = ?');
        params.push(errorMessage);
      }

      if (status === TaskStatus.RUNNING) {
        updateFields.push('started_at = ?');
        params.push(new Date());
      } else if (status === TaskStatus.COMPLETED || status === TaskStatus.FAILED) {
        updateFields.push('completed_at = ?');
        params.push(new Date());
      }

      params.push(taskId);

      await this.db.query(
        `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      return false;
    }
  }

  async cancelTask(taskId: string, reason?: string): Promise<boolean> {
    try {
      const task = await this.getTask(taskId);
      if (!task || task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED) {
        return false;
      }

      // Stop worker if running
      const worker = this.workers.get(taskId);
      if (worker) {
        worker.stop();
        this.workers.delete(taskId);
      }

      // Update task status
      await this.updateTaskStatus(taskId, TaskStatus.CANCELLED, undefined, reason);

      return true;
    } catch (error) {
      console.error('Error cancelling task:', error);
      return false;
    }
  }

  async retryTask(taskId: string): Promise<boolean> {
    try {
      const task = await this.getTask(taskId);
      if (!task || task.retry_count >= task.max_retries) {
        return false;
      }

      // Update retry count
      await this.db.query(
        'UPDATE tasks SET retry_count = ?, status = ?, updated_at = ? WHERE id = ?',
        [task.retry_count + 1, TaskStatus.RETRYING, new Date(), taskId]
      );

      // Schedule retry
      setTimeout(() => {
        this.db.query(
          'UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?',
          [TaskStatus.PENDING, new Date(), taskId]
        );
      }, task.config.retry_delay);

      return true;
    } catch (error) {
      console.error('Error retrying task:', error);
      return false;
    }
  }

  async getTasks(
    status?: TaskStatus,
    type?: TaskType,
    priority?: TaskPriority,
    limit: number = 100
  ): Promise<Task[]> {
    try {
      let query = 'SELECT * FROM tasks WHERE 1=1';
      const params: any[] = [];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }
      if (priority) {
        query += ' AND priority = ?';
        params.push(priority);
      }

      query += ' ORDER BY created_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToTask(row));
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async getTaskExecutions(taskId: string, limit: number = 100): Promise<TaskExecution[]> {
    try {
      const result = await this.db.query(
        'SELECT * FROM task_executions WHERE task_id = ? ORDER BY started_at DESC LIMIT ?',
        [taskId, limit]
      );
      return result.map((row: any) => this.mapRowToTaskExecution(row));
    } catch (error) {
      console.error('Error getting task executions:', error);
      return [];
    }
  }

  async getTaskStatistics(): Promise<Record<string, any>> {
    try {
      const totalTasks = (await this.db.query('SELECT COUNT(*) as count FROM tasks'))[0].count;
      const pendingTasks = (await this.db.query('SELECT COUNT(*) as count FROM tasks WHERE status = ?', [TaskStatus.PENDING]))[0].count;
      const runningTasks = (await this.db.query('SELECT COUNT(*) as count FROM tasks WHERE status = ?', [TaskStatus.RUNNING]))[0].count;
      const completedTasks = (await this.db.query('SELECT COUNT(*) as count FROM tasks WHERE status = ?', [TaskStatus.COMPLETED]))[0].count;
      const failedTasks = (await this.db.query('SELECT COUNT(*) as count FROM tasks WHERE status = ?', [TaskStatus.FAILED]))[0].count;

      // Count by type
      const typeCounts: Record<string, number> = {};
      for (const type of Object.values(TaskType)) {
        const count = (await this.db.query('SELECT COUNT(*) as count FROM tasks WHERE type = ?', [type]))[0].count;
        typeCounts[type] = count;
      }

      // Count by priority
      const priorityCounts: Record<string, number> = {};
      for (const priority of Object.values(TaskPriority)) {
        const count = (await this.db.query('SELECT COUNT(*) as count FROM tasks WHERE priority = ?', [priority]))[0].count;
        priorityCounts[priority] = count;
      }

      return {
        total_tasks: totalTasks,
        pending_tasks: pendingTasks,
        running_tasks: runningTasks,
        completed_tasks: completedTasks,
        failed_tasks: failedTasks,
        by_type: typeCounts,
        by_priority: priorityCounts
      };
    } catch (error) {
      console.error('Error getting task statistics:', error);
      return {};
    }
  }

  // Task Handlers
  private async handleSendEmail(payload: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for sending emails
    return { emails_sent: 1, recipients: payload.recipients || [] };
  }

  private async handleGenerateReport(payload: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for generating reports
    return { report_generated: true, file_path: `/reports/${uuidv4()}.pdf` };
  }

  private async handleCleanupData(payload: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for data cleanup
    return { cleanup_completed: true, records_cleaned: payload.count || 0 };
  }

  private async handleBackupDatabase(payload: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for database backup
    return { backup_completed: true, backup_path: `/backups/${uuidv4()}.sql` };
  }

  private async handleSyncIntegration(payload: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for integration sync
    return { sync_completed: true, records_synced: payload.count || 0 };
  }

  private async handleProcessPayment(payload: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for payment processing
    return { payment_processed: true, transaction_id: uuidv4() };
  }

  private async handleSendNotification(payload: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for sending notifications
    return { notifications_sent: 1, channels: payload.channels || [] };
  }

  private async handleUpdateAnalytics(payload: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for analytics update
    return { analytics_updated: true, metrics_processed: payload.count || 0 };
  }

  private async handleCustomTask(payload: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for custom tasks
    return { custom_task_completed: true, result: payload.result || {} };
  }

  // Helper methods
  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type as TaskType,
      status: row.status as TaskStatus,
      priority: row.priority as TaskPriority,
      config: JSON.parse(row.config || '{}'),
      payload: JSON.parse(row.payload || '{}'),
      result: row.result ? JSON.parse(row.result) : undefined,
      error_message: row.error_message,
      created_by: row.created_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      scheduled_at: row.scheduled_at ? new Date(row.scheduled_at) : undefined,
      started_at: row.started_at ? new Date(row.started_at) : undefined,
      completed_at: row.completed_at ? new Date(row.completed_at) : undefined,
      retry_count: row.retry_count,
      max_retries: row.max_retries
    };
  }

  private mapRowToTaskExecution(row: any): TaskExecution {
    return {
      id: row.id,
      task_id: row.task_id,
      started_at: new Date(row.started_at),
      completed_at: row.completed_at ? new Date(row.completed_at) : undefined,
      status: row.status as TaskStatus,
      result: row.result ? JSON.parse(row.result) : undefined,
      error_message: row.error_message,
      execution_time: row.execution_time,
      memory_usage: row.memory_usage,
      cpu_usage: row.cpu_usage
    };
  }
}

// Worker class for task execution
class Worker {
  private task: Task;
  private taskManager: TaskManager;
  private isStopped: boolean = false;

  constructor(task: Task, taskManager: TaskManager) {
    this.task = task;
    this.taskManager = taskManager;
  }

  async execute(): Promise<void> {
    try {
      // Update task status to running
      await this.taskManager.updateTaskStatus(this.task.id, TaskStatus.RUNNING);

      // Get task handler
      const handler = this.taskManager['taskHandlers'].get(this.task.type);
      if (!handler) {
        throw new Error(`No handler for task type: ${this.task.type}`);
      }

      // Execute task with timeout
      const result = await Promise.race([
        handler(this.task.payload),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Task timeout')), this.task.config.timeout)
        )
      ]) as Record<string, any>;

      // Update task status to completed
      await this.taskManager.updateTaskStatus(this.task.id, TaskStatus.COMPLETED, result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if we should retry
      if (this.task.retry_count < this.task.max_retries) {
        await this.taskManager.updateTaskStatus(this.task.id, TaskStatus.FAILED, undefined, errorMessage);
        await this.taskManager.retryTask(this.task.id);
      } else {
        await this.taskManager.updateTaskStatus(this.task.id, TaskStatus.FAILED, undefined, errorMessage);
      }
    }
  }

  stop(): void {
    this.isStopped = true;
  }
}

export default TaskManager;