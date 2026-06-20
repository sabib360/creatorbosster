/**
 * Performance Monitor
 * Tracks Core Web Vitals and performance metrics.
 */

import { useEffect } from 'react';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
    INP: [200, 500],
    TTI: [3800, 7300],
    TBT: [200, 600],
  };

  const [good, poor] = thresholds[name] || [0, 0];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

function logMetric(metric: Metric) {
  if (import.meta.env.DEV) {
    const colors = {
      good: '#22c55e',
      'needs-improvement': '#f59e0b',
      poor: '#ef4444',
    };
    console.log(
      `%c${metric.name}%c ${metric.value.toFixed(2)}ms (${metric.rating})`,
      `color: ${colors[metric.rating]}; font-weight: bold`,
      'color: inherit'
    );
  }

  // Send to analytics in production
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    try {
      // @ts-ignore
      window.gtag?.('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    } catch {}
  }
}

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observers: PerformanceObserver[] = [];

    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        const value = lastEntry.startTime;
        logMetric({
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
          delta: value,
          id: `lcp-${Date.now()}`,
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObserver);
    } catch {}

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          const value = entry.processingStart - entry.startTime;
          logMetric({
            name: 'FID',
            value,
            rating: getRating('FID', value),
            delta: value,
            id: `fid-${Date.now()}`,
          });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observers.push(fidObserver);
    } catch {}

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        logMetric({
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: clsValue,
          id: `cls-${Date.now()}`,
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObserver);
    } catch {}

    // FCP - First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          logMetric({
            name: 'FCP',
            value: entry.startTime,
            rating: getRating('FCP', entry.startTime),
            delta: entry.startTime,
            id: `fcp-${Date.now()}`,
          });
        });
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      observers.push(fcpObserver);
    } catch {}

    // TTFB - Time to First Byte
    try {
      const ttfbObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          const value = entry.responseStart - entry.requestStart;
          if (value > 0) {
            logMetric({
              name: 'TTFB',
              value,
              rating: getRating('TTFB', value),
              delta: value,
              id: `ttfb-${Date.now()}`,
            });
          }
        });
      });
      ttfbObserver.observe({ type: 'navigation', buffered: true });
      observers.push(ttfbObserver);
    } catch {}

    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, []);

  return null;
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  if (typeof document === 'undefined') return;

  // Preload fonts
  const fonts = [
    '/fonts/inter-var.woff2',
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Prefetch next page resources
 */
export function prefetchPage(href: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}
