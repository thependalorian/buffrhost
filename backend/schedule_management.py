"""
SCHEDULE MANAGEMENT SYSTEM
Advanced scheduling system for Buffr Host operations
"""

from typing import Dict, List, Optional, Any, Union, Callable
from datetime import datetime, timedelta, time
from enum import Enum
from dataclasses import dataclass, field
from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey, Text, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import asyncio
import json
import uuid
import croniter
from dateutil import rrule

Base = declarative_base()

class ScheduleType(Enum):
    """Schedule types"""
    ONCE = "once"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    CRON = "cron"
    CUSTOM = "custom"

class ScheduleStatus(Enum):
    """Schedule status"""
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class RecurrencePattern(Enum):
    """Recurrence patterns"""
    EVERY_DAY = "every_day"
    WEEKDAYS = "weekdays"
    WEEKENDS = "weekends"
    CUSTOM_DAYS = "custom_days"
    EVERY_N_DAYS = "every_n_days"
    EVERY_WEEK = "every_week"
    EVERY_MONTH = "every_month"
    EVERY_YEAR = "every_year"

@dataclass
class ScheduleConfig:
    """Schedule configuration"""
    timezone: str = "UTC"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    max_occurrences: Optional[int] = None
    recurrence_pattern: RecurrencePattern = RecurrencePattern.EVERY_DAY
    custom_days: List[int] = field(default_factory=list)  # 0=Monday, 6=Sunday
    interval: int = 1  # Every N days/weeks/months
    cron_expression: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

class Schedule(Base):
    """Schedule model"""
    __tablename__ = 'schedules'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(String(50), nullable=False)
    status = Column(String(50), default=ScheduleStatus.ACTIVE.value)
    config = Column(JSON)  # ScheduleConfig object
    action_type = Column(String(50), nullable=False)  # What to execute
    action_config = Column(JSON)  # Action configuration
    next_run = Column(DateTime)
    last_run = Column(DateTime)
    run_count = Column(Integer, default=0)
    max_runs = Column(Integer, default=None)
    is_active = Column(Boolean, default=True)
    created_by = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    executions = relationship("ScheduleExecution", back_populates="schedule")

class ScheduleExecution(Base):
    """Schedule execution log model"""
    __tablename__ = 'schedule_executions'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    schedule_id = Column(String, ForeignKey('schedules.id'))
    scheduled_at = Column(DateTime, nullable=False)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    status = Column(String(50), default="pending")
    result = Column(JSON)
    error_message = Column(Text)
    
    # Relationships
    schedule = relationship("Schedule", back_populates="executions")

class ScheduleManager:
    """Advanced schedule management system"""
    
    def __init__(self, db_session):
        self.db = db_session
        self.scheduler_running = False
        self.action_handlers: Dict[str, Callable] = {}
        self._register_default_handlers()
    
    def _register_default_handlers(self):
        """Register default action handlers"""
        self.action_handlers.update({
            'send_email': self._handle_send_email,
            'generate_report': self._handle_generate_report,
            'cleanup_data': self._handle_cleanup_data,
            'backup_database': self._handle_backup_database,
            'sync_integrations': self._handle_sync_integrations,
            'send_notifications': self._handle_send_notifications,
            'update_analytics': self._handle_update_analytics,
            'custom_action': self._handle_custom_action
        })
    
    async def create_schedule(self, schedule_data: Dict[str, Any]) -> Schedule:
        """Create a new schedule"""
        try:
            config = ScheduleConfig(**schedule_data.get('config', {}))
            
            schedule = Schedule(
                name=schedule_data['name'],
                description=schedule_data.get('description', ''),
                type=schedule_data['type'],
                config=config.__dict__,
                action_type=schedule_data['action_type'],
                action_config=schedule_data.get('action_config', {}),
                max_runs=schedule_data.get('max_runs'),
                created_by=schedule_data.get('created_by', 'system')
            )
            
            # Calculate next run time
            schedule.next_run = await self._calculate_next_run(schedule)
            
            self.db.add(schedule)
            await self.db.commit()
            await self.db.refresh(schedule)
            
            return schedule
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to create schedule: {str(e)}")
    
    async def _calculate_next_run(self, schedule: Schedule) -> Optional[datetime]:
        """Calculate next run time for schedule"""
        try:
            config = ScheduleConfig(**schedule.config)
            now = datetime.utcnow()
            
            if schedule.type == ScheduleType.ONCE.value:
                if config.start_date and config.start_date > now:
                    return config.start_date
                return None
            
            elif schedule.type == ScheduleType.DAILY.value:
                return self._calculate_daily_next_run(config, now)
            
            elif schedule.type == ScheduleType.WEEKLY.value:
                return self._calculate_weekly_next_run(config, now)
            
            elif schedule.type == ScheduleType.MONTHLY.value:
                return self._calculate_monthly_next_run(config, now)
            
            elif schedule.type == ScheduleType.YEARLY.value:
                return self._calculate_yearly_next_run(config, now)
            
            elif schedule.type == ScheduleType.CRON.value:
                return self._calculate_cron_next_run(config, now)
            
            elif schedule.type == ScheduleType.CUSTOM.value:
                return self._calculate_custom_next_run(config, now)
            
            return None
        except Exception as e:
            print(f"Error calculating next run: {e}")
            return None
    
    def _calculate_daily_next_run(self, config: ScheduleConfig, now: datetime) -> datetime:
        """Calculate next daily run"""
        if config.recurrence_pattern == RecurrencePattern.EVERY_DAY.value:
            return now + timedelta(days=config.interval)
        elif config.recurrence_pattern == RecurrencePattern.WEEKDAYS.value:
            next_day = now + timedelta(days=1)
            while next_day.weekday() > 4:  # Skip weekends
                next_day += timedelta(days=1)
            return next_day
        elif config.recurrence_pattern == RecurrencePattern.WEEKENDS.value:
            next_day = now + timedelta(days=1)
            while next_day.weekday() < 5:  # Skip weekdays
                next_day += timedelta(days=1)
            return next_day
        elif config.recurrence_pattern == RecurrencePattern.CUSTOM_DAYS.value:
            next_day = now + timedelta(days=1)
            while next_day.weekday() not in config.custom_days:
                next_day += timedelta(days=1)
            return next_day
        elif config.recurrence_pattern == RecurrencePattern.EVERY_N_DAYS.value:
            return now + timedelta(days=config.interval)
        
        return now + timedelta(days=1)
    
    def _calculate_weekly_next_run(self, config: ScheduleConfig, now: datetime) -> datetime:
        """Calculate next weekly run"""
        next_week = now + timedelta(weeks=config.interval)
        return next_week
    
    def _calculate_monthly_next_run(self, config: ScheduleConfig, now: datetime) -> datetime:
        """Calculate next monthly run"""
        if now.month == 12:
            next_month = now.replace(year=now.year + 1, month=1)
        else:
            next_month = now.replace(month=now.month + config.interval)
        return next_month
    
    def _calculate_yearly_next_run(self, config: ScheduleConfig, now: datetime) -> datetime:
        """Calculate next yearly run"""
        return now.replace(year=now.year + config.interval)
    
    def _calculate_cron_next_run(self, config: ScheduleConfig, now: datetime) -> datetime:
        """Calculate next cron run"""
        if not config.cron_expression:
            return None
        
        try:
            cron = croniter.croniter(config.cron_expression, now)
            return cron.get_next(datetime)
        except Exception:
            return None
    
    def _calculate_custom_next_run(self, config: ScheduleConfig, now: datetime) -> datetime:
        """Calculate next custom run"""
        # Implementation for custom recurrence patterns
        return now + timedelta(days=1)
    
    async def update_schedule(self, schedule_id: str, updates: Dict[str, Any]) -> Schedule:
        """Update an existing schedule"""
        try:
            schedule = await self.db.get(Schedule, schedule_id)
            if not schedule:
                raise Exception("Schedule not found")
            
            for key, value in updates.items():
                if hasattr(schedule, key):
                    setattr(schedule, key, value)
            
            # Recalculate next run if config changed
            if 'config' in updates:
                schedule.next_run = await self._calculate_next_run(schedule)
            
            schedule.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(schedule)
            
            return schedule
        except Exception as e:
            await self.db.rollback()
            raise Exception(f"Failed to update schedule: {str(e)}")
    
    async def pause_schedule(self, schedule_id: str) -> bool:
        """Pause a schedule"""
        try:
            schedule = await self.db.get(Schedule, schedule_id)
            if schedule:
                schedule.status = ScheduleStatus.PAUSED.value
                schedule.is_active = False
                await self.db.commit()
                return True
            return False
        except Exception:
            return False
    
    async def resume_schedule(self, schedule_id: str) -> bool:
        """Resume a paused schedule"""
        try:
            schedule = await self.db.get(Schedule, schedule_id)
            if schedule and schedule.status == ScheduleStatus.PAUSED.value:
                schedule.status = ScheduleStatus.ACTIVE.value
                schedule.is_active = True
                schedule.next_run = await self._calculate_next_run(schedule)
                await self.db.commit()
                return True
            return False
        except Exception:
            return False
    
    async def cancel_schedule(self, schedule_id: str) -> bool:
        """Cancel a schedule"""
        try:
            schedule = await self.db.get(Schedule, schedule_id)
            if schedule:
                schedule.status = ScheduleStatus.CANCELLED.value
                schedule.is_active = False
                await self.db.commit()
                return True
            return False
        except Exception:
            return False
    
    async def start_scheduler(self):
        """Start the schedule manager"""
        if self.scheduler_running:
            return
        
        self.scheduler_running = True
        asyncio.create_task(self._scheduler_loop())
    
    async def stop_scheduler(self):
        """Stop the schedule manager"""
        self.scheduler_running = False
    
    async def _scheduler_loop(self):
        """Main scheduler loop"""
        while self.scheduler_running:
            try:
                # Get schedules ready to run
                now = datetime.utcnow()
                ready_schedules = await self.db.query(Schedule).filter(
                    Schedule.is_active == True,
                    Schedule.status == ScheduleStatus.ACTIVE.value,
                    Schedule.next_run <= now
                ).all()
                
                # Execute ready schedules
                for schedule in ready_schedules:
                    asyncio.create_task(self._execute_schedule(schedule))
                
                # Wait before next check
                await asyncio.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                print(f"Scheduler error: {e}")
                await asyncio.sleep(60)  # Wait longer on error
    
    async def _execute_schedule(self, schedule: Schedule):
        """Execute a schedule"""
        try:
            # Create execution log
            execution = ScheduleExecution(
                schedule_id=schedule.id,
                scheduled_at=schedule.next_run,
                started_at=datetime.utcnow(),
                status="running"
            )
            self.db.add(execution)
            await self.db.commit()
            
            # Execute action
            handler = self.action_handlers.get(schedule.action_type)
            if not handler:
                raise Exception(f"No handler for action type: {schedule.action_type}")
            
            result = await handler(schedule.action_config)
            
            # Update execution
            execution.status = "completed"
            execution.completed_at = datetime.utcnow()
            execution.result = result
            await self.db.commit()
            
            # Update schedule
            schedule.last_run = datetime.utcnow()
            schedule.run_count += 1
            
            # Check if schedule should continue
            if schedule.max_runs and schedule.run_count >= schedule.max_runs:
                schedule.status = ScheduleStatus.COMPLETED.value
                schedule.is_active = False
            else:
                schedule.next_run = await self._calculate_next_run(schedule)
            
            await self.db.commit()
            
        except Exception as e:
            # Handle execution failure
            try:
                execution.status = "failed"
                execution.completed_at = datetime.utcnow()
                execution.error_message = str(e)
                await self.db.commit()
            except:
                pass
    
    # Action Handlers
    async def _handle_send_email(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Handle send email action"""
        # Implementation for sending emails
        return {"emails_sent": 1, "recipients": config.get('recipients', [])}
    
    async def _handle_generate_report(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Handle generate report action"""
        # Implementation for generating reports
        return {"report_generated": True, "file_path": f"/reports/{uuid.uuid4()}.pdf"}
    
    async def _handle_cleanup_data(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Handle cleanup data action"""
        # Implementation for data cleanup
        return {"cleanup_completed": True, "records_cleaned": config.get('count', 0)}
    
    async def _handle_backup_database(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Handle backup database action"""
        # Implementation for database backup
        return {"backup_completed": True, "backup_path": f"/backups/{uuid.uuid4()}.sql"}
    
    async def _handle_sync_integrations(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Handle sync integrations action"""
        # Implementation for integration sync
        return {"sync_completed": True, "integrations_synced": config.get('count', 0)}
    
    async def _handle_send_notifications(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Handle send notifications action"""
        # Implementation for sending notifications
        return {"notifications_sent": 1, "channels": config.get('channels', [])}
    
    async def _handle_update_analytics(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Handle update analytics action"""
        # Implementation for analytics update
        return {"analytics_updated": True, "metrics_processed": config.get('count', 0)}
    
    async def _handle_custom_action(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Handle custom action"""
        # Implementation for custom actions
        return {"custom_action_completed": True, "result": config.get('result', {})}
    
    async def get_schedules(self, status: str = None, schedule_type: str = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Get schedules with filters"""
        try:
            query = self.db.query(Schedule)
            
            if status:
                query = query.filter(Schedule.status == status)
            if schedule_type:
                query = query.filter(Schedule.type == schedule_type)
            
            schedules = await query.order_by(Schedule.created_at.desc()).limit(limit).all()
            
            return [
                {
                    "id": schedule.id,
                    "name": schedule.name,
                    "type": schedule.type,
                    "status": schedule.status,
                    "next_run": schedule.next_run.isoformat() if schedule.next_run else None,
                    "last_run": schedule.last_run.isoformat() if schedule.last_run else None,
                    "run_count": schedule.run_count,
                    "is_active": schedule.is_active
                }
                for schedule in schedules
            ]
        except Exception:
            return []
    
    async def get_schedule_executions(self, schedule_id: str = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Get schedule executions"""
        try:
            query = self.db.query(ScheduleExecution)
            
            if schedule_id:
                query = query.filter(ScheduleExecution.schedule_id == schedule_id)
            
            executions = await query.order_by(ScheduleExecution.scheduled_at.desc()).limit(limit).all()
            
            return [
                {
                    "id": execution.id,
                    "schedule_id": execution.schedule_id,
                    "scheduled_at": execution.scheduled_at.isoformat(),
                    "started_at": execution.started_at.isoformat() if execution.started_at else None,
                    "completed_at": execution.completed_at.isoformat() if execution.completed_at else None,
                    "status": execution.status,
                    "error_message": execution.error_message
                }
                for execution in executions
            ]
        except Exception:
            return []
    
    async def get_schedule_statistics(self) -> Dict[str, Any]:
        """Get schedule statistics"""
        try:
            total_schedules = await self.db.query(Schedule).count()
            active_schedules = await self.db.query(Schedule).filter(Schedule.is_active == True).count()
            total_executions = await self.db.query(ScheduleExecution).count()
            successful_executions = await self.db.query(ScheduleExecution).filter(
                ScheduleExecution.status == "completed"
            ).count()
            
            return {
                "total_schedules": total_schedules,
                "active_schedules": active_schedules,
                "total_executions": total_executions,
                "successful_executions": successful_executions,
                "success_rate": (successful_executions / total_executions * 100) if total_executions > 0 else 0
            }
        except Exception:
            return {}