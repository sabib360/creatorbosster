import { useState } from 'react';
import { Upload, Copy, Check, Type, Sparkles, AlertCircle, BarChart3 } from 'lucide-react';
import { generateYouTubeTitles, type TitleResult } from '../../lib/gemini';

type TitleStyle = 'mixed' | 'curiosity' | 'list' | 'howto' | 'emotional' | 'question';

export default function YouTubeTitleGenerator() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<TitleStyle>('mixed');
  const [titles, setTitles] = useState<TitleResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a video topic'); return; }
    setIsGenerating(true); setError(null);
    try {
      const result = await generateYouTubeTitles(topic, style);
      setTitles(result);
    } catch { setError('Failed to generate titles. Please try again.'); } finally { setIsGenerating(false); }
  };

  const copyTitle = async (title: string, idx: number) => {
    try { await navigator.clipboard.writeText(title); } catch {
      const t = document.createElement('textarea'); t.value = title; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = async () => {
    const text = titles.map(t => t.title).join('\n');
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
  };

  const getScoreColor = (score: number) => score >= 8 ? 'text-green-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400';

  const styles: { value: TitleStyle; label: string }[] = [
    { value: 'mixed', label: 'Mixed' }, { value: 'curiosity', label: 'Curiosity' }, { value: 'list', label: 'List-Based' },
    { value: 'howto', label: 'How-To' }, { value: 'emotional', label: 'Emotional' }, { value: 'question', label: 'Question' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto"><Type className="w-8 h-8 text-red-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">YouTube Title Generator</h1>
        <p className="text-ink/60">Generate catchy, SEO-optimized titles that drive clicks</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Video Topic</label>
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., How to start a YouTube channel in 2025" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-red-400" onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Title Style</label>
          <div className="flex flex-wrap gap-2">
            {styles.map(s => (
              <button key={s.value} onClick={() => setStyle(s.value)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${style === s.value ? 'bg-red-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{s.label}</button>
            ))}
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full py-4 bg-red-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-400/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating...' : <><Sparkles className="w-5 h-5" /> Generate Titles</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {titles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{titles.length} Titles Generated</h3>
            <button onClick={copyAll} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-ink transition-colors flex items-center gap-1"><Copy className="w-3 h-3" /> Copy All</button>
          </div>
          <div className="space-y-3">
            {titles.map((t, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-red-400/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-ink font-bold">{t.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-ink/60">{t.charCount} chars</span>
                      <span className="text-ink/60">•</span>
                      <span className="text-ink/60 capitalize">{t.style}</span>
                      <span className="text-ink/60">•</span>
                      <span className={`font-bold ${getScoreColor(t.clickbaitScore)}`}>CTR: {t.clickbaitScore}/10</span>
                    </div>
                  </div>
                  <button onClick={() => copyTitle(t.title, i)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
                    {copiedIdx === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-ink/60" />}
                  </button>
                </div>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${t.clickbaitScore >= 8 ? 'bg-green-400' : t.clickbaitScore >= 5 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${t.clickbaitScore * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
