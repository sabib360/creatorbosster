import { useState } from 'react';
import React from 'react';
import { Search, Loader2, TrendingUp, AlertCircle, Copy, Check, Sparkles } from 'lucide-react';
import { analyzeCompetitor, type CompetitorAnalysis } from '../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCredits } from '../hooks/useCredits';
import AdBanner from './AdBanner';
import RewardedAdModal from './ads/RewardedAdModal';
import ErrorState from './ErrorState';

export default function Competitor() {
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CompetitorAnalysis | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [error, setError] = useState<{ title: string; message: string; retry: () => void } | null>(null);
  const { user } = useAuth();
  const { credits, useCredit } = useCredits();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // Check credits
    if (credits < 1) {
      setShowAdModal(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      // Consume credit
      const creditResult = await useCredit(1);
      if (!creditResult.success) {
        if (creditResult.reason === 'insufficient_credits') {
          setShowAdModal(true);
        }
        setIsAnalyzing(false);
        return;
      }

      // Call frontend Gemini API
      const data = await analyzeCompetitor(title);
      setResults(data);
    } catch (error: any) {
      console.error("Failed to analyze:", error);
      setError({
        title: "Analysis Failed",
        message: error.message || "We couldn't analyze this competitor title. Please check your connection and try again.",
        retry: () => handleAnalyze(e)
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-7xl font-display font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-ink via-ink/80 to-ink/50">
          YouTube Title & Thumbnail Competitor Analysis
        </h1>
        <p className="text-lg font-medium text-ink/70 border-l-4 border-secondary pl-4">
          Analyze competitor YouTube titles, get better alternatives powered by AI, and discover CTR optimization tips for thumbnails.
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <div className="mb-8">
            <ErrorState 
              title={error.title}
              message={error.message}
              onRetry={error.retry}
              onClose={() => setError(null)}
            />
          </div>
        )}
      </AnimatePresence>

      <form onSubmit={handleAnalyze} className="p-8 md:p-12 bg-slate-900/50 border border-slate-800 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <label htmlFor="title" className="block text-[10px] font-display font-black uppercase tracking-[0.3em] text-ink/40 mb-6 relative z-10">
          Competitor's Video Title
        </label>
        <div className="flex flex-col sm:flex-row gap-6 relative z-10">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., I Tried AI Side Hustles for 30 Days"
            className="flex-1 px-8 py-5 bg-slate-950 border border-slate-800 rounded-2xl text-lg font-bold text-ink placeholder:text-ink/20 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
            required
          />
          <button
            type="submit"
            disabled={isAnalyzing || !title.trim()}
            className="px-10 py-5 bg-secondary text-black font-display font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>Analyze</span>
          </button>
        </div>
      </form>

      <AdBanner className="h-24 opacity-50 grayscale hover:opacity-100 transition-all" />

      <AnimatePresence mode="wait">
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-10"
          >
            {/* Better Titles */}
            <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-[3rem] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <TrendingUp className="w-32 h-32 text-primary" />
              </div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-black uppercase tracking-tight text-ink">Better Titles</h2>
              </div>
              
              <ul className="space-y-4 relative z-10">
                {results.betterTitles.map((t, i) => (
                  <li key={i} className="flex items-start justify-between gap-6 p-6 bg-slate-950/50 border border-slate-800 rounded-[2rem] group/item hover:border-primary/30 transition-all">
                    <span className="text-ink/80 font-bold text-lg leading-relaxed">{t}</span>
                    <button
                      onClick={() => copyToClipboard(t)}
                      className="p-3 bg-slate-900 text-ink/40 hover:text-primary border border-slate-800 rounded-xl transition-all flex-shrink-0"
                    >
                      {copiedText === t ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              {/* Better Thumbnail Texts */}
              <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-[3rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <AlertCircle className="w-32 h-32 text-secondary" />
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-display font-black uppercase tracking-tight text-ink">Thumbnail Text</h2>
                </div>
                
                <div className="flex flex-wrap gap-4 relative z-10">
                  {results.betterThumbnailTexts.map((text, i) => (
                    <div 
                      key={i} 
                      className="px-6 py-4 bg-slate-950/50 text-ink/80 border border-slate-800 rounded-2xl font-display font-black uppercase tracking-widest text-xs flex items-center gap-4 group cursor-pointer hover:border-secondary/30 hover:-translate-y-1 transition-all" 
                      onClick={() => copyToClipboard(text)}
                    >
                      <span>{text}</span>
                      {copiedText === text ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-secondary" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTR Suggestions */}
              <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-[3rem] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles className="w-32 h-32 text-tertiary" />
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-tertiary" />
                  </div>
                  <h2 className="text-2xl font-display font-black uppercase tracking-tight text-ink">CTR Optimization</h2>
                </div>
                
                <ul className="space-y-4 relative z-10">
                  {results.ctrSuggestions.map((tip, i) => (
                    <li key={i} className="flex gap-6 p-6 bg-slate-950/50 border border-slate-800 rounded-[2rem] hover:border-tertiary/30 transition-all">
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-tertiary flex items-center justify-center flex-shrink-0 font-display font-black text-sm">
                        {i + 1}
                      </div>
                      <span className="text-ink/70 font-medium leading-relaxed pt-2">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RewardedAdModal 
        isOpen={showAdModal} 
        onClose={() => setShowAdModal(false)} 
      />
    </div>
  );
}
