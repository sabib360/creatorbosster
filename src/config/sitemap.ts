/**
 * Sitemap configuration for Creator Booster
 * This file helps generate sitemap.xml for Google Search Console
 * 
 * Usage:
 * 1. Install: npm install next-sitemap (if using Next.js)
 * 2. Or manually create sitemap.xml based on this structure
 * 3. Submit to Google Search Console
 */

export const sitemapConfig = {
  // Main site URL
  siteUrl: 'https://creatorbooster.co',
  
  // Generate robots.txt
  generateRobotsTxt: true,
  
  // Exclude certain routes
  exclude: ['/admin/*', '/api/*', '/auth/*'],
  
  // Change frequency settings
  changefreq: {
    default: 'daily',
    home: 'daily',
    blog: 'weekly',
    tools: 'monthly',
  },
  
  // Priority settings
  priority: {
    home: 1.0,
    generator: 0.9,
    blog: 0.8,
    pricing: 0.7,
    privacy: 0.5,
    contact: 0.5,
  },

  // Static pages to include
  staticPages: [
    {
      loc: 'https://creatorbooster.co/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: 'https://creatorbooster.co/#generator',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: 'https://creatorbooster.co/#blog',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: 'https://creatorbooster.co/#pricing',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: 'https://creatorbooster.co/#privacy-policy',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: 'https://creatorbooster.co/#contact-us',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.5,
    },
  ],

  // Blog pages (will be generated dynamically)
  blogPages: [
    {
      slug: 'how-to-create-viral-youtube-titles',
      title: 'How to Create Viral YouTube Titles - Complete Guide 2024',
      lastmod: new Date().toISOString(),
      priority: 0.8,
    },
    {
      slug: 'youtube-thumbnail-design-guide',
      title: 'YouTube Thumbnail Design Guide - Best Practices for CTR',
      lastmod: new Date().toISOString(),
      priority: 0.8,
    },
    {
      slug: 'best-free-youtube-seo-tools',
      title: '10 Best Free YouTube SEO Tools for Content Creators',
      lastmod: new Date().toISOString(),
      priority: 0.8,
    },
    {
      slug: 'how-to-increase-youtube-ctr',
      title: 'How to Increase YouTube CTR: Proven Strategies',
      lastmod: new Date().toISOString(),
      priority: 0.8,
    },
  ],
};

/**
 * Example XML output for sitemap.xml
 * Replace TIMESTAMP with actual datetime
 */
export const sitemapXmlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://creatorbooster.co/</loc>
    <lastmod>TIMESTAMP</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://creatorbooster.co/#generator</loc>
    <lastmod>TIMESTAMP</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://creatorbooster.co/#blog</loc>
    <lastmod>TIMESTAMP</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://creatorbooster.co/#pricing</loc>
    <lastmod>TIMESTAMP</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

export default sitemapConfig;
