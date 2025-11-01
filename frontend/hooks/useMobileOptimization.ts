'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Mobile Optimization Hook
 *
 * Provides utilities for mobile-specific optimizations including
 * viewport detection, touch capabilities, and performance optimizations.
 *
 * Location: hooks/useMobileOptimization.ts
 */

export interface MobileCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  hasCoarsePointer: boolean;
  prefersReducedMotion: boolean;
  prefersReducedData: boolean;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  isOnline: boolean;
  connectionSpeed: 'slow' | 'fast' | 'unknown';
}

export interface TouchCapabilities {
  maxTouchPoints: number;
  touchAction: boolean;
  hover: boolean;
}

export const useMobileOptimization = () => {
  const [capabilities, setCapabilities] = useState<MobileCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    hasCoarsePointer: false,
    prefersReducedMotion: false,
    prefersReducedData: false,
    viewportWidth: 0,
    viewportHeight: 0,
    devicePixelRatio: 1,
    isOnline: true,
    connectionSpeed: 'unknown',
  });

  const [touchCapabilities, setTouchCapabilities] = useState<TouchCapabilities>(
    {
      maxTouchPoints: 0,
      touchAction: false,
      hover: true,
    }
  );

  // Detect device type based on screen size and capabilities
  const detectDeviceType = useCallback(
    (width: number, hasTouch: boolean, hasCoarsePointer: boolean) => {
      if (width < 640) {
        return { isMobile: true, isTablet: false, isDesktop: false };
      } else if (width < 1024 || hasCoarsePointer) {
        return { isMobile: false, isTablet: true, isDesktop: false };
      } else {
        return { isMobile: false, isTablet: false, isDesktop: true };
      }
    },
    []
  );

  // Detect connection speed
  const detectConnectionSpeed = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          return 'slow';
        } else if (effectiveType === '3g') {
          return 'slow';
        } else {
          return 'fast';
        }
      }
    }
    return 'unknown';
  }, []);

  // Update capabilities
  const updateCapabilities = useCallback(() => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Detect touch and pointer capabilities
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const touchAction = 'touchAction' in document.documentElement.style;
    const hover = window.matchMedia('(hover: hover)').matches;

    // Detect user preferences
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const prefersReducedData = window.matchMedia(
      '(prefers-reduced-data: reduce)'
    ).matches;

    // Device type detection
    const deviceType = detectDeviceType(
      viewportWidth,
      hasTouch,
      hasCoarsePointer
    );

    // Connection detection
    const connectionSpeed = detectConnectionSpeed();

    setCapabilities({
      ...deviceType,
      hasTouch,
      hasCoarsePointer,
      prefersReducedMotion,
      prefersReducedData,
      viewportWidth,
      viewportHeight,
      devicePixelRatio,
      isOnline: navigator.onLine,
      connectionSpeed,
    });

    setTouchCapabilities({
      maxTouchPoints,
      touchAction,
      hover,
    });
  }, [detectDeviceType, detectConnectionSpeed]);

  // Initialize and listen for changes
  useEffect(() => {
    updateCapabilities();

    const handleResize = () => updateCapabilities();
    const handleOnline = () =>
      setCapabilities((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setCapabilities((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for media query changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dataQuery = window.matchMedia('(prefers-reduced-data: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');
    const hoverQuery = window.matchMedia('(hover: hover)');

    const handlePreferenceChange = () => updateCapabilities();

    motionQuery.addEventListener('change', handlePreferenceChange);
    dataQuery.addEventListener('change', handlePreferenceChange);
    pointerQuery.addEventListener('change', handlePreferenceChange);
    hoverQuery.addEventListener('change', handlePreferenceChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      motionQuery.removeEventListener('change', handlePreferenceChange);
      dataQuery.removeEventListener('change', handlePreferenceChange);
      pointerQuery.removeEventListener('change', handlePreferenceChange);
      hoverQuery.removeEventListener('change', handlePreferenceChange);
    };
  }, [updateCapabilities]);

  // Performance optimization utilities
  const shouldLoadHighQuality = useCallback(() => {
    return (
      capabilities.isOnline &&
      capabilities.connectionSpeed === 'fast' &&
      !capabilities.prefersReducedData
    );
  }, [capabilities]);

  const getImageSize = useCallback(
    (baseSize: number) => {
      const ratio = capabilities.devicePixelRatio;
      return Math.round(baseSize * ratio);
    },
    [capabilities.devicePixelRatio]
  );

  const shouldUseLazyLoading = useCallback(() => {
    return (
      capabilities.connectionSpeed === 'slow' || capabilities.prefersReducedData
    );
  }, [capabilities]);

  return {
    capabilities,
    touchCapabilities,
    shouldLoadHighQuality,
    getImageSize,
    shouldUseLazyLoading,
    updateCapabilities,
  };
};

/**
 * Hook for mobile viewport height handling
 * Fixes issues with mobile browsers hiding/showing address bars
 */
export const useMobileViewportHeight = () => {
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return viewportHeight;
};

/**
 * Hook for mobile-specific scroll behavior
 */
export const useMobileScroll = (threshold: number = 50) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(
    null
  );
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > threshold);

      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, lastScrollY]);

  return { isScrolled, scrollDirection };
};
