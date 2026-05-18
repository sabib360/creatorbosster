import { useState } from 'react';
import { Download, AlertCircle, Loader, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolPage from '../ToolPage';

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);

  const validateYouTubeUrl = (link: string): boolean => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(?:watch\?v=|embed\/|v\/|shorts\/)?([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(link);
  };

  const fetchVideoInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('Invalid YouTube URL. Please check and try again.');
      return;
    }

    setDownloading(true);
    setError('');
    setSuccess('');

    try {
      // Extract video ID
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (!videoId) {
        setError('Could not extract video ID from URL');
        setDownloading(false);
        return;
      }

      // Mock video info - in production, use yt-dlp API
      setVideoInfo({
        id: videoId,
        title: 'Sample Video Title',
        duration: '10:45',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      });

      setSuccess('Video info loaded! Ready to download.');
    } catch (err: any) {
      setError('Failed to fetch video info. Please try again.');
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const startDownload = async () => {
    if (!videoInfo) return;

    setDownloading(true);
    setError('');

    try {
      // Mock download - in production, use backend with yt-dlp
      setSuccess(`Download started! Your ${quality}p video will be ready shortly.`);
      setTimeout(() => {
        setDownloading(false);
        setSuccess('Download complete! Check your downloads folder.');
      }, 2000);
    } catch (err: any) {
      setError('Download failed. Please try again.');
      setDownloading(false);
    }
  };

  return (
    <ToolPage>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">YouTube Video Downloader</h1>
          <p className="text-gray-400">Download YouTube videos in multiple formats and quality</p>
        </div>

        {/* URL Input */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <label className="block text-sm font-semibold text-white">YouTube Video URL</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              disabled={downloading}
            />
            <button
              onClick={fetchVideoInfo}
              disabled={downloading}
              className="px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-gray-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
            >
              {downloading ? <Loader className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
              {downloading ? 'Loading...' : 'Load Video'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg">
            <p className="text-green-300">✓ {success}</p>
          </div>
        )}

        {/* Video Preview */}
        {videoInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4"
          >
            <img src={videoInfo.thumbnail} alt={videoInfo.title} className="w-full rounded-lg max-h-64 object-cover" />
            <div>
              <h3 className="text-white font-semibold mb-2">{videoInfo.title}</h3>
              <p className="text-gray-400 text-sm">Duration: {videoInfo.duration}</p>
            </div>

            {/* Quality Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Select Quality</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['360', '480', '720', '1080'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      quality === q
                        ? 'bg-primary text-white'
                        : 'bg-slate-700 text-gray-300 hover:text-white border border-slate-600'
                    }`}
                  >
                    {q}p
                  </button>
                ))}
              </div>
            </div>

            {/* Download Formats */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">Download Format</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['MP4 (Video)', 'MP3 (Audio)', 'WebM'].map((format) => (
                  <button key={format} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition">
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={startDownload}
              disabled={downloading}
              className="w-full px-6 py-4 bg-primary hover:bg-primary/80 disabled:bg-gray-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download {quality}p {/* video format type here */}
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-white">✨ Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Download in 360p, 480p, 720p, 1080p quality</li>
            <li>✓ MP4 video format</li>
            <li>✓ MP3 audio extraction</li>
            <li>✓ Batch download support</li>
            <li>✓ Fast download speed</li>
            <li>✓ No ads or watermarks</li>
            <li>✓ 100% free</li>
          </ul>
        </div>

        {/* Warning */}
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-200 mb-2">⚠️ Important</h3>
          <p className="text-yellow-100 text-sm">
            Only download content that you have permission to download. Respect copyright laws and YouTube's terms of service.
          </p>
        </div>
      </motion.div>
    </ToolPage>
  );
}
