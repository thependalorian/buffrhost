/**
 * CMS Zod Schemas
 * Validation schemas for Content Management System
 */

import { z } from 'zod';

export const ContentTypeEnumSchema = z.enum([
  'image',
  'menu_item',
  'room',
  'facility',
  'service',
  'event',
  'promotion',
  'document',
  'video',
  'audio',
]);

export const ContentStatusEnumSchema = z.enum([
  'draft',
  'published',
  'archived',
  'scheduled',
]);

export const ContentBaseSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  content_type: ContentTypeEnumSchema,
  property_id: z.number().int().positive(),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  alt_text: z.string().max(255).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().optional(),
  social_image: z.string().url().optional(),
});

export const ContentCreateSchema = ContentBaseSchema;

export const ContentUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  alt_text: z.string().max(255).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().optional(),
  social_image: z.string().url().optional(),
  status: ContentStatusEnumSchema.optional(),
});

export const ContentResponseSchema = ContentBaseSchema.extend({
  id: z.number().int().positive(),
  slug: z.string(),
  status: ContentStatusEnumSchema,
  file_path: z.string().optional(),
  file_size: z.number().int().positive().optional(),
  mime_type: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  published_at: z.date().optional(),
  is_deleted: z.boolean(),
});

export const MediaBaseSchema = z.object({
  filename: z.string().min(1).max(255),
  original_filename: z.string().optional(),
  property_id: z.number().int().positive(),
  alt_text: z.string().max(255).optional(),
  file_size: z.number().int().positive().optional(),
  mime_type: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  metadata: z.record(z.any()).optional(),
});

export const MediaCreateSchema = MediaBaseSchema;

export const MediaUpdateSchema = z.object({
  filename: z.string().min(1).max(255).optional(),
  alt_text: z.string().max(255).optional(),
  metadata: z.record(z.any()).optional(),
});

export const MediaResponseSchema = MediaBaseSchema.extend({
  id: z.number().int().positive(),
  file_path: z.string(),
  file_hash: z.string(),
  uploaded_by: z.number().int().positive().optional(),
  is_public: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const PageBaseSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string(),
  property_id: z.number().int().positive(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().optional(),
  is_published: z.boolean(),
  published_at: z.date().optional(),
  template: z.string().optional(),
  layout: z.string().optional(),
});

export const PageCreateSchema = PageBaseSchema;

export const PageUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().optional(),
  is_published: z.boolean().optional(),
  published_at: z.date().optional(),
  template: z.string().optional(),
  layout: z.string().optional(),
});

export const PageResponseSchema = PageBaseSchema.extend({
  id: z.number().int().positive(),
  created_at: z.date(),
  updated_at: z.date(),
  author_id: z.number().int().positive().optional(),
});

export const NavigationBaseSchema = z.object({
  title: z.string().min(1).max(255),
  url: z.string().url(),
  property_id: z.number().int().positive(),
  parent_id: z.number().int().positive().optional(),
  order: z.number().int().min(0),
  is_active: z.boolean(),
  target: z.string().optional(),
  icon: z.string().optional(),
});

export const NavigationCreateSchema = NavigationBaseSchema;

export const NavigationUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  url: z.string().url().optional(),
  parent_id: z.number().int().positive().optional(),
  order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  target: z.string().optional(),
  icon: z.string().optional(),
});

export const NavigationResponseSchema: z.ZodType<unknown> =
  NavigationBaseSchema.extend({
    id: z.number().int().positive(),
    created_at: z.date(),
    updated_at: z.date(),
    children: z.array(z.lazy(() => NavigationResponseSchema)).optional(),
  });

export const ContentSearchSchema = z.object({
  query: z.string().optional(),
  content_type: ContentTypeEnumSchema.optional(),
  status: ContentStatusEnumSchema.optional(),
  property_id: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  created_after: z.date().optional(),
  created_before: z.date().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const MediaSearchSchema = z.object({
  query: z.string().optional(),
  property_id: z.number().int().positive().optional(),
  mime_type: z.string().optional(),
  is_public: z.boolean().optional(),
  uploaded_after: z.date().optional(),
  uploaded_before: z.date().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const PageSearchSchema = z.object({
  query: z.string().optional(),
  property_id: z.number().int().positive().optional(),
  is_published: z.boolean().optional(),
  template: z.string().optional(),
  created_after: z.date().optional(),
  created_before: z.date().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const NavigationSearchSchema = z.object({
  property_id: z.number().int().positive().optional(),
  parent_id: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const ContentStatsSchema = z.object({
  total_content: z.number().int(),
  by_type: z.record(z.string(), z.number().int()),
  by_status: z.record(z.string(), z.number().int()),
  recent_uploads: z.number().int(),
  storage_used: z.number().int(),
});

export const MediaStatsSchema = z.object({
  total_files: z.number().int(),
  total_size: z.number().int(),
  by_type: z.record(z.string(), z.number().int()),
  recent_uploads: z.number().int(),
  storage_used: z.number().int(),
});

export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  property_id: z.number().int().positive(),
  alt_text: z.string().max(255).optional(),
  is_public: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

export const ContentBulkUpdateSchema = z.object({
  content_ids: z.array(z.number().int().positive()),
  updates: ContentUpdateSchema,
});

export const ContentBulkDeleteSchema = z.object({
  content_ids: z.array(z.number().int().positive()),
  permanent: z.boolean().default(false),
});

export const ContentExportSchema = z.object({
  content_ids: z.array(z.number().int().positive()).optional(),
  content_type: ContentTypeEnumSchema.optional(),
  property_id: z.number().int().positive().optional(),
  format: z.enum(['json', 'csv', 'xml']).default('json'),
  include_media: z.boolean().default(false),
});

export const ContentImportSchema = z.object({
  file: z.instanceof(File),
  property_id: z.number().int().positive(),
  overwrite_existing: z.boolean().default(false),
  validate_only: z.boolean().default(false),
});
