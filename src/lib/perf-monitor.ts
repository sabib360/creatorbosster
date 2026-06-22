/**
 * CreatorBoost AI — Performance Monitoring System
 * Core Web Vitals tracking, LCP, CLS, INP, TTFB monitoring
 * Reports to analytics and provides real-time insights
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  timestamp: number;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  score: number;
  timestamp: string;
  url: string;
  userAgent: string;
}

// ═══════════════════════════════════════════════════════════════════
// CORE WEB VITALS THRESHOLDS
// ═══════════════════════════════════════════════════════════════════

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
} as const;

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// ═══════════════════════════════════════════════════════════════════
// METRICS STORE
// ═══════════════════════════════════════════════════════════════════

const metricsStore: PerformanceMetric[] = [];
const listeners: Array<(metric: PerformanceMetric) => void> = [];

function processMetric(metric: Metric) {
  const perfMetric: PerformanceMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    timestamp: Date.now(),
  };

  metricsStore.push(perfMetric);
  listeners.forEach((l) => l(perfMetric));

  // Log to console in development
  if (import.meta.env.DEV) {
    const color = perfMetric.rating === 'good' ? '🟢' : perfMetric.rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(
      `${color} [Performance] ${metric.name}: ${Math.round(metric.value)}ms (${perfMetric.rating})`
    );
  }
}

// ═══════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════

export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  try {
    onLCP(processMetric);
    onCLS(processMetric);
    onINP(processMetric);
    onFCP(processMetric);
    onTTFB(processMetric);
  } catch (e) {
    console.warn('[Performance] Failed to initialize monitoring:', e);
  }
}

export function onMetric(callback: (metric: PerformanceMetric) => void) {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

export function getMetrics(): PerformanceMetric[] {
  return [...metricsStore];
}

export function getMetricByName(name: string): PerformanceMetric | undefined {
  return metricsStore.find((m) => m.name === name);
}

export function generateReport(): PerformanceReport {
  const score = calculatePerformanceScore();

  return {
    metrics: [...metricsStore],
    score,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };
}

function calculatePerformanceScore(): number {
  if (metricsStore.length === 0) return 0;

  const weights: Record<string, number> = {
    LCP: 0.3,
    CLS: 0.25,
    INP: 0.25,
    FCP: 0.1,
    TTFB: 0.1,
  };

  let totalWeight = 0;
  let weightedScore = 0;

  for (const metric of metricsStore) {
    const weight = weights[metric.name] || 0;
    if (weight === 0) continue;

    const score = metric.rating === 'good' ? 100 : metric.rating === 'needs-improvement' ? 50 : 0;
    weightedScore += score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
}

// ═══════════════════════════════════════════════════════════════════
// RESOURCE TIMING
// ═══════════════════════════════════════════════════════════════════

export function getResourceTimings(): Array<{
  name: string;
  duration: number;
  transferSize: number;
  type: string;
}> {
  if (typeof window === 'undefined' || !window.performance) return [];

  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  return entries
    .map((e) => ({
      name: e.name.split('/').pop() || e.name,
      duration: Math.round(e.duration),
      transferSize: e.transferSize,
      type: e.initiatorType,
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 20);
}

// ═══════════════════════════════════════════════════════════════════
// LAYOUT SHIFT TRACKING
// ═══════════════════════════════════════════════════════════════════

let clsValue = 0;
let clsEntries: PerformanceEntry[] = [];

export function trackLayoutShift() {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          clsEntries.push(entry);
        }
      }
    });
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch {
    // Layout shift not supported
  }
}

export function getLayoutShiftScore() {
  return {
    value: clsValue,
    entries: clsEntries.length,
  };
}

// ═══════════════════════════════════════════════════════════════════
// LONG TASK DETECTION
// ═══════════════════════════════════════════════════════════════════

export function detectLongTasks(threshold = 50) {
  if (typeof window === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > threshold) {
          console.warn(
            `[Performance] Long task detected: ${Math.round(entry.duration)}ms`
          );
        }
      }
    });
    observer.observe({ type: 'longtask', buffered: true });
  } catch {
    // Long task observer not supported
  }
}
