/**
 * Advanced Search System
 * Features: Instant search, suggestions, trending, recent, keyboard nav, no-result state.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Clock, TrendingUp, ArrowRight, Sparkles,
  Hash, FileText, ImageIcon, Brain, Calculator, Youtube,
  Code, Lightbulb, SearchX
} from 'lucide-react';
import { searchTools, getTrendingTools, getPopularTools, CATEGORIES, type ToolEntry } from '../config/tools-database';
import { BLOG_POSTS } from '../config/blog-data';

const RECENT_KEY = 'cb_recent_searches';
const MAX_RECENT = 8;

function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function addRecentSearch(query: string) {
  const recent = getRecentSearches().filter(r => r.toLowerCase() !== query.toLowerCase());
  recent.unshift(query);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY);
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'ai-tools': <Brain className="w-3.5 h-3.5" />,
  'image-tools': <ImageIcon className="w-3.5 h-3.5" />,
  'pdf-tools': <FileText className="w-3.5 h-3.5" />,
  'seo-tools': <Hash className="w-3.5 h-3.5" />,
  'youtube-tools': <Youtube className="w-3.5 h-3.5" />,
  'social-media-tools': <Hash className="w-3.5 h-3.5" />,
  'finance-tools': <Calculator className="w-3.5 h-3.5" />,
  'developer-tools': <Code className="w-3.5 h-3.5" />,
};

interface SearchResult {
  type: 'tool' | 'blog' | 'category';
  id: string;
  name: string;
  description: string;
  path: string;
  category?: string;
}

interface ToolSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolSearch({ isOpen, onClose }: ToolSearchProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setQuery('');
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Search results
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const toolResults = searchTools(query).slice(0, 5).map(tool => ({
      type: 'tool' as const,
      id: tool.id,
      name: tool.name,
      description: tool.shortDescription,
      path: `/tools/${tool.slug}`,
      category: tool.category,
    }));

    const blogResults = BLOG_POSTS.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 3).map(post => ({
      type: 'blog' as const,
      id: post.id,
      name: post.title,
      description: post.excerpt.slice(0, 100) + '...',
      path: `/blog/${post.slug}`,
    }));

    const categoryResults = CATEGORIES.filter(cat =>
      cat.name.toLowerCase().includes(query.toLowerCase()) ||
      cat.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 2).map(cat => ({
      type: 'category' as const,
      id: cat.id,
      name: cat.name,
      description: cat.description,
      path: `/category/${cat.id}`,
    }));

    return [...toolResults, ...blogResults, ...categoryResults];
  }, [query]);

  const trending = useMemo(() => getTrendingTools().slice(0, 5), []);
  const popular = useMemo(() => getPopularTools().slice(0, 3), []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = results.length > 0 ? results : [];
    const maxIndex = items.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < maxIndex ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : maxIndex);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          handleSelect(items[selectedIndex]);
        } else if (results.length > 0) {
          handleSelect(results[0]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [results, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-search-item]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    addRecentSearch(query || result.name);
    navigate(result.path);
    onClose();
  };

  const handleTrendingClick = (tool: ToolEntry) => {
    addRecentSearch(tool.name);
    navigate(`/tools/${tool.slug}`);
    onClose();
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (results.length > 0) {
      handleSelect(results[0]);
    }
  };

  const allItems = results.length > 0 ? results : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[92%] max-w-2xl z-[210]"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
                <Search className="w-5 h-5 text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search tools, blogs, categories..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1); }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-sm"
                  aria-label="Search"
                  aria-expanded={results.length > 0}
                  aria-controls="search-results"
                  role="combobox"
                  aria-autocomplete="list"
                />
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 text-white/40 text-[10px] rounded font-mono">ESC</kbd>
                  <button type="button" onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                </div>
              </form>

              {/* Results */}
              <div ref={listRef} id="search-results" role="listbox" className="max-h-[60vh] overflow-y-auto">
                {query.trim() && results.length > 0 ? (
                  <div className="p-2">
                    <div className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      Results ({results.length})
                    </div>
                    {results.map((result, index) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        data-search-item
                        role="option"
                        aria-selected={selectedIndex === index}
                        onClick={() => handleSelect(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left ${
                          selectedIndex === index ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          result.type === 'tool' ? 'bg-primary/10' :
                          result.type === 'blog' ? 'bg-purple-500/10' :
                          'bg-cyan-500/10'
                        }`}>
                          {result.type === 'tool' ? (
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                          ) : result.type === 'blog' ? (
                            <FileText className="w-3.5 h-3.5 text-purple-400" />
                          ) : (
                            <Hash className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{result.name}</p>
                          <p className="text-[11px] text-white/40 truncate">{result.description}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                          result.type === 'tool' ? 'text-white/30 bg-white/[0.04]' :
                          result.type === 'blog' ? 'text-purple-400/60 bg-purple-500/10' :
                          'text-cyan-400/60 bg-cyan-500/10'
                        }`}>
                          {result.type}
                        </span>
                        <ArrowRight className="w-3 h-3 text-white/20 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : query.trim() && results.length === 0 ? (
                  /* No Results State */
                  <div className="p-8 text-center">
                    <SearchX className="w-12 h-12 text-white/15 mx-auto mb-4" />
                    <p className="text-white/50 text-sm font-bold mb-1">No results for "{query}"</p>
                    <p className="text-white/30 text-xs mb-6">Try a different search term or browse popular tools below.</p>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Popular Tools</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {popular.map(tool => (
                            <button
                              key={tool.id}
                              onClick={() => { addRecentSearch(tool.name); navigate(`/tools/${tool.slug}`); onClose(); }}
                              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-white/50 hover:text-white transition-colors"
                            >
                              {tool.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Search Tips</p>
                        <ul className="text-xs text-white/30 space-y-1">
                          <li>• Try shorter or broader keywords</li>
                          <li>• Check spelling</li>
                          <li>• Browse categories instead</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Default State */
                  <div className="p-2">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="mb-2">
                        <div className="px-3 py-2 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> Recent
                          </span>
                          <button
                            onClick={handleClearRecent}
                            className="text-[10px] text-white/20 hover:text-white/40 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors text-left"
                          >
                            <Clock className="w-3.5 h-3.5 text-white/20" />
                            <span className="text-sm text-white/60">{term}</span>
                            <ArrowRight className="w-3 h-3 text-white/10 ml-auto" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Trending */}
                    <div className="mb-2">
                      <div className="px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3" /> Trending Now
                      </div>
                      {trending.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => handleTrendingClick(tool)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors text-left"
                        >
                          <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-3 h-3 text-red-400/60" />
                          </div>
                          <span className="text-sm text-white/60">{tool.name}</span>
                          <span className="ml-auto text-[10px] text-white/20">{tool.category.replace('-tools', '')}</span>
                        </button>
                      ))}
                    </div>

                    {/* Quick Links */}
                    <div className="px-3 py-2 border-t border-white/[0.04]">
                      <div className="flex flex-wrap gap-2 pt-2">
                        {CATEGORIES.slice(0, 6).map(cat => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            onClick={onClose}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] rounded-lg text-[10px] text-white/30 hover:text-white/50 transition-colors"
                          >
                            {CATEGORY_ICONS[cat.id]}
                            {cat.shortName}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-white/20">
                <div className="flex items-center gap-3">
                  <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">↑↓</kbd> Navigate</span>
                  <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">↵</kbd> Select</span>
                  <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">esc</kbd> Close</span>
                </div>
                <Link to="/" onClick={onClose} className="hover:text-primary transition-colors">Browse all tools</Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
