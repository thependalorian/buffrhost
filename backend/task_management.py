"""
TASK MANAGEMENT SYSTEM
Advanced task scheduling and execution for Buffr Host operations
"""

from typing import Dict, List, Optional, Any, Union, Callable
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, field
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import asyncio
import json
import uuid
import threading
from concurrent.futures import ThreadPoolExecutor

Base = declarative_base()

class TaskStatus(Enum):
    """Task execution status"""
    PENDING = "pending"
    SCHEDULED = "scheduled"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RETRYING = "retrying"

class TaskPriority(Enum):
    """Task priority levels"""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    URGENT = 4
    CRITICAL = 5

class TaskType(Enum):
    """Task types"""
    EMAIL = "email"
    NOTIFICATION = "notification"
    REPORT = "report"
    CLEANUP = "cleanup"
    BACKUP = "backup"
    SYNC = "sync"
    ANALYSIS = "analysis"
    CUSTOM = "custom"

@dataclass
class TaskConfig:
    """Task configuration"""
    max_retries: int = 3
    retry_delay: int = 60  # seconds
    timeout: int = 300  # seconds
    priority: TaskPriority = TaskPriority.NORMAL
    dependencies: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

class Task(Base):
    """Task model"""
    __tablename__ = 'tasks'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)
    status = Column(String(50), default=TaskStatus.PENDING.value)
    priority = Column(Integer, default=TaskPriority.NORMAL.value)
    config = Column(JSON)  # TaskConfig object
    payload = Column(JSON)  # Task data
    scheduled_at = Column(DateTime)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    error_message = Column(Text)
    result = Column(JSON)
    created_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    dependencies = relationship("TaskDependency", back_populates="task")

class TaskDependency(Base):
    """Task dependency model"""
    __tablename__ = 'task_dependencies'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, ForeignKey('tasks.id'))
    depends_on_task_id = Column(String, ForeignKey('tasks.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    task = relationship("Task", back_populates="dependencies")

class TaskExecution(Base):
    """Task execution log model"""
    __tablename__ = 'task_executions'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, ForeignKey('tasks.id'))
    status = Column(String(50), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    duration = Column(Float)  # seconds
    error_message = Column(Text)
    result = Column(JSON)
    worker_id = Column(String(255))

class TaskManager:
    """Advanced task management system"""
    
    def __init__(self, db_session, max_workers: int = 10):
        self.db = db_session
        self.max_workers = max_workers
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.task_handlers: Dict[str, Callable] = {}
        self.running_tasks: Dict[str, asyncio.Task] = {}
        self.scheduler_running = False
        self._register_default_handlers()
    
    def _register_default_handlers(self):
        """Register default task handlers"""
        self.task_handlers.update({
            'email': self._handle_email_task,
            'notification': self._handle_notification_task,
            'report': self._handle_report_task,
            'cleanup': self._handle_cleanup_task,
            'backup': self._handle_backup_task,
            'sync': self._handle_sync_task,
            'analysis': self._handle_analysis_task,
            'custom': self._handle_custom_task
        })
    
    async def create_task(self, task_data: Dict[str, Any]) -> Task:
        """Create a new task"""
        try:
            config = TaskConfig(**task_data.get('config', {}))
            
            task = Task(
                name=task_data['name'],
                description=task_data.get('description', ''),
                type=task_data['type'],
                priority=config.priority.value,
                config=config.__dict__,
                payload=task_data.get('payload', {}),
                scheduled_at=task_data.get('scheduled_at'),
                max_retries=config.max_retries,
                created_by=task_data.get('created_by', 'system')
            )
            
            self.db.add(task)
            await self.db.commit()
            await self.db.refresh(task)
            
            # Create dependencies
            if config.dependencies:
                await self._create_dependencies(task.id, config.dependencies)
            
            return task
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to create task: {str(e)}")
    
    async def _create_dependencies(self, task_id: str, dependencies: List[str]):
        """Create task dependencies"""
        for dep_task_id in dependencies:
            dependency = TaskDependency(
                task_id=task_id,
                depends_on_task_id=dep_task_id
            )
            self.db.add(dependency)
        await self.db.commit()
    
    async def schedule_task(self, task_id: str, scheduled_at: datetime) -> bool:
        """Schedule a task for execution"""
        try:
            task = await self.db.get(Task, task_id)
            if not task:
                return False
            
            task.scheduled_at = scheduled_at
            task.status = TaskStatus.SCHEDULED.value
            await self.db.commit()
            return True
        except Exception:
            return False
    
    async def execute_task(self, task_id: str) -> bool:
        """Execute a task immediately"""
        try:
            task = await self.db.get(Task, task_id)
            if not task:
                return False
            
            if task.status not in [TaskStatus.PENDING.value, TaskStatus.SCHEDULED.value]:
                return False
            
            # Check dependencies
            if not await self._check_dependencies(task_id):
                return False
            
            # Start execution
            asyncio.create_task(self._execute_task_async(task))
            return True
        except Exception:
            return False
    
    async def _execute_task_async(self, task: Task):
        """Execute task asynchronously"""
        try:
            # Update task status
            task.status = TaskStatus.RUNNING.value
            task.started_at = datetime.utcnow()
            task.retry_count += 1
            await self.db.commit()
            
            # Create execution log
            execution = TaskExecution(
                task_id=task.id,
                status=TaskStatus.RUNNING.value,
                worker_id=f"worker-{threading.current_thread().ident}"
            )
            self.db.add(execution)
            await self.db.commit()
            
            # Execute task
            handler = self.task_handlers.get(task.type)
            if not handler:
                raise Exception(f"No handler for task type: {task.type}")
            
            start_time = datetime.utcnow()
            result = await handler(task)
            end_time = datetime.utcnow()
            duration = (end_time - start_time).total_seconds()
            
            # Update task with result
            task.status = TaskStatus.COMPLETED.value
            task.completed_at = end_time
            task.result = result
            await self.db.commit()
            
            # Update execution log
            execution.status = TaskStatus.COMPLETED.value
            execution.completed_at = end_time
            execution.duration = duration
            execution.result = result
            await self.db.commit()
            
        except Exception as e:
            # Handle task failure
            await self._handle_task_failure(task, str(e))
    
    async def _handle_task_failure(self, task: Task, error: str):
        """Handle task execution failure"""
        try:
            task.error_message = error
            
            if task.retry_count < task.max_retries:
                # Retry task
                task.status = TaskStatus.RETRYING.value
                retry_delay = task.config.get('retry_delay', 60)
                
                # Schedule retry
                asyncio.create_task(self._retry_task(task, retry_delay))
            else:
                # Mark as failed
                task.status = TaskStatus.FAILED.value
                task.completed_at = datetime.utcnow()
            
            await self.db.commit()
            
        except Exception as e:
            print(f"Error handling task failure: {e}")
    
    async def _retry_task(self, task: Task, delay: int):
        """Retry a failed task after delay"""
        await asyncio.sleep(delay)
        await self._execute_task_async(task)
    
    async def _check_dependencies(self, task_id: str) -> bool:
        """Check if task dependencies are satisfied"""
        dependencies = await self.db.query(TaskDependency).filter(
            TaskDependency.task_id == task_id
        ).all()
        
        for dep in dependencies:
            dep_task = await self.db.get(Task, dep.depends_on_task_id)
            if not dep_task or dep_task.status != TaskStatus.COMPLETED.value:
                return False
        
        return True
    
    # Task Handlers
    async def _handle_email_task(self, task: Task) -> Dict[str, Any]:
        """Handle email task"""
        payload = task.payload
        # Implementation for sending emails
        return {"emails_sent": 1, "recipients": payload.get('recipients', [])}
    
    async def _handle_notification_task(self, task: Task) -> Dict[str, Any]:
        """Handle notification task"""
        payload = task.payload
        # Implementation for sending notifications
        return {"notifications_sent": 1, "channels": payload.get('channels', [])}
    
    async def _handle_report_task(self, task: Task) -> Dict[str, Any]:
        """Handle report generation task"""
        payload = task.payload
        # Implementation for generating reports
        return {"report_generated": True, "file_path": f"/reports/{task.id}.pdf"}
    
    async def _handle_cleanup_task(self, task: Task) -> Dict[str, Any]:
        """Handle cleanup task"""
        payload = task.payload
        # Implementation for cleanup operations
        return {"cleanup_completed": True, "items_cleaned": payload.get('count', 0)}
    
    async def _handle_backup_task(self, task: Task) -> Dict[str, Any]:
        """Handle backup task"""
        payload = task.payload
        # Implementation for backup operations
        return {"backup_completed": True, "backup_path": f"/backups/{task.id}.zip"}
    
    async def _handle_sync_task(self, task: Task) -> Dict[str, Any]:
        """Handle sync task"""
        payload = task.payload
        # Implementation for sync operations
        return {"sync_completed": True, "records_synced": payload.get('count', 0)}
    
    async def _handle_analysis_task(self, task: Task) -> Dict[str, Any]:
        """Handle analysis task"""
        payload = task.payload
        # Implementation for analysis operations
        return {"analysis_completed": True, "insights": payload.get('insights', [])}
    
    async def _handle_custom_task(self, task: Task) -> Dict[str, Any]:
        """Handle custom task"""
        payload = task.payload
        # Implementation for custom tasks
        return {"custom_task_completed": True, "result": payload.get('result', {})}
    
    async def start_scheduler(self):
        """Start the task scheduler"""
        if self.scheduler_running:
            return
        
        self.scheduler_running = True
        asyncio.create_task(self._scheduler_loop())
    
    async def stop_scheduler(self):
        """Stop the task scheduler"""
        self.scheduler_running = False
    
    async def _scheduler_loop(self):
        """Main scheduler loop"""
        while self.scheduler_running:
            try:
                # Get scheduled tasks
                now = datetime.utcnow()
                scheduled_tasks = await self.db.query(Task).filter(
                    Task.status == TaskStatus.SCHEDULED.value,
                    Task.scheduled_at <= now
                ).all()
                
                # Execute scheduled tasks
                for task in scheduled_tasks:
                    await self.execute_task(task.id)
                
                # Wait before next check
                await asyncio.sleep(10)  # Check every 10 seconds
                
            except Exception as e:
                print(f"Scheduler error: {e}")
                await asyncio.sleep(30)  # Wait longer on error
    
    async def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get task status and details"""
        try:
            task = await self.db.get(Task, task_id)
            if not task:
                return None
            
            return {
                "id": task.id,
                "name": task.name,
                "status": task.status,
                "priority": task.priority,
                "created_at": task.created_at.isoformat(),
                "started_at": task.started_at.isoformat() if task.started_at else None,
                "completed_at": task.completed_at.isoformat() if task.completed_at else None,
                "retry_count": task.retry_count,
                "error_message": task.error_message,
                "result": task.result
            }
        except Exception:
            return None
    
    async def get_tasks(self, status: str = None, task_type: str = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Get tasks with filters"""
        try:
            query = self.db.query(Task)
            
            if status:
                query = query.filter(Task.status == status)
            if task_type:
                query = query.filter(Task.type == task_type)
            
            tasks = await query.order_by(Task.created_at.desc()).limit(limit).all()
            
            return [
                {
                    "id": task.id,
                    "name": task.name,
                    "type": task.type,
                    "status": task.status,
                    "priority": task.priority,
                    "created_at": task.created_at.isoformat(),
                    "scheduled_at": task.scheduled_at.isoformat() if task.scheduled_at else None
                }
                for task in tasks
            ]
        except Exception:
            return []
    
    async def cancel_task(self, task_id: str) -> bool:
        """Cancel a task"""
        try:
            task = await self.db.get(Task, task_id)
            if not task:
                return False
            
            if task.status in [TaskStatus.PENDING.value, TaskStatus.SCHEDULED.value]:
                task.status = TaskStatus.CANCELLED.value
                task.completed_at = datetime.utcnow()
                await self.db.commit()
                return True
            
            return False
        except Exception:
            return False
    
    async def get_task_statistics(self) -> Dict[str, Any]:
        """Get task statistics"""
        try:
            total_tasks = await self.db.query(Task).count()
            pending_tasks = await self.db.query(Task).filter(Task.status == TaskStatus.PENDING.value).count()
            running_tasks = await self.db.query(Task).filter(Task.status == TaskStatus.RUNNING.value).count()
            completed_tasks = await self.db.query(Task).filter(Task.status == TaskStatus.COMPLETED.value).count()
            failed_tasks = await self.db.query(Task).filter(Task.status == TaskStatus.FAILED.value).count()
            
            return {
                "total_tasks": total_tasks,
                "pending_tasks": pending_tasks,
                "running_tasks": running_tasks,
                "completed_tasks": completed_tasks,
                "failed_tasks": failed_tasks,
                "success_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
            }
        except Exception:
            return {}
    
    async def cleanup_old_tasks(self, days: int = 30) -> int:
        """Clean up old completed tasks"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            old_tasks = await self.db.query(Task).filter(
                Task.status.in_([TaskStatus.COMPLETED.value, TaskStatus.FAILED.value, TaskStatus.CANCELLED.value]),
                Task.completed_at < cutoff_date
            ).all()
            
            count = len(old_tasks)
            for task in old_tasks:
                await self.db.delete(task)
            
            await self.db.commit()
            return count
        except Exception:
            return 0