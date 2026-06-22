/**
 * CreatorBoost AI — Enhanced Schema System
 * Complete structured data for every page type
 * Supports: Organization, WebSite, SoftwareApplication, FAQPage,
 * Article, BreadcrumbList, CollectionPage, HowTo, ItemList
 */

import { SEO_CONFIG } from './seo-config';
import { ALL_TOOLS, type ToolVariant } from './tools-registry';
import { BLOG_POSTS, type BlogPost } from './blog-data';
import { CATEGORIES } from './tools-database';
import { CONTENT_SILOS } from './content-silos';

const { siteUrl, siteName, organization } = SEO_CONFIG;

// ═══════════════════════════════════════════════════════════════════
// HOMEPAGE SCHEMAS
// ═══════════════════════════════════════════════════════════════════

export function homepageOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    url: organization.url,
    logo: organization.logo,
    description: organization.description,
    sameAs: organization.sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: SEO_CONFIG.contact.email,
    },
    aggregateRating: organization.aggregateRating,
  };
}

export function homepageWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: organization.logo },
    },
  };
}

export function homepageSoftwareSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${siteName} - Free AI Tools Suite`,
    description: SEO_CONFIG.defaultDescription,
    url: siteUrl,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: organization.aggregateRating,
    creator: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    featureList: [
      'AI Content Generator',
      'Image Editor & Compressor',
      'PDF Tools (Merger, Splitter, Converter)',
      'Financial Calculators (Loan, SIP, Budget)',
      'Social Media Tools (Hashtag Generator, Caption Writer)',
      'YouTube Tools (Title Generator, Thumbnail Downloader)',
    ],
  };
}

export function homepageFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is CreatorBoost AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CreatorBoost AI is a free all-in-one toolkit for content creators with 100+ tools including AI generators, image editors, PDF tools, financial calculators, and social media tools. No signup required.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is CreatorBoost AI free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! CreatorBoost AI is completely free to use. Most tools have no usage limits. Some AI-powered tools offer 3 free daily credits, with premium plans available for more.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to sign up to use these tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No signup is required to start using most tools. Use them immediately without any registration. Sign up optionally to save your history and get more AI credits.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are my files secure on CreatorBoost AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Browser-based tools process everything locally in your browser - your files never leave your device. AI tools use secure API calls and do not store your data.',
        },
      },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════════
// TOOL PAGE SCHEMAS
// ═══════════════════════════════════════════════════════════════════

export function toolSoftwareSchema(tool: ToolVariant, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.seoDescription,
    url: canonicalUrl,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free with optional premium plan',
    },
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2500',
      bestRating: '5',
      worstRating: '1',
    },
    dateModified: new Date().toISOString(),
  };
}

export function toolFAQSchema(faqs: Array<{ q: string; a: string }>) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function toolBreadcrumbSchema(tool: ToolVariant) {
  const categoryMap: Record<string, { name: string; path: string }> = {
    'image-tools': { name: 'Image Tools', path: '/image-tools' },
    'pdf-tools': { name: 'PDF Tools', path: '/pdf-tools' },
    'ai-tools': { name: 'AI Tools', path: '/ai-tools' },
    'youtube-tools': { name: 'YouTube Tools', path: '/ai-tools' },
    'social-media-tools': { name: 'Social Media Tools', path: '/social-media-tools' },
    'finance-tools': { name: 'Finance Tools', path: '/finance-tools' },
    'seo-tools': { name: 'SEO Tools', path: '/ai-tools' },
    'developer-tools': { name: 'Developer Tools', path: '/ai-tools' },
  };

  const cat = categoryMap[tool.category];
  const items = [
    { name: 'Home', url: siteUrl },
    ...(cat ? [{ name: cat.name, url: `${siteUrl}${cat.path}` }] : []),
    { name: tool.name, url: `${siteUrl}${tool.path}` },
  ];

  return breadcrumbSchema(items);
}

// ═══════════════════════════════════════════════════════════════════
// BLOG SCHEMAS
// ═══════════════════════════════════════════════════════════════════

export function articleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.publishDate,
    dateModified: post.updatedDate || post.publishDate,
    author: {
      '@type': 'Organization',
      name: post.author || siteName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: organization.logo },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    ...(post.featuredImage ? { image: post.featuredImage } : {}),
  };
}

export function blogBreadcrumbSchema(post: BlogPost) {
  return breadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
  ]);
}

export function blogListingSchema() {
  const posts = BLOG_POSTS.slice(0, 20);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'CreatorBoost AI Blog',
    description: 'Articles, guides, and tutorials for content creators using AI tools.',
    url: `${siteUrl}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════
// CATEGORY SCHEMAS
// ═══════════════════════════════════════════════════════════════════

export function categoryCollectionSchema(categoryId: string, categoryName: string, tools: ToolVariant[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - Free Online Tools`,
    description: `Free ${categoryName.toLowerCase()} for creators. Browse our collection of online tools.`,
    url: `${siteUrl}/category/${categoryId}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.slice(0, 20).map((tool, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${siteUrl}${tool.path}`,
        name: tool.name,
      })),
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  };
}

export function categoryBreadcrumbSchema(categoryId: string, categoryName: string) {
  return breadcrumbSchema([
    { name: 'Home', url: siteUrl },
    { name: categoryName, url: `${siteUrl}/category/${categoryId}` },
  ]);
}

// ═══════════════════════════════════════════════════════════════════
// SHARED SCHEMAS
// ═══════════════════════════════════════════════════════════════════

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    totalTime: opts.totalTime || 'PT5M',
    step: opts.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image ? { image: step.image } : {}),
    })),
  };
}

export function itemListSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function searchResultsSchema(query: string, results: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Search results for "${query}"`,
    url: `${siteUrl}/?q=${encodeURIComponent(query)}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: results.length,
      itemListElement: results.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: r.url.startsWith('http') ? r.url : `${siteUrl}${r.url}`,
        name: r.name,
      })),
    },
  };
}

export function legalPageSchema(title: string, path: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${siteUrl}${path}`,
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════
// SILO SCHEMAS — Topical Authority
// ═══════════════════════════════════════════════════════════════════

export function siloItemListSchema(siloId: string) {
  const silo = CONTENT_SILOS.find((s) => s.id === siloId);
  if (!silo) return null;

  const items = [
    ...silo.tools.map((path) => {
      const tool = ALL_TOOLS.find((t) => t.path === path);
      return tool ? { name: tool.name, url: `${siteUrl}${path}` } : null;
    }),
    ...silo.articles.map((slug) => {
      const post = BLOG_POSTS.find((p) => p.slug === slug);
      return post ? { name: post.title, url: `${siteUrl}/blog/${slug}` } : null;
    }),
  ].filter(Boolean) as Array<{ name: string; url: string }>;

  return itemListSchema(items);
}
