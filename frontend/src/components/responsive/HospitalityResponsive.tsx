"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { 
  Menu, 
  X, 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  Grid,
  List,
  Search,
  Filter,
  Plus,
  Minus
} from "lucide-react";

interface MobileFirstNavigationProps {
  logo: React.ReactNode;
  menuItems: Array<{
    label: string;
    href: string;
    icon?: React.ComponentType<any>;
  }>;
  userMenu?: React.ReactNode;
}

export function MobileFirstNavigation({ 
  logo, 
  menuItems, 
  userMenu 
}: MobileFirstNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-luxury-soft sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            {logo}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-nude-700 hover:text-nude-900 transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {userMenu}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-nude-700 hover:text-nude-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-nude-200 py-4">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-nude-700 hover:bg-nude-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

interface BottomNavigationProps {
  items: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    href?: string;
  }>;
  activeItem: string;
  onItemClick?: (itemId: string) => void;
}

export function BottomNavigation({ 
  items, 
  activeItem, 
  onItemClick 
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-nude-200 md:hidden z-40">
      <div className="grid grid-cols-5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={`flex flex-col items-center py-3 transition-colors ${
              activeItem === item.id
                ? 'text-nude-900'
                : 'text-nude-600 hover:text-nude-900'
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface SwipeableImageGalleryProps {
  images: string[];
  alt: string;
  onImageChange?: (index: number) => void;
}

export function SwipeableImageGallery({ 
  images, 
  alt, 
  onImageChange 
}: SwipeableImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex < images.length - 1) {
        // Swipe left - next image
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous image
        setCurrentIndex(currentIndex - 1);
      }
    }
    
    setIsDragging(false);
    onImageChange?.(currentIndex);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      onImageChange?.(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      onImageChange?.(currentIndex + 1);
    }
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex === images.length - 1}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                onImageChange?.(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-nude-600' : 'bg-nude-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface StickyBookingBarProps {
  price: number;
  onBook: () => void;
  isVisible?: boolean;
}

export function StickyBookingBar({ 
  price, 
  onBook, 
  isVisible = true 
}: StickyBookingBarProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-nude-200 shadow-luxury-soft md:hidden z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-nude-600">Starting from</div>
            <div className="text-2xl font-bold text-nude-900">N$ {price}</div>
          </div>
          <Button onClick={onBook} className="px-8">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CollapsibleDetailsProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleDetails({ 
  title, 
  children, 
  defaultOpen = false 
}: CollapsibleDetailsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-nude-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-nude-50 transition-colors"
      >
        <span className="font-medium text-nude-900">{title}</span>
        <div className={`transform transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}>
          <ChevronLeft className="w-5 h-5 text-nude-600" />
        </div>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 border-t border-nude-200">
          {children}
        </div>
      )}
    </div>
  );
}

interface TabletSplitViewProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
}

export function TabletSplitView({ 
  leftContent, 
  rightContent, 
  leftTitle, 
  rightTitle 
}: TabletSplitViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        {leftTitle && (
          <h3 className="text-lg font-semibold text-nude-900 mb-4">{leftTitle}</h3>
        )}
        {leftContent}
      </div>
      <div>
        {rightTitle && (
          <h3 className="text-lg font-semibold text-nude-900 mb-4">{rightTitle}</h3>
        )}
        {rightContent}
      </div>
    </div>
  );
}

interface ResponsiveGridProps {
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveGrid({ 
  columns, 
  children, 
  className = "" 
}: ResponsiveGridProps) {
  const gridClasses = `
    grid gap-4
    grid-cols-${columns.mobile}
    md:grid-cols-${columns.tablet}
    lg:grid-cols-${columns.desktop}
    ${className}
  `;

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

interface PullToRefreshProps {
  onRefresh: () => void;
  children: React.ReactNode;
  isRefreshing?: boolean;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  isRefreshing = false 
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    setPullDistance(distance);
  };

  const handleTouchEnd = () => {
    if (pullDistance > 100) {
      onRefresh();
    }
    setPullDistance(0);
    setIsPulling(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 ${
          isPulling ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          height: `${Math.min(pullDistance, 100)}px`,
          transform: `translateY(-${Math.min(pullDistance, 100)}px)`
        }}
      >
        <div className="flex items-center space-x-2 text-nude-600">
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm">
            {pullDistance > 100 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      <div style={{ paddingTop: isPulling ? `${Math.min(pullDistance, 100)}px` : '0' }}>
        {children}
      </div>
    </div>
  );
}