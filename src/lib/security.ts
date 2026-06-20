/**
 * Security Utilities
 * Input validation, sanitization, rate limiting, and security helpers.
 */

/* ─── Input Sanitization ─── */

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strip HTML tags from input
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Check for open redirect vulnerabilities
 */
export function isSafeRedirect(url: string, allowedDomains: string[]): boolean {
  try {
    const parsed = new URL(url);
    // Allow relative URLs
    if (url.startsWith('/') && !url.startsWith('//')) return true;
    return allowedDomains.some(domain => parsed.hostname === domain);
  } catch {
    // Relative URL
    return url.startsWith('/') && !url.startsWith('//');
  }
}

/* ─── Rate Limiting ─── */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check rate limit for a given key
 * Returns true if request is allowed, false if rate limited
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 60,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

/* ─── File Validation ─── */

const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.msi', '.scr', '.pif',
  '.php', '.php3', '.php4', '.php5', '.phtml',
  '.js', '.vbs', '.vbe', '.wsf', '.wsh',
  '.sh', '.bash', '.csh', '.ksh',
  '.py', '.pl', '.rb', '.cgi',
  '.jsp', '.jspx', '.asp', '.aspx', '.cer',
  '.dll', '.so', '.dylib',
  '.jar', '.class',
  '.cmd', '.com', '.ps1', '.psm1',
];

const SAFE_MIME_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'image/bmp': ['.bmp'],
  'application/pdf': ['.pdf'],
  'application/zip': ['.zip'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  'application/json': ['.json'],
  'text/html': ['.html', '.htm'],
  'text/markdown': ['.md'],
};

/**
 * Validate file upload
 */
export function validateFileUpload(
  filename: string,
  mimeType: string,
  fileSize: number,
  maxSizeBytes: number = 50 * 1024 * 1024 // 50MB default
): { valid: boolean; error?: string } {
  // Check file extension
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `File type "${ext}" is not allowed for security reasons.` };
  }

  // Check MIME type
  const allowedMimes = SAFE_MIME_TYPES[mimeType];
  if (!allowedMimes) {
    return { valid: false, error: `MIME type "${mimeType}" is not supported.` };
  }

  if (!allowedMimes.includes(ext)) {
    return { valid: false, error: `File extension "${ext}" does not match MIME type "${mimeType}".` };
  }

  // Check file size
  if (fileSize > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    return { valid: false, error: `File size exceeds maximum of ${maxSizeMB}MB.` };
  }

  return { valid: true };
}

/**
 * Generate safe filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 255);
}

/* ─── Honeypot ─── */

/**
 * Generate honeypot field name
 */
export function generateHoneypotFieldName(): string {
  return `_hp_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Check honeypot field
 */
export function checkHoneypot(fieldName: string, fieldValue: string): boolean {
  // If honeypot field has a value, it's a bot
  return fieldValue === '';
}

/* ─── Content Security ─── */

/**
 * Generate nonce for inline scripts
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Validate Content-Type header
 */
export function isValidContentType(contentType: string | null, allowed: string[]): boolean {
  if (!contentType) return false;
  return allowed.some(type => contentType.toLowerCase().includes(type));
}
