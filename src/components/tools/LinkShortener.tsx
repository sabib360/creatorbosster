import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Copy, BarChart3, Calendar, Eye, ExternalLink, Trash2, Plus, Settings, TrendingUp, X, Zap, Crown } from 'lucide-react';

interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  lastAccessed: string;
  title?: string;
  customAlias?: string;
}

interface LinkAnalytics {
  totalClicks: number;
  uniqueClicks: number;
  avgClicksPerDay: number;
  topReferrers: { source: string; clicks: number }[];
  clickTimeline: { date: string; clicks: number }[];
}

const mockLinks: ShortenedLink[] = [
  {
    id: '1',
    originalUrl: 'https://www.example.com/very-long-url-that-needs-to-be-shortened-for-social-media-sharing',
    shortCode: 'product2024',
    shortUrl: 'https://short.ly/product2024',
    clicks: 245,
    createdAt: '2024-01-10',
    lastAccessed: '2024-01-15',
    title: 'Product Launch Page',
    customAlias: 'product2024'
  },
  {
    id: '2',
    originalUrl: 'https://www.instagram.com/p/C1234567890',
    shortCode: 'insta-post',
    shortUrl: 'https://short.ly/insta-post',
    clicks: 189,
    createdAt: '2024-01-08',
    lastAccessed: '2024-01-14',
    title: 'Instagram Post'
  },
  {
    id: '3',
    originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    shortCode: 'youtube-vid',
    shortUrl: 'https://short.ly/youtube-vid',
    clicks: 367,
    createdAt: '2024-01-05',
    lastAccessed: '2024-01-15',
    title: 'YouTube Video'
  },
  {
    id: '4',
    originalUrl: 'https://twitter.com/user/status/1234567890123456789',
    shortCode: 'tweet-link',
    shortUrl: 'https://short.ly/tweet-link',
    clicks: 156,
    createdAt: '2024-01-12',
    lastAccessed: '2024-01-15',
    title: 'Twitter Thread'
  },
  {
    id: '5',
    originalUrl: 'https://www.linkedin.com/posts/user/example-post-1234567890',
    shortCode: 'linkedin-art',
    shortUrl: 'https://short.ly/linkedin-art',
    clicks: 98,
    createdAt: '2024-01-09',
    lastAccessed: '2024-01-13',
    title: 'LinkedIn Article'
  }
];

const mockAnalytics: LinkAnalytics = {
  totalClicks: 1055,
  uniqueClicks: 845,
  avgClicksPerDay: 70.3,
  topReferrers: [
    { source: 'Twitter', clicks: 234 },
    { source: 'Facebook', clicks: 189 },
    { source: 'Instagram', clicks: 156 },
    { source: 'LinkedIn', clicks: 98 },
    { source: 'Direct', clicks: 124 },
    { source: 'Email', clicks: 87 },
    { source: 'WhatsApp', clicks: 167 }
  ],
  clickTimeline: [
    { date: 'Jan 10', clicks: 45 },
    { date: 'Jan 11', clicks: 67 },
    { date: 'Jan 12', clicks: 89 },
    { date: 'Jan 13', clicks: 123 },
    { date: 'Jan 14', clicks: 156 },
    { date: 'Jan 15', clicks: 189 },
    { date: 'Jan 16', clicks: 132 },
    { date: 'Jan 17', clicks: 145 },
    { date: 'Jan 18', clicks: 109 }
  ]
};

export default function LinkShortener() {
  const [links, setLinks] = useState<ShortenedLink[]>(mockLinks);
  const [newUrl, setNewUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [selectedLink, setSelectedLink] = useState<ShortenedLink | null>(null);
  const [analytics, setAnalytics] = useState<LinkAnalytics>(mockAnalytics);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isShortening, setIsShortening] = useState(false);
  
  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const shortenLink = () => {
    if (!newUrl) return;

    setIsShortening(true);
    
    setTimeout(() => {
      const shortCode = customAlias || generateShortCode();
      const newLink: ShortenedLink = {
        id: Date.now().toString(),
        originalUrl: newUrl,
        shortCode,
        shortUrl: `https://short.ly/${shortCode}`,
        clicks: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastAccessed: new Date().toISOString().split('T')[0],
        title: linkTitle || undefined,
        customAlias: customAlias || undefined
      };

      setLinks([newLink, ...links]);
      setNewUrl('');
      setCustomAlias('');
      setLinkTitle('');
      setIsShortening(false);
    }, 1000);
  };

  const copyToClipboard = (link: ShortenedLink) => {
    navigator.clipboard.writeText(link.shortUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    if (selectedLink?.id === id) {
      setSelectedLink(null);
    }
  };

  const viewAnalytics = (link: ShortenedLink) => {
    setSelectedLink(link);
    // In a real app, this would fetch analytics for the specific link
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const formatUrl = (url: string) => {
    if (url.length > 50) {
      return url.substring(0, 47) + '...';
    }
    return url;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTotalClicks = () => {
    return links.reduce((sum, link) => sum + link.clicks, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          Link Shortener
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Create short, memorable links and track their performance across platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Link Shortener */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <Link className="w-5 h-5 text-primary" />
              Shorten Link
            </h2>

            {/* URL Input */}
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-bold text-ink/60">Original URL</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50"
                placeholder="https://example.com/very-long-url"
              />
              {newUrl && !isValidUrl(newUrl) && (
                <p className="text-xs text-red-400">Please enter a valid URL</p>
              )}
            </div>

            {/* Custom Alias */}
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-bold text-ink/60">Custom Alias (Optional)</label>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50"
                placeholder="my-custom-link"
              />
              <p className="text-xs text-ink/40">Only letters and numbers allowed</p>
            </div>

            {/* Link Title */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60">Link Title (Optional)</label>
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50"
                placeholder="My Link Title"
              />
            </div>

            <button
              onClick={shortenLink}
              disabled={!newUrl || !isValidUrl(newUrl) || isShortening}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-black font-black rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isShortening ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Shortening...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Shorten Link
                </>
              )}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Total Links</span>
                <span className="text-sm font-bold text-ink">{links.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Total Clicks</span>
                <span className="text-sm font-bold text-primary">{getTotalClicks()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Avg Clicks/Link</span>
                <span className="text-sm font-bold text-ink">
                  {links.length > 0 ? Math.round(getTotalClicks() / links.length) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink/60">Most Popular</span>
                <span className="text-sm font-bold text-ink">
                  {links.length > 0 ? links.reduce((max, link) => link.clicks > max.clicks ? link : max).shortCode : 'N/A'}
                </span>
              </div>
            </div>
          </div>

                  </motion.div>

        {/* Links List & Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Links Table */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-primary" />
              Your Links
            </h2>

            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      {link.title && (
                        <p className="text-sm font-bold text-ink mb-1">{link.title}</p>
                      )}
                      <p className="text-sm text-ink/60 mb-2 truncate">{formatUrl(link.originalUrl)}</p>
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-primary/20 rounded text-primary font-bold text-xs">
                          {link.shortUrl}
                        </div>
                        {link.customAlias && (
                          <div className="px-2 py-1 bg-green-500/20 rounded text-green-400 text-xs">
                            Custom
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => viewAnalytics(link)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedLink?.id === link.id
                            ? 'bg-primary text-black'
                            : 'bg-slate-700/50 text-ink/60 hover:bg-slate-700'
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(link)}
                        className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        {copiedId === link.id ? (
                          <div className="text-green-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <Copy className="w-4 h-4 text-ink/60" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="p-2 bg-slate-700/50 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-ink/40">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {link.clicks} clicks
                      </span>
                      <span>Created {formatDate(link.createdAt)}</span>
                    </div>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {links.length === 0 && (
              <div className="text-center py-8">
                <Link className="w-12 h-12 text-ink/20 mx-auto mb-3" />
                <p className="text-ink/60">No links created yet</p>
              </div>
            )}
          </div>

          {/* Analytics Dashboard */}
          {selectedLink && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Analytics for {selectedLink.shortCode}
                </h3>
                <button
                  onClick={() => setSelectedLink(null)}
                  className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4 text-ink/60" />
                </button>
              </div>

              {/* Analytics Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <p className="text-xs text-ink/60 mb-1">Total Clicks</p>
                  <p className="text-2xl font-display font-black text-primary">{selectedLink.clicks}</p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <p className="text-xs text-ink/60 mb-1">Unique Clicks</p>
                  <p className="text-2xl font-display font-black text-ink">
                    {Math.round(selectedLink.clicks * 0.8)}
                  </p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <p className="text-xs text-ink/60 mb-1">Created</p>
                  <p className="text-lg font-display font-black text-ink">
                    {formatDate(selectedLink.createdAt)}
                  </p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4">
                  <p className="text-xs text-ink/60 mb-1">Last Click</p>
                  <p className="text-lg font-display font-black text-ink">
                    {formatDate(selectedLink.lastAccessed)}
                  </p>
                </div>
              </div>

              {/* Click Timeline */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-ink mb-3">Click Timeline</h4>
                <div className="space-y-2">
                  {analytics.clickTimeline.map((day, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs text-ink/60 w-12">{day.date}</span>
                      <div className="flex-1 bg-slate-700/50 rounded-full h-4 relative overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/80"
                          style={{ width: `${(day.clicks / 200) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-ink w-8">{day.clicks}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Referrers */}
              <div>
                <h4 className="text-sm font-bold text-ink mb-3">Top Referrers</h4>
                <div className="space-y-2">
                  {analytics.topReferrers.map((referrer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-ink/60">{referrer.source}</span>
                      <span className="text-sm font-bold text-primary">{referrer.clicks}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Link Shortening Tips
            </h3>
            <div className="space-y-2 text-sm text-ink/70">
              <p>• Use custom aliases for brand consistency and memorability</p>
              <p>• Add descriptive titles to organize your links better</p>
              <p>• Track analytics to understand your audience behavior</p>
              <p>• Use UTM parameters for detailed campaign tracking</p>
              <p>• Regularly review link performance to optimize strategy</p>
            </div>
          </div>
        </motion.div>
      </div>

          </motion.div>
  );
}
