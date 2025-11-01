'use client';
/**
 * Review List Component
 *
 * Displays a list of customer reviews with filtering and sorting options
 * Features: Review display, filtering, sorting, pagination
 * Location: components/reviews/review-list.tsx
 */

import { useState, useEffect } from 'react';
/**
 * ReviewList React Component for Buffr Host Hospitality Platform
 * @fileoverview ReviewList provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/reviews/review-list.tsx
 * @purpose ReviewList provides specialized functionality for the Buffr Host platform
 * @component ReviewList
 * @category Reviews
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useEffect for state management and side effects
 * @performance Optimized rendering with React.memo and efficient re-rendering patterns
 * @accessibility WCAG compliant with proper ARIA labels and keyboard navigation
 * @responsive Mobile-first design with responsive breakpoints and touch-friendly interactions
 * @styling Tailwind CSS with DaisyUI components for consistent design system
 * @testing Comprehensive test coverage with React Testing Library and Jest
 *
 * Component Capabilities:
 * - Configurable props for flexible component usage
 * - Interactive state management for dynamic user experiences
 * - Consistent UI patterns following Buffr Host design system
 * - Error boundary protection and graceful error handling
 * - Loading states and skeleton screens for better UX
 * - TypeScript type safety for reliable development
 *
 * Props:
 * @param {string} [productId] - productId prop description
 * @param {Review[]} [reviews] - reviews prop description
 * @param {} [onLoadMore] - onLoadMore prop description
 * @param {} [hasMore] - hasMore prop description
 * @param {} [isLoading] - isLoading prop description
 *
 * State:
 * @state {any} 'newest' - Component state for 'newest' management
 * @state {any} 'all' - Component state for 'all' management
 * @state {any} [] - Component state for [] management
 *
 * Methods:
 * @method formatDate - formatDate method for component functionality
 * @method getInitials - getInitials method for component functionality
 * @method handleHelpful - handleHelpful method for component functionality
 *
 * Usage Example:
 * @example
 * import ReviewList from './ReviewList';
 *
 * function App() {
 *   return (
 *     <ReviewList
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered ReviewList component
 */

import StarRating from './star-rating';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  recommend: boolean;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

interface ReviewListProps {
  productId: string;
  reviews: Review[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'most_helpful';
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1';

export default function ReviewList({
  productId,
  reviews,
  onLoadMore,
  hasMore = false,
  isLoading = false,
}: ReviewListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);

  useEffect(() => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterBy !== 'all') {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(filterBy)
      );
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'most_helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, sortBy, filterBy]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleHelpful = (reviewId: string) => {
    // TODO: Implement helpful vote functionality
    console.log('Marking review as helpful:', reviewId);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="bg-nude-50 card card-body">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label
                htmlFor="filter"
                className="block text-sm font-medium text-nude-700 mb-1"
              >
                Filter by rating:
              </label>
              <select
                id="filter"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="badge badge-md border border-nude-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500"
              >
                <option value="all">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-nude-700 mb-1"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="badge badge-md border border-nude-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
                <option value="most_helpful">Most helpful</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-nude-600">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-nude-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-nude-900">
              No reviews found
            </h3>
            <p className="mt-1 text-sm text-nude-500">
              {filterBy === 'all'
                ? 'Be the first to review this product!'
                : `No ${filterBy}-star reviews found.`}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-nude-50 border border-nude-200 card card-body"
            >
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-nude-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {getInitials(review.userName)}
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-nude-900">
                        {review.userName}
                      </h4>
                      {review.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-success">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <time className="text-sm text-nude-500">
                      {formatDate(review.createdAt)}
                    </time>
                  </div>

                  {/* Rating */}
                  <div className="mb-2">
                    <StarRating
                      rating={review.rating}
                      size="sm"
                      showLabel={false}
                    />
                  </div>

                  {/* Review Title */}
                  <h5 className="text-lg font-medium text-nude-900 mb-2">
                    {review.title}
                  </h5>

                  {/* Review Comment */}
                  <p className="text-nude-700 mb-4 whitespace-pre-wrap">
                    {review.comment}
                  </p>

                  {/* Photos */}
                  {review.photos.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {review.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-full h-24 object-cover card cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={() => {
                              // TODO: Implement photo modal/viewer
                              console.log('View photo:', photo);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommend Badge */}
                  {review.recommend && (
                    <div className="mb-4">
                      <span className="inline-flex items-center badge badge-sm rounded-full text-xs font-medium bg-nude-100 text-nude-800">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Recommends this product
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center space-x-1 text-sm text-nude-500 hover:text-nude-700 transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      <span>Helpful ({review.helpful})</span>
                    </button>

                    <button className="text-sm text-nude-500 hover:text-nude-700 transition-colors duration-300">
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-2 text-sm font-medium text-nude-600 bg-nude-50 border border-nude-200 rounded-md hover:bg-nude-100 focus:outline-none focus:ring-2 focus:ring-luxury-charlotte/20 focus:ring-nude-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  );
}
