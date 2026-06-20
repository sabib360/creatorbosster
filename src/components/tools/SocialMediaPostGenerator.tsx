import { useState } from 'react';
import { Copy, Check, MessageCircle, Sparkles, AlertCircle } from 'lucide-react';
import { generateSocialPosts, type SocialPostResult } from '../../lib/gemini';

type Platform = 'twitter' | 'instagram' | 'facebook' | 'linkedin';

export default function SocialMediaPostGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [posts, setPosts] = useState<SocialPostResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a topic'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateSocialPosts(topic, platform); setPosts(r); } catch { setError('Failed to generate posts.'); } finally { setIsGenerating(false); }
  };

  const copyPost = async (text: string, idx: number) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  const limits: Record<Platform, number> = { twitter: 280, instagram: 2200, facebook: 63206, linkedin: 3000 };
  const platformIcons: Record<Platform, string> = { twitter: '🐦', instagram: '📸', facebook: '👥', linkedin: '💼' };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><MessageCircle className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Social Media Post Generator</h1>
        <p className="text-ink/60">Generate platform-specific posts with hashtags and emojis</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Topic *</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., New product launch announcement" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Platform</label>
          <div className="flex gap-2">
            {(['twitter', 'instagram', 'facebook', 'linkedin'] as Platform[]).map(p => (
              <button key={p} onClick={() => setPlatform(p)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors capitalize ${platform === p ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{platformIcons[p]} {p}</button>
            ))}
          </div>
        </div>
        <div className="text-xs text-ink/40">Character limit: {limits[platform].toLocaleString()}</div>
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating...' : <><Sparkles className="w-5 h-5" /> Generate Posts</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {posts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{posts.length} Variations</h3>
          {posts.map((p, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-ink text-sm whitespace-pre-wrap">{p.post}</p>
                  {p.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.hashtags.slice(0, 10).map((h, j) => <span key={j} className="text-primary text-xs">{h}</span>)}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-ink/60">
                    <span>{p.charCount} chars</span>
                    <span>•</span>
                    <span>{p.hashtags.length} hashtags</span>
                  </div>
                </div>
                <button onClick={() => copyPost(p.post, i)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
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
