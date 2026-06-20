import { useState, useCallback } from 'react';
import { Calculator, FileText, AlertCircle } from 'lucide-react';

interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
  keywordDensity: { word: string; count: number; density: number }[];
}

export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);

  const analyze = useCallback((input: string) => {
    if (!input.trim()) { setStats(null); return; }

    const words = input.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const charCount = input.length;
    const charNoSpaces = input.replace(/\s/g, '').length;
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || 1;

    const readingMinutes = Math.ceil(wordCount / 200);
    const speakingMinutes = Math.ceil(wordCount / 130);

    const wordFreq: Record<string, number> = {};
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 3) wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    });

    const keywordDensity = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count, density: parseFloat((count / wordCount * 100).toFixed(2)) }));

    setStats({
      words: wordCount,
      characters: charCount,
      charactersNoSpaces: charNoSpaces,
      sentences,
      paragraphs,
      readingTime: readingMinutes < 60 ? `${readingMinutes} min` : `${Math.floor(readingMinutes / 60)}h ${readingMinutes % 60}m`,
      speakingTime: speakingMinutes < 60 ? `${speakingMinutes} min` : `${Math.floor(speakingMinutes / 60)}h ${speakingMinutes % 60}m`,
      keywordDensity,
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    analyze(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setText(content);
      analyze(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><Calculator className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Word Counter & Reading Time</h1>
        <p className="text-ink/60">Count words, characters, sentences, and analyze keyword density</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="flex items-center justify-between">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Your Text *</label>
          <label className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors cursor-pointer flex items-center gap-1">
            <FileText className="w-3 h-3" /> Upload .txt
            <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
        <textarea value={text} onChange={handleChange} placeholder="Paste or type your text here..." className="w-full h-48 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-primary font-mono text-sm" />
      </div>

      {stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Words', value: stats.words.toLocaleString() },
              { label: 'Characters', value: stats.characters.toLocaleString() },
              { label: 'No Spaces', value: stats.charactersNoSpaces.toLocaleString() },
              { label: 'Sentences', value: stats.sentences.toLocaleString() },
              { label: 'Paragraphs', value: stats.paragraphs.toLocaleString() },
              { label: 'Reading Time', value: stats.readingTime },
              { label: 'Speaking Time', value: stats.speakingTime },
              { label: 'Avg Words/Sentence', value: stats.sentences > 0 ? Math.round(stats.words / stats.sentences) : 0 },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 bg-slate-800/50 rounded-xl text-center">
                <div className="text-2xl font-black text-ink">{value}</div>
                <div className="text-xs text-ink/60 uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>

          {stats.keywordDensity.length > 0 && (
            <div className="p-5 bg-slate-800/50 rounded-2xl space-y-3">
              <h4 className="font-bold text-ink uppercase tracking-widest text-sm">Keyword Density (Top 10)</h4>
              <div className="space-y-2">
                {stats.keywordDensity.map((k, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-ink font-bold text-sm w-32 truncate">{k.word}</span>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(k.density * 5, 100)}%` }} />
                    </div>
                    <span className="text-ink/60 text-xs w-16 text-right">{k.density}% ({k.count}x)</span>
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
