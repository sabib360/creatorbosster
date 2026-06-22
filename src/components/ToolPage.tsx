import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Users, Share2, Copy, Check,
  Zap, Shield, Smartphone, Brain, Clock, Award, ArrowRight,
  ChevronDown, ChevronUp, ExternalLink,
  CheckCircle2, ArrowUpRight, Sparkles, Eye, ThumbsUp,
  Flag, Link2, Facebook, Twitter, TrendingUp as TrendingUpIcon, BarChart3 as BarChart,
  Download, RefreshCw, Heart, MessageCircle, Globe, Rocket, Target, Wand2
} from 'lucide-react';
import SEOHead from './SEOHead';
import Breadcrumb from './Breadcrumb';
import { toolSoftwareSchema, toolFAQSchema } from '../lib/schema';
import { SEO_CONFIG } from '../config/seo-config';
import { getTool, ALL_TOOLS, type ToolVariant } from '../config/tools-registry';
import { recordToolUse } from '../hooks/useRecentlyUsed';
import { useFavorites } from '../hooks/useFavorites';
import { recordToolUsage } from '../lib/trending';
import { useToast } from './Toast';

const SITE_URL = SEO_CONFIG.siteUrl;

/* ═══════════ TYPES ═══════════ */

export interface HowToStep {
  title: string;
  description: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface ToolPageConfig {
  description?: string;
  whoIsItFor?: string;
  useCases?: string[];
  howToSteps?: HowToStep[];
  features?: Feature[];
  benefits?: Benefit[];
  faqs?: Array<{ q: string; a: string }>;
}

interface ToolPageProps {
  children: ReactNode;
  toolId?: string;
  toolPath?: string;
  faqItems?: Array<{ q: string; a: string }>;
  config?: ToolPageConfig;
}

/* ═══════════ CATEGORY HELPERS ═══════════ */

const CATEGORY_MAP: Record<string, { name: string; path: string; color: string; icon: string }> = {
  image: { name: 'Image Tools', path: '/image-tools', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: '🖼️' },
  pdf: { name: 'PDF Tools', path: '/pdf-tools', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', icon: '📄' },
  ai: { name: 'AI Tools', path: '/ai-tools', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', icon: '🤖' },
  finance: { name: 'Finance Tools', path: '/finance-tools', color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: '💰' },
  social: { name: 'Social Media Tools', path: '/social-media-tools', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20', icon: '📱' },
  developer: { name: 'Developer Tools', path: '/ai-tools', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: '⚡' },
};

function resolveCategory(pathname: string): { name: string; path: string; color: string; key: string; icon: string } {
  const p = pathname.toLowerCase();
  if (p.includes('image') || p.includes('photo') || p.includes('compress') || p.includes('resize') || p.includes('crop') || p.includes('watermark') || p.includes('favicon') || p.includes('color-picker') || p.includes('passport') || p.includes('rotator') || p.includes('converter') || p.includes('base64-to-image') || p.includes('image-to-base64') || p.includes('metadata') || p.includes('splitter') || p.includes('merger') || p.includes('filter') || p.includes('bulk') || p.includes('targeted'))
    return { ...CATEGORY_MAP.image, key: 'image' };
  if (p.includes('pdf'))
    return { ...CATEGORY_MAP.pdf, key: 'pdf' };
  if (p.includes('ai-') || p.includes('thumbnail') || p.includes('competitor') || p.includes('background-remover') || p.includes('summarizer') || p.includes('analyzer') || p.includes('upscal') || p.includes('text-to-image') || p.includes('chatbot') || p.includes('code-generator') || p.includes('translator') || p.includes('sentiment'))
    return { ...CATEGORY_MAP.ai, key: 'ai' };
  if (p.includes('loan') || p.includes('interest') || p.includes('sip') || p.includes('budget') || p.includes('tax') || p.includes('fd-') || p.includes('currency') || p.includes('emi') || p.includes('bmi') || p.includes('percentage') || p.includes('unit-') || p.includes('password-gen') || p.includes('age-cal') || p.includes('date-diff'))
    return { ...CATEGORY_MAP.finance, key: 'finance' };
  if (p.includes('hashtag') || p.includes('caption') || p.includes('content-idea') || p.includes('social') || p.includes('link-shortener') || p.includes('emoji') || p.includes('bio-link') || p.includes('youtube') || p.includes('qr-code'))
    return { ...CATEGORY_MAP.social, key: 'social' };
  if (p.includes('json') || p.includes('base64') || p.includes('html-to') || p.includes('markdown') || p.includes('css-') || p.includes('js-') || p.includes('url-enc') || p.includes('hash-gen') || p.includes('regex') || p.includes('meta-tag') || p.includes('blog-title') || p.includes('blog-outline') || p.includes('meta-desc') || p.includes('social-post') || p.includes('paraphras') || p.includes('grammar') || p.includes('word-count') || p.includes('slug-') || p.includes('email-subject') || p.includes('content-calendar'))
    return { ...CATEGORY_MAP.developer, key: 'developer' };
  return { name: 'Tools', path: '/', color: 'text-white/40 bg-white/[0.04] border-white/[0.06]', key: 'other', icon: '🔧' };
}

/* ═══════════ DEFAULT CONTENT ═══════════ */

const DEFAULT_FEATURES: Feature[] = [
  { icon: 'zap', title: 'Fast Processing', description: 'Get results instantly with optimized in-browser processing' },
  { icon: 'shield', title: '100% Secure', description: 'Your data stays on your device — never uploaded to servers' },
  { icon: 'smartphone', title: 'Mobile Friendly', description: 'Works perfectly on desktop, tablet, and smartphone' },
  { icon: 'brain', title: 'AI Powered', description: 'Smart algorithms deliver professional-grade results' },
  { icon: 'award', title: 'Free to Use', description: 'No signup, no hidden fees — completely free' },
  { icon: 'eye', title: 'High Quality', description: 'Professional output that meets industry standards' },
];

const DEFAULT_FAQS: Array<{ q: string; a: string }> = [
  { q: 'Is this tool free to use?', a: 'Yes, this tool is completely free. There are no hidden charges, subscription fees, or usage limits. Use it as many times as you need.' },
  { q: 'Do I need to create an account?', a: 'No account is required. Simply visit the tool page and start using it immediately. No email, no signup, no hassle.' },
  { q: 'Is my data secure?', a: 'Absolutely. For browser-based tools, all processing happens locally in your browser — your files never leave your device. For AI-powered tools, data is processed via secure API calls and immediately discarded.' },
  { q: 'Can I use this on my phone?', a: 'Yes, the tool is fully responsive and works on all devices including smartphones, tablets, and desktops. No app download is needed.' },
  { q: 'What browsers are supported?', a: 'The tool works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser updated to the latest version.' },
  { q: 'Are there any usage limits?', a: 'There are no enforced usage limits for most tools. You can use the tool as many times as you need without any restrictions.' },
  { q: 'How do I report a bug or request a feature?', a: 'Visit our Contact page and send us a message. We respond to all inquiries within 24-48 hours and prioritize user-reported issues.' },
  { q: 'Can I use the output commercially?', a: 'Yes, you own the output created using our tools. You are free to use the results for personal or commercial purposes.' },
];

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  zap: Zap, shield: Shield, smartphone: Smartphone, brain: Brain,
  award: Award, eye: Eye, clock: Clock, star: Star, users: Users,
  check: CheckCircle2, sparkles: Sparkles, thumbsup: ThumbsUp,
};

function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Zap;
  return <Icon className={className} />;
}

/* ═══════════ SHARED COMPONENTS ═══════════ */

function SectionBadge({ icon: Icon, text, color = 'text-brand-400' }: { icon: React.FC<{ className?: string }>; text: string; color?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[11px] font-bold uppercase tracking-widest mb-5", color)}>
      <Icon className="w-3 h-3" /> {text}
    </div>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-2xl sm:text-3xl font-display font-black tracking-tight text-white", className)}>
      {children}
    </h2>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ═══════════ MAIN COMPONENT ═══════════ */

export default function ToolPage({ children, toolId, toolPath, faqItems, config }: ToolPageProps) {
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  const resolvedToolId = toolId ?? (() => {
    if (toolPath) {
      const found = ALL_TOOLS.find(t => t.path === `/tools/${toolPath}`);
      return found?.id;
    }
    return undefined;
  })();

  const tool = resolvedToolId ? getTool(resolvedToolId) : undefined;
  const category = resolveCategory(location.pathname);
  const canonicalUrl = `${SITE_URL}${location.pathname}`;

  useEffect(() => {
    const name = tool?.name || getToolNameFromPath();
    recordToolUse(location.pathname, name);
    if (tool?.id) recordToolUsage(tool.id);
  }, [location.pathname]);

  function getToolNameFromPath(): string {
    const path = location.pathname.split('/').pop();
    if (!path) return 'Tool';
    return path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  const toolName = tool?.name || getToolNameFromPath();
  const toolDescription = tool?.description || '';
  const toolSeoTitle = tool?.seoTitle || `${toolName} - Free Online Tool | CreatorBoost AI`;
  const toolSeoDesc = tool?.seoDescription || `Use ${toolName} online for free. Fast, secure, and no signup required. Try it now on CreatorBoost AI.`;
  const toolKeywords = tool?.keywords?.join(', ') || '';

  const allFaqs = faqItems && faqItems.length > 0
    ? faqItems
    : config?.faqs && config.faqs.length > 0
      ? config.faqs
      : DEFAULT_FAQS;

  const features = config?.features && config.features.length > 0 ? config.features : DEFAULT_FEATURES;
  const howToSteps = config?.howToSteps || [];
  const benefits = config?.benefits || [];
  const description = config?.description || '';

  const relatedTools = getRelatedTools(resolvedToolId, category.key, 6);

  const schemas = tool ? [
    toolSoftwareSchema(tool, canonicalUrl),
    toolFAQSchema(allFaqs),
  ].filter(Boolean) : [
    toolSoftwareSchema({
      id: '',
      name: toolName,
      description: toolDescription,
      seoTitle: toolSeoTitle,
      seoDescription: toolSeoDesc,
      keywords: toolKeywords ? toolKeywords.split(',').map(k => k.trim()) : [],
      path: location.pathname,
      category: category.name,
      subcategory: '',
      difficulty: 'easy',
      estimatedSearchVolume: 0,
      estimatedCPC: 0,
    }, canonicalUrl),
    toolFAQSchema(allFaqs),
  ].filter(Boolean);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(canonicalUrl);
    const text = encodeURIComponent(`Check out ${toolName} on CreatorBoost AI`);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <>
      <SEOHead
        title={toolSeoTitle}
        description={toolSeoDesc}
        keywords={toolKeywords}
        canonicalUrl={canonicalUrl}
      />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ═══════════ MAIN CONTENT ═══════════ */}
          <div className="flex-1 min-w-0">

            {/* ─── 1. BREADCRUMB ─── */}
            <Breadcrumb
              items={[
                { name: category.name, path: category.path },
                { name: toolName, path: location.pathname },
              ]}
              className="mb-6"
            />

            {/* ─── 2. TOOL HERO ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-8"
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${category.color}`}>
                  {category.icon} {category.name}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="w-2.5 h-2.5" /> Free
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Rocket className="w-2.5 h-2.5" /> Fast
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Shield className="w-2.5 h-2.5" /> No Signup
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-4 leading-tight">
                {toolName}
              </h1>

              {/* Description */}
              <p className="text-base text-white/50 max-w-2xl leading-relaxed mb-5">
                {toolDescription || toolSeoDesc}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 mb-5">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                  <span className="text-xs text-white/50 ml-1">4.8</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/40">
                  <Users className="w-3 h-3" />
                  <span className="text-xs">2.5K+ users</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/40">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">Instant results</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/40">
                  <Globe className="w-3 h-3" />
                  <span className="text-xs">Works worldwide</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {tool?.id && <FavoriteButton toolId={tool.id} toolName={toolName} />}
                <button onClick={() => handleShare('twitter')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs text-white/50 hover:text-white transition-all duration-200" aria-label="Share on Twitter">
                  <Twitter className="w-3 h-3" /> Share
                </button>
                <button onClick={() => handleShare('facebook')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs text-white/50 hover:text-white transition-all duration-200" aria-label="Share on Facebook">
                  <Facebook className="w-3 h-3" /> Share
                </button>
                <button onClick={handleCopyLink} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-xs text-white/50 hover:text-white transition-all duration-200" aria-label="Copy link">
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Link2 className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </motion.section>

            {/* ─── 3. TOOL WORKSPACE ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-12"
            >
              <div className="glass-card rounded-2xl p-5 sm:p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand-500/10 via-transparent to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative">
                  {children}
                </div>
              </div>
            </motion.section>

            {/* ─── 4. TOOL DESCRIPTION ─── */}
            {description && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-12"
              >
                <SectionBadge icon={Eye} text="About This Tool" />
                <SectionTitle>What is {toolName}?</SectionTitle>
                <div className="text-sm text-white/50 leading-relaxed space-y-4 mt-5">
                  <p>{description}</p>
                  {config?.whoIsItFor && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-brand-400" /> Who Should Use This Tool?
                      </h3>
                      <p className="text-white/50">{config.whoIsItFor}</p>
                    </div>
                  )}
                  {config?.useCases && config.useCases.length > 0 && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-brand-400" /> Real Use Cases
                      </h3>
                      <ul className="space-y-2">
                        {config.useCases.map((uc, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/50">
                            <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                            <span>{uc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* ─── 5. HOW TO USE ─── */}
            {howToSteps.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-12"
              >
                <SectionBadge icon={Rocket} text="How It Works" />
                <SectionTitle>How to Use {toolName}</SectionTitle>
                <div className="space-y-4 mt-5">
                  {howToSteps.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 glass-card rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-brand-400">{i + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ─── 6. FEATURES ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-12"
            >
              <SectionBadge icon={Sparkles} text="Features" />
              <SectionTitle>Powerful Features</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
                {features.map((feat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="p-4 glass-card rounded-xl hover:border-brand-500/20 transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <FeatureIcon name={feat.icon} className="w-4 h-4 text-brand-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{feat.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{feat.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ─── 7. BENEFITS ─── */}
            {benefits.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-12"
              >
                <SectionBadge icon={Award} text="Why Choose Us" />
                <SectionTitle>Why Choose {toolName}?</SectionTitle>
                <div className="space-y-3 mt-5">
                  {benefits.map((ben, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 glass-card rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">{ben.title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{ben.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ─── 8. FAQ ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <SectionBadge icon={MessageCircle} text="FAQ" />
              <SectionTitle>Frequently Asked Questions</SectionTitle>
              <div className="space-y-2 mt-5">
                {allFaqs.map((item, i) => (
                  <div key={i} className="glass-card rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                      aria-expanded={openFaq === i}
                    >
                      <span className="text-sm font-bold text-white pr-4">{item.q}</span>
                      {openFaq === i ? (
                        <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
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
                          <div className="px-4 pb-4 text-xs text-white/50 leading-relaxed border-t border-white/[0.04] pt-3">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ─── 9. RELATED TOOLS ─── */}
            {relatedTools.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-12"
              >
                <SectionBadge icon={ArrowUpRight} text="Related Tools" />
                <SectionTitle>Try More Tools</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
                  {relatedTools.map((rt) => (
                    <Link
                      key={rt.id}
                      to={rt.path}
                      className="group p-4 glass-card rounded-xl hover:border-brand-500/20 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors truncate">
                          {rt.name}
                        </h3>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-brand-400 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-3">{rt.description}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400/60 bg-brand-500/5 px-2 py-0.5 rounded-full">
                        {rt.category}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ─── 10. FEEDBACK ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="glass border border-white/[0.06] rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />
                <div className="relative">
                  <p className="text-sm font-bold text-white mb-3">Was this tool helpful?</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setFeedbackGiven('up')}
                      className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        feedbackGiven === 'up'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/[0.04] text-white/50 hover:text-emerald-400 border border-white/[0.06] hover:border-emerald-500/30'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Yes
                    </button>
                    <button
                      onClick={() => setFeedbackGiven('down')}
                      className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        feedbackGiven === 'down'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white/[0.04] text-white/50 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" /> Report Issue
                    </button>
                  </div>
                  {feedbackGiven && (
                    <p className="text-xs text-white/30 mt-3">Thanks for your feedback!</p>
                  )}
                </div>
              </div>
            </motion.section>

          </div>

          {/* ═══════════ SIDEBAR ═══════════ */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">

            {/* Social Proof Stats */}
            <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BarChart className="w-3.5 h-3.5 text-brand-400" /> Tool Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                  <div className="text-lg font-bold text-white">2.5K+</div>
                  <div className="text-[10px] text-white/30">Users</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                  <div className="text-lg font-bold text-emerald-400">4.8</div>
                  <div className="text-[10px] text-white/30">Rating</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                  <div className="text-lg font-bold text-cyan-400">15K+</div>
                  <div className="text-[10px] text-white/30">Uses</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                  <div className="text-lg font-bold text-amber-400">Free</div>
                  <div className="text-[10px] text-white/30">Forever</div>
                </div>
              </div>
            </div>

            {/* Popular Tools */}
            <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUpIcon className="w-3.5 h-3.5 text-brand-400" /> Popular Tools
              </h3>
              <div className="space-y-1">
                {getPopularTools(5).map((t) => (
                  <Link
                    key={t.id}
                    to={t.path}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                      <Zap className="w-3.5 h-3.5 text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white/70 group-hover:text-brand-400 transition-colors truncate">{t.name}</p>
                      <p className="text-[10px] text-white/30 truncate">{t.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recently Added */}
            <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Recently Added
              </h3>
              <div className="space-y-1">
                {getNewTools(5).map((t) => (
                  <Link
                    key={t.id}
                    to={t.path}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white/70 group-hover:text-brand-400 transition-colors truncate">{t.name}</p>
                      <p className="text-[10px] text-white/30 truncate">{t.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Most Used */}
            <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BarChart className="w-3.5 h-3.5 text-amber-400" /> Most Used
              </h3>
              <div className="space-y-1">
                {getMostUsedTools(5).map((t) => (
                  <Link
                    key={t.id}
                    to={t.path}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                      <BarChart className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white/70 group-hover:text-brand-400 transition-colors truncate">{t.name}</p>
                      <p className="text-[10px] text-white/30 truncate">{t.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-purple-500/5 to-brand-600/10 pointer-events-none" />
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-brand-500/20 via-cyan-500/10 to-brand-500/20 opacity-30 pointer-events-none" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Try More AI Tools</h3>
                <p className="text-xs text-white/40 mb-4">Explore 80+ free tools for creators.</p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-500 transition-all duration-200 btn-glow"
                >
                  Explore All Tools <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}

/* ═══════════ SIDEBAR HELPERS ═══════════ */

function getPopularTools(count: number): ToolVariant[] {
  return [...ALL_TOOLS]
    .sort((a, b) => b.estimatedSearchVolume - a.estimatedSearchVolume)
    .slice(0, count);
}

function getNewTools(count: number): ToolVariant[] {
  return [...ALL_TOOLS].reverse().slice(0, count);
}

function getMostUsedTools(count: number): ToolVariant[] {
  return [...ALL_TOOLS]
    .sort((a, b) => b.estimatedCPC - a.estimatedCPC)
    .slice(0, count);
}

function getRelatedTools(currentId: string | undefined, categoryKey: string, count: number): ToolVariant[] {
  if (!currentId) return ALL_TOOLS.slice(0, count);

  const CATEGORY_SIMILARITY: Record<string, string[]> = {
    image: ['image', 'ai', 'social'],
    pdf: ['pdf', 'developer'],
    ai: ['ai', 'image', 'social'],
    finance: ['finance'],
    social: ['social', 'ai'],
    developer: ['developer', 'pdf'],
    other: ['other'],
  };

  const current = ALL_TOOLS.find(t => t.id === currentId);
  if (!current) return ALL_TOOLS.slice(0, count);

  const similar = CATEGORY_SIMILARITY[categoryKey] || [];

  return ALL_TOOLS
    .filter(t => t.id !== currentId)
    .map(t => {
      let score = 0;
      const tCat = resolveCategory(t.path).key;
      if (tCat === categoryKey) score += 10;
      if (similar.includes(tCat)) score += 5;
      const shared = t.keywords.filter(k => current.keywords.some(ck => k.split(' ').some(w => ck.includes(w))));
      score += shared.length;
      return { tool: t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(r => r.tool);
}

/* ═══════════ FAVORITE BUTTON ═══════════ */

function FavoriteButton({ toolId, toolName }: { toolId: string; toolName: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToast } = useToast();
  const fav = isFavorite(toolId);

  const handleToggle = () => {
    toggleFavorite(toolId);
    addToast(
      fav ? `Removed ${toolName} from favorites` : `Added ${toolName} to favorites`,
      fav ? 'info' : 'success'
    );
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs transition-all duration-200 ${
        fav
          ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20'
          : 'bg-white/[0.04] border-white/[0.06] text-white/50 hover:text-pink-400 hover:bg-white/[0.08]'
      }`}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={`w-3 h-3 ${fav ? 'fill-pink-400' : ''}`} />
      {fav ? 'Saved' : 'Save'}
    </button>
  );
}
