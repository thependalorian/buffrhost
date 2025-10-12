/**
 * WORKFLOW MANAGEMENT SYSTEM
 * Advanced workflow orchestration system for Buffr Host
 */

import { v4 as uuidv4 } from 'uuid';

// Enums
export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled'
}

export enum WorkflowTrigger {
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  EVENT = 'event',
  API = 'api',
  WEBHOOK = 'webhook',
  CONDITION = 'condition'
}

// Interfaces
export interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  dependencies: string[];
  conditions?: {
    expression: string;
    on_true: string;
    on_false: string;
  };
  retry_config?: {
    max_retries: number;
    retry_delay: number;
    backoff_multiplier: number;
  };
  timeout?: number; // in milliseconds
  parallel_execution: boolean;
  metadata: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: WorkflowStatus;
  current_step?: string;
  context: Record<string, any>;
  result?: Record<string, any>;
  error_message?: string;
  started_at: Date;
  completed_at?: Date;
  created_by: string;
  metadata: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: number;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  trigger_config: Record<string, any>;
  steps: WorkflowStep[];
  variables: Record<string, any>;
  timeout?: number; // in milliseconds
  retry_config?: {
    max_retries: number;
    retry_delay: number;
  };
  created_by: string;
  created_at: Date;
  updated_at: Date;
  metadata: Record<string, any>;
}

export interface WorkflowManagerOptions {
  db: any; // Database session/connection
  redisClient?: any; // Redis client for caching
  maxConcurrentWorkflows?: number;
  stepTimeout?: number;
}

export class WorkflowManager {
  private db: any;
  private redis?: any;
  private maxConcurrentWorkflows: number;
  private stepTimeout: number;
  private stepHandlers: Map<string, (config: Record<string, any>, context: Record<string, any>) => Promise<Record<string, any>>> = new Map();
  private runningWorkflows: Map<string, WorkflowExecution> = new Map();
  private isRunning: boolean = false;
  private schedulerInterval?: NodeJS.Timeout;

  constructor(options: WorkflowManagerOptions) {
    this.db = options.db;
    this.redis = options.redisClient;
    this.maxConcurrentWorkflows = options.maxConcurrentWorkflows || 10;
    this.stepTimeout = options.stepTimeout || 300000; // 5 minutes default
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers(): void {
    // Step handlers
    this.stepHandlers.set('send_email', this.handleSendEmail.bind(this));
    this.stepHandlers.set('send_sms', this.handleSendSMS.bind(this));
    this.stepHandlers.set('generate_report', this.handleGenerateReport.bind(this));
    this.stepHandlers.set('process_payment', this.handleProcessPayment.bind(this));
    this.stepHandlers.set('update_database', this.handleUpdateDatabase.bind(this));
    this.stepHandlers.set('call_api', this.handleCallAPI.bind(this));
    this.stepHandlers.set('wait', this.handleWait.bind(this));
    this.stepHandlers.set('condition', this.handleCondition.bind(this));
    this.stepHandlers.set('parallel', this.handleParallel.bind(this));
    this.stepHandlers.set('custom', this.handleCustom.bind(this));
  }

  async createWorkflow(
    name: string,
    description: string,
    trigger: WorkflowTrigger,
    triggerConfig: Record<string, any> = {},
    steps: WorkflowStep[],
    variables: Record<string, any> = {},
    createdBy: string = 'system',
    timeout?: number,
    retryConfig?: { max_retries: number; retry_delay: number }
  ): Promise<Workflow> {
    try {
      // Validate workflow
      this.validateWorkflow(steps);

      const workflow: Workflow = {
        id: uuidv4(),
        name,
        description,
        version: 1,
        status: WorkflowStatus.DRAFT,
        trigger,
        trigger_config: triggerConfig,
        steps,
        variables,
        timeout,
        retry_config: retryConfig,
        created_by: createdBy,
        created_at: new Date(),
        updated_at: new Date(),
        metadata: {}
      };

      // Insert into database
      await this.db.query(
        `INSERT INTO workflows (
          id, name, description, version, status, trigger, trigger_config, steps,
          variables, timeout, retry_config, created_by, created_at, updated_at, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          workflow.id, workflow.name, workflow.description, workflow.version, workflow.status,
          workflow.trigger, JSON.stringify(workflow.trigger_config), JSON.stringify(workflow.steps),
          JSON.stringify(workflow.variables), workflow.timeout, JSON.stringify(workflow.retry_config),
          workflow.created_by, workflow.created_at, workflow.updated_at, JSON.stringify(workflow.metadata)
        ]
      );

      return workflow;
    } catch (error) {
      throw new Error(`Failed to create workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateWorkflow(steps: WorkflowStep[]): void {
    if (steps.length === 0) {
      throw new Error('Workflow must have at least one step');
    }

    const stepIds = new Set<string>();
    for (const step of steps) {
      // Check for duplicate step IDs
      if (stepIds.has(step.id)) {
        throw new Error(`Duplicate step ID: ${step.id}`);
      }
      stepIds.add(step.id);

      // Validate dependencies
      for (const depId of step.dependencies) {
        if (!stepIds.has(depId)) {
          throw new Error(`Step ${step.id} depends on non-existent step: ${depId}`);
        }
      }
    }

    // Check for circular dependencies
    this.checkCircularDependencies(steps);
  }

  private checkCircularDependencies(steps: WorkflowStep[]): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const visit = (stepId: string) => {
      if (recursionStack.has(stepId)) {
        throw new Error(`Circular dependency detected involving step: ${stepId}`);
      }
      if (visited.has(stepId)) {
        return;
      }

      visited.add(stepId);
      recursionStack.add(stepId);

      const step = steps.find(s => s.id === stepId);
      if (step) {
        for (const depId of step.dependencies) {
          visit(depId);
        }
      }

      recursionStack.delete(stepId);
    };

    for (const step of steps) {
      if (!visited.has(step.id)) {
        visit(step.id);
      }
    }
  }

  async updateWorkflow(
    workflowId: string,
    updates: Partial<{
      name: string;
      description: string;
      steps: WorkflowStep[];
      variables: Record<string, any>;
      timeout: number;
      retry_config: { max_retries: number; retry_delay: number };
    }>,
    updatedBy: string = 'system'
  ): Promise<Workflow> {
    try {
      const workflow = await this.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      // Validate steps if provided
      if (updates.steps) {
        this.validateWorkflow(updates.steps);
      }

      // Update fields
      const updateFields: string[] = [];
      const params: any[] = [];

      for (const [key, value] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'created_at' && key !== 'created_by' && workflow.hasOwnProperty(key)) {
          updateFields.push(`${key} = ?`);
          if (key === 'steps' || key === 'variables' || key === 'retry_config') {
            params.push(JSON.stringify(value));
          } else {
            params.push(value);
          }
        }
      }

      if (updateFields.length === 0) {
        return workflow;
      }

      // Increment version if steps changed
      if (updates.steps) {
        updateFields.push('version = ?');
        params.push(workflow.version + 1);
      }

      updateFields.push('updated_at = ?');
      params.push(new Date());
      params.push(workflowId);

      await this.db.query(
        `UPDATE workflows SET ${updateFields.join(', ')} WHERE id = ?`,
        params
      );

      return await this.getWorkflow(workflowId)!;
    } catch (error) {
      throw new Error(`Failed to update workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async executeWorkflow(
    workflowId: string,
    context: Record<string, any> = {},
    executedBy: string = 'system'
  ): Promise<WorkflowExecution> {
    try {
      const workflow = await this.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      if (workflow.status !== WorkflowStatus.ACTIVE) {
        throw new Error('Workflow is not active');
      }

      // Check concurrent workflow limit
      if (this.runningWorkflows.size >= this.maxConcurrentWorkflows) {
        throw new Error('Maximum concurrent workflows reached');
      }

      // Create execution
      const execution: WorkflowExecution = {
        id: uuidv4(),
        workflow_id: workflowId,
        status: WorkflowStatus.RUNNING,
        context: { ...workflow.variables, ...context },
        started_at: new Date(),
        created_by: executedBy,
        metadata: {}
      };

      // Insert into database
      await this.db.query(
        `INSERT INTO workflow_executions (
          id, workflow_id, status, context, started_at, created_by, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          execution.id, execution.workflow_id, execution.status,
          JSON.stringify(execution.context), execution.started_at,
          execution.created_by, JSON.stringify(execution.metadata)
        ]
      );

      // Start execution
      this.runningWorkflows.set(execution.id, execution);
      this.executeWorkflowSteps(execution, workflow);

      return execution;
    } catch (error) {
      throw new Error(`Failed to execute workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeWorkflowSteps(execution: WorkflowExecution, workflow: Workflow): Promise<void> {
    try {
      const completedSteps = new Set<string>();
      const failedSteps = new Set<string>();
      let currentStep: string | undefined;

      // Find starting steps (no dependencies)
      const startingSteps = workflow.steps.filter(step => step.dependencies.length === 0);
      
      if (startingSteps.length === 0) {
        throw new Error('No starting steps found in workflow');
      }

      // Execute steps
      while (completedSteps.size < workflow.steps.length && failedSteps.size === 0) {
        const readySteps = workflow.steps.filter(step => 
          !completedSteps.has(step.id) && 
          !failedSteps.has(step.id) &&
          step.dependencies.every(dep => completedSteps.has(dep))
        );

        if (readySteps.length === 0) {
          break; // No more steps can be executed
        }

        // Execute steps (parallel if configured)
        const stepPromises = readySteps.map(step => this.executeStep(step, execution, workflow));
        
        if (readySteps.some(step => step.parallel_execution)) {
          // Execute all steps in parallel
          await Promise.all(stepPromises);
        } else {
          // Execute steps sequentially
          for (const promise of stepPromises) {
            await promise;
          }
        }

        // Update completed and failed steps
        for (const step of readySteps) {
          const stepResult = await this.getStepResult(execution.id, step.id);
          if (stepResult?.status === TaskStatus.COMPLETED) {
            completedSteps.add(step.id);
          } else if (stepResult?.status === TaskStatus.FAILED) {
            failedSteps.add(step.id);
          }
        }
      }

      // Update execution status
      if (failedSteps.size > 0) {
        execution.status = WorkflowStatus.FAILED;
        execution.error_message = 'One or more steps failed';
      } else {
        execution.status = WorkflowStatus.COMPLETED;
        execution.result = { completed_steps: Array.from(completedSteps) };
      }

      execution.completed_at = new Date();

      // Update database
      await this.db.query(
        'UPDATE workflow_executions SET status = ?, result = ?, error_message = ?, completed_at = ? WHERE id = ?',
        [
          execution.status, JSON.stringify(execution.result), execution.error_message,
          execution.completed_at, execution.id
        ]
      );

      // Remove from running workflows
      this.runningWorkflows.delete(execution.id);
    } catch (error) {
      // Handle execution failure
      execution.status = WorkflowStatus.FAILED;
      execution.error_message = error instanceof Error ? error.message : 'Unknown error';
      execution.completed_at = new Date();

      await this.db.query(
        'UPDATE workflow_executions SET status = ?, error_message = ?, completed_at = ? WHERE id = ?',
        [execution.status, execution.error_message, execution.completed_at, execution.id]
      );

      this.runningWorkflows.delete(execution.id);
    }
  }

  private async executeStep(
    step: WorkflowStep,
    execution: WorkflowExecution,
    workflow: Workflow
  ): Promise<void> {
    try {
      // Check conditions
      if (step.conditions) {
        const conditionResult = await this.evaluateCondition(step.conditions.expression, execution.context);
        if (!conditionResult) {
          await this.logStepResult(execution.id, step.id, TaskStatus.SKIPPED, { reason: 'Condition not met' });
          return;
        }
      }

      // Get step handler
      const handler = this.stepHandlers.get(step.type);
      if (!handler) {
        throw new Error(`No handler for step type: ${step.type}`);
      }

      // Execute step with timeout
      const result = await Promise.race([
        handler(step.config, execution.context),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Step timeout')), step.timeout || this.stepTimeout)
        )
      ]) as Record<string, any>;

      // Update context with step result
      execution.context[`${step.id}_result`] = result;

      // Log successful execution
      await this.logStepResult(execution.id, step.id, TaskStatus.COMPLETED, result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check retry configuration
      if (step.retry_config && step.retry_config.max_retries > 0) {
        const retryCount = await this.getStepRetryCount(execution.id, step.id);
        if (retryCount < step.retry_config.max_retries) {
          // Schedule retry
          setTimeout(() => {
            this.executeStep(step, execution, workflow);
          }, step.retry_config.retry_delay * Math.pow(step.retry_config.backoff_multiplier || 2, retryCount));
          
          await this.logStepResult(execution.id, step.id, TaskStatus.PENDING, { 
            error: errorMessage, 
            retry_count: retryCount + 1 
          });
          return;
        }
      }

      // Log failure
      await this.logStepResult(execution.id, step.id, TaskStatus.FAILED, { error: errorMessage });
    }
  }

  private async evaluateCondition(expression: string, context: Record<string, any>): Promise<boolean> {
    try {
      // Simple condition evaluation (use proper expression evaluator in production)
      // This is a basic implementation - replace with a proper expression evaluator
      const contextKeys = Object.keys(context);
      const contextValues = Object.values(context);
      
      // Replace variables in expression with actual values
      let evaluatedExpression = expression;
      for (let i = 0; i < contextKeys.length; i++) {
        const regex = new RegExp(`\\b${contextKeys[i]}\\b`, 'g');
        evaluatedExpression = evaluatedExpression.replace(regex, JSON.stringify(contextValues[i]));
      }
      
      // Evaluate the expression (this is unsafe - use a proper evaluator in production)
      return eval(evaluatedExpression);
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  private async logStepResult(
    executionId: string,
    stepId: string,
    status: TaskStatus,
    result: Record<string, any>
  ): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO workflow_step_results (
          id, execution_id, step_id, status, result, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), executionId, stepId, status, JSON.stringify(result), new Date()]
      );
    } catch (error) {
      console.error('Error logging step result:', error);
    }
  }

  private async getStepResult(executionId: string, stepId: string): Promise<{ status: TaskStatus; result: Record<string, any> } | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM workflow_step_results WHERE execution_id = ? AND step_id = ? ORDER BY created_at DESC LIMIT 1',
        [executionId, stepId]
      );
      if (result.length === 0) {
        return null;
      }
      return {
        status: result[0].status as TaskStatus,
        result: JSON.parse(result[0].result || '{}')
      };
    } catch (error) {
      console.error('Error getting step result:', error);
      return null;
    }
  }

  private async getStepRetryCount(executionId: string, stepId: string): Promise<number> {
    try {
      const result = await this.db.query(
        'SELECT COUNT(*) as count FROM workflow_step_results WHERE execution_id = ? AND step_id = ? AND status = ?',
        [executionId, stepId, TaskStatus.PENDING]
      );
      return result[0].count;
    } catch (error) {
      console.error('Error getting step retry count:', error);
      return 0;
    }
  }

  // Step Handlers
  private async handleSendEmail(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for sending emails
    return { emails_sent: 1, recipients: config.recipients || [] };
  }

  private async handleSendSMS(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for sending SMS
    return { sms_sent: 1, recipients: config.recipients || [] };
  }

  private async handleGenerateReport(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for generating reports
    return { report_generated: true, file_path: `/reports/${uuidv4()}.pdf` };
  }

  private async handleProcessPayment(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for payment processing
    return { payment_processed: true, transaction_id: uuidv4() };
  }

  private async handleUpdateDatabase(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for database updates
    return { records_updated: config.count || 0 };
  }

  private async handleCallAPI(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for API calls
    return { api_called: true, response: config.response || {} };
  }

  private async handleWait(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for wait step
    const duration = config.duration || 1000;
    await new Promise(resolve => setTimeout(resolve, duration));
    return { waited: duration };
  }

  private async handleCondition(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for condition step
    return { condition_evaluated: true, result: config.result || true };
  }

  private async handleParallel(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for parallel execution
    return { parallel_executed: true, steps: config.steps || [] };
  }

  private async handleCustom(config: Record<string, any>, context: Record<string, any>): Promise<Record<string, any>> {
    // Implementation for custom steps
    return { custom_executed: true, result: config.result || {} };
  }

  async getWorkflow(workflowId: string): Promise<Workflow | null> {
    try {
      const result = await this.db.query('SELECT * FROM workflows WHERE id = ?', [workflowId]);
      if (result.length === 0) {
        return null;
      }
      return this.mapRowToWorkflow(result[0]);
    } catch (error) {
      console.error('Error getting workflow:', error);
      return null;
    }
  }

  async getWorkflows(
    status?: WorkflowStatus,
    trigger?: WorkflowTrigger,
    limit: number = 100
  ): Promise<Workflow[]> {
    try {
      let query = 'SELECT * FROM workflows WHERE 1=1';
      const params: any[] = [];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (trigger) {
        query += ' AND trigger = ?';
        params.push(trigger);
      }

      query += ' ORDER BY updated_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToWorkflow(row));
    } catch (error) {
      console.error('Error getting workflows:', error);
      return [];
    }
  }

  async getWorkflowExecutions(
    workflowId?: string,
    status?: WorkflowStatus,
    limit: number = 100
  ): Promise<WorkflowExecution[]> {
    try {
      let query = 'SELECT * FROM workflow_executions WHERE 1=1';
      const params: any[] = [];

      if (workflowId) {
        query += ' AND workflow_id = ?';
        params.push(workflowId);
      }
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      query += ' ORDER BY started_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.query(query, params);
      return result.map((row: any) => this.mapRowToWorkflowExecution(row));
    } catch (error) {
      console.error('Error getting workflow executions:', error);
      return [];
    }
  }

  async pauseWorkflow(workflowId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'UPDATE workflows SET status = ? WHERE id = ?',
        [WorkflowStatus.PAUSED, workflowId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error pausing workflow:', error);
      return false;
    }
  }

  async resumeWorkflow(workflowId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'UPDATE workflows SET status = ? WHERE id = ?',
        [WorkflowStatus.ACTIVE, workflowId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error resuming workflow:', error);
      return false;
    }
  }

  async cancelWorkflow(workflowId: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        'UPDATE workflows SET status = ? WHERE id = ?',
        [WorkflowStatus.CANCELLED, workflowId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error cancelling workflow:', error);
      return false;
    }
  }

  async getWorkflowStatistics(): Promise<Record<string, any>> {
    try {
      const totalWorkflows = (await this.db.query('SELECT COUNT(*) as count FROM workflows'))[0].count;
      const activeWorkflows = (await this.db.query('SELECT COUNT(*) as count FROM workflows WHERE status = ?', [WorkflowStatus.ACTIVE]))[0].count;
      const totalExecutions = (await this.db.query('SELECT COUNT(*) as count FROM workflow_executions'))[0].count;
      const successfulExecutions = (await this.db.query('SELECT COUNT(*) as count FROM workflow_executions WHERE status = ?', [WorkflowStatus.COMPLETED]))[0].count;

      // Count by trigger
      const triggerCounts: Record<string, number> = {};
      for (const trigger of Object.values(WorkflowTrigger)) {
        const count = (await this.db.query('SELECT COUNT(*) as count FROM workflows WHERE trigger = ?', [trigger]))[0].count;
        triggerCounts[trigger] = count;
      }

      return {
        total_workflows: totalWorkflows,
        active_workflows: activeWorkflows,
        total_executions: totalExecutions,
        successful_executions: successfulExecutions,
        success_rate: totalExecutions > 0 ? (successfulExecutions / totalExecutions * 100) : 0,
        by_trigger: triggerCounts
      };
    } catch (error) {
      console.error('Error getting workflow statistics:', error);
      return {};
    }
  }

  // Helper methods
  private mapRowToWorkflow(row: any): Workflow {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      version: row.version,
      status: row.status as WorkflowStatus,
      trigger: row.trigger as WorkflowTrigger,
      trigger_config: JSON.parse(row.trigger_config || '{}'),
      steps: JSON.parse(row.steps || '[]'),
      variables: JSON.parse(row.variables || '{}'),
      timeout: row.timeout,
      retry_config: JSON.parse(row.retry_config || '{}'),
      created_by: row.created_by,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      metadata: JSON.parse(row.metadata || '{}')
    };
  }

  private mapRowToWorkflowExecution(row: any): WorkflowExecution {
    return {
      id: row.id,
      workflow_id: row.workflow_id,
      status: row.status as WorkflowStatus,
      current_step: row.current_step,
      context: JSON.parse(row.context || '{}'),
      result: row.result ? JSON.parse(row.result) : undefined,
      error_message: row.error_message,
      started_at: new Date(row.started_at),
      completed_at: row.completed_at ? new Date(row.completed_at) : undefined,
      created_by: row.created_by,
      metadata: JSON.parse(row.metadata || '{}')
    };
  }
}

export default WorkflowManager;