import { useState } from 'react';
import { Copy, Check, Globe, Sparkles, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { translateText, type TranslationResult } from '../../lib/gemini';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese',
  'Chinese (Simplified)', 'Chinese (Traditional)', 'Korean', 'Arabic', 'Hindi', 'Thai',
  'Vietnamese', 'Turkish', 'Dutch', 'Swedish', 'Polish', 'Czech', 'Romanian', 'Hungarian',
  'Greek', 'Hebrew', 'Indonesian', 'Malay', 'Filipino', 'Bengali', 'Tamil', 'Urdu',
];

export default function AITranslator() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) { setError('Please enter text to translate'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await translateText(text, sourceLang, targetLang); setResult(r); } catch { setError('Failed to translate.'); } finally { setIsGenerating(false); }
  };

  const swapLanguages = () => { setSourceLang(targetLang); setTargetLang(sourceLang); setResult(null); };

  const copyTranslation = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(result.translatedText); } catch {
      const t = document.createElement('textarea'); t.value = result.translatedText; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><Globe className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Translator</h1>
        <p className="text-ink/60">Translate text between 100+ languages with pronunciation guides</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        {/* Language Selectors */}
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <label className="text-xs text-ink/60 uppercase">From</label>
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm">
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button onClick={swapLanguages} className="mt-5 p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"><ArrowRightLeft className="w-4 h-4 text-ink" /></button>
          <div className="flex-1 space-y-1">
            <label className="text-xs text-ink/60 uppercase">To</label>
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm">
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} placeholder="Enter text to translate..." className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-tertiary" />

        <button onClick={handleTranslate} disabled={isGenerating || !text.trim()} className="w-full py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Translating...' : <><Sparkles className="w-5 h-5" /> Translate</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && (
        <div className="space-y-4">
          <div className="p-5 bg-tertiary/5 border border-tertiary/20 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-tertiary text-sm uppercase">Translation</h4>
              <button onClick={copyTranslation} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">{copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-ink/60" />}</button>
            </div>
            <p className="text-ink text-lg leading-relaxed">{result.translatedText}</p>
          </div>

          {result.pronunciation && (
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <p className="text-xs text-ink/60 uppercase mb-1">Pronunciation Guide</p>
              <p className="text-ink italic">{result.pronunciation}</p>
            </div>
          )}

          {result.alternatives.length > 0 && (
            <div className="p-4 bg-slate-800/50 rounded-xl space-y-2">
              <p className="text-xs text-ink/60 uppercase">Alternative Translations</p>
              {result.alternatives.map((alt, i) => (
                <p key={i} className="text-ink/70 text-sm">• {alt}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
