import { Link } from 'react-router-dom';
import { Home, Search, FileText, Shield, Mail, BookOpen, Globe, ArrowRight, ChevronRight } from 'lucide-react';
import SEOHead from './SEOHead';
import { CATEGORIES } from '../config/tools-database';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../config/blog-data';

const SITE_URL = 'https://creatorboostai.xyz';

export default function SitemapPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Sitemap - CreatorBoost AI',
    description: 'Complete sitemap of CreatorBoost AI. Find all tools, blog posts, categories, and important pages.',
    url: `${SITE_URL}/sitemap`,
    publisher: { '@type': 'Organization', name: 'CreatorBoost AI', url: SITE_URL },
  };

  const legalPages = [
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact-us' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
    { label: 'Disclaimer', path: '/disclaimer' },
    { label: 'Cookie Policy', path: '/cookie-policy' },
    { label: 'DMCA Policy', path: '/dmca' },
    { label: 'Editorial Policy', path: '/editorial-policy' },
    { label: 'Sitemap', path: '/sitemap' },
  ];

  return (
    <>
      <SEOHead
        title="Sitemap - CreatorBoost AI | Complete Site Directory"
        description="Complete sitemap of CreatorBoost AI. Browse all tools, blog posts, categories, and important pages."
        keywords="sitemap, site directory, creatorboost AI pages, all tools, all pages"
        canonicalUrl={`${SITE_URL}/sitemap`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <Globe className="w-4 h-4" /> Sitemap
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
            Sitemap
          </h1>
          <p className="text-ink/60 text-lg">Find everything on CreatorBoost AI — tools, articles, and resources.</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Home', path: '/', icon: Home },
            { label: 'Blog', path: '/blog', icon: BookOpen },
            { label: 'Contact', path: '/contact-us', icon: Mail },
            { label: 'About', path: '/about', icon: Globe },
          ].map((link) => (
            <Link key={link.path} to={link.path} className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-primary/30 transition-colors group">
              <link.icon className="w-5 h-5 text-primary" />
              <span className="font-bold text-ink text-sm group-hover:text-primary transition-colors">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Tool Categories */}
        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink mb-6">Tool Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-primary/30 transition-colors group"
              >
                <div>
                  <h3 className="font-bold text-ink text-sm group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-ink/50 text-xs mt-1">{cat.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Blog Categories */}
        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink mb-6">Blog Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BLOG_CATEGORIES.map((cat) => {
              const count = BLOG_POSTS.filter(p => p.category === cat.id).length;
              return (
                <Link
                  key={cat.id}
                  to={`/blog?category=${cat.id}`}
                  className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-primary/30 transition-colors text-center group"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <h3 className="font-bold text-ink text-xs mt-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-ink/40 text-[10px] mt-1">{count} articles</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">Latest Articles</h2>
            <Link to="/blog" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-2">
            {BLOG_POSTS.slice(0, 10).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-primary/30 transition-colors group"
              >
                <span className="text-lg">{BLOG_CATEGORIES.find(c => c.id === post.category)?.icon || '📝'}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-ink group-hover:text-primary transition-colors truncate">{post.title}</h3>
                  <p className="text-xs text-ink/40">{post.publishDate} · {post.readTime}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-ink/20 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Legal Pages */}
        <section>
          <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink mb-6">Legal & Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {legalPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-primary/30 transition-colors group"
              >
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-bold text-ink group-hover:text-primary transition-colors">{page.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
