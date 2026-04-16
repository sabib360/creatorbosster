import { Sparkles, Target, Users, TrendingUp, Zap, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Main Header */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
          About Creator Booster AI
        </h1>
        <p className="text-xl md:text-2xl text-ink/70 max-w-3xl mx-auto leading-relaxed">
          Empowering content creators with AI-powered tools to generate viral YouTube titles, professional thumbnails, and engaging descriptions in seconds.
        </p>
      </div>

      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink flex items-center gap-3">
            <Target className="w-10 h-10 text-primary" />
            Our Mission
          </h2>
          <p className="text-lg text-ink/70 leading-relaxed">
            YouTube creators spend countless hours brainstorming titles, designing thumbnails, and optimizing descriptions. Most end up with mediocre results because they lack professional expertise or tools.
          </p>
          <p className="text-lg text-ink/70 leading-relaxed">
            <strong>Creator Booster AI eliminates this struggle.</strong> We democratize professional-grade content optimization by combining Google's Gemini AI with proven YouTube growth strategies. Now, every creator—regardless of experience—can compete with established channels.
          </p>
          <p className="text-lg text-ink/70 leading-relaxed">
            Our mission: <span className="text-primary font-bold italic">Help 1 million creators grow their YouTube channels through AI-powered optimization and proven strategies.</span>
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-3xl p-12 flex flex-col items-center justify-center min-h-96">
          <Sparkles className="w-24 h-24 text-primary mb-6" />
          <p className="text-center font-display font-black text-2xl uppercase text-primary">
            AI-Powered Content Optimization
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 rounded-3xl p-12 flex flex-col items-center justify-center min-h-96 order-2 md:order-1">
          <TrendingUp className="w-24 h-24 text-secondary mb-6" />
          <p className="text-center font-display font-black text-2xl uppercase text-secondary">
            10x Growth for Creators
          </p>
        </div>
        <div className="space-y-6 order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-secondary" />
            Our Vision
          </h2>
          <p className="text-lg text-ink/70 leading-relaxed">
            By 2027, we envision Creator Booster AI as the go-to tool for every aspiring and established YouTube creator worldwide.
          </p>
          <p className="text-lg text-ink/70 leading-relaxed">
            We're building a future where:
          </p>
          <ul className="space-y-3 text-lg">
            <li className="flex gap-3">
              <span className="text-primary font-black">✓</span>
              <span>AI handles metadata optimization so creators focus on content quality</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">✓</span>
              <span>Every creator has access to professional-grade tools, not just big studios</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">✓</span>
              <span>Data-driven decisions replace guesswork in content strategy</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-black">✓</span>
              <span>Creator communities thrive with shared knowledge and proven strategies</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="space-y-12">
        <h2 className="text-4xl font-display font-black uppercase tracking-tight text-center text-ink">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-primary/50 transition-all group">
            <div className="w-16 h-16 bg-primary/20 border border-primary/40 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-display font-black uppercase tracking-wider mb-3 text-ink">Speed</h3>
            <p className="text-ink/70 leading-relaxed">
              Generate professional-quality content metadata in seconds, not hours. Creators should spend time making videos, not optimizing metadata.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-secondary/50 transition-all group">
            <div className="w-16 h-16 bg-secondary/20 border border-secondary/40 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary/30 transition-colors">
              <Target className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-display font-black uppercase tracking-wider mb-3 text-ink">Precision</h3>
            <p className="text-ink/70 leading-relaxed">
              Every title, thumbnail, and description is optimized for YouTube's algorithm and proven to increase CTR. Data beats guessing every time.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-quaternary/50 transition-all group">
            <div className="w-16 h-16 bg-quaternary/20 border border-quaternary/40 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-quaternary/30 transition-colors">
              <Heart className="w-8 h-8 text-quaternary" />
            </div>
            <h3 className="text-xl font-display font-black uppercase tracking-wider mb-3 text-ink">Empowerment</h3>
            <p className="text-ink/70 leading-relaxed">
              We believe every creator deserves access to professional tools. Success shouldn't be limited to those with big budgets.
            </p>
          </div>
        </div>
      </section>

      {/* Team/Impact */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-quaternary/10 border border-primary/20 rounded-3xl p-12 md:p-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink flex items-center gap-3">
              <Users className="w-10 h-10 text-primary" />
              Our Impact
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-display font-black text-primary">50K+</div>
                <p className="text-ink/70">Titles Generated</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-display font-black text-secondary">10K+</div>
                <p className="text-ink/70">Active Creators</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-display font-black text-quaternary">500M+</div>
                <p className="text-ink/70">Combined Views Influenced</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-ink/70 leading-relaxed">
              Creator Booster AI has empowered thousands of content creators to optimize their YouTube presence and grow faster than they ever thought possible.
            </p>
            <p className="text-lg text-ink/70 leading-relaxed">
              From small channels just starting out to established creators looking to scale, our tools have consistently delivered results:
            </p>
            <ul className="space-y-2 text-ink/70">
              <li>• Average 30-40% increase in click-through rates</li>
              <li>• 2-3x faster audience growth</li>
              <li>• 50%+ improvement in thumbnail performance</li>
              <li>• Better SEO rankings for video discovery</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink">
          Ready to Boost Your YouTube Growth?
        </h2>
        <p className="text-lg text-ink/70 max-w-2xl mx-auto">
          Join thousands of creators already using Creator Booster AI to generate viral titles, professional thumbnails, and engaging descriptions instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/#generator"
            className="px-8 py-4 bg-primary text-black font-display font-black text-lg uppercase rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
          >
            Get Started Free
          </a>
          <a 
            href="/#blog"
            className="px-8 py-4 bg-slate-900 border border-slate-800 text-ink font-display font-black text-lg uppercase rounded-xl hover:border-primary transition-all"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
}
