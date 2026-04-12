// lib/credits-client.ts (Browser-side only)

export const CREDIT_CONFIG = {
  dailyFree: 3,        // Base credits per day
  maxFromAds: 5,       // Max credits from watching ads/day
  creditExpiryHours: 24, // Credits reset after 24h
};

export interface LocalCredits {
  available: number;
  fromAds: number;
  lastReset: number;
  adsWatchedToday: number;
}

const STORAGE_KEY = 'thumbmagic_local_credits';

export function getUserCredits(): LocalCredits {
  if (typeof window === 'undefined') return initializeCredits();
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return initializeCredits();
  
  try {
    const data = JSON.parse(stored) as LocalCredits;
    const now = Date.now();
    
    // Check if daily reset needed
    if (now - data.lastReset > CREDIT_CONFIG.creditExpiryHours * 60 * 60 * 1000) {
      return resetDailyCredits();
    }
    
    return data;
  } catch (error) {
    console.error('Failed to parse local credits:', error);
    return initializeCredits();
  }
}

export function addCreditFromAd(): { success: boolean; reason?: string; newCredits?: number } {
  const credits = getUserCredits();
  
  if (credits.adsWatchedToday >= CREDIT_CONFIG.maxFromAds) {
    return { success: false, reason: 'daily_limit_reached' };
  }
  
  const updated: LocalCredits = {
    ...credits,
    available: credits.available + 1,
    fromAds: credits.fromAds + 1,
    adsWatchedToday: credits.adsWatchedToday + 1,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // Dispatch custom event for UI updates
  window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: updated }));
  
  return { success: true, newCredits: updated.available };
}

export function useCredit(count = 1): { success: boolean; reason?: string; remaining?: number } {
  const credits = getUserCredits();
  
  if (credits.available < count) {
    return { success: false, reason: 'insufficient_credits' };
  }
  
  const updated: LocalCredits = {
    ...credits,
    available: credits.available - count,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // Dispatch custom event for UI updates
  window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: updated }));
  
  return { success: true, remaining: updated.available };
}

function initializeCredits(): LocalCredits {
  const data: LocalCredits = {
    available: CREDIT_CONFIG.dailyFree,
    fromAds: 0,
    lastReset: Date.now(),
    adsWatchedToday: 0,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  return data;
}

function resetDailyCredits(): LocalCredits {
  const data: LocalCredits = {
    available: CREDIT_CONFIG.dailyFree,
    fromAds: 0,
    lastReset: Date.now(),
    adsWatchedToday: 0,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  return data;
}
