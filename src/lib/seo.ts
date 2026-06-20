/**
 * Centralized SEO Utility Library
 * Single source of truth for all SEO-related functions.
 * Uses global SEO config for consistent values.
 */

import { SEO_CONFIG } from '../config/seo-config';
import { ALL_TOOLS, type ToolVariant } from '../config/tools-registry';

const { siteUrl, siteName, defaultOgImage } = SEO_CONFIG;

// ─────────────────────────────────────────────
// 1. META TAG GENERATION
// ─────────────────────────────────────────────

export interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
}

export function generateMetaTags(opts: {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  ogImage?: string;
  ogType?: string;
}): MetaTags {
  const canonical = `${siteUrl}${opts.path}`;
  const ogImage = opts.ogImage
    ? opts.ogImage.startsWith('http') ? opts.ogImage : `${siteUrl}${opts.ogImage}`
    : defaultOgImage;

  return {
    title: opts.title,
    description: opts.description,
    keywords: (opts.keywords || []).join(', '),
    canonical,
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogImage,
    ogType: opts.ogType || 'website',
    ogUrl: canonical,
    twitterCard: SEO_CONFIG.twitterCard,
    twitterTitle: opts.title,
    twitterDescription: opts.description,
    twitterImage: ogImage,
    robots: SEO_CONFIG.robots,
  };
}

// ─────────────────────────────────────────────
// 2. SITEMAP GENERATION (Dynamic)
// ─────────────────────────────────────────────

export interface SitemapEntry {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
}

export function generateAllSitemapEntries(): SitemapEntry[] {
  const today = new Date().toISOString().split('T')[0];

  const baseEntries: SitemapEntry[] = [
    { path: '/', priority: 1.0, changefreq: 'weekly', lastmod: today },
    { path: '/image-tools', priority: 0.9, changefreq: 'weekly', lastmod: today },
    { path: '/pdf-tools', priority: 0.9, changefreq: 'weekly', lastmod: today },
    { path: '/ai-tools', priority: 0.9, changefreq: 'weekly', lastmod: today },
    { path: '/finance-tools', priority: 0.9, changefreq: 'weekly', lastmod: today },
    { path: '/social-media-tools', priority: 0.9, changefreq: 'weekly', lastmod: today },
    { path: '/how-to-use', priority: 0.6, changefreq: 'monthly', lastmod: today },
    { path: '/blog', priority: 0.7, changefreq: 'weekly', lastmod: today },
  ];

  const toolEntries: SitemapEntry[] = ALL_TOOLS.map((tool) => ({
    path: tool.path,
    priority: 0.8,
    changefreq: 'monthly' as const,
    lastmod: today,
  }));

  const utilityPages: SitemapEntry[] = [
    { path: '/about', priority: 0.7, changefreq: 'yearly', lastmod: today },
    { path: '/contact-us', priority: 0.6, changefreq: 'monthly', lastmod: today },
    { path: '/privacy-policy', priority: 0.5, changefreq: 'yearly', lastmod: today },
    { path: '/terms-of-service', priority: 0.5, changefreq: 'yearly', lastmod: today },
    { path: '/cookie-policy', priority: 0.5, changefreq: 'yearly', lastmod: today },
    { path: '/disclaimer', priority: 0.4, changefreq: 'yearly', lastmod: today },
    { path: '/dmca', priority: 0.4, changefreq: 'yearly', lastmod: today },
    { path: '/editorial-policy', priority: 0.4, changefreq: 'yearly', lastmod: today },
    { path: '/sitemap', priority: 0.3, changefreq: 'monthly', lastmod: today },
  ];

  const blogSlugs = [
    'best-ai-tools-2026',
    'how-to-use-ai-caption-generator',
    'ai-vs-human-content-creation',
    'best-free-ai-image-generators',
    'youtube-thumbnail-design-tips',
    'seo-tools-for-small-business',
    'social-media-content-calendar',
    'pdf-editing-tips-tricks',
    'image-compression-guide',
    'financial-planning-tools',
    'viral-titles-ai',
    'seo-descriptions',
    'youtube-growth-tips-2026',
    'youtube-thumbnails-guide',
    'future-content-creation-ai',
    'youtube-algorithm-2026-update',
    'monetizing-youtube-channel-fastest',
    'video-editing-tips-fast-results',
    'how-to-compress-images-without-losing-quality',
    'how-to-merge-pdf-files-free-online',
    'how-to-create-qr-code-for-business',
  ];

  const blogEntries: SitemapEntry[] = blogSlugs.map((slug) => ({
    path: `/blog/${slug}`,
    priority: 0.6,
    changefreq: 'monthly' as const,
    lastmod: today,
  }));

  const extraToolPaths: SitemapEntry[] = [
    { path: '/tools/image-filters', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/image-to-base64', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/base64-to-image', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/image-metadata', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/color-picker', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/image-splitter', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/image-merger', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/favicon-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/thumbnail-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/ai-thumbnail-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/ai-bg-remover', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/ai-image-upscaler', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/ai-text-to-image', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/ai-document-summarizer', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/ai-chatbot', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/ai-code-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/ai-translator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/ai-sentiment-analyzer', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/competitor-analysis', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/loan-emi-calculator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/simple-interest-calculator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/sip-calculator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/budget-planner', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/tax-calculator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/fd-calculator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/currency-converter', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/date-difference', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/bmi-calculator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/percentage-calculator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/unit-converter', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/password-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/loan-comparison', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/hashtag-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/content-idea-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/caption-writer', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/social-analytics', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/link-shortener', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/emoji-picker', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/bio-link-page-builder', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-title-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-description-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-tag-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-hashtag-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-script-writer', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-seo-checker', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-channel-analyzer', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-comment-replies', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-video-ideas', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/youtube-thumbnail-downloader', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/blog-title-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/blog-outline-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/meta-description-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/social-post-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/content-paraphraser', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/grammar-checker', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/word-counter', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/slug-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/email-subject-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/content-calendar', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/html-to-markdown', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/markdown-to-html', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/css-minifier', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/js-minifier', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/url-encoder', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/hash-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/regex-tester', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/color-converter', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/age-calculator', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/pdf-page-numberer', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/pdf-metadata-editor', priority: 0.8, changefreq: 'monthly', lastmod: today },
    { path: '/tools/meta-tag-generator', priority: 0.8, changefreq: 'monthly', lastmod: today },
  ];

  return [...baseEntries, ...toolEntries, ...extraToolPaths, ...blogEntries, ...utilityPages];
}

export function generateSitemapXML(): string {
  const entries = generateAllSitemapEntries();
  const lastmod = new Date().toISOString().split('T')[0];

  const urlEntries = entries
    .map(
      (entry) => `  <url>
    <loc>${siteUrl}${entry.path}</loc>
    <lastmod>${entry.lastmod || lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

// ─────────────────────────────────────────────
// 3. ROBOTS.TXT GENERATION
// ─────────────────────────────────────────────

export function generateRobotsTxt(): string {
  return `# Robots.txt for ${siteName}
# ${siteUrl}

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /.env
Disallow: /.git
Disallow: /seo-dashboard

# Block aggressive crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent:磨盘Bot
Disallow: /

# Allow major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

# Crawl-delay for polite bots
Crawl-delay: 1

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml

# Language
Content-Language: en`;
}

// ─────────────────────────────────────────────
// 4. SEO SCORING
// ─────────────────────────────────────────────

export interface SEOScoreResult {
  overall: number;
  titleScore: { score: number; max: number; feedback: string };
  descriptionScore: { score: number; max: number; feedback: string };
  keywordsScore: { score: number; max: number; feedback: string };
  schemaScore: { score: number; max: number; feedback: string };
  performanceScore: { score: number; max: number; feedback: string };
}

export function calculateSEOScore(page: {
  title?: string;
  description?: string;
  keywords?: string;
  hasSchema?: boolean;
  hasCanonical?: boolean;
  hasH1?: boolean;
  wordCount?: number;
}): SEOScoreResult {
  const title = page.title || '';
  const desc = page.description || '';
  const kw = page.keywords || '';

  let titlePoints = 0;
  let titleFeedback = '';
  if (title.length > 0) titlePoints += 5;
  if (title.length >= 30 && title.length <= 60) titlePoints += 10;
  else if (title.length > 0) titlePoints += 5;
  if (title.toLowerCase().includes('creatorboost') || title.toLowerCase().includes('creator boost')) titlePoints += 5;
  if (title.length > 60) titleFeedback = 'Title may be truncated in search results. Keep under 60 characters.';
  else if (title.length < 30) titleFeedback = 'Title is too short. Aim for 30-60 characters.';
  else titleFeedback = 'Title length is optimal.';
  const titleScore = { score: titlePoints, max: 25, feedback: titleFeedback };

  let descPoints = 0;
  let descFeedback = '';
  if (desc.length > 0) descPoints += 5;
  if (desc.length >= 120 && desc.length <= 160) descPoints += 10;
  else if (desc.length > 0) descPoints += 5;
  if (desc.length > 0) descPoints += 5;
  if (desc.length > 160) descFeedback = 'Description may be truncated. Keep under 160 characters.';
  else if (desc.length < 120) descFeedback = 'Description is too short. Aim for 120-160 characters.';
  else descFeedback = 'Description length is optimal.';
  const descriptionScore = { score: descPoints, max: 25, feedback: descFeedback };

  let kwPoints = 0;
  let kwFeedback = '';
  if (kw.length > 0) kwPoints += 5;
  const kwCount = kw.split(',').filter((k) => k.trim().length > 0).length;
  if (kwCount >= 3 && kwCount <= 10) kwPoints += 10;
  else if (kwCount > 0) kwPoints += 5;
  if (kwCount > 10) kwFeedback = 'Too many keywords. Focus on 3-10 primary keywords.';
  else if (kwCount < 3) kwFeedback = 'Add more keywords. Aim for 3-10 relevant keywords.';
  else kwFeedback = 'Keyword count is good.';
  const keywordsScore = { score: kwPoints, max: 20, feedback: kwFeedback };

  let schemaPoints = 0;
  let schemaFeedback = '';
  if (page.hasSchema) schemaPoints += 15;
  schemaFeedback = page.hasSchema ? 'Structured data is present.' : 'Add JSON-LD structured data for rich snippets.';
  const schemaScore = { score: schemaPoints, max: 15, feedback: schemaFeedback };

  let perfPoints = 0;
  let perfFeedback = '';
  if (page.hasCanonical) perfPoints += 5;
  if (page.hasH1) perfPoints += 5;
  if (page.wordCount && page.wordCount >= 300) perfPoints += 5;
  else if (page.wordCount) perfPoints += 2;
  perfFeedback = !page.hasCanonical ? 'Add a canonical URL.' : !page.hasH1 ? 'Add an H1 heading.' : 'Content and technical SEO look good.';
  const performanceScore = { score: perfPoints, max: 15, feedback: perfFeedback };

  const overall = Math.round(
    ((titlePoints + descPoints + kwPoints + schemaPoints + perfPoints) / 100) * 100
  );

  return { overall, titleScore, descriptionScore, keywordsScore, schemaScore, performanceScore };
}

// ─────────────────────────────────────────────
// 5. KEYWORD DENSITY ANALYSIS
// ─────────────────────────────────────────────

export interface KeywordDensityResult {
  keyword: string;
  count: number;
  density: number;
  status: 'low' | 'optimal' | 'high' | 'stuffing';
}

export function analyzeKeywordDensity(text: string, keywords: string[]): KeywordDensityResult[] {
  const plainText = text.replace(/<[^>]*>/g, ' ').toLowerCase();
  const wordCount = plainText.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount === 0) return [];

  return keywords.map((kw) => {
    const lowerKw = kw.toLowerCase().trim();
    const regex = new RegExp(`\\b${lowerKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = plainText.match(regex);
    const count = matches ? matches.length : 0;
    const density = (count / wordCount) * 100;

    let status: KeywordDensityResult['status'] = 'low';
    if (density < 0.5) status = 'low';
    else if (density <= 2.5) status = 'optimal';
    else if (density <= 4) status = 'high';
    else status = 'stuffing';

    return { keyword: kw, count, density: Math.round(density * 100) / 100, status };
  });
}

// ─────────────────────────────────────────────
// 6. READABILITY SCORING
// ─────────────────────────────────────────────

export interface ReadabilityResult {
  score: number;
  grade: string;
  avgSentenceLength: number;
  avgWordLength: number;
  complexWordCount: number;
  feedback: string[];
}

export function analyzeReadability(text: string): ReadabilityResult {
  const plainText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = plainText.split(/\s+/).filter((w) => w.length > 0);
  const feedback: string[] = [];

  const avgSentenceLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
  const avgWordLength = words.length > 0 ? Math.round(words.reduce((sum, w) => sum + w.length, 0) / words.length * 10) / 10 : 0;

  const complexWords = words.filter((w) => {
    const vowels = w.match(/[aeiouy]+/gi);
    return vowels && vowels.length >= 3 && w.length > 6;
  });
  const complexWordCount = complexWords.length;

  let score = 100;
  if (avgSentenceLength > 20) { score -= (avgSentenceLength - 20) * 2; feedback.push('Sentences are long. Aim for 15-20 words per sentence.'); }
  if (avgSentenceLength > 0 && avgSentenceLength <= 20) feedback.push('Sentence length is good.');
  if (avgWordLength > 6) { score -= (avgWordLength - 6) * 5; feedback.push('Words are complex. Use simpler language when possible.'); }
  if (complexWordCount > words.length * 0.15) { score -= 10; feedback.push('Too many complex words. Reduce jargon for better readability.'); }
  if (words.length < 300) feedback.push('Content is thin. Aim for 300+ words for better SEO.');

  score = Math.max(0, Math.min(100, score));

  let grade = 'Easy';
  if (score < 50) grade = 'Difficult';
  else if (score < 70) grade = 'Moderate';
  else if (score < 85) grade = 'Standard';

  return { score, grade, avgSentenceLength, avgWordLength, complexWordCount, feedback };
}

// ─────────────────────────────────────────────
// 7. INTERNAL LINKING SUGGESTIONS
// ─────────────────────────────────────────────

export function suggestInternalLinks(currentPath: string, content: string): Array<{ path: string; name: string; reason: string }> {
  const suggestions: Array<{ path: string; name: string; reason: string }> = [];
  const plainText = content.replace(/<[^>]*>/g, ' ').toLowerCase();

  for (const tool of ALL_TOOLS) {
    if (tool.path === currentPath) continue;

    const toolKeywords = tool.keywords.map((k) => k.toLowerCase());

    for (const kw of toolKeywords) {
      if (plainText.includes(kw) && !suggestions.find((s) => s.path === tool.path)) {
        suggestions.push({
          path: tool.path,
          name: tool.name,
          reason: `Content mentions "${kw}"`,
        });
        break;
      }
    }

    if (suggestions.length < 10) {
      const currentTool = ALL_TOOLS.find((t) => t.path === currentPath);
      if (currentTool && tool.category === currentTool.category && tool.path !== currentPath) {
        if (!suggestions.find((s) => s.path === tool.path)) {
          suggestions.push({
            path: tool.path,
            name: tool.name,
            reason: `Same category: ${tool.category}`,
          });
        }
      }
    }
  }

  return suggestions.slice(0, 8);
}

// Legacy exports for backward compatibility
export const generateOrganizationSchema = () => SEO_CONFIG.organization;
