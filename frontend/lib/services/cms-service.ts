/**
 * Content Management System Service for Buffr Host Hospitality Platform
 * @fileoverview Comprehensive CMS for managing website content, media assets, pages, and navigation
 * @location buffr-host/frontend/lib/services/cms-service.ts
 * @purpose Manages complete content lifecycle from creation to publication with multi-tenant support
 * @modularity Centralized CMS service supporting content types, media management, and page composition
 * @database_connections Reads/writes to `cms_content`, `cms_media`, `cms_pages`, `cms_navigation`, `content_versions` tables
 * @api_integration RESTful API endpoints for content operations with authentication and authorization
 * @scalability Content delivery with CDN integration and caching strategies
 * @performance Optimized content queries with search indexing and real-time updates
 * @monitoring Content analytics, user engagement tracking, and performance metrics
 *
 * CMS Capabilities:
 * - Rich content creation and editing with WYSIWYG editor
 * - Media asset management with automatic optimization
 * - Page composition with drag-and-drop interface
 * - Navigation management with dynamic menu generation
 * - Multi-language content support
 * - Content versioning and approval workflows
 * - SEO optimization and meta tag management
 * - Content scheduling and publication automation
 *
 * Key Features:
 * - Content authoring and collaborative editing
 * - Media library with automatic resizing and optimization
 * - Page builder with component-based architecture
 * - Navigation management with menu hierarchies
 * - Content workflow and approval processes
 * - Multi-tenant content isolation
 * - SEO and performance optimization
 * - Analytics and reporting dashboard
 */

import {
  ContentCreate,
  ContentUpdate,
  ContentResponse,
  ContentSearch,
  MediaCreate,
  MediaUpdate,
  MediaResponse,
  MediaSearch,
  PageCreate,
  PageUpdate,
  PageResponse,
  PageSearch,
  NavigationCreate,
  NavigationUpdate,
  NavigationResponse,
  NavigationSearch,
  ContentStats,
  MediaStats,
} from '@/lib/types/cms';

/**
 * Standardized response format for all CMS service operations
 * @interface CMSServiceResponse
 * @template T - The type of data returned on success
 * @property {boolean} success - Whether the operation completed successfully
 * @property {T} [data] - Response data when operation succeeds
 * @property {string} [error] - Error message when operation fails
 * @property {string} [message] - Additional informational message
 */
export interface CMSServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Response format for file upload operations
 * @interface FileUploadResponse
 * @property {string} file_id - Unique identifier for the uploaded file
 * @property {string} file_path - Storage path of the uploaded file
 * @property {number} file_size - Size of the file in bytes
 * @property {string} mime_type - MIME type of the uploaded file
 * @property {string} url - Public URL for accessing the file
 */
export interface FileUploadResponse {
  file_id: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  url: string;
}

/**
 * Response format for bulk operations
 * @interface BulkOperationResponse
 * @property {number} success_count - Number of successful operations
 * @property {number} error_count - Number of failed operations
 * @property {string[]} errors - Array of error messages for failed operations
 */
export interface BulkOperationResponse {
  success_count: number;
  error_count: number;
  errors: string[];
}

/**
 * Production-ready Content Management System service with comprehensive content operations
 * @class CMSService
 * @purpose Orchestrates all content management operations with multi-tenant support and media handling
 * @modularity Centralized CMS client with content, media, page, and navigation management capabilities
 * @api_integration RESTful API endpoints for content operations with file upload support
 * @database_operations Type-safe PostgreSQL operations with content versioning and audit trails
 * @multi_tenant Automatic tenant isolation for content and media assets
 * @caching Content caching with invalidation strategies for real-time updates
 * @monitoring Content performance analytics, user engagement, and publishing metrics
 * @security Role-based content access control and audit trail logging
 */
export class CMSService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env['NEXT_PUBLIC_API_URL'] || '/api/cms';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<CMSServiceResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Content Management
  async createContent(
    content: ContentCreate
  ): Promise<CMSServiceResponse<ContentResponse>> {
    return this.request<ContentResponse>('/content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async getContent(
    contentId: number
  ): Promise<CMSServiceResponse<ContentResponse>> {
    return this.request<ContentResponse>(`/content/${contentId}`);
  }

  async updateContent(
    contentId: number,
    content: ContentUpdate
  ): Promise<CMSServiceResponse<ContentResponse>> {
    return this.request<ContentResponse>(`/content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  async deleteContent(contentId: number): Promise<CMSServiceResponse<void>> {
    return this.request<void>(`/content/${contentId}`, {
      method: 'DELETE',
    });
  }

  async searchContent(
    search: ContentSearch
  ): Promise<CMSServiceResponse<ContentResponse[]>> {
    const params = new URLSearchParams();
    Object.entries(search).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params['append'](key, value.join(','));
        } else {
          params['append'](key, value.toString());
        }
      }
    });

    return this.request<ContentResponse[]>(
      `/content/search?${params['toString']()}`
    );
  }

  async getContentStats(
    propertyId?: number
  ): Promise<CMSServiceResponse<ContentStats>> {
    const params = propertyId ? `?property_id=${propertyId}` : '';
    return this.request<ContentStats>(`/content/stats${params}`);
  }

  // Media Management
  async uploadMedia(
    file: File,
    media: MediaCreate
  ): Promise<CMSServiceResponse<MediaResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify(media));

    return this.request<MediaResponse>('/media/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getMedia(mediaId: number): Promise<CMSServiceResponse<MediaResponse>> {
    return this.request<MediaResponse>(`/media/${mediaId}`);
  }

  async updateMedia(
    mediaId: number,
    media: MediaUpdate
  ): Promise<CMSServiceResponse<MediaResponse>> {
    return this.request<MediaResponse>(`/media/${mediaId}`, {
      method: 'PUT',
      body: JSON.stringify(media),
    });
  }

  async deleteMedia(mediaId: number): Promise<CMSServiceResponse<void>> {
    return this.request<void>(`/media/${mediaId}`, {
      method: 'DELETE',
    });
  }

  async searchMedia(
    search: MediaSearch
  ): Promise<CMSServiceResponse<MediaResponse[]>> {
    const params = new URLSearchParams();
    Object.entries(search).forEach(([key, value]) => {
      if (value !== undefined) {
        params['append'](key, value.toString());
      }
    });

    return this.request<MediaResponse[]>(
      `/media/search?${params['toString']()}`
    );
  }

  async getMediaStats(
    propertyId?: number
  ): Promise<CMSServiceResponse<MediaStats>> {
    const params = propertyId ? `?property_id=${propertyId}` : '';
    return this.request<MediaStats>(`/media/stats${params}`);
  }

  // Page Management
  async createPage(
    page: PageCreate
  ): Promise<CMSServiceResponse<PageResponse>> {
    return this.request<PageResponse>('/pages', {
      method: 'POST',
      body: JSON.stringify(page),
    });
  }

  async getPage(pageId: number): Promise<CMSServiceResponse<PageResponse>> {
    return this.request<PageResponse>(`/pages/${pageId}`);
  }

  async updatePage(
    pageId: number,
    page: PageUpdate
  ): Promise<CMSServiceResponse<PageResponse>> {
    return this.request<PageResponse>(`/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(page),
    });
  }

  async deletePage(pageId: number): Promise<CMSServiceResponse<void>> {
    return this.request<void>(`/pages/${pageId}`, {
      method: 'DELETE',
    });
  }

  async searchPages(
    search: PageSearch
  ): Promise<CMSServiceResponse<PageResponse[]>> {
    const params = new URLSearchParams();
    Object.entries(search).forEach(([key, value]) => {
      if (value !== undefined) {
        params['append'](key, value.toString());
      }
    });

    return this.request<PageResponse[]>(
      `/pages/search?${params['toString']()}`
    );
  }

  async publishPage(pageId: number): Promise<CMSServiceResponse<PageResponse>> {
    return this.request<PageResponse>(`/pages/${pageId}/publish`, {
      method: 'POST',
    });
  }

  async unpublishPage(
    pageId: number
  ): Promise<CMSServiceResponse<PageResponse>> {
    return this.request<PageResponse>(`/pages/${pageId}/unpublish`, {
      method: 'POST',
    });
  }

  // Navigation Management
  async createNavigation(
    navigation: NavigationCreate
  ): Promise<CMSServiceResponse<NavigationResponse>> {
    return this.request<NavigationResponse>('/navigation', {
      method: 'POST',
      body: JSON.stringify(navigation),
    });
  }

  async getNavigation(
    navigationId: number
  ): Promise<CMSServiceResponse<NavigationResponse>> {
    return this.request<NavigationResponse>(`/navigation/${navigationId}`);
  }

  async updateNavigation(
    navigationId: number,
    navigation: NavigationUpdate
  ): Promise<CMSServiceResponse<NavigationResponse>> {
    return this.request<NavigationResponse>(`/navigation/${navigationId}`, {
      method: 'PUT',
      body: JSON.stringify(navigation),
    });
  }

  async deleteNavigation(
    navigationId: number
  ): Promise<CMSServiceResponse<void>> {
    return this.request<void>(`/navigation/${navigationId}`, {
      method: 'DELETE',
    });
  }

  async searchNavigation(
    search: NavigationSearch
  ): Promise<CMSServiceResponse<NavigationResponse[]>> {
    const params = new URLSearchParams();
    Object.entries(search).forEach(([key, value]) => {
      if (value !== undefined) {
        params['append'](key, value.toString());
      }
    });

    return this.request<NavigationResponse[]>(
      `/navigation/search?${params['toString']()}`
    );
  }

  async getNavigationTree(
    propertyId: number
  ): Promise<CMSServiceResponse<NavigationResponse[]>> {
    return this.request<NavigationResponse[]>(
      `/navigation/tree?property_id=${propertyId}`
    );
  }

  // Bulk Operations
  async bulkUpdateContent(
    contentIds: number[],
    updates: ContentUpdate
  ): Promise<CMSServiceResponse<BulkOperationResponse>> {
    return this.request<BulkOperationResponse>('/content/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ content_ids: contentIds, updates }),
    });
  }

  async bulkDeleteContent(
    contentIds: number[]
  ): Promise<CMSServiceResponse<BulkOperationResponse>> {
    return this.request<BulkOperationResponse>('/content/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ content_ids: contentIds }),
    });
  }

  async bulkUploadMedia(
    files: File[],
    propertyId: number
  ): Promise<CMSServiceResponse<MediaResponse[]>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    formData.append('property_id', propertyId.toString());

    return this.request<MediaResponse[]>('/media/bulk-upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // Export/Import
  async exportContent(
    propertyId?: number,
    format: string = 'json'
  ): Promise<CMSServiceResponse<Blob>> {
    const params = new URLSearchParams();
    if (propertyId) params['append']('property_id', propertyId.toString());
    params['append']('format', format);

    const response = await fetch(
      `${this.baseUrl}/content/export?${params['toString']()}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: 'Export failed',
      };
    }

    const blob = await response.blob();
    return {
      success: true,
      data: blob,
    };
  }

  async importContent(
    file: File,
    propertyId: number
  ): Promise<CMSServiceResponse<BulkOperationResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('property_id', propertyId.toString());

    return this.request<BulkOperationResponse>('/content/import', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // Templates
  async getContentTemplates(
    propertyId?: number
  ): Promise<CMSServiceResponse<unknown[]>> {
    const params = propertyId ? `?property_id=${propertyId}` : '';
    return this.request<unknown[]>(`/templates${params}`);
  }

  async createContentTemplate(
    template: unknown
  ): Promise<CMSServiceResponse<unknown>> {
    return this.request<unknown>('/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    });
  }

  async applyContentTemplate(
    contentId: number,
    templateId: number
  ): Promise<CMSServiceResponse<ContentResponse>> {
    return this.request<ContentResponse>(
      `/content/${contentId}/apply-template`,
      {
        method: 'POST',
        body: JSON.stringify({ template_id: templateId }),
      }
    );
  }

  // Workflow
  async getContentWorkflow(
    contentId: number
  ): Promise<CMSServiceResponse<unknown>> {
    return this.request<unknown>(`/content/${contentId}/workflow`);
  }

  async updateContentWorkflow(
    contentId: number,
    workflow: unknown
  ): Promise<CMSServiceResponse<unknown>> {
    return this.request<unknown>(`/content/${contentId}/workflow`, {
      method: 'PUT',
      body: JSON.stringify(workflow),
    });
  }

  async approveContent(
    contentId: number,
    comments?: string
  ): Promise<CMSServiceResponse<ContentResponse>> {
    return this.request<ContentResponse>(`/content/${contentId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comments }),
    });
  }

  async rejectContent(
    contentId: number,
    comments: string
  ): Promise<CMSServiceResponse<ContentResponse>> {
    return this.request<ContentResponse>(`/content/${contentId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ comments }),
    });
  }

  // Analytics
  async getContentAnalytics(
    propertyId?: number,
    period?: string
  ): Promise<CMSServiceResponse<unknown>> {
    const params = new URLSearchParams();
    if (propertyId) params['append']('property_id', propertyId.toString());
    if (period) params['append']('period', period);

    return this.request<unknown>(`/analytics/content?${params['toString']()}`);
  }

  async getMediaAnalytics(
    propertyId?: number,
    period?: string
  ): Promise<CMSServiceResponse<unknown>> {
    const params = new URLSearchParams();
    if (propertyId) params['append']('property_id', propertyId.toString());
    if (period) params['append']('period', period);

    return this.request<unknown>(`/analytics/media?${params['toString']()}`);
  }

  // Utility Methods
  async generateSlug(title: string): Promise<CMSServiceResponse<string>> {
    return this.request<string>('/utils/generate-slug', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async validateContent(
    content: ContentCreate
  ): Promise<CMSServiceResponse<boolean>> {
    return this.request<boolean>('/utils/validate-content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  }

  async getContentPreview(
    contentId: number
  ): Promise<CMSServiceResponse<string>> {
    return this.request<string>(`/content/${contentId}/preview`);
  }
}

// Export singleton instance
export const cmsService = new CMSService();
export default cmsService;
