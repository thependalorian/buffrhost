import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
const originalLocation = window.location;
beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, href: '' },
  });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
});

describe('DashboardPage', () => {
  const mockAnalyticsData = {
    total_revenue: 45678,
    revenue_change: 12.5,
    active_orders: 23,
    orders_change: 8.3,
    total_customers: 1250,
    customers_change: 15.2,
    total_properties: 5,
    properties_change: 0
  };

  const mockOrdersData = {
    orders: [
      {
        order_id: '1',
        order_number: 1001,
        customer: { name: 'John Doe' },
        total: 125.50,
        status: 'completed',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        order_id: '2',
        order_number: 1002,
        customer: { name: 'Jane Smith' },
        total: 89.75,
        status: 'pending',
        created_at: '2024-01-15T11:15:00Z'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    window.location.href = '';
  });

  it('redirects to signin when no access token', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(window.location.href).toBe('/signin');
    });
  });

  it('renders dashboard with valid token', async () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyticsData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome back! Here\'s what\'s happening with your business today.')).toBeInTheDocument();
    });
  });

  it('displays analytics stats correctly', async () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyticsData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('N$45,678')).toBeInTheDocument();
      expect(screen.getByText('+12.5% from last month')).toBeInTheDocument();
      
      expect(screen.getByText('Active Orders')).toBeInTheDocument();
      expect(screen.getByText('23')).toBeInTheDocument();
      expect(screen.getByText('+8.3% from last month')).toBeInTheDocument();
      
      expect(screen.getByText('Total Customers')).toBeInTheDocument();
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('+15.2% from last month')).toBeInTheDocument();
      
      // Check for multiple instances of "Properties" (navigation and stats)
      expect(screen.getAllByText('Properties')).toHaveLength(2);
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('displays recent orders correctly', async () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyticsData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Recent Orders')).toBeInTheDocument();
      expect(screen.getByText('#1001')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('N$125.5')).toBeInTheDocument();
      expect(screen.getByText('completed')).toBeInTheDocument();
      
      expect(screen.getByText('#1002')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('N$89.75')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });

  it('shows loading skeleton while fetching data', () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<DashboardPage />);

    // Check for loading skeletons using role="status"
    const loadingElements = screen.getAllByRole('status');
    expect(loadingElements.length).toBeGreaterThan(0);
    
    // Check for loading text in screen reader content
    expect(screen.getAllByText('Loading analytics data...')).toHaveLength(4);
  });

  it('handles API errors gracefully', async () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('API Error'));

    render(<DashboardPage />);

    await waitFor(() => {
      // Should still render dashboard with fallback data
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('N$0')).toBeInTheDocument(); // Fallback values
    });
  });

  it('displays fallback stats when analytics data is unavailable', async () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('N$0')).toBeInTheDocument();
      expect(screen.getAllByText('+0% from last month')).toHaveLength(4);
    });
  });

  it('shows empty state when no recent orders', async () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyticsData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ orders: [] }),
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('No recent orders found')).toBeInTheDocument();
    });
  });

  it('handles sign out correctly', async () => {
    const user = userEvent.setup();
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    localStorageMock.setItem('user', JSON.stringify({ email: 'test@example.com' }));
    
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyticsData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    const signOutButton = screen.getByText('Sign Out');
    await user.click(signOutButton);

    expect(localStorageMock.getItem('access_token')).toBeNull();
    expect(localStorageMock.getItem('user')).toBeNull();
    expect(window.location.href).toBe('/');
  });

  it('renders navigation sidebar correctly', async () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyticsData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Customers')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });

  it('renders quick actions section', async () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyticsData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Generate QR Code')).toBeInTheDocument();
      expect(screen.getByText('Add Customer')).toBeInTheDocument();
      expect(screen.getByText('Manage Properties')).toBeInTheDocument();
    });
  });

  it('renders system status section', async () => {
    localStorageMock.setItem('access_token', 'fake-jwt-token');
    
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyticsData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrdersData,
      });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('System Status')).toBeInTheDocument();
      expect(screen.getByText('API Status')).toBeInTheDocument();
      expect(screen.getByText('Online')).toBeInTheDocument();
      expect(screen.getByText('Payment Gateway')).toBeInTheDocument();
      expect(screen.getByText('Connected')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
      expect(screen.getByText('Healthy')).toBeInTheDocument();
    });
  });
});
