import { useState } from 'react';
import React from 'react';
import { Search, Loader2, TrendingUp, AlertCircle, Copy, Check, Sparkles, Download, Share2, Trash2, Star } from 'lucide-react';
import { analyzeCompetitor, type CompetitorAnalysis } from '../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCredits } from '../hooks/useCredits';

import RewardedAdModal from './ads/RewardedAdModal';
import ErrorState from './ErrorState';

export default function Competitor() {
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<CompetitorAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{id: string; title: string; results: CompetitorAnalysis; timestamp: number}>>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [error, setError] = useState<{ title: string; message: string; retry: () => void } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showHistory, setShowHistory] = useState(false);
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

  const handleSaveToHistory = () => {
    if (!results) return;
    const analysisId = crypto.randomUUID();
    setAnalysisHistory(prev => [{
      id: analysisId,
      title,
      results,
      timestamp: Date.now()
    }, ...prev]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExportAnalysis = () => {
    if (!results) return;
    const exportData = {
      title,
      timestamp: new Date().toISOString(),
      betterTitles: results.betterTitles,
      betterThumbnailTexts: results.betterThumbnailTexts,
      ctrSuggestions: results.ctrSuggestions
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `competitor-analysis-${title.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* Action Buttons for Results */}
      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 justify-center p-6 bg-slate-900/30 border border-slate-800 rounded-2xl"
        >
          <button
            onClick={handleSaveToHistory}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-display font-black uppercase text-xs tracking-wider rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1"
          >
            <Sparkles className="w-4 h-4" />
            Save Analysis
          </button>
          <button
            onClick={handleExportAnalysis}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-black font-display font-black uppercase text-xs tracking-wider rounded-xl hover:shadow-lg hover:shadow-secondary/20 transition-all hover:-translate-y-1"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            onClick={() => {
              const shareText = `Check out this competitor analysis:\n${title}\n\nBetter alternatives: ${results.betterTitles.join(', ')}\n\nGenerated with CreatorBoost AI`;
              navigator.clipboard.writeText(shareText);
              setCopiedText('share');
              setTimeout(() => setCopiedText(null), 2000);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-tertiary text-black font-display font-black uppercase text-xs tracking-wider rounded-xl hover:shadow-lg hover:shadow-tertiary/20 transition-all hover:-translate-y-1"
          >
            <Share2 className="w-4 h-4" />
            Copy to Share
          </button>
          {analysisHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-ink font-display font-black uppercase text-xs tracking-wider rounded-xl border border-slate-700 hover:border-primary transition-all"
            >
              <Sparkles className="w-4 h-4" />
              History ({analysisHistory.length})
            </button>
          )}
        </motion.div>
      )}

      {/* Analysis History */}
      {showHistory && analysisHistory.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 p-6 bg-slate-900/30 border border-slate-800 rounded-2xl"
        >
          <h3 className="text-lg font-display font-black uppercase tracking-tight text-primary mb-4">Recent Analyses</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {analysisHistory.map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => {
                  setResults(analysis.results);
                  setTitle(analysis.title);
                  setShowHistory(false);
                }}
                className="w-full p-4 bg-slate-950/50 border border-slate-800 rounded-xl text-left hover:border-primary hover:bg-slate-900 transition-all group flex items-start justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink truncate group-hover:text-primary transition-colors">{analysis.title}</p>
                  <p className="text-xs text-ink/40 mt-1">{new Date(analysis.timestamp).toLocaleString()}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(analysis.id);
                  }}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ml-2 ${
                    favorites.has(analysis.id)
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-slate-900 text-slate-400 hover:text-yellow-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${favorites.has(analysis.id) && 'fill-current'}`} />
                </button>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <RewardedAdModal 
        isOpen={showAdModal} 
        onClose={() => setShowAdModal(false)} 
      />
    </div>
  );
}
