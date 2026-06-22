/**
 * SEO Utility Functions
 * Auto-generate all SEO metadata for tool pages
 */

import type { ToolConfig } from '../config/tools-config';
import { SEO_CONFIG } from '../config/seo-config';

const { siteUrl, siteName, organization } = SEO_CONFIG;

/* ─── Generate SEO Metadata ────────────────────── */

export interface SEOData {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  faqSchema: object | null;
  breadcrumbSchema: object;
  softwareSchema: object;
}

export function generateToolSEO(tool: ToolConfig): SEOData {
  const canonical = `${siteUrl}/tools/${tool.slug}`;
  const ogImage = tool.featuredImage?.startsWith('http')
    ? tool.featuredImage
    : `${siteUrl}${tool.featuredImage || '/og/default-tool.png'}`;

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    canonical,
    ogImage,
    ogTitle: tool.metaTitle,
    ogDescription: tool.metaDescription,
    twitterTitle: tool.metaTitle,
    twitterDescription: tool.metaDescription,
    twitterImage: ogImage,
    faqSchema: generateFAQSchema(tool.faq),
    breadcrumbSchema: generateBreadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Tools', url: `${siteUrl}/tools` },
      { name: tool.toolName, url: canonical },
    ]),
    softwareSchema: generateSoftwareSchema(tool, canonical),
  };
}

/* ─── FAQ Schema ───────────────────────────────── */

export function generateFAQSchema(faqs: Array<{ q: string; a: string }>) {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/* ─── Breadcrumb Schema ────────────────────────── */

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
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

/* ─── Software Application Schema ──────────────── */

export function generateSoftwareSchema(tool: ToolConfig, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.toolName,
    description: tool.shortDescription,
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

/* ─── Organization Schema ──────────────────────── */

export function generateOrganizationSchema() {
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

/* ─── Website Schema ───────────────────────────── */

export function generateWebsiteSchema() {
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
  };
}

/* ─── Collection Page Schema ───────────────────── */

export function generateCollectionSchema(
  name: string,
  url: string,
  tools: Array<{ name: string; slug: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description: `Free ${name.toLowerCase()} for creators. Browse our collection of online tools.`,
    url: url.startsWith('http') ? url : `${siteUrl}${url}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.slice(0, 20).map((tool, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${siteUrl}/tools/${tool.slug}`,
        name: tool.name,
      })),
    },
  };
}

/* ─── Generate Meta Tags HTML ──────────────────── */

export function generateMetaTagsHTML(tool: ToolConfig): string {
  const seo = generateToolSEO(tool);
  return `
<title>${seo.title}</title>
<meta name="description" content="${seo.description}">
<link rel="canonical" href="${seo.canonical}">
<meta property="og:type" content="website">
<meta property="og:url" content="${seo.canonical}">
<meta property="og:title" content="${seo.ogTitle}">
<meta property="og:description" content="${seo.ogDescription}">
<meta property="og:image" content="${seo.ogImage}">
<meta property="og:site_name" content="${siteName}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${seo.canonical}">
<meta name="twitter:title" content="${seo.twitterTitle}">
<meta name="twitter:description" content="${seo.twitterDescription}">
<meta name="twitter:image" content="${seo.twitterImage}">
<script type="application/ld+json">${JSON.stringify(seo.softwareSchema)}</script>
${seo.faqSchema ? `<script type="application/ld+json">${JSON.stringify(seo.faqSchema)}</script>` : ''}
<script type="application/ld+json">${JSON.stringify(seo.breadcrumbSchema)}</script>
  `.trim();
}
