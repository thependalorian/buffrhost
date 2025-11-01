/**
 * Payload CMS Client Configuration
 * Handles all communication with the Payload CMS backend
 */

export interface PayloadConfig {
  apiUrl: string;
  secret: string;
  user?: {
    email: string;
    password: string;
  };
}

export class PayloadClient {
  private config: PayloadConfig;
  private apiUrl: string;

  constructor(config: PayloadConfig) {
    this.config = config;
    this.apiUrl = config.apiUrl;
  }

  /**
   * Make authenticated request to Payload CMS API
   */
  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Authenticate user with Payload CMS
   */
  async authenticate(email: string, password: string) {
    try {
      const result = await this.makeRequest('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return result;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const result = await this.makeRequest('/api/users/me');
      return result;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Generic find method for any collection
   */
  async find<T = any>(
    collection: string,
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
      depth?: number;
    } = {}
  ) {
    try {
      const params = new URLSearchParams();

      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.sort) params.append('sort', options.sort);
      if (options.depth) params.append('depth', options.depth.toString());
      if (options.where) params.append('where', JSON.stringify(options.where));

      const queryString = params.toString();
      const endpoint = `/api/${collection}${queryString ? `?${queryString}` : ''}`;

      const result = await this.makeRequest(endpoint);
      return result;
    } catch (error) {
      console.error(`Failed to find ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Generic find by ID method
   */
  async findByID<T = any>(
    collection: string,
    id: string,
    options: {
      depth?: number;
    } = {}
  ) {
    try {
      const params = new URLSearchParams();
      if (options.depth) params.append('depth', options.depth.toString());

      const queryString = params.toString();
      const endpoint = `/api/${collection}/${id}${queryString ? `?${queryString}` : ''}`;

      const result = await this.makeRequest(endpoint);
      return result;
    } catch (error) {
      console.error(`Failed to find ${collection} by ID:`, error);
      throw error;
    }
  }

  /**
   * Generic create method
   */
  async create<T = any>(
    collection: string,
    data: unknown,
    options: {
      depth?: number;
    } = {}
  ) {
    try {
      const params = new URLSearchParams();
      if (options.depth) params.append('depth', options.depth.toString());

      const queryString = params.toString();
      const endpoint = `/api/${collection}${queryString ? `?${queryString}` : ''}`;

      const result = await this.makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return result;
    } catch (error) {
      console.error(`Failed to create ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Generic update method
   */
  async update<T = any>(
    collection: string,
    id: string,
    data: unknown,
    options: {
      depth?: number;
    } = {}
  ) {
    try {
      const params = new URLSearchParams();
      if (options.depth) params.append('depth', options.depth.toString());

      const queryString = params.toString();
      const endpoint = `/api/${collection}/${id}${queryString ? `?${queryString}` : ''}`;

      const result = await this.makeRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return result;
    } catch (error) {
      console.error(`Failed to update ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Generic delete method
   */
  async delete(collection: string, id: string) {
    try {
      const result = await this.makeRequest(`/api/${collection}/${id}`, {
        method: 'DELETE',
      });
      return result;
    } catch (error) {
      console.error(`Failed to delete ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Get users with pagination and filters
   */
  async getUsers(
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
    } = {}
  ) {
    return this.find('users', {
      page: options.page || 1,
      limit: options.limit || 10,
      where: options.where || {},
      sort: options.sort || '-createdAt',
    });
  }

  /**
   * Get products with pagination and filters
   */
  async getProducts(
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
    } = {}
  ) {
    return this.find('products', {
      page: options.page || 1,
      limit: options.limit || 10,
      where: options.where || {},
      sort: options.sort || '-createdAt',
    });
  }

  /**
   * Get properties with pagination and filters
   */
  async getProperties(
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
    } = {}
  ) {
    return this.find('properties', {
      page: options.page || 1,
      limit: options.limit || 10,
      where: options.where || {},
      sort: options.sort || '-createdAt',
    });
  }

  /**
   * Get bookings with pagination and filters
   */
  async getBookings(
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
    } = {}
  ) {
    return this.find('bookings', {
      page: options.page || 1,
      limit: options.limit || 10,
      where: options.where || {},
      sort: options.sort || '-createdAt',
    });
  }

  /**
   * Get orders with pagination and filters
   */
  async getOrders(
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
    } = {}
  ) {
    return this.find('orders', {
      page: options.page || 1,
      limit: options.limit || 10,
      where: options.where || {},
      sort: options.sort || '-createdAt',
    });
  }

  /**
   * Get media files
   */
  async getMedia(
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
    } = {}
  ) {
    return this.find('media', {
      page: options.page || 1,
      limit: options.limit || 10,
      where: options.where || {},
      sort: options.sort || '-createdAt',
    });
  }

  /**
   * Get pages (content management)
   */
  async getPages(
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
    } = {}
  ) {
    return this.find('pages', {
      page: options.page || 1,
      limit: options.limit || 10,
      where: options.where || {},
      sort: options.sort || '-createdAt',
    });
  }

  /**
   * Get categories
   */
  async getCategories(
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
    } = {}
  ) {
    return this.find('categories', {
      page: options.page || 1,
      limit: options.limit || 10,
      where: options.where || {},
      sort: options.sort || '-createdAt',
    });
  }

  /**
   * Get AI agents
   */
  async getAIAgents(
    options: {
      page?: number;
      limit?: number;
      where?: unknown;
      sort?: string;
    } = {}
  ) {
    return this.find('aiAgents', {
      page: options.page || 1,
      limit: options.limit || 10,
      where: options.where || {},
      sort: options.sort || '-createdAt',
    });
  }

  /**
   * Upload file to media collection
   */
  async uploadFile(
    file: File,
    options: {
      alt?: string;
      caption?: string;
      folder?: string;
    } = {}
  ) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (options.alt) formData.append('alt', options.alt);
      if (options.caption) formData.append('caption', options.caption);
      if (options.folder) formData.append('folder', options.folder);

      const response = await fetch(`${this.apiUrl}/api/media`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  /**
   * Search across collections
   */
  async search(
    query: string,
    collections: string[] = ['products', 'pages', 'properties']
  ) {
    try {
      const results = await Promise.all(
        collections.map(async (collection) => {
          try {
            const result = await this.find(collection, {
              where: {
                or: [
                  { title: { contains: query } },
                  { description: { contains: query } },
                  { content: { contains: query } },
                ],
              },
              limit: 5,
            });
            return {
              collection,
              results: result.docs,
              total: result.totalDocs,
            };
          } catch (error) {
            console.error(`Search failed for ${collection}:`, error);
            return { collection, results: [], total: 0 };
          }
        })
      );
      return results;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
let payloadClient: PayloadClient | null = null;

export const getPayloadClient = (): PayloadClient => {
  if (!payloadClient) {
    payloadClient = new PayloadClient({
      apiUrl:
        process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3001',
      secret: process.env.PAYLOAD_SECRET || '',
    });
  }
  return payloadClient;
};

export default PayloadClient;
