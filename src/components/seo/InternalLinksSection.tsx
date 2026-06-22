/**
 * CreatorBoost AI — Internal Links Component
 * Renders a complete internal linking section for any page
 * Includes: Related Tools, Related Articles, Category Links
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Layers, ExternalLink } from 'lucide-react';
import { getInternalLinks, type LinkItem } from '../../config/internal-linking';

interface InternalLinksSectionProps {
  pathname: string;
  className?: string;
}

export default function InternalLinksSection({ pathname, className = '' }: InternalLinksSectionProps) {
  const links = getInternalLinks(pathname);

  const hasContent =
    links.relatedTools.length > 0 ||
    links.relatedArticles.length > 0 ||
    links.relatedCategories.length > 0;

  if (!hasContent) return null;

  return (
    <div className={`space-y-10 ${className}`}>
      {/* Related Tools */}
      {links.relatedTools.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">Related Tools</h2>
              <p className="text-xs text-white/40">More tools you might find useful</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {links.relatedTools.slice(0, 8).map((item, i) => (
              <ToolLinkCard key={item.path} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Related Articles */}
      {links.relatedArticles.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">Helpful Guides</h2>
              <p className="text-xs text-white/40">Learn more with our tutorials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {links.relatedArticles.slice(0, 4).map((item, i) => (
              <ArticleLinkCard key={item.path} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Related Categories */}
      {links.relatedCategories.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">Explore Categories</h2>
              <p className="text-xs text-white/40">Browse more tool categories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {links.relatedCategories.map((item, i) => (
              <CategoryLinkCard key={item.path} item={item} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function ToolLinkCard({ item, index }: { item: LinkItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
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
      </Link>
    </motion.div>
  );
}

function ArticleLinkCard({ item, index }: { item: LinkItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={item.path}
        className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-200 group"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
            {item.name}
          </h3>
          <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5" />
        </div>
        {item.description && (
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </Link>
    </motion.div>
  );
}

function CategoryLinkCard({ item, index }: { item: LinkItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={item.path}
        className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200 group"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
            {item.name}
          </h3>
          <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-0.5" />
        </div>
        {item.description && (
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </Link>
    </motion.div>
  );
}
