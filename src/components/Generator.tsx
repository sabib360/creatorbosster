import { useState, useRef, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<'direct-thumbnail' | 'titles' | 'thumbnails' | 'hooks' | 'ideas' | 'description' | 'tags' | 'video' | 'analytics'>('direct-thumbnail');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<YoutubeIdeas | null>(null);
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
  const [isGeneratingAllContent, setIsGeneratingAllContent] = useState(false);
  const [allContentProgress, setAllContentProgress] = useState({ step: 0, total: 6, currentTask: '' });
  const [directThumbnailPrompt, setDirectThumbnailPrompt] = useState('');
  const [isGeneratingDirectThumbnail, setIsGeneratingDirectThumbnail] = useState(false);
  const [directThumbnailImage, setDirectThumbnailImage] = useState<string | null>(null);
  const { user } = useAuth();
  const { credits, useCredit, isLoading: creditsLoading } = useCredits();

  // Filter results based on search term
  useEffect(() => {
    if (!results) return;
    
    if (!searchTerm.trim()) {
      setFilteredResults(results);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered: YoutubeIdeas = {
      titles: results.titles ? {
        viral: results.titles.viral?.filter(t => t.toLowerCase().includes(term)) || [],
        curiosity: results.titles.curiosity?.filter(t => t.toLowerCase().includes(term)) || [],
        emotional: results.titles.emotional?.filter(t => t.toLowerCase().includes(term)) || [],
        seo: results.titles.seo?.filter(t => t.toLowerCase().includes(term)) || [],
        short: results.titles.short?.filter(t => t.toLowerCase().includes(term)) || [],
        long: results.titles.long?.filter(t => t.toLowerCase().includes(term)) || [],
      } : undefined,
      thumbnailTexts: results.thumbnailTexts?.filter(t => t.toLowerCase().includes(term)) || [],
      hookLines: results.hookLines?.filter(h => h.toLowerCase().includes(term)) || [],
      thumbnailIdeas: results.thumbnailIdeas?.filter(i => i.toLowerCase().includes(term)) || [],
      description: results.description.toLowerCase().includes(term) ? results.description : '',
      tags: results.tags?.filter(tag => tag.toLowerCase().includes(term)) || [],
      hashtags: results.hashtags?.filter(tag => tag.toLowerCase().includes(term)) || [],
      ctrAnalysis: results.ctrAnalysis,
    };
    setFilteredResults(filtered);
  }, [results, searchTerm]);

  const handleGenerateAllContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    // Check credits (need 6 credits for all content: 1 for ideas + 1 for CTR + 4 for thumbnails)
    if (credits < 6) {
      setShowAdModal(true);
      return;
    }
    
    setIsGeneratingAllContent(true);
    setError(null);
    setGeneratedImages({}); // Reset images on new generation
    setSelectedVariation({}); // Reset selections on new generation
    setCtrAnalysis(null); // Reset analysis
    setCurrentHistoryId(null);
    
    try {
      // Step 1: Generate basic ideas
      setAllContentProgress({ step: 1, total: 6, currentTask: 'Generating YouTube titles & ideas...' });
      const creditResult1 = await useCredit(1);
      if (!creditResult1.success) {
        if (creditResult1.reason === 'insufficient_credits') {
          setShowAdModal(true);
        }
        setIsGeneratingAllContent(false);
        return;
      }
      
      const data = await generateYoutubeIdeas(topic);
      setResults(data);
      setFilteredResults(data);
      setSearchTerm('');
      setVideoPrompt(topic);
      
      // Save to history
      const historyItem = await saveIdeasToHistory(topic, data, user?.uid);
      setCurrentHistoryId(historyItem.id);
      
      // Step 2: Generate CTR Analysis
      setAllContentProgress({ step: 2, total: 6, currentTask: 'Analyzing CTR potential...' });
      const creditResult2 = await useCredit(1);
      if (!creditResult2.success) {
        throw new Error('Insufficient credits for CTR analysis');
      }
      
      const ctrAnalysisData = await analyzeCTR(data);
      setCtrAnalysis(ctrAnalysisData);
      setResults(prev => prev ? { ...prev, ctrAnalysis: ctrAnalysisData } : null);
      
      // Step 3-6: Generate thumbnail images for first 4 ideas
      const thumbnailIdeas = data.thumbnailIdeas.slice(0, 4);
      for (let i = 0; i < thumbnailIdeas.length; i++) {
        setAllContentProgress({ 
          step: 3 + i, 
          total: 6, 
          currentTask: `Generating thumbnail ${i + 1} of 4...` 
        });
        
        const creditResult = await useCredit(1);
        if (!creditResult.success) {
          throw new Error('Insufficient credits for thumbnail generation');
        }
        
        const images = await generateThumbnailImages(thumbnailIdeas[i], 3);
        setGeneratedImages(prev => ({ ...prev, [i]: images }));
        setSelectedVariation(prev => ({ ...prev, [i]: 0 }));
        
        if (currentHistoryId) {
          await addThumbnailsToHistory(currentHistoryId, thumbnailIdeas[i], images, user?.uid);
        }
      }
      
      setActiveTab('ideas'); // Show thumbnails as final result
      
    } catch (error: any) {
      console.error("Failed to generate all content:", error);
      setError({
        title: "Generation Failed",
        message: error.message || "We couldn't generate all content. This might be due to a temporary connection issue or insufficient credits.",
        retry: () => handleGenerateAllContent(e)
      });
    } finally {
      setIsGeneratingAllContent(false);
      setAllContentProgress({ step: 0, total: 6, currentTask: '' });
    }
  };

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
      setFilteredResults(data); // Reset filtered results
      setSearchTerm(''); // Clear search
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

  const downloadThumbnail = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `youtube-thumbnail-${topic.replace(/\s+/g, '-').toLowerCase()}-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download thumbnail:', error);
    }
  };

  const handleGenerateDirectThumbnail = async () => {
    if (!directThumbnailPrompt.trim()) return;
    
    // Check credits
    if (credits < 1) {
      setShowAdModal(true);
      return;
    }

    setIsGeneratingDirectThumbnail(true);
    setError(null);
    try {
      // Consume credit
      const creditResult = await useCredit(1);
      if (!creditResult.success) {
        if (creditResult.reason === 'insufficient_credits') {
          setShowAdModal(true);
        }
        setIsGeneratingDirectThumbnail(false);
        return;
      }

      // Generate thumbnail directly from text
      const images = await generateThumbnailImages(directThumbnailPrompt, 3);
      setDirectThumbnailImage(images[0]);
    } catch (error: any) {
      console.error("Failed to generate direct thumbnail:", error);
      setError({
        title: "Thumbnail Generation Failed",
        message: error.message || "We couldn't create the thumbnail. Please try again.",
        retry: () => handleGenerateDirectThumbnail()
      });
    } finally {
      setIsGeneratingDirectThumbnail(false);
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
          className="rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950/50 backdrop-blur-xl p-8 md:p-12 space-y-8"
        >
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-display font-black uppercase tracking-wider text-primary">AI-Powered YouTube Tools</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
              Create Viral YouTube Content in Seconds
            </h2>
            
            <p className="text-lg md:text-xl text-ink/70 max-w-3xl mx-auto leading-relaxed">
              Generate titles, thumbnails, descriptions, and more with AI. No design skills needed. Just enter your topic and get everything you need for a successful YouTube video.
            </p>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Type, label: "AI Titles", desc: "Viral & SEO-optimized", color: "text-primary" },
                { icon: ImageIcon, label: "Thumbnails", desc: "Click-worthy designs", color: "text-tertiary" },
                { icon: FileText, label: "Descriptions", desc: "Rank higher in search", color: "text-secondary" },
                { icon: BarChart3, label: "CTR Analysis", desc: "Predict your success", color: "text-quinary" }
              ].map((feature, i) => (
                <div key={i} className="text-center space-y-3 p-6 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-primary/30 transition-all group">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-primary transition-all`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-ink">{feature.label}</h3>
                  <p className="text-xs text-ink/60">{feature.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <div className="flex items-center gap-2 text-sm text-ink/60">
                <Check className="w-4 h-4 text-green-500" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink/60">
                <Check className="w-4 h-4 text-green-500" />
                <span>Free downloads</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-ink/60">
                <Check className="w-4 h-4 text-green-500" />
                <span>One-click generation</span>
              </div>
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
        className="brutal-card p-6 md:p-10 bg-slate-900/50 backdrop-blur-xl border-slate-800/50 relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <label htmlFor="topic" className="block text-sm font-display font-black uppercase tracking-widest mb-4 text-primary">
          Enter Your Video Topic (YouTube Title Generator & Thumbnail Maker)
        </label>
        <div className="flex flex-col gap-4 relative">
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
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || isGeneratingAllContent || !topic.trim()}
              className="flex-1 px-8 py-4 bg-primary text-black font-display font-black text-lg uppercase tracking-wider rounded-2xl brutal-btn flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 fill-black" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Generate Ideas'}</span>
            </button>
            
            <button
              type="button"
              onClick={handleGenerateAllContent}
              disabled={isGenerating || isGeneratingAllContent || !topic.trim() || credits < 6}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-primary via-secondary to-tertiary text-black font-display font-black text-lg uppercase tracking-wider rounded-2xl brutal-btn flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {isGeneratingAllContent ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 fill-black" />
              )}
              <span>{isGeneratingAllContent ? 'Generating All...' : 'Generate All (6 Credits)'}</span>
            </button>
          </div>
          
          {credits < 6 && (
            <div className="text-center text-sm font-bold text-ink/60 bg-slate-950/50 rounded-xl p-3 border border-slate-800">
              ⚡ <span className="text-primary">Generate All</span> creates titles, thumbnails, CTR analysis, and more. Need 6 credits (you have {credits}).
            </div>
          )}
        </div>
      </form>

      {/* Generate All Progress */}
      <AnimatePresence>
        {isGeneratingAllContent && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="brutal-card p-6 md:p-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10 border border-primary/30"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-black uppercase tracking-wider text-ink">
                    Generating Complete YouTube Package
                  </h3>
                  <p className="text-sm text-ink/60">{allContentProgress.currentTask}</p>
                </div>
              </div>
              <div className="text-sm font-display font-black text-primary">
                Step {allContentProgress.step} of {allContentProgress.total}
              </div>
            </div>
            
            <div className="relative h-4 bg-slate-900/50 rounded-full overflow-hidden border border-slate-800">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-tertiary"
                initial={{ width: 0 }}
                animate={{ width: `${(allContentProgress.step / allContentProgress.total) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black uppercase tracking-widest mix-blend-difference text-white">
                {Math.round((allContentProgress.step / allContentProgress.total) * 100)}%
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-6 gap-2">
              {['Ideas', 'CTR', 'Thumb 1', 'Thumb 2', 'Thumb 3', 'Thumb 4'].map((step, i) => (
                <div 
                  key={i}
                  className={`text-center py-2 rounded-lg text-xs font-display font-black uppercase tracking-wider transition-all ${
                    i < allContentProgress.step 
                      ? 'bg-primary text-black' 
                      : i === allContentProgress.step - 1 
                      ? 'bg-secondary text-black animate-pulse'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                { id: 'direct-thumbnail', label: '🎨 Text→Thumbnail', icon: ImageIcon, color: 'bg-gradient-to-r from-primary to-tertiary' },
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

            {/* Search Bar */}
            <div className="p-4 bg-slate-950/50 border-b border-slate-800">
              <input
                type="text"
                placeholder="🔍 Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-ink placeholder:text-ink/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Content */}
            <div className="p-6 md:p-10 bg-slate-950/30">
              {activeTab === 'direct-thumbnail' && (
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight text-ink">
                      🎨 Text to Thumbnail Generator
                    </h3>
                    <p className="text-lg text-ink/70 max-w-2xl mx-auto">
                      Describe your perfect thumbnail in words and AI will create it instantly. No design skills needed.
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-6">
                    <div>
                      <label htmlFor="thumbnail-prompt" className="block text-sm font-display font-black uppercase tracking-widest mb-3 text-tertiary">
                        Describe Your Thumbnail
                      </label>
                      <textarea
                        id="thumbnail-prompt"
                        value={directThumbnailPrompt}
                        onChange={(e) => setDirectThumbnailPrompt(e.target.value)}
                        placeholder="e.g., A person shocked looking at laptop with money flying out, bright yellow background, bold text 'I MADE $10,000', high contrast, viral YouTube style"
                        className="w-full px-6 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-ink placeholder:text-slate-600 focus:border-tertiary focus:ring-2 focus:ring-tertiary/20 transition-all outline-none resize-none h-32"
                        required
                      />
                    </div>

                    <button
                      onClick={handleGenerateDirectThumbnail}
                      disabled={isGeneratingDirectThumbnail || !directThumbnailPrompt.trim() || credits < 1}
                      className="w-full px-8 py-4 bg-gradient-to-r from-primary to-tertiary text-black font-display font-black text-lg uppercase tracking-wider rounded-2xl brutal-btn flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                      {isGeneratingDirectThumbnail ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <ImageIcon className="w-6 h-6" />
                      )}
                      <span>{isGeneratingDirectThumbnail ? 'Creating Thumbnail...' : 'Generate Thumbnail (1 Credit)'}</span>
                    </button>
                  </div>

                  {directThumbnailImage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-2xl mx-auto space-y-6"
                    >
                      <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                        <img src={directThumbnailImage} alt="Generated thumbnail" className="w-full h-auto aspect-video object-cover" />
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={() => downloadThumbnail(directThumbnailImage, 0)}
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-tertiary text-black font-display font-black uppercase tracking-widest rounded-2xl hover:shadow-lg hover:shadow-tertiary/20 transition-all"
                        >
                          <Download className="w-5 h-5" />
                          <span>Download Free</span>
                        </button>
                        <button
                          onClick={() => setEditingImage({ 
                            url: directThumbnailImage,
                            texts: ['Click Here!', 'Amazing!', 'Must Watch!']
                          })}
                          className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 text-ink font-display font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-black transition-all"
                        >
                          <Type className="w-5 h-5" />
                          <span>Edit Text</span>
                        </button>
                        <button
                          onClick={() => setDirectThumbnailPrompt('')}
                          className="px-6 py-4 bg-slate-900 text-ink font-display font-black uppercase tracking-widest rounded-2xl border border-slate-800 hover:bg-slate-800 transition-all"
                        >
                          <span>New Thumbnail</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {isGeneratingDirectThumbnail && (
                    <div className="max-w-2xl mx-auto">
                      <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex flex-col items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tertiary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        <Loader2 className="w-16 h-16 animate-spin text-tertiary mb-4" />
                        <span className="font-display font-black uppercase tracking-[0.3em] text-tertiary animate-pulse">Creating Your Thumbnail...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'titles' && (
                <div className="space-y-10">
                  <div className="text-center space-y-4 mb-8">
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight text-primary">
                      🎯 AI-Generated YouTube Titles
                    </h3>
                    <p className="text-lg text-ink/70 max-w-2xl mx-auto">
                      Proven title formulas optimized for clicks, views, and SEO. Each category targets different viewer psychology.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(filteredResults?.titles as Record<string, string[]>).map(([category, titles]) => (
                      <div key={category} className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            category === 'viral' ? 'bg-red-500' :
                            category === 'curiosity' ? 'bg-blue-500' :
                            category === 'emotional' ? 'bg-purple-500' :
                            category === 'seo' ? 'bg-green-500' :
                            category === 'short' ? 'bg-yellow-500' :
                            'bg-orange-500'
                          }`} />
                          <h3 className="text-sm font-display font-black uppercase tracking-[0.2em] text-ink">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </h3>
                          <span className="text-xs text-ink/40">({titles.length})</span>
                        </div>
                        <div className="space-y-3">
                          {titles.map((title, i) => (
                            <div key={i} className="group relative">
                              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-primary/30 transition-all">
                                <p className="text-ink font-bold text-sm leading-snug pr-12">{title}</p>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <button
                                    onClick={() => copyToClipboard(title)}
                                    className="p-1.5 bg-slate-800 text-ink/40 hover:text-primary rounded-lg transition-all"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleShare(`YouTube Title: ${title}`)}
                                    className="p-1.5 bg-slate-800 text-ink/40 hover:text-blue-400 rounded-lg transition-all"
                                  >
                                    <Share2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-tertiary/10 border border-primary/30 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary text-black rounded-xl flex items-center justify-center">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display font-black text-sm uppercase tracking-wider text-ink mb-2">Title Categories Explained</h4>
                        <div className="grid md:grid-cols-3 gap-4 text-xs text-ink/70">
                          <div><strong className="text-red-400">Viral:</strong> High-emotion, shareable content</div>
                          <div><strong className="text-blue-400">Curiosity:</strong> Questions that create gaps</div>
                          <div><strong className="text-purple-400">Emotional:</strong> Stories that connect</div>
                          <div><strong className="text-green-400">SEO:</strong> Search-optimized keywords</div>
                          <div><strong className="text-yellow-400">Short:</strong> Punchy & memorable</div>
                          <div><strong className="text-orange-400">Long:</strong> Detailed & descriptive</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'thumbnails' && (
                <div className="space-y-8">
                  <p className="text-lg font-medium text-ink/70 border-l-4 border-primary pl-4">Short, punchy text to place on your thumbnail image.</p>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredResults?.thumbnailTexts?.map((text, i) => (
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
                    {(filteredResults?.hookLines || []).map((hook: string, i: number) => (
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
                    {filteredResults?.thumbnailIdeas.some((_, i) => !generatedImages[i]) && (
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
                    {filteredResults?.thumbnailIdeas.map((idea, i) => (
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
                              <button
                                onClick={() => downloadThumbnail(generatedImages[i][selectedVariation[i] || 0], i)}
                                className="flex items-center gap-3 px-6 py-4 bg-tertiary/10 text-tertiary border border-tertiary/20 font-display font-black uppercase tracking-widest rounded-2xl hover:bg-tertiary hover:text-black transition-all"
                              >
                                <Download className="w-5 h-5" /> 
                                <span>Download</span>
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
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight text-secondary">
                      📝 SEO-Optimized Description
                    </h3>
                    <p className="text-lg text-ink/70 max-w-2xl mx-auto">
                      YouTube algorithm-friendly description with natural keywords, timestamps, and engagement hooks.
                    </p>
                  </div>

                  <div className="relative group">
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 z-10">
                      <button
                        onClick={() => handleShare(`YouTube Video Description:\n\n${results.description}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-ink border border-slate-700 rounded-lg font-display font-black uppercase text-xs hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(filteredResults?.description || '')}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-black rounded-lg font-display font-black uppercase text-xs hover:shadow-lg hover:shadow-secondary/20 transition-all"
                      >
                        {copiedText === filteredResults?.description ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>Copy All</span>
                      </button>
                    </div>
                    
                    <div className="p-8 md:p-12 bg-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-tertiary to-quaternary opacity-30" />
                      
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="text-xs font-display font-black uppercase tracking-widest text-secondary">
                            YouTube Description
                          </div>
                        </div>
                        
                        <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-ink/90 bg-slate-950/30 p-6 rounded-xl border border-slate-800">
                          {filteredResults?.description}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-secondary/10 via-tertiary/10 to-quaternary/10 border border-secondary/30 rounded-2xl p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-xs uppercase tracking-wider text-ink mb-1">SEO Keywords</h4>
                          <p className="text-xs text-ink/60">Natural keyword placement for search ranking</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-xs uppercase tracking-wider text-ink mb-1">Engagement Hooks</h4>
                          <p className="text-xs text-ink/60">Questions and CTAs to boost interaction</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-xs uppercase tracking-wider text-ink mb-1">Timestamps Ready</h4>
                          <p className="text-xs text-ink/60">Structured for chapter navigation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tags' && (
                <div className="space-y-10">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight text-quinary">
                      🔖 SEO Tags & Hashtags
                    </h3>
                    <p className="text-lg text-ink/70 max-w-2xl mx-auto">
                      Trending keywords and hashtags to boost your video's discoverability and search ranking.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Hashtags Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Hash className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="text-sm font-display font-black uppercase tracking-[0.2em] text-ink">
                            Trending Hashtags
                          </h4>
                          <span className="text-xs text-ink/40 bg-slate-800 px-2 py-1 rounded-lg">
                            {results.hashtags.length}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(results.hashtags.join(' '))}
                          className="text-xs font-display font-black uppercase tracking-widest text-ink/50 hover:text-blue-400 transition-colors px-3 py-1 rounded-lg hover:bg-slate-800"
                        >
                          Copy All
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {results.hashtags.map((tag, i) => (
                          <button
                            key={i}
                            onClick={() => copyToClipboard(tag)}
                            className="group px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full font-bold text-sm text-ink hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden"
                          >
                            <span className="relative z-10">{tag}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Copy className="w-3 h-3 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                          </button>
                        ))}
                      </div>

                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <TrendingUp className="w-3 h-3 text-blue-400" />
                          </div>
                          <div>
                            <h5 className="font-display font-black text-xs uppercase tracking-wider text-blue-400 mb-1">Hashtag Strategy</h5>
                            <p className="text-xs text-ink/60">Mix broad and niche hashtags for maximum reach. Use 3-5 popular tags and 5-10 specific ones.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="text-sm font-display font-black uppercase tracking-[0.2em] text-ink">
                            SEO Keywords
                          </h4>
                          <span className="text-xs text-ink/40 bg-slate-800 px-2 py-1 rounded-lg">
                            {results.tags.length}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(results.tags.join(', '))}
                          className="text-xs font-display font-black uppercase tracking-widest text-ink/50 hover:text-green-400 transition-colors px-3 py-1 rounded-lg hover:bg-slate-800"
                        >
                          Copy All
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {results.tags.map((tag, i) => (
                          <button
                            key={i}
                            onClick={() => copyToClipboard(tag)}
                            className="group px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl font-bold text-sm text-ink hover:border-green-400 transition-all cursor-pointer"
                          >
                            <span>{tag}</span>
                            <Copy className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-green-400" />
                          </button>
                        ))}
                      </div>

                      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Target className="w-3 h-3 text-green-400" />
                          </div>
                          <div>
                            <h5 className="font-display font-black text-xs uppercase tracking-wider text-green-400 mb-1">Keyword Tips</h5>
                            <p className="text-xs text-ink/60">Include long-tail keywords and variations. Think about what your audience would search for.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-quinary/10 via-slate-800/50 to-quinary/10 border border-quinary/30 rounded-2xl p-6">
                    <div className="text-center space-y-4">
                      <h4 className="font-display font-black text-sm uppercase tracking-wider text-quinary">
                        🚀 Pro Tag Strategy
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                          <div className="text-green-400 font-bold mb-2">High Volume</div>
                          <p className="text-ink/60">2-3 popular tags with 100K+ searches</p>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                          <div className="text-yellow-400 font-bold mb-2">Medium Competition</div>
                          <p className="text-ink/60">5-7 tags with 10K-100K searches</p>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                          <div className="text-blue-400 font-bold mb-2">Long Tail</div>
                          <p className="text-ink/60">3-5 specific phrases under 10K</p>
                        </div>
                      </div>
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
