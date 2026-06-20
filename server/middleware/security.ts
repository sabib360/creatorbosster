/**
 * Security Headers Middleware
 * Adds comprehensive security headers to all responses.
 */

import { type Request, type Response, type NextFunction } from 'express';

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy - restrict dangerous browser features
  res.setHeader('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'battery=()',
    'bluetooth=()',
    'display-capture=()',
    'document-domain=()',
    'encrypted-media=()',
    'execution-while-not-rendered=()',
    'execution-while-out-of-viewport=()',
    'fullscreen=()',
    'gamepad=()',
    'layout-animations=()',
    'legacy-image-formats=()',
    'midi=()',
    'oversized-images=()',
    'picture-in-picture=()',
    'speaker=()',
    'sync-xhr=()',
    'unoptimized-images=()',
    'unsized-media=()',
    'screen-wake-lock=()',
    'web-share=()',
    'xr-spatial-tracking=()',
  ].join(', '));

  // HSTS - Force HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // DNS Prefetch Control
  res.setHeader('X-DNS-Prefetch-Control', 'on');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' blob:",
    "connect-src 'self' https://www.google-analytics.com https://firebaseinstallations.googleapis.com https://fcmregistrations.googleapis.com https://firebase.googleapis.com https://firestore.googleapis.com",
    "frame-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);

  // Prevent caching of sensitive data
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }

  next();
}

/**
 * Rate limiting middleware
 */
export function createRateLimiter(options: {
  windowMs?: number;
  max?: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
} = {}) {
  const {
    windowMs = 60 * 1000,
    max = 100,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => req.ip || req.socket.remoteAddress || 'unknown',
  } = options;

  const store = new Map<string, { count: number; resetTime: number }>();

  // Cleanup old entries periodically
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(key);
      }
    }
  }, windowMs);

  // Prevent memory leak
  if (cleanup.unref) cleanup.unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(max - 1));
      return next();
    }

    if (entry.count >= max) {
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('Retry-After', String(Math.ceil((entry.resetTime - now) / 1000)));
      return res.status(429).json({ error: message });
    }

    entry.count++;
    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(max - entry.count));
    next();
  };
}

/**
 * Input validation middleware
 */
export function validateBody(allowedFields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
      const keys = Object.keys(req.body);
      const disallowed = keys.filter(k => !allowedFields.includes(k));
      if (disallowed.length > 0) {
        return res.status(400).json({
          error: 'Unexpected fields in request body',
          fields: disallowed,
        });
      }
    }
    next();
  };
}
