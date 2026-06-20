import { useState } from 'react';
import { Sparkles, AlertCircle, Heart, Frown, Meh, TrendingUp } from 'lucide-react';
import { analyzeSentiment, type SentimentResult } from '../../lib/gemini';

export default function AISentimentAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) { setError('Please enter text to analyze'); return; }
    setIsAnalyzing(true); setError(null);
    try { const r = await analyzeSentiment(text); setResult(r); } catch { setError('Failed to analyze sentiment.'); } finally { setIsAnalyzing(false); }
  };

  const sentimentIcons: Record<string, any> = { positive: Heart, negative: Frown, neutral: Meh, mixed: TrendingUp };
  const sentimentColors: Record<string, string> = { positive: 'text-green-400 bg-green-400/10', negative: 'text-red-400 bg-red-400/10', neutral: 'text-yellow-400 bg-yellow-400/10', mixed: 'text-blue-400 bg-blue-400/10' };

  const emotionColors: Record<string, string> = {
    joy: '#22c55e', sadness: '#3b82f6', anger: '#ef4444', fear: '#a855f7',
    surprise: '#f59e0b', disgust: '#6b7280', trust: '#06b6d4', anticipation: '#f97316',
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><TrendingUp className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Sentiment Analyzer</h1>
        <p className="text-ink/60">Analyze sentiment, emotions, and key phrases in text</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Text to Analyze *</label>
        <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} placeholder="Paste text, reviews, comments, or any content to analyze..." className="w-full h-40 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-tertiary" />
        <div className="text-xs text-ink/60">{text.trim() ? text.trim().split(/\s+/).length : 0} words</div>
        <button onClick={handleAnalyze} disabled={isAnalyzing || !text.trim()} className="w-full py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isAnalyzing ? 'Analyzing...' : <><Sparkles className="w-5 h-5" /> Analyze Sentiment</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && (
        <div className="space-y-6">
          {/* Overall Sentiment */}
          <div className="p-6 bg-slate-800/50 rounded-2xl text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold capitalize ${sentimentColors[result.overall] || ''}`}>
              {(() => { const Icon = sentimentIcons[result.overall] || Meh; return <Icon className="w-5 h-5" />; })()}
              {result.overall}
            </div>
            <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden max-w-xs mx-auto">
              <div className={`h-full rounded-full ${result.overall === 'positive' ? 'bg-green-400' : result.overall === 'negative' ? 'bg-red-400' : 'bg-yellow-400'}`} style={{ width: `${result.confidence}%` }} />
            </div>
            <p className="text-ink/60 text-sm mt-2">Confidence: {result.confidence}%</p>
          </div>

          {/* Emotions */}
          <div className="p-5 bg-slate-800/50 rounded-2xl space-y-4">
            <h4 className="font-bold text-ink uppercase tracking-widest text-sm">Emotion Breakdown</h4>
            <div className="space-y-3">
              {result.emotions.sort((a, b) => b.score - a.score).map((e, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-ink capitalize w-24">{e.emotion}</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${e.score}%`, backgroundColor: emotionColors[e.emotion] || '#6b7280' }} />
                  </div>
                  <span className="text-xs text-ink/60 w-10 text-right">{e.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Phrases */}
          {result.keyPhrases.length > 0 && (
            <div className="p-5 bg-slate-800/50 rounded-2xl space-y-3">
              <h4 className="font-bold text-ink uppercase tracking-widest text-sm">Key Phrases</h4>
              <div className="flex flex-wrap gap-2">
                {result.keyPhrases.map((p, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-700 rounded-full text-sm text-ink/80">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="p-5 bg-tertiary/5 border border-tertiary/20 rounded-2xl">
            <h4 className="font-bold text-tertiary text-sm uppercase mb-2">Analysis Summary</h4>
            <p className="text-ink/70 text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
