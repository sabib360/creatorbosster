/**
 * Favorites Hook
 * Manages user's favorite tools with localStorage persistence.
 * Supports optional sync when user is logged in.
 */

import { useState, useCallback, useEffect } from 'react';

const FAVORITES_KEY = 'cb_favorites';

function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);

  useEffect(() => {
    const handler = () => setFavorites(getStoredFavorites());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites(prev => {
      const next = prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId];
      saveFavorites(next);
      window.dispatchEvent(new CustomEvent('favoritesChanged'));
      return next;
    });
  }, []);

  const isFavorite = useCallback((toolId: string) => {
    return favorites.includes(toolId);
  }, [favorites]);

  const addFavorite = useCallback((toolId: string) => {
    setFavorites(prev => {
      if (prev.includes(toolId)) return prev;
      const next = [...prev, toolId];
      saveFavorites(next);
      window.dispatchEvent(new CustomEvent('favoritesChanged'));
      return next;
    });
  }, []);

  const removeFavorite = useCallback((toolId: string) => {
    setFavorites(prev => {
      const next = prev.filter(id => id !== toolId);
      saveFavorites(next);
      window.dispatchEvent(new CustomEvent('favoritesChanged'));
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    saveFavorites([]);
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    count: favorites.length,
  };
}
