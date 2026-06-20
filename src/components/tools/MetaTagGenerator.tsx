import { useState, useRef } from 'react';
import { Download, AlertCircle, Code, Eye, Globe, Copy, Check, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolPage from '../ToolPage';

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  robots: string;
  author: string;
  themeColor: string;
  articlePublished: string;
  articleSection: string;
}

const DEFAULT_DATA: MetaData = {
  title: '',
  description: '',
  keywords: '',
  canonicalUrl: 'https://example.com/',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  twitterSite: '',
  robots: 'index, follow',
  author: '',
  themeColor: '#0f172a',
  articlePublished: '',
  articleSection: '',
};

const OG_TYPES = ['website', 'article', 'product', 'profile', 'video.other'];
const ROBOTS_OPTIONS = ['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'];
const CARD_TYPES = ['summary', 'summary_large_image'];

export default function MetaTagGenerator() {
  const [data, setData] = useState<MetaData>(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState<'basic' | 'og' | 'twitter' | 'advanced'>('basic');
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<'google' | 'facebook' | 'twitter'>('google');
  const codeRef = useRef<HTMLTextAreaElement>(null);

  const update = (field: keyof MetaData, value: string) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !prev.ogTitle) next.ogTitle = value;
      if (field === 'description' && !prev.ogDescription) next.ogDescription = value;
      if (field === 'title' && !prev.twitterTitle) next.twitterTitle = value;
      if (field === 'description' && !prev.twitterDescription) next.twitterDescription = value;
      return next;
    });
  };

  const titleLen = data.title.length;
  const descLen = data.description.length;

  const generateHTML = (): string => {
    const lines: string[] = [];
    lines.push(`<!-- Primary Meta Tags -->`);
    lines.push(`<title>${data.title || 'Page Title'}</title>`);
    lines.push(`<meta name="title" content="${data.title || 'Page Title'}" />`);
    lines.push(`<meta name="description" content="${data.description || 'Page description'}" />`);
    if (data.keywords) lines.push(`<meta name="keywords" content="${data.keywords}" />`);
    if (data.author) lines.push(`<meta name="author" content="${data.author}" />`);
    lines.push(`<meta name="robots" content="${data.robots}" />`);
    if (data.themeColor) lines.push(`<meta name="theme-color" content="${data.themeColor}" />`);
    if (data.canonicalUrl) {
      lines.push('');
      lines.push(`<!-- Canonical URL -->`);
      lines.push(`<link rel="canonical" href="${data.canonicalUrl}" />`);
    }
    lines.push('');
    lines.push(`<!-- Open Graph / Facebook -->`);
    lines.push(`<meta property="og:type" content="${data.ogType}" />`);
    lines.push(`<meta property="og:url" content="${data.canonicalUrl || 'https://example.com/'}" />`);
    lines.push(`<meta property="og:title" content="${data.ogTitle || data.title || 'Page Title'}" />`);
    lines.push(`<meta property="og:description" content="${data.ogDescription || data.description || 'Page description'}" />`);
    if (data.ogImage) lines.push(`<meta property="og:image" content="${data.ogImage}" />`);
    lines.push('');
    lines.push(`<!-- Twitter -->`);
    lines.push(`<meta property="twitter:card" content="${data.twitterCard}" />`);
    if (data.twitterSite) lines.push(`<meta property="twitter:site" content="${data.twitterSite}" />`);
    lines.push(`<meta property="twitter:title" content="${data.twitterTitle || data.title || 'Page Title'}" />`);
    lines.push(`<meta property="twitter:description" content="${data.twitterDescription || data.description || 'Page description'}" />`);
    if (data.twitterImage) lines.push(`<meta property="twitter:image" content="${data.twitterImage}" />`);
    if (data.ogType === 'article') {
      lines.push('');
      lines.push(`<!-- Article Meta (for blog posts) -->`);
      if (data.articlePublished) lines.push(`<meta property="article:published_time" content="${data.articlePublished}" />`);
      if (data.articleSection) lines.push(`<meta property="article:section" content="${data.articleSection}" />`);
      if (data.author) lines.push(`<meta property="article:author" content="${data.author}" />`);
    }
    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateHTML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generateHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const inputClass = 'w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary';
  const labelClass = 'block text-sm font-semibold text-white mb-1';
  const selectClass = 'w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary';

  const renderBasic = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className={labelClass}>Page Title *</label>
          <span className={`text-xs ${titleLen > 60 ? 'text-red-400' : titleLen > 50 ? 'text-yellow-400' : 'text-gray-500'}`}>
            {titleLen}/60
          </span>
        </div>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="My Page Title - Brand Name"
          className={inputClass}
          maxLength={70}
        />
        <p className="text-xs text-gray-500">Recommended: 50-60 characters. Google truncates after ~60.</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className={labelClass}>Meta Description *</label>
          <span className={`text-xs ${descLen > 160 ? 'text-red-400' : descLen > 150 ? 'text-yellow-400' : 'text-gray-500'}`}>
            {descLen}/160
          </span>
        </div>
        <textarea
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="A concise summary of your page content..."
          rows={3}
          className={`${inputClass} resize-none`}
          maxLength={200}
        />
        <p className="text-xs text-gray-500">Recommended: 150-160 characters. Google shows ~155.</p>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Keywords</label>
        <input
          type="text"
          value={data.keywords}
          onChange={(e) => update('keywords', e.target.value)}
          placeholder="keyword1, keyword2, keyword3"
          className={inputClass}
        />
        <p className="text-xs text-gray-500">Comma-separated. Less impactful for Google but used by Bing/Yandex.</p>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Canonical URL</label>
        <input
          type="url"
          value={data.canonicalUrl}
          onChange={(e) => update('canonicalUrl', e.target.value)}
          placeholder="https://example.com/page"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass}>Author</label>
        <input
          type="text"
          value={data.author}
          onChange={(e) => update('author', e.target.value)}
          placeholder="Author name"
          className={inputClass}
        />
      </div>
    </div>
  );

  const renderOG = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className={labelClass}>OG Type</label>
        <select value={data.ogType} onChange={(e) => update('ogType', e.target.value)} className={selectClass}>
          {OG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className={labelClass}>OG Title</label>
        <input type="text" value={data.ogTitle} onChange={(e) => update('ogTitle', e.target.value)} placeholder="Same as page title, or customize" className={inputClass} />
        <p className="text-xs text-gray-500">Defaults to page title if left empty.</p>
      </div>
      <div className="space-y-2">
        <label className={labelClass}>OG Description</label>
        <textarea value={data.ogDescription} onChange={(e) => update('ogDescription', e.target.value)} placeholder="Same as meta description, or customize" rows={2} className={`${inputClass} resize-none`} />
      </div>
      <div className="space-y-2">
        <label className={labelClass}>OG Image URL</label>
        <input type="url" value={data.ogImage} onChange={(e) => update('ogImage', e.target.value)} placeholder="https://example.com/image.jpg" className={inputClass} />
        <p className="text-xs text-gray-500">Recommended: 1200x630px for Facebook, 1200x675px for Twitter.</p>
      </div>
      {data.ogType === 'article' && (
        <>
          <div className="space-y-2">
            <label className={labelClass}>Article Published Time</label>
            <input type="datetime-local" value={data.articlePublished} onChange={(e) => update('articlePublished', e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Article Section</label>
            <input type="text" value={data.articleSection} onChange={(e) => update('articleSection', e.target.value)} placeholder="Technology, Blog, etc." className={inputClass} />
          </div>
        </>
      )}
    </div>
  );

  const renderTwitter = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className={labelClass}>Card Type</label>
        <div className="grid grid-cols-2 gap-3">
          {CARD_TYPES.map((ct) => (
            <button
              key={ct}
              onClick={() => update('twitterCard', ct)}
              className={`px-4 py-3 rounded-lg font-semibold transition ${data.twitterCard === ct ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300 hover:text-white border border-slate-600'}`}
            >
              {ct === 'summary' ? 'Summary (Small Image)' : 'Summary Large Image'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className={labelClass}>Twitter Handle</label>
        <input type="text" value={data.twitterSite} onChange={(e) => update('twitterSite', e.target.value)} placeholder="@yourhandle" className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className={labelClass}>Twitter Title</label>
        <input type="text" value={data.twitterTitle} onChange={(e) => update('twitterTitle', e.target.value)} placeholder="Same as page title, or customize" className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className={labelClass}>Twitter Description</label>
        <textarea value={data.twitterDescription} onChange={(e) => update('twitterDescription', e.target.value)} placeholder="Same as meta description, or customize" rows={2} className={`${inputClass} resize-none`} />
      </div>
      <div className="space-y-2">
        <label className={labelClass}>Twitter Image URL</label>
        <input type="url" value={data.twitterImage} onChange={(e) => update('twitterImage', e.target.value)} placeholder="https://example.com/image.jpg" className={inputClass} />
      </div>
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className={labelClass}>Robots Directive</label>
        <select value={data.robots} onChange={(e) => update('robots', e.target.value)} className={selectClass}>
          {ROBOTS_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className={labelClass}>Theme Color</label>
        <div className="flex gap-3 items-center">
          <input type="color" value={data.themeColor} onChange={(e) => update('themeColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
          <input type="text" value={data.themeColor} onChange={(e) => update('themeColor', e.target.value)} placeholder="#0f172a" className={inputClass} />
        </div>
      </div>
    </div>
  );

  const renderGooglePreview = () => (
    <div className="bg-white rounded-lg p-5 max-w-lg">
      <div className="flex items-center gap-2 mb-1">
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-green-700 truncate">{data.canonicalUrl || 'https://example.com'}</span>
      </div>
      <h3 className="text-lg text-blue-700 hover:underline cursor-pointer mb-1">
        {data.title || 'Page Title'}
      </h3>
      <p className="text-sm text-gray-600 leading-snug">
        {data.description || 'No description provided. Google will generate one from your page content.'}
      </p>
    </div>
  );

  const renderFacebookPreview = () => (
    <div className="bg-white rounded-lg overflow-hidden max-w-lg border border-gray-200">
      {data.ogImage && (
        <img src={data.ogImage} alt="" className="w-full h-48 object-cover bg-gray-100" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      )}
      {!data.ogImage && <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{(data.canonicalUrl || 'example.com').replace(/^https?:\/\//, '').replace(/\/.*$/, '')}</p>
        <h3 className="font-bold text-gray-900 mb-1">{data.ogTitle || data.title || 'Page Title'}</h3>
        <p className="text-sm text-gray-600">{data.ogDescription || data.description || 'No description provided.'}</p>
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="bg-white rounded-2xl overflow-hidden max-w-lg border border-gray-200">
      {data.twitterImage && (
        <img src={data.twitterImage} alt="" className="w-full h-48 object-cover bg-gray-100" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      )}
      {!data.twitterImage && <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1">{data.twitterTitle || data.title || 'Page Title'}</h3>
        <p className="text-sm text-gray-600 mb-2">{data.twitterDescription || data.description || 'No description provided.'}</p>
        <p className="text-xs text-gray-400 truncate">{(data.canonicalUrl || 'example.com').replace(/^https?:\/\//, '')}</p>
      </div>
    </div>
  );

  const tabs = [
    { id: 'basic' as const, label: 'Basic', icon: Tag },
    { id: 'og' as const, label: 'Open Graph', icon: Globe },
    { id: 'twitter' as const, label: 'Twitter', icon: Code },
    { id: 'advanced' as const, label: 'Advanced', icon: Eye },
  ];

  return (
    <ToolPage>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meta Tag Generator</h1>
          <p className="text-gray-400">Generate SEO meta tags, Open Graph, and Twitter Card tags with live preview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-800/50 border border-slate-700 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-semibold transition flex items-center justify-center gap-1 ${
                    activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              {activeTab === 'basic' && renderBasic()}
              {activeTab === 'og' && renderOG()}
              {activeTab === 'twitter' && renderTwitter()}
              {activeTab === 'advanced' && renderAdvanced()}
            </div>
          </div>

          {/* Right: Preview + Code */}
          <div className="space-y-4">
            {/* Preview Mode Selector */}
            <div className="flex gap-2">
              {(['google', 'facebook', 'twitter'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    previewMode === mode ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300 hover:text-white border border-slate-600'
                  }`}
                >
                  {mode === 'google' ? 'Google SERP' : mode === 'facebook' ? 'Facebook' : 'Twitter / X'}
                </button>
              ))}
            </div>

            {/* Live Preview */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Live Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
                {previewMode === 'google' && renderGooglePreview()}
                {previewMode === 'facebook' && renderFacebookPreview()}
                {previewMode === 'twitter' && renderTwitterPreview()}
              </div>
            </div>

            {/* Generated Code */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-400">Generated HTML</h3>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleDownload} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
              <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto max-h-80 overflow-y-auto">
                <code>{generateHTML()}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Character Count Guide */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-white">Character Count Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Title tag</span>
                <span className={`text-sm font-semibold ${titleLen > 60 ? 'text-red-400' : titleLen > 50 ? 'text-yellow-400' : 'text-green-400'}`}>{titleLen}/60</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${titleLen > 60 ? 'bg-red-500' : titleLen > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min((titleLen / 60) * 100, 100)}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Meta description</span>
                <span className={`text-sm font-semibold ${descLen > 160 ? 'text-red-400' : descLen > 150 ? 'text-yellow-400' : 'text-green-400'}`}>{descLen}/160</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${descLen > 160 ? 'bg-red-500' : descLen > 150 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min((descLen / 160) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-white">✨ Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Live preview for Google SERP, Facebook, and Twitter/X</li>
            <li>✓ Auto-populate OG tags from basic fields</li>
            <li>✓ Character count with best-practice warnings</li>
            <li>✓ Support for article meta (published time, section)</li>
            <li>✓ Copy to clipboard or download as HTML file</li>
            <li>✓ Robots directive and theme color configuration</li>
            <li>✓ 100% free, runs entirely in your browser</li>
          </ul>
        </div>
      </motion.div>
    </ToolPage>
  );
}
