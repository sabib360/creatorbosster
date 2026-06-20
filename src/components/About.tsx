import { Target, Wrench, Brain, Image, FileText, Calculator, Hash, Shield, Globe, Users, Zap, Heart, TrendingUp, Award, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';
import { aboutPageSchema } from '../lib/schema';

const SITE_URL = 'https://creatorboostai.xyz';
const LAST_UPDATED = 'June 20, 2026';

const toolCategories = [
  { name: 'Image Tools', count: 9, icon: Image, description: 'Compress, resize, crop, rotate, convert, and enhance images with browser-based processing.' },
  { name: 'PDF Tools', count: 9, icon: FileText, description: 'Merge, split, compress, convert, and edit PDF documents without uploading to servers.' },
  { name: 'AI Tools', count: 6, icon: Brain, description: 'AI-powered content generation, image analysis, background removal, and document summarization.' },
  { name: 'Finance Tools', count: 8, icon: Calculator, description: 'Loan calculators, budget planners, tax calculators, SIP calculators, and currency converters.' },
  { name: 'Social Media Tools', count: 12, icon: Hash, description: 'Hashtag generators, caption writers, content idea generators, QR codes, and YouTube tools.' },
  { name: 'Developer Tools', count: 5, icon: Code, description: 'JSON formatters, base64 encoders, regex testers, meta tag generators, and more.' },
];

const stats = [
  { value: '50+', label: 'Free Tools', icon: Wrench },
  { value: '10K+', label: 'Active Users', icon: Users },
  { value: '4.8/5', label: 'User Rating', icon: Award },
  { value: '100%', label: 'Free & Private', icon: Shield },
];

const values = [
  { title: 'Privacy First', description: 'Your data stays in your browser. We do not store, sell, or share your files or personal content with anyone.', icon: Shield },
  { title: 'No Signups Required', description: 'Most tools work instantly without creating an account. No email collection, no hidden barriers.', icon: Zap },
  { title: 'AI-Powered Innovation', description: 'We leverage cutting-edge AI technology to provide intelligent tools that adapt to your needs.', icon: Brain },
  { title: 'Built for Creators', description: 'Every tool is designed with content creators in mind — from YouTube creators to social media managers.', icon: Target },
];

export default function About() {
  return (
    <>
      <SEOHead
        title="About Us - CreatorBoost AI | Free Online Tools for Content Creators"
        description="Learn about CreatorBoost AI — a free toolkit with 50+ tools for image processing, PDF editing, AI-powered content creation, and financial calculations. Built for creators, by creators."
        keywords="about creatorboost AI, free online tools, content creator tools, image editor, PDF tools, AI tools"
        canonicalUrl={`${SITE_URL}/about`}
        structuredData={aboutPageSchema()}
      />

      <div className="max-w-5xl mx-auto space-y-20">
        {/* Hero */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-semibold">
            <Heart className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
            About CreatorBoost AI
          </h1>
          <p className="text-ink/60 text-xl max-w-2xl mx-auto leading-relaxed">
            We believe every creator deserves access to powerful, professional-grade tools — without the premium price tag.
          </p>
          <p className="text-ink/40 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Mission */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-10 md:p-14 space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink">Our Mission</h2>
          <p className="text-ink/70 leading-relaxed text-lg">
            CreatorBoost AI was built with a single, clear mission: <strong>to democratize content creation tools</strong> so that
            anyone — from a solo YouTube creator to a small business owner — can produce professional-quality
            content without spending a fortune on software subscriptions.
          </p>
          <p className="text-ink/70 leading-relaxed">
            We noticed a gap in the market. Powerful tools like Adobe Photoshop, Canva Pro, and specialized
            PDF software come with recurring costs that add up quickly. Meanwhile, free alternatives were
            either riddled with ads, required mandatory sign-ups, or simply didn't work well enough to be
            useful. We decided to change that.
          </p>
          <p className="text-ink/70 leading-relaxed">
            CreatorBoost AI combines the power of modern web technology with artificial intelligence to deliver
            a comprehensive toolkit that runs entirely in your browser. No downloads. No installations. No
            hidden fees. Just powerful tools that work when you need them.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center space-y-2">
              <stat.icon className="w-6 h-6 text-primary mx-auto" />
              <div className="text-3xl font-bold text-ink">{stat.value}</div>
              <div className="text-sm text-ink/60">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* What We Do */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink">What We Do</h2>
            <p className="text-ink/60 max-w-2xl mx-auto">
              CreatorBoost AI provides a comprehensive suite of free, browser-based tools across six major categories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolCategories.map((cat) => (
              <div key={cat.name} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-2">
                    <cat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">{cat.name}</h3>
                    <p className="text-xs text-ink/50">{cat.count} tools</p>
                  </div>
                </div>
                <p className="text-ink/60 text-sm leading-relaxed">{cat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink">Why Choose Us</h2>
            <p className="text-ink/60 max-w-2xl mx-auto">
              We're not just another tool site. Here's what makes CreatorBoost AI different.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((val) => (
              <div key={val.title} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 w-fit">
                  <val.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-ink">{val.title}</h3>
                <p className="text-ink/60 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink">Under the Hood</h2>
            <p className="text-ink/60 max-w-2xl mx-auto">
              We build with modern, performant technologies to deliver a fast and reliable experience.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'React 19', desc: 'UI framework' },
                { name: 'TypeScript', desc: 'Type safety' },
                { name: 'Tailwind CSS', desc: 'Styling' },
                { name: 'Vite', desc: 'Build tool' },
                { name: 'Framer Motion', desc: 'Animations' },
                { name: 'Firebase', desc: 'Authentication' },
                { name: 'Google Gemini', desc: 'AI engine' },
                { name: 'Vercel', desc: 'Hosting' },
              ].map((tech) => (
                <div key={tech.name} className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="font-bold text-ink text-sm">{tech.name}</div>
                  <div className="text-xs text-ink/50 mt-1">{tech.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-ink/60 leading-relaxed text-sm">
              Most of our tools use client-side processing via modern browser APIs and WebAssembly.
              Your files never leave your device. For AI-powered features, we use the Google Gemini API
              with strict data handling policies — content is processed and immediately discarded, never
              stored on our servers.
            </p>
          </div>
        </section>

        {/* Founder */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink">Built by a Creator</h2>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 md:p-14 space-y-6">
            <p className="text-ink/70 leading-relaxed text-lg">
              CreatorBoost AI was founded by a content creator who experienced firsthand the frustration
              of juggling multiple expensive tools just to produce basic content. After spending thousands
              of dollars on software subscriptions that offered features most creators never use, the idea
              was simple: <strong>build what creators actually need, and make it free</strong>.
            </p>
            <p className="text-ink/70 leading-relaxed">
              What started as a small collection of image tools has grown into a comprehensive suite of
              50+ tools serving thousands of creators worldwide. Every tool in the suite was built because
              someone needed it — from compressing YouTube thumbnails to merging PDF proposals to generating
              viral hashtags.
            </p>
            <p className="text-ink/70 leading-relaxed">
              The project is actively maintained and constantly improving. New tools are added regularly
              based on user feedback and emerging creator needs. If you have a tool suggestion, we'd love
              to hear from you — visit our <Link to="/contact-us" className="text-primary hover:underline">contact page</Link> or
              reach out on social media.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-3xl p-10 md:p-14 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink">
            Ready to Create?
          </h2>
          <p className="text-ink/60 max-w-xl mx-auto">
            Explore our full suite of free tools and see why thousands of creators trust CreatorBoost AI for their content needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="bg-primary hover:bg-primary/90 text-black font-display font-black uppercase tracking-wider py-4 px-8 rounded-xl transition-colors"
            >
              Explore All Tools
            </Link>
            <Link
              to="/contact-us"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-ink font-display font-black uppercase tracking-wider py-4 px-8 rounded-xl transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>

        {/* Footer Links */}
        <div className="border-t border-slate-800 pt-8">
          <p className="text-ink/50 text-sm text-center">
            <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> · <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> · <Link to="/contact-us" className="text-primary hover:underline">Contact Us</Link>
          </p>
        </div>
      </div>
    </>
  );
}
