"""
WORKFLOW MANAGEMENT SYSTEM
Advanced workflow orchestration for Buffr Host operations
"""

from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import asyncio
import json
import uuid

Base = declarative_base()

class WorkflowStatus(Enum):
    """Workflow execution status"""
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TaskStatus(Enum):
    """Individual task status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"
    CANCELLED = "cancelled"

class WorkflowTrigger(Enum):
    """Workflow trigger types"""
    MANUAL = "manual"
    SCHEDULED = "scheduled"
    EVENT = "event"
    API = "api"
    WEBHOOK = "webhook"

@dataclass
class WorkflowStep:
    """Individual step in a workflow"""
    id: str
    name: str
    type: str
    config: Dict[str, Any]
    dependencies: List[str] = field(default_factory=list)
    timeout: int = 300  # 5 minutes default
    retry_count: int = 3
    retry_delay: int = 60  # 1 minute
    condition: Optional[str] = None
    on_success: Optional[str] = None
    on_failure: Optional[str] = None

@dataclass
class WorkflowExecution:
    """Workflow execution instance"""
    id: str
    workflow_id: str
    status: WorkflowStatus
    started_at: datetime
    completed_at: Optional[datetime] = None
    context: Dict[str, Any] = field(default_factory=dict)
    steps: List[Dict[str, Any]] = field(default_factory=list)
    error_message: Optional[str] = None
    created_by: str = "system"

class Workflow(Base):
    """Workflow definition model"""
    __tablename__ = 'workflows'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    version = Column(String(50), default="1.0.0")
    status = Column(String(50), default=WorkflowStatus.DRAFT.value)
    trigger_type = Column(String(50), default=WorkflowTrigger.MANUAL.value)
    trigger_config = Column(JSON)
    steps = Column(JSON)  # List of WorkflowStep objects
    variables = Column(JSON)  # Workflow variables
    timeout = Column(Integer, default=3600)  # 1 hour default
    retry_count = Column(Integer, default=3)
    retry_delay = Column(Integer, default=300)  # 5 minutes
    is_active = Column(Boolean, default=True)
    created_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    executions = relationship("WorkflowExecution", back_populates="workflow")

class WorkflowExecution(Base):
    """Workflow execution instance model"""
    __tablename__ = 'workflow_executions'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_id = Column(String, ForeignKey('workflows.id'))
    status = Column(String(50), default=WorkflowStatus.ACTIVE.value)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    context = Column(JSON)
    steps = Column(JSON)  # Execution steps with status
    error_message = Column(Text)
    created_by = Column(String(255))
    
    # Relationships
    workflow = relationship("Workflow", back_populates="executions")

class WorkflowManager:
    """Advanced workflow management system"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.active_executions: Dict[str, WorkflowExecution] = {}
        self.step_handlers: Dict[str, callable] = {}
        self._register_default_handlers()
    
    def _register_default_handlers(self):
        """Register default step handlers"""
        self.step_handlers.update({
            'send_email': self._handle_send_email,
            'create_booking': self._handle_create_booking,
            'update_room_status': self._handle_update_room_status,
            'send_notification': self._handle_send_notification,
            'generate_report': self._handle_generate_report,
            'call_api': self._handle_call_api,
            'wait': self._handle_wait,
            'condition': self._handle_condition,
            'loop': self._handle_loop,
            'parallel': self._handle_parallel
        })
    
    async def create_workflow(self, workflow_data: Dict[str, Any]) -> Workflow:
        """Create a new workflow"""
        try:
            workflow = Workflow(
                name=workflow_data['name'],
                description=workflow_data.get('description', ''),
                trigger_type=workflow_data.get('trigger_type', WorkflowTrigger.MANUAL.value),
                trigger_config=workflow_data.get('trigger_config', {}),
                steps=workflow_data.get('steps', []),
                variables=workflow_data.get('variables', {}),
                timeout=workflow_data.get('timeout', 3600),
                retry_count=workflow_data.get('retry_count', 3),
                retry_delay=workflow_data.get('retry_delay', 300),
                created_by=workflow_data.get('created_by', 'system')
            )
            
            self.db.add(workflow)
            await self.db.commit()
            await self.db.refresh(workflow)
            
            return workflow
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to create workflow: {str(e)}")
    
    async def update_workflow(self, workflow_id: str, updates: Dict[str, Any]) -> Workflow:
        """Update an existing workflow"""
        try:
            workflow = await self.db.get(Workflow, workflow_id)
            if not workflow:
                raise Exception("Workflow not found")
            
            for key, value in updates.items():
                if hasattr(workflow, key):
                    setattr(workflow, key, value)
            
            workflow.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(workflow)
            
            return workflow
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to update workflow: {str(e)}")
    
    async def execute_workflow(self, workflow_id: str, context: Dict[str, Any] = None) -> WorkflowExecution:
        """Execute a workflow"""
        try:
            workflow = await self.db.get(Workflow, workflow_id)
            if not workflow:
                raise Exception("Workflow not found")
            
            if workflow.status != WorkflowStatus.ACTIVE.value:
                raise Exception("Workflow is not active")
            
            # Create execution instance
            execution = WorkflowExecution(
                id=str(uuid.uuid4()),
                workflow_id=workflow_id,
                status=WorkflowStatus.ACTIVE,
                started_at=datetime.utcnow(),
                context=context or {},
                created_by=context.get('created_by', 'system') if context else 'system'
            )
            
            self.db.add(execution)
            await self.db.commit()
            
            # Start execution in background
            asyncio.create_task(self._execute_workflow_steps(execution))
            
            return execution
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to execute workflow: {str(e)}")
    
    async def _execute_workflow_steps(self, execution: WorkflowExecution):
        """Execute workflow steps"""
        try:
            workflow = await self.db.get(Workflow, execution.workflow_id)
            if not workflow:
                return
            
            execution_context = execution.context.copy()
            steps_data = []
            
            for step_data in workflow.steps:
                step = WorkflowStep(**step_data)
                step_execution = {
                    'step_id': step.id,
                    'name': step.name,
                    'type': step.type,
                    'status': TaskStatus.PENDING.value,
                    'started_at': None,
                    'completed_at': None,
                    'error_message': None,
                    'retry_count': 0
                }
                
                try:
                    # Check dependencies
                    if not await self._check_dependencies(step, steps_data):
                        step_execution['status'] = TaskStatus.SKIPPED.value
                        steps_data.append(step_execution)
                        continue
                    
                    # Check condition
                    if step.condition and not await self._evaluate_condition(step.condition, execution_context):
                        step_execution['status'] = TaskStatus.SKIPPED.value
                        steps_data.append(step_execution)
                        continue
                    
                    # Execute step
                    step_execution['status'] = TaskStatus.RUNNING.value
                    step_execution['started_at'] = datetime.utcnow().isoformat()
                    
                    result = await self._execute_step(step, execution_context)
                    execution_context.update(result or {})
                    
                    step_execution['status'] = TaskStatus.COMPLETED.value
                    step_execution['completed_at'] = datetime.utcnow().isoformat()
                    
                except Exception as e:
                    step_execution['status'] = TaskStatus.FAILED.value
                    step_execution['error_message'] = str(e)
                    step_execution['completed_at'] = datetime.utcnow().isoformat()
                    
                    # Handle failure
                    if step.on_failure:
                        await self._handle_step_failure(step, execution_context, str(e))
                    
                    # Check if workflow should continue
                    if not step.retry_count or step_execution['retry_count'] >= step.retry_count:
                        execution.status = WorkflowStatus.FAILED
                        execution.error_message = str(e)
                        break
                
                steps_data.append(step_execution)
            
            # Update execution
            execution.steps = steps_data
            execution.context = execution_context
            
            if execution.status == WorkflowStatus.ACTIVE:
                execution.status = WorkflowStatus.COMPLETED
                execution.completed_at = datetime.utcnow()
            
            await self.db.commit()
            
        except Exception as e:
            execution.status = WorkflowStatus.FAILED
            execution.error_message = str(e)
            execution.completed_at = datetime.utcnow()
            await self.db.commit()
    
    async def _execute_step(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single workflow step"""
        handler = self.step_handlers.get(step.type)
        if not handler:
            raise Exception(f"Unknown step type: {step.type}")
        
        return await handler(step, context)
    
    async def _check_dependencies(self, step: WorkflowStep, completed_steps: List[Dict[str, Any]]) -> bool:
        """Check if step dependencies are met"""
        if not step.dependencies:
            return True
        
        completed_step_ids = {s['step_id'] for s in completed_steps if s['status'] == TaskStatus.COMPLETED.value}
        return all(dep in completed_step_ids for dep in step.dependencies)
    
    async def _evaluate_condition(self, condition: str, context: Dict[str, Any]) -> bool:
        """Evaluate step condition"""
        try:
            # Simple condition evaluation (can be enhanced with a proper expression evaluator)
            return eval(condition, {"context": context, "datetime": datetime})
        except:
            return False
    
    async def _handle_step_failure(self, step: WorkflowStep, context: Dict[str, Any], error: str):
        """Handle step failure"""
        if step.on_failure:
            # Execute failure handler
            await self._execute_step(WorkflowStep(
                id=f"{step.id}_failure",
                name=f"{step.name} Failure Handler",
                type=step.on_failure,
                config={}
            ), context)
    
    # Step Handlers
    async def _handle_send_email(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle email sending step"""
        # Implementation for sending emails
        return {"email_sent": True}
    
    async def _handle_create_booking(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle booking creation step"""
        # Implementation for creating bookings
        return {"booking_created": True}
    
    async def _handle_update_room_status(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle room status update step"""
        # Implementation for updating room status
        return {"room_updated": True}
    
    async def _handle_send_notification(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle notification sending step"""
        # Implementation for sending notifications
        return {"notification_sent": True}
    
    async def _handle_generate_report(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle report generation step"""
        # Implementation for generating reports
        return {"report_generated": True}
    
    async def _handle_call_api(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle API call step"""
        # Implementation for making API calls
        return {"api_called": True}
    
    async def _handle_wait(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle wait step"""
        wait_time = step.config.get('duration', 60)
        await asyncio.sleep(wait_time)
        return {"waited": wait_time}
    
    async def _handle_condition(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle conditional step"""
        condition = step.config.get('condition', 'True')
        return {"condition_result": await self._evaluate_condition(condition, context)}
    
    async def _handle_loop(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle loop step"""
        iterations = step.config.get('iterations', 1)
        results = []
        
        for i in range(iterations):
            result = await self._execute_step(step, context)
            results.append(result)
        
        return {"loop_results": results}
    
    async def _handle_parallel(self, step: WorkflowStep, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle parallel execution step"""
        parallel_steps = step.config.get('steps', [])
        tasks = []
        
        for parallel_step in parallel_steps:
            task = asyncio.create_task(self._execute_step(WorkflowStep(**parallel_step), context))
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return {"parallel_results": results}
    
    async def get_workflow_executions(self, workflow_id: str = None, status: str = None, limit: int = 100) -> List[WorkflowExecution]:
        """Get workflow executions with filters"""
        query = self.db.query(WorkflowExecution)
        
        if workflow_id:
            query = query.filter(WorkflowExecution.workflow_id == workflow_id)
        if status:
            query = query.filter(WorkflowExecution.status == status)
        
        return await query.order_by(WorkflowExecution.started_at.desc()).limit(limit).all()
    
    async def get_workflow_stats(self) -> Dict[str, Any]:
        """Get workflow statistics"""
        total_workflows = await self.db.query(Workflow).count()
        active_workflows = await self.db.query(Workflow).filter(Workflow.is_active == True).count()
        total_executions = await self.db.query(WorkflowExecution).count()
        successful_executions = await self.db.query(WorkflowExecution).filter(
            WorkflowExecution.status == WorkflowStatus.COMPLETED.value
        ).count()
        
        return {
            "total_workflows": total_workflows,
            "active_workflows": active_workflows,
            "total_executions": total_executions,
            "successful_executions": successful_executions,
            "success_rate": (successful_executions / total_executions * 100) if total_executions > 0 else 0
        }
    
    async def pause_workflow(self, workflow_id: str) -> bool:
        """Pause a workflow"""
        try:
            workflow = await self.db.get(Workflow, workflow_id)
            if workflow:
                workflow.status = WorkflowStatus.PAUSED.value
                await self.db.commit()
                return True
            return False
        except Exception:
            return False
    
    async def resume_workflow(self, workflow_id: str) -> bool:
        """Resume a paused workflow"""
        try:
            workflow = await self.db.get(Workflow, workflow_id)
            if workflow and workflow.status == WorkflowStatus.PAUSED.value:
                workflow.status = WorkflowStatus.ACTIVE.value
                await self.db.commit()
                return True
            return False
        except Exception:
            return False
    
    async def cancel_workflow_execution(self, execution_id: str) -> bool:
        """Cancel a workflow execution"""
        try:
            execution = await self.db.get(WorkflowExecution, execution_id)
            if execution and execution.status == WorkflowStatus.ACTIVE.value:
                execution.status = WorkflowStatus.CANCELLED.value
                execution.completed_at = datetime.utcnow()
                await self.db.commit()
                return True
            return False
        except Exception:
            return False