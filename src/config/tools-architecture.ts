/**
 * Tools Architecture Index
 * Central export for the scalable tool architecture
 */

// Tool Config Database
export {
  TOOLS_DATABASE,
  getToolConfig,
  getToolConfigBySlug,
  getToolsByCategory,
  getPopularTools,
  getTrendingTools,
  getFeaturedTools,
  searchTools,
  getAllToolIds,
} from './tools-config';

export type { ToolConfig, ToolFAQ, ToolFeature, ToolBenefit, ToolHowToStep } from './tools-config';

// Common Tool Template
export { default as CommonToolTemplate } from '../components/tools/CommonToolTemplate';

// Reusable UI Components
export {
  ToolCard,
  UploadBox,
  DownloadButton,
  CopyButton,
  ShareButton,
  LoadingAnimation,
  LoadingSkeleton,
  LoadingSpinner,
  ToastNotification,
  showToast,
  ErrorState,
  EmptyState,
} from '../components/ui';

// SEO Utilities
export {
  generateToolSEO,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateSoftwareSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateCollectionSchema,
  generateMetaTagsHTML,
} from '../lib/seo-utils';

// Performance Utilities
export {
  lazyLoad,
  getOptimizedImageUrl,
  preloadResource,
  prefetchRoute,
  debounce,
  throttle,
  isWebPSupported,
  formatFileSize,
  formatDuration,
} from '../lib/performance';
