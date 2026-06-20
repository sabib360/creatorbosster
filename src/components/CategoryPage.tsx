import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronRight, Home, Star, Users, ArrowRight,
  ChevronDown, Zap, Brain, FileText, Share2, Code, Calculator,
  Youtube, TrendingUp, Sparkles, ExternalLink
} from 'lucide-react';
import SEOHead from './SEOHead';
import Breadcrumb from './Breadcrumb';
import { collectionPageSchema, breadcrumbSchema, toolFAQSchema } from '../lib/schema';
import {
  getCategoryById, getToolsByCategory, searchTools,
  CATEGORIES, TOOLS_DATABASE,
  type ToolCategory, type ToolEntry, type CategoryEntry
} from '../config/tools-database';

const SITE_URL = 'https://creatorboostai.xyz';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Brain, ImageIcon: FileText, FileText, SearchCode: Code, Youtube,
  Share2, Calculator, Code, Zap, Sparkles, TrendingUp,
};

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Zap;
  return <Icon className={className} />;
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const category = getCategoryById(categoryId as ToolCategory);
  const allTools = category ? getToolsByCategory(category.id) : [];

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return allTools;
    const q = searchQuery.toLowerCase();
    return allTools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [searchQuery, allTools]);

  if (!category) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
        <Link to="/" className="text-primary hover:underline text-sm">Go back to homepage</Link>
      </div>
    );
  }

  const canonicalUrl = `${SITE_URL}/category/${category.id}`;
  const trendingInCategory = allTools.filter(t => t.trending).slice(0, 3);
  const popularInCategory = allTools.filter(t => t.popular).slice(0, 6);
  const relatedCategories = CATEGORIES.filter(c => c.id !== category.id).slice(0, 4);

  const categorySchema = collectionPageSchema(category.name, canonicalUrl, []);
  const faqSchemaData = category.faqs.length > 0 ? toolFAQSchema(category.faqs) : null;

  return (
    <>
      <SEOHead
        title={category.metaTitle}
        description={category.metaDescription}
        keywords={category.keywords.join(', ')}
        canonicalUrl={canonicalUrl}
        structuredData={[categorySchema, faqSchemaData].filter(Boolean)}
      />

      <div className="max-w-7xl mx-auto">

        {/* ─── Breadcrumb ─── */}
        <Breadcrumb
          items={[
            { name: category.name, path: `/category/${category.id}` },
          ]}
          className="mb-8"
        />

        {/* ─── Hero ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl bg-gradient-to-br ${category.gradient} border ${category.border} p-8 sm:p-12 mb-10`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${category.bg}`}>
              <CategoryIcon name={category.icon} className={`w-7 h-7 ${category.color}`} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                {category.name}
              </h1>
              <p className="text-sm text-white/50 mt-1">{allTools.length} free tools available</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-white/50 max-w-2xl leading-relaxed mb-6">
            {category.longDescription}
          </p>

          {/* Search */}
          <div className="max-w-lg relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder={`Search ${category.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/[0.06] border border-white/[0.1] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
              aria-label={`Search ${category.name}`}
            />
          </div>
        </motion.section>

        {/* ─── Tool Grid ─── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">
              {searchQuery ? `Results for "${searchQuery}"` : `All ${category.name}`}
              <span className="text-white/30 text-sm font-normal ml-2">({filteredTools.length})</span>
            </h2>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No tools found matching "{searchQuery}"</p>
              <button onClick={() => setSearchQuery('')} className="text-primary text-xs mt-2 hover:underline">
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} category={category} />
              ))}
            </div>
          )}
        </section>

        {/* ─── Trending in Category ─── */}
        {trendingInCategory.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" /> Trending in {category.shortName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {trendingInCategory.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} category={category} showTrending />
              ))}
            </div>
          </section>
        )}

        {/* ─── FAQ ─── */}
        {category.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {category.faqs.map((item, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-bold text-white pr-4">{item.q}</span>
                    {openFaq === i ? <ChevronDown className="w-4 h-4 text-white/40 rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-white/40 transition-transform" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <div className="px-4 pb-4 text-xs text-white/50 leading-relaxed border-t border-white/[0.04] pt-3">{item.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Related Categories ─── */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-white mb-6">Related Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={`p-5 rounded-xl bg-gradient-to-br ${cat.gradient} border ${cat.border} hover:-translate-y-0.5 transition-all duration-300`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cat.bg}`}>
                    <CategoryIcon name={cat.icon} className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                </div>
                <p className="text-xs text-white/40 line-clamp-2">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function ToolCard({ tool, index, category, showTrending }: { tool: ToolEntry; index: number; category: CategoryEntry; showTrending?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/tools/${tool.slug}`}
        className="group block p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 h-full"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.bg} group-hover:scale-110 transition-transform`}>
            <CategoryIcon name={tool.icon} className={`w-5 h-5 ${category.color}`} />
          </div>
          <div className="flex items-center gap-1.5">
            {showTrending && (
              <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full uppercase">Trending</span>
            )}
            {tool.featured && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full uppercase">Featured</span>
            )}
          </div>
        </div>
        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors mb-1">{tool.name}</h3>
        <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-3">{tool.shortDescription}</p>
        <div className="flex items-center gap-1 text-xs font-semibold text-primary/60 group-hover:text-primary transition-colors">
          Use Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}
