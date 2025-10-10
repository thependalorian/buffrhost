import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiServices } from '../lib/api-client';

// Customers List Hook
export const useCustomers = (filters?: any) => {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => apiServices.customers.list(filters).then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Single Customer Hook
export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => apiServices.customers.get(id).then(res => res.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Customer Analytics Hook
export const useCustomerAnalytics = (restaurantId: number, customerId: string) => {
  return useQuery({
    queryKey: ['customers', customerId, 'analytics', restaurantId],
    queryFn: () => apiServices.customers.getAnalytics(restaurantId, customerId).then(res => res.data),
    enabled: !!restaurantId && !!customerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create Customer Hook
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiServices.customers.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

// Update Customer Hook
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiServices.customers.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', id] });
    },
  });
};

// Delete Customer Hook
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiServices.customers.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};