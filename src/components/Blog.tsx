/**
 * Premium Blog Homepage
 * World-class blog experience inspired by Medium, Linear, Stripe, Vercel.
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Calendar, ArrowRight, Search, ChevronLeft, ChevronRight, Clock, TrendingUp, Mail, Tag, BookOpen, Star, Flame, Eye, ArrowUpRight, Sparkles, X, Filter, SortDesc, ChevronDown, ExternalLink, Share2, Heart, Bookmark, MessageSquare, Hash, Zap, Brain, Image as ImageIcon, FileText, Smartphone, Globe, LayoutGrid, Lightbulb, Megaphone } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import {
  BLOG_POSTS, BLOG_CATEGORIES, getPostBySlug, getFeaturedPosts, getLatestPosts,
  getPopularPosts, getRelatedPosts, searchPosts, getPostsByCategory, getCategoryById,
  type BlogPost, type BlogCategory
} from '../config/blog-data';
import BlogPostView from './BlogPost';
import SEOHead from './SEOHead';
import { blogListingSchema, breadcrumbSchema } from '../lib/schema';

const SITE_URL = 'https://creatorboostai.xyz';
const POSTS_PER_PAGE = 9;

/* ═══════════════════════════════════════════════════════════════════
   BLOG POST ROUTE
   ═══════════════════════════════════════════════════════════════════ */

export function BlogPostRoute() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;
  const navigate = (path: string) => { window.location.href = path; };

  if (!post) return <Blog />;

  const relatedPosts = getRelatedPosts(post, 3);

  return (
    <BlogPostView
      post={post}
      relatedPosts={relatedPosts}
      onBack={() => navigate('/blog')}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CATEGORY ICONS
   ═══════════════════════════════════════════════════════════════════ */

const CATEGORY_ICONS: Record<string, typeof Brain> = {
  'ai': Brain,
  'youtube': Megaphone,
  'seo': Globe,
  'image-editing': ImageIcon,
  'pdf-tools': FileText,
  'social-media': Smartphone,
  'tutorials': BookOpen,
  'technology': Lightbulb,
};

const CATEGORY_COLORS: Record<string, string> = {
  'ai': 'from-cyan-500/20 to-blue-500/20',
  'youtube': 'from-red-500/20 to-orange-500/20',
  'seo': 'from-blue-500/20 to-indigo-500/20',
  'image-editing': 'from-orange-500/20 to-amber-500/20',
  'pdf-tools': 'from-purple-500/20 to-pink-500/20',
  'social-media': 'from-pink-500/20 to-rose-500/20',
  'tutorials': 'from-green-500/20 to-emerald-500/20',
  'technology': 'from-amber-500/20 to-yellow-500/20',
};

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════════ */

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}</span>;
}

/* ═══════════════════════════════════════════════════════════════════
   ARTICLE CARD
   ═══════════════════════════════════════════════════════════════════ */

function ArticleCard({ post, index, featured = false }: { post: BlogPost; index: number; featured?: boolean }) {
  const cat = BLOG_CATEGORIES.find(c => c.id === post.category);
  const CatIcon = CATEGORY_ICONS[post.category] || FileText;

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link
          to={`/blog/${post.slug}`}
          className="group block relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/5 to-slate-900 border border-white/[0.06] hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
        >
          {/* Cover gradient */}
          <div className={cn("h-48 sm:h-64 bg-gradient-to-br relative", CATEGORY_COLORS[post.category] || 'from-primary/15 to-purple-500/10')}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/20 backdrop-blur-sm text-primary text-[10px] font-bold uppercase rounded-full border border-primary/20">
                Featured
              </span>
              {cat && (
                <span className="px-3 py-1 bg-black/40 backdrop-blur-sm text-white/80 text-[10px] font-bold uppercase rounded-full">
                  {cat.icon} {cat.name}
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl sm:text-2xl font-display font-black text-white leading-tight mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-sm text-white/50 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-white/30">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.publishDate}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
              </div>
              <span className="text-xs font-bold text-primary/60 group-hover:text-primary transition-colors flex items-center gap-1">
                Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        to={`/blog/${post.slug}`}
        className="group block rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
      >
        {/* Card cover */}
        <div className={cn("h-36 bg-gradient-to-br relative", CATEGORY_COLORS[post.category] || 'from-primary/15 via-purple-500/10 to-cyan-500/10')}>
          <div className="absolute inset-0 flex items-center justify-center">
            <CatIcon className="w-10 h-10 text-white/10 group-hover:text-white/20 transition-colors" />
          </div>
          {cat && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-lg">
                {cat.icon} {cat.name}
              </span>
            </div>
          )}
          {post.featured && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 bg-primary/80 text-black text-[10px] font-bold rounded-lg">Featured</span>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3 text-[10px] text-white/30 mb-2.5">
            <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {post.publishDate}</span>
            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {post.readTime}</span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors mb-2 line-clamp-2 leading-snug">
            {post.title}
          </h3>
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-primary/50 group-hover:text-primary transition-colors">
            Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN BLOG HOMEPAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const featuredPosts = useMemo(() => getFeaturedPosts(), []);
  const latestPosts = useMemo(() => getLatestPosts(6), []);
  const popularPosts = useMemo(() => getPopularPosts(), []);
  const allPosts = useMemo(() => getLatestPosts(50), []);

  /* ── Filtered posts ── */
  const filteredPosts = useMemo(() => {
    let posts = selectedCategory ? getPostsByCategory(selectedCategory) : BLOG_POSTS;
    if (searchQuery) posts = searchPosts(searchQuery).filter(p => !selectedCategory || p.category === selectedCategory);
    return posts;
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  /* ── Featured carousel ── */
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const currentFeatured = featuredPosts[featuredIdx] || latestPosts[0];

  /* ── Trending tags ── */
  const trendingTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    BLOG_POSTS.forEach(p => p.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
    return Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, []);

  /* ── Category counts ── */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    BLOG_POSTS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, []);

  /* ── Trending this week (simulated) ── */
  const trendingThisWeek = useMemo(() => {
    return [...BLOG_POSTS].sort(() => Math.random() - 0.5).slice(0, 5);
  }, []);

  /* ── Search handling ── */
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
    if (q) setSearchParams({ q });
    else setSearchParams({});
  }, [setSearchParams]);

  const handleCategoryClick = useCallback((catId: string | null) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    if (catId) setSearchParams({ category: catId });
    else setSearchParams({});
  }, [setSearchParams]);

  /* ── Subscribe ── */
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  /* ── Focus search on Cmd+K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <SEOHead
        title="CreatorBoost AI Blog | AI Tools, Tutorials & Creator Growth Guides"
        description="Read the latest articles, tutorials, and guides about AI tools, content creation, YouTube growth, and productivity tips from CreatorBoost AI."
        keywords="AI tools blog, content creation tips, YouTube growth, productivity guides, creator tools"
        canonicalUrl={`${SITE_URL}/blog`}
        structuredData={[
          blogListingSchema(
            BLOG_POSTS.map(p => ({
              title: p.title,
              url: `/blog/${p.slug}`,
              datePublished: p.publishDate,
              excerpt: p.excerpt,
            }))
          ),
          breadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Blog', url: `${SITE_URL}/blog` },
          ]),
        ]}
      />

      <div className="space-y-8 sm:space-y-12">

        {/* ═══════ SECTION 1: HERO ═══════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/[0.06] p-6 sm:p-8 md:p-12"
        >
          {/* Aurora background */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/15 rounded-full blur-[120px]" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/15 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary mb-6"
            >
              <Sparkles className="w-3 h-3" />
              Insights, AI Tools & Creator Growth
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-4 leading-tight"
            >
              Insights, AI Tools &{' '}
              <span className="bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Creator Growth
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base text-white/50 max-w-xl mx-auto mb-8 leading-relaxed"
            >
              Tutorials, guides, and strategies to help you create better content, grow your audience, and leverage AI tools.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative max-w-lg mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search articles, tutorials, guides..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.08] rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] text-sm transition-all"
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white/[0.06] text-[10px] text-white/30 rounded-lg font-mono border border-white/[0.08] hidden sm:block">⌘K</kbd>
            </motion.div>

            {/* Trending Searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-2 mt-4"
            >
              <span className="text-[10px] text-white/30 uppercase tracking-wider">Trending:</span>
              {['AI Tools', 'YouTube Growth', 'Image Editing', 'SEO Tips'].map(tag => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-3 py-1 bg-white/[0.04] hover:bg-primary/10 border border-white/[0.06] hover:border-primary/30 rounded-full text-[10px] text-white/40 hover:text-primary transition-all"
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════ SECTION 2: FEATURED ARTICLE ═══════ */}
        {currentFeatured && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-display font-black tracking-tight text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Featured Article
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFeaturedIdx((featuredIdx - 1 + featuredPosts.length) % featuredPosts.length)}
                  className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white/60" />
                </button>
                <button
                  onClick={() => setFeaturedIdx((featuredIdx + 1) % featuredPosts.length)}
                  className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>
            <ArticleCard post={currentFeatured} index={0} featured />
          </section>
        )}

        {/* ═══════ SECTION 3: CATEGORIES ═══════ */}
        <section>
          <h2 className="text-lg sm:text-xl font-display font-black tracking-tight text-white mb-5">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BLOG_CATEGORIES.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat.id] || FileText;
              const count = categoryCounts[cat.id] || 0;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleCategoryClick(selectedCategory === cat.id ? null : cat.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/5'
                      : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-primary' : 'text-white/40'}`} />
                    <span className="text-xs font-bold text-white">{cat.name}</span>
                  </div>
                  <p className="text-[10px] text-white/30 line-clamp-2 mb-2">{cat.description}</p>
                  <span className="text-[10px] font-bold text-white/20">{count} articles</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ═══════ MAIN CONTENT + SIDEBAR ═══════ */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-black tracking-tight text-white">
                {selectedCategory
                  ? BLOG_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Articles'
                  : searchQuery
                    ? `Results for "${searchQuery}"`
                    : 'Latest Articles'
                }
                <span className="text-sm font-normal text-white/30 ml-2">({filteredPosts.length})</span>
              </h2>
            </div>

            {paginatedPosts.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-10 h-10 text-white/15 mx-auto mb-3" />
                <p className="text-sm text-white/40 mb-2">No articles found</p>
                <p className="text-xs text-white/20">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {paginatedPosts.map((post, i) => (
                  <ArticleCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white/60" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-black shadow-lg shadow-primary/20'
                        : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white/60" />
                </button>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">

            {/* Popular Posts */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Most Popular
              </h3>
              <div className="space-y-3">
                {popularPosts.map((post, i) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-3 group">
                    <span className="text-lg font-black text-white/10 w-6 flex-shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white/70 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                      <span className="text-[10px] text-white/30 flex items-center gap-1 mt-1">
                        <Clock className="w-2.5 h-2.5" /> {post.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending This Week */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-red-400" /> Trending This Week
              </h3>
              <div className="space-y-3">
                {trendingThisWeek.map((post, i) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-3 group">
                    <span className="text-[10px] font-bold text-red-400/60 w-5 flex-shrink-0 mt-0.5">#{i + 1}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white/70 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                      <span className="text-[10px] text-white/30 flex items-center gap-1 mt-1">
                        <Eye className="w-2.5 h-2.5" /> {post.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Categories
              </h3>
              <div className="space-y-2">
                {BLOG_CATEGORIES.map(cat => {
                  const count = categoryCounts[cat.id] || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(selectedCategory === cat.id ? null : cat.id)}
                      className={`w-full flex items-center justify-between text-xs transition-colors py-1.5 px-2 rounded-lg ${
                        selectedCategory === cat.id ? 'text-primary bg-primary/5' : 'text-white/50 hover:text-primary hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="flex items-center gap-2">{cat.icon} {cat.name}</span>
                      <span className="text-[10px] bg-white/[0.04] px-2 py-0.5 rounded">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-amber-400" /> Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(([tag]) => (
                  <button
                    key={tag}
                    onClick={() => handleSearch(tag)}
                    className="px-3 py-1.5 bg-white/[0.04] hover:bg-primary/10 border border-white/[0.06] hover:border-primary/30 rounded-lg text-[11px] text-white/50 hover:text-primary transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5">
              <Mail className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">Subscribe to Newsletter</h3>
              <p className="text-xs text-white/40 mb-4">Get the latest articles and AI tool tips delivered weekly.</p>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-primary text-xs font-bold"
                >
                  <BookOpen className="w-4 h-4" /> Thanks for subscribing!
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-white text-xs focus:outline-none focus:border-primary/50 placeholder:text-white/20"
                  />
                  <button type="submit" className="w-full py-2.5 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
              <Zap className="w-7 h-7 text-primary mx-auto mb-2" />
              <h3 className="text-xs font-bold text-white mb-1">Try Our AI Tools</h3>
              <p className="text-[10px] text-white/40 mb-3">80+ free tools for content creators.</p>
              <Link to="/" className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">
                Browse Tools <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
