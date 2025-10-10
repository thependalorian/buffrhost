"""
Advanced Monitoring and Alerting System for Buffr Host Platform
Provides comprehensive system monitoring, performance tracking, and intelligent alerting.
"""

import asyncio
import json
import logging
import time
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Callable
from dataclasses import dataclass, asdict
from enum import Enum
import psutil
import aiohttp
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

class AlertSeverity(Enum):
    """Alert severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertStatus(Enum):
    """Alert status"""
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"
    SUPPRESSED = "suppressed"

@dataclass
class Alert:
    """Alert data structure"""
    id: str
    title: str
    description: str
    severity: AlertSeverity
    status: AlertStatus
    service: str
    metric_name: str
    current_value: float
    threshold_value: float
    created_at: datetime
    resolved_at: Optional[datetime] = None
    metadata: Dict[str, Any] = None

@dataclass
class MetricData:
    """Metric data structure"""
    name: str
    value: float
    unit: str
    timestamp: datetime
    tags: Dict[str, str] = None

@dataclass
class HealthCheck:
    """Health check data structure"""
    service: str
    status: str
    response_time: float
    last_check: datetime
    details: Dict[str, Any] = None

class MetricsCollector:
    """Advanced metrics collection system"""
    
    def __init__(self):
        self.metrics: List[MetricData] = []
        self.collection_interval = 60  # seconds
        self.is_running = False
    
    async def start_collection(self):
        """Start metrics collection"""
        self.is_running = True
        logger.info("Started metrics collection")
        
        while self.is_running:
            try:
                await self._collect_system_metrics()
                await self._collect_application_metrics()
                await self._collect_database_metrics()
                
                # Keep only last 24 hours of metrics
                cutoff_time = datetime.now() - timedelta(hours=24)
                self.metrics = [m for m in self.metrics if m.timestamp > cutoff_time]
                
            except Exception as e:
                logger.error(f"Metrics collection error: {e}")
            
            await asyncio.sleep(self.collection_interval)
    
    def stop_collection(self):
        """Stop metrics collection"""
        self.is_running = False
        logger.info("Stopped metrics collection")
    
    async def _collect_system_metrics(self):
        """Collect system-level metrics"""
        try:
            # CPU usage
            cpu_percent = psutil.cpu_percent(interval=1)
            self.metrics.append(MetricData(
                name="cpu_usage",
                value=cpu_percent,
                unit="percent",
                timestamp=datetime.now(),
                tags={"type": "system"}
            ))
            
            # Memory usage
            memory = psutil.virtual_memory()
            self.metrics.append(MetricData(
                name="memory_usage",
                value=memory.percent,
                unit="percent",
                timestamp=datetime.now(),
                tags={"type": "system"}
            ))
            
            # Disk usage
            disk = psutil.disk_usage('/')
            self.metrics.append(MetricData(
                name="disk_usage",
                value=(disk.used / disk.total) * 100,
                unit="percent",
                timestamp=datetime.now(),
                tags={"type": "system"}
            ))
            
            # Network I/O
            network = psutil.net_io_counters()
            self.metrics.append(MetricData(
                name="network_bytes_sent",
                value=network.bytes_sent,
                unit="bytes",
                timestamp=datetime.now(),
                tags={"type": "system"}
            ))
            
            self.metrics.append(MetricData(
                name="network_bytes_recv",
                value=network.bytes_recv,
                unit="bytes",
                timestamp=datetime.now(),
                tags={"type": "system"}
            ))
            
        except Exception as e:
            logger.error(f"System metrics collection error: {e}")
    
    async def _collect_application_metrics(self):
        """Collect application-level metrics"""
        try:
            # Active connections
            self.metrics.append(MetricData(
                name="active_connections",
                value=len(asyncio.all_tasks()),
                unit="count",
                timestamp=datetime.now(),
                tags={"type": "application"}
            ))
            
            # Memory usage of current process
            process = psutil.Process()
            self.metrics.append(MetricData(
                name="process_memory",
                value=process.memory_info().rss / 1024 / 1024,  # MB
                unit="MB",
                timestamp=datetime.now(),
                tags={"type": "application"}
            ))
            
        except Exception as e:
            logger.error(f"Application metrics collection error: {e}")
    
    async def _collect_database_metrics(self, db_session: Optional[AsyncSession] = None):
        """Collect database-level metrics"""
        if not db_session:
            return
        
        try:
            # Database connection count
            # This would need to be implemented based on your database setup
            self.metrics.append(MetricData(
                name="db_connections",
                value=0,  # Placeholder
                unit="count",
                timestamp=datetime.now(),
                tags={"type": "database"}
            ))
            
        except Exception as e:
            logger.error(f"Database metrics collection error: {e}")
    
    def get_metrics(self, metric_name: Optional[str] = None, 
                   start_time: Optional[datetime] = None,
                   end_time: Optional[datetime] = None) -> List[MetricData]:
        """Get metrics with optional filtering"""
        filtered_metrics = self.metrics
        
        if metric_name:
            filtered_metrics = [m for m in filtered_metrics if m.name == metric_name]
        
        if start_time:
            filtered_metrics = [m for m in filtered_metrics if m.timestamp >= start_time]
        
        if end_time:
            filtered_metrics = [m for m in filtered_metrics if m.timestamp <= end_time]
        
        return filtered_metrics
    
    def get_latest_metric(self, metric_name: str) -> Optional[MetricData]:
        """Get latest value for a specific metric"""
        metric_data = [m for m in self.metrics if m.name == metric_name]
        if metric_data:
            return max(metric_data, key=lambda x: x.timestamp)
        return None

class AlertManager:
    """Advanced alert management system"""
    
    def __init__(self):
        self.alerts: List[Alert] = []
        self.alert_rules: Dict[str, Dict[str, Any]] = {}
        self.notification_handlers: List[Callable] = []
    
    def add_alert_rule(self, rule_name: str, rule_config: Dict[str, Any]):
        """Add alert rule configuration"""
        self.alert_rules[rule_name] = rule_config
        logger.info(f"Added alert rule: {rule_name}")
    
    def add_notification_handler(self, handler: Callable):
        """Add notification handler for alerts"""
        self.notification_handlers.append(handler)
    
    async def check_alerts(self, metrics_collector: MetricsCollector):
        """Check metrics against alert rules"""
        for rule_name, rule_config in self.alert_rules.items():
            try:
                await self._evaluate_rule(rule_name, rule_config, metrics_collector)
            except Exception as e:
                logger.error(f"Alert rule evaluation error for {rule_name}: {e}")
    
    async def _evaluate_rule(self, rule_name: str, rule_config: Dict[str, Any], 
                           metrics_collector: MetricsCollector):
        """Evaluate a specific alert rule"""
        metric_name = rule_config.get("metric")
        threshold = rule_config.get("threshold")
        operator = rule_config.get("operator", ">")
        severity = AlertSeverity(rule_config.get("severity", "medium"))
        
        # Get latest metric value
        latest_metric = metrics_collector.get_latest_metric(metric_name)
        if not latest_metric:
            return
        
        # Check if threshold is breached
        threshold_breached = False
        if operator == ">":
            threshold_breached = latest_metric.value > threshold
        elif operator == "<":
            threshold_breached = latest_metric.value < threshold
        elif operator == ">=":
            threshold_breached = latest_metric.value >= threshold
        elif operator == "<=":
            threshold_breached = latest_metric.value <= threshold
        elif operator == "==":
            threshold_breached = latest_metric.value == threshold
        
        if threshold_breached:
            # Check if alert already exists
            existing_alert = self._find_active_alert(rule_name, metric_name)
            
            if not existing_alert:
                # Create new alert
                alert = Alert(
                    id=f"{rule_name}_{int(time.time())}",
                    title=rule_config.get("title", f"{metric_name} threshold breached"),
                    description=rule_config.get("description", 
                        f"{metric_name} is {latest_metric.value} {latest_metric.unit}, "
                        f"threshold is {threshold} {latest_metric.unit}"),
                    severity=severity,
                    status=AlertStatus.ACTIVE,
                    service=rule_config.get("service", "unknown"),
                    metric_name=metric_name,
                    current_value=latest_metric.value,
                    threshold_value=threshold,
                    created_at=datetime.now(),
                    metadata=rule_config.get("metadata", {})
                )
                
                self.alerts.append(alert)
                await self._send_notifications(alert)
                logger.warning(f"Alert triggered: {alert.title}")
        else:
            # Resolve existing alert if threshold is no longer breached
            existing_alert = self._find_active_alert(rule_name, metric_name)
            if existing_alert:
                existing_alert.status = AlertStatus.RESOLVED
                existing_alert.resolved_at = datetime.now()
                logger.info(f"Alert resolved: {existing_alert.title}")
    
    def _find_active_alert(self, rule_name: str, metric_name: str) -> Optional[Alert]:
        """Find active alert for rule and metric"""
        for alert in self.alerts:
            if (alert.metric_name == metric_name and 
                alert.status == AlertStatus.ACTIVE and
                rule_name in alert.id):
                return alert
        return None
    
    async def _send_notifications(self, alert: Alert):
        """Send notifications for alert"""
        for handler in self.notification_handlers:
            try:
                await handler(alert)
            except Exception as e:
                logger.error(f"Notification handler error: {e}")
    
    def get_active_alerts(self) -> List[Alert]:
        """Get all active alerts"""
        return [alert for alert in self.alerts if alert.status == AlertStatus.ACTIVE]
    
    def get_alerts_by_severity(self, severity: AlertSeverity) -> List[Alert]:
        """Get alerts by severity"""
        return [alert for alert in self.alerts if alert.severity == severity]
    
    def acknowledge_alert(self, alert_id: str, user: str):
        """Acknowledge an alert"""
        for alert in self.alerts:
            if alert.id == alert_id:
                alert.status = AlertStatus.ACKNOWLEDGED
                if alert.metadata is None:
                    alert.metadata = {}
                alert.metadata["acknowledged_by"] = user
                alert.metadata["acknowledged_at"] = datetime.now().isoformat()
                logger.info(f"Alert {alert_id} acknowledged by {user}")
                break

class HealthChecker:
    """System health checking service"""
    
    def __init__(self):
        self.health_checks: List[HealthCheck] = []
        self.check_interval = 30  # seconds
        self.is_running = False
    
    async def start_health_checks(self):
        """Start health checking"""
        self.is_running = True
        logger.info("Started health checks")
        
        while self.is_running:
            try:
                await self._check_database_health()
                await self._check_redis_health()
                await self._check_external_services()
                
            except Exception as e:
                logger.error(f"Health check error: {e}")
            
            await asyncio.sleep(self.check_interval)
    
    def stop_health_checks(self):
        """Stop health checks"""
        self.is_running = False
        logger.info("Stopped health checks")
    
    async def _check_database_health(self):
        """Check database health"""
        try:
            start_time = time.time()
            # This would be a real database health check
            # For now, we'll simulate it
            response_time = (time.time() - start_time) * 1000  # ms
            
            health_check = HealthCheck(
                service="database",
                status="healthy" if response_time < 1000 else "degraded",
                response_time=response_time,
                last_check=datetime.now(),
                details={"connection_pool_size": 10}  # Placeholder
            )
            
            self._update_health_check(health_check)
            
        except Exception as e:
            health_check = HealthCheck(
                service="database",
                status="unhealthy",
                response_time=0,
                last_check=datetime.now(),
                details={"error": str(e)}
            )
            self._update_health_check(health_check)
    
    async def _check_redis_health(self):
        """Check Redis health"""
        try:
            start_time = time.time()
            # This would be a real Redis health check
            response_time = (time.time() - start_time) * 1000  # ms
            
            health_check = HealthCheck(
                service="redis",
                status="healthy" if response_time < 100 else "degraded",
                response_time=response_time,
                last_check=datetime.now(),
                details={"memory_usage": "50MB"}  # Placeholder
            )
            
            self._update_health_check(health_check)
            
        except Exception as e:
            health_check = HealthCheck(
                service="redis",
                status="unhealthy",
                response_time=0,
                last_check=datetime.now(),
                details={"error": str(e)}
            )
            self._update_health_check(health_check)
    
    async def _check_external_services(self):
        """Check external services health"""
        services = [
            {"name": "payment_gateway", "url": "https://api.stripe.com/v1/health"},
            {"name": "email_service", "url": "https://api.sendgrid.com/v3/health"},
        ]
        
        for service in services:
            try:
                start_time = time.time()
                async with aiohttp.ClientSession() as session:
                    async with session.get(service["url"], timeout=5) as response:
                        response_time = (time.time() - start_time) * 1000  # ms
                        
                        health_check = HealthCheck(
                            service=service["name"],
                            status="healthy" if response.status == 200 else "unhealthy",
                            response_time=response_time,
                            last_check=datetime.now(),
                            details={"status_code": response.status}
                        )
                        
                        self._update_health_check(health_check)
                        
            except Exception as e:
                health_check = HealthCheck(
                    service=service["name"],
                    status="unhealthy",
                    response_time=0,
                    last_check=datetime.now(),
                    details={"error": str(e)}
                )
                self._update_health_check(health_check)
    
    def _update_health_check(self, health_check: HealthCheck):
        """Update health check in list"""
        # Remove existing check for same service
        self.health_checks = [hc for hc in self.health_checks if hc.service != health_check.service]
        # Add new check
        self.health_checks.append(health_check)
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get overall health status"""
        if not self.health_checks:
            return {"status": "unknown", "services": []}
        
        healthy_services = sum(1 for hc in self.health_checks if hc.status == "healthy")
        total_services = len(self.health_checks)
        
        if healthy_services == total_services:
            overall_status = "healthy"
        elif healthy_services > total_services // 2:
            overall_status = "degraded"
        else:
            overall_status = "unhealthy"
        
        return {
            "status": overall_status,
            "healthy_services": healthy_services,
            "total_services": total_services,
            "services": [asdict(hc) for hc in self.health_checks]
        }

class NotificationService:
    """Notification service for alerts"""
    
    def __init__(self):
        self.webhook_urls: List[str] = []
        self.email_recipients: List[str] = []
        self.slack_webhook: Optional[str] = None
    
    def add_webhook(self, url: str):
        """Add webhook URL for notifications"""
        self.webhook_urls.append(url)
    
    def add_email_recipient(self, email: str):
        """Add email recipient for notifications"""
        self.email_recipients.append(email)
    
    def set_slack_webhook(self, webhook_url: str):
        """Set Slack webhook for notifications"""
        self.slack_webhook = webhook_url
    
    async def send_alert_notification(self, alert: Alert):
        """Send alert notification through all configured channels"""
        notification_data = {
            "alert_id": alert.id,
            "title": alert.title,
            "description": alert.description,
            "severity": alert.severity.value,
            "service": alert.service,
            "metric": alert.metric_name,
            "current_value": alert.current_value,
            "threshold": alert.threshold_value,
            "timestamp": alert.created_at.isoformat()
        }
        
        # Send webhook notifications
        for webhook_url in self.webhook_urls:
            await self._send_webhook_notification(webhook_url, notification_data)
        
        # Send Slack notification
        if self.slack_webhook:
            await self._send_slack_notification(notification_data)
        
        # Send email notifications
        for email in self.email_recipients:
            await self._send_email_notification(email, notification_data)
    
    async def _send_webhook_notification(self, webhook_url: str, data: Dict[str, Any]):
        """Send webhook notification"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(webhook_url, json=data, timeout=10) as response:
                    if response.status == 200:
                        logger.info(f"Webhook notification sent to {webhook_url}")
                    else:
                        logger.error(f"Webhook notification failed: {response.status}")
        except Exception as e:
            logger.error(f"Webhook notification error: {e}")
    
    async def _send_slack_notification(self, data: Dict[str, Any]):
        """Send Slack notification"""
        try:
            severity_emoji = {
                "low": "🟡",
                "medium": "🟠", 
                "high": "🔴",
                "critical": "🚨"
            }
            
            emoji = severity_emoji.get(data["severity"], "⚠️")
            
            slack_message = {
                "text": f"{emoji} Alert: {data['title']}",
                "attachments": [
                    {
                        "color": "danger" if data["severity"] in ["high", "critical"] else "warning",
                        "fields": [
                            {"title": "Service", "value": data["service"], "short": True},
                            {"title": "Metric", "value": data["metric"], "short": True},
                            {"title": "Current Value", "value": str(data["current_value"]), "short": True},
                            {"title": "Threshold", "value": str(data["threshold"]), "short": True},
                            {"title": "Description", "value": data["description"], "short": False}
                        ]
                    }
                ]
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(self.slack_webhook, json=slack_message, timeout=10) as response:
                    if response.status == 200:
                        logger.info("Slack notification sent")
                    else:
                        logger.error(f"Slack notification failed: {response.status}")
        except Exception as e:
            logger.error(f"Slack notification error: {e}")
    
    async def _send_email_notification(self, email: str, data: Dict[str, Any]):
        """Send email notification"""
        # This would integrate with your email service (SendGrid, etc.)
        logger.info(f"Email notification would be sent to {email} for alert {data['alert_id']}")

class MonitoringDashboard:
    """Monitoring dashboard data provider"""
    
    def __init__(self, metrics_collector: MetricsCollector, 
                 alert_manager: AlertManager,
                 health_checker: HealthChecker):
        self.metrics_collector = metrics_collector
        self.alert_manager = alert_manager
        self.health_checker = health_checker
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get comprehensive dashboard data"""
        return {
            "timestamp": datetime.now().isoformat(),
            "health": self.health_checker.get_health_status(),
            "alerts": {
                "active": len(self.alert_manager.get_active_alerts()),
                "critical": len(self.alert_manager.get_alerts_by_severity(AlertSeverity.CRITICAL)),
                "high": len(self.alert_manager.get_alerts_by_severity(AlertSeverity.HIGH)),
                "medium": len(self.alert_manager.get_alerts_by_severity(AlertSeverity.MEDIUM)),
                "low": len(self.alert_manager.get_alerts_by_severity(AlertSeverity.LOW))
            },
            "metrics": {
                "cpu": self.metrics_collector.get_latest_metric("cpu_usage"),
                "memory": self.metrics_collector.get_latest_metric("memory_usage"),
                "disk": self.metrics_collector.get_latest_metric("disk_usage")
            },
            "recent_alerts": [
                {
                    "id": alert.id,
                    "title": alert.title,
                    "severity": alert.severity.value,
                    "service": alert.service,
                    "created_at": alert.created_at.isoformat()
                }
                for alert in self.alert_manager.alerts[-10:]  # Last 10 alerts
            ]
        }

# Global monitoring instances
metrics_collector = MetricsCollector()
alert_manager = AlertManager()
health_checker = HealthChecker()
notification_service = NotificationService()

# Initialize default alert rules
def initialize_default_alert_rules():
    """Initialize default alert rules"""
    alert_manager.add_alert_rule("high_cpu", {
        "metric": "cpu_usage",
        "threshold": 80,
        "operator": ">",
        "severity": "high",
        "title": "High CPU Usage",
        "description": "CPU usage is above 80%",
        "service": "system"
    })
    
    alert_manager.add_alert_rule("high_memory", {
        "metric": "memory_usage",
        "threshold": 85,
        "operator": ">",
        "severity": "high",
        "title": "High Memory Usage",
        "description": "Memory usage is above 85%",
        "service": "system"
    })
    
    alert_manager.add_alert_rule("low_disk_space", {
        "metric": "disk_usage",
        "threshold": 90,
        "operator": ">",
        "severity": "critical",
        "title": "Low Disk Space",
        "description": "Disk usage is above 90%",
        "service": "system"
    })

# Initialize default alert rules
initialize_default_alert_rules()

# Add notification service to alert manager
alert_manager.add_notification_handler(notification_service.send_alert_notification)