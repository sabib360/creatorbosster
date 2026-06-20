import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Wrench, Users, BarChart3, MessageSquare,
  Mail, Tag, Image, Settings, ArrowLeft, Plus, Edit3, Trash2, Eye,
  Search, ChevronDown, TrendingUp, Star,
} from 'lucide-react';

type Tab = 'overview' | 'blog' | 'tools' | 'categories' | 'comments' | 'subscribers' | 'analytics';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalTools: number;
  totalViews: number;
  totalUsage: number;
  totalSubscribers: number;
  totalComments: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/analytics/dashboard?days=30');
      const data = await res.json();
      setStats({
        totalPosts: 10,
        publishedPosts: 10,
        totalTools: 10,
        totalViews: data.summary?.totalViews || 0,
        totalUsage: data.summary?.totalToolUses || 0,
        totalSubscribers: 3,
        totalComments: 0,
      });
    } catch {
      setStats({ totalPosts: 10, publishedPosts: 10, totalTools: 10, totalViews: 0, totalUsage: 0, totalSubscribers: 3, totalComments: 0 });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'blog' as const, label: 'Blog Posts', icon: FileText },
    { id: 'tools' as const, label: 'Tools', icon: Wrench },
    { id: 'categories' as const, label: 'Categories', icon: Tag },
    { id: 'comments' as const, label: 'Comments', icon: MessageSquare },
    { id: 'subscribers' as const, label: 'Subscribers', icon: Mail },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-semibold">Back to Home</span>
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your content, tools, and users</p>
          </div>
          <div className="flex gap-3">
            <Link to="/seo-dashboard" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              SEO Dashboard
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/50 border border-slate-700 rounded-lg p-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-3 py-2.5 rounded-md text-sm font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Blog Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'text-blue-400' },
                { label: 'Total Tools', value: stats?.totalTools || 0, icon: Wrench, color: 'text-green-400' },
                { label: 'Total Views', value: stats?.totalViews || 0, icon: Eye, color: 'text-purple-400' },
                { label: 'Subscribers', value: stats?.totalSubscribers || 0, icon: Mail, color: 'text-yellow-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'New Blog Post', icon: Plus, action: () => setActiveTab('blog') },
                    { label: 'Manage Tools', icon: Wrench, action: () => setActiveTab('tools') },
                    { label: 'View Analytics', icon: BarChart3, action: () => setActiveTab('analytics') },
                    { label: 'SEO Dashboard', icon: Settings, action: () => {} },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition text-left"
                    >
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="text-white text-sm font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { text: 'Blog post published', time: '2 hours ago', icon: FileText },
                    { text: 'New subscriber', time: '5 hours ago', icon: Mail },
                    { text: 'Tool usage spike', time: '1 day ago', icon: TrendingUp },
                    { text: 'Comment approved', time: '2 days ago', icon: MessageSquare },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                      <activity.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">{activity.text}</p>
                        <p className="text-gray-500 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Management */}
        {activeTab === 'blog' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Blog Posts</h3>
              <button className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Post
              </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Views</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {['How to Compress Images', 'Merge PDF Files Online', 'QR Code for Business', 'YouTube Growth Tips', 'YouTube Thumbnails Guide', 'Future of Content Creation', 'YouTube Algorithm 2026', 'Best Image Resizer Tools', 'YouTube Descriptions That Rank', 'Video Editing Tips'].map((title, i) => (
                    <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white font-semibold">{title}</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Published</span></td>
                      <td className="py-3 px-4 text-gray-300">{Math.floor(Math.random() * 5000)}</td>
                      <td className="py-3 px-4 text-gray-400">Jun {10 + i}, 2026</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 hover:bg-slate-700 rounded-lg transition"><Edit3 className="w-4 h-4 text-gray-400" /></button>
                          <button className="p-1.5 hover:bg-slate-700 rounded-lg transition"><Trash2 className="w-4 h-4 text-red-400" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tools Management */}
        {activeTab === 'tools' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Tools</h3>
              <button className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Tool
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Image Compressor', category: 'Image Tools', views: 12500, usage: 8900 },
                { name: 'PDF Merger', category: 'PDF Tools', views: 8700, usage: 5600 },
                { name: 'AI Thumbnail Generator', category: 'AI Tools', views: 15200, usage: 11000 },
                { name: 'Loan EMI Calculator', category: 'Finance Tools', views: 6300, usage: 4200 },
                { name: 'Hashtag Generator', category: 'Social Media', views: 9800, usage: 7100 },
                { name: 'JSON Formatter', category: 'Developer Tools', views: 4500, usage: 3200 },
              ].map((tool) => (
                <div key={tool.name} className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold">{tool.name}</h4>
                    <span className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs">{tool.category}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-400"><Eye className="w-3 h-3 inline mr-1" />{tool.views.toLocaleString()}</span>
                    <span className="text-gray-400"><TrendingUp className="w-3 h-3 inline mr-1" />{tool.usage.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-semibold transition flex items-center justify-center gap-1">
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-semibold transition">
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Categories */}
        {activeTab === 'categories' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Categories</h3>
              <button className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Image Tools', 'PDF Tools', 'AI Tools', 'Finance Tools', 'Social Media Tools', 'Developer Tools'].map((cat) => (
                <div key={cat} className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">{cat}</h4>
                    <p className="text-gray-400 text-xs">{Math.floor(Math.random() * 10) + 3} tools</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition"><Edit3 className="w-4 h-4 text-gray-400" /></button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Comments */}
        {activeTab === 'comments' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white">Comments</h3>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No comments yet. Comments will appear here when users leave feedback on blog posts.</p>
            </div>
          </motion.div>
        )}

        {/* Subscribers */}
        {activeTab === 'subscribers' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white">Newsletter Subscribers</h3>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { email: 'subscriber1@example.com', name: 'John Doe', active: true, date: 'Jun 15, 2026' },
                    { email: 'subscriber2@example.com', name: 'Jane Smith', active: true, date: 'Jun 12, 2026' },
                    { email: 'subscriber3@example.com', name: 'Bob Wilson', active: true, date: 'Jun 10, 2026' },
                  ].map((sub) => (
                    <tr key={sub.email} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white">{sub.email}</td>
                      <td className="py-3 px-4 text-gray-300">{sub.name}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs ${sub.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{sub.active ? 'Active' : 'Inactive'}</span></td>
                      <td className="py-3 px-4 text-gray-400">{sub.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-bold text-white">Analytics Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-white">{stats?.totalViews?.toLocaleString() || '0'}</p>
                <p className="text-gray-400 text-sm mt-1">Total Page Views (30d)</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-white">{stats?.totalUsage?.toLocaleString() || '0'}</p>
                <p className="text-gray-400 text-sm mt-1">Tool Uses (30d)</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-white">{stats?.totalSubscribers || 0}</p>
                <p className="text-gray-400 text-sm mt-1">Newsletter Subscribers</p>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-4">Traffic by Page</h4>
              <div className="space-y-3">
                {[
                  { url: '/', views: 2500 },
                  { url: '/tools/image-compressor', views: 1800 },
                  { url: '/tools/pdf-merger', views: 1200 },
                  { url: '/tools/ai-thumbnail-generator', views: 950 },
                  { url: '/blog', views: 800 },
                ].map((page) => (
                  <div key={page.url} className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm flex-1 truncate font-mono">{page.url}</span>
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${(page.views / 2500) * 100}%` }} />
                    </div>
                    <span className="text-white text-sm font-mono w-12 text-right">{page.views}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
