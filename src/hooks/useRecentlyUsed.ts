import { useState, useCallback } from 'react';

const STORAGE_KEY = 'creatorboost_recently_used';
const MAX_ITEMS = 5;

interface RecentTool {
  path: string;
  name: string;
  timestamp: number;
}

export function getRecentlyUsed(): RecentTool[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordToolUse(path: string, name: string): void {
  const items = getRecentlyUsed().filter((t) => t.path !== path);
  items.unshift({ path, name, timestamp: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function useRecentlyUsed() {
  const [tools] = useState<RecentTool[]>(getRecentlyUsed);

  const refresh = useCallback(() => {
    // Force re-render by toggling state
    return getRecentlyUsed();
  }, []);

  return { tools: tools.filter((t) => Date.now() - t.timestamp < 30 * 24 * 60 * 60 * 1000), refresh };
}
