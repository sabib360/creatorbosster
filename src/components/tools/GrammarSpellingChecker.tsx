import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import { checkGrammar, type GrammarCheckResult } from '../../lib/gemini';

export default function GrammarSpellingChecker() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<GrammarCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!inputText.trim()) { setError('Please enter text to check'); return; }
    setIsChecking(true); setError(null);
    try { const r = await checkGrammar(inputText); setResult(r); } catch { setError('Failed to check grammar.'); } finally { setIsChecking(false); }
  };

  const typeIcons: Record<string, string> = { spelling: '🔤', grammar: '📐', punctuation: '❓', style: '✨' };
  const typeColors: Record<string, string> = { spelling: 'bg-red-400/10 text-red-400', grammar: 'bg-yellow-400/10 text-yellow-400', punctuation: 'bg-blue-400/10 text-blue-400', style: 'bg-green-400/10 text-green-400' };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><BookOpen className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Grammar & Spelling Checker</h1>
        <p className="text-ink/60">Check for spelling, grammar, punctuation, and style errors</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Text to Check *</label>
        <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Paste your text here to check for grammar and spelling errors..." className="w-full h-40 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-primary" />
        <button onClick={handleCheck} disabled={isChecking || !inputText.trim()} className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isChecking ? 'Checking...' : <><Sparkles className="w-5 h-5" /> Check Grammar</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && (
        <div className="space-y-6">
          {/* Scores */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-slate-800/50 rounded-xl text-center">
              <div className={`text-3xl font-black ${result.readabilityScore >= 70 ? 'text-green-400' : result.readabilityScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{result.readabilityScore}</div>
              <div className="text-xs text-ink/60 uppercase">Readability</div>
              <div className="text-xs text-ink/40">{result.readabilityLabel}</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl text-center">
              <div className="text-3xl font-black text-ink">{result.overallGrade}</div>
              <div className="text-xs text-ink/60 uppercase">Grade Level</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl text-center">
              <div className="text-3xl font-black text-ink">{result.errors.length}</div>
              <div className="text-xs text-ink/60 uppercase">Issues Found</div>
            </div>
          </div>

          {/* Corrected Text */}
          <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-2xl">
            <h4 className="font-bold text-green-400 text-sm uppercase mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Corrected Text</h4>
            <p className="text-ink/70 text-sm whitespace-pre-wrap leading-relaxed">{result.correctedText}</p>
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-ink uppercase tracking-widest text-sm">Issues Found ({result.errors.length})</h4>
              {result.errors.map((e, i) => (
                <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${typeColors[e.type] || ''}`}>{typeIcons[e.type]} {e.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-red-400 line-through">{e.original}</span>
                    <span className="text-ink/40">→</span>
                    <span className="text-green-400 font-bold">{e.corrected}</span>
                  </div>
                  <p className="text-ink/60 text-xs mt-1">{e.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {result.errors.length === 0 && (
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl text-center">
              <p className="text-green-400 font-bold">No errors found! Your text looks great.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
