// require("@testing-library/jest-dom");

// Set NODE_ENV to test for React Testing Library
process.env.NODE_ENV = 'test';

// Polyfills for Node.js environment
const { TextEncoder, TextDecoder } = require('util');

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';
process.env.NEON_DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEON_API_URL = 'https://test.neon-api-url/test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Mock fetch globally
global.fetch = jest.fn();

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock the DatabaseConnectionPool to prevent real database connections
jest.mock('@/lib/database/connection-pool', () => ({
  DatabaseConnectionPool: {
    getInstance: jest.fn(() => ({
      connect: jest.fn(() => ({
        query: jest.fn((sql) => {
          // Mock different responses based on SQL query content
          const normalizedSql = sql.replace(/\s+/g, ' ').trim();

          if (normalizedSql.includes("WHERE name = 'Savanna Restaurant'")) {
            return {
              rows: [
                { name: 'Savanna Restaurant', type: 'restaurant', city: 'Windhoek', country: 'Namibia' }
              ]
            };
          }
          if (normalizedSql.includes("WHERE name = 'Hotel Windhoek'")) {
            return {
              rows: [
                { name: 'Hotel Windhoek', type: 'hotel', city: 'Windhoek', country: 'Namibia' }
              ]
            };
          }
          if (normalizedSql.includes("WHERE name = 'Swakopmund Resort'")) {
            return {
              rows: [
                { name: 'Swakopmund Resort', type: 'hotel', city: 'Swakopmund', country: 'Namibia' }
              ]
            };
          }
          if (normalizedSql.includes("WHERE name = 'The Tug Restaurant'")) {
            return {
              rows: [
                { name: 'The Tug Restaurant', type: 'restaurant', city: 'Swakopmund', country: 'Namibia' }
              ]
            };
          }
          if (normalizedSql.includes("COUNT(*) as count FROM staff")) {
            return { rows: [{ count: '25' }] };
          }
          if (normalizedSql.includes("COUNT(*) as count FROM menu_items") && normalizedSql.includes("Savanna Restaurant")) {
            return { rows: [{ count: '15' }] };
          }
          if (normalizedSql.includes("COUNT(*) as count FROM menu_items") && normalizedSql.includes("The Tug Restaurant")) {
            return { rows: [{ count: '12' }] };
          }
          if (normalizedSql.includes("COUNT(*) as count FROM room_types") && normalizedSql.includes("Hotel Windhoek")) {
            return { rows: [{ count: '8' }] };
          }
          if (normalizedSql.includes("COUNT(*) as count FROM room_types") && normalizedSql.includes("Swakopmund Resort")) {
            return { rows: [{ count: '10' }] };
          }
          if (normalizedSql.includes("COUNT(*) as count FROM property_images")) {
            return { rows: [{ count: '45' }] };
          }
          if (normalizedSql.includes("SELECT employee_id, position, department, first_name, last_name FROM staff")) {
            return {
              rows: [
                { employee_id: 'EMP001', position: 'Manager', department: 'Operations', first_name: 'John', last_name: 'Doe' },
                { employee_id: 'EMP002', position: 'Chef', department: 'Kitchen', first_name: 'Jane', last_name: 'Smith' },
                { employee_id: 'EMP003', position: 'Waiter', department: 'Service', first_name: 'Mike', last_name: 'Johnson' }
              ]
            };
          }
          if (normalizedSql.includes("information_schema.columns") && normalizedSql.includes("table_name = 'staff'")) {
            return {
              rows: [
                { column_name: 'employee_id', data_type: 'character varying', is_nullable: 'NO' },
                { column_name: 'position', data_type: 'character varying', is_nullable: 'NO' },
                { column_name: 'department', data_type: 'character varying', is_nullable: 'NO' },
                { column_name: 'first_name', data_type: 'character varying', is_nullable: 'NO' },
                { column_name: 'last_name', data_type: 'character varying', is_nullable: 'NO' }
              ]
            };
          }
          // Default response for properties query
          return {
            rows: [
              { name: 'Savanna Restaurant', type: 'restaurant', city: 'Windhoek', country: 'Namibia' },
              { name: 'Hotel Windhoek', type: 'hotel', city: 'Windhoek', country: 'Namibia' },
              { name: 'Swakopmund Resort', type: 'hotel', city: 'Swakopmund', country: 'Namibia' },
              { name: 'The Tug Restaurant', type: 'restaurant', city: 'Swakopmund', country: 'Namibia' }
            ]
          };
        }),
        release: jest.fn()
      })),
      end: jest.fn()
    }))
  }
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
// Object.defineProperty(window, "matchMedia", {
//   writable: true,
//   value: jest.fn().mockImplementation((query) => ({
//     matches: false,
//     media: query,
//     onchange: null,
//     addListener: jest.fn(), // deprecated
//     removeListener: jest.fn(), // deprecated
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//     dispatchEvent: jest.fn(),
//   })),
// });

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Suppress console warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
