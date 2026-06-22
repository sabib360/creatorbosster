import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap } from 'lucide-react';
import type { ToolConfig } from '../../config/tools-config';

interface ToolCardProps {
  tool: ToolConfig;
  variant?: 'default' | 'compact' | 'featured';
}

export default function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/tools/${tool.slug}`}
        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white/70 group-hover:text-primary transition-colors truncate">{tool.toolName}</p>
          <p className="text-[10px] text-white/30 truncate">{tool.shortDescription}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        to={`/tools/${tool.slug}`}
        className="group relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            Featured
          </span>
          <ArrowUpRight className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-lg font-display font-bold text-white group-hover:text-primary transition-colors mb-2">
          {tool.toolName}
        </h3>
        <p className="text-sm text-white/50 line-clamp-2 leading-relaxed mb-4">
          {tool.shortDescription}
        </p>
        <div className="flex items-center gap-2">
          {tool.keywords.slice(0, 3).map((kw, i) => (
            <span key={i} className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
              {kw}
            </span>
          ))}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="group p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-primary/30 hover:bg-white/[0.06] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
          {tool.toolName}
        </h3>
        <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-primary flex-shrink-0 mt-0.5" />
      </div>
      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-3">{tool.shortDescription}</p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
          {tool.category}
        </span>
        {tool.popular && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/60 bg-amber-400/5 px-2 py-0.5 rounded-full">
            Popular
          </span>
        )}
        {tool.trending && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-green-400/60 bg-green-400/5 px-2 py-0.5 rounded-full">
            Trending
          </span>
        )}
      </div>
    </Link>
  );
}
