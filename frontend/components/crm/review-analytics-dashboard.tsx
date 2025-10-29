'use client';
/**
 * Review Analytics Dashboard Component
 *
 * CRM/BI dashboard for review analytics and insights
 * Features: Review statistics, trends, sentiment analysis, customer insights
 * Location: components/crm/review-analytics-dashboard.tsx
 */

import { useState, useEffect } from 'react';
import StarRating from '../reviews/star-rating';

interface ReviewAnalytics {
  overview: {
    totalReviews: number;
    averageRating: string;
    positiveReviews: number;
    negativeReviews: number;
    verifiedReviews: number;
    respondedReviews: number;
    csatScore: string;
  };
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  categoryRatings: Array<{
    category: string;
    averageRating: string;
    reviewCount: number;
  }>;
  trends: Array<{
    date: string;
    reviewCount: number;
    averageRating: string;
    positiveCount: number;
    negativeCount: number;
  }>;
  responseTime: {
    averageHours: string;
    totalResponses: number;
    totalReviews: number;
    responseRate: string;
  };
  recentReviews: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    reviewText: string;
    createdAt: string;
    isVerified: boolean;
    orderNumber: string;
    orderAmount: number;
  }>;
  sentiment: Array<{
    sentiment: string;
    count: number;
    percentage: number;
  }>;
}

interface ReviewAnalyticsDashboardProps {
  propertyId: string;
  tenantId?: string;
  period?: string;
}

export default function ReviewAnalyticsDashboard({
  propertyId,
  tenantId = 'default-tenant',
  period = '30d',
}: ReviewAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  // Fetch analytics data
  const fetchAnalytics = async (period: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        propertyId,
        tenantId,
        period,
      });

      const response = await fetch(`/api/analytics/reviews?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch analytics'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAnalytics(selectedPeriod);
  }, [propertyId, tenantId, selectedPeriod]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-success bg-green-100';
      case 'Neutral':
        return 'text-warning bg-yellow-100';
      case 'Negative':
        return 'text-error bg-red-100';
      default:
        return 'text-nude-600 bg-nude-100';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-nude-50 card shadow-2xl card-body animate-pulse"
            >
              <div className="h-4 bg-nude-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-nude-300 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 card card-body">
        <div className="flex">
          <svg
            className="w-5 h-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-error">Error</h3>
            <p className="mt-1 text-sm text-error">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-nude-900">
          Review Analytics
        </h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-nude-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-nude-50 card shadow-2xl card-body">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-nude-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-nude-500">
                Average Rating
              </p>
              <p className="text-2xl font-semibold text-nude-900">
                {analytics.overview.averageRating}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-nude-50 card shadow-2xl card-body">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-nude-500">Total Reviews</p>
              <p className="text-2xl font-semibold text-nude-900">
                {analytics.overview.totalReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-nude-50 card shadow-2xl card-body">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-nude-500">CSAT Score</p>
              <p className="text-2xl font-semibold text-nude-900">
                {analytics.overview.csatScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-nude-50 card shadow-2xl card-body">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-nude-500">Response Rate</p>
              <p className="text-2xl font-semibold text-nude-900">
                {analytics.responseTime.responseRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-nude-50 card shadow-2xl card-body">
        <h3 className="text-lg font-semibold text-nude-900 mb-4">
          Rating Distribution
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const distribution = analytics.ratingDistribution.find(
              (d) => d.rating === rating
            );
            const percentage = distribution?.percentage || 0;
            const count = distribution?.count || 0;

            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-8">
                  <span className="text-sm font-medium text-nude-700">
                    {rating}
                  </span>
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1 bg-nude-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300 duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center space-x-2 w-20">
                  <span className="text-sm text-nude-500">{count}</span>
                  <span className="text-sm text-nude-500">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Ratings */}
      <div className="bg-nude-50 card shadow-2xl card-body">
        <h3 className="text-lg font-semibold text-nude-900 mb-4">
          Category Ratings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.categoryRatings.map((category) => (
            <div
              key={category.category}
              className="border border-nude-200 card card-body"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-nude-900">
                  {category.category}
                </h4>
                <span className="text-sm text-nude-500">
                  ({category.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <StarRating
                  rating={parseFloat(category.averageRating)}
                  size="sm"
                  showLabel={false}
                />
                <span className="text-sm font-medium text-nude-900">
                  {category.averageRating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-nude-50 card shadow-2xl card-body">
        <h3 className="text-lg font-semibold text-nude-900 mb-4">
          Sentiment Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.sentiment.map((sentiment) => (
            <div key={sentiment.sentiment} className="text-center">
              <div
                className={`inline-flex items-center badge badge-md rounded-full text-sm font-medium ${getSentimentColor(sentiment.sentiment)}`}
              >
                {sentiment.sentiment}
              </div>
              <p className="mt-2 text-2xl font-bold text-nude-900">
                {sentiment.count}
              </p>
              <p className="text-sm text-nude-500">
                {sentiment.percentage.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-nude-50 card shadow-2xl card-body">
        <h3 className="text-lg font-semibold text-nude-900 mb-4">
          Recent Reviews
        </h3>
        <div className="space-y-4">
          {analytics.recentReviews.map((review) => (
            <div
              key={review.id}
              className="border border-nude-200 card card-body"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-nude-900">
                      {review.customerName}
                    </h4>
                    <StarRating
                      rating={review.rating}
                      size="sm"
                      showLabel={false}
                    />
                    {review.isVerified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-success">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-nude-700 text-sm mb-2">
                    {review.reviewText}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-nude-500">
                    <span>Order: {review.orderNumber}</span>
                    <span>Amount: N${review.orderAmount.toFixed(2)}</span>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <button className="text-nude-600 hover:text-nude-800 text-sm font-medium">
                    Respond
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
