import React from 'react';
import { Check, X, Crown, Zap, Loader2, ShieldCheck, Smartphone, MessageCircle } from 'lucide-react';
import { PLANS, PlanId, getYearlyPrice } from '../../config/pricing';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface PricingBDProps {
  billingPeriod: 'monthly' | 'yearly';
  isSubscribing: string | null;
  handleSubscribe: (planId: PlanId) => void;
}

export default function PricingBD({ billingPeriod, isSubscribing, handleSubscribe }: PricingBDProps) {
  const FeatureRow = ({ enabled, children, popular }: { enabled: boolean; children: React.ReactNode; popular?: boolean }) => (
    <div className="flex items-center gap-3 py-2">
      {enabled ? (
        <Check className={cn("h-5 w-5 flex-shrink-0", popular ? "text-black" : "text-green-500")} strokeWidth={3} />
      ) : (
        <X className="h-5 w-5 text-gray-300 flex-shrink-0" strokeWidth={2} />
      )}
      <span className={cn("text-base font-medium font-bangla", enabled ? (popular ? "text-black" : "text-ink") : "text-ink/40")}>
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
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-8xl font-bangla font-black leading-[1.1] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-ink to-ink/40">
            ভিডিও ভাইরাল করতে চান?
          </h1>
          <p className="text-xl md:text-3xl font-bangla font-medium text-ink/60 mb-10">
            AI দিয়ে তৈরি করুন পারফেক্ট টাইটেল + থাম্বনেইল — ৩০ সেকেন্ডে
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-3 bg-slate-900/50 px-6 py-3 border border-slate-800 rounded-2xl backdrop-blur-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/BKash_Logo.svg/512px-BKash_Logo.svg.png" alt="bKash" className="h-6 grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
              <span className="font-display font-black text-[10px] uppercase tracking-widest text-ink/40">bKash</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 px-6 py-3 border border-slate-800 rounded-2xl backdrop-blur-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nagad_Logo.svg/512px-Nagad_Logo.svg.png" alt="Nagad" className="h-6 grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
              <span className="font-display font-black text-[10px] uppercase tracking-widest text-ink/40">Nagad</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 px-6 py-3 border border-slate-800 rounded-2xl backdrop-blur-sm">
              <ShieldCheck className="h-6 w-6 text-green-500/50" />
              <span className="font-display font-black text-[10px] uppercase tracking-widest text-ink/40">SSLCommerz</span>
            </div>
          </div>

          <button 
            onClick={() => handleSubscribe('premium')}
            className="group relative bg-primary text-black px-12 py-6 rounded-3xl font-bangla font-black text-3xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">ফ্রি ট্রায়াল শুরু করুন →</span>
            <span className="block text-xs mt-1 font-bold opacity-70 relative z-10 uppercase tracking-widest">No Credit Card Required</span>
          </button>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {['free', 'premium', 'pro'].map((id, index) => {
          const plan = PLANS[id as PlanId];
          const price = billingPeriod === 'yearly' 
            ? getYearlyPrice(plan) 
            : plan.price.BDT;
          
          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-10 flex flex-col rounded-[3rem] border transition-all duration-500 group",
                plan.popular 
                  ? "bg-slate-900 border-primary shadow-2xl shadow-primary/10" 
                  : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-black px-6 py-2.5 rounded-full font-display font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center gap-2">
                  <Crown className="h-4 w-4 fill-black" />
                  Most Popular
                </div>
              )}
              
              <div className="mb-10">
                <h3 className={cn(
                  "text-3xl font-display font-black uppercase tracking-tight mb-3",
                  plan.popular ? "text-primary" : "text-ink"
                )}>{plan.name}</h3>
                <p className="font-bangla font-medium text-sm text-ink/40 leading-relaxed">
                  {plan.id === 'free' ? 'শুরু করার জন্য পারফেক্ট' : plan.id === 'premium' ? 'সেরা ভ্যালু গ্রোয়িং ক্রিয়েটরদের জন্য' : 'সিরিয়াস কন্টেন্ট ক্রিয়েটরদের জন্য'}
                </p>
              </div>

              <div className="mb-10">
                <motion.div 
                  key={billingPeriod}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-6xl font-display font-black tracking-tighter text-ink">৳{price.toLocaleString()}</span>
                  <span className="text-sm font-display font-black uppercase tracking-widest text-ink/20">
                    /{billingPeriod === 'yearly' ? 'Year' : 'Month'}
                  </span>
                </motion.div>
                {billingPeriod === 'yearly' && plan.price.BDT > 0 && (
                  <div className="mt-4 flex flex-col gap-1">
                    <div className="text-[10px] font-display font-black text-green-500/80 uppercase tracking-widest bg-green-500/5 px-3 py-1.5 rounded-lg border border-green-500/10 inline-block w-fit">
                      Save ৳{(plan.price.BDT * 12 - price).toLocaleString()} / Year
                    </div>
                    <div className="text-[10px] font-bold text-ink/10 line-through tracking-widest px-1">
                      ৳{(plan.price.BDT * 12).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-12 flex-1">
                <FeatureRow enabled={true} popular={plan.popular}>{plan.credits.monthly === -1 ? 'আনলিমিটেড' : `${plan.credits.monthly}`} ক্রেডিট/মাস</FeatureRow>
                <FeatureRow enabled={plan.features.adFree} popular={plan.popular}>অ্যাড-ফ্রি এক্সপেরিয়েন্স</FeatureRow>
                <FeatureRow enabled={plan.features.thumbnailImages.enabled} popular={plan.popular}>AI থাম্বনেইল জেনারেটর</FeatureRow>
                <FeatureRow enabled={plan.features.viralScore} popular={plan.popular}>ভাইরাল স্কোর প্রেডিকশন</FeatureRow>
                <FeatureRow enabled={plan.features.prioritySupport} popular={plan.popular}>২৪/৭ প্রায়োরিটি সাপোর্ট</FeatureRow>
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isSubscribing === plan.id}
                className={cn(
                  "w-full py-5 rounded-2xl font-display font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3",
                  plan.popular 
                    ? "bg-primary text-black shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1" 
                    : "bg-slate-800 text-ink hover:bg-slate-700 hover:-translate-y-1",
                  isSubscribing === plan.id && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubscribing === plan.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  plan.id === 'free' ? 'Get Started' : 'Upgrade Now'
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Trust & Social Proof */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-6xl font-bangla font-black mb-6">১০,০০০+ বাংলাদেশী ক্রিয়েটর ব্যবহার করছেন</h2>
            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map(i => <Zap key={i} className="h-8 w-8 text-primary fill-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
            {[
              { name: "রাকিব হোসেন", niche: "Tech Reviewer", text: "এই টুলটা আমার থাম্বনেইল তৈরির সময় অনেক বাঁচিয়ে দিয়েছে। AI থাম্বনেইল আইডিয়াগুলো জাস্ট অসাধারণ!" },
              { name: "সুমাইয়া আক্তার", niche: "Cooking Channel", text: "টাইটেল জেনারেটরটা আমার ভিডিওর ভিউ বাড়াতে অনেক সাহায্য করেছে। এখন ভিডিও ভাইরাল হওয়া সহজ।" },
              { name: "ফয়সাল আহমেদ", niche: "Vlogger", text: "বিকাশে পেমেন্ট করার সুবিধা থাকায় আমার জন্য সাবস্ক্রিপশন নেয়া অনেক সহজ হয়েছে। ধন্যবাদ থাম্বম্যাজিক!" }
            ].map((t, i) => (
              <div key={i} className="p-8 bg-slate-950/50 border border-slate-800 rounded-[2.5rem] hover:border-primary/20 transition-all group">
                <p className="font-bangla italic mb-8 text-ink/60 leading-relaxed text-lg">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center font-display font-black text-primary group-hover:bg-primary group-hover:text-black transition-all">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bangla font-bold text-ink leading-none mb-1">{t.name}</p>
                    <p className="text-[10px] font-display font-black text-ink/20 uppercase tracking-widest">{t.niche}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-12 border-t border-slate-800 pt-12 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-green-500" />
              </div>
              <span className="font-bangla font-bold text-ink/60">৭-দিন মানি-ব্যাক গ্যারান্টি</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bangla font-bold text-ink/60">বিকাশ/নগদ পেমেন্ট সাপোর্ট</span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Support */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-10 right-10 z-50"
      >
        <a 
          href="https://wa.me/yournumber" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-[#25D366] text-white px-8 py-5 rounded-full shadow-2xl shadow-[#25D366]/20 hover:scale-105 hover:shadow-[#25D366]/40 transition-all active:scale-95 group"
        >
          <MessageCircle className="h-6 w-6 fill-white group-hover:rotate-12 transition-transform" />
          <span className="font-bangla font-black text-lg">প্রশ্ন থাকলে মেসেজ করুন</span>
        </a>
      </motion.div>
    </div>
  );
}
