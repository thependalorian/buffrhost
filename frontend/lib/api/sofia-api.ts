/**
 * Sofia AI API Service
 *
 * API service functions for Sofia AI concierge system using database-aligned types
 * Location: lib/api/sofia-api.ts
 */

import {
  ApiResponse,
  SofiaAgent,
  SofiaConversation,
  SofiaMessage,
  SofiaMemory,
  SofiaCapabilities,
} from '../types/database';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch Sofia agent configuration for a property
 */
export async function getSofiaAgent(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<SofiaAgent>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/sofia/agent?property_id=${propertyId}&tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Sofia agent:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch Sofia agent',
    };
  }
}

/**
 * Create or update Sofia agent configuration
 */
export async function updateSofiaAgent(
  propertyId: string,
  agentData: Partial<SofiaAgent>,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<SofiaAgent>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/sofia/agent?property_id=${propertyId}&tenant_id=${tenantId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating Sofia agent:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update Sofia agent',
    };
  }
}

/**
 * Start a new conversation with Sofia
 */
export async function startSofiaConversation(
  propertyId: string,
  customerData: {
    customer_id?: string;
    customer_email?: string;
    customer_name?: string;
    conversation_type?: string;
  },
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<SofiaConversation>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/sofia/conversations?property_id=${propertyId}&tenant_id=${tenantId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting Sofia conversation:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to start Sofia conversation',
    };
  }
}

/**
 * Send a message to Sofia
 */
export async function sendSofiaMessage(
  conversationId: string,
  message: {
    content: string;
    sender_type: 'customer' | 'agent';
    message_type?: string;
    intent?: string;
    context?: Record<string, any>;
  },
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<SofiaMessage>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/sofia/messages?conversation_id=${conversationId}&tenant_id=${tenantId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending Sofia message:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to send Sofia message',
    };
  }
}

/**
 * Get conversation history
 */
export async function getSofiaConversation(
  conversationId: string,
  tenantId: string = 'default-tenant'
): Promise<
  ApiResponse<{
    conversation: SofiaConversation;
    messages: SofiaMessage[];
  }>
> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/sofia/conversations/${conversationId}?tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Sofia conversation:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch Sofia conversation',
    };
  }
}

/**
 * Get Sofia memories for a property
 */
export async function getSofiaMemories(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<SofiaMemory[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/sofia/memories?property_id=${propertyId}&tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Sofia memories:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch Sofia memories',
    };
  }
}

/**
 * Get Sofia capabilities for a property
 */
export async function getSofiaCapabilities(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<SofiaCapabilities>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/sofia/capabilities?property_id=${propertyId}&tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Sofia capabilities:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch Sofia capabilities',
    };
  }
}

/**
 * Update Sofia capabilities
 */
export async function updateSofiaCapabilities(
  propertyId: string,
  capabilities: Partial<SofiaCapabilities>,
  tenantId: string = 'default-tenant'
): Promise<ApiResponse<SofiaCapabilities>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/sofia/capabilities?property_id=${propertyId}&tenant_id=${tenantId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(capabilities),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating Sofia capabilities:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update Sofia capabilities',
    };
  }
}

/**
 * Get Sofia analytics for a property
 */
export async function getSofiaAnalytics(
  propertyId: string,
  tenantId: string = 'default-tenant'
): Promise<
  ApiResponse<{
    totalConversations: number;
    totalMessages: number;
    averageResponseTime: number;
    customerSatisfaction: number;
    resolutionRate: number;
  }>
> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/secure/sofia/analytics?property_id=${propertyId}&tenant_id=${tenantId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Sofia analytics:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch Sofia analytics',
    };
  }
}
