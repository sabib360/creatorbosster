import { useState, useRef } from 'react';
import React from 'react';
import { Sparkles, Loader2, Copy, Check, Type, Hash, Image as ImageIcon, FileText, MessageSquare, ExternalLink, Video, Download, Share2, BarChart3, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { generateYoutubeIdeas, generateThumbnailImages, generateVideo, analyzeCTR, type YoutubeIdeas, type CTRAnalysis } from '../lib/gemini';
import { saveIdeasToHistory, addThumbnailsToHistory, updateThumbnailSelectionInHistory } from '../lib/history';
import { useCredits } from '../hooks/useCredits';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import NativeAd from './NativeAd';
import ThumbnailEditor from './ThumbnailEditor';
import CreditDisplay from './CreditDisplay';
import RewardedAdModal from './ads/RewardedAdModal';

import ErrorState from './ErrorState';

export default function Generator() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<YoutubeIdeas | null>(null);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'titles' | 'thumbnails' | 'hooks' | 'ideas' | 'description' | 'tags' | 'video' | 'analytics'>('titles');
  const [isAnalyzingCTR, setIsAnalyzingCTR] = useState(false);
  const [ctrAnalysis, setCtrAnalysis] = useState<CTRAnalysis | null>(null);
  const [generatingIndices, setGeneratingIndices] = useState<Set<number>>(new Set());
  const [generatedImages, setGeneratedImages] = useState<Record<number, string[]>>({});
  const [selectedVariation, setSelectedVariation] = useState<Record<number, number>>({});
  const [editingImage, setEditingImage] = useState<{ url: string; texts: string[] } | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const stopBatchRef = useRef(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 });
  const [error, setError] = useState<{ title: string; message: string; retry: () => void } | null>(null);

  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const { user } = useAuth();
  const { credits, useCredit, isLoading: creditsLoading } = useCredits();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    // Check credits first
    if (credits < 1) {
      setShowAdModal(true);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImages({}); // Reset images on new generation
    setSelectedVariation({}); // Reset selections on new generation
    setCtrAnalysis(null); // Reset analysis
    setCurrentHistoryId(null);
    try {
      // Consume credit
      const creditResult = await useCredit(1);
      if (!creditResult.success) {
        if (creditResult.reason === 'insufficient_credits') {
          setShowAdModal(true);
        }
        setIsGenerating(false);
        return;
      }

      // Call frontend Gemini API
      const data = await generateYoutubeIdeas(topic);
      setResults(data);
      setVideoPrompt(topic);
      setActiveTab('ideas'); // Default to Thumbnail Ideas as requested
      
      // Save to history
      const historyItem = await saveIdeasToHistory(topic, data, user?.uid);
      setCurrentHistoryId(historyItem.id);
    } catch (error: any) {
      console.error("Failed to generate ideas:", error);
      setError({
        title: "Generation Failed",
        message: error.message || "We couldn't generate ideas for this topic. This might be due to a temporary connection issue or content safety filters.",
        retry: () => handleGenerate(e)
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectVariation = async (ideaIndex: number, variationIndex: number, idea: string) => {
    setSelectedVariation(prev => ({ ...prev, [ideaIndex]: variationIndex }));
    
    if (currentHistoryId) {
      try {
        await updateThumbnailSelectionInHistory(currentHistoryId, idea, variationIndex, user?.uid);
      } catch (error) {
        console.error("Failed to update selection in history:", error);
      }
    }
  };

  const handleGenerateImage = async (idea: string, index: number) => {
    // Check credits
    if (credits < 1) {
      setShowAdModal(true);
      return;
    }

    setGeneratingIndices(new Set([index]));
    setError(null);
    try {
      // Consume credit
      const creditResult = await useCredit(1);
      if (!creditResult.success) {
        if (creditResult.reason === 'insufficient_credits') {
          setShowAdModal(true);
        }
        setGeneratingIndices(prev => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
        return;
      }

      // Call frontend Gemini API for images
      const images = await generateThumbnailImages(idea, 3);
      setGeneratedImages(prev => ({ ...prev, [index]: images }));
      setSelectedVariation(prev => ({ ...prev, [index]: 0 }));
      
      // Save to history
      if (currentHistoryId) {
        await addThumbnailsToHistory(currentHistoryId, idea, images, user?.uid);
      }
    } catch (error: any) {
      console.error("Failed to generate image:", error);
      setError({
        title: "Image Generation Failed",
        message: error.message || "We couldn't create the thumbnail previews. Please try again in a moment.",
        retry: () => handleGenerateImage(idea, index)
      });
    } finally {
      setGeneratingIndices(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const handleGenerateAllThumbnails = async () => {
    if (!results || results.thumbnailIdeas.length === 0) return;
    
    const ideasToGenerate = results.thumbnailIdeas
      .map((idea, index) => ({ idea, index }))
      .filter(({ index }) => !generatedImages[index]);

    if (ideasToGenerate.length === 0) {
      alert("All thumbnails are already generated!");
      return;
    }

    if (credits < ideasToGenerate.length) {
      alert(`You don't have enough credits! You need ${ideasToGenerate.length} credits but only have ${credits}.`);
      return;
    }

    setIsGeneratingAll(true);
    stopBatchRef.current = false;
    setBatchProgress({ current: 0, total: ideasToGenerate.length, success: 0, failed: 0 });
    
    // Parallel execution with concurrency limit of 2
    const concurrencyLimit = 2;
    const queue = [...ideasToGenerate];
    let activeCount = 0;
    let finishedCount = 0;
    let successCount = 0;
    let failedCount = 0;

    const processNext = async () => {
      if (queue.length === 0 || stopBatchRef.current) return;

      const { idea, index } = queue.shift()!;
      activeCount++;
      setGeneratingIndices(prev => new Set(prev).add(index));

      try {
        // Consume credit for each image in batch
        const creditResult = await useCredit(1);
        if (!creditResult.success) {
          if (creditResult.reason === 'insufficient_credits') {
            setShowAdModal(true);
            stopBatchRef.current = true;
          }
          throw new Error('Insufficient credits');
        }

        // Call frontend Gemini API for images
        const images = await generateThumbnailImages(idea, 3);
        
        setGeneratedImages(prev => ({ ...prev, [index]: images }));
        setSelectedVariation(prev => ({ ...prev, [index]: 0 }));
        successCount++;
        if (currentHistoryId) {
          await addThumbnailsToHistory(currentHistoryId, idea, images, user?.uid);
        }
      } catch (error) {
        console.error(`Failed to generate image for idea ${index}:`, error);
        failedCount++;
      } finally {
        activeCount--;
        finishedCount++;
        setGeneratingIndices(prev => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
        setBatchProgress(prev => ({ 
          ...prev, 
          current: finishedCount, 
          success: successCount, 
          failed: failedCount 
        }));
        await processNext();
      }
    };

    const workers = Array.from({ length: Math.min(concurrencyLimit, ideasToGenerate.length) }, () => processNext());
    await Promise.all(workers);
    
    setIsGeneratingAll(false);
    
    if (failedCount > 0) {
      alert(`Batch generation complete. ${successCount} succeeded, ${failedCount} failed.`);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    
    // Check credits (video costs 2 credits)
    if (credits < 2) {
      setShowAdModal(true);
      return;
    }

    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setError(null);
    try {
      // Consume credits
      const creditResult = await useCredit(2);
      if (!creditResult.success) {
        if (creditResult.reason === 'insufficient_credits') {
          setShowAdModal(true);
        }
        setIsGeneratingVideo(false);
        return;
      }

      // Call frontend Gemini API for video
      const videoUrl = await generateVideo(videoPrompt);
      setGeneratedVideoUrl(videoUrl);
    } catch (error: any) {
      console.error("Failed to generate video:", error);
      setError({
        title: "Video Generation Failed",
        message: error.message || "The AI video generator is currently busy or encountered an error. Please try again later.",
        retry: () => handleGenerateVideo()
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleAnalyzeCTR = async () => {
    if (!results) return;
    
    // Check credits
    if (credits < 1) {
      setShowAdModal(true);
      return;
    }

    setIsAnalyzingCTR(true);
    setError(null);
    try {
      // Consume credit
      const creditResult = await useCredit(1);
      if (!creditResult.success) {
        if (creditResult.reason === 'insufficient_credits') {
          setShowAdModal(true);
        }
        setIsAnalyzingCTR(false);
        return;
      }

      // Call frontend Gemini API for CTR analysis
      const analysis = await analyzeCTR(results);
      setCtrAnalysis(analysis);
      setResults(prev => prev ? { ...prev, ctrAnalysis: analysis } : null);
    } catch (error: any) {
      console.error("Failed to analyze CTR:", error);
      setError({
        title: "Analysis Failed",
        message: error.message || "We couldn't analyze the CTR for these ideas. Please try again.",
        retry: () => handleAnalyzeCTR()
      });
    } finally {
      setIsAnalyzingCTR(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleShare = (text: string) => {
    const url = window.location.origin;
    const shareText = `${text}\n\nGenerated with CreatorBoost AI!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'CreatorBoost AI',
        text: shareText,
        url: url,
      }).catch(console.error);
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const CopyButton = ({ text }: { text: string }) => (
    <button
      onClick={() => copyToClipboard(text)}
      className="p-2 text-ink hover:bg-primary hover:text-black brutal-border rounded-lg transition-colors bg-surface"
      title="Copy to clipboard"
    >
      {copiedText === text ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
    </button>
  );

  const ShareButton = ({ text }: { text: string }) => (
    <button
      onClick={() => handleShare(text)}
      className="p-2 text-blue-500 hover:bg-blue-50 brutal-border rounded-lg transition-colors bg-surface"
      title="Share this idea"
    >
      <Share2 className="w-5 h-5" />
    </button>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -left-4 top-0 w-1 h-12 bg-primary rounded-full hidden md:block" />
        <h1 className="text-4xl md:text-7xl font-display font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-ink via-ink/80 to-ink/50">
          Free YouTube Title & Thumbnail Generator
        </h1>
        <p className="text-lg md:text-xl font-medium text-ink/70 max-w-2xl">
          AI-powered YouTube title generator & thumbnail maker. Generate viral titles, professional thumbnails, and engaging descriptions in seconds. Increase CTR & views.
        </p>
      </motion.div>

      {/* Homepage Description - Only show when no results */}
      {!results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950/50 backdrop-blur-xl p-6 md:p-8 space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight text-primary flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Why Creator Booster AI?
            </h2>
            
            <div className="space-y-4 text-ink/80 leading-relaxed text-base md:text-lg">
              <p>
                <strong className="text-ink">YouTube content creation is harder than ever.</strong> With millions of creators competing for attention, your titles, thumbnails, and descriptions need to be exceptional. Most creators waste hours brainstorming, designing, and optimizing—only to get mediocre results.
              </p>
              
              <p>
                <strong className="text-primary">Creator Booster AI changes everything.</strong> Our AI-powered platform generates viral YouTube titles, SEO-optimized descriptions, and professional thumbnail concepts in seconds. We analyze patterns from millions of successful videos to understand what actually works.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-display font-bold text-sm uppercase tracking-wide text-primary">30% Higher CTR</div>
                      <p className="text-sm text-ink/70 mt-1">AI-optimized titles get 30%+ more clicks than manual titles</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-display font-bold text-sm uppercase tracking-wide text-secondary">Keywords Built-In</div>
                      <p className="text-sm text-ink/70 mt-1">Every title, description, and tag is SEO-optimized for YouTube search</p>
                    </div>
                  </div>
                </div>
              </div>

              <p>
                <strong>How Creator Booster Helps YouTubers:</strong>
              </p>
              
              <ul className="space-y-3 ml-4">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Generate Viral Titles:</strong> Our AI creates 5-10 title variations using proven formulas (curiosity gaps, power words, keyword optimization). No more staring at a blank page wondering what will get clicks.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Design Thumbnail Concepts:</strong> Get visual inspiration for thumbnails optimized for CTR. Includes color psychology, composition tips, and text placement strategies.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Create SEO-Optimized Descriptions:</strong> Descriptions are more than filler—they're ranking factors. Our AI generates descriptions with natural keyword placement that boost visibility.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Analyze Competitor Performance:</strong> See what titles and thumbnails your competitors use and understand why they work. Learn from success instead of guessing.</span>
                </li>
              </ul>

              <p className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r">
                <strong>The Result?</strong> YouTubers using Creator Booster see 3-5x more consistent results. Your titles get clicked more often. Your videos rank higher in search. Your subscribers grow faster. It's not magic—it's data-driven AI optimization.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="text-xs font-display font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Pro Tip
              </div>
              <p className="text-sm text-ink/70">Try entering your video topic above to see 10+ title variations, thumbnail ideas, and SEO descriptions generated instantly.</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="relative z-10">
        <CreditDisplay id="credits-display" />
      </div>

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

      <form 
        id="generator-input-form" 
        onSubmit={handleGenerate} 
        className="brutal-card p-6 md:p-10 bg-slate-900/50 backdrop-blur-xl border-slate-800/50 relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <label htmlFor="topic" className="block text-sm font-display font-black uppercase tracking-widest mb-4 text-primary">
          Enter Your Video Topic (YouTube Title Generator & Thumbnail Maker)
        </label>
        <div className="flex flex-col md:flex-row gap-4 relative">
          <div className="flex-1 relative">
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., How to earn money with AI - YouTube title generator for viral videos"
              className="w-full px-6 py-5 bg-slate-950/50 brutal-border border-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg rounded-2xl outline-none placeholder:text-slate-600"
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hidden sm:block">
              <Lightbulb className="w-5 h-5" />
            </div>
          </div>
          <button
            type="submit"
            disabled={isGenerating || !topic.trim()}
            className="px-10 py-5 bg-primary text-black font-display font-black text-lg uppercase tracking-wider rounded-2xl brutal-btn flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            {isGenerating ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6 fill-black" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
          </button>
        </div>
      </form>



      <AnimatePresence mode="wait">
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="brutal-card overflow-hidden border-slate-800 bg-slate-900/30 backdrop-blur-sm"
          >
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-800 p-4 gap-3 bg-slate-950/50 scrollbar-hide">
              {[
                { id: 'titles', label: 'YouTube Titles', icon: Type, color: 'bg-primary' },
                { id: 'thumbnails', label: 'AI Thumbnail Text', icon: Type, color: 'bg-tertiary' },
                { id: 'hooks', label: 'Video Hooks', icon: MessageSquare, color: 'bg-secondary' },
                { id: 'ideas', label: 'Thumbnail Maker', icon: ImageIcon, color: 'bg-quaternary' },
                { id: 'description', label: 'Description', icon: FileText, color: 'bg-quinary' },
                { id: 'tags', label: 'Tags', icon: Hash, color: 'bg-surface' },
                { id: 'analytics', label: 'CTR Analytics', icon: BarChart3, color: 'bg-primary' },
                { id: 'video', label: 'Video Gen', icon: Video, color: 'bg-primary' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-xs font-display font-black uppercase tracking-widest rounded-xl transition-all border border-slate-800 whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                      : "bg-slate-900/50 text-slate-400 hover:text-ink hover:bg-slate-800"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Batch Progress (Global) */}
            <AnimatePresence>
              {isGeneratingAll && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-base border-b-4 border-outline"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="font-display font-black uppercase tracking-wider">
                          Batch Progress: {batchProgress.current} / {batchProgress.total}
                        </span>
                      </div>
                      <button 
                        onClick={() => stopBatchRef.current = true}
                        className="px-4 py-1 bg-quaternary text-black font-display font-bold uppercase text-xs brutal-border rounded-lg hover:bg-red-500 transition-colors"
                      >
                        Stop
                      </button>
                    </div>
                    
                    <div className="relative h-6 bg-surface brutal-border rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest mix-blend-difference text-white">
                        {Math.round((batchProgress.current / batchProgress.total) * 100)}% Complete
                      </div>
                    </div>

                    <div className="flex gap-4 text-xs font-bold uppercase">
                      <span className="text-green-600">✓ {batchProgress.success} Success</span>
                      {batchProgress.failed > 0 && <span className="text-red-500">✗ {batchProgress.failed} Failed</span>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="p-6 md:p-10 bg-slate-950/30">
              {activeTab === 'titles' && (
                <div className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    {Object.entries(results.titles as Record<string, string[]>).map(([category, titles]) => (
                      <div key={category} className="space-y-6">
                        <h3 className="text-sm font-display font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                          <span className="w-8 h-[2px] bg-primary" />
                          {category}
                        </h3>
                        <ul className="space-y-4">
                          {titles.map((title, i) => (
                            <li key={i} className="flex items-start justify-between gap-4 p-5 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-primary/50 transition-all">
                              <span className="text-ink font-bold text-lg leading-snug">{title}</span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 flex-shrink-0">
                                <ShareButton text={`YouTube Title Idea: ${title}`} />
                                <CopyButton text={title} />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t-4 border-outline">

                    <div className="text-center text-sm font-bold text-ink/60 mt-2">
                      🔥 <span className="text-primary">Upgrade to Premium</span> to remove ads & get unlimited generations
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'thumbnails' && (
                <div className="space-y-8">
                  <p className="text-lg font-medium text-ink/70 border-l-4 border-primary pl-4">Short, punchy text to place on your thumbnail image.</p>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {results.thumbnailTexts.map((text, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-tertiary/50 transition-all">
                        <span className="font-display font-black text-2xl uppercase tracking-tighter text-tertiary">{text}</span>
                        <div className="flex gap-2">
                          <ShareButton text={`YouTube Thumbnail Text: ${text}`} />
                          <CopyButton text={text} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hooks' && (
                <div className="space-y-8">
                  <p className="text-lg font-medium text-ink/70 border-l-4 border-secondary pl-4">Use these lines in the first 5 seconds of your video to retain viewers.</p>
                  <ul className="space-y-4">
                    {(results as any).hookLines.map((hook: string, i: number) => (
                      <li key={i} className="flex items-start justify-between gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-secondary/50 transition-all">
                        <span className="font-bold text-xl leading-relaxed text-ink">"{hook}"</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 flex-shrink-0">
                          <ShareButton text={`YouTube Video Hook: ${hook}`} />
                          <CopyButton text={hook} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'ideas' && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-lg font-medium text-ink/70 border-l-4 border-quaternary pl-4">Visual concepts for your thumbnail design. Click "Generate Image" to see an AI preview.</p>
                    {results.thumbnailIdeas.some((_, i) => !generatedImages[i]) && (
                      <button
                        onClick={handleGenerateAllThumbnails}
                        disabled={isGeneratingAll}
                        className="px-6 py-3 bg-primary text-black font-display font-black uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {isGeneratingAll ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                        {isGeneratingAll ? 'Generating All...' : 'Generate All'}
                      </button>
                    )}
                  </div>



                  <div className="grid sm:grid-cols-2 gap-8">
                    {results.thumbnailIdeas.map((idea, i) => (
                      <div key={i} className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col gap-6 group hover:border-quaternary/50 transition-all">
                        <div className="flex gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-quaternary flex items-center justify-center flex-shrink-0 font-display font-black text-2xl shadow-inner">
                            {i + 1}
                          </div>
                          <div className="flex-1 flex items-start justify-between gap-4">
                            <p className="font-bold text-xl leading-relaxed text-ink">{idea}</p>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <ShareButton text={`YouTube Thumbnail Idea: ${idea}`} />
                            </div>
                          </div>
                        </div>
                        
                        {generatedImages[i] && generatedImages[i].length > 0 ? (
                          <div className="mt-2 space-y-6">
                            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                              <img src={generatedImages[i][selectedVariation[i] || 0]} alt={`Generated thumbnail for idea ${i + 1}`} className="w-full h-auto aspect-video object-cover" />
                            </div>
                            
                            {generatedImages[i].length > 1 && (
                              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {generatedImages[i].map((imgUrl, varIdx) => (
                                  <button
                                    key={varIdx}
                                    onClick={() => handleSelectVariation(i, varIdx, idea)}
                                    className={cn(
                                      "flex-shrink-0 w-28 aspect-video rounded-xl overflow-hidden border transition-all relative group/var",
                                      (selectedVariation[i] || 0) === varIdx 
                                        ? "border-primary ring-2 ring-primary/20" 
                                        : "border-slate-800 opacity-50 hover:opacity-100"
                                    )}
                                  >
                                    <img src={imgUrl} alt={`Variation ${varIdx + 1}`} className="w-full h-full object-cover" />
                                    {(selectedVariation[i] || 0) === varIdx && (
                                      <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute inset-0 bg-primary/10 flex flex-col items-center justify-center"
                                      >
                                        <div className="bg-primary text-black px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter mb-1">Active</div>
                                        <Check className="w-5 h-5 text-black" />
                                      </motion.div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-4 pt-2">
                              <button
                                onClick={() => setEditingImage({ 
                                  url: generatedImages[i][selectedVariation[i] || 0],
                                  texts: results?.thumbnailTexts || []
                                })}
                                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 text-ink font-display font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black transition-all group/edit"
                              >
                                <Type className="w-5 h-5 group-hover/edit:scale-110 transition-transform" /> 
                                <span>Edit Thumbnail</span>
                              </button>
                              <a
                                href="https://www.canva.com/create/youtube-thumbnails/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-4 bg-[#00c4cc]/10 text-[#00c4cc] border border-[#00c4cc]/20 font-display font-black uppercase tracking-widest rounded-2xl hover:bg-[#00c4cc] hover:text-black transition-all"
                              >
                                <ExternalLink className="w-5 h-5" /> 
                                <span>Canva</span>
                              </a>
                            </div>
                          </div>
                        ) : generatingIndices.has(i) ? (
                          <div className="mt-2 space-y-6">
                            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex flex-col items-center justify-center relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                              <span className="font-display font-black uppercase tracking-[0.3em] text-[10px] text-primary animate-pulse">Creating...</span>
                            </div>
                            <div className="flex gap-4">
                              {[1, 2, 3].map(n => (
                                <div key={n} className="w-28 aspect-video rounded-xl border border-slate-800 bg-slate-900/50 animate-pulse" />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGenerateImage(idea, i)}
                            disabled={generatingIndices.size > 0 || isGeneratingAll}
                            className="mt-2 px-8 py-4 bg-slate-950 text-ink font-display font-black uppercase tracking-widest rounded-2xl border border-slate-800 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                          >
                            <ImageIcon className="w-5 h-5" />
                            <span>Generate Previews</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'description' && (
                <div className="relative group">
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 z-10">
                    <button
                      onClick={() => handleShare(`YouTube Video Description Idea:\n\n${results.description}`)}
                      className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-ink border border-slate-700 rounded-xl font-display font-black uppercase text-xs hover:bg-blue-500 hover:text-white transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(results.description)}
                      className="flex items-center gap-2 px-5 py-3 bg-primary text-black rounded-xl font-display font-black uppercase text-xs hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                      {copiedText === results.description ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>Copy All</span>
                    </button>
                  </div>
                  <div className="p-8 md:p-12 bg-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-30" />
                    <pre className="whitespace-pre-wrap font-sans text-lg font-medium leading-relaxed text-ink/90">
                      {results.description}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'tags' && (
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-display font-black uppercase tracking-[0.2em] text-quinary flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-quinary" />
                        Hashtags
                      </h3>
                      <button
                        onClick={() => handleShare(`YouTube Hashtags: ${results.hashtags.join(' ')}`)}
                        className="text-[10px] font-display font-black uppercase tracking-widest text-ink/50 hover:text-blue-400 transition-colors"
                      >
                        Share Hashtags
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {results.hashtags.map((tag, i) => (
                        <span key={i} className="px-5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-full font-bold text-ink/80 hover:border-quinary/50 transition-all cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-display font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-primary" />
                        Tags
                      </h3>
                      <div className="flex gap-6">
                        <button
                          onClick={() => handleShare(`YouTube Video Tags: ${results.tags.join(', ')}`)}
                          className="text-[10px] font-display font-black uppercase tracking-widest text-ink/50 hover:text-blue-400 transition-colors"
                        >
                          Share
                        </button>
                        <button
                          onClick={() => copyToClipboard(results.tags.join(', '))}
                          className="text-[10px] font-display font-black uppercase tracking-widest text-ink/50 hover:text-primary transition-colors"
                        >
                          Copy All
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {results.tags.map((tag, i) => (
                        <span key={i} className="px-5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl font-bold text-ink/80 hover:border-primary/50 transition-all cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-10">
                  {!ctrAnalysis ? (
                    <div className="p-12 md:p-20 flex flex-col items-center justify-center text-center bg-slate-900/50 border border-slate-800 rounded-[3rem] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-2xl group-hover:border-primary/50 transition-all duration-500">
                        <TrendingUp className="w-10 h-10 text-primary" />
                      </div>
                      <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter mb-4 text-ink">Predict Your CTR</h2>
                      <p className="text-ink/60 font-medium text-lg max-w-lg mb-10 leading-relaxed">
                        Our advanced AI model will analyze your visual concepts and titles to predict your potential Click-Through Rate.
                      </p>
                      <button
                        onClick={handleAnalyzeCTR}
                        disabled={isAnalyzingCTR}
                        className="px-10 py-5 bg-primary text-black font-display font-black text-lg uppercase tracking-widest rounded-2xl brutal-btn flex items-center justify-center gap-4 shadow-xl shadow-primary/20"
                      >
                        {isAnalyzingCTR ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Sparkles className="w-6 h-6 fill-black" />
                        )}
                        <span>{isAnalyzingCTR ? 'Analyzing Data...' : 'Analyze CTR (1 Credit)'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      {/* Main Score Card */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-10 bg-primary text-black rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-2xl shadow-primary/20 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                          <span className="text-xs font-display font-black uppercase tracking-[0.3em] mb-4 opacity-70">Predicted CTR</span>
                          <span className="text-8xl font-display font-black tracking-tighter mb-4">{ctrAnalysis.predictedCTR}</span>
                          <div className="flex items-center gap-2 font-black bg-black/10 px-4 py-2 rounded-xl text-xs uppercase tracking-widest">
                            <Target className="w-4 h-4" />
                            Confidence: {ctrAnalysis.confidenceScore}%
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          {[
                            { label: 'Visual Appeal', score: ctrAnalysis.visualAppealScore, color: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
                            { label: 'Title Strength', score: ctrAnalysis.titleStrengthScore, color: 'bg-secondary/10 text-secondary border-secondary/20' },
                            { label: 'SEO Score', score: ctrAnalysis.seoScore, color: 'bg-quaternary/10 text-quaternary border-quaternary/20' },
                            { label: 'Sentiment', value: ctrAnalysis.audienceSentiment, color: 'bg-quinary/10 text-quinary border-quinary/20' },
                          ].map((stat, i) => (
                            <div key={i} className={cn("p-6 border rounded-3xl flex flex-col justify-center gap-1", stat.color)}>
                              <span className="text-[10px] font-display font-black uppercase tracking-widest opacity-70">{stat.label}</span>
                              <span className="text-2xl font-display font-black uppercase">
                                {stat.score !== undefined ? `${stat.score}%` : stat.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Insights */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h3 className="text-sm font-display font-black uppercase tracking-[0.2em] text-green-500 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-green-500" />
                            Key Strengths
                          </h3>
                          <ul className="space-y-4">
                            {ctrAnalysis.strengths.map((s, i) => (
                              <li key={i} className="p-5 bg-green-500/5 text-green-400 border border-green-500/10 rounded-2xl font-bold flex items-start gap-4">
                                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" /> 
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-6">
                          <h3 className="text-sm font-display font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-red-500" />
                            Potential Weaknesses
                          </h3>
                          <ul className="space-y-4">
                            {ctrAnalysis.weaknesses.map((w, i) => (
                              <li key={i} className="p-5 bg-red-500/5 text-red-400 border border-red-500/10 rounded-2xl font-bold flex items-start gap-4">
                                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" /> 
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Optimization Tips */}
                      <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                          <Lightbulb className="w-32 h-32 text-yellow-500" />
                        </div>
                        <h3 className="text-2xl font-display font-black uppercase tracking-widest mb-8 flex items-center gap-4 text-ink">
                          <Lightbulb className="w-8 h-8 text-yellow-500 fill-yellow-500" /> 
                          Optimization Roadmap
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 relative z-10">
                          {ctrAnalysis.optimizationTips.map((tip, i) => (
                            <div key={i} className="flex gap-5 p-6 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-primary/30 transition-all">
                              <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center flex-shrink-0 font-display font-black text-lg shadow-lg shadow-primary/20">
                                {i + 1}
                              </div>
                              <p className="font-bold leading-relaxed text-ink/80">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'video' && (
                <div className="space-y-6">
                  <p className="text-lg font-medium border-l-4 border-outline pl-4">Generate a short B-roll or intro video using AI.</p>
                  
                  <div className="brutal-card p-12 flex flex-col items-center justify-center text-center bg-surface">
                    <Video className="w-16 h-16 mb-4 text-ink/30" />
                    <h2 className="text-3xl font-display font-black uppercase tracking-wider mb-2">Coming Soon</h2>
                    <p className="text-ink/70 font-medium text-lg max-w-md">
                      We are working hard to bring you an incredible AI video generator. Stay tuned for updates!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {editingImage && (
        <ThumbnailEditor 
          imageUrl={editingImage.url} 
          suggestedTexts={editingImage.texts}
          onClose={() => setEditingImage(null)} 
        />
      )}

      <RewardedAdModal 
        isOpen={showAdModal} 
        onClose={() => setShowAdModal(false)} 
      />
    </div>
  );
}
