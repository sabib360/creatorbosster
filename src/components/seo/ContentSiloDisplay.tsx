/**
 * CreatorBoost AI — Content Silo Component
 * Displays a topical authority cluster with all related content
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, BookOpen, Wrench, Tag } from 'lucide-react';
import { CONTENT_SILOS, getSiloInternalLinks, type ContentSilo } from '../../config/content-silos';
import { ALL_TOOLS } from '../../config/tools-registry';
import { BLOG_POSTS } from '../../config/blog-data';

interface ContentSiloProps {
  siloId: string;
  className?: string;
}

export default function ContentSiloDisplay({ siloId, className = '' }: ContentSiloProps) {
  const silo = CONTENT_SILOS.find((s) => s.id === siloId);
  if (!silo) return null;

  const links = getSiloInternalLinks(silo.hubPage);
  const tools = links.filter((l) => l.type === 'tool');
  const articles = links.filter((l) => l.type === 'article');

  return (
    <section className={className}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 flex items-center justify-center border border-brand-500/20">
          <Layers className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-white">{silo.name}</h2>
          <p className="text-sm text-white/40">{silo.description}</p>
        </div>
      </div>

      {/* Primary Keywords */}
      <div className="flex flex-wrap gap-2 mb-6">
        {silo.primaryKeywords.map((kw) => (
          <span
            key={kw}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20"
          >
            <Tag className="w-3 h-3" />
            {kw}
          </span>
        ))}
      </div>

      {/* Tools Grid */}
      {tools.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Tools in this Cluster
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="w-4 h-4 text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors truncate">
                      {item.name}
                    </h4>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-brand-400 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {articles.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Related Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {articles.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {item.name}
                    </h4>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/** List all available silos */
export function AllSilosList({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-8 ${className}`}>
      {CONTENT_SILOS.map((silo) => (
        <ContentSiloDisplay key={silo.id} siloId={silo.id} />
      ))}
    </div>
  );
}
