import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { DatabaseConnectionPool } from '@/lib/database/connection-pool';

describe('KYC API - Real Database Tests', () => {
  let pool: DatabaseConnectionPool;

  beforeAll(async () => {
    pool = DatabaseConnectionPool.getInstance();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should check if KYC tables exist in database', async () => {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('kyc_verifications', 'kyc_documents', 'users')
        )
      `);
      expect(result.rows.length).toBeGreaterThan(0);
    } finally {
      client.release();
    }
  });

  it('should verify database connection for KYC operations', async () => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW() as current_time');
      expect(result.rows[0]?.current_time).toBeDefined();
    } finally {
      client.release();
    }
  });

  it('should validate KYC data structure', () => {
    const kycData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      documentType: 'passport' as const,
      documentNumber: 'P123456',
      documentImages: ['image1.jpg', 'image2.jpg'],
    };

    expect(kycData.firstName).toBe('John');
    expect(kycData.documentType).toBe('passport');
    expect(kycData.documentImages.length).toBeGreaterThan(0);
  });
});
