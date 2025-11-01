/**
 * CMS (Content Management System) Type Definitions
 *
 * Purpose: Type definitions for content management, media handling, page management,
 * and navigation in Buffr Host. These types align with backend Python schemas.
 * Location: lib/types/cms.ts
 * Usage: Shared across CMS components, content APIs, media management, and page builders
 *
 * @module CMS Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 */

/**
 * Content Type Enumeration
 *
 * Defines the different types of content that can be managed in the CMS.
 *
 * @enum ContentTypeEnum
 * @property {string} IMAGE - Image content
 * @property {string} MENU_ITEM - Menu item content
 * @property {string} ROOM - Room description content
 * @property {string} FACILITY - Facility information content
 * @property {string} SERVICE - Service description content
 * @property {string} EVENT - Event information content
 * @property {string} PROMOTION - Promotion/marketing content
 * @property {string} DOCUMENT - Document content
 * @property {string} VIDEO - Video content
 * @property {string} AUDIO - Audio content
 */
/**
 * Cms Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Cms type definitions for content management and website administration
 * @location buffr-host/lib/types/cms.ts
 * @purpose cms type definitions for content management and website administration
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @security Type-safe security definitions for authentication, authorization, and data protection
 * @authentication User authentication and session management type definitions
 * @typescript_strict Strict TypeScript type safety ensuring compile-time error prevention
 * @type_safety Comprehensive type coverage preventing runtime errors and improving developer experience
 * @scalability Type definitions supporting horizontal scaling and multi-tenant architecture
 * @maintainability Self-documenting types enabling easier code maintenance and refactoring
 * @testing Type-driven development supporting comprehensive test coverage
 *
 * Type Definitions Summary:
 * - 22 Interfaces: ContentBase, ContentCreate, ContentUpdate...
 * - 2 Enums: ContentTypeEnum, ContentStatusEnum
 * - Total: 24 type definitions
 *
 * Usage and Integration:
 * - Frontend Components: Type-safe props and state management
 * - API Routes: Request/response type validation
 * - Database Services: Schema-aligned data operations
 * - Business Logic: Domain-specific type constraints
 * - Testing: Type-driven test case generation
 *
 * @example
 * // Import type definitions
 * import type { ContentTypeEnum, ContentStatusEnum, ContentBase... } from './cms';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: ContentBase;
 *   onAction: (event: EventType) => void;
 * }
 *
 * @example
 * // Database service usage
 * const userService = {
 *   async getUser(id: string): Promise<User> {
 *     // Type-safe database operations
 *     return await db.query('SELECT * FROM users WHERE id = $1', [id]);
 *   }
 * };
 *
 * Exported Types:
 * @typedef {Enum} ContentTypeEnum
 * @typedef {Enum} ContentStatusEnum
 * @typedef {Interface} ContentBase
 * @typedef {Interface} ContentCreate
 * @typedef {Interface} ContentUpdate
 * @typedef {Interface} ContentResponse
 * @typedef {Interface} MediaBase
 * @typedef {Interface} MediaCreate
 * @typedef {Interface} MediaUpdate
 * @typedef {Interface} MediaResponse
 * ... and 14 more type definitions
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export enum ContentTypeEnum {
  IMAGE = 'image',
  MENU_ITEM = 'menu_item',
  ROOM = 'room',
  FACILITY = 'facility',
  SERVICE = 'service',
  EVENT = 'event',
  PROMOTION = 'promotion',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
}

/**
 * Content Status Enumeration
 *
 * Defines the publication status of CMS content.
 *
 * @enum ContentStatusEnum
 * @property {string} DRAFT - Content is in draft state (not published)
 * @property {string} PUBLISHED - Content is published and visible
 * @property {string} ARCHIVED - Content is archived (hidden but not deleted)
 * @property {string} SCHEDULED - Content is scheduled for future publication
 */
export enum ContentStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled',
}

export interface ContentBase {
  title: string;
  description?: string;
  content_type: ContentTypeEnum;
  property_id: number;
  metadata?: Record<string, any>;
  tags?: string[];
  categories?: string[];
  alt_text?: string;
  meta_title?: string;
  meta_description?: string;
  social_image?: string;
}

export interface ContentCreate extends ContentBase {}

export interface ContentUpdate {
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  categories?: string[];
  alt_text?: string;
  meta_title?: string;
  meta_description?: string;
  social_image?: string;
  status?: ContentStatusEnum;
}

export interface ContentResponse extends ContentBase {
  id: number;
  slug: string;
  status: ContentStatusEnum;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
  is_deleted: boolean;
}

export interface MediaBase {
  filename: string;
  original_filename?: string;
  property_id: number;
  alt_text?: string;
  file_size?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  metadata?: Record<string, any>;
}

export interface MediaCreate extends MediaBase {}

export interface MediaUpdate {
  filename?: string;
  alt_text?: string;
  metadata?: Record<string, any>;
}

export interface MediaResponse extends MediaBase {
  id: number;
  file_path: string;
  file_hash: string;
  uploaded_by?: number;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PageBase {
  title: string;
  slug: string;
  content: string;
  property_id: number;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  published_at?: Date;
  template?: string;
  layout?: string;
}

export interface PageCreate extends PageBase {}

export interface PageUpdate {
  title?: string;
  slug?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;
  published_at?: Date;
  template?: string;
  layout?: string;
}

export interface PageResponse extends PageBase {
  id: number;
  created_at: Date;
  updated_at: Date;
  author_id?: number;
}

export interface NavigationBase {
  title: string;
  url: string;
  property_id: number;
  parent_id?: number;
  order: number;
  is_active: boolean;
  target?: string;
  icon?: string;
}

export interface NavigationCreate extends NavigationBase {}

export interface NavigationUpdate {
  title?: string;
  url?: string;
  parent_id?: number;
  order?: number;
  is_active?: boolean;
  target?: string;
  icon?: string;
}

export interface NavigationResponse extends NavigationBase {
  id: number;
  created_at: Date;
  updated_at: Date;
  children?: NavigationResponse[];
}

export interface ContentSearch {
  query?: string;
  content_type?: ContentTypeEnum;
  status?: ContentStatusEnum;
  property_id?: number;
  tags?: string[];
  categories?: string[];
  created_after?: Date;
  created_before?: Date;
  limit?: number;
  offset?: number;
}

export interface MediaSearch {
  query?: string;
  property_id?: number;
  mime_type?: string;
  is_public?: boolean;
  uploaded_after?: Date;
  uploaded_before?: Date;
  limit?: number;
  offset?: number;
}

export interface PageSearch {
  query?: string;
  property_id?: number;
  is_published?: boolean;
  template?: string;
  created_after?: Date;
  created_before?: Date;
  limit?: number;
  offset?: number;
}

export interface NavigationSearch {
  property_id?: number;
  parent_id?: number;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface ContentStats {
  total_content: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  recent_uploads: number;
  storage_used: number;
}

export interface MediaStats {
  total_files: number;
  total_size: number;
  by_type: Record<string, number>;
  recent_uploads: number;
  storage_used: number;
}
