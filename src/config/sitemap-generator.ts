/**
 * Sitemap Generator
 * Auto-generates sitemap.xml with all tool variants
 * Also generates metadata for SEO
 */

import { getSitemapEntries } from './programmatic-seo';
import { ALL_TOOLS } from './tools-registry';

interface SitemapEntry {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
}

// Generate sitemap entries
export const generateSitemapEntries = (): SitemapEntry[] => {
  const baseEntries: SitemapEntry[] = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/image-tools', priority: 0.9, changefreq: 'weekly' },
    { path: '/pdf-tools', priority: 0.9, changefreq: 'weekly' },
    { path: '/ai-tools', priority: 0.9, changefreq: 'weekly' },
    { path: '/calculator-tools', priority: 0.9, changefreq: 'weekly' },
    { path: '/developer-tools', priority: 0.9, changefreq: 'weekly' },
    { path: '/social-media-tools', priority: 0.9, changefreq: 'weekly' },
  ];

  // Add all SEO variants from programmatic-seo.ts
  const seoEntries = getSitemapEntries();

  // Add individual tool pages
  const toolEntries = ALL_TOOLS.map((tool) => ({
    path: tool.path,
    priority: 0.8,
    changefreq: 'monthly' as const,
  }));

  // Add utility pages
  const utilityPages: SitemapEntry[] = [
    { path: '/privacy-policy', priority: 0.5, changefreq: 'yearly' },
    { path: '/terms-of-service', priority: 0.5, changefreq: 'yearly' },
    { path: '/contact', priority: 0.6, changefreq: 'monthly' },
    { path: '/about', priority: 0.7, changefreq: 'yearly' },
    { path: '/blog', priority: 0.7, changefreq: 'weekly' },
  ];

  return [...baseEntries, ...seoEntries, ...toolEntries, ...utilityPages];
};

// Generate XML sitemap
export const generateSitemapXML = (): string => {
  const entries = generateSitemapEntries();
  const baseUrl = 'https://creatorboost.ai';
  const lastmod = new Date().toISOString().split('T')[0];

  const urlEntries = entries
    .map(
      (entry) => `  <url>
    <loc>${baseUrl}${entry.path}</loc>
    <lastmod>${entry.lastmod || lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

// Generate robots.txt
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /.env
Disallow: /.git

Sitemap: https://creatorboost.ai/sitemap.xml

# Crawl delay (optional, in seconds)
Crawl-delay: 1

# Request rate limits
Request-rate: 1/10s`;
};

// Generate JSON-LD Schema for tools
export const generateToolSchema = (toolId: string, seoTitle: string, seoDescription: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seoTitle,
    description: seoDescription,
    url: `https://creatorboost.ai/tools/${toolId}`,
    applicationCategory: 'Utilities',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'CreatorBoost AI',
      url: 'https://creatorboost.ai',
    },
  };
};

// Generate Organization Schema
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CreatorBoost AI',
    url: 'https://creatorboost.ai',
    logo: 'https://creatorboost.ai/logo.png',
    description: 'Free online tools for content creators, developers, and productivity.',
    sameAs: [
      'https://twitter.com/creatorboostai',
      'https://facebook.com/creatorboostai',
      'https://instagram.com/creatorboostai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@creatorboost.ai',
    },
  };
};

// Generate Open Graph Meta Tags
export const generateOpenGraphMetaTags = (title: string, description: string, path: string, image?: string) => {
  return {
    'og:title': title,
    'og:description': description,
    'og:url': `https://creatorboost.ai${path}`,
    'og:type': 'website',
    'og:image': image || 'https://creatorboost.ai/og-image.png',
    'og:site_name': 'CreatorBoost AI',
  };
};

// Twitter Card Meta Tags
export const generateTwitterMetaTags = (title: string, description: string) => {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:creator': '@creatorboostai',
  };
};

// Generate meta tags object
export const generateMetaTags = (
  title: string,
  description: string,
  keywords: string[],
  path: string,
  image?: string
) => {
  return {
    title,
    description,
    keywords: keywords.join(', '),
    canonical: `https://creatorboost.ai${path}`,
    ...generateOpenGraphMetaTags(title, description, path, image),
    ...generateTwitterMetaTags(title, description),
  };
};

// Estimate total traffic across all tools
export const estimateTotalTraffic = (): { tools: number; pages: number; estimatedMonthlySearches: number; estimatedMonthlyEarnings: number } => {
  const sitemapEntries = generateSitemapEntries();
  const toolVariants = getSitemapEntries();

  const totalEstimatedSearches = ALL_TOOLS.reduce((total, tool) => total + tool.estimatedSearchVolume, 0);
  const totalEstimatedCPC = ALL_TOOLS.reduce((total, tool) => total + tool.estimatedCPC, 0);
  const averageCPC = totalEstimatedCPC / ALL_TOOLS.length;

  // Rough estimate: 1-5% CTR, 1-3 impressions per click
  const estimatedMonthlyEarnings = (totalEstimatedSearches * 0.03 * averageCPC) / 3;

  return {
    tools: ALL_TOOLS.length,
    pages: sitemapEntries.length,
    estimatedMonthlySearches: totalEstimatedSearches,
    estimatedMonthlyEarnings: Math.round(estimatedMonthlyEarnings),
  };
};

// Log SEO stats
export const logSEOStats = () => {
  const stats = estimateTotalTraffic();
  console.log('🔍 SEO STATISTICS:');
  console.log(`   📊 Tools: ${stats.tools}`);
  console.log(`   📄 Pages: ${stats.pages}`);
  console.log(`   🔎 Est. Monthly Searches: ${stats.estimatedMonthlySearches.toLocaleString()}`);
  console.log(`   💰 Est. Monthly Revenue: $${stats.estimatedMonthlyEarnings.toLocaleString()}`);
  console.log('\n✨ All tools optimized for SEO and programmatic growth!');
};
