/**
 * CreatorBoost AI — Related Articles Component
 * Displays contextual related blog articles
 * Used on tool pages and blog posts
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { getRelatedArticles, getBlogRelatedArticles, type LinkItem } from '../../config/internal-linking';
import type { ToolVariant } from '../../config/tools-registry';
import type { BlogPost } from '../../config/blog-data';

interface RelatedArticlesFromToolProps {
  tool: ToolVariant;
  limit?: number;
  className?: string;
}

interface RelatedArticlesFromBlogProps {
  post: BlogPost;
  limit?: number;
  className?: string;
}

export function RelatedArticlesFromTool({ tool, limit = 4, className = '' }: RelatedArticlesFromToolProps) {
  const articles = getRelatedArticles(tool, limit);

  if (articles.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-white">Helpful Guides</h2>
          <p className="text-xs text-white/40">Learn more about {tool.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map((article, i) => (
          <motion.div
            key={article.path}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link
              to={article.path}
              className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {article.name}
                </h3>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5" />
              </div>
              {article.description && (
                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function RelatedArticlesFromBlog({ post, limit = 4, className = '' }: RelatedArticlesFromBlogProps) {
  const articles = getBlogRelatedArticles(post, limit);

  if (articles.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-white">Related Articles</h2>
          <p className="text-xs text-white/40">Continue reading</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map((article, i) => (
          <motion.div
            key={article.path}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link
              to={article.path}
              className="block p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                  {article.name}
                </h3>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-0.5" />
              </div>
              {article.description && (
                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
