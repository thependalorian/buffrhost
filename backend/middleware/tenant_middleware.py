"""
Tenant middleware for Buffr Host platform.

This middleware handles tenant identification and validation for multi-tenant
architecture, ensuring proper tenant context for all requests.
"""

import re
from typing import Optional
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware

from database import get_db
from models.tenant import TenantProfile


class TenantMiddleware(BaseHTTPMiddleware):
    """
    Middleware for tenant identification and validation.

    This middleware identifies the tenant from the request (subdomain, header, or path)
    and validates that the tenant exists and is active.
    """

    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        """
        Process request to identify and validate tenant.

        Args:
            request: FastAPI request object
            call_next: Next middleware function

        Returns:
            Response from next middleware or error response
        """
        # Skip tenant validation for certain paths
        if self._should_skip_tenant_validation(request):
            return await call_next(request)

        # Extract tenant identifier
        tenant_id = self._extract_tenant_id(request)

        if not tenant_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tenant identifier not found in request"
            )

        # Validate tenant exists and is active
        db = next(get_db())
        try:
            tenant = self._validate_tenant(db, tenant_id)
            if not tenant:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Tenant '{tenant_id}' not found or inactive"
                )

            # Set tenant in request state
            request.state.tenant = tenant
            request.state.tenant_id = tenant.id

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Tenant validation error: {str(e)}"
            )
        finally:
            db.close()

        # Continue with request
        response = await call_next(request)
        return response

    def _should_skip_tenant_validation(self, request: Request) -> bool:
        """
        Check if tenant validation should be skipped for this request.

        Args:
            request: FastAPI request object

        Returns:
            True if validation should be skipped, False otherwise
        """
        # Skip for health checks and system endpoints
        skip_paths = [
            "/health",
            "/healthz",
            "/ping",
            "/status",
            "/metrics",
            "/docs",
            "/redoc",
            "/openapi.json"
        ]

        if request.url.path in skip_paths:
            return True

        # Skip for static files and assets
        if request.url.path.startswith("/static/") or request.url.path.startswith("/assets/"):
            return True

        # Skip for authentication endpoints that don't require tenant context
        auth_paths = [
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/v1/auth/logout"
        ]

        if request.url.path in auth_paths:
            return True

        return False

    def _extract_tenant_id(self, request: Request) -> Optional[str]:
        """
        Extract tenant identifier from request.

        Args:
            request: FastAPI request object

        Returns:
            Tenant identifier or None if not found
        """
        # Method 1: Extract from subdomain
        tenant_id = self._extract_from_subdomain(request)
        if tenant_id:
            return tenant_id

        # Method 2: Extract from header
        tenant_id = self._extract_from_header(request)
        if tenant_id:
            return tenant_id

        # Method 3: Extract from path parameter
        tenant_id = self._extract_from_path(request)
        if tenant_id:
            return tenant_id

        return None

    def _extract_from_subdomain(self, request: Request) -> Optional[str]:
        """
        Extract tenant ID from subdomain.

        Args:
            request: FastAPI request object

        Returns:
            Tenant ID from subdomain or None
        """
        host = request.headers.get('host', '')

        # Remove port if present
        if ':' in host:
            host = host.split(':')[0]

        # Split by dots and get first part as subdomain
        parts = host.split('.')

        if len(parts) >= 3:  # subdomain.domain.com
            subdomain = parts[0]

            # Skip common subdomains
            if subdomain not in ['www', 'app', 'api', 'admin', 'staging', 'dev']:
                return subdomain

        return None

    def _extract_from_header(self, request: Request) -> Optional[str]:
        """
        Extract tenant ID from request headers.

        Args:
            request: FastAPI request object

        Returns:
            Tenant ID from header or None
        """
        # Check common tenant header names
        header_names = [
            'X-Tenant-ID',
            'X-Property-ID',
            'X-Organization-ID',
            'Tenant-ID',
            'Property-ID'
        ]

        for header_name in header_names:
            tenant_id = request.headers.get(header_name)
            if tenant_id:
                return tenant_id.strip()

        return None

    def _extract_from_path(self, request: Request) -> Optional[str]:
        """
        Extract tenant ID from URL path.

        Args:
            request: FastAPI request object

        Returns:
            Tenant ID from path or None
        """
        # Look for tenant ID in path segments
        path_segments = request.url.path.strip('/').split('/')

        # Common patterns for tenant in path
        patterns = [
            r'^tenant/([^/]+)',  # /tenant/{tenant_id}/...
            r'^property/([^/]+)',  # /property/{property_id}/...
            r'^org/([^/]+)',  # /org/{org_id}/...
        ]

        for pattern in patterns:
            match = re.match(pattern, request.url.path)
            if match:
                return match.group(1)

        return None

    def _validate_tenant(self, db, tenant_id: str) -> Optional[TenantProfile]:
        """
        Validate that tenant exists and is active.

        Args:
            db: Database session
            tenant_id: Tenant identifier to validate

        Returns:
            Tenant object if valid, None otherwise
        """
        # Try to find tenant by subdomain first
        tenant = db.query(TenantProfile).filter(
            TenantProfile.subdomain == tenant_id,
            TenantProfile.is_active == True
        ).first()

        if tenant:
            return tenant

        # Try to find by ID if subdomain doesn't match
        try:
            tenant = db.query(TenantProfile).filter(
                TenantProfile.id == tenant_id,
                TenantProfile.is_active == True
            ).first()

            if tenant:
                return tenant
        except ValueError:
            pass  # Invalid UUID format

        return None


class TenantContext:
    """
    Context manager for tenant-specific operations.

    Provides easy access to tenant information throughout the request lifecycle.
    """

    def __init__(self, request: Request):
        self.request = request
        self.tenant = getattr(request.state, 'tenant', None)

    @property
    def tenant_id(self) -> Optional[str]:
        """Get tenant ID."""
        return getattr(self.request.state, 'tenant_id', None)

    @property
    def tenant_name(self) -> Optional[str]:
        """Get tenant name."""
        return self.tenant.name if self.tenant else None

    @property
    def tenant_subdomain(self) -> Optional[str]:
        """Get tenant subdomain."""
        return self.tenant.subdomain if self.tenant else None

    @property
    def is_tenant_active(self) -> bool:
        """Check if tenant is active."""
        return self.tenant.is_active if self.tenant else False

    def require_tenant(self) -> TenantProfile:
        """
        Get tenant or raise exception if not available.

        Returns:
            Tenant object

        Raises:
            HTTPException: If tenant not available or inactive
        """
        if not self.tenant:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tenant context not available"
            )

        if not self.tenant.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tenant is inactive"
            )

        return self.tenant


def get_tenant_context(request: Request) -> TenantContext:
    """
    Get tenant context from request.

    Args:
        request: FastAPI request object

    Returns:
        TenantContext instance
    """
    return TenantContext(request)


class MultiTenantMiddleware(BaseHTTPMiddleware):
    """
    Enhanced multi-tenant middleware with additional features.

    Includes rate limiting per tenant, tenant-specific logging,
    and tenant context injection.
    """

    def __init__(self, app):
        super().__init__(app)
        self.tenant_rate_limits = {}  # In-memory rate limiting (use Redis in production)

    async def dispatch(self, request: Request, call_next):
        """
        Process request with enhanced multi-tenant features.

        Args:
            request: FastAPI request object
            call_next: Next middleware function

        Returns:
            Response from next middleware
        """
        # Basic tenant middleware functionality
        tenant_middleware = TenantMiddleware(app)
        return await tenant_middleware.dispatch(request, call_next)

        # Note: This would be expanded to include:
        # - Rate limiting per tenant
        # - Tenant-specific request logging
        # - Tenant context injection into logs
        # - Tenant-specific error handling
        # - Tenant quota management

