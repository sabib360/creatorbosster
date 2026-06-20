import { useState } from 'react';
import { Sparkles, AlertCircle, Copy, Check, Lightbulb, Filter } from 'lucide-react';
import { generateVideoIdeas, type VideoIdea } from '../../lib/gemini';

type Difficulty = 'all' | 'easy' | 'medium' | 'hard';
type Views = 'all' | 'low' | 'medium' | 'high' | 'viral';

export default function YouTubeVideoIdeasGenerator() {
  const [niche, setNiche] = useState('');
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diffFilter, setDiffFilter] = useState<Difficulty>('all');
  const [viewsFilter, setViewsFilter] = useState<Views>('all');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!niche.trim()) { setError('Please enter a niche or category'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateVideoIdeas(niche); setIdeas(r); } catch { setError('Failed to generate ideas.'); } finally { setIsGenerating(false); }
  };

  const filteredIdeas = ideas.filter(i => {
    if (diffFilter !== 'all' && i.difficulty !== diffFilter) return false;
    if (viewsFilter !== 'all' && i.estimatedViews !== viewsFilter) return false;
    return true;
  });

  const copyTitle = async (title: string, idx: number) => {
    try { await navigator.clipboard.writeText(title); } catch {
      const t = document.createElement('textarea'); t.value = title; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = async () => {
    const text = filteredIdeas.map(i => `${i.title} (${i.type})`).join('\n');
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
  };

  const getDiffColor = (d: string) => d === 'easy' ? 'bg-green-400/10 text-green-400' : d === 'medium' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-400';
  const getViewsColor = (v: string) => v === 'viral' ? 'text-purple-400' : v === 'high' ? 'text-green-400' : v === 'medium' ? 'text-yellow-400' : 'text-ink/60';
  const getTypeIcon = (t: string) => {
    if (t.toLowerCase().includes('tutorial') || t.toLowerCase().includes('how')) return '📚';
    if (t.toLowerCase().includes('review') || t.toLowerCase().includes('comparison')) return '🔍';
    if (t.toLowerCase().includes('list') || t.toLowerCase().includes('top')) return '📋';
    if (t.toLowerCase().includes('challenge') || t.toLowerCase().includes('trend')) return '🎯';
    if (t.toLowerCase().includes('story') || t.toLowerCase().includes('experience')) return '📖';
    return '💡';
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto"><Lightbulb className="w-8 h-8 text-red-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Video Ideas Generator</h1>
        <p className="text-ink/60">Generate 50+ video ideas for your niche with difficulty and views estimates</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Your Niche / Category</label>
        <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g., Tech reviews, cooking, personal finance" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-red-400" onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
        <button onClick={handleGenerate} disabled={isGenerating || !niche.trim()} className="w-full py-4 bg-red-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-400/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating Ideas...' : <><Sparkles className="w-5 h-5" /> Generate 50+ Video Ideas</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {ideas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{filteredIdeas.length} Ideas</h3>
            <button onClick={copyAll} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-ink transition-colors flex items-center gap-1"><Copy className="w-3 h-3" /> Copy All</button>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <Filter className="w-3 h-3 text-ink/60" />
              <span className="text-xs text-ink/60">Difficulty:</span>
              {(['all', 'easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button key={d} onClick={() => setDiffFilter(d)} className={`px-2 py-1 rounded text-[10px] font-bold transition-colors capitalize ${diffFilter === d ? 'bg-red-400 text-black' : 'bg-slate-700 text-ink'}`}>{d}</button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-ink/60">Views:</span>
              {(['all', 'low', 'medium', 'high', 'viral'] as Views[]).map(v => (
                <button key={v} onClick={() => setViewsFilter(v)} className={`px-2 py-1 rounded text-[10px] font-bold transition-colors capitalize ${viewsFilter === v ? 'bg-red-400 text-black' : 'bg-slate-700 text-ink'}`}>{v}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredIdeas.map((idea, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-red-400/30 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getTypeIcon(idea.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-ink font-bold text-sm flex-1">{idea.title}</p>
                      <button onClick={() => copyTitle(idea.title, i)} className="p-1 hover:bg-slate-700 rounded transition-colors flex-shrink-0">
                        {copiedIdx === i ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-ink/60" />}
                      </button>
                    </div>
                    <p className="text-ink/60 text-xs mt-1">{idea.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-ink/40 uppercase">{idea.type}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${getDiffColor(idea.difficulty)}`}>{idea.difficulty}</span>
                      <span className={`text-[10px] font-bold uppercase ${getViewsColor(idea.estimatedViews)}`}>{idea.estimatedViews} views</span>
                    </div>
                    {idea.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {idea.keywords.map((k, j) => <span key={j} className="px-1.5 py-0.5 bg-slate-700 rounded text-[9px] text-ink/60">{k}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
