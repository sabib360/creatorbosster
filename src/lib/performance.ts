/**
 * Performance Utilities
 * Lazy loading, code splitting, and optimization helpers
 */

import { lazy, ComponentType } from 'react';

/* ─── Lazy Load Component ──────────────────────── */

export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(factory);
}

/* ─── Image Optimization ───────────────────────── */

export function getOptimizedImageUrl(
  src: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'png' | 'jpg';
  }
): string {
  const { width, height, quality = 80, format = 'webp' } = options || {};

  // For external URLs, return as-is
  if (src.startsWith('http')) return src;

  // Build optimized URL
  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  if (height) params.set('h', String(height));
  params.set('q', String(quality));
  params.set('f', format);

  return `${src}?${params.toString()}`;
}

/* ─── Preload Resource ─────────────────────────── */

export function preloadResource(
  href: string,
  as: 'image' | 'style' | 'script' | 'font',
  type?: string
) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
}

/* ─── Prefetch Route ───────────────────────────── */

export function prefetchRoute(path: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  document.head.appendChild(link);
}

/* ─── Debounce ─────────────────────────────────── */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/* ─── Throttle ─────────────────────────────────── */

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* ─── Intersection Observer Hook Helper ────────── */

export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return null;
  return new IntersectionObserver(callback, options);
}

/* ─── Request Idle Callback Polyfill ───────────── */

export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (callback: IdleRequestCallback) => setTimeout(callback, 1);

export const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : clearTimeout;

/* ─── WebP Support Detection ───────────────────── */

let webpSupported: boolean | null = null;

export function isWebPSupported(): Promise<boolean> {
  if (webpSupported !== null) return Promise.resolve(webpSupported);

  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      webpSupported = img.width > 0 && img.height > 0;
      resolve(webpSupported);
    };
    img.onerror = () => {
      webpSupported = false;
      resolve(false);
    };
    img.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiFmf4B8=';
  });
}

/* ─── Format File Size ─────────────────────────── */

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/* ─── Format Duration ──────────────────────────── */

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
