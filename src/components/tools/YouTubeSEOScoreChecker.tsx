import { useState } from 'react';
import { BarChart3, Sparkles, AlertCircle, CheckCircle2, XCircle, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { checkYouTubeSEO, type SEOResult } from '../../lib/gemini';

export default function YouTubeSEOScoreChecker() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [result, setResult] = useState<SEOResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!title.trim()) { setError('Please enter at least a video title'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await checkYouTubeSEO(title, description, tags); setResult(r); } catch { setError('Failed to analyze SEO.'); } finally { setIsGenerating(false); }
  };

  const getScoreColor = (s: number) => s >= 80 ? 'text-green-400' : s >= 50 ? 'text-yellow-400' : 'text-red-400';
  const getScoreBg = (s: number) => s >= 80 ? 'bg-green-400' : s >= 50 ? 'bg-yellow-400' : 'bg-red-400';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto"><BarChart3 className="w-8 h-8 text-red-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">YouTube SEO Score Checker</h1>
        <p className="text-ink/60">Analyze and optimize your video metadata for maximum reach</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Video Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., 10 Python Tips Every Beginner Must Know" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-red-400" />
          <p className="text-xs text-ink/40">{title.length}/100 characters</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Paste your video description here..." className="w-full h-28 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm resize-none focus:outline-none focus:border-red-400" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Tags (comma separated)</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="python, programming, tutorial, beginner" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm focus:outline-none focus:border-red-400" />
        </div>
        <button onClick={handleCheck} disabled={isGenerating || !title.trim()} className="w-full py-4 bg-red-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-400/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Analyzing...' : <><Sparkles className="w-5 h-5" /> Check SEO Score</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="p-6 bg-slate-800/50 rounded-2xl text-center">
            <div className="text-6xl font-black text-ink mb-2">{result.overallScore}</div>
            <div className="text-ink/60 text-sm uppercase tracking-widest">Overall SEO Score</div>
            <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${getScoreBg(result.overallScore)}`} style={{ width: `${result.overallScore}%` }} />
            </div>
          </div>

          {/* Individual Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Title', score: result.titleScore },
              { label: 'Description', score: result.descriptionScore },
              { label: 'Tags', score: result.tagScore },
              { label: 'Thumbnail', score: result.thumbnailScore },
            ].map(({ label, score }) => (
              <div key={label} className="p-4 bg-slate-800/50 rounded-xl text-center">
                <div className={`text-2xl font-black ${getScoreColor(score)}`}>{score}</div>
                <div className="text-xs text-ink/60 uppercase mt-1">{label}</div>
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getScoreBg(score)}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-2">
              <h4 className="font-bold text-green-400 text-sm uppercase flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h4>
              {result.strengths.map((s, i) => <p key={i} className="text-ink/70 text-sm">• {s}</p>)}
            </div>
          )}

          {/* Weaknesses */}
          {result.weaknesses.length > 0 && (
            <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-2">
              <h4 className="font-bold text-red-400 text-sm uppercase flex items-center gap-2"><XCircle className="w-4 h-4" /> Weaknesses</h4>
              {result.weaknesses.map((w, i) => <p key={i} className="text-ink/70 text-sm">• {w}</p>)}
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-2">
              <h4 className="font-bold text-blue-400 text-sm uppercase flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Improvement Suggestions</h4>
              {result.suggestions.map((s, i) => <p key={i} className="text-ink/70 text-sm">• {s}</p>)}
            </div>
          )}

          {/* Keyword Analysis */}
          {result.keywordAnalysis.length > 0 && (
            <div className="p-5 bg-slate-800/50 rounded-2xl space-y-3">
              <h4 className="font-bold text-ink text-sm uppercase flex items-center gap-2"><Target className="w-4 h-4" /> Keyword Analysis</h4>
              <div className="space-y-2">
                {result.keywordAnalysis.map((k, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-ink font-bold">{k.keyword}</span>
                    <span className="text-ink/60">×{k.frequency}</span>
                    <span className="text-ink/50 flex-1">{k.recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
