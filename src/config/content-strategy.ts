/**
 * CreatorBoost AI - Content Strategy Index
 * Central export for all strategy modules
 */

// Keyword Research
export {
  PRIMARY_KEYWORDS,
  LONG_TAIL_KEYWORDS,
  KEYWORD_CLUSTERS,
  INTENT_DISTRIBUTION,
  getKeywordsByCategory,
  getKeywordsByIntent,
  getLowCompetitionKeywords,
  getHighVolumeKeywords,
  searchKeywords,
  getTotalEstimatedTraffic,
  type Keyword,
} from './keywords';

// Competitor Analysis
export {
  COMPETITORS,
  CONTENT_GAPS,
  OUR_ADVANTAGES,
  PRIORITY_ACTIONS,
  type Competitor,
} from './competitors';

// Link Building
export {
  GUEST_POST_OPPORTUNITIES,
  RESOURCE_PAGES,
  COMMUNITY_OPPORTUNITIES,
  INFLUENCER_OUTREACH,
  OUTREACH_TEMPLATES,
  LINK_BUILDING_CALENDAR,
  LINK_BUILDING_METRICS,
  type LinkBuildingOpportunity,
} from './link-building';

// Content Checklist
export {
  CONTENT_CHECKLIST,
  TOOL_PAGE_CHECKLIST,
  getChecklistByCategory,
  getRequiredItems,
  getChecklistProgress,
  generateChecklistReport,
  type ChecklistItem,
} from './content-checklist';

// Performance Tracking
export {
  TRAFFIC_KPIS,
  RANKING_KPIS,
  AUTHORITY_KPIS,
  ENGAGEMENT_KPIS,
  CONVERSION_KPIS,
  CONTENT_KPIS,
  WEEKLY_REPORT_TEMPLATE,
  MONTHLY_REPORT_TEMPLATE,
  ALERT_THRESHOLDS,
  getAllKPIs,
  getKPIsByCategory,
  calculateProgress,
  getKPIStatus,
  type KPI,
} from './performance-tracking';

// Quick Stats
export const STRATEGY_STATS = {
  totalKeywords: 500,
  primaryKeywords: 15,
  longTailKeywords: 100,
  competitorsAnalyzed: 10,
  guestPostTargets: 20,
  resourcePageTargets: 8,
  communityTargets: 8,
  influencerNiches: 4,
  checklistItems: 40,
  kpisTracked: 36,
  estimatedMonthlyTrafficTarget: 500000,
  estimatedMonthlyRevenueTarget: 60000,
};

// Priority Keywords for Quick Reference
export const TOP_20_KEYWORDS = [
  { keyword: 'qr code generator', volume: 200000, difficulty: 55, url: '/tools/qr-code-generator' },
  { keyword: 'image compressor online', volume: 100000, difficulty: 45, url: '/tools/image-compressor' },
  { keyword: 'background remover', volume: 80000, difficulty: 50, url: '/tools/ai-bg-remover' },
  { keyword: 'bmi calculator', volume: 80000, difficulty: 48, url: '/tools/bmi-calculator' },
  { keyword: 'color picker', volume: 70000, difficulty: 45, url: '/tools/color-converter' },
  { keyword: 'password generator', volume: 60000, difficulty: 38, url: '/tools/password-generator' },
  { keyword: 'unit converter', volume: 55000, difficulty: 50, url: '/tools/unit-converter' },
  { keyword: 'pdf merger', volume: 50000, difficulty: 40, url: '/tools/pdf-merger' },
  { keyword: 'emi calculator', volume: 45000, difficulty: 40, url: '/tools/loan-emi-calculator' },
  { keyword: 'pdf compressor', volume: 45000, difficulty: 42, url: '/tools/pdf-compressor' },
  { keyword: 'word counter', volume: 40000, difficulty: 30, url: '/tools/word-counter' },
  { keyword: 'youtube thumbnail downloader', volume: 35000, difficulty: 30, url: '/tools/youtube-thumbnail-downloader' },
  { keyword: 'pdf to word converter', volume: 30000, difficulty: 40, url: '/tools/pdf-to-word' },
  { keyword: 'youtube title generator', volume: 30000, difficulty: 35, url: '/tools/youtube-title-generator' },
  { keyword: 'json formatter', volume: 30000, difficulty: 28, url: '/tools/json-formatter' },
  { keyword: 'percentage calculator', volume: 25000, difficulty: 30, url: '/tools/percentage-calculator' },
  { keyword: 'base64 encoder', volume: 25000, difficulty: 32, url: '/tools/base64-encoder' },
  { keyword: 'sip calculator', volume: 18000, difficulty: 28, url: '/tools/sip-calculator' },
  { keyword: 'grammar checker', volume: 15000, difficulty: 30, url: '/tools/grammar-checker' },
  { keyword: 'age calculator', volume: 20000, difficulty: 25, url: '/tools/age-calculator' },
];

// 90-Day Content Calendar Summary
export const CONTENT_CALENDAR_90DAY = {
  blogPosts: { perWeek: 3, total: 36 },
  toolUpdates: { perMonth: 2, total: 6 },
  youtubeVideos: { perWeek: 1, total: 12 },
  socialPosts: { perDay: 1, total: 90 },
  newsletters: { perWeek: 1, total: 12 },
  totalContentPieces: 156,
};

// Content Calendar Week 1-4 Detail
export const MONTH_1_CONTENT = [
  { week: 1, day: 'Monday', title: 'How to Compress Images Without Losing Quality', category: 'Image', keyword: 'image compression' },
  { week: 1, day: 'Wednesday', title: 'Complete SEO Checklist for 2026', category: 'SEO', keyword: 'seo checklist' },
  { week: 1, day: 'Friday', title: 'How to Get First 1000 YouTube Subscribers', category: 'YouTube', keyword: 'youtube subscribers' },
  { week: 2, day: 'Monday', title: 'Best Image Formats for Web: JPG vs PNG vs WebP', category: 'Image', keyword: 'image formats' },
  { week: 2, day: 'Wednesday', title: 'How to Do Keyword Research for Free', category: 'SEO', keyword: 'keyword research' },
  { week: 2, day: 'Friday', title: 'YouTube SEO: Complete Guide to Ranking #1', category: 'YouTube', keyword: 'youtube seo' },
  { week: 3, day: 'Monday', title: 'How to Merge PDF Files (Complete Guide)', category: 'PDF', keyword: 'merge pdf' },
  { week: 3, day: 'Wednesday', title: 'On-Page SEO: 20 Optimization Tips', category: 'SEO', keyword: 'on page seo' },
  { week: 3, day: 'Friday', title: '10 YouTube Thumbnail Designs That Get 10%+ CTR', category: 'YouTube', keyword: 'youtube thumbnails' },
  { week: 4, day: 'Monday', title: 'PDF Compression: Reduce File Size by 90%', category: 'PDF', keyword: 'compress pdf' },
  { week: 4, day: 'Wednesday', title: 'Technical SEO: A Beginners Guide', category: 'SEO', keyword: 'technical seo' },
  { week: 4, day: 'Friday', title: 'How to Write Viral YouTube Titles', category: 'YouTube', keyword: 'youtube titles' },
];
