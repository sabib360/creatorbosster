/**
 * Schema.org Structured Data Library
 * Generates all JSON-LD schemas for every page type.
 */

import { SEO_CONFIG } from '../config/seo-config';
import { ALL_TOOLS, type ToolVariant } from '../config/tools-registry';

const { siteUrl, siteName, organization } = SEO_CONFIG;

// ─────────────────────────────────────────────
// Homepage Schemas
// ─────────────────────────────────────────────

export function organizationSchema() {
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

export function websiteSchema() {
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

export function softwareApplicationSchema() {
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
      'Social Media Tools (Hashtag Generator, Scheduler)',
      'Link Shortener & Analytics',
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

// ─────────────────────────────────────────────
// Tool Page Schemas
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Breadcrumb Schema
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Blog Schemas
// ─────────────────────────────────────────────

export function articleSchema(post: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: post.url.startsWith('http') ? post.url : `${siteUrl}${post.url}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
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
      '@id': post.url.startsWith('http') ? post.url : `${siteUrl}${post.url}`,
    },
    ...(post.image ? { image: post.image } : {}),
  };
}

// ─────────────────────────────────────────────
// Category / Collection Page Schema
// ─────────────────────────────────────────────

export function collectionPageSchema(categoryName: string, categoryUrl: string, tools: ToolVariant[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description: `Free ${categoryName.toLowerCase()} for creators. Browse our collection of online tools.`,
    url: categoryUrl.startsWith('http') ? categoryUrl : `${siteUrl}${categoryUrl}`,
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

// ─────────────────────────────────────────────
// About Page Schema
// ─────────────────────────────────────────────

export function aboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${siteName}`,
    description: `Learn about ${siteName} - the all-in-one toolkit for content creators.`,
    url: `${siteUrl}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: organization.name,
      url: organization.url,
      logo: organization.logo,
      description: organization.description,
      sameAs: organization.sameAs,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  };
}

// ─────────────────────────────────────────────
// Contact Page Schema
// ─────────────────────────────────────────────

export function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${siteName}`,
    description: `Get in touch with ${siteName} support team.`,
    url: `${siteUrl}/contact-us`,
    mainEntity: {
      '@type': 'Organization',
      name: organization.name,
      url: organization.url,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: SEO_CONFIG.contact.email,
        availableLanguage: ['English'],
      },
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  };
}

// ─────────────────────────────────────────────
// HowTo Schema
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// ItemList Schema (for link lists)
// ─────────────────────────────────────────────

export function itemListSchema(items: Array<{ name: string; url: string; position: number }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

// ─────────────────────────────────────────────
// Blog Listing Page Schema
// ─────────────────────────────────────────────

export function blogListingSchema(posts: Array<{ title: string; url: string; datePublished: string; excerpt: string }>) {
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
        url: post.url.startsWith('http') ? post.url : `${siteUrl}${post.url}`,
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

// ─────────────────────────────────────────────
// Legal Page Schema (Generic)
// ─────────────────────────────────────────────

export function legalPageSchema(pageType: string, title: string, path: string, description: string) {
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

// ─────────────────────────────────────────────
// SearchResultsPage Schema
// ─────────────────────────────────────────────

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
