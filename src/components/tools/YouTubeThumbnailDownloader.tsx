import { useState, useEffect, useCallback } from 'react';
import {
  Download, AlertCircle, Loader, Link as LinkIcon, Image, Copy, Check,
  Share2, Facebook, Twitter, MessageCircle, Send, Trash2, Clock,
  ExternalLink, Maximize2, X, Eye, Sparkles, Zap, Shield, Smartphone,
  ArrowRight, ChevronDown, ChevronUp, Search, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Constants ──────────────────────────────────────── */

const THUMBNAIL_RESOLUTIONS = [
  { id: 'maxresdefault', label: 'Max Resolution', shortLabel: 'Max', width: 1280, height: 720, quality: 'Best' },
  { id: 'sddefault', label: 'Standard Definition', shortLabel: 'SD', width: 640, height: 480, quality: 'Good' },
  { id: 'hqdefault', label: 'High Quality', shortLabel: 'HQ', width: 480, height: 360, quality: 'High' },
  { id: 'mqdefault', label: 'Medium Quality', shortLabel: 'MQ', width: 320, height: 180, quality: 'Medium' },
  { id: 'default', label: 'Default', shortLabel: 'Default', width: 120, height: 90, quality: 'Low' },
];

const EXAMPLE_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', channel: 'Rick Astley' },
  { id: 'jNQXAC9IVRw', title: 'Me at the zoo', channel: 'jawed' },
  { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee', channel: 'Luis Fonsi' },
  { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE', channel: 'officialpsy' },
  { id: 'kJQP7kiw5Fk', title: 'Wiz Khalifa - See You Again ft. Charlie Puth', channel: 'Wiz Khalifa' },
];

const STORAGE_KEY = 'yt-thumb-recent';
const MAX_RECENT = 10;

/* ─── Types ──────────────────────────────────────────── */

interface RecentSearch {
  id: string;
  url: string;
  videoId: string;
  thumbnail: string;
  timestamp: number;
}

/* ─── Helpers ────────────────────────────────────────── */

function extractVideoId(link: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = link.trim().match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getThumbnailUrl(videoId: string, resId: string): string {
  return `https://img.youtube.com/vi/${videoId}/${resId}.jpg`;
}

function getRecentSearches(): RecentSearch[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(search: RecentSearch) {
  const recent = getRecentSearches().filter(r => r.videoId !== search.videoId);
  recent.unshift(search);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function removeRecentSearch(videoId: string) {
  const recent = getRecentSearches().filter(r => r.videoId !== videoId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
}

function clearRecentSearches() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ─── FAQ Data ───────────────────────────────────────── */

const FAQ_DATA = [
  { q: 'What is a YouTube Thumbnail Downloader?', a: 'A YouTube Thumbnail Downloader is a free online tool that allows you to download the thumbnail image from any YouTube video in various resolutions. It extracts the thumbnail URL directly from YouTube servers without requiring any login or registration.' },
  { q: 'What resolutions are available?', a: 'YouTube thumbnails are available in 5 resolutions: Max Resolution (1280x720), Standard Definition (640x480), High Quality (480x360), Medium Quality (320x180), and Default (120x90). The max resolution is the highest quality available.' },
  { q: 'Is it free to use?', a: 'Yes, our YouTube Thumbnail Downloader is completely free to use. There are no hidden fees, no signup required, and no usage limits. Download as many thumbnails as you need.' },
  { q: 'Does it work with YouTube Shorts?', a: 'Yes! Our tool works with all YouTube content including regular videos, YouTube Shorts, and live streams. Simply paste the URL and we will extract the thumbnail.' },
  { q: 'Can I use these thumbnails in my own videos?', a: 'Thumbnails are the intellectual property of their respective creators. You may use them for reference, inspiration, or fair-use purposes. Always respect copyright laws and give appropriate credit when using someone else\'s thumbnail.' },
  { q: 'What if the max resolution thumbnail is not available?', a: 'Some older videos may not have a max-resolution thumbnail available. In that case, try downloading a lower resolution option like SD or HQ. The tool will show you which resolutions are available.' },
  { q: 'Do I need to install any software?', a: 'No installation is required. Our tool works entirely in your web browser. Simply visit the page, paste a YouTube URL, and download the thumbnail instantly.' },
  { q: 'What URL formats are supported?', a: 'We support all YouTube URL formats including: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID, and youtube.com/live/ID. You can also paste just the 11-character video ID.' },
  { q: 'Is my data safe when using this tool?', a: 'Yes. We do not store your YouTube URLs or any personal data. Recent searches are stored locally in your browser using localStorage and never leave your device. We have no access to this data.' },
  { q: 'Can I download thumbnails in bulk?', a: 'Currently our tool processes one video at a time for the best experience. You can quickly download multiple thumbnails by pasting URLs one after another. Your recent searches are saved for quick access.' },
  { q: 'What is the difference between thumbnail resolutions?', a: 'Higher resolutions provide larger, more detailed images. Max Resolution (1280x720) is ideal for presentations and printing. SD (640x480) works well for social media. Lower resolutions are suitable for small previews and avatars.' },
  { q: 'Why is the thumbnail quality important?', a: 'Thumbnail quality affects how your content appears when shared. Higher quality thumbnails look more professional on social media, in presentations, and when used as reference for creating your own thumbnails.' },
];

/* ─── Main Component ─────────────────────────────────── */

export default function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoId, setVideoId] = useState('');
  const [selectedRes, setSelectedRes] = useState('maxresdefault');
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showRecent, setShowRecent] = useState(true);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const handleFetch = useCallback(() => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const id = extractVideoId(url);
    if (!id) {
      setError('Invalid YouTube URL. Please check the format and try again.');
      return;
    }

    setError('');
    setVideoId(id);
    setSelectedRes('maxresdefault');
    setPreviewLoaded(false);
    setLoading(true);

    const thumbnail = getThumbnailUrl(id, 'maxresdefault');
    const search: RecentSearch = {
      id: `${id}-${Date.now()}`,
      url: url.trim(),
      videoId: id,
      thumbnail,
      timestamp: Date.now(),
    };
    saveRecentSearch(search);
    setRecentSearches(getRecentSearches());
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      // Clipboard API not available
    }
  };

  const handleDownload = async () => {
    if (!videoId) return;
    const imgUrl = getThumbnailUrl(videoId, selectedRes);
    try {
      const response = await fetch(imgUrl);
      if (!response.ok) throw new Error('Image fetch failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `youtube-thumbnail-${videoId}-${selectedRes}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(imgUrl, '_blank');
    }
  };

  const handleCopyUrl = () => {
    const imgUrl = getThumbnailUrl(videoId, selectedRes);
    navigator.clipboard.writeText(imgUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const currentUrl = window.location.href;
    const text = 'Check out this YouTube Thumbnail Downloader tool!';
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + currentUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`,
    };
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const loadRecent = (search: RecentSearch) => {
    setUrl(search.url);
    setVideoId(search.videoId);
    setSelectedRes('maxresdefault');
    setPreviewLoaded(false);
    setLoading(true);
    setError('');
  };

  const deleteRecent = (videoId: string) => {
    removeRecentSearch(videoId);
    setRecentSearches(getRecentSearches());
  };

  const clearAllRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const loadExample = (videoId: string) => {
    setUrl(`https://www.youtube.com/watch?v=${videoId}`);
    setTimeout(() => handleFetch(), 0);
  };

  return (
    <div className="space-y-6">
      {/* ─── Hero Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-semibold">
          <Image className="w-3.5 h-3.5" />
          YouTube Tools
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-white">
          YouTube Thumbnail Downloader
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Download YouTube thumbnails in HD and all available sizes instantly. Free, fast, and no signup required.
        </p>
      </motion.div>

      {/* ─── URL Input ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        <label className="block text-sm font-semibold text-white">YouTube Video URL</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleFetch()}
              placeholder="Paste YouTube URL here..."
              className="w-full px-4 py-3 pr-20 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
              disabled={loading}
            />
            <button
              onClick={handlePaste}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md text-xs text-gray-300 transition flex items-center gap-1"
            >
              <Copy className="w-3 h-3" /> Paste
            </button>
          </div>
          <button
            onClick={handleFetch}
            disabled={loading || !url.trim()}
            className="px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Fetching...' : 'Fetch Thumbnail'}
          </button>
        </div>

        {/* Example URLs */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Try:</span>
          {EXAMPLE_VIDEOS.slice(0, 3).map((v) => (
            <button
              key={v.id}
              onClick={() => loadExample(v.id)}
              className="text-xs text-primary hover:text-primary/80 transition truncate max-w-[150px]"
            >
              {v.title}
            </button>
          ))}
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
          <span className="text-xs text-gray-500">Share:</span>
          <button onClick={() => handleShare('facebook')} className="p-2 hover:bg-slate-700 rounded-lg transition text-gray-400 hover:text-blue-400">
            <Facebook className="w-4 h-4" />
          </button>
          <button onClick={() => handleShare('twitter')} className="p-2 hover:bg-slate-700 rounded-lg transition text-gray-400 hover:text-sky-400">
            <Twitter className="w-4 h-4" />
          </button>
          <button onClick={() => handleShare('whatsapp')} className="p-2 hover:bg-slate-700 rounded-lg transition text-gray-400 hover:text-green-400">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button onClick={() => handleShare('telegram')} className="p-2 hover:bg-slate-700 rounded-lg transition text-gray-400 hover:text-blue-400">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* ─── Error ─── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Thumbnail Preview ─── */}
      {videoId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              Thumbnail Preview
            </h3>
            <button
              onClick={() => setFullscreen(true)}
              className="p-2 hover:bg-slate-700 rounded-lg transition text-gray-400 hover:text-white"
              title="View fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 cursor-pointer group"
            onClick={() => setFullscreen(true)}
          >
            <img
              src={getThumbnailUrl(videoId, selectedRes)}
              alt="YouTube Thumbnail"
              className="w-full h-auto max-h-96 object-contain"
              onLoad={() => { setLoading(false); setPreviewLoaded(true); }}
              onError={() => { setLoading(false); setPreviewLoaded(false); setError('Thumbnail not available for this resolution. Try another.'); }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Eye className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Resolution Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">Select Resolution</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {THUMBNAIL_RESOLUTIONS.map((res) => (
                <button
                  key={res.id}
                  onClick={() => { setSelectedRes(res.id); setPreviewLoaded(false); setLoading(true); setError(''); }}
                  className={`px-3 py-2.5 rounded-lg font-semibold transition text-left ${
                    selectedRes === res.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-700 border border-slate-600'
                  }`}
                >
                  <span className="block text-sm">{res.shortLabel}</span>
                  <span className="text-[10px] opacity-70">{res.width}x{res.height}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-gray-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader className="w-5 h-5 animate-spin" /> Loading...</>
              ) : (
                <><Download className="w-5 h-5" /> Download Thumbnail</>
              )}
            </button>
            <button
              onClick={handleCopyUrl}
              disabled={loading}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-gray-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {copied ? <><Check className="w-5 h-5 text-green-400" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy URL</>}
            </button>
          </div>

          {/* Direct URL */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
            <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Direct Image URL</p>
            <code className="text-xs text-gray-400 break-all select-all block">{getThumbnailUrl(videoId, selectedRes)}</code>
          </div>
        </motion.div>
      )}

      {/* ─── All Resolutions Grid ─── */}
      {videoId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-white">All Available Resolutions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {THUMBNAIL_RESOLUTIONS.map((res) => (
              <button
                key={res.id}
                onClick={() => { setSelectedRes(res.id); setPreviewLoaded(false); setLoading(true); setError(''); }}
                className="group relative overflow-hidden rounded-xl border border-slate-700 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                <img
                  src={getThumbnailUrl(videoId, res.id)}
                  alt={res.label}
                  className="w-full h-24 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-xs text-white font-semibold">{res.shortLabel}</p>
                    <p className="text-[10px] text-gray-300">{res.width}x{res.height}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Recent Searches ─── */}
      {recentSearches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Searches
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRecent(!showRecent)}
                className="p-2 hover:bg-slate-700 rounded-lg transition text-gray-400"
              >
                {showRecent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={clearAllRecent}
                className="text-xs text-red-400 hover:text-red-300 transition"
              >
                Clear All
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showRecent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {recentSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition group"
                  >
                    <img
                      src={search.thumbnail}
                      alt="Thumbnail"
                      className="w-20 h-12 object-cover rounded border border-slate-700"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{search.videoId}</p>
                      <p className="text-xs text-gray-500">{new Date(search.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => loadRecent(search)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition text-gray-400 hover:text-primary"
                        title="Load"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteRecent(search.videoId)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition text-gray-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ─── Popular Videos Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-400" />
          Popular Videos
        </h3>
        <p className="text-sm text-gray-400">Try downloading thumbnails from these popular videos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXAMPLE_VIDEOS.map((video) => (
            <button
              key={video.id}
              onClick={() => loadExample(video.id)}
              className="group text-left p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900 border border-slate-700 hover:border-primary/50 transition-all"
            >
              <img
                src={getThumbnailUrl(video.id, 'mqdefault')}
                alt={video.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
                loading="lazy"
              />
              <p className="text-sm text-white font-medium truncate group-hover:text-primary transition">{video.title}</p>
              <p className="text-xs text-gray-500 mt-1">{video.channel}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Features ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity:1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Download, text: 'Download thumbnails up to 1280x720' },
            { icon: Zap, text: '5 different quality options available' },
            { icon: Smartphone, text: 'Works with all YouTube video URLs' },
            { icon: Shield, text: 'Supports videos, shorts, and live streams' },
            { icon: LinkIcon, text: 'Direct image URL for embedding' },
            { icon: Eye, text: 'Fullscreen preview available' },
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-300">
              <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Content Sections ─── */}

      {/* What is YouTube Thumbnail Downloader */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-white">What is YouTube Thumbnail Downloader?</h2>
        <div className="text-gray-300 text-sm space-y-3">
          <p>
            A YouTube Thumbnail Downloader is a free online tool that extracts and downloads the thumbnail image from any YouTube video. Thumbnails are the preview images that represent videos on YouTube, and they are often the first thing viewers see before clicking on a video.
          </p>
          <p>
            Our tool makes it easy to download these thumbnails in various resolutions, from the highest quality (1280x720) down to the default size (120x90). This is useful for content creators who want to analyze competitor thumbnails, educators who need video thumbnails for presentations, or anyone who wants to save a YouTube thumbnail for reference.
          </p>
          <p>
            Unlike other tools, our YouTube Thumbnail Downloader works entirely in your browser. We do not store your data or require any signup. Simply paste a YouTube URL and download the thumbnail instantly.
          </p>
        </div>
      </motion.div>

      {/* How to Download YouTube Thumbnail */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-white">How to Download YouTube Thumbnail</h2>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Copy the YouTube URL', desc: 'Go to YouTube and copy the URL of the video whose thumbnail you want to download.' },
            { step: 2, title: 'Paste the URL', desc: 'Paste the copied URL into the input field above or click the Paste button.' },
            { step: 3, title: 'Click Fetch Thumbnail', desc: 'Click the "Fetch Thumbnail" button to extract the thumbnail from the video.' },
            { step: 4, title: 'Select Resolution', desc: 'Choose from 5 available resolutions: Max, SD, HQ, MQ, or Default.' },
            { step: 5, title: 'Download', desc: 'Click "Download Thumbnail" to save the image to your device.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">{item.step}</span>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Available Thumbnail Sizes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-white">Available Thumbnail Sizes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Resolution</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Size</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                { res: 'Max Resolution', size: '1280x720', use: 'Presentations, printing, high-quality displays' },
                { res: 'SD', size: '640x480', use: 'Social media, blog posts, standard displays' },
                { res: 'HQ', size: '480x360', use: 'Email newsletters, small web previews' },
                { res: 'MQ', size: '320x180', use: 'Avatars, small thumbnails, mobile previews' },
                { res: 'Default', size: '120x90', use: 'List views, search results, minimal previews' },
              ].map((item, i) => (
                <tr key={i} className="border-b border-slate-700/50">
                  <td className="py-3 px-4 text-white font-medium">{item.res}</td>
                  <td className="py-3 px-4 text-gray-300">{item.size}</td>
                  <td className="py-3 px-4 text-gray-400">{item.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-white">Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Free & No Signup', desc: 'Download unlimited thumbnails without creating an account.' },
            { title: 'Instant Results', desc: 'Get thumbnails in seconds with our fast extraction process.' },
            { title: 'Multiple Resolutions', desc: 'Choose from 5 different quality options for your needs.' },
            { title: 'Privacy First', desc: 'No data collection. Your URLs stay in your browser only.' },
            { title: 'Works Everywhere', desc: 'Compatible with all modern browsers on desktop and mobile.' },
            { title: 'Direct URLs', desc: 'Get direct image URLs for embedding in your projects.' },
          ].map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-semibold text-sm">{benefit.title}</h4>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQ_DATA.map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between cursor-pointer py-3 px-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition list-none">
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition flex-shrink-0" />
              </summary>
              <p className="px-4 py-3 text-sm text-gray-300 bg-slate-900/30 rounded-b-lg">{faq.a}</p>
            </details>
          ))}
        </div>
      </motion.div>

      {/* Related Tools */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-white">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'AI Caption Generator', desc: 'Generate engaging captions for your videos', path: '/tools/ai-caption-generator' },
            { name: 'AI Hashtag Generator', desc: 'Get trending hashtags for YouTube videos', path: '/tools/ai-hashtag-generator' },
            { name: 'YouTube Script Generator', desc: 'Create video scripts with AI assistance', path: '/tools/youtube-script-generator' },
            { name: 'AI Image Generator', desc: 'Generate custom images with AI', path: '/tools/ai-image-generator' },
          ].map((tool, i) => (
            <a
              key={i}
              href={tool.path}
              className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 border border-slate-700 hover:border-primary/50 transition group"
            >
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition" />
              <div>
                <p className="text-white font-semibold text-sm group-hover:text-primary transition">{tool.name}</p>
                <p className="text-gray-400 text-xs">{tool.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* ─── Fullscreen Modal ─── */}
      <AnimatePresence>
        {fullscreen && videoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={getThumbnailUrl(videoId, selectedRes)}
              alt="YouTube Thumbnail Fullscreen"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Copyright Notice ─── */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <p className="text-yellow-200 text-sm">
          <strong>Copyright Notice:</strong> Thumbnails are the property of their respective creators. Use them respectfully and in accordance with YouTube's terms of service and copyright laws.
        </p>
      </div>
    </div>
  );
}
