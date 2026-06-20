import { useState } from 'react';
import { Copy, Check, Film, Sparkles, AlertCircle, Clock, Download } from 'lucide-react';
import { generateYouTubeScript, type ScriptResult } from '../../lib/gemini';

type ScriptStyle = 'educational' | 'entertaining' | 'storytelling' | 'review' | 'vlog';

export default function YouTubeScriptWriter() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('10 minutes');
  const [style, setStyle] = useState<ScriptStyle>('educational');
  const [script, setScript] = useState<ScriptResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a video topic'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateYouTubeScript(topic, duration, style); setScript(r); } catch { setError('Failed to generate script.'); } finally { setIsGenerating(false); }
  };

  const copyScript = async () => {
    if (!script) return;
    let text = `${script.title}\n\nHOOK:\n${script.hook}\n\n`;
    script.sections.forEach(s => { text += `[${s.timestamp}] ${s.section}\n${s.content}\n${s.notes ? `Notes: ${s.notes}\n` : ''}\n`; });
    text += `CTA:\n${script.cta}\n\nOUTRO:\n${script.outro}`;
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    if (!script) return;
    let text = `${script.title}\n\nHOOK:\n${script.hook}\n\n`;
    script.sections.forEach(s => { text += `[${s.timestamp}] ${s.section}\n${s.content}\n${s.notes ? `Notes: ${s.notes}\n` : ''}\n`; });
    text += `CTA:\n${script.cta}\n\nOUTRO:\n${script.outro}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `script_${topic.replace(/\s+/g, '_').substring(0, 30)}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  const styles: { value: ScriptStyle; label: string }[] = [
    { value: 'educational', label: 'Educational' }, { value: 'entertaining', label: 'Entertaining' },
    { value: 'storytelling', label: 'Storytelling' }, { value: 'review', label: 'Review' }, { value: 'vlog', label: 'Vlog' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto"><Film className="w-8 h-8 text-red-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">YouTube Script Writer</h1>
        <p className="text-ink/60">Generate complete video scripts with hooks, sections, and CTAs</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Video Topic *</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., How to grow on YouTube in 2025" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-red-400" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-ink/60">Duration</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink">
              <option>5 minutes</option><option>10 minutes</option><option>15 minutes</option><option>20 minutes</option><option>30 minutes</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-ink/60">Style</label>
            <div className="flex flex-wrap gap-1">
              {styles.map(s => (
                <button key={s.value} onClick={() => setStyle(s.value)} className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${style === s.value ? 'bg-red-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{s.label}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full py-4 bg-red-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-400/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Writing Script...' : <><Sparkles className="w-5 h-5" /> Generate Script</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {script && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-ink font-bold">{script.title}</h3>
              <p className="text-ink/60 text-sm">Duration: {script.totalDuration}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={copyScript} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
              <button onClick={downloadScript} className="px-3 py-2 bg-red-400 hover:bg-red-400/90 rounded-lg text-xs font-bold text-black transition-colors flex items-center gap-1"><Download className="w-3 h-3" /> Download</button>
            </div>
          </div>

          <div className="p-6 bg-red-400/5 border border-red-400/20 rounded-2xl">
            <h4 className="font-bold text-red-400 text-sm uppercase mb-2">Hook (First 5-10 seconds)</h4>
            <p className="text-ink italic">{script.hook}</p>
          </div>

          <div className="space-y-4">
            {script.sections.map((s, i) => (
              <div key={i} className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 bg-red-400/10 text-red-400 rounded text-xs font-bold font-mono">{s.timestamp}</span>
                  <h4 className="font-bold text-ink">{s.section}</h4>
                </div>
                <p className="text-ink/70 text-sm whitespace-pre-wrap leading-relaxed">{s.content}</p>
                {s.notes && <p className="mt-3 text-xs text-ink/40 italic">Production note: {s.notes}</p>}
              </div>
            ))}
          </div>

          <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="font-bold text-green-400 text-sm uppercase mb-2">Call to Action</h4>
            <p className="text-ink/70 text-sm">{script.cta}</p>
          </div>

          <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="font-bold text-blue-400 text-sm uppercase mb-2">Outro</h4>
            <p className="text-ink/70 text-sm">{script.outro}</p>
          </div>
        </div>
      )}
    </div>
  );
}
