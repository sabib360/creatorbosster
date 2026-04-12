import React from 'react';
import { Check, X, Crown, Zap, Loader2, ShieldCheck, Globe, CreditCard, Apple } from 'lucide-react';
import { PLANS, PlanId, getYearlyPriceUSD } from '../../config/pricing';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface PricingGlobalProps {
  billingPeriod: 'monthly' | 'yearly';
  isSubscribing: string | null;
  handleSubscribe: (planId: PlanId) => void;
}

export default function PricingGlobal({ billingPeriod, isSubscribing, handleSubscribe }: PricingGlobalProps) {
  const FeatureRow = ({ enabled, children, popular }: { enabled: boolean; children: React.ReactNode; popular?: boolean }) => (
    <div className="flex items-center gap-3 py-2">
      {enabled ? (
        <Check className={cn("h-5 w-5 flex-shrink-0", popular ? "text-black" : "text-indigo-500")} strokeWidth={3} />
      ) : (
        <X className="h-5 w-5 text-gray-300 flex-shrink-0" strokeWidth={2} />
      )}
      <span className={cn("text-base font-medium", enabled ? (popular ? "text-black" : "text-ink") : "text-ink/40")}>
        {children}
      </span>
    </div>
  );

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter leading-[0.9] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-ink to-ink/40">
            Create Viral Content with AI
          </h1>
          <p className="text-xl md:text-3xl font-medium text-ink/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Generate titles, thumbnails, descriptions & tags in seconds — backed by real-time data.
          </p>
          
          <div className="flex flex-col items-center gap-8">
            <button 
              onClick={() => handleSubscribe('premium')}
              className="group relative bg-secondary text-black px-16 py-7 rounded-3xl font-display font-black text-3xl shadow-2xl shadow-secondary/20 hover:shadow-secondary/40 transition-all hover:-translate-y-1 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">Start Free Trial →</span>
            </button>
            <p className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-ink/20">
              No credit card required • Cancel anytime
            </p>
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800/50">
            <p className="text-[10px] font-display font-black uppercase tracking-[0.4em] text-ink/10 mb-8">Trusted by creators worldwide</p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-20 grayscale hover:opacity-40 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube" className="h-6" referrerPolicy="no-referrer" />
              <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok" className="h-6" referrerPolicy="no-referrer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="h-6" referrerPolicy="no-referrer" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {['free', 'premium', 'pro'].map((id, index) => {
          const plan = PLANS[id as PlanId];
          const price = billingPeriod === 'yearly' 
            ? getYearlyPriceUSD(plan) 
            : plan.price.USD;
          
          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-12 flex flex-col rounded-[3rem] border transition-all duration-500 group",
                plan.popular 
                  ? "bg-slate-900 border-secondary shadow-2xl shadow-secondary/10" 
                  : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-secondary text-black px-6 py-2.5 rounded-full font-display font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-secondary/20 flex items-center gap-2">
                  <Crown className="h-4 w-4 fill-black" />
                  Most Popular
                </div>
              )}
              
              <div className="mb-10">
                <h3 className={cn(
                  "text-3xl font-display font-black uppercase tracking-tight mb-3",
                  plan.popular ? "text-secondary" : "text-ink"
                )}>{plan.name}</h3>
                <p className="font-medium text-sm text-ink/40 leading-relaxed h-10">
                  {plan.description}
                </p>
              </div>

              <div className="mb-10">
                <motion.div 
                  key={billingPeriod}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-6xl font-display font-black tracking-tighter text-ink">${price}</span>
                  <span className="text-sm font-display font-black uppercase tracking-widest text-ink/20">
                    /{billingPeriod === 'yearly' ? 'yr' : 'mo'}
                  </span>
                </motion.div>
                {billingPeriod === 'yearly' && plan.price.USD > 0 && (
                  <div className="mt-4 flex flex-col gap-1">
                    <div className="text-[10px] font-display font-black text-green-500/80 uppercase tracking-widest bg-green-500/5 px-3 py-1.5 rounded-lg border border-green-500/10 inline-block w-fit">
                      Save ${Math.round(plan.price.USD * 12 - price)} / Year
                    </div>
                    <div className="text-[10px] font-bold text-ink/10 line-through tracking-widest px-1">
                      ${plan.price.USD * 12}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-12 flex-1">
                <FeatureRow enabled={true} popular={plan.popular}>
                  <span className="font-black">{plan.credits.monthly === -1 ? 'Unlimited' : `${plan.credits.monthly}`}</span> credits per month
                </FeatureRow>
                <FeatureRow enabled={plan.features.adFree} popular={plan.popular}>Ad-free experience</FeatureRow>
                <FeatureRow enabled={plan.features.thumbnailImages.enabled} popular={plan.popular}>AI Thumbnail Generator</FeatureRow>
                <FeatureRow enabled={plan.features.viralScore} popular={plan.popular}>Viral Score Prediction</FeatureRow>
                <FeatureRow enabled={plan.features.prioritySupport} popular={plan.popular}>Priority Support</FeatureRow>
                {plan.id === 'pro' && <FeatureRow enabled={true} popular={plan.popular}>API Access & Team Seats</FeatureRow>}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isSubscribing === plan.id}
                className={cn(
                  "w-full py-5 rounded-2xl font-display font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3",
                  plan.popular 
                    ? "bg-secondary text-black shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-1" 
                    : "bg-slate-800 text-ink hover:bg-slate-700 hover:-translate-y-1",
                  isSubscribing === plan.id && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubscribing === plan.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  plan.id === 'free' ? 'Get Started' : 'Start Free Trial'
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Trust Signals */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-8 text-ink">Loved by 50,000+ creators worldwide</h2>
              <p className="text-lg text-ink/40 mb-12 leading-relaxed">CreatorBoost is the secret weapon for top creators across YouTube, TikTok, and Instagram. Join the community and start growing today.</p>
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-[10px] font-display font-black uppercase tracking-widest text-ink/60">GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-[10px] font-display font-black uppercase tracking-widest text-ink/60">Global Support</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-[10px] font-display font-black uppercase tracking-widest text-ink/60">Secure Payments</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {[
                { name: "Alex Rivera", channel: "Tech Insider", text: "The AI thumbnail suggestions are a game changer. My CTR increased by 24% in the first month." },
                { name: "Sarah Chen", channel: "Creative Cooking", text: "Finally a tool that understands YouTube trends. The title generator is scary good!" }
              ].map((t, i) => (
                <div key={i} className="p-8 bg-slate-950/50 border border-slate-800 rounded-[2.5rem] hover:border-secondary/20 transition-all group">
                  <p className="text-lg italic mb-8 text-ink/60 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center font-display font-black text-secondary group-hover:bg-secondary group-hover:text-black transition-all">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-ink leading-none mb-1">{t.name}</p>
                      <p className="text-[10px] font-display font-black text-ink/20 uppercase tracking-widest">{t.channel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="text-center pb-20">
        <p className="text-[10px] font-display font-black uppercase tracking-[0.4em] text-ink/10 mb-10">Secure payment via</p>
        <div className="flex justify-center items-center gap-12 opacity-20 grayscale hover:opacity-40 transition-opacity">
          <CreditCard className="h-10 w-10" />
          <Apple className="h-10 w-10" />
          <Globe className="h-10 w-10" />
          <ShieldCheck className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}
