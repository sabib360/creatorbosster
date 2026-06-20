/**
 * Sitemap Generator
 * Uses centralized SEO utility from src/lib/seo.ts
 * Auto-generates sitemap.xml with all tool variants
 */

export {
  generateAllSitemapEntries,
  generateSitemapXML,
  generateRobotsTxt,
} from '../lib/seo';

// Re-export for backward compatibility
import { generateAllSitemapEntries, generateSitemapXML, generateRobotsTxt } from '../lib/seo';

export const generateSitemapEntries = generateAllSitemapEntries;

// Estimate total traffic across all tools
import { ALL_TOOLS } from './tools-registry';
import { getSitemapEntries } from './programmatic-seo';

export const estimateTotalTraffic = () => {
  const sitemapEntries = generateAllSitemapEntries();
  const totalEstimatedSearches = ALL_TOOLS.reduce((total, tool) => total + tool.estimatedSearchVolume, 0);
  const totalEstimatedCPC = ALL_TOOLS.reduce((total, tool) => total + tool.estimatedCPC, 0);
  const averageCPC = totalEstimatedCPC / ALL_TOOLS.length;
  const estimatedMonthlyEarnings = (totalEstimatedSearches * 0.03 * averageCPC) / 3;

  return {
    tools: ALL_TOOLS.length,
    pages: sitemapEntries.length,
    estimatedMonthlySearches: totalEstimatedSearches,
    estimatedMonthlyEarnings: Math.round(estimatedMonthlyEarnings),
  };
};

export const logSEOStats = () => {
  const stats = estimateTotalTraffic();
  console.log('🔍 SEO STATISTICS:');
  console.log(`   📊 Tools: ${stats.tools}`);
  console.log(`   📄 Pages: ${stats.pages}`);
  console.log(`   🔎 Est. Monthly Searches: ${stats.estimatedMonthlySearches.toLocaleString()}`);
  console.log(`   💰 Est. Monthly Revenue: $${stats.estimatedMonthlyEarnings.toLocaleString()}`);
};
