import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Loader2, CheckCircle2, AlertCircle, Sparkles, Zap } from 'lucide-react';
import { addCreditFromAd } from '../../lib/credits-client';
import { cn } from '../../lib/utils';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreditEarned?: () => void;
}

type AdStatus = 'idle' | 'loading' | 'watching' | 'completed' | 'error';

export default function RewardedAdModal({ isOpen, onClose, onCreditEarned }: RewardedAdModalProps) {
  const [adStatus, setAdStatus] = useState<AdStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalAdTime, setTotalAdTime] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adStatus === 'watching' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (adStatus === 'watching' && timeLeft === 0) {
      handleAdComplete();
    }
    return () => clearInterval(timer);
  }, [adStatus, timeLeft]);

  const handleStartAd = async () => {
    setAdStatus('loading');
    // Randomize duration between 30 and 60 seconds
    const duration = Math.floor(Math.random() * (60 - 30 + 1)) + 30;
    setTotalAdTime(duration);
    
    // Simulate ad loading
    setTimeout(() => {
      setAdStatus('watching');
      setTimeLeft(duration);
    }, 1500);
  };

  const handleAdComplete = () => {
    const result = addCreditFromAd();
    if (result.success) {
      setAdStatus('completed');
      onCreditEarned?.();
      setTimeout(() => {
        onClose();
        setAdStatus('idle');
      }, 2000);
    } else {
      setAdStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center z-[100]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={cn(
            "relative overflow-hidden transition-all duration-500",
            adStatus === 'watching' 
              ? "w-full h-full rounded-0" 
              : "bg-slate-900 border border-slate-800 shadow-2xl w-full max-w-md rounded-[2.5rem]"
          )}
        >
          {/* Ad Content (Full Screen) */}
          {adStatus === 'watching' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
              {/* Simulated Video Background */}
              <div className="absolute inset-0 opacity-40">
                <img 
                  src="https://picsum.photos/seed/advertising/1920/1080" 
                  className="w-full h-full object-cover"
                  alt="Ad Background"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
              </div>

              {/* Ad Overlay */}
              <div className="relative z-10 text-center px-6 max-w-lg">
                <div className="mb-8 inline-block p-4 bg-primary/20 rounded-3xl backdrop-blur-xl border border-primary/30 animate-pulse">
                  <Sparkles className="w-12 h-12 text-primary fill-primary" />
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-white mb-4">
                  Amazing Product
                </h2>
                <p className="text-xl text-slate-300 font-medium mb-12">
                  Experience the future of creativity with our premium tools.
                </p>
                
                {/* Timer Circle */}
                <div className="relative w-24 h-24 mx-auto mb-12">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-800"
                    />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: totalAdTime, ease: "linear" }}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-display font-black text-2xl text-white">
                    {timeLeft}
                  </div>
                </div>

                <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                  <p className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-primary">
                    Reward will be granted in {timeLeft} seconds
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-900">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: totalAdTime, ease: 'linear' }}
                  className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)]"
                />
              </div>
            </div>
          )}

          {/* Modal Content (Idle, Loading, Completed) */}
          {adStatus !== 'watching' && (
            <div className="p-8 text-center">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon Header */}
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all opacity-50" />
                  {adStatus === 'completed' ? (
                    <CheckCircle2 className="w-10 h-10 text-primary relative z-10" />
                  ) : adStatus === 'error' ? (
                    <AlertCircle className="w-10 h-10 text-red-500 relative z-10" />
                  ) : (
                    <Play className="w-10 h-10 text-primary relative z-10 fill-primary" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white">
                  {adStatus === 'idle' && "Earn Free Credit"}
                  {adStatus === 'loading' && "Loading ad..."}
                  {adStatus === 'completed' && "+1 Credit Added!"}
                  {adStatus === 'error' && "Daily Limit Reached"}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {adStatus === 'idle' && (
                    <>Watch a full-screen video to earn <span className="text-primary font-bold">1 generation credit</span>. You can earn up to 5 extra credits daily!</>
                  )}
                  {adStatus === 'loading' && "Preparing your immersive ad experience..."}
                  {adStatus === 'completed' && "Your credit has been added to your local wallet. Happy generating!"}
                  {adStatus === 'error' && "You've reached the maximum daily limit for ad-based credits. Come back tomorrow!"}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {adStatus === 'idle' && (
                  <button
                    onClick={handleStartAd}
                    className="w-full bg-primary text-black py-5 rounded-2xl font-display font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    Start Watching
                  </button>
                )}

                {adStatus === 'loading' && (
                  <div className="w-full py-5 flex items-center justify-center gap-3 text-slate-500 font-display font-black uppercase tracking-widest text-[10px]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading ad...
                  </div>
                )}

                {adStatus === 'completed' && (
                  <div className="w-full py-5 bg-primary/10 text-primary rounded-2xl font-display font-black uppercase tracking-widest text-[10px] border border-primary/20 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 fill-primary" />
                    +1 Credit Added
                  </div>
                )}

                {adStatus === 'error' && (
                  <button
                    onClick={onClose}
                    className="w-full bg-slate-800 text-white py-5 rounded-2xl font-display font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-all"
                  >
                    Try Later
                  </button>
                )}

                {adStatus === 'idle' && (
                  <button
                    onClick={onClose}
                    className="w-full py-3 text-slate-500 hover:text-slate-300 text-[10px] font-display font-black uppercase tracking-widest transition-all"
                  >
                    Maybe Later
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Footer Decoration */}
          {adStatus !== 'watching' && (
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-20" />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
