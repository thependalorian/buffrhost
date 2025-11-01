/**
 * Payload CMS React Hooks
 * Custom hooks for Payload CMS integration
 */

import { useState, useEffect, useCallback } from 'react';
import { getPayloadClient } from './client';
import type {
  PayloadUser,
  PayloadProduct,
  PayloadProperty,
  PayloadBooking,
  PayloadOrder,
  PayloadMedia,
  PayloadPage,
  PayloadCategory,
  PayloadAIAgent,
  PayloadResponse,
  PayloadSearchResult,
} from './types';

// Generic hook for Payload collections
export function usePayloadCollection<T = any>(
  collection: string,
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  const [data, setData] = useState<PayloadResponse<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (options.enabled === false) return;

    try {
      setLoading(true);
      setError(null);
      const client = getPayloadClient();
      const result = await client.find(collection, options);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error(`Error fetching ${collection}:`, err);
    } finally {
      setLoading(false);
    }
  }, [
    collection,
    options.page,
    options.limit,
    options.where,
    options.sort,
    options.enabled,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook for users
export function useUsers(
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  return usePayloadCollection<PayloadUser>('users', options);
}

// Hook for products
export function useProducts(
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  return usePayloadCollection<PayloadProduct>('products', options);
}

// Hook for properties
export function useProperties(
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  return usePayloadCollection<PayloadProperty>('properties', options);
}

// Hook for bookings
export function useBookings(
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  return usePayloadCollection<PayloadBooking>('bookings', options);
}

// Hook for orders
export function useOrders(
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  return usePayloadCollection<PayloadOrder>('orders', options);
}

// Hook for media
export function useMedia(
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  return usePayloadCollection<PayloadMedia>('media', options);
}

// Hook for pages
export function usePages(
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  return usePayloadCollection<PayloadPage>('pages', options);
}

// Hook for categories
export function useCategories(
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  return usePayloadCollection<PayloadCategory>('categories', options);
}

// Hook for AI agents
export function useAIAgents(
  options: {
    page?: number;
    limit?: number;
    where?: unknown;
    sort?: string;
    enabled?: boolean;
  } = {}
) {
  return usePayloadCollection<PayloadAIAgent>('aiAgents', options);
}

// Hook for single document by ID
export function usePayloadDocument<T = any>(
  collection: string,
  id: string | null,
  options: {
    depth?: number;
    enabled?: boolean;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id || options.enabled === false) return;

    try {
      setLoading(true);
      setError(null);
      const client = getPayloadClient();
      const result = await client.findByID(collection, id, options);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document');
      console.error(`Error fetching ${collection} document:`, err);
    } finally {
      setLoading(false);
    }
  }, [collection, id, options.depth, options.enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook for creating documents
export function useCreateDocument<T = any>(collection: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: unknown, options: { depth?: number } = {}) => {
      try {
        setLoading(true);
        setError(null);
        const client = getPayloadClient();
        const result = await client.create(collection, data, options);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create document';
        setError(errorMessage);
        console.error(`Error creating ${collection}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collection]
  );

  return { create, loading, error };
}

// Hook for updating documents
export function useUpdateDocument<T = any>(collection: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (id: string, data: unknown, options: { depth?: number } = {}) => {
      try {
        setLoading(true);
        setError(null);
        const client = getPayloadClient();
        const result = await client.update(collection, id, data, options);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update document';
        setError(errorMessage);
        console.error(`Error updating ${collection}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collection]
  );

  return { update, loading, error };
}

// Hook for deleting documents
export function useDeleteDocument(collection: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDoc = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        const client = getPayloadClient();
        const result = await client.delete(collection, id);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete document';
        setError(errorMessage);
        console.error(`Error deleting ${collection}:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collection]
  );

  return { delete: deleteDoc, loading, error };
}

// Hook for file uploads
export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      file: File,
      options: {
        alt?: string;
        caption?: string;
        folder?: string;
      } = {}
    ) => {
      try {
        setLoading(true);
        setError(null);
        const client = getPayloadClient();
        const result = await client.uploadFile(file, options);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to upload file';
        setError(errorMessage);
        console.error('Error uploading file:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { upload, loading, error };
}

// Hook for search
export function useSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PayloadSearchResult[]>([]);

  const search = useCallback(
    async (
      query: string,
      collections: string[] = ['products', 'pages', 'properties']
    ) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const client = getPayloadClient();
        const result = await client.search(query, collections);
        setResults(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { search, results, loading, error, clearResults };
}

// Hook for authentication
export function usePayloadAuth() {
  const [user, setUser] = useState<PayloadUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const client = getPayloadClient();
      const result = await client.authenticate(email, password);
      setUser(result.user);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('Authentication error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const client = getPayloadClient();
      const result = await client.getCurrentUser();
      setUser(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get current user';
      setError(errorMessage);
      console.error('Get current user error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, login, logout, getCurrentUser, loading, error };
}
