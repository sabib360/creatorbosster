import { useState } from 'react';
import { Copy, Check, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { paraphraseContent, type ParaphraseResult } from '../../lib/gemini';

export default function ContentParaphraser() {
  const [inputText, setInputText] = useState('');
  const [versions, setVersions] = useState<ParaphraseResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const originalWordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const handleGenerate = async () => {
    if (!inputText.trim()) { setError('Please enter text to paraphrase'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await paraphraseContent(inputText, 'all'); setVersions(r); } catch { setError('Failed to paraphrase content.'); } finally { setIsGenerating(false); }
  };

  const copyText = async (text: string, idx: number) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  const toneColors: Record<string, string> = {
    Professional: 'bg-blue-400/10 text-blue-400',
    Casual: 'bg-green-400/10 text-green-400',
    Academic: 'bg-purple-400/10 text-purple-400',
    Creative: 'bg-yellow-400/10 text-yellow-400',
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><RefreshCw className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Content Paraphraser</h1>
        <p className="text-ink/60">Rewrite content in Professional, Casual, Academic, or Creative tones</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Original Text *</label>
        <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Paste the text you want to paraphrase..." className="w-full h-40 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-primary" />
        <div className="flex items-center justify-between text-xs text-ink/60">
          <span>{originalWordCount} words</span>
          <span>Guaranteed plagiarism-free</span>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !inputText.trim()} className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Paraphrasing...' : <><Sparkles className="w-5 h-5" /> Paraphrase</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {versions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">4 Tone Variations</h3>
          {versions.map((v, i) => (
            <div key={i} className="p-5 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${toneColors[v.tone] || 'bg-slate-700 text-ink'}`}>{v.tone}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink/60">{v.wordCount} words ({v.wordCount > originalWordCount ? '+' : ''}{v.wordCount - originalWordCount})</span>
                  <button onClick={() => copyText(v.text, i)} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                    {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-ink/60" />}
                  </button>
                </div>
              </div>
              <p className="text-ink/70 text-sm leading-relaxed whitespace-pre-wrap">{v.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
