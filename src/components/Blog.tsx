import { useState, useMemo } from 'react';
import { Calendar, ArrowRight, Search, ChevronLeft, ChevronRight, Clock, TrendingUp, Mail, Tag, BookOpen, Star, Flame } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
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

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const featuredPosts = useMemo(() => getFeaturedPosts(), []);
  const latestPosts = useMemo(() => getLatestPosts(6), []);
  const popularPosts = useMemo(() => getPopularPosts(), []);

  const filteredPosts = useMemo(() => {
    let posts = selectedCategory ? getPostsByCategory(selectedCategory) : BLOG_POSTS;
    if (searchQuery) posts = searchPosts(searchQuery).filter(p => !selectedCategory || p.category === selectedCategory);
    return posts;
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const [featuredIdx, setFeaturedIdx] = useState(0);
  const currentFeatured = featuredPosts[featuredIdx] || latestPosts[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  const trendingTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    BLOG_POSTS.forEach(p => p.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
    return Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, []);

  return (
    <>
      <SEOHead
        title="CreatorBoost AI Blog | AI Tools, Tutorials & Content Creation Guides"
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
      {/* Featured Article */}
      {currentFeatured && (
        <section className="mb-12">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-slate-900 border border-white/[0.06] p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_50%)]" />
            <div className="relative flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase rounded-lg tracking-wider">Featured</span>
                  <span className="text-white/40 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {currentFeatured.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight text-white leading-tight">
                  {currentFeatured.title}
                </h2>
                <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-xl">{currentFeatured.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link to={`/blog/${currentFeatured.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-white/30 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> {currentFeatured.publishDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setFeaturedIdx((featuredIdx - 1 + featuredPosts.length) % featuredPosts.length)} className="p-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-full transition-colors"><ChevronLeft className="w-4 h-4 text-white/60" /></button>
                <button onClick={() => setFeaturedIdx((featuredIdx + 1) % featuredPosts.length)} className="p-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-full transition-colors"><ChevronRight className="w-4 h-4 text-white/60" /></button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search + Categories */}
      <section className="mb-10">
        <div className="relative max-w-lg mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search articles..." className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setSelectedCategory(null); setCurrentPage(1); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${!selectedCategory ? 'bg-primary text-black' : 'bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'} `}>All</button>
          {BLOG_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${selectedCategory === cat.id ? 'bg-primary text-black' : 'bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'}`}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-6">
            {selectedCategory ? BLOG_CATEGORIES.find(c => c.id === selectedCategory)?.name : 'Latest Articles'} ({filteredPosts.length})
          </h3>

          {paginatedPosts.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No articles found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paginatedPosts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group block rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="h-36 bg-gradient-to-br from-primary/15 via-purple-500/10 to-cyan-500/10 flex items-center justify-center relative">
                    <span className="text-3xl opacity-30">
                      {BLOG_CATEGORIES.find(c => c.id === post.category)?.icon || '📝'}
                    </span>
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-lg">
                        {BLOG_CATEGORIES.find(c => c.id === post.category)?.name || post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-white/30 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.publishDate}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">{post.title}</h4>
                    <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary/60 group-hover:text-primary transition-colors">
                      Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4 text-white/60" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg text-xs font-bold transition-colors ${currentPage === page ? 'bg-primary text-black' : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] border border-white/[0.06]'}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4 text-white/60" /></button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          {/* Popular Posts */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-primary" /> Popular Articles</h3>
            <div className="space-y-3">
              {popularPosts.map((post, i) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-3 group">
                  <span className="text-lg font-black text-white/15 w-6 flex-shrink-0">{i + 1}</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white/70 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                    <span className="text-[10px] text-white/30 flex items-center gap-1 mt-1"><Clock className="w-2.5 h-2.5" /> {post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-purple-400" /> Categories</h3>
            <div className="space-y-2">
              {BLOG_CATEGORIES.map(cat => {
                const count = BLOG_POSTS.filter(p => p.category === cat.id).length;
                return (
                  <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }} className="w-full flex items-center justify-between text-xs text-white/50 hover:text-primary transition-colors py-1">
                    <span className="flex items-center gap-2">{cat.icon} {cat.name}</span>
                    <span className="text-[10px] bg-white/[0.04] px-2 py-0.5 rounded">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trending Tags */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2"><Flame className="w-3.5 h-3.5 text-red-400" /> Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map(([tag, count]) => (
                <button key={tag} onClick={() => { setSearchQuery(tag); setCurrentPage(1); }} className="px-3 py-1.5 bg-white/[0.04] hover:bg-primary/10 border border-white/[0.06] hover:border-primary/30 rounded-lg text-[11px] text-white/50 hover:text-primary transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5">
            <Mail className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-sm font-bold text-white mb-2">Subscribe to Newsletter</h3>
            <p className="text-xs text-white/40 mb-4">Get the latest articles and tips delivered to your inbox.</p>
            {subscribed ? (
              <p className="text-primary text-xs font-bold">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-white text-xs focus:outline-none focus:border-primary/50 placeholder:text-white/20" />
                <button type="submit" className="w-full py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">Subscribe</button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
