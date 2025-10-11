// Simple test to verify auth context works
const { AuthProvider, useAuth } = require('../lib/contexts/auth-context.tsx');

describe('Auth Context', () => {
  test('AuthProvider should be defined', () => {
    expect(AuthProvider).toBeDefined();
  });

  test('useAuth should be defined', () => {
    expect(useAuth).toBeDefined();
  });
});
