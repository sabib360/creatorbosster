/**
 * User Dashboard
 * Personalized view with recently used, favorites, trending, and recommendations.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, Star, TrendingUp, Sparkles, ArrowRight, BarChart3,
  Heart, Zap, History, ChevronRight, Search, Trash2, X
} from 'lucide-react';
import { getRecentlyUsed } from '../hooks/useRecentlyUsed';
import { useFavorites } from '../hooks/useFavorites';
import { getTrendingTools, getPopularTools, searchTools, type ToolEntry } from '../config/tools-database';
import { getUsageStats } from '../lib/trending';
import { cn } from '../lib/utils';

const MAX_RECENT = 10;

export default function UserDashboard() {
  const [recentTools, setRecentTools] = useState(getRecentlyUsed);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [stats, setStats] = useState(getUsageStats);

  useEffect(() => {
    const refresh = () => {
      setRecentTools(getRecentlyUsed());
      setStats(getUsageStats());
    };
    window.addEventListener('storage', refresh);
    window.addEventListener('favoritesChanged', refresh);
    window.addEventListener('trendingChanged', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('favoritesChanged', refresh);
      window.removeEventListener('trendingChanged', refresh);
    };
  }, []);

  const trending = useMemo(() => getTrendingTools().slice(0, 6), []);
  const popular = useMemo(() => getPopularTools().slice(0, 6), []);

  const favoriteTools = useMemo(() => {
    if (favorites.length === 0) return [];
    return favorites.slice(0, 8).map(id => {
      const tools = searchTools(id);
      return tools[0] || null;
    }).filter(Boolean) as ToolEntry[];
  }, [favorites]);

  const isEmpty = recentTools.length === 0 && favorites.length === 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white mb-2">
          Your Dashboard
        </h1>
        <p className="text-sm text-white/50">
          Quick access to your tools, favorites, and personalized recommendations.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Tools Used', value: stats.totalUsage, icon: Zap, color: 'text-primary' },
          { label: 'Searches', value: stats.totalSearches, icon: Search, color: 'text-cyan-400' },
          { label: 'Favorites', value: stats.totalFavorites, icon: Heart, color: 'text-pink-400' },
          { label: 'Recent', value: recentTools.length, icon: Clock, color: 'text-amber-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
            <stat.icon className={cn("w-4 h-4 mx-auto mb-2", stat.color)} />
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recently Used */}
      {recentTools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Recently Used
            </h2>
            <span className="text-xs text-white/30">{recentTools.length} tools</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTools.slice(0, MAX_RECENT).map((tool, i) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={tool.path}
                  className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{tool.name}</p>
                    <p className="text-[10px] text-white/30">{timeAgo(tool.timestamp)}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Favorites */}
      {favoriteTools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-pink-400" /> Favorites
            </h2>
            <span className="text-xs text-white/30">{favorites.length} tools</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteTools.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group">
                  <Link to={`/tools/${tool.slug}`} className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                      <Star className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{tool.name}</p>
                      <p className="text-[10px] text-white/30 truncate">{tool.shortDescription}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleFavorite(tool.id)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Remove from favorites"
                  >
                    <X className="w-3.5 h-3.5 text-white/30 hover:text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-bold text-white/60 mb-2">Welcome to CreatorBoost AI</h3>
          <p className="text-sm text-white/40 max-w-md mx-auto mb-6">
            Start using tools and they will appear here. Your recent tools, favorites, and usage stats will be tracked automatically.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Browse Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Trending Tools */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-400" /> Trending Now
          </h2>
          <Link to="/" className="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {trending.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/tools/${tool.slug}`}
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{tool.name}</p>
                  <p className="text-[10px] text-white/30 truncate">{tool.shortDescription}</p>
                </div>
                {tool.trending && (
                  <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full flex-shrink-0">🔥 HOT</span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Tools */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Most Popular
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popular.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/tools/${tool.slug}`}
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{tool.name}</p>
                  <p className="text-[10px] text-white/30 truncate">{tool.shortDescription}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
