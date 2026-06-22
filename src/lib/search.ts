/**
 * Fuzzy Search Engine
 * Fast, typo-tolerant search with scoring. No external dependencies.
 */

export interface FuzzyMatch {
  score: number;
  indices: number[];
}

/**
 * Simple fuzzy matching algorithm.
 * Returns a score (higher = better match) and matched character indices.
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatch | null {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact match bonus
  if (t === q) return { score: 1000, indices: Array.from({ length: q.length }, (_, i) => i) };

  // Starts-with bonus
  if (t.startsWith(q)) {
    return { score: 900 + (q.length / t.length) * 100, indices: Array.from({ length: q.length }, (_, i) => i) };
  }

  // Contains match bonus
  const containsIdx = t.indexOf(q);
  if (containsIdx >= 0) {
    return { score: 700 + (q.length / t.length) * 100 - containsIdx, indices: Array.from({ length: q.length }, (_, i) => containsIdx + i) };
  }

  // Fuzzy character-by-character match
  let qi = 0;
  let score = 0;
  const indices: number[] = [];
  let lastMatchIdx = -1;
  let consecutiveBonus = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      indices.push(ti);

      // Consecutive character bonus
      if (lastMatchIdx === ti - 1) {
        consecutiveBonus += 15;
      } else {
        consecutiveBonus = 0;
      }

      // Word boundary bonus (after space, hyphen, or at start)
      if (ti === 0 || t[ti - 1] === ' ' || t[ti - 1] === '-' || t[ti - 1] === '_') {
        score += 20;
      }

      score += 10 + consecutiveBonus;
      lastMatchIdx = ti;
      qi++;
    }
  }

  // All characters matched?
  if (qi < q.length) return null;

  // Penalize for spread-out matches
  const spread = indices[indices.length - 1] - indices[0];
  score -= spread * 0.5;

  // Bonus for shorter targets (more relevant)
  score += Math.max(0, 50 - t.length);

  return { score: Math.max(0, score), indices };
}

/**
 * Fuzzy search across an array of items.
 * Returns items sorted by match score.
 */
export function fuzzySearch<T>(
  query: string,
  items: T[],
  keys: (keyof T)[],
  limit: number = 10
): Array<T & { _score: number; _matches: Record<string, FuzzyMatch> }> {
  if (!query.trim()) return [];

  const results: Array<T & { _score: number; _matches: Record<string, FuzzyMatch> }> = [];

  for (const item of items) {
    let bestScore = 0;
    const matches: Record<string, FuzzyMatch> = {};

    for (const key of keys) {
      const value = String(item[key] || '');
      const match = fuzzyMatch(query, value);
      if (match && match.score > bestScore) {
        bestScore = match.score;
        matches[String(key)] = match;
      }
    }

    if (bestScore > 0) {
      results.push({ ...item, _score: bestScore, _matches: matches });
    }
  }

  return results
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);
}

/**
 * Debounce utility.
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

/**
 * Search analytics - track searches, clicks, no-results.
 */
const ANALYTICS_KEY = 'cb_search_analytics';

interface SearchAnalytics {
  searches: Record<string, number>;
  clicks: Record<string, number>;
  noResults: Record<string, number>;
  totalSearches: number;
}

function getAnalytics(): SearchAnalytics {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { searches: {}, clicks: {}, noResults: {}, totalSearches: 0 };
}

function saveAnalytics(data: SearchAnalytics) {
  try { localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data)); } catch {}
}

export function trackSearch(query: string) {
  const data = getAnalytics();
  data.searches[query] = (data.searches[query] || 0) + 1;
  data.totalSearches++;
  saveAnalytics(data);
}

export function trackSearchClick(query: string, resultId: string) {
  const data = getAnalytics();
  data.clicks[`${query}:${resultId}`] = (data.clicks[`${query}:${resultId}`] || 0) + 1;
  saveAnalytics(data);
}

export function trackNoResult(query: string) {
  const data = getAnalytics();
  data.noResults[query] = (data.noResults[query] || 0) + 1;
  saveAnalytics(data);
}

export function getSearchAnalytics(): SearchAnalytics {
  return getAnalytics();
}

export function getPopularSearches(limit: number = 10): string[] {
  const data = getAnalytics();
  return Object.entries(data.searches)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([query]) => query);
}

export function getNoResultSearches(limit: number = 10): string[] {
  const data = getAnalytics();
  return Object.entries(data.noResults)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([query]) => query);
}
