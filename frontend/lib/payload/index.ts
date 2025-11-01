/**
 * Payload CMS Integration
 * Main export file for Payload CMS functionality
 */

// Client
export { PayloadClient, getPayloadClient } from './client';
export type { PayloadConfig } from './client';

// Types
export type {
  PayloadDocument,
  PayloadUser,
  PayloadMedia,
  PayloadProduct,
  PayloadProperty,
  PayloadRoomType,
  PayloadBooking,
  PayloadOrder,
  PayloadCategory,
  PayloadPage,
  PayloadAIAgent,
  PayloadFAQ,
  PayloadTestimonial,
  PayloadPromotion,
  PayloadResponse,
  PayloadSearchResult,
  PayloadUploadResponse,
  PayloadAuthResponse,
  PayloadError,
} from './types';

// Hooks
export {
  usePayloadCollection,
  useUsers,
  useProducts,
  useProperties,
  useBookings,
  useOrders,
  useMedia,
  usePages,
  useCategories,
  useAIAgents,
  usePayloadDocument,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useFileUpload,
  useSearch,
  usePayloadAuth,
} from './hooks';
