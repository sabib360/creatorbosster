import { useState } from 'react';
import { Copy, Check, MessageCircle, Sparkles, AlertCircle } from 'lucide-react';
import { generateCommentReplies, type CommentReplyResult } from '../../lib/gemini';

type ReplyTone = 'friendly' | 'professional' | 'humorous' | 'enthusiastic' | 'concise';

export default function YouTubeCommentReplyGenerator() {
  const [comment, setComment] = useState('');
  const [tone, setTone] = useState<ReplyTone>('friendly');
  const [result, setResult] = useState<CommentReplyResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!comment.trim()) { setError('Please enter a comment to reply to'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateCommentReplies(comment, tone); setResult(r); } catch { setError('Failed to generate replies.'); } finally { setIsGenerating(false); }
  };

  const copyReply = async (text: string, idx: number) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  const tones: { value: ReplyTone; label: string }[] = [
    { value: 'friendly', label: 'Friendly' }, { value: 'professional', label: 'Professional' },
    { value: 'humorous', label: 'Humorous' }, { value: 'enthusiastic', label: 'Enthusiastic' }, { value: 'concise', label: 'Concise' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto"><MessageCircle className="w-8 h-8 text-red-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Comment Reply Generator</h1>
        <p className="text-ink/60">Generate professional, engaging replies to YouTube comments</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Comment to Reply To</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Paste the YouTube comment you want to reply to..." className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-red-400" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Tone</label>
          <div className="flex flex-wrap gap-2">
            {tones.map(t => (
              <button key={t.value} onClick={() => setTone(t.value)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${tone === t.value ? 'bg-red-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{t.label}</button>
            ))}
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !comment.trim()} className="w-full py-4 bg-red-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-400/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating Replies...' : <><Sparkles className="w-5 h-5" /> Generate Replies</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && result.replies.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{result.replies.length} Reply Suggestions</h3>
          {result.replies.map((r, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-red-400/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{r.tone}</span>
                  <p className="text-ink text-sm mt-1">{r.reply}</p>
                </div>
                <button onClick={() => copyReply(r.reply, i)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
                  {copiedIdx === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-ink/60" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
