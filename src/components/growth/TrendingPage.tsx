/**
 * CreatorBoost AI — Trending Page
 * Full-page trending tools with detailed stats
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Eye, Heart, ArrowUpRight, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getTrendingTools, type ToolEntry } from '../../config/tools-database';
import { calculateTrendingScores, type TrendingScore } from '../../lib/trending';
import { Helmet } from 'react-helmet-async';

export default function TrendingPage() {
  const [tools, setTools] = useState<Array<{ tool: ToolEntry; score: TrendingScore }>>([]);

  useEffect(() => {
    const allTools = getTrendingTools();
    const scores = calculateTrendingScores(allTools.map(t => t.id));
    const toolMap = new Map(allTools.map(t => [t.id, t]));
    const combined = scores
      .map(s => ({ tool: toolMap.get(s.toolId)!, score: s }))
      .filter(item => item.tool);
    setTools(combined);
  }, []);

  return (
    <>
      <Helmet>
        <title>Trending Tools — CreatorBoost AI</title>
        <meta name="description" content="Discover the most popular tools on CreatorBoost AI. See what creators are using right now." />
      </Helmet>

      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white mb-2">Trending Tools</h1>
          <p className="text-sm text-white/40">Discover what creators are using right now</p>
        </div>

        <div className="space-y-2">
          {tools.map(({ tool, score }, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={`/tools/${tool.slug}`}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border transition-all group',
                  i < 3
                    ? 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
                  i < 3 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/[0.04] text-white/40'
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-white/40 line-clamp-1">{tool.shortDescription}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30">
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{score.usageCount} uses</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{score.searchCount} searches</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-bold text-orange-400">{score.score}</span>
                  <p className="text-[9px] text-white/20">score</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-orange-400 transition-colors flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
