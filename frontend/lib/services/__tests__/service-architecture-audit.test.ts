/**
 * TypeScript Service Architecture Comprehensive Audit
 * Tests for EmailService, CMSService, BIService, RBACService, and TenantIsolationService
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { EmailService } from '../email-service';
import { CMSService } from '../cms-service';
import { BIService } from '../bi-service';
import { RBACService } from '../rbac-service';
import { TenantIsolationService } from '../tenant-isolation';
import { SecurityLevel, TenantContext } from '@/lib/types/ids';
import { Permission, UserRole } from '@/lib/types/rbac';

// Mock fetch globally
global.fetch = jest.fn();

describe('TypeScript Service Architecture Audit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    process.env.SENDGRID_API_KEY = 'test-sendgrid-key';
    process.env.FROM_EMAIL = 'test@buffr.ai';
    process.env.NEXT_PUBLIC_APP_URL = 'https://test.buffr.ai';
    process.env.BACKEND_API_URL = 'http://localhost:8000';
  });

  describe('EmailService - SendGrid Integration and Python Fallback', () => {
    let emailService: EmailService;

    beforeEach(() => {
      emailService = new EmailService();
    });

    it('should initialize with proper configuration', () => {
      const status = emailService.getStatus();

      expect(status.sendgridConfigured).toBe(true);
      expect(status.backendConfigured).toBe(true);
      expect(status.fromEmail).toBe('test@buffr.ai');
      expect(status.supportEmail).toBe('support@mail.buffr.ai');
    });

    it('should handle missing SendGrid API key gracefully', () => {
      delete process.env.SENDGRID_API_KEY;
      const emailServiceNoKey = new EmailService();
      const status = emailServiceNoKey.getStatus();

      expect(status.sendgridConfigured).toBe(false);
    });

    it('should send waitlist confirmation via SendGrid', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('test-message-id'),
        },
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const waitlistRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        businessName: 'Test Hotel',
        businessType: 'hotel',
        location: 'New York',
      };

      const result =
        await emailService.sendWaitlistConfirmation(waitlistRequest);

      expect(result.success).toBe(true);
      expect(result.provider).toBe('sendgrid');
      expect(result.messageId).toBe('test-message-id');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-sendgrid-key',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should fallback to Python backend when SendGrid fails', async () => {
      // Mock SendGrid failure
      const sendgridResponse = {
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue('SendGrid error'),
      };

      // Mock backend success
      const backendResponse = {
        ok: true,
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(sendgridResponse)
        .mockResolvedValueOnce(backendResponse);

      const waitlistRequest = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result =
        await emailService.sendWaitlistConfirmation(waitlistRequest);

      expect(result.success).toBe(true);
      expect(result.provider).toBe('fallback');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should test configuration endpoints', async () => {
      const sendgridResponse = { ok: true };
      const backendResponse = { ok: true };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(sendgridResponse)
        .mockResolvedValueOnce(backendResponse);

      const result = await emailService.testConfiguration();

      expect(result.sendgrid).toBe(true);
      expect(result.backend).toBe(true);
    });
  });

  describe('CMSService - Content Management, Media Handling, and Workflow Operations', () => {
    let cmsService: CMSService;

    beforeEach(() => {
      cmsService = new CMSService();
    });

    it('should create content successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            id: 1,
            title: 'Test Content',
            content_type: 'image',
            property_id: 1,
          },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const contentData = {
        title: 'Test Content',
        content_type: 'image' as const,
        property_id: 1,
      };

      const result = await cmsService.createContent(contentData);

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe('Test Content');
    });

    it('should handle media upload with proper FormData', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            id: 1,
            filename: 'test.jpg',
            file_path: '/uploads/test.jpg',
          },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mediaData = {
        filename: 'test.jpg',
        property_id: 1,
        alt_text: 'Test image',
      };

      const result = await cmsService.uploadMedia(file, mediaData);

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/media/upload'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('should search content with proper query parameters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: [
            { id: 1, title: 'Content 1' },
            { id: 2, title: 'Content 2' },
          ],
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const searchParams = {
        query: 'test',
        content_type: 'image' as const,
        property_id: 1,
        limit: 10,
      };

      const result = await cmsService.searchContent(searchParams);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should handle workflow operations', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            id: 1,
            status: 'approved',
          },
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await cmsService.approveContent(1, 'Looks good');

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/content/1/approve'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ comments: 'Looks good' }),
        })
      );
    });
  });

  describe('BIService - ML Metrics, Predictions, and Data Quality Monitoring', () => {
    let biService: BIService;

    beforeEach(() => {
      biService = new BIService();
    });

    it('should fetch credit scoring metrics', async () => {
      const mockMetrics = {
        accuracy: 0.95,
        precision: 0.92,
        recall: 0.88,
        f1Score: 0.9,
        auc: 0.94,
        lastUpdated: '2024-01-01T00:00:00Z',
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockMetrics }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await biService.getCreditScoringMetrics();

      expect(result.accuracy).toBe(0.95);
      expect(result.precision).toBe(0.92);
    });

    it('should fetch prediction data with proper format', async () => {
      const mockPredictions = [
        {
          date: '2024-01-01',
          actual: 100,
          predicted: 95,
          confidence: 0.85,
        },
        {
          date: '2024-01-02',
          actual: 110,
          predicted: 108,
          confidence: 0.9,
        },
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockPredictions }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await biService.getCreditScoringPredictions(30);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('actual');
      expect(result[0]).toHaveProperty('predicted');
      expect(result[0]).toHaveProperty('confidence');
    });

    it('should handle data quality metrics', async () => {
      const mockDataQuality = {
        completeness: 0.98,
        accuracy: 0.95,
        consistency: 0.92,
        validity: 0.96,
        uniqueness: 0.99,
        timeliness: 0.94,
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockDataQuality }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await biService.getDataQualityMetrics();

      expect(result.completeness).toBe(0.98);
      expect(result.accuracy).toBe(0.95);
      expect(result.consistency).toBe(0.92);
    });

    it('should export data in different formats', async () => {
      const mockBlob = new Blob(['test data'], { type: 'text/csv' });
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        blob: jest.fn().mockResolvedValue(mockBlob),
      });

      const result = await biService.exportData('credit-scoring', 'csv');

      expect(result).toBeInstanceOf(Blob);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/bi/credit-scoring/export?format=csv')
      );
    });
  });

  describe('RBACService - Role-based Permissions with Tenant Isolation', () => {
    let rbacService: RBACService;

    beforeEach(() => {
      rbacService = new RBACService();
    });

    it('should check user permissions correctly', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: true,
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await rbacService.checkPermission(
        'user-123',
        Permission.BOOKINGS_READ,
        'resource-456'
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/user/user-123/check-permission'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            permission: Permission.BOOKINGS_READ,
            resource_id: 'resource-456',
          }),
        })
      );
    });

    it('should grant permissions with proper request structure', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const grantRequest = {
        user_id: 'user-123',
        permission: Permission.BOOKINGS_WRITE,
        resource_id: 'property-456',
        expires_at: new Date('2024-12-31'),
      };

      const result = await rbacService.grantPermission(grantRequest);

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/permissions/grant'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(grantRequest),
        })
      );
    });

    it('should handle role assignments', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const roleRequest = {
        user_id: 'user-123',
        role: UserRole.MANAGER,
        assigned_by: 'admin-456',
      };

      const result = await rbacService.assignRole(roleRequest);

      expect(result.success).toBe(true);
    });

    it('should fetch user context with all permissions', async () => {
      const mockContext = {
        user_id: 'user-123',
        role: UserRole.MANAGER,
        permissions: [Permission.BOOKINGS_READ, Permission.BOOKINGS_WRITE],
        tenant_id: 'tenant-456',
        property_id: 'property-789',
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: mockContext }),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await rbacService.getUserContext('user-123');

      expect(result.success).toBe(true);
      expect(result.data?.user_id).toBe('user-123');
      expect(result.data?.role).toBe(UserRole.MANAGER);
      expect(Array.isArray(result.data?.permissions)).toBe(true);
    });

    it('should handle bulk permission operations', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const permissions = [
        Permission.BOOKINGS_READ,
        Permission.BOOKINGS_WRITE,
        Permission.CUSTOMERS_READ,
      ];

      const result = await rbacService.bulkGrantPermissions(
        'user-123',
        permissions,
        'property-456'
      );

      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/permissions/bulk-grant'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            user_id: 'user-123',
            permissions,
            resource_id: 'property-456',
          }),
        })
      );
    });
  });

  describe('TenantIsolationService - Complete Data Separation Between Tenants', () => {
    let tenantIsolation: TenantIsolationService;
    let mockTenantContext: TenantContext;

    beforeEach(() => {
      tenantIsolation = TenantIsolationService.getInstance();
      mockTenantContext = {
        tenantId: 'tenant-123',
        tenantType: 'hotel',
        userId: 'user-456',
        role: 'manager',
        permissions: ['bookings:read', 'bookings:write'],
      };
    });

    it('should be a singleton instance', () => {
      const instance1 = TenantIsolationService.getInstance();
      const instance2 = TenantIsolationService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should build proper query filters for tenant level security', () => {
      const filter = tenantIsolation.buildQueryFilter(
        mockTenantContext,
        SecurityLevel.TENANT
      );

      expect(filter).toEqual({
        tenant_id: 'tenant-123',
      });
    });

    it('should build proper query filters for business level security', () => {
      const businessContext = {
        ...mockTenantContext,
        businessId: 'business-789',
        businessGroupId: 'group-101',
      };

      const filter = tenantIsolation.buildQueryFilter(
        businessContext,
        SecurityLevel.BUSINESS
      );

      expect(filter).toEqual({
        business_id: 'business-789',
        tenant_id: 'tenant-123',
      });
    });

    it('should build proper query filters for user level security', () => {
      const filter = tenantIsolation.buildQueryFilter(
        mockTenantContext,
        SecurityLevel.USER
      );

      expect(filter).toEqual({
        user_id: 'user-456',
        tenant_id: 'tenant-123',
      });
    });

    it('should allow public access with no filtering', () => {
      const filter = tenantIsolation.buildQueryFilter(
        mockTenantContext,
        SecurityLevel.PUBLIC
      );

      expect(filter).toEqual({});
    });

    it('should validate resource access correctly', () => {
      // Same tenant access should be allowed
      const canAccess = tenantIsolation.canAccessResource(
        mockTenantContext,
        'tenant-123',
        'business-789',
        'user-456'
      );

      expect(canAccess).toBe(true);

      // Different tenant access should be denied
      const cannotAccess = tenantIsolation.canAccessResource(
        mockTenantContext,
        'tenant-999',
        'business-789',
        'user-456'
      );

      expect(cannotAccess).toBe(false);
    });

    it('should allow platform admin access to all resources', () => {
      const platformAdminContext = {
        ...mockTenantContext,
        role: 'platform_admin' as const,
      };

      const canAccess = tenantIsolation.canAccessResource(
        platformAdminContext,
        'different-tenant-999'
      );

      expect(canAccess).toBe(true);
    });

    it('should create secure queries with audit logging', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const secureQuery = tenantIsolation.createSecureQuery(
        mockTenantContext,
        'bookings',
        { status: 'confirmed' },
        SecurityLevel.TENANT
      );

      expect(secureQuery.table).toBe('bookings');
      expect(secureQuery.filters).toEqual({
        tenant_id: 'tenant-123',
        status: 'confirmed',
      });
      expect(secureQuery.audit.queriedBy).toBe('user-456');
      expect(secureQuery.audit.tenantId).toBe('tenant-123');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[TENANT_ISOLATION]'),
        expect.any(Object)
      );

      consoleSpy.mockRestore();
    });

    it('should validate cross-tenant relationships correctly', () => {
      // Guest accessing their own cross-tenant booking
      const guestContext = {
        ...mockTenantContext,
        role: 'guest' as const,
      };

      const canAccessOwnBooking = tenantIsolation.validateCrossTenantAccess(
        guestContext,
        { tenantId: 'different-tenant', userId: 'user-456' },
        'booking'
      );

      expect(canAccessOwnBooking).toBe(true);

      // Guest trying to access someone else's booking
      const cannotAccessOtherBooking =
        tenantIsolation.validateCrossTenantAccess(
          guestContext,
          { tenantId: 'different-tenant', userId: 'other-user' },
          'booking'
        );

      expect(cannotAccessOtherBooking).toBe(false);
    });

    it('should throw error for invalid security level contexts', () => {
      expect(() => {
        tenantIsolation.buildQueryFilter(
          mockTenantContext,
          SecurityLevel.BUSINESS
        );
      }).toThrow('Business context required for BUSINESS security level');

      expect(() => {
        tenantIsolation.buildQueryFilter(
          mockTenantContext,
          SecurityLevel.DEPARTMENT
        );
      }).toThrow('Department context required for DEPARTMENT security level');
    });
  });

  describe('Service Integration and Error Handling', () => {
    it('should handle network errors gracefully across all services', async () => {
      const networkError = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValue(networkError);

      const emailService = new EmailService();
      const cmsService = new CMSService();
      const rbacService = new RBACService();

      // Test EmailService error handling
      const emailResult = await emailService.sendWaitlistConfirmation({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
      expect(emailResult.success).toBe(false);
      expect(emailResult.error).toContain('Network error');

      // Test CMSService error handling
      const cmsResult = await cmsService.getContent(1);
      expect(cmsResult.success).toBe(false);
      expect(cmsResult.error).toBe('Network error');

      // Test RBACService error handling
      const rbacResult = await rbacService.checkPermission(
        'user-123',
        Permission.BOOKINGS_READ
      );
      expect(rbacResult.success).toBe(false);
      expect(rbacResult.error).toBe('Network error');
    });

    it('should handle API error responses properly', async () => {
      const errorResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: 'Unauthorized access',
        }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(errorResponse);

      const rbacService = new RBACService();
      const result = await rbacService.checkPermission(
        'user-123',
        Permission.BOOKINGS_READ
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized access');
    });

    it('should validate TypeScript type safety across services', () => {
      // This test ensures that TypeScript types are properly enforced
      const tenantContext: TenantContext = {
        tenantId: 'tenant-123',
        tenantType: 'hotel',
        userId: 'user-456',
        role: 'manager',
        permissions: ['bookings:read'],
      };

      // Should compile without errors
      expect(tenantContext.tenantId).toBe('tenant-123');
      expect(tenantContext.tenantType).toBe('hotel');
      expect(tenantContext.role).toBe('manager');

      // Permission enum should be properly typed
      const permission: Permission = Permission.BOOKINGS_READ;
      expect(permission).toBe('bookings:read');

      // UserRole enum should be properly typed
      const role: UserRole = UserRole.MANAGER;
      expect(role).toBe('manager');
    });
  });
});
