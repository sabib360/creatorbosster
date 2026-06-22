/**
 * CreatorBoost AI — Content Silo System
 * Topical authority clusters for SEO dominance
 *
 * Each silo groups related tools + blog posts + categories
 * to build topical authority in Google's eyes.
 *
 * Structure:
 * - Hub page (category or landing page)
 * - Spoke pages (tools, blog posts, guides)
 * - All interlinked within the silo
 */

import { ALL_TOOLS, type ToolVariant } from './tools-registry';
import { BLOG_POSTS, type BlogPost } from './blog-data';
import { CATEGORIES } from './tools-database';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface ContentSilo {
  id: string;
  name: string;
  description: string;
  hubPage: string;
  primaryKeywords: string[];
  tools: string[];
  articles: string[];
  internalLinks: string[];
}

// ═══════════════════════════════════════════════════════════════════
// SILO DEFINITIONS — Topical Authority Clusters
// ═══════════════════════════════════════════════════════════════════

export const CONTENT_SILOS: ContentSilo[] = [
  // ─── AI IMAGE CREATION SILO ───
  {
    id: 'ai-images',
    name: 'AI Image Creation',
    description: 'Generate, edit, and optimize images with AI-powered tools.',
    hubPage: '/ai-tools',
    primaryKeywords: [
      'ai image generator',
      'ai image creation',
      'text to image ai',
      'ai art generator',
      'ai photo editor',
    ],
    tools: [
      '/tools/ai-image-generator',
      '/tools/ai-text-to-image',
      '/tools/ai-bg-remover',
      '/tools/ai-image-upscaler',
      '/tools/image-compressor',
      '/tools/image-resizer',
      '/tools/thumbnail-generator',
      '/tools/ai-thumbnail-generator',
      '/tools/background-remover',
    ],
    articles: [
      'best-free-ai-image-generators',
      'youtube-thumbnail-design-tips',
      'how-to-compress-images-without-losing-quality',
    ],
    internalLinks: [
      '/ai-tools',
      '/image-tools',
      '/blog/best-free-ai-image-generators',
      '/blog/youtube-thumbnail-design-tips',
    ],
  },

  // ─── YOUTUBE GROWTH SILO ───
  {
    id: 'youtube-growth',
    name: 'YouTube Growth',
    description: 'Tools and guides to grow your YouTube channel.',
    hubPage: '/ai-tools',
    primaryKeywords: [
      'youtube tools',
      'youtube growth',
      'youtube seo',
      'youtube thumbnail',
      'youtube title generator',
    ],
    tools: [
      '/tools/youtube-title-generator',
      '/tools/youtube-description-generator',
      '/tools/youtube-tag-generator',
      '/tools/youtube-hashtag-generator',
      '/tools/youtube-script-writer',
      '/tools/youtube-seo-checker',
      '/tools/youtube-channel-analyzer',
      '/tools/youtube-comment-replies',
      '/tools/youtube-video-ideas',
      '/tools/youtube-thumbnail-downloader',
      '/tools/youtube-downloader',
    ],
    articles: [
      'youtube-growth-tips-2026',
      'youtube-thumbnails-guide',
      'youtube-algorithm-2026-update',
      'monetizing-youtube-channel-fastest',
      'viral-titles-ai',
      'video-editing-tips-fast-results',
    ],
    internalLinks: [
      '/ai-tools',
      '/blog/youtube-growth-tips-2026',
      '/blog/youtube-thumbnails-guide',
      '/blog/youtube-algorithm-2026-update',
    ],
  },

  // ─── PDF MANAGEMENT SILO ───
  {
    id: 'pdf-management',
    name: 'PDF Management',
    description: 'Complete PDF toolkit for merging, splitting, converting, and editing.',
    hubPage: '/pdf-tools',
    primaryKeywords: [
      'pdf tools',
      'pdf merger',
      'pdf compressor',
      'pdf converter',
      'pdf editor online',
    ],
    tools: [
      '/tools/pdf-merger',
      '/tools/pdf-splitter',
      '/tools/pdf-compressor',
      '/tools/pdf-converter',
      '/tools/pdf-to-word',
      '/tools/pdf-to-jpg',
      '/tools/jpg-to-pdf',
      '/tools/pdf-rotator',
      '/tools/pdf-watermark',
      '/tools/pdf-password-protector',
      '/tools/pdf-unlocker',
      '/tools/pdf-page-numberer',
      '/tools/pdf-metadata-editor',
      '/tools/pdf-summarizer',
    ],
    articles: [
      'pdf-editing-tips-tricks',
      'how-to-merge-pdf-files-free-online',
    ],
    internalLinks: [
      '/pdf-tools',
      '/blog/pdf-editing-tips-tricks',
      '/blog/how-to-merge-pdf-files-free-online',
    ],
  },

  // ─── SOCIAL MEDIA CONTENT SILO ───
  {
    id: 'social-media',
    name: 'Social Media Content',
    description: 'Create, optimize, and schedule social media content.',
    hubPage: '/social-media-tools',
    primaryKeywords: [
      'social media tools',
      'hashtag generator',
      'caption generator',
      'content ideas',
      'social media scheduler',
    ],
    tools: [
      '/tools/hashtag-generator',
      '/tools/ai-hashtag-generator',
      '/tools/ai-caption-generator',
      '/tools/bangla-caption-generator',
      '/tools/caption-writer',
      '/tools/content-idea-generator',
      '/tools/social-analytics',
      '/tools/link-shortener',
      '/tools/emoji-picker',
      '/tools/bio-link-page-builder',
      '/tools/qr-code-generator',
    ],
    articles: [
      'social-media-content-calendar',
      'how-to-use-ai-caption-generator',
    ],
    internalLinks: [
      '/social-media-tools',
      '/blog/social-media-content-calendar',
      '/blog/how-to-use-ai-caption-generator',
    ],
  },

  // ─── FINANCE & CALCULATORS SILO ───
  {
    id: 'finance-calculators',
    name: 'Finance & Calculators',
    description: 'Financial calculators for loans, investments, budgets, and more.',
    hubPage: '/finance-tools',
    primaryKeywords: [
      'financial calculator',
      'loan calculator',
      'emi calculator',
      'sip calculator',
      'budget planner',
    ],
    tools: [
      '/tools/loan-emi-calculator',
      '/tools/simple-interest-calculator',
      '/tools/compound-interest-calculator',
      '/tools/sip-calculator',
      '/tools/budget-planner',
      '/tools/tax-calculator',
      '/tools/fd-calculator',
      '/tools/currency-converter',
      '/tools/bmi-calculator',
      '/tools/percentage-calculator',
      '/tools/unit-converter',
      '/tools/password-generator',
      '/tools/age-calculator',
      '/tools/date-difference',
    ],
    articles: [
      'financial-planning-tools',
    ],
    internalLinks: [
      '/finance-tools',
      '/blog/financial-planning-tools',
    ],
  },

  // ─── CONTENT CREATION SILO ───
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Tools for writing, optimizing, and publishing content.',
    hubPage: '/ai-tools',
    primaryKeywords: [
      'content creation tools',
      'blog title generator',
      'meta description generator',
      'seo tools',
      'content optimizer',
    ],
    tools: [
      '/tools/blog-title-generator',
      '/tools/blog-outline-generator',
      '/tools/meta-description-generator',
      '/tools/meta-tag-generator',
      '/tools/social-post-generator',
      '/tools/content-paraphraser',
      '/tools/grammar-checker',
      '/tools/word-counter',
      '/tools/slug-generator',
      '/tools/email-subject-generator',
      '/tools/content-calendar',
      '/tools/content-idea-generator',
    ],
    articles: [
      'seo-descriptions',
      'future-content-creation-ai',
    ],
    internalLinks: [
      '/ai-tools',
      '/blog/seo-descriptions',
      '/blog/future-content-creation-ai',
    ],
  },

  // ─── DEVELOPER TOOLS SILO ───
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    description: 'Encoding, formatting, and conversion tools for developers.',
    hubPage: '/ai-tools',
    primaryKeywords: [
      'developer tools',
      'json formatter',
      'base64 encoder',
      'code formatter',
      'url encoder',
    ],
    tools: [
      '/tools/json-formatter',
      '/tools/base64-encoder-decoder',
      '/tools/html-to-markdown',
      '/tools/markdown-to-html',
      '/tools/css-minifier',
      '/tools/js-minifier',
      '/tools/url-encoder',
      '/tools/hash-generator',
      '/tools/regex-tester',
      '/tools/color-converter',
      '/tools/age-calculator',
    ],
    articles: [],
    internalLinks: ['/ai-tools'],
  },
];

// ═══════════════════════════════════════════════════════════════════
// SILO LOOKUP FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/** Find which silo a tool belongs to */
export function getToolSilo(toolPath: string): ContentSilo | null {
  return CONTENT_SILOS.find((silo) => silo.tools.includes(toolPath)) || null;
}

/** Find which silo a blog post belongs to */
export function getArticleSilo(slug: string): ContentSilo | null {
  return CONTENT_SILOS.find((silo) => silo.articles.includes(slug)) || null;
}

/** Get all silos for a given category */
export function getCategorySilos(categoryId: string): ContentSilo[] {
  return CONTENT_SILOS.filter((silo) => {
    const catMap: Record<string, string[]> = {
      'ai-tools': ['ai-images', 'content-creation', 'developer-tools'],
      'image-tools': ['ai-images'],
      'pdf-tools': ['pdf-management'],
      'youtube-tools': ['youtube-growth'],
      'social-media-tools': ['social-media'],
      'finance-tools': ['finance-calculators'],
      'seo-tools': ['content-creation'],
      'developer-tools': ['developer-tools'],
    };
    return catMap[categoryId]?.includes(silo.id);
  });
}

/** Get internal links within the same silo */
export function getSiloInternalLinks(toolPath: string): Array<{ path: string; name: string; type: 'tool' | 'article' }> {
  const silo = getToolSilo(toolPath);
  if (!silo) return [];

  const links: Array<{ path: string; name: string; type: 'tool' | 'article' }> = [];

  // Add tools from same silo (excluding current)
  for (const tp of silo.tools) {
    if (tp === toolPath) continue;
    const tool = ALL_TOOLS.find((t) => t.path === tp);
    if (tool) {
      links.push({ path: tp, name: tool.name, type: 'tool' });
    }
  }

  // Add articles from same silo
  for (const slug of silo.articles) {
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (post) {
      links.push({ path: `/blog/${slug}`, name: post.title, type: 'article' });
    }
  }

  return links;
}

/** Generate sitemap entries for all silos */
export function getSiloSitemapEntries() {
  return CONTENT_SILOS.map((silo) => ({
    id: silo.id,
    name: silo.name,
    url: silo.hubPage,
    toolsCount: silo.tools.length,
    articlesCount: silo.articles.length,
  }));
}
