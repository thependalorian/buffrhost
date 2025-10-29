export const trackPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', entry.value);
        }
      }
    });

    observer.observe({
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'],
    });
  }
};

// Track conversion events
export const trackConversion = (eventName: string, variant?: string) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as unknown).gtag('event', eventName, {
      event_category: 'conversion',
      event_label: variant,
      value: 1,
    });
  }
};

// Track A/B test events
export const trackABTest = (
  testName: string,
  variant: string,
  action: string
) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as unknown).gtag('event', 'ab_test', {
      test_name: testName,
      variant: variant,
      action: action,
    });
  }
};

// Track color psychology metrics
export const trackColorPsychology = (
  element: string,
  color: string,
  action: string
) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as unknown).gtag('event', 'color_psychology', {
      element: element,
      color: color,
      action: action,
    });
  }
};
