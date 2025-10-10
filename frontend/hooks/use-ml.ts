import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiServices } from '../lib/api-client';

// ML Recommendations Hook
export const useMLRecommendations = (userId: string) => {
  return useQuery({
    queryKey: ['ml', 'recommendations', userId],
    queryFn: () => apiServices.ml.getRecommendations(userId).then(res => res.data),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ML Insights Hook
export const useMLInsights = (propertyId: string) => {
  return useQuery({
    queryKey: ['ml', 'insights', propertyId],
    queryFn: () => apiServices.ml.getInsights(propertyId).then(res => res.data),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ML Predictions Hook
export const useMLPredictions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiServices.ml.getPredictions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ml'] });
    },
  });
};

// Fraud Alerts Hook
export const useFraudAlerts = () => {
  return useQuery({
    queryKey: ['ml', 'fraud-alerts'],
    queryFn: () => apiServices.ml.getFraudAlerts().then(res => res.data),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 0, // Always consider stale for real-time alerts
  });
};

// Churn Prediction Hook
export const useChurnPrediction = (customerId: string) => {
  return useQuery({
    queryKey: ['ml', 'churn-prediction', customerId],
    queryFn: () => apiServices.ml.getChurnPrediction(customerId).then(res => res.data),
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Dynamic Pricing Hook
export const useDynamicPricing = (propertyId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiServices.ml.getDynamicPricing(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ml', 'pricing', propertyId] });
    },
  });
};

// ML Model Performance Hook
export const useMLModelPerformance = (propertyId: string) => {
  return useQuery({
    queryKey: ['ml', 'model-performance', propertyId],
    queryFn: () => apiServices.ml.getInsights(propertyId).then(res => res.data),
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};