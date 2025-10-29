/**
 * Availability Hook for Buffr Host
 *
 * Phase 1: Core Availability Engine
 * Provides real-time availability checking for inventory, services, tables, and rooms
 * Location: hooks/useAvailability.ts
 */

import { useState, useCallback, useEffect } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface InventoryItem {
  inventory_item_id: number;
  menu_item_id?: number;
  quantity: number;
  name?: string;
}

export interface UnavailableItem {
  item_id: number;
  item_name: string;
  required_quantity: number;
  available_stock?: number;
  reason: string;
}

export interface LowStockItem {
  item_id: number;
  item_name: string;
  available_stock: number;
  minimum_stock: number;
}

export interface InventoryAvailability {
  available: boolean;
  unavailable_items: UnavailableItem[];
  low_stock_items: LowStockItem[];
  total_available: number;
  total_unavailable: number;
}

export interface ServiceAvailability {
  available: boolean;
  max_capacity: number;
  current_bookings: number;
  remaining_capacity: number;
  price: number;
  reason?: string;
}

export interface TableAvailabilityItem {
  table_id: number;
  table_number: string;
  capacity: number;
  location?: string;
  is_available: boolean;
  reservation_id?: number;
}

export interface TableAvailability {
  available_tables: TableAvailabilityItem[];
  total_available: number;
  total_tables: number;
}

export interface RoomAvailabilityItem {
  room_id: number;
  room_number: string;
  room_type: string;
  capacity: number;
  base_price: number;
  is_available: boolean;
  room_status: string;
}

export interface RoomAvailability {
  available_rooms: RoomAvailabilityItem[];
  total_available: number;
  total_rooms: number;
}

export interface AvailabilitySummary {
  inventory: {
    total_items: number;
    low_stock_items: number;
    out_of_stock_items: number;
  };
  tables: {
    total_tables: number;
    available_tables: number;
  };
  rooms: {
    total_rooms: number;
    available_rooms: number;
  };
}

export interface AvailabilityError {
  message: string;
  details?: string;
  code?: string;
}

// =============================================================================
// HOOK
// =============================================================================

export function useAvailability() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AvailabilityError | null>(null);

  // =============================================================================
  // INVENTORY AVAILABILITY
  // =============================================================================

  const checkInventoryAvailability = useCallback(
    async (
      propertyId: string,
      items: InventoryItem[]
    ): Promise<InventoryAvailability | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/secure/availability?type=inventory&property_id=${propertyId}&items=${encodeURIComponent(JSON.stringify(items))}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to check inventory availability'
          );
        }

        const data = await response.json();
        return data.data;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =============================================================================
  // SERVICE AVAILABILITY
  // =============================================================================

  const checkServiceAvailability = useCallback(
    async (
      propertyId: string,
      serviceType: string,
      serviceId: number,
      date: string,
      time: string
    ): Promise<ServiceAvailability | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/secure/availability?type=service&property_id=${propertyId}&service_type=${serviceType}&service_id=${serviceId}&date=${date}&time=${time}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to check service availability'
          );
        }

        const data = await response.json();
        return data.data;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =============================================================================
  // TABLE AVAILABILITY
  // =============================================================================

  const checkTableAvailability = useCallback(
    async (
      propertyId: string,
      partySize: number,
      date: string,
      time: string
    ): Promise<TableAvailability | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/secure/availability?type=table&property_id=${propertyId}&party_size=${partySize}&date=${date}&time=${time}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to check table availability'
          );
        }

        const data = await response.json();
        return data.data;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =============================================================================
  // ROOM AVAILABILITY
  // =============================================================================

  const checkRoomAvailability = useCallback(
    async (
      propertyId: string,
      checkInDate: string,
      checkOutDate: string,
      roomType?: string
    ): Promise<RoomAvailability | null> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          type: 'room',
          property_id: propertyId,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
        });

        if (roomType) {
          params.append('room_type', roomType);
        }

        const response = await fetch(
          `/api/secure/availability?${params.toString()}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to check room availability'
          );
        }

        const data = await response.json();
        return data.data;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =============================================================================
  // AVAILABILITY SUMMARY
  // =============================================================================

  const getAvailabilitySummary = useCallback(
    async (propertyId: string): Promise<AvailabilitySummary | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/secure/availability?type=summary&property_id=${propertyId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to get availability summary'
          );
        }

        const data = await response.json();
        return data.data;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =============================================================================
  // RESERVATIONS
  // =============================================================================

  const reserveInventory = useCallback(
    async (
      propertyId: string,
      items: InventoryItem[],
      referenceId: string,
      referenceType: string = 'order'
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/secure/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            property_id: propertyId,
            reservation_type: 'inventory',
            items,
            reference_id: referenceId,
            reference_type: referenceType,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reserve inventory');
        }

        const data = await response.json();
        return data.success;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reserveTable = useCallback(
    async (
      tableId: number,
      guestId: number,
      reservationDate: string,
      startTime: string,
      endTime: string,
      partySize: number
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/secure/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reservation_type: 'table',
            table_id: tableId,
            guest_id: guestId,
            reservation_date: reservationDate,
            start_time: startTime,
            end_time: endTime,
            party_size: partySize,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reserve table');
        }

        const data = await response.json();
        return data.success;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reserveRoom = useCallback(
    async (
      roomId: number,
      guestId: number,
      checkInDate: string,
      checkOutDate: string
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/secure/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reservation_type: 'room',
            room_id: roomId,
            guest_id: guestId,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reserve room');
        }

        const data = await response.json();
        return data.success;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =============================================================================
  // RELEASE RESERVATIONS
  // =============================================================================

  const releaseInventory = useCallback(
    async (
      propertyId: string,
      items: InventoryItem[],
      referenceId: string
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/secure/availability', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            property_id: propertyId,
            release_type: 'inventory',
            items,
            reference_id: referenceId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to release inventory');
        }

        const data = await response.json();
        return data.success;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const releaseTable = useCallback(
    async (reservationId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/secure/availability', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            release_type: 'table',
            reservation_id: reservationId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to release table');
        }

        const data = await response.json();
        return data.success;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const releaseRoom = useCallback(
    async (reservationId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/secure/availability', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            release_type: 'room',
            reservation_id: reservationId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to release room');
        }

        const data = await response.json();
        return data.success;
      } catch (err) {
        const error: AvailabilityError = {
          message:
            err instanceof Error ? err.message : 'Unknown error occurred',
          details: err instanceof Error ? err.stack : undefined,
        };
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isItemAvailable = useCallback(
    (availability: InventoryAvailability, itemId: number): boolean => {
      return !availability.unavailable_items.some(
        (item) => item.item_id === itemId
      );
    },
    []
  );

  const getItemAvailability = useCallback(
    (availability: InventoryAvailability, itemId: number) => {
      const unavailableItem = availability.unavailable_items.find(
        (item) => item.item_id === itemId
      );
      const lowStockItem = availability.low_stock_items.find(
        (item) => item.item_id === itemId
      );

      return {
        available: !unavailableItem,
        unavailable_reason: unavailableItem?.reason,
        is_low_stock: !!lowStockItem,
        available_stock: lowStockItem?.available_stock || 0,
        minimum_stock: lowStockItem?.minimum_stock || 0,
      };
    },
    []
  );

  // =============================================================================
  // RETURN HOOK INTERFACE
  // =============================================================================

  return {
    // State
    loading,
    error,

    // Inventory
    checkInventoryAvailability,
    reserveInventory,
    releaseInventory,

    // Service
    checkServiceAvailability,

    // Table
    checkTableAvailability,
    reserveTable,
    releaseTable,

    // Room
    checkRoomAvailability,
    reserveRoom,
    releaseRoom,

    // Summary
    getAvailabilitySummary,

    // Utilities
    clearError,
    isItemAvailable,
    getItemAvailability,
  };
}
