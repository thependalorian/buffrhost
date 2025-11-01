/**
 * Complete Property Management Database Service
 *
 * Comprehensive database operations for all property types
 * Features: Restaurants, Hotels, Inventory, Orders, Tables, Staff, Services, Bookings
 * Location: lib/database-complete.ts
 */

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

// =============================================================================
// INTERFACES
// =============================================================================

export interface PropertyOwner {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  registration_number?: string;
  tax_id?: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  description?: string;
  status: string;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  property_id: string;
  user_id?: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  hire_date: string;
  salary?: number;
  hourly_rate?: number;
  status: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  skills?: (string | number | boolean)[];
  certifications?: (string | number | boolean)[];
  created_at: string;
  updated_at: string;
}

export interface RestaurantTable {
  id: string;
  property_id: string;
  table_number: string;
  table_name?: string;
  capacity: number;
  table_type: string;
  location_description?: string;
  is_smoking_allowed: boolean;
  is_wheelchair_accessible: boolean;
  status: string;
  x_position?: number;
  y_position?: number;
  created_at: string;
  updated_at: string;
}

export interface TableReservation {
  id: string;
  property_id: string;
  table_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  duration_minutes: number;
  special_requests?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  property_id: string;
  item_code: string;
  item_name: string;
  category: string;
  subcategory?: string;
  description?: string;
  unit_of_measure: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock?: number;
  unit_cost: number;
  selling_price?: number;
  supplier?: string;
  supplier_contact?: string;
  reorder_point?: number;
  reorder_quantity?: number;
  expiry_date?: string;
  storage_location?: string;
  is_perishable: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  property_id: string;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  table_id?: string;
  order_type: string;
  status: string;
  subtotal: number;
  tax_amount: number;
  service_charge: number;
  discount_amount: number;
  total_amount: number;
  payment_status: string;
  payment_method?: string;
  special_instructions?: string;
  staff_id?: string;
  chef_id?: string;
  order_date: string;
  estimated_ready_time?: string;
  actual_ready_time?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id?: string;
  item_name: string;
  item_description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  status: string;
  chef_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  property_id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  is_available: boolean;
  is_featured: boolean;
  allergens?: (string | number | boolean)[];
  dietary_info?: (string | number | boolean)[];
  preparation_time?: number;
  spice_level: number;
  image_url?: string;
  sort_order: number;
  ingredients?: (string | number | boolean)[];
  nutrition_info?: unknown;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  property_id: string;
  room_code: string;
  name: string;
  description?: string;
  room_type: string;
  size_sqm?: number;
  max_occupancy: number;
  base_price: number;
  currency: string;
  bed_configuration?: unknown;
  amenities?: (string | number | boolean)[];
  view_type?: string;
  floor_number?: number;
  is_smoking_allowed: boolean;
  is_pet_friendly: boolean;
  is_accessible: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  property_id: string;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  booking_type: string;
  room_id?: string;
  table_id?: string;
  service_id?: string;
  check_in_date?: string;
  check_out_date?: string;
  booking_date: string;
  booking_time?: string;
  duration_minutes?: number;
  party_size: number;
  total_amount: number;
  status: string;
  payment_status: string;
  special_requests?: string;
  staff_id?: string;
  created_at: string;
  updated_at: string;
}

export class DatabaseServiceComplete {
  // =============================================================================
  // PROPERTY OWNERS
  // =============================================================================

  static async createPropertyOwner(
    data: Partial<PropertyOwner>
  ): Promise<PropertyOwner> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO property_owners (
          user_id, business_name, business_type, registration_number, tax_id,
          contact_person, phone, email, address, city, country, website, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;

      const values = [
        data.user_id,
        data.business_name,
        data.business_type,
        data.registration_number,
        data.tax_id,
        data.contact_person,
        data.phone,
        data.email,
        data.address,
        data.city,
        data.country,
        data.website,
        data.description,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getPropertyOwner(userId: string): Promise<PropertyOwner | null> {
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM property_owners WHERE user_id = $1';
      const result = await client.query(query, [userId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // STAFF MANAGEMENT
  // =============================================================================

  static async createStaff(data: Partial<Staff>): Promise<Staff> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO staff (
          property_id, user_id, employee_id, first_name, last_name, email, phone,
          position, department, hire_date, salary, hourly_rate, emergency_contact_name,
          emergency_contact_phone, address, skills, certifications
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.user_id,
        data.employee_id,
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.position,
        data.department,
        data.hire_date,
        data.salary,
        data.hourly_rate,
        data.emergency_contact_name,
        data.emergency_contact_phone,
        data.address,
        JSON.stringify(data.skills || []),
        JSON.stringify(data.certifications || []),
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getStaff(
    propertyId: string,
    filters: unknown = {}
  ): Promise<Staff[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      const paramCount = 1;

      if (filters.position) {
        paramCount++;
        whereClause += ` AND position = $${paramCount}`;
        values.push(filters.position);
      }

      if (filters.department) {
        paramCount++;
        whereClause += ` AND department = $${paramCount}`;
        values.push(filters.department);
      }

      if (filters.status) {
        paramCount++;
        whereClause += ` AND status = $${paramCount}`;
        values.push(filters.status);
      }

      const query = `SELECT * FROM staff ${whereClause} ORDER BY created_at`;
      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async updateStaff(id: string, data: unknown): Promise<Staff> {
    const client = await pool.connect();
    try {
      const fields = Object.keys(data).filter((key) => data[key] !== undefined);
      const setClause = fields
        .map((field, index) => {
          if (field === 'skills' || field === 'certifications') {
            return `${field} = $${index + 2}::jsonb`;
          }
          return `${field} = $${index + 2}`;
        })
        .join(', ');

      const query = `
        UPDATE staff 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const values = [
        id,
        ...fields.map((field) => {
          if (field === 'skills' || field === 'certifications') {
            return JSON.stringify(data[field]);
          }
          return data[field];
        }),
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // RESTAURANT TABLE MANAGEMENT
  // =============================================================================

  static async createTable(
    data: Partial<RestaurantTable>
  ): Promise<RestaurantTable> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO restaurant_tables (
          property_id, table_number, table_name, capacity, table_type,
          location_description, is_smoking_allowed, is_wheelchair_accessible,
          x_position, y_position
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.table_number,
        data.table_name,
        data.capacity,
        data.table_type,
        data.location_description,
        data.is_smoking_allowed || false,
        data.is_wheelchair_accessible || false,
        data.x_position,
        data.y_position,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getTables(
    propertyId: string,
    filters: unknown = {}
  ): Promise<RestaurantTable[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      const paramCount = 1;

      if (filters.status) {
        paramCount++;
        whereClause += ` AND status = $${paramCount}`;
        values.push(filters.status);
      }

      if (filters.table_type) {
        paramCount++;
        whereClause += ` AND table_type = $${paramCount}`;
        values.push(filters.table_type);
      }

      if (filters.min_capacity) {
        paramCount++;
        whereClause += ` AND capacity >= $${paramCount}`;
        values.push(filters.min_capacity);
      }

      const query = `SELECT * FROM restaurant_tables ${whereClause} ORDER BY table_number`;
      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async updateTable(
    id: string,
    data: unknown
  ): Promise<RestaurantTable> {
    const client = await pool.connect();
    try {
      const fields = Object.keys(data).filter((key) => data[key] !== undefined);
      const setClause = fields
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const query = `
        UPDATE restaurant_tables 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const values = [id, ...fields.map((field) => data[field])];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // TABLE RESERVATIONS
  // =============================================================================

  static async createReservation(
    data: Partial<TableReservation>
  ): Promise<TableReservation> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO table_reservations (
          property_id, table_id, customer_name, customer_phone, customer_email,
          party_size, reservation_date, reservation_time, duration_minutes,
          special_requests, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.table_id,
        data.customer_name,
        data.customer_phone,
        data.customer_email,
        data.party_size,
        data.reservation_date,
        data.reservation_time,
        data.duration_minutes || 120,
        data.special_requests,
        data.notes,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getReservations(
    propertyId: string,
    filters: unknown = {}
  ): Promise<TableReservation[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      const paramCount = 1;

      if (filters.date) {
        paramCount++;
        whereClause += ` AND reservation_date = $${paramCount}`;
        values.push(filters.date);
      }

      if (filters.status) {
        paramCount++;
        whereClause += ` AND status = $${paramCount}`;
        values.push(filters.status);
      }

      if (filters.table_id) {
        paramCount++;
        whereClause += ` AND table_id = $${paramCount}`;
        values.push(filters.table_id);
      }

      const query = `
        SELECT tr.*, rt.table_number, rt.capacity 
        FROM table_reservations tr
        JOIN restaurant_tables rt ON tr.table_id = rt.id
        ${whereClause}
        ORDER BY reservation_date, reservation_time
      `;

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // INVENTORY MANAGEMENT
  // =============================================================================

  static async createInventoryItem(
    data: Partial<InventoryItem>
  ): Promise<InventoryItem> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO inventory_items (
          property_id, item_code, item_name, category, subcategory, description,
          unit_of_measure, current_stock, minimum_stock, maximum_stock, unit_cost,
          selling_price, supplier, supplier_contact, reorder_point, reorder_quantity,
          expiry_date, storage_location, is_perishable
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.item_code,
        data.item_name,
        data.category,
        data.subcategory,
        data.description,
        data.unit_of_measure,
        data.current_stock || 0,
        data.minimum_stock || 0,
        data.maximum_stock,
        data.unit_cost,
        data.selling_price,
        data.supplier,
        data.supplier_contact,
        data.reorder_point,
        data.reorder_quantity,
        data.expiry_date,
        data.storage_location,
        data.is_perishable || false,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getInventoryItems(
    propertyId: string,
    filters: unknown = {}
  ): Promise<InventoryItem[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      const paramCount = 1;

      if (filters.category) {
        paramCount++;
        whereClause += ` AND category = $${paramCount}`;
        values.push(filters.category);
      }

      if (filters.is_active !== undefined) {
        paramCount++;
        whereClause += ` AND is_active = $${paramCount}`;
        values.push(filters.is_active);
      }

      if (filters.low_stock) {
        whereClause += ` AND current_stock <= minimum_stock`;
      }

      const query = `SELECT * FROM inventory_items ${whereClause} ORDER BY item_name`;
      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async updateInventoryStock(
    itemId: string,
    quantity: number,
    reason: string,
    staffId?: string
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update the item stock
      const updateQuery = `
        UPDATE inventory_items 
        SET current_stock = current_stock + $1, updated_at = NOW()
        WHERE id = $2
      `;
      await client.query(updateQuery, [quantity, itemId]);

      // Record the transaction
      const transactionQuery = `
        INSERT INTO inventory_transactions (
          property_id, item_id, transaction_type, quantity, reason, staff_id
        ) 
        SELECT property_id, $1, $2, $3, $4, $5
        FROM inventory_items WHERE id = $1
      `;
      await client.query(transactionQuery, [
        itemId,
        quantity > 0 ? 'in' : 'out',
        quantity,
        reason,
        staffId,
      ]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // ORDER MANAGEMENT
  // =============================================================================

  static async createOrder(data: Partial<Order>): Promise<Order> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO orders (
          property_id, order_number, customer_name, customer_phone, customer_email,
          table_id, order_type, special_instructions, staff_id, chef_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.order_number,
        data.customer_name,
        data.customer_phone,
        data.customer_email,
        data.table_id,
        data.order_type,
        data.special_instructions,
        data.staff_id,
        data.chef_id,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async addOrderItem(data: Partial<OrderItem>): Promise<OrderItem> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO order_items (
          order_id, menu_item_id, item_name, item_description, quantity,
          unit_price, total_price, special_instructions
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        data.order_id,
        data.menu_item_id,
        data.item_name,
        data.item_description,
        data.quantity,
        data.unit_price,
        data.total_price,
        data.special_instructions,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getOrders(
    propertyId: string,
    filters: unknown = {}
  ): Promise<Order[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      const paramCount = 1;

      if (filters.status) {
        paramCount++;
        whereClause += ` AND status = $${paramCount}`;
        values.push(filters.status);
      }

      if (filters.order_type) {
        paramCount++;
        whereClause += ` AND order_type = $${paramCount}`;
        values.push(filters.order_type);
      }

      if (filters.date) {
        paramCount++;
        whereClause += ` AND DATE(order_date) = $${paramCount}`;
        values.push(filters.date);
      }

      const query = `
        SELECT o.*, rt.table_number, s.first_name as staff_name, s.last_name as staff_last_name
        FROM orders o
        LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
        LEFT JOIN staff s ON o.staff_id = s.id
        ${whereClause}
        ORDER BY o.order_date DESC
      `;

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async updateOrderStatus(id: string, status: string): Promise<Order> {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE orders 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;

      const result = await client.query(query, [status, id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // MENU MANAGEMENT
  // =============================================================================

  static async createMenuItem(data: Partial<MenuItem>): Promise<MenuItem> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO menu_items (
          property_id, category, name, description, price, currency, is_available,
          is_featured, allergens, dietary_info, preparation_time, spice_level,
          image_url, sort_order, ingredients, nutrition_info
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.category,
        data.name,
        data.description,
        data.price,
        data.currency || 'NAD',
        data.is_available !== false,
        data.is_featured || false,
        JSON.stringify(data.allergens || []),
        JSON.stringify(data.dietary_info || []),
        data.preparation_time,
        data.spice_level || 0,
        data.image_url,
        data.sort_order || 0,
        JSON.stringify(data.ingredients || []),
        JSON.stringify(data.nutrition_info || {}),
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getMenuItems(
    propertyId: string,
    filters: unknown = {}
  ): Promise<MenuItem[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      const paramCount = 1;

      if (filters.category) {
        paramCount++;
        whereClause += ` AND category = $${paramCount}`;
        values.push(filters.category);
      }

      if (filters.is_available !== undefined) {
        paramCount++;
        whereClause += ` AND is_available = $${paramCount}`;
        values.push(filters.is_available);
      }

      if (filters.is_featured !== undefined) {
        paramCount++;
        whereClause += ` AND is_featured = $${paramCount}`;
        values.push(filters.is_featured);
      }

      const query = `SELECT * FROM menu_items ${whereClause} ORDER BY sort_order, name`;
      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // ROOM MANAGEMENT
  // =============================================================================

  static async createRoom(data: Partial<Room>): Promise<Room> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO room_types (
          property_id, room_code, name, description, room_type, size_sqm,
          max_occupancy, base_price, currency, bed_configuration, amenities,
          view_type, floor_number, is_smoking_allowed, is_pet_friendly, is_accessible
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.room_code,
        data.name,
        data.description,
        data.room_type,
        data.size_sqm,
        data.max_occupancy,
        data.base_price,
        data.currency || 'NAD',
        JSON.stringify(data.bed_configuration || {}),
        JSON.stringify(data.amenities || []),
        data.view_type,
        data.floor_number,
        data.is_smoking_allowed || false,
        data.is_pet_friendly || false,
        data.is_accessible || false,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getRooms(
    propertyId: string,
    filters: unknown = {}
  ): Promise<Room[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      const paramCount = 1;

      if (filters.status) {
        paramCount++;
        whereClause += ` AND status = $${paramCount}`;
        values.push(filters.status);
      }

      if (filters.room_type) {
        paramCount++;
        whereClause += ` AND room_type = $${paramCount}`;
        values.push(filters.room_type);
      }

      const query = `SELECT * FROM room_types ${whereClause} ORDER BY created_at`;
      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // BOOKING MANAGEMENT
  // =============================================================================

  static async createBooking(data: Partial<Booking>): Promise<Booking> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO bookings (
          property_id, booking_number, customer_name, customer_phone, customer_email,
          booking_type, room_id, table_id, service_id, check_in_date, check_out_date,
          booking_date, booking_time, duration_minutes, party_size, total_amount,
          special_requests, staff_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *
      `;

      const values = [
        data.property_id,
        data.booking_number,
        data.customer_name,
        data.customer_phone,
        data.customer_email,
        data.booking_type,
        data.room_id,
        data.table_id,
        data.service_id,
        data.check_in_date,
        data.check_out_date,
        data.booking_date,
        data.booking_time,
        data.duration_minutes,
        data.party_size || 1,
        data.total_amount || 0,
        data.special_requests,
        data.staff_id,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async getBookings(
    propertyId: string,
    filters: unknown = {}
  ): Promise<Booking[]> {
    const client = await pool.connect();
    try {
      let whereClause = 'WHERE property_id = $1';
      const values: (string | number | boolean)[] = [propertyId];
      const paramCount = 1;

      if (filters.booking_type) {
        paramCount++;
        whereClause += ` AND booking_type = $${paramCount}`;
        values.push(filters.booking_type);
      }

      if (filters.status) {
        paramCount++;
        whereClause += ` AND status = $${paramCount}`;
        values.push(filters.status);
      }

      if (filters.date) {
        paramCount++;
        whereClause += ` AND booking_date = $${paramCount}`;
        values.push(filters.date);
      }

      const query = `
        SELECT b.*, 
               rt.name as room_name, rt.room_code,
               rst.table_number,
               ps.service_name
        FROM bookings b
        LEFT JOIN room_types rt ON b.room_id = rt.id
        LEFT JOIN restaurant_tables rst ON b.table_id = rst.id
        LEFT JOIN property_services ps ON b.service_id = ps.id
        ${whereClause}
        ORDER BY b.booking_date, b.booking_time
      `;

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // =============================================================================
  // ANALYTICS
  // =============================================================================

  static async getPropertyAnalytics(
    propertyId: string,
    dateRange: { start: string; end: string }
  ): Promise<unknown> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          metric_type,
          SUM(metric_value) as total_value,
          AVG(metric_value) as avg_value,
          COUNT(*) as data_points
        FROM property_analytics 
        WHERE property_id = $1 
        AND date BETWEEN $2 AND $3
        GROUP BY metric_type
        ORDER BY metric_type
      `;

      const result = await client.query(query, [
        propertyId,
        dateRange.start,
        dateRange.end,
      ]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async recordAnalytics(
    propertyId: string,
    metricType: string,
    value: number,
    additionalData?: unknown
  ): Promise<void> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO property_analytics (property_id, date, metric_type, metric_value, additional_data)
        VALUES ($1, CURRENT_DATE, $2, $3, $4)
        ON CONFLICT (property_id, date, metric_type) 
        DO UPDATE SET metric_value = property_analytics.metric_value + $3
      `;

      await client.query(query, [
        propertyId,
        metricType,
        value,
        JSON.stringify(additionalData || {}),
      ]);
    } finally {
      client.release();
    }
  }
}

export default DatabaseServiceComplete;
