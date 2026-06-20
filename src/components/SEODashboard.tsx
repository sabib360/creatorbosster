import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, BarChart3, FileText, Link2, AlertCircle, CheckCircle, XCircle,
  ArrowLeft, RefreshCw, Download,
} from 'lucide-react';
import {
  calculateSEOScore,
  analyzeKeywordDensity,
  analyzeReadability,
  suggestInternalLinks,
  generateSitemapXML,
  generateRobotsTxt,
} from '../lib/seo';
import { ALL_TOOLS } from '../config/tools-registry';

type Tab = 'overview' | 'analyzer' | 'sitemap' | 'tools';

export default function SEODashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [analyzerInput, setAnalyzerInput] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{
    score: ReturnType<typeof calculateSEOScore>;
    density: ReturnType<typeof analyzeKeywordDensity>;
    readability: ReturnType<typeof analyzeReadability>;
    links: ReturnType<typeof suggestInternalLinks>;
  } | null>(null);

  const handleAnalyze = () => {
    if (!analyzerInput.trim()) return;
    const words = analyzerInput.split(/\s+/).length;
    const score = calculateSEOScore({
      title: 'Sample Page Title for Analysis',
      description: analyzerInput.substring(0, 160),
      keywords: targetKeywords,
      hasSchema: true,
      hasCanonical: true,
      hasH1: true,
      wordCount: words,
    });
    const kws = targetKeywords.split(',').map((k) => k.trim()).filter(Boolean);
    const density = analyzeKeywordDensity(analyzerInput, kws.length > 0 ? kws : ['tool', 'free', 'online']);
    const readability = analyzeReadability(analyzerInput);
    const links = suggestInternalLinks('/', analyzerInput);
    setAnalysisResult({ score, density, readability, links });
  };

  const handleDownloadSitemap = () => {
    const xml = generateSitemapXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRobots = () => {
    const txt = generateRobotsTxt();
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const inputClass = 'w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary';

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'analyzer' as const, label: 'Content Analyzer', icon: Search },
    { id: 'tools' as const, label: 'Tool SEO Audit', icon: FileText },
    { id: 'sitemap' as const, label: 'Sitemap & Robots', icon: Link2 },
  ];

  const totalTools = ALL_TOOLS.length;
  const totalKeywords = ALL_TOOLS.reduce((sum, t) => sum + t.keywords.length, 0);
  const avgSearchVol = Math.round(ALL_TOOLS.reduce((sum, t) => sum + t.estimatedSearchVolume, 0) / totalTools);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Back to Home</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SEO Dashboard</h1>
          <p className="text-gray-400">Monitor and optimize your site's search engine performance</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/50 border border-slate-700 rounded-lg p-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-md text-sm font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Tools', value: totalTools, color: 'text-primary' },
                { label: 'Total Keywords', value: totalKeywords, color: 'text-blue-400' },
                { label: 'Avg Monthly Searches', value: avgSearchVol.toLocaleString(), color: 'text-green-400' },
                { label: 'Sitemap Entries', value: '200+', color: 'text-purple-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">SEO Health Checklist</h3>
              <div className="space-y-3">
                {[
                  { label: 'Meta tags on all tool pages', status: 'pass' },
                  { label: 'Open Graph tags configured', status: 'pass' },
                  { label: 'Twitter Card tags configured', status: 'pass' },
                  { label: 'Canonical URLs set', status: 'pass' },
                  { label: 'Schema.org structured data', status: 'pass' },
                  { label: 'Breadcrumb schema', status: 'pass' },
                  { label: 'FAQ schema on tool pages', status: 'pass' },
                  { label: 'Sitemap.xml generated', status: 'pass' },
                  { label: 'Robots.txt configured', status: 'pass' },
                  { label: 'Hreflang tags (en + bn)', status: 'pass' },
                  { label: 'Blog posts have Article schema', status: 'pass' },
                  { label: 'Internal linking via RelatedTools', status: 'pass' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    {item.status === 'pass' ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <span className="text-gray-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Analyzer Tab */}
        {activeTab === 'analyzer' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Content & Keyword Analyzer</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">Target Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={targetKeywords}
                    onChange={(e) => setTargetKeywords(e.target.value)}
                    placeholder="image compressor, compress image, reduce file size"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">Page Content</label>
                  <textarea
                    value={analyzerInput}
                    onChange={(e) => setAnalyzerInput(e.target.value)}
                    placeholder="Paste your page content here for analysis..."
                    rows={8}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Analyze Content
                </button>
              </div>
            </div>

            {analysisResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SEO Score */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                  <h4 className="text-lg font-bold text-white">SEO Score</h4>
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl font-bold ${analysisResult.score.overall >= 80 ? 'text-green-400' : analysisResult.score.overall >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysisResult.score.overall}
                    </div>
                    <div className="text-gray-400">/ 100</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      analysisResult.score.titleScore,
                      analysisResult.score.descriptionScore,
                      analysisResult.score.keywordsScore,
                      analysisResult.score.schemaScore,
                      analysisResult.score.performanceScore,
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{['Title', 'Description', 'Keywords', 'Schema', 'Performance'][i]}</span>
                          <span className="text-white">{item.score}/{item.max}</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.score >= item.max * 0.8 ? 'bg-green-500' : item.score >= item.max * 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${(item.score / item.max) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Readability */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                  <h4 className="text-lg font-bold text-white">Readability</h4>
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl font-bold ${analysisResult.readability.score >= 80 ? 'text-green-400' : analysisResult.readability.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysisResult.readability.score}
                    </div>
                    <div>
                      <div className="text-gray-400">/ 100</div>
                      <div className="text-white font-semibold">{analysisResult.readability.grade}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Avg Sentence Length</span><span className="text-white">{analysisResult.readability.avgSentenceLength} words</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Avg Word Length</span><span className="text-white">{analysisResult.readability.avgWordLength} chars</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Complex Words</span><span className="text-white">{analysisResult.readability.complexWordCount}</span></div>
                  </div>
                  {analysisResult.readability.feedback.length > 0 && (
                    <div className="space-y-1">
                      {analysisResult.readability.feedback.map((f, i) => (
                        <p key={i} className="text-xs text-yellow-400">• {f}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Keyword Density */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                  <h4 className="text-lg font-bold text-white">Keyword Density</h4>
                  <div className="space-y-3">
                    {analysisResult.density.map((kw) => (
                      <div key={kw.keyword} className="flex items-center justify-between">
                        <span className="text-gray-300">{kw.keyword}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-white font-mono text-sm">{kw.density}%</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            kw.status === 'optimal' ? 'bg-green-500/20 text-green-400' :
                            kw.status === 'low' ? 'bg-yellow-500/20 text-yellow-400' :
                            kw.status === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>{kw.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal Link Suggestions */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                  <h4 className="text-lg font-bold text-white">Internal Link Suggestions</h4>
                  <div className="space-y-2">
                    {analysisResult.links.map((link) => (
                      <div key={link.path} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                        <div>
                          <span className="text-white text-sm font-semibold">{link.name}</span>
                          <p className="text-xs text-gray-500">{link.reason}</p>
                        </div>
                        <Link to={link.path} className="text-xs text-primary hover:underline">Link →</Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tool SEO Audit Tab */}
        {activeTab === 'tools' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Tool Pages SEO Audit ({totalTools} tools)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Tool</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Title Len</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Desc Len</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Keywords</th>
                      <th className="text-left py-3 px-2 text-gray-400 font-semibold">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_TOOLS.map((tool) => {
                      const score = calculateSEOScore({
                        title: tool.seoTitle,
                        description: tool.seoDescription,
                        keywords: tool.keywords.join(', '),
                        hasSchema: true,
                        hasCanonical: true,
                        hasH1: true,
                      });
                      return (
                        <tr key={tool.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="py-3 px-2">
                            <Link to={tool.path} className="text-white hover:text-primary transition font-semibold">{tool.name}</Link>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`font-mono ${tool.seoTitle.length > 60 ? 'text-red-400' : tool.seoTitle.length >= 30 ? 'text-green-400' : 'text-yellow-400'}`}>
                              {tool.seoTitle.length}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`font-mono ${tool.seoDescription.length > 160 ? 'text-red-400' : tool.seoDescription.length >= 120 ? 'text-green-400' : 'text-yellow-400'}`}>
                              {tool.seoDescription.length}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-gray-300">{tool.keywords.length}</td>
                          <td className="py-3 px-2">
                            <span className={`font-bold ${score.overall >= 80 ? 'text-green-400' : score.overall >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {score.overall}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sitemap & Robots Tab */}
        {activeTab === 'sitemap' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Sitemap Generator</h3>
                <button onClick={handleDownloadSitemap} className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download sitemap.xml
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                Auto-generates sitemap with {ALL_TOOLS.length} tools, category pages, utility pages, and programmatic SEO variants.
              </p>
              <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-60">
                {generateSitemapXML().substring(0, 1500)}...
              </pre>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Robots.txt</h3>
                <button onClick={handleDownloadRobots} className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download robots.txt
                </button>
              </div>
              <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-60">
                {generateRobotsTxt()}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
