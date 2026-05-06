import { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Download, Image as ImageIcon, Check, AlertCircle, CheckCircle2, Zap, Copy, Type, Hash, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateYoutubeIdeas, generateThumbnailImages, type YoutubeIdeas } from '../../lib/gemini';
import { useCredits } from '../../hooks/useCredits';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { saveIdeasToHistory } from '../../lib/history';

export default function AIThumbnailGenerator() {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<YoutubeIdeas | null>(null);
  const [selectedIdeaIdx, setSelectedIdeaIdx] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'titles' | 'ideas' | 'thumbnails' | 'descriptions'>('titles');
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { credits } = useCredits();
  const { user } = useAuth();

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || credits < 1) return;

    setIsGeneratingIdeas(true);
    setError(null);

    try {
      const data = await generateYoutubeIdeas(topic);
      setIdeas(data);
      setActiveTab('ideas');
      setSuccess('Titles and thumbnail ideas generated!');
      if (user) {
        await saveIdeasToHistory(topic, data, user.uid);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate ideas');
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleGenerateImages = async (ideaIdx: number) => {
    if (credits < 1 || !ideas) return;

    setIsGeneratingImages(true);
    const idea = ideas.thumbnailIdeas[ideaIdx];
    setError(null);

    try {
      const newImages = await generateThumbnailImages(idea, 4);
      setImages(newImages);
      setSelectedImageIdx(0);
      setSelectedIdeaIdx(ideaIdx);
      setActiveTab('thumbnails');
      setSuccess(`Thumbnails generated for "${idea.substring(0, 50)}..."`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate thumbnails');
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const handleDownload = async () => {
    if (!images.length || selectedImageIdx === null || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      canvasRef.current!.width = 1280;
      canvasRef.current!.height = 720;
      const ctx = canvasRef.current!.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 1280, 720);
      const url = canvasRef.current!.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-thumbnail-${Date.now()}.png`;
      a.click();
      setSuccess('Thumbnail downloaded!');
    };
    img.src = images[selectedImageIdx];
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 bg-gradient-to-r from-ink to-primary bg-clip-text">
            AI YouTube Title & Thumbnail Generator
          </h1>
          <p className="text-xl text-ink/60 max-w-2xl">Generate viral titles, thumbnail ideas, AI images, and descriptions automatically</p>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && <motion.div initial={{ y: -10 }} animate={{ y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-500/10 border border-red-500 rounded-2xl text-red-400">
            <div className="flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {error}</div>
          </motion.div>}
          {success && <motion.div initial={{ y: -10 }} animate={{ y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500 rounded-2xl text-emerald-400">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {success}</div>
          </motion.div>}
        </AnimatePresence>

        {/* Step 1: Generate Ideas */}
        {!ideas && (
          <motion.div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleGenerateIdeas} className="space-y-6">
              <div>
                <label className="text-lg font-bold text-ink mb-4 block">Enter your video topic</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., How to make money with AI, Gaming tutorial" 
                  className="w-full px-6 py-4 bg-slate-950 border border-slate-700 rounded-2xl text-lg focus:border-primary" required />
              </div>
              <button type="submit" disabled={isGeneratingIdeas || !topic.trim()} className="w-full py-6 bg-gradient-to-r from-primary to-secondary text-black font-black uppercase tracking-wider rounded-2xl shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50">
                {isGeneratingIdeas ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                <span>{isGeneratingIdeas ? 'Generating Ideas...' : 'Generate Titles & Thumbnail Ideas'}</span>
              </button>
            </form>
          </motion.div>
        )}

        {/* Tabs for Results */}
        {ideas && (
          <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-3 bg-slate-900/50 border border-slate-800 p-3 rounded-2xl">
              {[
                { id: 'titles', label: 'Titles', icon: Type, disabled: false },
                { id: 'ideas', label: 'Thumbnail Ideas', icon: ImageIcon, disabled: false },
                { id: 'thumbnails', label: 'Thumbnails', icon: ImageIcon, disabled: !images.length },
                { id: 'descriptions', label: 'Texts & Tags', icon: Hash, disabled: false },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  disabled={tab.disabled}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-black uppercase tracking-wider rounded-2xl transition-all border border-slate-800',
                    tab.disabled
                      ? 'bg-slate-950 text-slate-500 cursor-not-allowed'
                      : activeTab === tab.id
                        ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20'
                        : 'bg-slate-900 text-slate-400 hover:text-ink hover:bg-slate-800'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'titles' && (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(ideas.titles).map(([cat, titleList]) => (
                  <div key={cat} className="space-y-4">
                    <h3 className="font-black uppercase tracking-wider text-primary flex items-center gap-2">
                      <span className="w-6 h-px bg-primary" /> {cat}
                    </h3>
                    <div className="space-y-3">
                      {titleList.map((title, i) => (
                        <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl group hover:border-primary flex items-start justify-between gap-4">
                          <span className="font-bold text-lg">{title}</span>
                          <button onClick={() => copyText(title)} className="p-2 opacity-0 group-hover:opacity-100"><Copy className="w-5 h-5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ideas' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.thumbnailIdeas.map((idea, idx) => (
                  <motion.div key={idx} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-primary cursor-pointer" whileHover={{ scale: 1.02 }} onClick={() => handleGenerateImages(idx)}>
                    <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-all">
                      <ImageIcon className="w-12 h-12 text-slate-600 group-hover:text-primary" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 line-clamp-2">{idea}</h4>
                    <button disabled={isGeneratingImages} className="w-full py-3 bg-slate-800 hover:bg-primary text-white font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isGeneratingImages ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Generate Images
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'thumbnails' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {images.map((img, idx) => (
                    <motion.div key={idx} className={cn('group relative aspect-video rounded-3xl border-4 cursor-pointer shadow-2xl', selectedImageIdx === idx ? 'border-primary ring-4 ring-primary/30 scale-105' : 'border-slate-800 hover:border-primary')} onClick={() => setSelectedImageIdx(idx)}>
                      <img src={img} className="w-full h-full object-cover rounded-3xl" />
                      {selectedImageIdx === idx && (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center rounded-3xl">
                          <Check className="w-20 h-20 text-white shadow-2xl" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {selectedImageIdx !== null && (
                  <motion.button whileHover={{ scale: 1.05 }} onClick={handleDownload} className="mx-auto px-8 py-4 bg-primary text-black font-black uppercase tracking-wider rounded-2xl shadow-2xl flex items-center gap-3">
                    <Download className="w-5 h-5" />
                    Download Selected Thumbnail
                  </motion.button>
                )}
              </div>
            )}

            {activeTab === 'descriptions' && (
              <div className="grid gap-8">
                <div>
                  <h3 className="font-black uppercase tracking-wider mb-6 flex items-center gap-2 text-primary"><Hash className="w-6 h-6" /> Thumbnail Texts</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {ideas.thumbnailTexts.slice(0, 8).map((text, i) => (
                      <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-primary">
                        <span className="font-black text-xl uppercase tracking-tight">{text}</span>
                        <button onClick={() => copyText(text)} className="p-2 opacity-0 group-hover:opacity-100"><Copy className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-wider mb-6 flex items-center gap-2 text-secondary"><MessageSquare className="w-6 h-6" /> Tags & Hashtags</h3>
                  <div className="flex flex-wrap gap-3">
                    {[...ideas.tags, ...ideas.hashtags].slice(0, 20).map((tag, i) => (
                      <button key={i} onClick={() => copyText(tag)} className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full font-bold hover:border-primary transition-all text-sm">
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

