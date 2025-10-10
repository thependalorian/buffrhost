import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiServices } from '../lib/api-client';

// Properties List Hook
export const useProperties = (filters?: any) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => apiServices.properties.list(filters).then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Single Property Hook
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => apiServices.properties.get(id).then(res => res.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Property Stats Hook
export const usePropertyStats = (id: string) => {
  return useQuery({
    queryKey: ['properties', id, 'stats'],
    queryFn: () => apiServices.properties.getStats(id).then(res => res.data),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create Property Hook
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiServices.properties.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

// Update Property Hook
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiServices.properties.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties', id] });
    },
  });
};

// Delete Property Hook
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiServices.properties.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};