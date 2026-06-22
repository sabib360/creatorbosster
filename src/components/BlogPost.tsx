/**
 * Premium Blog Post Reading Experience
 * Inspired by Medium, Linear, Stripe Docs. Maximum readability.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft, Calendar, User, Share2, Clock, ChevronUp, ChevronRight,
  Home, Twitter, Facebook, Link2, Copy, Check, BookOpen, TrendingUp,
  Tag, ArrowRight, Bookmark, Heart, MessageSquare, Linkedin, Send,
  ChevronDown, ExternalLink, Sparkles, Zap, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOG_POSTS, BLOG_CATEGORIES, getPopularPosts, getLatestPosts, type BlogPost } from '../config/blog-data';
import { InlineNewsletter } from './Newsletter';
import SEOHead from './SEOHead';
import Breadcrumb from './Breadcrumb';
import AuthorProfile from './AuthorProfile';
import { articleSchema, toolFAQSchema } from '../lib/schema';

const SITE_URL = 'https://creatorboostai.xyz';

interface BlogPostViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  onBack: () => void;
}

/* ═══════════════════════════════════════════════════════════════════
   READING PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════ */

function ReadingProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/50 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-purple-400 to-cyan-400"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TABLE OF CONTENTS
   ═══════════════════════════════════════════════════════════════════ */

function TableOfContents({ headings, activeHeading }: { headings: Array<{ text: string; level: number; slug: string }>; activeHeading: string }) {
  const [expanded, setExpanded] = useState(true);

  if (headings.length < 3) return null;

  return (
    <div className="sticky top-20">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Table of Contents</h4>
        <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-0.5"
          >
            {headings.map((h) => (
              <a
                key={h.slug}
                href={`#${h.slug}`}
                className={`block text-xs transition-all duration-200 py-1 border-l-2 ${
                  h.level === 3 ? 'pl-6 text-white/30' : 'pl-3 text-white/50 font-bold'
                } ${
                  activeHeading === h.slug
                    ? 'text-primary border-primary bg-primary/5'
                    : 'border-transparent hover:text-primary hover:border-white/10'
                }`}
              >
                {h.text}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHARE PANEL
   ═══════════════════════════════════════════════════════════════════ */

function SharePanel({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/30 mr-1 hidden sm:inline">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-white/40 hover:text-white transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-3.5 h-3.5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-white/40 hover:text-white transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-3.5 h-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-white/[0.04] hover:bg-[#0077B5]/20 border border-white/[0.06] hover:border-[#0077B5]/30 rounded-xl text-white/40 hover:text-[#0077B5] transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-white/[0.04] hover:bg-[#25D366]/20 border border-white/[0.06] hover:border-[#25D366]/30 rounded-xl text-white/40 hover:text-[#25D366] transition-colors"
        aria-label="Share on WhatsApp"
      >
        <Send className="w-3.5 h-3.5" />
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs text-white/40 hover:text-white transition-colors"
        aria-label="Copy link"
      >
        {copied ? (
          <><Check className="w-3.5 h-3.5 text-green-400" /> <span className="text-green-400">Copied!</span></>
        ) : (
          <><Link2 className="w-3.5 h-3.5" /> Copy</>
        )}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════════════════════════ */

function FAQSection({ items }: { items: Array<{ q: string; a: string }> }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-white/[0.06]">
      <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" /> Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-sm font-bold text-white pr-4">{item.q}</span>
              <motion.div
                animate={{ rotate: openIdx === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4 text-xs text-white/50 leading-relaxed border-t border-white/[0.04] pt-3">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RELATED TOOLS SECTION
   ═══════════════════════════════════════════════════════════════════ */

function RelatedTools({ tags }: { tags: string[] }) {
  const toolLinks = useMemo(() => {
    const links: Array<{ name: string; path: string; description: string }> = [];
    const tagStr = tags.join(' ').toLowerCase();

    if (tagStr.includes('image') || tagStr.includes('photo') || tagStr.includes('compress')) {
      links.push({ name: 'Image Compressor', path: '/tools/image-compressor', description: 'Reduce image file size while maintaining quality' });
      links.push({ name: 'Background Remover', path: '/tools/background-remover', description: 'Remove backgrounds from images with AI' });
    }
    if (tagStr.includes('youtube') || tagStr.includes('video') || tagStr.includes('thumbnail')) {
      links.push({ name: 'YouTube Title Generator', path: '/tools/youtube-title-generator', description: 'Generate SEO-optimized YouTube titles' });
      links.push({ name: 'YouTube Script Writer', path: '/tools/youtube-script-writer', description: 'Create engaging video scripts' });
    }
    if (tagStr.includes('caption') || tagStr.includes('social') || tagStr.includes('instagram')) {
      links.push({ name: 'AI Caption Generator', path: '/tools/ai-caption-generator', description: 'Generate platform-specific captions' });
      links.push({ name: 'Hashtag Generator', path: '/tools/hashtag-generator', description: 'Find trending hashtags for your posts' });
    }
    if (tagStr.includes('pdf') || tagStr.includes('document')) {
      links.push({ name: 'PDF Compressor', path: '/tools/pdf-compressor', description: 'Reduce PDF file size without losing quality' });
      links.push({ name: 'PDF Merger', path: '/tools/pdf-merger', description: 'Combine multiple PDF files into one' });
    }
    if (tagStr.includes('seo') || tagStr.includes('meta') || tagStr.includes('keyword')) {
      links.push({ name: 'Meta Tag Generator', path: '/tools/meta-tag-generator', description: 'Generate SEO meta tags for any page' });
      links.push({ name: 'QR Code Generator', path: '/tools/qr-code-generator', description: 'Create QR codes for links and text' });
    }

    // Always include general tools
    if (links.length < 4) {
      links.push({ name: 'AI Image Generator', path: '/tools/ai-image-generator', description: 'Generate stunning AI images from text' });
      links.push({ name: 'Content Idea Generator', path: '/tools/content-idea-generator', description: 'Get unlimited content ideas' });
    }

    return links.slice(0, 4);
  }, [tags]);

  if (toolLinks.length === 0) return null;

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 rounded-2xl">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" /> Related Tools
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {toolLinks.map(tool => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-primary/30 hover:bg-white/[0.06] transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">{tool.name}</p>
              <p className="text-[10px] text-white/30 truncate">{tool.description}</p>
            </div>
            <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-primary flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN BLOG POST VIEW
   ═══════════════════════════════════════════════════════════════════ */

export default function BlogPostView({ post, relatedPosts, onBack }: BlogPostViewProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { id, title, excerpt, author, publishDate, readTime, content, faqItems, category, tags, updatedDate } = post;

  /* ── Reading progress & active heading tracking ── */
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

  /* ── Parse headings for TOC ── */
  const headings = useMemo(() => {
    const matches = content.match(/<h[23][^>]*>(.*?)<\/h[23]>/gi) || [];
    return matches.map((m, i) => {
      const text = m.replace(/<[^>]+>/g, '');
      const level = m.startsWith('<h2') ? 2 : 3;
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return { text, level, slug, id: `heading-${i}` };
    });
  }, [content]);

  /* ── Inject heading IDs ── */
  const processedContent = useMemo(() => {
    let html = content;
    html = html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, text) => {
      const slug = text.replace(/<[^>]+>/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<h${level}${attrs} id="${slug}">${text}</h${level}>`;
    });
    return html;
  }, [content]);

  /* ── Word count & read time ── */
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]+>/g, ' ');
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }, [content]);

  const readMin = Math.max(1, Math.ceil(wordCount / 200));

  /* ── Schema data ── */
  const postUrl = `${SITE_URL}/blog/${id}`;
  const isoDate = new Date(publishDate).toISOString();
  const cat = BLOG_CATEGORIES.find(c => c.id === category);

  const articleSchemaData = articleSchema({
    title,
    description: excerpt,
    url: postUrl,
    datePublished: isoDate,
    dateModified: updatedDate ? new Date(updatedDate).toISOString() : isoDate,
    author,
    image: post.featuredImage || undefined,
  });

  const faqSchemaData = faqItems && faqItems.length > 0 ? toolFAQSchema(faqItems) : null;

  /* ── Related data ── */
  const popularPosts = useMemo(() => getPopularPosts().slice(0, 5), []);
  const recentPosts = useMemo(() => getLatestPosts(5), []);

  /* ── Bookmark toggle ── */
  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    // In a real app, save to localStorage or user profile
  };

  return (
    <div className="min-h-screen">
      {/* Reading Progress */}
      <ReadingProgressBar progress={readingProgress} />

      <SEOHead
        title={post.metaTitle || `${title} | CreatorBoost AI Blog`}
        description={post.metaDescription || excerpt}
        canonicalUrl={postUrl}
        type="article"
        structuredData={[articleSchemaData, ...(faqSchemaData ? [faqSchemaData] : [])]}
        article={{
          publishedTime: isoDate,
          modifiedTime: updatedDate ? new Date(updatedDate).toISOString() : isoDate,
          author,
          section: cat?.name || category,
          tags,
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
          {/* ═══════ MAIN ARTICLE ═══════ */}
          <article className="flex-1 min-w-0">
            {/* ── Article Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {cat && (
                  <Link
                    to={`/blog?category=${cat.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-lg tracking-wider border border-primary/20 hover:bg-primary/15 transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                )}
                {post.featured && (
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase rounded-lg border border-amber-500/20">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white mb-4 leading-tight">
                {title}
              </h1>

              {/* Excerpt */}
              <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">{excerpt}</p>

              {/* Author & Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 pb-6 border-b border-white/[0.06]">
                <span className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-3 h-3 text-primary" />
                  </div>
                  {author}
                </span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {publishDate}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readMin} min read · {wordCount.toLocaleString()} words</span>
                {updatedDate && updatedDate !== publishDate && (
                  <span className="flex items-center gap-1.5 text-white/30">
                    <Clock className="w-3 h-3" /> Updated: {updatedDate}
                  </span>
                )}
                <button
                  onClick={toggleBookmark}
                  className={`ml-auto p-1.5 rounded-lg transition-colors ${
                    bookmarked ? 'text-amber-400 bg-amber-400/10' : 'text-white/30 hover:text-white/50 hover:bg-white/[0.04]'
                  }`}
                  aria-label="Bookmark this article"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
                </button>
              </div>
            </motion.div>

            {/* ── Content + TOC Layout ── */}
            <div className="flex gap-8">
              {/* Table of Contents (Desktop) */}
              {headings.length > 2 && (
                <aside className="hidden xl:block w-56 flex-shrink-0">
                  <TableOfContents headings={headings} activeHeading={activeHeading} />
                </aside>
              )}

              {/* ── Article Content ── */}
              <div ref={contentRef} className="flex-1 min-w-0">
                <div
                  className="prose prose-invert max-w-none text-white/65 leading-relaxed space-y-5
                    [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-20
                    [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-20
                    [&_ul]:space-y-2 [&_ol]:space-y-2 [&_li]:text-white/60 [&_li]:ml-4
                    [&_strong]:text-white [&_em]:text-white/70
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-primary/30 [&_a]:hover:decoration-primary
                    [&_p]:text-sm [&_p]:leading-relaxed
                    [&_blockquote]:border-l-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/50
                    [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
                    [&_pre]:bg-white/[0.04] [&_pre]:border [&_pre]:border-white/[0.06] [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto
                    [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
                    [&_th]:bg-white/[0.04] [&_th]:text-white [&_th]:font-bold [&_th]:p-3 [&_th]:text-left [&_th]:border [&_th]:border-white/[0.06]
                    [&_td]:p-3 [&_td]:border [&_td]:border-white/[0.06] [&_td]:text-white/60
                    [&_img]:rounded-xl [&_img]:border [&_img]:border-white/[0.06]"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* ── Tags ── */}
                <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-white/[0.06]">
                  <Tag className="w-3.5 h-3.5 text-white/30 mt-0.5" />
                  {tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/blog?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-white/[0.04] hover:bg-primary/10 border border-white/[0.06] hover:border-primary/30 rounded-lg text-[11px] text-white/40 hover:text-primary transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>

                {/* ── Share Panel ── */}
                <div className="flex items-center justify-between mt-6">
                  <SharePanel url={postUrl} title={title} />
                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                      bookmarked
                        ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/40 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400' : ''}`} />
                    {bookmarked ? 'Saved' : 'Save'}
                  </button>
                </div>

                {/* ── FAQ Section ── */}
                <FAQSection items={faqItems || []} />

                {/* ── Related Tools ── */}
                <RelatedTools tags={tags} />

                {/* ── Newsletter ── */}
                <div className="mt-10"><InlineNewsletter /></div>

                {/* ── Author Profile ── */}
                <div className="mt-8">
                  <AuthorProfile variant="compact" />
                </div>

                {/* ── About Box with Internal Links ── */}
                <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4">
                  <h4 className="font-bold text-white mb-2 text-sm">About CreatorBoost AI</h4>
                  <p className="text-white/40 text-xs leading-relaxed">Free tools for content creators, bloggers, and digital marketers. 80+ AI-powered tools for image processing, PDF editing, content creation, and more. All tools are free and run in your browser.</p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-primary/10">
                    <Link to="/tools/image-compressor" className="text-xs text-primary/70 hover:text-primary transition-colors">Image Compressor</Link>
                    <span className="text-white/10">·</span>
                    <Link to="/tools/background-remover" className="text-xs text-primary/70 hover:text-primary transition-colors">Background Remover</Link>
                    <span className="text-white/10">·</span>
                    <Link to="/tools/ai-caption-generator" className="text-xs text-primary/70 hover:text-primary transition-colors">Caption Generator</Link>
                    <span className="text-white/10">·</span>
                    <Link to="/tools/pdf-merger" className="text-xs text-primary/70 hover:text-primary transition-colors">PDF Merger</Link>
                    <span className="text-white/10">·</span>
                    <Link to="/" className="text-xs text-primary/70 hover:text-primary transition-colors font-bold">Browse All Tools →</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════ RELATED ARTICLES ═══════ */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/[0.06]">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedPosts.map(rp => (
                    <Link
                      key={rp.id}
                      to={`/blog/${rp.slug}`}
                      className="group p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{BLOG_CATEGORIES.find(c => c.id === rp.category)?.icon || '📝'}</span>
                        <span className="text-[10px] text-white/30">{rp.readTime}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{rp.title}</h4>
                      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{rp.excerpt}</p>
                      <div className="mt-3 text-[11px] font-bold text-primary/50 group-hover:text-primary transition-colors flex items-center gap-1">
                        Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ═══════ SIDEBAR ═══════ */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">

            {/* Share (sticky) */}
            <div className="lg:sticky lg:top-20">
              {/* Popular Posts */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-6">
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" /> Popular
                </h3>
                <div className="space-y-3">
                  {popularPosts.map((p, i) => (
                    <Link key={p.id} to={`/blog/${p.slug}`} className="flex gap-3 group">
                      <span className="text-sm font-black text-white/10 w-5 flex-shrink-0">{i + 1}</span>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-white/60 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h4>
                        <span className="text-[10px] text-white/25 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> {p.readTime}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-6">
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Recent
                </h3>
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
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-6">
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Categories
                </h3>
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
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-6">
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/blog?q=${encodeURIComponent(tag)}`}
                      className="px-2 py-1 bg-white/[0.04] hover:bg-primary/10 border border-white/[0.06] hover:border-primary/30 rounded text-[10px] text-white/40 hover:text-primary transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
                <Sparkles className="w-7 h-7 text-primary mx-auto mb-2" />
                <h3 className="text-xs font-bold text-white mb-1">Try Our AI Tools</h3>
                <p className="text-[10px] text-white/40 mb-3">80+ free tools for creators.</p>
                <Link to="/" className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">
                  Browse Tools <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 p-3 bg-primary text-black rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors z-40"
            aria-label="Back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
