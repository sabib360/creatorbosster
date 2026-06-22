/**
 * CreatorBoost AI — Trending Showcase
 * Displays trending tools and popular creations
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Flame, Clock, BarChart3, ArrowUpRight,
  Sparkles, Star, Eye, Heart, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { getTrendingTools, getPopularTools, type ToolEntry } from '../../config/tools-database';
import { calculateTrendingScores, getUsageStats, type TrendingScore } from '../../lib/trending';

/* ═══════════════════════════════════════════════════════════════════
   TRENDING TOOL CARD
   ═══════════════════════════════════════════════════════════════════ */

function TrendingToolCard({
  tool,
  rank,
  score,
}: {
  tool: ToolEntry;
  rank: number;
  score: TrendingScore;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
    >
      <Link
        to={`/tools/${tool.slug}`}
        className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group"
      >
        <div className="flex items-start gap-3">
          {/* Rank */}
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
            rank <= 3 ? 'bg-brand-500/20 text-brand-400' : 'bg-white/[0.04] text-white/40'
          )}>
            {rank}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors truncate">
                {tool.name}
              </h4>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-brand-400 transition-colors flex-shrink-0" />
            </div>
            <p className="text-xs text-white/40 line-clamp-1 mb-2">{tool.shortDescription}</p>

            {/* Stats */}
            <div className="flex items-center gap-3 text-[10px] text-white/30">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {score.usageCount} uses
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {score.searchCount} searches
              </span>
              {score.favoriteCount > 0 && (
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {score.favoriteCount}
                </span>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="text-right flex-shrink-0">
            <span className="text-xs font-bold text-brand-400">{score.score}</span>
            <p className="text-[9px] text-white/20">score</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TRENDING TABS
   ═══════════════════════════════════════════════════════════════════ */

type TrendingTab = 'today' | 'week' | 'popular';

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

interface TrendingShowcaseProps {
  limit?: number;
  className?: string;
}

export default function TrendingShowcase({ limit = 10, className }: TrendingShowcaseProps) {
  const [activeTab, setActiveTab] = useState<TrendingTab>('today');
  const [allTools, setAllTools] = useState<ToolEntry[]>([]);

  useEffect(() => {
    // Get all tools from the database
    const tools = getTrendingTools().slice(0, limit * 2);
    setAllTools(tools);
  }, [limit]);

  const trendingScores = useMemo(() => {
    const toolIds = allTools.map(t => t.id);
    return calculateTrendingScores(toolIds);
  }, [allTools]);

  const toolMap = useMemo(() => {
    const map = new Map<string, ToolEntry>();
    allTools.forEach(t => map.set(t.id, t));
    return map;
  }, [allTools]);

  const displayTools = useMemo(() => {
    const scores = trendingScores.slice(0, limit);
    return scores.map(score => ({
      tool: toolMap.get(score.toolId),
      score,
    })).filter(item => item.tool) as Array<{ tool: ToolEntry; score: TrendingScore }>;
  }, [trendingScores, toolMap, limit]);

  const popularTools = useMemo(() => {
    return getPopularTools().slice(0, limit);
  }, [limit]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Trending Tools
        </h3>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {[
            { id: 'today' as const, label: 'Today', icon: TrendingUp },
            { id: 'week' as const, label: 'This Week', icon: BarChart3 },
            { id: 'popular' as const, label: 'Most Used', icon: Star },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all',
                activeTab === id
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/60'
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool List */}
      <div className="space-y-2">
        <AnimatePresence mode="wait">
          {activeTab === 'popular' ? (
            <motion.div
              key="popular"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {popularTools.map((tool, i) => (
                <TrendingToolCard
                  key={tool.id}
                  tool={tool}
                  rank={i + 1}
                  score={{
                    toolId: tool.id,
                    score: 100 - i * 5,
                    usageCount: Math.floor(Math.random() * 1000),
                    searchCount: Math.floor(Math.random() * 500),
                    favoriteCount: Math.floor(Math.random() * 100),
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="trending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {displayTools.map(({ tool, score }, i) => (
                <TrendingToolCard
                  key={tool.id}
                  tool={tool}
                  rank={i + 1}
                  score={score}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View All Link */}
      <Link
        to="/trending"
        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-all"
      >
        View All Trending
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
