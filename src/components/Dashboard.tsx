import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Search, ArrowRight, Sparkles, ChevronDown, ChevronUp, Clock,
  Zap, Shield, Smartphone, Brain, Globe, Star, TrendingUp,
  FileText, Youtube, SearchCode,
  CheckCircle2, Users, Flame, BookOpen, Hash,
  Image as ImageIcon2, QrCode, PenTool,
  ImagePlus, Minimize2, Type, Award, Cpu, Layout, Share2, Calendar,
  ArrowUpRight, Layers, Wand2, Palette, Eye, BarChart3,
  Heart, MessageCircle, Play, Sparkle, Rocket, Target, RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { BLOG_POSTS } from '../config/blog-data';
import { searchTools } from '../config/tools-database';
import SEOHead from './SEOHead';
import { organizationSchema, websiteSchema, homepageFAQSchema } from '../lib/schema';
import Testimonials from './Testimonials';

const SITE_URL = 'https://creatorboostai.xyz';

/* ═══════════ SHARED COMPONENTS ═══════════ */

function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("relative", className)}>
      {children}
    </section>
  );
}

function SectionBadge({ icon: Icon, text, color = 'text-brand-400' }: { icon: React.FC<{ className?: string }>; text: string; color?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[11px] font-bold uppercase tracking-widest mb-5", color)}>
      <Icon className="w-3 h-3" /> {text}
    </div>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white", className)}>
      {children}
    </h2>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

/* ═══════════ DATA ═══════════ */

const featuredTools = [
  { name: 'AI Image Generator', desc: 'Create stunning images from text prompts with AI. No design skills needed.', path: '/tools/ai-text-to-image', icon: ImageIcon2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', usage: '15.2K', tag: 'Most Popular' },
  { name: 'Background Remover', desc: 'Remove image backgrounds instantly with AI precision. 100% private.', path: '/tools/background-remover', icon: ImagePlus, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', usage: '12.4K', tag: 'AI Powered' },
  { name: 'AI Caption Generator', desc: 'Write perfect captions for any social media post in seconds.', path: '/tools/caption-writer', icon: PenTool, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', usage: '10.8K', tag: 'Trending' },
  { name: 'Bangla Caption Generator', desc: 'Create engaging Bangla captions for social media. Natural, cultural tone.', path: '/tools/bangla-caption-generator', icon: Type, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', usage: '8.1K', tag: '' },
  { name: 'QR Code Generator', desc: 'Create custom QR codes for links, WiFi, and contact info. Free forever.', path: '/tools/qr-code-generator', icon: QrCode, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', usage: '6.9K', tag: '' },
  { name: 'YouTube Script Generator', desc: 'Generate engaging video scripts with hooks, CTAs, and retention tips.', path: '/tools/youtube-script-writer', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', usage: '5.4K', tag: '' },
  { name: 'Stylish Name Generator', desc: 'Create unique stylish names with special characters for social profiles.', path: '/tools/stylish-name-generator', icon: Type, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', usage: '4.8K', tag: '' },
  { name: 'YouTube Thumbnail Downloader', desc: 'Download any YouTube video thumbnail in HD quality. Instant results.', path: '/tools/youtube-thumbnail-downloader', icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', usage: '9.8K', tag: '' },
];

const trendingTools = [
  { name: 'AI Image Generator', icon: ImageIcon2, usage: '15.2K', path: '/tools/ai-text-to-image' },
  { name: 'Caption Generator', icon: PenTool, usage: '10.8K', path: '/tools/caption-writer' },
  { name: 'QR Code', icon: QrCode, usage: '6.9K', path: '/tools/qr-code-generator' },
  { name: 'Background Remover', icon: ImagePlus, usage: '12.4K', path: '/tools/background-remover' },
  { name: 'YouTube Script', icon: FileText, usage: '5.4K', path: '/tools/youtube-script-writer' },
  { name: 'Hashtag Generator', icon: Hash, usage: '7.5K', path: '/tools/hashtag-generator' },
  { name: 'Image Compressor', icon: Minimize2, usage: '8.2K', path: '/tools/image-compressor' },
  { name: 'Thumbnail Downloader', icon: Youtube, usage: '9.8K', path: '/tools/youtube-thumbnail-downloader' },
  { name: 'Stylish Name', icon: Type, usage: '4.8K', path: '/tools/stylish-name-generator' },
  { name: 'AI Chatbot', icon: Brain, usage: '3.2K', path: '/tools/ai-chatbot' },
];

const categories = [
  { name: 'AI Tools', icon: Brain, color: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/20', text: 'text-cyan-400', path: '/ai-tools', count: 15, desc: 'Smart AI-powered tools' },
  { name: 'Image Tools', icon: ImageIcon2, color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-400', path: '/image-tools', count: 18, desc: 'Edit & enhance images' },
  { name: 'YouTube Tools', icon: Youtube, color: 'from-red-500/20 to-red-500/5', border: 'border-red-500/20', text: 'text-red-400', path: '/social-media-tools', count: 12, desc: 'Grow your channel' },
  { name: 'SEO Tools', icon: SearchCode, color: 'from-green-500/20 to-green-500/5', border: 'border-green-500/20', text: 'text-green-400', path: '/ai-tools', count: 10, desc: 'Optimize for search' },
  { name: 'Social Media', icon: Share2, color: 'from-pink-500/20 to-pink-500/5', border: 'border-pink-500/20', text: 'text-pink-400', path: '/social-media-tools', count: 14, desc: 'Social media tools' },
];

const whyFeatures = [
  { icon: Zap, title: 'Fast AI Processing', desc: 'Get results in seconds with optimized AI algorithms', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Shield, title: 'Free Forever Tools', desc: 'No hidden fees, no subscriptions. All tools free.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Smartphone, title: 'Mobile Friendly', desc: 'Works perfectly on all devices and screen sizes', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: Users, title: 'Creator Focused', desc: 'Built specifically for content creators and YouTubers', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: SearchCode, title: 'SEO Optimized', desc: 'Tools designed to improve your search rankings', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: RefreshCw, title: 'Constant Updates', desc: 'New features and tools added every month', color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

const stats = [
  { value: 1, suffix: 'M+', label: 'Images Generated', color: 'text-blue-400' },
  { value: 500, suffix: 'K+', label: 'Captions Created', color: 'text-purple-400' },
  { value: 250, suffix: 'K+', label: 'Scripts Generated', color: 'text-cyan-400' },
  { value: 100, suffix: 'K+', label: 'Creators Helped', color: 'text-amber-400' },
];

const faqData = [
  { q: 'Are all tools on CreatorBoost AI really free?', a: 'Yes, every tool is completely free to use. There are no hidden charges, subscription fees, or premium tiers for core functionality.' },
  { q: 'Do I need an account to use the tools?', a: 'No, you do not need to create an account. All tools work instantly without registration. Sign up optionally to save your history.' },
  { q: 'Are my uploaded files secure?', a: 'Absolutely. Most tools process files entirely in your browser. Your files are never uploaded to our servers.' },
  { q: 'Which AI tools are most popular?', a: 'Our most popular AI tools include the AI Image Generator, Background Remover, AI Caption Generator, YouTube Script Generator, and QR Code Generator.' },
  { q: 'Can I use the tools on my mobile phone?', a: 'Yes, all tools are fully responsive and work perfectly on smartphones, tablets, and desktops. No app download required.' },
  { q: 'How many tools does CreatorBoost AI offer?', a: 'CreatorBoost AI offers 80+ free online tools across AI Tools, Image Tools, PDF Tools, YouTube Tools, SEO Tools, Social Media Tools, and Finance Tools.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

/* ═══════════ MAIN COMPONENT ═══════════ */

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredTools = searchQuery.length > 0
    ? searchTools(searchQuery).slice(0, 6).map(t => ({ name: t.name, path: `/tools/${t.slug}` }))
    : [];

  const latestPosts = [...BLOG_POSTS].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTools.length > 0) navigate(filteredTools[0].path);
    else if (searchQuery.trim()) navigate(`/tools/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <>
      <SEOHead
        title="Free AI Tools - Image Generator, Background Remover, Caption & More | CreatorBoost AI"
        description="Free AI tools for creators. Generate images, remove backgrounds, write captions, and grow faster online. 80+ tools, no signup required."
        keywords="free AI tools, AI image generator, background remover, caption generator, QR code generator, YouTube tools, SEO tools"
        canonicalUrl={SITE_URL}
        structuredData={[organizationSchema(), websiteSchema(), homepageFAQSchema(), faqSchema]}
      />

      <div className="space-y-0">

        {/* ═══════════ SECTION 1: HERO ═══════════ */}
        <Section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
          {/* Aurora Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-brand-500/[0.08] rounded-full blur-[120px] animate-float" />
            <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.05] rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-purple-500/[0.05] rounded-full blur-[100px] animate-float" style={{ animationDelay: '4s' }} />
            <div className="absolute inset-0 grid-pattern opacity-40" />
          </div>

          <div className="text-center space-y-8 max-w-5xl mx-auto px-4 py-20">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 glass rounded-full text-brand-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                80+ Free Online Tools
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Headline — DOMINANT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-display font-black tracking-tight text-white leading-[0.92]">
                Free AI Tools
                <br />
                <span className="gradient-text">for Creators</span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
                Generate Images. Create Content. Grow Faster.
                <br className="hidden sm:block" />
                All powered by AI. All completely free.
              </p>
            </motion.div>

            {/* Smart Search */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto relative"
            >
              <form onSubmit={handleSearch}>
                <div className={cn(
                  "relative rounded-2xl transition-all duration-500",
                  searchFocused ? "glow-brand" : "shadow-2xl shadow-black/30"
                )}>
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand-500/30 via-cyan-500/10 to-brand-500/30 opacity-50" />
                  <div className="relative flex items-center bg-[#0B1120]/90 backdrop-blur-xl rounded-2xl border border-white/[0.06]">
                    <Search className="absolute left-5 w-5 h-5 text-brand-400" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search AI tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                      className="w-full pl-14 pr-36 py-5 bg-transparent text-white placeholder:text-white/25 focus:outline-none text-base"
                      aria-label="Search tools"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/20 btn-glow"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchFocused && searchQuery.length > 0 && filteredTools.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl overflow-hidden shadow-2xl z-50 border border-white/[0.06]"
                  >
                    {filteredTools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.05] transition-all duration-200 border-b border-white/[0.04] last:border-0"
                      >
                        <Search className="w-4 h-4 text-white/20" />
                        <span className="text-sm text-white/70">{tool.name}</span>
                        <ArrowRight className="w-3 h-3 text-white/20 ml-auto" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trending Searches */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <span className="text-xs text-white/20">Popular:</span>
                {['AI Image Generator', 'Background Remover', 'AI Caption', 'QR Generator', 'YouTube Script'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      const match = searchTools(term).slice(0, 1);
                      if (match.length > 0) navigate(`/tools/${match[0].slug}`);
                      else navigate(`/tools/${term.toLowerCase().replace(/\s+/g, '-')}`);
                    }}
                    className="text-xs text-white/40 hover:text-brand-400 bg-white/[0.03] hover:bg-brand-500/10 px-3 py-1.5 rounded-lg transition-all duration-200 border border-white/[0.05] hover:border-brand-500/20"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to="/ai-tools"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/35 hover:scale-[1.02] btn-glow"
              >
                <Sparkles className="w-4 h-4" />
                Explore Tools
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/ai-tools"
                className="inline-flex items-center gap-2 px-7 py-3.5 glass text-white/70 hover:text-white text-sm font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] border border-white/[0.06] hover:border-white/[0.12]"
              >
                <TrendingUp className="w-4 h-4" />
                Trending Tools
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-white/30"
            >
              {[
                { icon: CheckCircle2, text: 'Free Tools', color: 'text-emerald-400' },
                { icon: Zap, text: 'No Signup Required', color: 'text-amber-400' },
                { icon: Shield, text: 'Fast Results', color: 'text-cyan-400' },
                { icon: Smartphone, text: 'Mobile Friendly', color: 'text-violet-400' },
              ].map((item) => (
                <span key={item.text} className="flex items-center gap-1.5">
                  <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                  {item.text}
                </span>
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ═══════════ SECTION 3: TRENDING NOW ═══════════ */}
        <Section className="py-4 border-y border-white/[0.04] bg-white/[0.01] overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 flex items-center gap-1.5 px-5 text-xs font-bold text-red-400 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" /> Trending
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-3 animate-marquee whitespace-nowrap">
                {[...trendingTools, ...trendingTools].map((tool, i) => {
                  const TrendIcon = tool.icon;
                  return (
                    <Link
                      key={`${tool.name}-${i}`}
                      to={tool.path}
                      className="flex-shrink-0 flex items-center gap-2 text-xs text-white/30 hover:text-brand-400 transition-all duration-200 px-3.5 py-1.5 rounded-full glass-subtle hover:border-brand-500/20 border border-transparent cursor-pointer"
                    >
                      <TrendIcon className="w-3 h-3" />
                      {tool.name}
                      <span className="text-[10px] text-white/20">{tool.usage}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════ SECTION 4: FEATURED TOOLS — BENTO GRID ═══════════ */}
        <Section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <SectionBadge icon={TrendingUp} text="Most Used Tools" color="text-amber-400" />
              <SectionTitle>Top Tools Creators Love</SectionTitle>
              <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm sm:text-base">
                Used by thousands of creators worldwide. Try them free.
              </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Featured Large Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="sm:col-span-2 lg:row-span-2"
              >
                <Link
                  to={featuredTools[0].path}
                  className="group block h-full p-8 rounded-3xl glass border border-white/[0.06] hover:border-brand-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500", featuredTools[0].bg, 'border', featuredTools[0].border)}>
                      {(() => { const Icon = featuredTools[0].icon; return <Icon className={cn("w-8 h-8", featuredTools[0].color)} />; })()}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">
                      {featuredTools[0].name}
                    </h3>
                    <p className="text-sm text-white/35 leading-relaxed max-w-md mb-6">
                      {featuredTools[0].desc}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-white/25">
                        <Users className="w-3.5 h-3.5" /> {featuredTools[0].usage} uses
                      </span>
                      <span className="w-1 h-1 bg-white/10 rounded-full" />
                      <span className="flex items-center gap-1 text-sm font-semibold text-brand-400/70 group-hover:text-brand-400 transition-colors">
                        Try Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Regular Cards */}
              {featuredTools.slice(1, 7).map((tool, i) => {
                const ToolIcon = tool.icon;
                return (
                  <motion.div
                    key={tool.path}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i + 1) * 0.05 }}
                  >
                    <Link
                      to={tool.path}
                      className="group block p-6 rounded-2xl glass border border-white/[0.05] hover:border-white/[0.12] transition-all duration-400 hover:shadow-xl hover:shadow-black/20 relative overflow-hidden h-full"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500",
                        tool.bg, 'border', tool.border
                      )}>
                        <ToolIcon className={cn("w-6 h-6", tool.color)} />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-brand-400 transition-colors">{tool.name}</h3>
                      <p className="text-xs text-white/30 leading-relaxed line-clamp-2 mb-4">{tool.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/20 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {tool.usage}
                        </span>
                        <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10 text-center"
            >
              <Link
                to="/ai-tools"
                className="inline-flex items-center gap-2 px-6 py-3 glass text-white/50 hover:text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:border-brand-500/20 border border-white/[0.06]"
              >
                View All 80+ Tools <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </Section>

        {/* ═══════════ SECTION 5: LIVE STATS ═══════════ */}
        <Section className="py-16 border-y border-white/[0.04] bg-white/[0.01]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {stats.map((stat, i) => (
                <div key={stat.label} className={cn("py-10 text-center border-r border-white/[0.04] last:border-r-0", i >= 2 && "border-t md:border-t-0")}>
                  <div className={cn("text-3xl sm:text-4xl font-display font-black", stat.color)}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-white/25 mt-2 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════ SECTION 6: CATEGORIES ═══════════ */}
        <Section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <SectionBadge icon={Layout} text="Browse by Category" color="text-brand-400" />
              <SectionTitle>Find Tools by Category</SectionTitle>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((cat, i) => {
                const CatIcon = cat.icon;
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={cat.path}
                      className={cn(
                        "group block p-6 rounded-2xl bg-gradient-to-br border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 text-center",
                        cat.color, cat.border
                      )}
                    >
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500", cat.text.replace('text-', 'bg-').replace('400', '500') + '/10')}>
                        <CatIcon className={cn("w-7 h-7", cat.text)} />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">{cat.name}</h3>
                      <p className="text-[11px] text-white/25">{cat.count} tools</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ═══════════ SECTION 8: WHY CREATORBOOSTAI ═══════════ */}
        <Section className="py-20 sm:py-28 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <SectionBadge icon={Award} text="Why Choose Us" color="text-brand-400" />
              <SectionTitle>Why CreatorBoostAI?</SectionTitle>
              <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm sm:text-base">
                Built for creators, by creators. Here is what makes us different.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyFeatures.map((feat, i) => {
                const FeatIcon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="p-6 glass-card rounded-2xl hover:border-brand-500/20 transition-all duration-300 group"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300", feat.bg)}>
                      <FeatIcon className={cn("w-6 h-6", feat.color)} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ═══════════ SECTION 9: BLOG HIGHLIGHTS ═══════════ */}
        <Section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <SectionBadge icon={BookOpen} text="Latest Articles" color="text-purple-400" />
                <SectionTitle>From the Blog</SectionTitle>
              </motion.div>
              <Link
                to="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors duration-200"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {latestPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block rounded-2xl glass border border-white/[0.05] overflow-hidden hover:border-brand-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1"
                  >
                    <div className="h-48 bg-gradient-to-br from-brand-500/20 via-purple-500/10 to-cyan-500/10 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="relative text-5xl opacity-20">
                        {post.category === 'youtube' ? '🎬' : post.category === 'seo' ? '🔍' : post.category === 'content' ? '✍️' : '📊'}
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 glass text-white text-[10px] font-bold uppercase rounded-lg">
                          {post.category === 'youtube' ? 'YouTube' : post.category === 'seo' ? 'SEO' : post.category === 'content' ? 'Content' : 'Marketing'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-white/25 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.publishDate}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-white/30 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-400/50 group-hover:text-brand-400 transition-colors">
                        Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════ SECTION 10: TESTIMONIALS ═══════════ */}
        <Section className="py-20 sm:py-28 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <SectionBadge icon={Users} text="Social Proof" color="text-amber-400" />
              <SectionTitle>Trusted by Creators Worldwide</SectionTitle>
            </motion.div>
            <Testimonials variant="grid" showStats={true} />
          </div>
        </Section>

        {/* ═══════════ FAQ ═══════════ */}
        <Section className="py-20 sm:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <SectionBadge icon={MessageCircle} text="FAQ" color="text-amber-400" />
              <SectionTitle>Frequently Asked Questions</SectionTitle>
            </motion.div>

            <div className="space-y-3">
              {faqData.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl glass-card border border-white/[0.05] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-bold text-white pr-4">{item.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-sm text-white/40 leading-relaxed border-t border-white/[0.04] pt-4">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════ SECTION 11: FINAL CTA ═══════════ */}
        <Section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-purple-500/10 to-cyan-500/10" />
              <div className="absolute inset-0 mesh-gradient opacity-50" />

              <div className="relative glass border border-brand-500/20 rounded-3xl p-10 sm:p-14 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-4">
                  Start Creating Smarter With AI
                </h2>
                <p className="text-white/40 max-w-lg mx-auto text-sm sm:text-base mb-8">
                  Join thousands of creators using our free AI tools to produce professional content every day.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/ai-tools"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/35 hover:scale-[1.02] btn-glow"
                  >
                    <Sparkles className="w-4 h-4" />
                    Explore All Tools
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-8 py-4 glass text-white/60 hover:text-white text-sm font-bold rounded-xl transition-all duration-300 border border-white/[0.06] hover:border-white/[0.12]"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read Blog
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>
      </div>
    </>
  );
}
