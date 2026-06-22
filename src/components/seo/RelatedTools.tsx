/**
 * CreatorBoost AI — Related Tools Component
 * Displays contextual related tools for tool pages
 * Uses internal linking engine for intelligent recommendations
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, ExternalLink } from 'lucide-react';
import { getRelatedTools, type LinkItem } from '../../config/internal-linking';
import type { ToolVariant } from '../../config/tools-registry';

interface RelatedToolsProps {
  tool: ToolVariant;
  limit?: number;
  className?: string;
}

export default function RelatedTools({ tool, limit = 8, className = '' }: RelatedToolsProps) {
  const relatedTools = getRelatedTools(tool, limit);

  if (relatedTools.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-brand-400" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-white">Related Tools</h2>
          <p className="text-xs text-white/40">More tools you might find useful</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {relatedTools.map((item, i) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link
              to={item.path}
              className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-brand-400 transition-colors flex-shrink-0 mt-0.5" />
              </div>
              {item.description && (
                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
              {item.context && (
                <span className="inline-block mt-2 text-[10px] text-brand-400/60 font-medium">
                  {item.context}
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
