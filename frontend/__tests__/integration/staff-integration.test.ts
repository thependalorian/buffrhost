// /__tests__/integration/staff-integration.test.ts

import { DatabaseConnectionPool } from '@/lib/database/connection-pool';

describe('Staff Database Integration (Real Neon Database)', () => {
  let pool: DatabaseConnectionPool;

  beforeAll(async () => {
    // Use real Neon database connection
    pool = DatabaseConnectionPool.getInstance();
  });

  afterAll(async () => {
    // Clean up connections
    await pool.end();
  });

  it('should connect to real Neon database', async () => {
    const client = await pool.connect();
    expect(client).toBeDefined();
    client.release();
  });

  it('should retrieve real staff data from seed', async () => {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT employee_id, position, department, first_name, last_name
        FROM staff
        LIMIT 5
      `);

      // Verify real data from Neon seed
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0]).toHaveProperty('employee_id');
      expect(result.rows[0]).toHaveProperty('position');
      expect(result.rows[0]).toHaveProperty('department');
    } finally {
      client.release();
    }
  });

  it('should verify staff table structure', async () => {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'staff'
        ORDER BY ordinal_position
      `);

      expect(result.rows.length).toBeGreaterThan(0);
      const columns = result.rows.map(row => row.column_name);
      expect(columns).toContain('employee_id');
      expect(columns).toContain('position');
      expect(columns).toContain('department');
      expect(columns).toContain('first_name');
      expect(columns).toContain('last_name');
    } finally {
      client.release();
    }
  });
});
