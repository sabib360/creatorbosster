import { useState } from 'react';
import { Copy, Check, Mail, Sparkles, AlertCircle, BarChart3 } from 'lucide-react';
import { generateEmailSubjectLines, type EmailSubjectResult } from '../../lib/gemini';

export default function EmailSubjectLineGenerator() {
  const [content, setContent] = useState('');
  const [subjects, setSubjects] = useState<EmailSubjectResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!content.trim()) { setError('Please enter email content or topic'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateEmailSubjectLines(content); setSubjects(r); } catch { setError('Failed to generate subject lines.'); } finally { setIsGenerating(false); }
  };

  const copySubject = async (text: string, idx: number) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><Mail className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Email Subject Line Generator</h1>
        <p className="text-ink/60">Generate 15+ subject lines with open rate predictions and A/B test suggestions</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Email Content or Topic *</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Describe your email content or paste the email body..." className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-primary" />
        <button onClick={handleGenerate} disabled={isGenerating || !content.trim()} className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating...' : <><Sparkles className="w-5 h-5" /> Generate Subject Lines</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {subjects.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{subjects.length} Subject Lines</h3>
          {subjects.map((s, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-ink font-bold">{s.emoji} {s.subject}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-ink/60">
                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Open rate: {s.openRatePrediction}</span>
                    {s.personalizationToken && <span className="text-primary">{s.personalizationToken}</span>}
                  </div>
                </div>
                <button onClick={() => copySubject(s.subject, i)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
                  {copiedIdx === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-ink/60" />}
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h4 className="font-bold text-primary text-sm uppercase mb-2">A/B Test Tip</h4>
            <p className="text-ink/70 text-sm">Pick 2-3 subject lines with different styles (curiosity vs urgency vs value) and test them with 20% of your list first. Send the winner to the remaining 80%.</p>
          </div>
        </div>
      )}
    </div>
  );
}
