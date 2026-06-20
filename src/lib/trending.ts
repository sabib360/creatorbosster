/**
 * Trending Algorithm
 * Calculates trending scores based on usage, searches, and recency.
 */

const USAGE_KEY = 'cb_tool_usage';
const SEARCH_KEY = 'cb_tool_searches';
const FAVORITES_KEY = 'cb_favorites';

export interface TrendingScore {
  toolId: string;
  score: number;
  usageCount: number;
  searchCount: number;
  favoriteCount: number;
}

function getUsageData(): Record<string, number> {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function getSearchData(): Record<string, number> {
  try {
    const raw = localStorage.getItem(SEARCH_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function getFavoritesData(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/**
 * Record a tool usage event
 */
export function recordToolUsage(toolId: string) {
  const data = getUsageData();
  data[toolId] = (data[toolId] || 0) + 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('trendingChanged'));
}

/**
 * Record a tool search
 */
export function recordToolSearch(toolId: string) {
  const data = getSearchData();
  data[toolId] = (data[toolId] || 0) + 1;
  localStorage.setItem(SEARCH_KEY, JSON.stringify(data));
}

/**
 * Calculate trending scores for all tools
 */
export function calculateTrendingScores(toolIds: string[]): TrendingScore[] {
  const usage = getUsageData();
  const searches = getSearchData();
  const favorites = getFavoritesData();

  return toolIds.map(id => ({
    toolId: id,
    usageCount: usage[id] || 0,
    searchCount: searches[id] || 0,
    favoriteCount: favorites.includes(id) ? 1 : 0,
    score: (usage[id] || 0) * 2 + (searches[id] || 0) * 3 + (favorites.includes(id) ? 5 : 0),
  })).sort((a, b) => b.score - a.score);
}

/**
 * Get top trending tool IDs
 */
export function getTopTrending(toolIds: string[], limit: number = 10): string[] {
  return calculateTrendingScores(toolIds)
    .slice(0, limit)
    .map(s => s.toolId);
}

/**
 * Get trending score for a single tool
 */
export function getToolTrendingScore(toolId: string): TrendingScore {
  const scores = calculateTrendingScores([toolId]);
  return scores[0] || { toolId, score: 0, usageCount: 0, searchCount: 0, favoriteCount: 0 };
}

/**
 * Get usage statistics
 */
export function getUsageStats() {
  const usage = getUsageData();
  const searches = getSearchData();
  const favorites = getFavoritesData();

  const totalUsage = Object.values(usage).reduce((sum, count) => sum + count, 0);
  const totalSearches = Object.values(searches).reduce((sum, count) => sum + count, 0);
  const totalFavorites = favorites.length;

  const mostUsed = Object.entries(usage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }));

  const mostSearched = Object.entries(searches)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }));

  return {
    totalUsage,
    totalSearches,
    totalFavorites,
    mostUsed,
    mostSearched,
  };
}
