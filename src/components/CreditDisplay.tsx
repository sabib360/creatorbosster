import { useState } from 'react';
import { Zap, Play, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCredits } from '../hooks/useCredits';
import RewardedAdModal from './ads/RewardedAdModal';
import { cn } from '../lib/utils';

export default function CreditDisplay({ id }: { id?: string }) {
  const { profile, user } = useAuth();
  const { credits, adsWatchedToday, maxAdsPerDay, isLoading } = useCredits();
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  
  const remainingAds = maxAdsPerDay - adsWatchedToday;
  const canWatchMoreAds = remainingAds > 0;

  const maxCredits = user && profile ? (
    profile.plan_id === 'agency' ? 9999 : 
    profile.plan_id === 'pro' ? 500 : 
    profile.plan_id === 'premium' ? 100 : 3
  ) : 3; // Default for local/guest
  
  const usagePercentage = Math.min(100, (credits / maxCredits) * 100);
  
  if (isLoading) {
    return (
      <div id={id} className="brutal-card p-4 animate-pulse bg-surface/50 h-24 mb-8" />
    );
  }

  return (
    <div id={id} className="space-y-6 mb-10">
      {/* Credits Counter */}
      <div className={cn(
        "p-6 rounded-[2rem] flex items-center justify-between bg-slate-900/50 border border-slate-800 backdrop-blur-xl relative overflow-hidden group",
        credits === 0 && "border-red-500/50"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 duration-500",
            credits === 0 ? "bg-red-500 shadow-red-500/20" : "bg-primary shadow-primary/20"
          )}>
            <Zap className="w-8 h-8 text-black fill-black" />
          </div>
          <div>
            <div className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-ink/40 mb-1">Available Credits</div>
            <div className={cn("text-4xl font-display font-black tracking-tighter", credits === 0 ? "text-red-500" : "text-ink")}>
              {credits} <span className="text-xl text-ink/20">/ {maxCredits}</span>
            </div>
          </div>
        </div>
        <div className="text-right relative z-10">
          <div className="text-xs font-display font-black uppercase tracking-widest text-primary mb-1">{profile?.plan_id || 'Free'} Plan</div>
          <div className="text-[10px] font-bold text-green-500/80 uppercase tracking-widest">+{adsWatchedToday} from ads</div>
        </div>
      </div>

      {/* Credit Usage Progress */}
      <div className="p-6 bg-slate-900/30 border border-slate-800/50 rounded-[2rem] space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-ink/40">Usage Intensity</span>
          <span className="text-sm font-display font-black text-ink">{Math.round(usagePercentage)}%</span>
        </div>
        <div className="h-4 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-1">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${usagePercentage}%` }}
            className={cn(
              "h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-primary via-secondary to-tertiary shadow-[0_0_20px_rgba(var(--primary),0.3)]",
              usagePercentage > 90 && "from-red-500 to-orange-500 shadow-red-500/30"
            )}
          />
        </div>
      </div>

      {/* Ad Progress */}
      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Award className="w-24 h-24 text-secondary" />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-sm font-display font-black uppercase tracking-widest text-ink">Daily Bonus</span>
          </div>
          <span className="text-xs font-bold text-ink/40 uppercase tracking-widest">
            {adsWatchedToday} / {maxAdsPerDay} Collected
          </span>
        </div>

        <div className="h-2 w-full bg-slate-950 border border-slate-800 rounded-full overflow-hidden relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(adsWatchedToday / maxAdsPerDay) * 100}%` }}
            className="h-full bg-secondary shadow-[0_0_15px_rgba(var(--secondary),0.3)]"
          />
        </div>

        <button
          onClick={() => setIsAdModalOpen(true)}
          disabled={!canWatchMoreAds}
          className={cn(
            "w-full py-5 rounded-2xl font-display font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all relative z-10",
            canWatchMoreAds
              ? 'bg-secondary text-black shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-1 active:scale-[0.98]' 
              : 'bg-slate-800 text-ink/20 border border-slate-700 cursor-not-allowed'
          )}
        >
          <Play className={cn("w-4 h-4", canWatchMoreAds ? 'fill-black' : 'fill-ink/20')} />
          <span>
            {canWatchMoreAds 
              ? `Watch Ad (+1 Credit)`
              : 'Daily Limit Reached'}
          </span>
        </button>
        
        {!canWatchMoreAds && (
          <p className="text-[10px] text-center font-black text-ink/30 uppercase tracking-[0.3em] relative z-10">
            Come back tomorrow for more!
          </p>
        )}
      </div>

      <RewardedAdModal 
        isOpen={isAdModalOpen} 
        onClose={() => setIsAdModalOpen(false)} 
      />
    </div>
  );
}
