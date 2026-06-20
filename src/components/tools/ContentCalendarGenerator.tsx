import { useState } from 'react';
import { Calendar, Sparkles, AlertCircle, Download, Copy, Check } from 'lucide-react';
import { generateContentCalendar, type CalendarDay } from '../../lib/gemini';

type Platform = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok';

export default function ContentCalendarGenerator() {
  const [niche, setNiche] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>(['instagram', 'twitter']);
  const [frequency, setFrequency] = useState('daily');
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const togglePlatform = (p: Platform) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleGenerate = async () => {
    if (!niche.trim()) { setError('Please enter your niche'); return; }
    if (platforms.length === 0) { setError('Please select at least one platform'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateContentCalendar(niche, platforms, frequency); setCalendar(r); } catch { setError('Failed to generate calendar.'); } finally { setIsGenerating(false); }
  };

  const exportCSV = () => {
    if (calendar.length === 0) return;
    const headers = ['Day', 'Date', 'Platform', 'Content Type', 'Topic', 'Caption', 'Hashtags', 'Best Time', 'Category'];
    const rows = calendar.map(d => [d.day, d.date, d.platform, d.contentType, d.topic, `"${d.caption.replace(/"/g, '""')}"`, d.hashtags.join(' '), d.bestTime, d.category]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `content_calendar_${niche.replace(/\s+/g, '_')}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const copyCalendar = async () => {
    const text = calendar.map(d => `Day ${d.day} (${d.date}) - ${d.platform}\n${d.contentType}: ${d.topic}\n${d.caption}\n${d.hashtags.join(' ')}\nBest time: ${d.bestTime}\n`).join('\n---\n\n');
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const catColors: Record<string, string> = {
    educational: 'bg-blue-400/10 text-blue-400',
    promotional: 'bg-green-400/10 text-green-400',
    engagement: 'bg-yellow-400/10 text-yellow-400',
    entertainment: 'bg-purple-400/10 text-purple-400',
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><Calendar className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Content Calendar Generator</h1>
        <p className="text-ink/60">Generate a 30-day content calendar with topics, captions, and best posting times</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Your Niche *</label>
          <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g., Digital marketing, fitness, cooking" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {(['instagram', 'twitter', 'facebook', 'linkedin', 'tiktok'] as Platform[]).map(p => (
              <button key={p} onClick={() => togglePlatform(p)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors capitalize ${platforms.includes(p) ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{p}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Posting Frequency</label>
          <div className="flex gap-2">
            {['daily', '5x week', '3x week', 'weekly'].map(f => (
              <button key={f} onClick={() => setFrequency(f)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${frequency === f ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{f}</button>
            ))}
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !niche.trim() || platforms.length === 0} className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating Calendar...' : <><Sparkles className="w-5 h-5" /> Generate 30-Day Calendar</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {calendar.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{calendar.length} Days Planned</h3>
            <div className="flex gap-2">
              <button onClick={copyCalendar} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
              <button onClick={exportCSV} className="px-3 py-1.5 bg-primary hover:bg-primary/90 rounded-lg text-xs font-bold text-black transition-colors flex items-center gap-1"><Download className="w-3 h-3" /> CSV</button>
            </div>
          </div>

          {/* Category Legend */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(catColors).map(([cat, color]) => (
              <span key={cat} className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${color}`}>{cat}</span>
            ))}
          </div>

          <div className="space-y-2">
            {calendar.map((d, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="text-center flex-shrink-0 w-12">
                    <div className="text-lg font-black text-ink">D{d.day}</div>
                    <div className="text-[10px] text-ink/40">{d.date}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary capitalize">{d.platform}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${catColors[d.category] || ''}`}>{d.category}</span>
                      <span className="text-[10px] text-ink/40">{d.bestTime}</span>
                    </div>
                    <p className="text-ink font-bold text-sm">{d.topic}</p>
                    <p className="text-ink/60 text-xs mt-1 line-clamp-2">{d.caption}</p>
                    {d.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {d.hashtags.slice(0, 5).map((h, j) => <span key={j} className="text-primary text-[10px]">{h}</span>)}
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
