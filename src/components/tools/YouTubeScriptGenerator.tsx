import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Check, Sparkles, AlertCircle, Clock, Download, Heart, Share2,
  Trash2, RefreshCw, Film, Wand2, ChevronDown, ChevronUp, Target,
  TrendingUp, Eye, MessageSquare, BookOpen, Zap, Star
} from 'lucide-react';
import {
  generateYouTubeScript,
  SCRIPT_TEMPLATES,
  type VideoType,
  type Tone,
  type Duration,
  type ScriptResult,
  type ScriptTemplate
} from '../../lib/gemini/scriptGenerator';

/* ─── Types ──────────────────────────────────────── */

interface HistoryItem {
  id: string;
  topic: string;
  videoType: VideoType;
  tone: Tone;
  duration: Duration;
  title: string;
  preview: string;
  date: string;
  isFavorite: boolean;
}

/* ─── Constants ──────────────────────────────────── */

const VIDEO_TYPES: { value: VideoType; label: string; icon: string }[] = [
  { value: 'educational', label: 'Educational', icon: '📚' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'vlog', label: 'Vlog', icon: '📹' },
  { value: 'review', label: 'Review', icon: '⭐' },
  { value: 'tutorial', label: 'Tutorial', icon: '🛠️' },
  { value: 'storytelling', label: 'Storytelling', icon: '📖' },
  { value: 'motivation', label: 'Motivation', icon: '🔥' },
  { value: 'tech', label: 'Tech Video', icon: '💻' },
];

const TONES: { value: Tone; label: string; icon: string }[] = [
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'funny', label: 'Funny', icon: '😂' },
  { value: 'emotional', label: 'Emotional', icon: '❤️' },
  { value: 'dramatic', label: 'Dramatic', icon: '🎭' },
  { value: 'informative', label: 'Informative', icon: '📊' },
  { value: 'engaging', label: 'Engaging', icon: '💬' },
  { value: 'viral', label: 'Viral', icon: '🚀' },
];

const DURATIONS: { value: Duration; label: string; time: string }[] = [
  { value: 'short', label: 'Short', time: '1–3 min' },
  { value: 'medium', label: 'Medium', time: '4–8 min' },
  { value: 'long', label: 'Long', time: '8–15 min' },
];

const EXAMPLE_TOPICS = [
  'How to grow on YouTube in 2026',
  'AI tools for students',
  'Top 10 gadgets 2026',
  'Day in the life of a developer',
  'React vs Vue in 2026',
  'How I made $10K in a month',
];

const HISTORY_KEY = 'yt-script-generator-history';

/* ─── Helper Functions ───────────────────────────── */

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function formatScript(result: ScriptResult): string {
  let text = `${result.title}\n\n`;
  text += `HOOK:\n${result.hook}\n\n`;
  text += `INTRO:\n${result.intro}\n\n`;
  result.sections.forEach((s) => {
    text += `[${s.timestamp}] ${s.section}\n`;
    text += `${s.content}\n`;
    if (s.keyPoints.length > 0) {
      text += `Key Points:\n${s.keyPoints.map((p) => `• ${p}`).join('\n')}\n`;
    }
    if (s.notes) text += `Production Note: ${s.notes}\n`;
    if (s.retentionTip) text += `Retention Tip: ${s.retentionTip}\n`;
    text += '\n';
  });
  text += `ENGAGEMENT BOOST:\n${result.engagementLines.map((l) => `• ${l}`).join('\n')}\n\n`;
  text += `CTA:\n${result.cta}\n\n`;
  text += `OUTRO:\n${result.outro}\n\n`;
  text += `---\n`;
  text += `Tags: ${result.tags.join(', ')}\n`;
  text += `Word Count: ${result.wordCount}\n`;
  text += `Duration: ${result.totalDuration}\n`;
  return text;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-400';
  if (score >= 60) return 'bg-yellow-400';
  return 'bg-red-400';
}

/* ─── Main Component ─────────────────────────────── */

export default function YouTubeScriptGenerator() {
  // Input state
  const [topic, setTopic] = useState('');
  const [videoType, setVideoType] = useState<VideoType>('educational');
  const [tone, setTone] = useState<Tone>('engaging');
  const [duration, setDuration] = useState<Duration>('medium');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [language, setLanguage] = useState<'english' | 'bangla'>('english');

  // Generation state
  const [script, setScript] = useState<ScriptResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  // Load history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Save history
  const saveToHistory = useCallback(
    (result: ScriptResult, type: VideoType, t: Tone, d: Duration) => {
      const item: HistoryItem = {
        id: generateId(),
        topic,
        videoType: type,
        tone: t,
        duration: d,
        title: result.title,
        preview: result.hook.substring(0, 100) + '...',
        date: new Date().toISOString(),
        isFavorite: false,
      };
      const updated = [item, ...history].slice(0, 50);
      setHistory(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    },
    [topic, history]
  );

  // Apply template
  const applyTemplate = (template: ScriptTemplate) => {
    setVideoType(template.videoType);
    setTone(template.tone);
    setDuration(template.duration);
    setActiveTemplate(template.id);
  };

  // Generate script
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a video topic');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateYouTubeScript(topic, videoType, tone, duration, keywords, audience, language);
      setScript(result);
      saveToHistory(result, videoType, tone, duration);
    } catch (err) {
      console.error(err);
      setError('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy full script
  const copyScript = async () => {
    if (!script) return;
    const text = formatScript(script);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy single section
  const copySection = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const t = document.createElement('textarea');
      t.value = content;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);
    }
    setCopiedSection(index);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Download script
  const downloadScript = () => {
    if (!script) return;
    const text = formatScript(script);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script_${topic.replace(/\s+/g, '_').substring(0, 40)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share
  const shareScript = () => {
    if (!script) return;
    const text = `Check out this YouTube script I generated: "${script.title}" — Created with CreatorBoost AI`;
    if (navigator.share) {
      navigator.share({ title: script.title, text });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Toggle history favorite
  const toggleFavorite = (id: string) => {
    const updated = history.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h));
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  // Delete history item
  const deleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  // Toggle section expansion
  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const isExpanded = (index: number) => expandedSections[index] ?? true;

  return (
    <div className="space-y-8">
      {/* ─── Hero Section ─── */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
          <Film className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          YouTube Script Generator
        </h1>
        <p className="text-ink/60 max-w-2xl mx-auto">
          Create viral YouTube video scripts in seconds using AI. Professional hooks, structured content, and engagement-optimized writing.
        </p>
      </div>

      {/* ─── Script Templates ─── */}
      <div className="p-5 bg-slate-800/50 rounded-2xl">
        <h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-red-400" /> Quick Templates
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SCRIPT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => applyTemplate(tmpl)}
              className={`p-3 rounded-xl text-xs font-bold transition-all text-center ${
                activeTemplate === tmpl.id
                  ? 'bg-red-400 text-black'
                  : 'bg-slate-700 hover:bg-slate-600 text-ink'
              }`}
            >
              {tmpl.name}
            </button>
          ))}
        </div>
        {activeTemplate && (
          <p className="mt-2 text-xs text-ink/50">
            {SCRIPT_TEMPLATES.find((t) => t.id === activeTemplate)?.description}
          </p>
        )}
      </div>

      {/* ─── Input Form ─── */}
      <div className="space-y-5 p-6 bg-slate-800/50 rounded-2xl">
        {/* Topic */}
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Video Topic *</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., How to grow on YouTube in 2026"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-red-400 transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
          />
        </div>

        {/* Example Topics */}
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-full text-xs font-medium text-ink/70 hover:text-ink transition-colors"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Video Type */}
        <div className="space-y-2">
          <label className="text-sm text-ink/60 font-medium">Video Type</label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {VIDEO_TYPES.map((vt) => (
              <button
                key={vt.value}
                onClick={() => { setVideoType(vt.value); setActiveTemplate(null); }}
                className={`p-2 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-1 ${
                  videoType === vt.value
                    ? 'bg-red-400 text-black'
                    : 'bg-slate-700 hover:bg-slate-600 text-ink'
                }`}
              >
                <span className="text-base">{vt.icon}</span>
                {vt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div className="space-y-2">
          <label className="text-sm text-ink/60 font-medium">Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => { setTone(t.value); setActiveTemplate(null); }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                  tone === t.value
                    ? 'bg-red-400 text-black'
                    : 'bg-slate-700 hover:bg-slate-600 text-ink'
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm text-ink/60 font-medium">Duration</label>
          <div className="grid grid-cols-3 gap-3">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => { setDuration(d.value); setActiveTemplate(null); }}
                className={`p-3 rounded-xl text-center transition-all ${
                  duration === d.value
                    ? 'bg-red-400 text-black'
                    : 'bg-slate-700 hover:bg-slate-600 text-ink'
                }`}
              >
                <div className="font-bold text-sm">{d.label}</div>
                <div className="text-xs opacity-70">{d.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-ink/60 font-medium">Keywords (optional)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., youtube growth, algorithm"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm focus:outline-none focus:border-red-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-ink/60 font-medium">Target Audience (optional)</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., beginners, tech enthusiasts"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm focus:outline-none focus:border-red-400"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-ink/60 font-medium">Language</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('english')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  language === 'english' ? 'bg-red-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('bangla')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  language === 'bangla' ? 'bg-red-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="w-full py-4 bg-red-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-400/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Writing Script...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Script
            </>
          )}
        </button>
      </div>

      {/* ─── Error ─── */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Script Result ─── */}
      <AnimatePresence mode="wait">
        {script && (
          <motion.div
            key={script.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            {/* Title & Meta */}
            <div className="p-5 bg-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-ink font-bold text-lg">{script.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-ink/60">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {script.totalDuration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {script.wordCount} words</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Retention: <span className={getScoreColor(script.estimatedRetentionScore)}>{script.estimatedRetentionScore}/100</span></span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Engagement: <span className={getScoreColor(script.estimatedEngagementScore)}>{script.estimatedEngagementScore}/100</span></span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={copyScript} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                  {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
                <button onClick={downloadScript} className="px-3 py-2 bg-red-400 hover:bg-red-400/90 rounded-lg text-xs font-bold text-black transition-colors flex items-center gap-1">
                  <Download className="w-3 h-3" /> Download
                </button>
                <button onClick={shareScript} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                  <Share2 className="w-3 h-3" /> Share
                </button>
                <button onClick={handleGenerate} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
              </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ink/50 font-medium">Watch Retention</span>
                  <Eye className="w-4 h-4 text-ink/30" />
                </div>
                <div className="text-2xl font-bold text-ink">{script.estimatedRetentionScore}/100</div>
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getScoreBg(script.estimatedRetentionScore)}`} style={{ width: `${script.estimatedRetentionScore}%` }} />
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-ink/50 font-medium">Engagement Score</span>
                  <MessageSquare className="w-4 h-4 text-ink/30" />
                </div>
                <div className="text-2xl font-bold text-ink">{script.estimatedEngagementScore}/100</div>
                <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getScoreBg(script.estimatedEngagementScore)}`} style={{ width: `${script.estimatedEngagementScore}%` }} />
                </div>
              </div>
            </div>

            {/* Hook */}
            <div className="p-5 bg-red-400/5 border border-red-400/20 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-red-400 text-sm uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Hook (First 5-10 seconds)
                </h4>
                <button onClick={() => copySection(script.hook, -1)} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                  {copiedSection === -1 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-ink/40" />}
                </button>
              </div>
              <p className="text-ink italic leading-relaxed">{script.hook}</p>
            </div>

            {/* Intro */}
            <div className="p-5 bg-blue-400/5 border border-blue-400/20 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-blue-400 text-sm uppercase flex items-center gap-2">
                  <Star className="w-4 h-4" /> Intro
                </h4>
                <button onClick={() => copySection(script.intro, -2)} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                  {copiedSection === -2 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-ink/40" />}
                </button>
              </div>
              <p className="text-ink/70 text-sm whitespace-pre-wrap leading-relaxed">{script.intro}</p>
            </div>

            {/* Main Sections */}
            <div className="space-y-4">
              {script.sections.map((section, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection(i)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-red-400/10 text-red-400 rounded text-xs font-bold font-mono">{section.timestamp}</span>
                      <h4 className="font-bold text-ink text-sm">{section.section}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); copySection(section.content, i); }}
                        className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {copiedSection === i ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-ink/40" />}
                      </button>
                      {isExpanded(i) ? <ChevronUp className="w-4 h-4 text-ink/40" /> : <ChevronDown className="w-4 h-4 text-ink/40" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isExpanded(i) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-3">
                          <p className="text-ink/70 text-sm whitespace-pre-wrap leading-relaxed">{section.content}</p>
                          {section.keyPoints.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-ink/50 uppercase">Key Points:</span>
                              {section.keyPoints.map((point, j) => (
                                <div key={j} className="flex items-start gap-2 text-xs text-ink/60">
                                  <span className="text-red-400 mt-0.5">•</span>
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {section.notes && (
                            <div className="p-2 bg-slate-900/50 rounded-lg text-xs text-ink/40 italic">
                              🎬 Production Note: {section.notes}
                            </div>
                          )}
                          {section.retentionTip && (
                            <div className="p-2 bg-green-400/5 border border-green-400/20 rounded-lg text-xs text-green-400/80">
                              💡 Retention Tip: {section.retentionTip}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Engagement Boost Lines */}
            <div className="p-5 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl">
              <h4 className="font-bold text-yellow-400 text-sm uppercase mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Engagement Boost Lines
              </h4>
              <div className="space-y-2">
                {script.engagementLines.map((line, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink/70">
                    <span className="text-yellow-400 mt-0.5">💬</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-5 bg-green-400/5 border border-green-400/20 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-green-400 text-sm uppercase flex items-center gap-2">
                  <Target className="w-4 h-4" /> Call to Action
                </h4>
                <button onClick={() => copySection(script.cta, -3)} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                  {copiedSection === -3 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-ink/40" />}
                </button>
              </div>
              <p className="text-ink/70 text-sm whitespace-pre-wrap leading-relaxed">{script.cta}</p>
            </div>

            {/* Outro */}
            <div className="p-5 bg-blue-400/5 border border-blue-400/20 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-blue-400 text-sm uppercase flex items-center gap-2">
                  <Film className="w-4 h-4" /> Outro
                </h4>
                <button onClick={() => copySection(script.outro, -4)} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                  {copiedSection === -4 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-ink/40" />}
                </button>
              </div>
              <p className="text-ink/70 text-sm whitespace-pre-wrap leading-relaxed">{script.outro}</p>
            </div>

            {/* Tags */}
            <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
              <h4 className="font-bold text-ink text-sm uppercase mb-3">Suggested Tags</h4>
              <div className="flex flex-wrap gap-2">
                {script.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-700 rounded-full text-xs font-bold text-ink/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── History ─── */}
      {history.length > 0 && (
        <div className="p-5 bg-slate-800/50 rounded-2xl">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-ink/40" /> History ({history.length})
            </h3>
            <div className="flex items-center gap-2">
              {showHistory && (
                <button
                  onClick={(e) => { e.stopPropagation(); clearHistory(); }}
                  className="text-xs text-red-400 hover:text-red-300 font-bold"
                >
                  Clear All
                </button>
              )}
              {showHistory ? <ChevronUp className="w-4 h-4 text-ink/40" /> : <ChevronDown className="w-4 h-4 text-ink/40" />}
            </div>
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-2">
                  {history.slice(0, 10).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                      <button onClick={() => toggleFavorite(item.id)} className="flex-shrink-0">
                        <Heart className={`w-4 h-4 ${item.isFavorite ? 'text-red-400 fill-red-400' : 'text-ink/30'}`} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink font-bold text-sm truncate">{item.title}</p>
                        <p className="text-ink/50 text-xs">{item.topic} • {new Date(item.date).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3 text-ink/30" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
