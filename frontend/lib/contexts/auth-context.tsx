'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  permissions?: string[];
}

interface AuthContextType {
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user: User | null; error?: string }>;
  logout: () => Promise<void>;
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Implement actual auth check
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; user: User | null; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual login logic
      // For now, return mock success
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        role: 'user',
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false, user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // TODO: Implement actual logout logic
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    login,
    logout,
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
