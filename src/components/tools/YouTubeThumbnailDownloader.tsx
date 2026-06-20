import { useState } from 'react';
import { Download, AlertCircle, Loader, Link as LinkIcon, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolPage from '../ToolPage';

const THUMBNAIL_RESOLUTIONS = [
  { id: 'maxresdefault', label: 'Max Resolution (1280x720)', width: 1280, height: 720 },
  { id: 'sddefault', label: 'SD (640x480)', width: 640, height: 480 },
  { id: 'hqdefault', label: 'HD (480x360)', width: 480, height: 360 },
  { id: 'mqdefault', label: 'Medium (320x180)', width: 320, height: 180 },
  { id: 'default', label: 'Low (120x90)', width: 120, height: 90 },
];

export default function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoId, setVideoId] = useState('');
  const [selectedRes, setSelectedRes] = useState('maxresdefault');
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const extractVideoId = (link: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = link.trim().match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleFetch = () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const id = extractVideoId(url);
    if (!id) {
      setError('Could not extract video ID. Please check the URL.');
      return;
    }

    setError('');
    setVideoId(id);
    setSelectedRes('maxresdefault');
    setPreviewLoaded(false);
    setLoading(true);
  };

  const getThumbnailUrl = (resId: string) =>
    `https://img.youtube.com/vi/${videoId}/${resId}.jpg`;

  const handleDownload = async () => {
    const imgUrl = getThumbnailUrl(selectedRes);
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

  return (
    <ToolPage>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">YouTube Thumbnail Downloader</h1>
          <p className="text-gray-400">Download high-quality YouTube video thumbnails in any resolution</p>
        </div>

        {/* URL Input */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <label className="block text-sm font-semibold text-white">YouTube Video URL</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleFetch()}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              disabled={loading}
            />
            <button
              onClick={handleFetch}
              disabled={loading}
              className="px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-gray-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
              {loading ? 'Loading...' : 'Fetch Thumbnail'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Thumbnail Preview */}
        {videoId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4"
          >
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Image className="w-5 h-5" />
              Thumbnail Preview
            </h3>

            <div className="rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-700">
              <img
                src={getThumbnailUrl(selectedRes)}
                alt="YouTube Thumbnail"
                className="max-w-full h-auto max-h-96 object-contain"
                onLoad={() => { setLoading(false); setPreviewLoaded(true); }}
                onError={() => { setLoading(false); setPreviewLoaded(false); setError('Thumbnail not available for this resolution. Try another.'); }}
              />
            </div>

            {/* Resolution Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Select Resolution</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {THUMBNAIL_RESOLUTIONS.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => { setSelectedRes(res.id); setPreviewLoaded(false); setLoading(true); setError(''); }}
                    className={`px-4 py-3 rounded-lg font-semibold transition text-left ${
                      selectedRes === res.id
                        ? 'bg-primary text-white'
                        : 'bg-slate-700 text-gray-300 hover:text-white border border-slate-600'
                    }`}
                  >
                    <span className="block">{res.label}</span>
                    <span className="text-xs opacity-70">{res.width}x{res.height}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={loading}
              className="w-full px-6 py-4 bg-primary hover:bg-primary/80 disabled:bg-gray-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Thumbnail
                </>
              )}
            </button>

            {/* Raw URL Copy */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Direct Image URL:</p>
              <code className="text-xs text-gray-300 break-all select-all">{getThumbnailUrl(selectedRes)}</code>
            </div>
          </motion.div>
        )}

        {/* All Resolutions Grid */}
        {videoId && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
            <h3 className="text-lg font-bold text-white">All Available Resolutions</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {THUMBNAIL_RESOLUTIONS.map((res) => (
                <button
                  key={res.id}
                  onClick={() => { setSelectedRes(res.id); setPreviewLoaded(false); setLoading(true); setError(''); }}
                  className="group relative overflow-hidden rounded-lg border border-slate-700 hover:border-primary transition"
                >
                  <img
                    src={getThumbnailUrl(res.id)}
                    alt={res.label}
                    className="w-full h-20 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-xs text-white font-semibold">{res.width}x{res.height}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-white">✨ Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Download thumbnails in up to 1280x720 resolution</li>
            <li>✓ 5 different quality options available</li>
            <li>✓ Works with all YouTube video URLs</li>
            <li>✓ Supports regular videos, shorts, and live streams</li>
            <li>✓ Direct image URL for embedding</li>
            <li>✓ No signup required</li>
            <li>✓ 100% free</li>
          </ul>
        </div>

        {/* Warning */}
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-200 mb-2">⚠️ Important</h3>
          <p className="text-yellow-100 text-sm">
            Thumbnails are the property of their respective creators. Use them respectfully and in accordance with YouTube's terms of service and copyright laws.
          </p>
        </div>
      </motion.div>
    </ToolPage>
  );
}
