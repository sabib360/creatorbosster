import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Calendar, User, Share2, Clock, ChevronUp, ChevronRight, Home, Twitter, Facebook, Link2, Copy, Check, BookOpen, TrendingUp, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, BLOG_CATEGORIES, getPopularPosts, getLatestPosts, type BlogPost } from '../config/blog-data';
import { InlineNewsletter } from './Newsletter';
import SEOHead from './SEOHead';
import Breadcrumb from './Breadcrumb';
import AuthorProfile from './AuthorProfile';
import { articleSchema, toolFAQSchema } from '../lib/schema';
import { SEO_CONFIG } from '../config/seo-config';

const SITE_URL = 'https://creatorboostai.xyz';

interface BlogPostViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  onBack: () => void;
}

export default function BlogPostView({ post, relatedPosts, onBack }: BlogPostViewProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const { id, title, excerpt, author, publishDate, readTime, content, faqItems, category, tags, updatedDate } = post;

  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const current = -rect.top;
      setReadingProgress(Math.min(Math.max(current / total * 100, 0), 100));
      setShowBackToTop(current > 500);

      // Track active heading
      const headings = el.querySelectorAll('h2, h3');
      let currentId = '';
      headings.forEach((h) => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 120) currentId = h.id || '';
      });
      setActiveHeading(currentId);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headings = useMemo(() => {
    const matches = content.match(/<h[23][^>]*>(.*?)<\/h[23]>/gi) || [];
    return matches.map((m, i) => {
      const text = m.replace(/<[^>]+>/g, '');
      const level = m.startsWith('<h2') ? 2 : 3;
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return { text, level, slug, id: `heading-${i}` };
    });
  }, [content]);

  const postUrl = `${SITE_URL}/blog/${id}`;
  const isoDate = new Date(publishDate).toISOString();
  const cat = BLOG_CATEGORIES.find(c => c.id === category);

  const popularPosts = useMemo(() => getPopularPosts().slice(0, 5), []);
  const recentPosts = useMemo(() => getLatestPosts(5), []);

  const articleSchemaData = articleSchema({
    title,
    description: excerpt,
    url: postUrl,
    datePublished: isoDate,
    dateModified: updatedDate ? new Date(updatedDate).toISOString() : isoDate,
    author: author,
    image: post.featuredImage || undefined,
  });

  const faqSchemaData = faqItems && faqItems.length > 0 ? toolFAQSchema(faqItems) : null;

  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]+>/g, ' ');
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }, [content]);

  const readMin = Math.max(1, Math.ceil(wordCount / 200));

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(postUrl);
    const text = encodeURIComponent(title);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inject heading IDs into content
  const processedContent = useMemo(() => {
    let html = content;
    let i = 0;
    html = html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, text) => {
      const slug = text.replace(/<[^>]+>/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h${level}${attrs} id="${slug}">${text}</h${level}>`;
    });
    return html;
  }, [content]);

  return (
    <div className="min-h-screen">
      {/* Reading Progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div className="h-full bg-primary transition-all duration-150" style={{ width: `${readingProgress}%` }} />
      </div>

      <SEOHead
        title={post.metaTitle || `${title} | CreatorBoost AI Blog`}
        description={post.metaDescription || excerpt}
        canonicalUrl={postUrl}
        type="article"
        structuredData={[articleSchemaData, ...(faqSchemaData ? [faqSchemaData] : [])]}
        article={{
          publishedTime: isoDate,
          modifiedTime: updatedDate ? new Date(updatedDate).toISOString() : isoDate,
          author: author,
          section: cat?.name || category,
          tags: tags,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { name: 'Blog', path: '/blog' },
            { name: title, path: postUrl },
          ]}
          className="mb-8"
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Article */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {cat && (
                  <Link to={`/blog?category=${cat.id}`} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-lg tracking-wider border border-primary/20">
                    {cat.icon} {cat.name}
                  </Link>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white mb-4 leading-tight">{title}</h1>
              <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6">{excerpt}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 pb-6 border-b border-white/[0.06]">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Published: {publishDate}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readMin} min read · {wordCount.toLocaleString()} words</span>
                {updatedDate && updatedDate !== publishDate && (
                  <span className="flex items-center gap-1.5 text-white/30">
                    <Clock className="w-3 h-3" /> Last reviewed: {updatedDate}
                  </span>
                )}
              </div>
            </div>

            {/* Content + TOC */}
            <div className="flex gap-8">
              {/* Table of Contents */}
              {headings.length > 2 && (
                <aside className="hidden xl:block w-56 flex-shrink-0">
                  <div className="sticky top-20 space-y-1">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Table of Contents</h4>
                    {headings.map((h) => (
                      <a key={h.id} href={`#${h.slug}`} className={`block text-xs transition-colors hover:text-primary py-0.5 ${h.level === 3 ? 'pl-3 text-white/35' : 'text-white/55 font-bold'} ${activeHeading === h.slug ? 'text-primary' : ''}`}>
                        {h.text}
                      </a>
                    ))}
                  </div>
                </aside>
              )}

              {/* Article Content */}
              <div ref={contentRef} className="flex-1 min-w-0">
                <div className="prose prose-invert max-w-none text-white/65 leading-relaxed space-y-5 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:space-y-2 [&_ol]:space-y-2 [&_li]:text-white/60 [&_li]:ml-4 [&_strong]:text-white [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_p]:text-sm" dangerouslySetInnerHTML={{ __html: processedContent }} />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-white/[0.06]">
                  <Tag className="w-3.5 h-3.5 text-white/30" />
                  {tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[11px] text-white/40">{tag}</span>
                  ))}
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-2 mt-6">
                  <span className="text-xs text-white/30 mr-1">Share:</span>
                  <button onClick={() => handleShare('twitter')} className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-white/40 hover:text-white transition-colors" aria-label="Share on Twitter"><Twitter className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleShare('facebook')} className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-white/40 hover:text-white transition-colors" aria-label="Share on Facebook"><Facebook className="w-3.5 h-3.5" /></button>
                  <button onClick={handleCopyLink} className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-white/40 hover:text-white transition-colors" aria-label="Copy link">
                    {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Link2 className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>

                {/* FAQ */}
                {faqItems && faqItems.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-white/[0.06]">
                    <h2 className="text-xl font-bold text-white mb-5">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                      {faqItems.map((item, i) => (
                        <details key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden group">
                          <summary className="p-4 cursor-pointer font-bold text-white text-sm hover:text-primary transition-colors list-none flex justify-between items-center">
                            {item.q}
                            <ChevronRight className="w-4 h-4 text-white/30 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                          </summary>
                          <div className="px-4 pb-4 text-xs text-white/50 leading-relaxed">{item.a}</div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newsletter */}
                <div className="mt-10"><InlineNewsletter /></div>

                {/* Author Profile */}
                <div className="mt-8">
                  <AuthorProfile variant="compact" />
                </div>

                {/* About Box with Internal Links */}
                <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
                  <h4 className="font-bold text-white mb-2 text-sm">About CreatorBoost AI</h4>
                  <p className="text-white/40 text-xs leading-relaxed">Free tools for content creators, bloggers, and digital marketers. 80+ AI-powered tools for image processing, PDF editing, content creation, and more. All tools are free and run in your browser.</p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/10">
                    <Link to="/tools/image-compressor" className="text-xs text-primary/70 hover:text-primary transition-colors">Image Compressor</Link>
                    <span className="text-white/10">·</span>
                    <Link to="/tools/pdf-merger" className="text-xs text-primary/70 hover:text-primary transition-colors">PDF Merger</Link>
                    <span className="text-white/10">·</span>
                    <Link to="/tools/hashtag-generator" className="text-xs text-primary/70 hover:text-primary transition-colors">Hashtag Generator</Link>
                    <span className="text-white/10">·</span>
                    <Link to="/tools/youtube-title-generator" className="text-xs text-primary/70 hover:text-primary transition-colors">YouTube Title Generator</Link>
                    <span className="text-white/10">·</span>
                    <Link to="/" className="text-xs text-primary/70 hover:text-primary transition-colors">Browse All Tools →</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/[0.06]">
                <h2 className="text-lg font-bold text-white mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map(rp => (
                    <Link key={rp.id} to={`/blog/${rp.slug}`} className="group p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{BLOG_CATEGORIES.find(c => c.id === rp.category)?.icon || '📝'}</span>
                        <span className="text-[10px] text-white/30">{rp.readTime}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{rp.title}</h4>
                      <p className="text-xs text-white/40 line-clamp-2">{rp.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            {/* Popular Posts */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-primary" /> Popular</h3>
              <div className="space-y-3">
                {popularPosts.map((p, i) => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="flex gap-3 group">
                    <span className="text-sm font-black text-white/10 w-5 flex-shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-white/60 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h4>
                      <span className="text-[10px] text-white/25 flex items-center gap-1 mt-0.5"><Clock className="w-2.5 h-2.5" /> {p.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-cyan-400" /> Recent</h3>
              <div className="space-y-3">
                {recentPosts.filter(p => p.id !== id).slice(0, 4).map(p => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="block group">
                    <h4 className="text-[11px] font-bold text-white/60 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h4>
                    <span className="text-[10px] text-white/25">{p.publishDate}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-purple-400" /> Categories</h3>
              <div className="space-y-1.5">
                {BLOG_CATEGORIES.map(cat => {
                  const count = BLOG_POSTS.filter(p => p.category === cat.id).length;
                  if (count === 0) return null;
                  return (
                    <Link key={cat.id} to={`/blog?category=${cat.id}`} className="flex items-center justify-between text-[11px] text-white/45 hover:text-primary transition-colors py-1">
                      <span>{cat.icon} {cat.name}</span>
                      <span className="text-[10px] bg-white/[0.04] px-1.5 py-0.5 rounded">{count}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-amber-400" /> Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/[0.04] border border-white/[0.06] rounded text-[10px] text-white/40">{tag}</span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
              <BookOpen className="w-7 h-7 text-primary mx-auto mb-2" />
              <h3 className="text-xs font-bold text-white mb-1">Read More Articles</h3>
              <p className="text-[10px] text-white/40 mb-3">Explore 80+ free tools for creators.</p>
              <Link to="/" className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">
                Browse Tools <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 p-3 bg-primary text-black rounded-full shadow-lg hover:bg-primary/90 transition-colors z-40">
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
