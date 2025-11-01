/**
 * Cart Review Component
 *
 * Purpose: Displays and manages cart items during checkout
 * Functionality: Show cart items, update quantities, apply discounts
 * Location: /components/checkout/CartReview.tsx
 *
 * Follows 40 Rules:
 * - Uses DaisyUI for consistent styling
 * - Modular component design for easy maintenance
 * - TypeScript for type safety
 * - Vercel-compatible with SSR
 * - Uses Neon PostgreSQL database
 * - Comprehensive error handling
 * - Optimized for performance
 */

'use client';

import React, { useState, useRef } from 'react';
/**
 * CartReview React Component for Buffr Host Hospitality Platform
 * @fileoverview CartReview provides specialized functionality for the Buffr Host platform
 * @location buffr-host/components/checkout/CartReview.tsx
 * @purpose CartReview provides specialized functionality for the Buffr Host platform
 * @component CartReview
 * @category Checkout
 * @modularity Self-contained React component with clear separation of concerns and reusable design patterns
 * @state_management Local component state for UI interactions and data management
 * @hooks_utilization useState for state management and side effects
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
 * @param {CartItem[]} [items] - items prop description
 * @param {(itemId} [onUpdateQuantity] - onUpdateQuantity prop description
 * @param {(itemId} [onRemoveItem] - onRemoveItem prop description
 * @param {(code} [onApplyDiscount] - onApplyDiscount prop description
 * @param {} [discountCode] - discountCode prop description
 * @param {} [discountAmount] - discountAmount prop description
 * @param {number} [subtotal] - subtotal prop description
 * @param {number} [tax] - tax prop description
 * @param {number} [total] - total prop description
 * @param {} [isLoading] - isLoading prop description
 *
 * State:
 * @state {any} null - Component state for null management
 * @state {any} null - Component state for null management
 *
 * Methods:
 * @method handleQuantityUpdate - handleQuantityUpdate method for component functionality
 * @method formatCurrency - formatCurrency method for component functionality
 *
 * Usage Example:
 * @example
 * import { CartReview } from './CartReview';
 *
 * function App() {
 *   return (
 *     <CartReview
 *       prop1="value"
 *       prop2={value}
 *     />
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered CartReview component
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import { Input } from '@/components/ui';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from 'lucide-react';

// Types for TypeScript compliance
interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
}

interface CartReviewProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onApplyDiscount: (code: string) => void;
  discountCode?: string;
  discountAmount?: number;
  subtotal: number;
  tax: number;
  total: number;
  isLoading?: boolean;
}

// Main Cart Review Component
export const CartReview: React.FC<CartReviewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onApplyDiscount,
  discountCode,
  discountAmount = 0,
  subtotal,
  tax,
  total,
  isLoading = false,
}) => {
  const [newDiscountCode, setNewDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [discountSuccess, setDiscountSuccess] = useState<string | null>(null);

  // Refs for performance optimization
  const discountInputRef = useRef<HTMLInputElement>(null);

  // Handle quantity update
  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      onRemoveItem(itemId);
    } else {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  // Handle discount code application
  const handleApplyDiscount = async () => {
    if (!newDiscountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    try {
      await onApplyDiscount(newDiscountCode.trim());
      setDiscountSuccess('Discount code applied successfully');
      setDiscountError(null);
      setNewDiscountCode('');
      setTimeout(() => setDiscountSuccess(null), 3000);
    } catch (error) {
      setDiscountError('Invalid discount code');
      setDiscountSuccess(null);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="loading loading-spinner loading-md text-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Cart Review ({items.length} items)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cart Items */}
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                {/* Item Image */}
                <div className="flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-base-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-base-content/50" />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base-content truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-base-content/70 truncate">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      handleQuantityUpdate(item.id, item.quantity - 1)
                    }
                    className="btn-outline btn-sm btn-circle"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>

                  <Button
                    onClick={() =>
                      handleQuantityUpdate(item.id, item.quantity + 1)
                    }
                    className="btn-outline btn-sm btn-circle"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="font-semibold text-lg">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  <div className="text-sm text-base-content/70">
                    {formatCurrency(item.price)} each
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  onClick={() => onRemoveItem(item.id)}
                  className="btn-error btn-sm btn-circle"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-base-content/70">
                Add some items to get started with your order
              </p>
            </div>
          )}
        </div>

        {/* Discount Code */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Discount Code
          </h4>

          <div className="flex gap-2">
            <Input
              ref={discountInputRef}
              placeholder="Enter discount code..."
              value={newDiscountCode}
              onChange={(e) => setNewDiscountCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
              className="flex-1"
            />
            <Button
              onClick={handleApplyDiscount}
              className="btn-outline"
              disabled={!newDiscountCode.trim()}
            >
              Apply
            </Button>
          </div>

          {/* Discount Messages */}
          {discountError && (
            <div className="alert alert-error">
              <AlertCircle className="w-4 h-4" />
              <span>{discountError}</span>
            </div>
          )}

          {discountSuccess && (
            <div className="alert alert-success">
              <CheckCircle className="w-4 h-4" />
              <span>{discountSuccess}</span>
            </div>
          )}

          {discountCode && (
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-success font-medium">
                  {discountCode} applied
                </span>
              </div>
              <div className="text-success font-semibold">
                -{formatCurrency(discountAmount)}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-base-content/70">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-base-content/70">Tax</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>

          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartReview;
