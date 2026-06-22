/**
 * World-Class Command Palette
 * Inspired by Raycast, Linear, Arc Browser, Notion, Perplexity.
 * "The fastest way to find anything on CreatorBoostAI."
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Clock, TrendingUp, ArrowRight, Sparkles,
  Hash, FileText, ImageIcon, Brain, Calculator, Youtube,
  Code, Command, CornerDownLeft, ArrowUpRight, Star,
  Home, Heart, Bookmark, Zap, Settings, HelpCircle,
  Image, Clapperboard, Globe, Palette, Megaphone,
  History, Trash2, ArrowUp, ArrowDown, CornerDownLeft as Enter,
  Lightbulb, SearchX, Filter, ChevronRight, ExternalLink
} from 'lucide-react';
import {
  searchTools, getTrendingTools, getPopularTools,
  CATEGORIES, type ToolEntry
} from '../config/tools-database';
import { BLOG_POSTS } from '../config/blog-data';
import { cn } from '../lib/utils';
import {
  fuzzySearch, trackSearch,
  trackSearchClick, trackNoResult, getPopularSearches,
} from '../lib/search';

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════ */

const RECENT_KEY = 'cb_cmd_recent_v2';
const MAX_RECENT = 8;

const CATEGORY_ICONS: Record<string, typeof Brain> = {
  'ai-tools': Brain,
  'image-tools': ImageIcon,
  'pdf-tools': FileText,
  'seo-tools': Globe,
  'youtube-tools': Youtube,
  'social-media-tools': Megaphone,
  'finance-tools': Calculator,
  'developer-tools': Code,
};

type ResultType = 'tool' | 'blog' | 'category' | 'page' | 'action' | 'history' | 'favorite';

interface SearchResult {
  type: ResultType;
  id: string;
  name: string;
  description?: string;
  path: string;
  icon: React.ReactNode;
  category?: string;
  badge?: string;
  shortcut?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

/* ═══════════════════════════════════════════════════════════════════
   RECENT SEARCHES
   ═══════════════════════════════════════════════════════════════════ */

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}

function saveRecent(q: string) {
  const r = getRecent().filter(x => x.toLowerCase() !== q.toLowerCase());
  r.unshift(q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, MAX_RECENT)));
}

function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}

function deleteRecent(q: string) {
  const r = getRecent().filter(x => x !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(r));
}

/* ═══════════════════════════════════════════════════════════════════
   FAVORITES
   ═══════════════════════════════════════════════════════════════════ */

function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem('cb_favorites') || '[]'); } catch { return []; }
}

/* ═══════════════════════════════════════════════════════════════════
   QUICK ACTIONS
   ═══════════════════════════════════════════════════════════════════ */

const QUICK_ACTIONS: SearchResult[] = [
  { type: 'action', id: 'gen-image', name: 'Generate Image', description: 'Create AI images from text', path: '/tools/ai-image-generator', icon: <Sparkles className="w-4 h-4" />, shortcut: '⌘1' },
  { type: 'action', id: 'remove-bg', name: 'Remove Background', description: 'AI background removal', path: '/tools/background-remover', icon: <Image className="w-4 h-4" />, shortcut: '⌘2' },
  { type: 'action', id: 'gen-caption', name: 'Create Caption', description: 'AI caption generator', path: '/tools/ai-caption-generator', icon: <Megaphone className="w-4 h-4" />, shortcut: '⌘3' },
  { type: 'action', id: 'gen-script', name: 'Generate Script', description: 'YouTube script writer', path: '/tools/youtube-script-writer', icon: <Clapperboard className="w-4 h-4" />, shortcut: '⌘4' },
  { type: 'action', id: 'open-dashboard', name: 'Open Dashboard', description: 'Go to your dashboard', path: '/dashboard/tools', icon: <Home className="w-4 h-4" /> },
  { type: 'action', id: 'open-favorites', name: 'Open Favorites', description: 'View your saved tools', path: '/dashboard/tools', icon: <Heart className="w-4 h-4" /> },
];

const NAVIGATION_PAGES: SearchResult[] = [
  { type: 'page', id: 'home', name: 'Home', description: 'CreatorBoost AI homepage', path: '/', icon: <Home className="w-4 h-4" /> },
  { type: 'page', id: 'blog', name: 'Blog', description: 'Articles, tutorials & guides', path: '/blog', icon: <FileText className="w-4 h-4" /> },
  { type: 'page', id: 'ai-tools', name: 'AI Tools', description: 'Browse all AI tools', path: '/ai-tools', icon: <Brain className="w-4 h-4" /> },
  { type: 'page', id: 'image-tools', name: 'Image Tools', description: 'Browse image processing tools', path: '/image-tools', icon: <ImageIcon className="w-4 h-4" /> },
  { type: 'page', id: 'pdf-tools', name: 'PDF Tools', description: 'Browse PDF tools', path: '/pdf-tools', icon: <FileText className="w-4 h-4" /> },
  { type: 'page', id: 'dashboard', name: 'Dashboard', description: 'Your workspace', path: '/dashboard/tools', icon: <Zap className="w-4 h-4" /> },
  { type: 'page', id: 'how-to-use', name: 'How to Use', description: 'Getting started guide', path: '/how-to-use', icon: <HelpCircle className="w-4 h-4" /> },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMMAND PALETTE
   ═══════════════════════════════════════════════════════════════════ */

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filter, setFilter] = useState<ResultType | 'all'>('all');
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /* ── Detect mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Reset on open ── */
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecent());
      setQuery('');
      setSelectedIndex(0);
      setFilter('all');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  /* ── Favorites ── */
  const favorites = useMemo(() => {
    const favIds = getFavorites();
    return favIds.slice(0, 5).map(id => {
      const tools = searchTools(id);
      return tools[0] || null;
    }).filter(Boolean) as ToolEntry[];
  }, [open]);

  /* ── Search Results ── */
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const q = query.trim();

    // Track search
    trackSearch(q);

    // Tools - fuzzy search
    const toolResults = fuzzySearch(q, searchTools(q).slice(0, 20), ['name', 'shortDescription', 'keywords'], 6)
      .map(tool => ({
        type: 'tool' as const,
        id: tool.id,
        name: tool.name,
        description: tool.shortDescription,
        path: `/tools/${tool.slug}`,
        icon: React.createElement(CATEGORY_ICONS[tool.category] || Sparkles, { className: 'w-4 h-4' }),
        category: tool.category,
      }));

    // Blog posts - fuzzy search
    const blogResults = fuzzySearch(q, BLOG_POSTS.slice(0, 30), ['title', 'excerpt', 'tags'], 4)
      .map(post => ({
        type: 'blog' as const,
        id: post.id,
        name: post.title,
        description: post.excerpt?.slice(0, 80) + '...',
        path: `/blog/${post.slug}`,
        icon: <FileText className="w-4 h-4" />,
      }));

    // Categories - fuzzy search
    const categoryResults = fuzzySearch(q, CATEGORIES, ['name', 'description'], 3)
      .map(cat => ({
        type: 'category' as const,
        id: cat.id,
        name: cat.name,
        description: cat.description,
        path: `/tools/${cat.id.replace('-tools', '-tools')}`,
        icon: React.createElement(CATEGORY_ICONS[cat.id] || Hash, { className: 'w-4 h-4' }),
      }));

    // Pages - fuzzy search
    const pageResults = fuzzySearch(q, NAVIGATION_PAGES, ['name', 'description'], 2)
      .map(page => ({
        ...page,
      }));

    // Quick actions - fuzzy search
    const actionResults = fuzzySearch(q, QUICK_ACTIONS, ['name', 'description'], 2)
      .map(action => ({
        ...action,
      }));

    let allResults = [...toolResults, ...blogResults, ...categoryResults, ...pageResults, ...actionResults];

    // Apply filter
    if (filter !== 'all') {
      allResults = allResults.filter(r => r.type === filter);
    }

    // Track no results
    if (allResults.length === 0) {
      trackNoResult(q);
    }

    return allResults;
  }, [query, filter]);

  /* ── Default items (no query) ── */
  const defaultItems = useMemo(() => {
    const trending = getTrendingTools().slice(0, 5).map(tool => ({
      type: 'tool' as const,
      id: tool.id,
      name: tool.name,
      description: tool.shortDescription,
      path: `/tools/${tool.slug}`,
      icon: React.createElement(CATEGORY_ICONS[tool.category] || TrendingUp, { className: 'w-4 h-4' }),
      badge: tool.trending ? 'Trending' : undefined,
    }));

    const popularSearches = getPopularSearches(5);

    return { trending, popularSearches };
  }, [open]);

  /* ── All items for keyboard navigation ── */
  const allItems = useMemo(() => {
    if (query.trim()) return results;

    const items: SearchResult[] = [];

    // Recent searches as clickable items
    if (recentSearches.length > 0) {
      items.push(...recentSearches.map(q => ({
        type: 'history' as const,
        id: `recent-${q}`,
        name: q,
        path: '',
        icon: <Clock className="w-4 h-4" />,
      })));
    }

    // Trending
    items.push(...defaultItems.trending);

    // Favorites
    if (favorites.length > 0) {
      items.push(...favorites.slice(0, 3).map(tool => ({
        type: 'favorite' as const,
        id: `fav-${tool.id}`,
        name: tool.name,
        description: tool.shortDescription,
        path: `/tools/${tool.slug}`,
        icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" />,
      })));
    }

    // Quick actions
    items.push(...QUICK_ACTIONS.slice(0, 3));

    return items;
  }, [query, results, recentSearches, defaultItems, favorites]);

  /* ── Group results by type ── */
  const groupedResults = useMemo(() => {
    if (!query.trim()) return null;

    const groups: Record<string, SearchResult[]> = {};
    for (const result of results) {
      const key = result.type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(result);
    }
    return groups;
  }, [query, results]);

  /* ── Keyboard navigation ── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const maxIndex = allItems.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, maxIndex));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (allItems[selectedIndex]) {
          handleSelect(allItems[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          setSelectedIndex(i => Math.max(i - 1, 0));
        } else {
          setSelectedIndex(i => Math.min(i + 1, maxIndex));
        }
        break;
    }
  }, [allItems, selectedIndex, onClose]);

  /* ── Scroll selected item into view ── */
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-cmd-item]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  /* ── Reset selection on query change ── */
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, filter]);

  /* ── Select item ── */
  const handleSelect = useCallback((result: SearchResult) => {
    if (result.type === 'history') {
      setQuery(result.name);
      return;
    }
    saveRecent(query || result.name);
    trackSearchClick(query || result.name, result.id);
    navigate(result.path);
    onClose();
  }, [query, navigate, onClose]);

  /* ── Clear recent ── */
  const handleClearRecent = useCallback(() => {
    clearRecent();
    setRecentSearches([]);
  }, []);

  /* ── Delete single recent ── */
  const handleDeleteRecent = useCallback((q: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRecent(q);
    setRecentSearches(getRecent());
  }, []);

  if (!open) return null;

  const typeLabels: Record<ResultType, string> = {
    tool: 'Tool',
    blog: 'Article',
    category: 'Category',
    page: 'Page',
    action: 'Action',
    history: 'Recent',
    favorite: 'Favorite',
  };

  const typeColors: Record<ResultType, string> = {
    tool: 'bg-primary/10 text-primary',
    blog: 'bg-cyan-500/10 text-cyan-400',
    category: 'bg-green-500/10 text-green-400',
    page: 'bg-purple-500/10 text-purple-400',
    action: 'bg-amber-500/10 text-amber-400',
    history: 'bg-white/[0.04] text-white/40',
    favorite: 'bg-amber-500/10 text-amber-400',
  };

  let itemIndex = -1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "fixed inset-0 z-[200] flex",
          isMobile ? "items-end" : "items-start justify-center pt-[10vh] sm:pt-[12vh]"
        )}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: isMobile ? 20 : -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: isMobile ? 20 : -15 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className={cn(
            "relative w-full glass-strong rounded-t-3xl sm:rounded-2xl shadow-2xl shadow-black/50 overflow-hidden border border-white/[0.08]",
            isMobile ? "max-h-[90vh]" : "max-w-2xl mx-4 max-h-[75vh]"
          )}
          onClick={e => e.stopPropagation()}
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-purple-500/5 to-primary/10 rounded-2xl blur-xl opacity-50 pointer-events-none" />

          <div className="relative flex flex-col max-h-[inherit]">
            {/* ═══════ SEARCH INPUT ═══════ */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-white/[0.06]">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools, blogs, pages, actions..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none min-w-0"
                aria-label="Search"
                aria-expanded={allItems.length > 0}
                aria-controls="cmd-results"
                role="combobox"
                aria-autocomplete="list"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-white/[0.06] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white/30" />
                </button>
              )}
              <kbd className="px-2 py-1 bg-white/[0.06] text-[10px] text-white/30 rounded-lg font-mono border border-white/[0.08] hidden sm:block">
                ESC
              </kbd>
            </div>

            {/* ═══════ FILTER TABS ═══════ */}
            {query.trim() && (
              <div className="flex items-center gap-1 px-4 sm:px-5 py-2 border-b border-white/[0.04] overflow-x-auto scrollbar-hide">
                {(['all', 'tool', 'blog', 'category', 'page', 'action'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors",
                      filter === f
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-white/30 hover:text-white/50 hover:bg-white/[0.04]"
                    )}
                  >
                    {f === 'all' ? 'All' : typeLabels[f] + 's'}
                  </button>
                ))}
              </div>
            )}

            {/* ═══════ RESULTS ═══════ */}
            <div ref={listRef} id="cmd-results" role="listbox" className="flex-1 overflow-y-auto p-2 min-h-0">
              {query.trim() ? (
                results.length > 0 ? (
                  /* ── Grouped Results ── */
                  <div className="space-y-1">
                    {groupedResults && Object.entries(groupedResults).map(([type, items]) => (
                      <div key={type}>
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/25 flex items-center gap-1.5">
                          {typeLabels[type as ResultType]}s ({items.length})
                        </div>
                        {items.map(result => {
                          itemIndex++;
                          const idx = itemIndex;
                          return (
                            <ResultItem
                              key={`${result.type}-${result.id}`}
                              result={result}
                              index={idx}
                              selectedIndex={selectedIndex}
                              query={query}
                              onSelect={handleSelect}
                              onHover={() => setSelectedIndex(idx)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* ── No Results ── */
                  <div className="py-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                      <SearchX className="w-7 h-7 text-white/10" />
                    </div>
                    <p className="text-sm text-white/40 mb-1">No results for &ldquo;{query}&rdquo;</p>
                    <p className="text-xs text-white/20 mb-6">Try a different search or browse suggestions below.</p>

                    {/* Suggestions */}
                    <div className="space-y-4 max-w-sm mx-auto">
                      <div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Popular Tools</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {getPopularTools().slice(0, 4).map(tool => (
                            <button
                              key={tool.id}
                              onClick={() => { saveRecent(tool.name); navigate(`/tools/${tool.slug}`); onClose(); }}
                              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-white/50 hover:text-white transition-colors"
                            >
                              {tool.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Search Tips</p>
                        <ul className="text-xs text-white/25 space-y-1">
                          <li>Try shorter or broader keywords</li>
                          <li>Check spelling</li>
                          <li>Browse categories instead</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* ── Default State (no query) ── */
                <div className="space-y-1">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="px-3 py-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/25 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Recent Searches
                        </span>
                        <button
                          onClick={handleClearRecent}
                          className="text-[10px] text-white/20 hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" /> Clear
                        </button>
                      </div>
                      {recentSearches.map(q => {
                        itemIndex++;
                        const idx = itemIndex;
                        return (
                          <button
                            key={`recent-${q}`}
                            data-cmd-item
                            role="option"
                            aria-selected={selectedIndex === idx}
                            onClick={() => handleSelect({ type: 'history', id: q, name: q, path: '', icon: <Clock className="w-4 h-4" /> })}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-100 group",
                              selectedIndex === idx
                                ? "bg-white/[0.06] text-white"
                                : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                            )}
                          >
                            <Clock className="w-4 h-4 text-white/20 flex-shrink-0" />
                            <span className="flex-1 text-left text-sm">{q}</span>
                            <button
                              onClick={e => handleDeleteRecent(q, e)}
                              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/[0.06] rounded transition-all"
                            >
                              <X className="w-3 h-3 text-white/30" />
                            </button>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Trending Tools */}
                  <div>
                    <div className="px-3 py-2 text-[10px] font-bold text-white/25 uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-red-400" /> Trending Tools
                    </div>
                    {defaultItems.trending.map(tool => {
                      itemIndex++;
                      const idx = itemIndex;
                      return (
                        <button
                          key={tool.id}
                          data-cmd-item
                          role="option"
                          aria-selected={selectedIndex === idx}
                          onClick={() => handleSelect(tool)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-100 group",
                            selectedIndex === idx
                              ? "bg-primary/10 text-white border border-primary/20"
                              : "text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                            selectedIndex === idx ? "bg-primary/20" : "bg-white/[0.04] group-hover:bg-white/[0.06]"
                          )}>
                            {tool.icon}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-medium truncate">{tool.name}</div>
                            {tool.description && <div className="text-xs text-white/30 truncate">{tool.description}</div>}
                          </div>
                      {tool.badge && (
                        <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          {tool.badge}
                        </span>
                      )}
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/15 group-hover:text-primary flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Favorites */}
                  {favorites.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] font-bold text-white/25 uppercase tracking-widest flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-amber-400" /> Favorites
                      </div>
                      {favorites.slice(0, 3).map(tool => {
                        itemIndex++;
                        const idx = itemIndex;
                        return (
                          <button
                            key={`fav-${tool.id}`}
                            data-cmd-item
                            role="option"
                            aria-selected={selectedIndex === idx}
                            onClick={() => handleSelect({
                              type: 'favorite', id: tool.id, name: tool.name,
                              description: tool.shortDescription, path: `/tools/${tool.slug}`,
                              icon: <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            })}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-100 group",
                              selectedIndex === idx
                                ? "bg-amber-500/10 text-white border border-amber-500/20"
                                : "text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent"
                            )}
                          >
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-sm font-medium truncate">{tool.name}</div>
                              <div className="text-xs text-white/30 truncate">{tool.shortDescription}</div>
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-white/15 group-hover:text-primary flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div>
                    <div className="px-3 py-2 text-[10px] font-bold text-white/25 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-primary" /> Quick Actions
                    </div>
                    {QUICK_ACTIONS.slice(0, 4).map(action => {
                      itemIndex++;
                      const idx = itemIndex;
                      return (
                        <button
                          key={action.id}
                          data-cmd-item
                          role="option"
                          aria-selected={selectedIndex === idx}
                          onClick={() => handleSelect(action)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-100 group",
                            selectedIndex === idx
                              ? "bg-primary/10 text-white border border-primary/20"
                              : "text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                            selectedIndex === idx ? "bg-primary/20" : "bg-white/[0.04]"
                          )}>
                            {action.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">{action.name}</div>
                            <div className="text-xs text-white/30">{action.description}</div>
                          </div>
                          {action.shortcut && (
                            <kbd className="px-1.5 py-0.5 bg-white/[0.06] text-[9px] text-white/25 rounded font-mono border border-white/[0.08] hidden sm:block">
                              {action.shortcut}
                            </kbd>
                          )}
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/15 group-hover:text-primary flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Pages */}
                  <div className="pt-1 border-t border-white/[0.04]">
                    <div className="px-3 py-2 text-[10px] font-bold text-white/25 uppercase tracking-widest flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-purple-400" /> Pages
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {NAVIGATION_PAGES.slice(0, 6).map(page => (
                        <button
                          key={page.id}
                          onClick={() => { navigate(page.path); onClose(); }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors text-left"
                        >
                          {page.icon}
                          <span>{page.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ═══════ FOOTER ═══════ */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-t border-white/[0.06] text-[10px] text-white/20">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white/[0.06] rounded font-mono border border-white/[0.08]">
                    <ArrowUp className="w-2.5 h-2.5 inline" />
                  </kbd>
                  <kbd className="px-1 py-0.5 bg-white/[0.06] rounded font-mono border border-white/[0.08]">
                    <ArrowDown className="w-2.5 h-2.5 inline" />
                  </kbd>
                  <span className="hidden sm:inline">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-white/[0.06] rounded font-mono border border-white/[0.08]">
                    <CornerDownLeft className="w-2.5 h-2.5 inline" />
                  </kbd>
                  <span className="hidden sm:inline">Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded font-mono border border-white/[0.08]">ESC</kbd>
                  <span className="hidden sm:inline">Close</span>
                </span>
              </div>
              <span className="flex items-center gap-1 text-white/15">
                <Sparkles className="w-2.5 h-2.5" /> CreatorBoost AI
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RESULT ITEM
   ═══════════════════════════════════════════════════════════════════ */

function ResultItem({
  result, index, selectedIndex, query, onSelect, onHover
}: {
  result: SearchResult;
  index: number;
  selectedIndex: number;
  query: string;
  onSelect: (r: SearchResult) => void;
  onHover: () => void;
}) {
  const typeColors: Record<ResultType, string> = {
    tool: 'bg-primary/10 text-primary',
    blog: 'bg-cyan-500/10 text-cyan-400',
    category: 'bg-green-500/10 text-green-400',
    page: 'bg-purple-500/10 text-purple-400',
    action: 'bg-amber-500/10 text-amber-400',
    history: 'bg-white/[0.04] text-white/40',
    favorite: 'bg-amber-500/10 text-amber-400',
  };

  const typeLabels: Record<ResultType, string> = {
    tool: 'Tool', blog: 'Article', category: 'Category',
    page: 'Page', action: 'Action', history: 'Recent', favorite: 'Favorite',
  };

  const isSelected = selectedIndex === index;

  return (
    <button
      data-cmd-item
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(result)}
      onMouseEnter={onHover}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-100 group",
        isSelected
          ? "bg-primary/10 text-white border border-primary/20 shadow-lg shadow-primary/5"
          : "text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
        isSelected ? "bg-primary/20" : typeColors[result.type]
      )}>
        {result.icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="text-sm font-medium truncate">{result.name}</div>
        {result.description && (
          <div className="text-xs text-white/30 truncate">{result.description}</div>
        )}
      </div>
      <span className={cn(
        "text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium",
        typeColors[result.type]
      )}>
        {typeLabels[result.type]}
      </span>
      <ArrowUpRight className={cn(
        "w-3.5 h-3.5 flex-shrink-0 transition-colors",
        isSelected ? "text-primary" : "text-white/15 group-hover:text-primary"
      )} />
    </button>
  );
}
