import React, { useState } from 'react';
import { Crown, Globe, MapPin } from 'lucide-react';
import { PlanId } from '../config/pricing';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import PricingBD from './pricing/PricingBD';
import PricingGlobal from './pricing/PricingGlobal';
import CheckoutModal from './CheckoutModal';

export default function Pricing({ onSelectPlan }: { onSelectPlan?: (planId: PlanId, region: 'BD' | 'Global') => void }) {
  const { user, login } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
  const [region, setRegion] = useState<'BD' | 'Global'>('BD');
  const [showCheckout, setShowCheckout] = useState<{ planId: PlanId; billingPeriod: 'monthly' | 'yearly'; region: 'BD' | 'Global' } | null>(null);

  const handleSubscribe = async (planId: PlanId) => {
    if (planId === 'free') return;
    
    if (!user) {
      if (confirm("You need to be logged in to upgrade. Login now?")) {
        login();
      }
      return;
    }

    setShowCheckout({ planId, billingPeriod, region });
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(null);
    // No reload needed! AuthContext handles real-time sync via onSnapshot
  };

  return (
    <div className="space-y-16 pb-32 max-w-7xl mx-auto">
      {/* Region & Billing Toggles */}
      <div className="flex flex-col items-center gap-10 sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl py-10 border-b border-slate-800/50">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-ink">Choose Your Plan</h2>
          <p className="text-ink/40 font-medium max-w-md mx-auto">Scale your content creation with AI-powered tools designed for growth.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-900 p-2 border border-slate-800 rounded-2xl shadow-2xl">
            <button 
              onClick={() => setRegion('BD')}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-xl font-display font-black uppercase tracking-widest text-xs transition-all",
                region === 'BD' ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-ink/40 hover:text-ink hover:bg-slate-800"
              )}
            >
              <MapPin className="h-4 w-4" />
              Bangladesh
            </button>
            <button 
              onClick={() => setRegion('Global')}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-xl font-display font-black uppercase tracking-widest text-xs transition-all",
                region === 'Global' ? "bg-secondary text-black shadow-lg shadow-secondary/20" : "text-ink/40 hover:text-ink hover:bg-slate-800"
              )}
            >
              <Globe className="h-4 w-4" />
              Global
            </button>
          </div>

          <div className="flex items-center p-1.5 bg-slate-900 border border-slate-800 rounded-2xl relative min-w-[300px]">
            <motion.div 
              className="absolute top-1.5 bottom-1.5 bg-slate-800 rounded-xl shadow-inner"
              initial={false}
              animate={{ 
                x: billingPeriod === 'monthly' ? 0 : '100%',
                width: '50%'
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{ left: 6, width: 'calc(50% - 6px)' }}
            />
            <button 
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                "relative z-10 flex-1 px-8 py-3.5 font-display font-black uppercase tracking-widest text-[10px] transition-colors duration-500",
                billingPeriod === 'monthly' ? "text-primary" : "text-ink/30 hover:text-ink/60"
              )}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingPeriod('yearly')}
              className={cn(
                "relative z-10 flex-1 px-8 py-3.5 font-display font-black uppercase tracking-widest text-[10px] transition-colors duration-500 flex items-center justify-center gap-2",
                billingPeriod === 'yearly' ? "text-primary" : "text-ink/30 hover:text-ink/60"
              )}
            >
              Yearly
              <span className={cn(
                "text-[9px] px-2 py-0.5 rounded-full border transition-colors",
                billingPeriod === 'yearly' ? "bg-primary/20 border-primary/30 text-primary" : "bg-slate-800 border-slate-700 text-ink/20"
              )}>
                -17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {region === 'BD' ? (
        <PricingBD 
          billingPeriod={billingPeriod} 
          isSubscribing={isSubscribing} 
          handleSubscribe={handleSubscribe} 
        />
      ) : (
        <PricingGlobal 
          billingPeriod={billingPeriod} 
          isSubscribing={isSubscribing} 
          handleSubscribe={handleSubscribe} 
        />
      )}

      <AnimatePresence>
        {showCheckout && user && (
          <CheckoutModal 
            planId={showCheckout.planId}
            billingPeriod={showCheckout.billingPeriod}
            region={showCheckout.region}
            userId={user.uid}
            onClose={() => setShowCheckout(null)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
