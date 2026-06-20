/**
 * CMS Admin Panel - Complete Content Management System
 * Dashboard with Overview, Tools, Blogs, Categories, SEO, Analytics, Users, AI Generator, Media, Settings
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Wrench, Users, BarChart3, Settings, Tag,
  Image, Brain, Shield, Download, Upload, Plus, Edit3, Trash2, Eye,
  Search, ChevronDown, TrendingUp, Star, Clock, Mail, Globe, Activity,
  ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, X, Save, Send,
  Calendar, Hash, Zap, Copy, ExternalLink, Filter, SortAsc, SortDesc
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../../config/blog-data';
import { CATEGORIES, searchTools, type ToolEntry, type ToolCategory } from '../../config/tools-database';

type Tab = 'overview' | 'tools' | 'blogs' | 'categories' | 'seo' | 'analytics' | 'users' | 'ai-generator' | 'media' | 'settings';

/* ─── Stats Cards ─── */

function StatCard({ icon: Icon, label, value, change, color }: {
  icon: any; label: string; value: string | number; change?: string; color: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            change.startsWith('+') ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/40 mt-1">{label}</div>
    </div>
  );
}

/* ─── Data Table ─── */

function DataTable({ columns, data, onEdit, onDelete, onPublish }: {
  columns: Array<{ key: string; label: string; render?: (val: any, row: any) => React.ReactNode }>;
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onPublish?: (row: any) => void;
}) {
  const [sortKey, setSortKey] = useState(columns[0]?.key || '');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey] || '';
      const bVal = b[sortKey] || '';
      if (sortDir === 'asc') return String(aVal).localeCompare(String(bVal));
      return String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortDir]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => { setSortKey(col.key); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}
                className="text-left py-3 px-4 text-[10px] font-bold text-white/40 uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && (sortDir === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                </span>
              </th>
            ))}
            <th className="text-right py-3 px-4 text-[10px] font-bold text-white/40 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={row.id || i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              {columns.map(col => (
                <td key={col.key} className="py-3 px-4 text-white/70">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {onPublish && (
                    <button onClick={() => onPublish(row)} className="p-1.5 hover:bg-green-500/10 rounded-lg transition-colors" title="Publish">
                      <Send className="w-3.5 h-3.5 text-green-400" />
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                      <Edit3 className="w-3.5 h-3.5 text-white/50" />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Modal ─── */

function Modal({ isOpen, onClose, title, children }: {
  isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl max-h-[80vh] bg-slate-900 border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main CMS Dashboard ─── */

export default function CMSDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'tool' | 'blog' | 'category' | 'user' | 'media' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Stats
  const stats = useMemo(() => ({
    totalTools: 80,
    totalBlogs: BLOG_POSTS.length,
    totalCategories: BLOG_CATEGORIES.length + CATEGORIES.length,
    totalViews: 12500,
    totalUsage: 8400,
    trendingTools: 12,
    recentActivities: 45,
  }), []);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'tools' as const, label: 'Tools', icon: Wrench },
    { id: 'blogs' as const, label: 'Blogs', icon: FileText },
    { id: 'categories' as const, label: 'Categories', icon: Tag },
    { id: 'seo' as const, label: 'SEO', icon: Globe },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'ai-generator' as const, label: 'AI Generator', icon: Brain },
    { id: 'media' as const, label: 'Media', icon: Image },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-950/95 border-r border-white/[0.06] min-h-screen sticky top-0 flex flex-col">
          <div className="p-5 border-b border-white/[0.06]">
            <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> <span className="text-xs">Back to Site</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">CMS Panel</h1>
                <p className="text-[10px] text-white/40">Content Management</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
              <p className="text-sm text-white/40 mt-1">
                {activeTab === 'overview' && 'Dashboard overview and quick stats'}
                {activeTab === 'tools' && 'Manage all tools and their content'}
                {activeTab === 'blogs' && 'Create and manage blog posts'}
                {activeTab === 'categories' && 'Organize content by categories'}
                {activeTab === 'seo' && 'Optimize for search engines'}
                {activeTab === 'analytics' && 'Track usage and engagement'}
                {activeTab === 'users' && 'Manage user accounts and roles'}
                {activeTab === 'ai-generator' && 'Generate content with AI'}
                {activeTab === 'media' && 'Manage images and files'}
                {activeTab === 'settings' && 'Configure system settings'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors w-64"
                />
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewTab stats={stats} />}
            {activeTab === 'tools' && <ToolsTab searchQuery={searchQuery} onEdit={(item) => { setEditingItem(item); setModalType('tool'); setShowModal(true); }} />}
            {activeTab === 'blogs' && <BlogsTab searchQuery={searchQuery} onEdit={(item) => { setEditingItem(item); setModalType('blog'); setShowModal(true); }} />}
            {activeTab === 'categories' && <CategoriesTab />}
            {activeTab === 'seo' && <SEOTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'ai-generator' && <AIGeneratorTab />}
            {activeTab === 'media' && <MediaTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </AnimatePresence>
        </main>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} title={`Edit ${modalType}`}>
        {modalType === 'tool' && <ToolEditor item={editingItem} onClose={() => { setShowModal(false); setEditingItem(null); }} />}
        {modalType === 'blog' && <BlogEditor item={editingItem} onClose={() => { setShowModal(false); setEditingItem(null); }} />}
      </Modal>
    </div>
  );
}

/* ─── Overview Tab ─── */

function OverviewTab({ stats }: { stats: any }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wrench} label="Total Tools" value={stats.totalTools} change="+5 this month" color="bg-blue-500/10 text-blue-400" />
        <StatCard icon={FileText} label="Total Blogs" value={stats.totalBlogs} change="+3 this week" color="bg-purple-500/10 text-purple-400" />
        <StatCard icon={Eye} label="Total Views" value={stats.totalViews.toLocaleString()} change="+12%" color="bg-green-500/10 text-green-400" />
        <StatCard icon={TrendingUp} label="Tool Uses" value={stats.totalUsage.toLocaleString()} change="+8%" color="bg-amber-500/10 text-amber-400" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { action: 'New blog post published', title: 'Best AI Tools in 2026', time: '2 hours ago', type: 'blog' },
            { action: 'Tool updated', title: 'Image Compressor', time: '5 hours ago', type: 'tool' },
            { action: 'New user registered', title: 'user@example.com', time: '1 day ago', type: 'user' },
            { action: 'SEO score improved', title: 'Homepage', time: '1 day ago', type: 'seo' },
            { action: 'Backup completed', title: 'Daily backup', time: '2 days ago', type: 'backup' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                item.type === 'blog' ? 'bg-purple-500/10 text-purple-400' :
                item.type === 'tool' ? 'bg-blue-500/10 text-blue-400' :
                item.type === 'user' ? 'bg-green-500/10 text-green-400' :
                item.type === 'seo' ? 'bg-amber-500/10 text-amber-400' :
                'bg-cyan-500/10 text-cyan-400'
              }`}>
                {item.type === 'blog' ? <FileText className="w-4 h-4" /> :
                 item.type === 'tool' ? <Wrench className="w-4 h-4" /> :
                 item.type === 'user' ? <Users className="w-4 h-4" /> :
                 item.type === 'seo' ? <Globe className="w-4 h-4" /> :
                 <Download className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80">{item.action}</p>
                <p className="text-xs text-white/40 truncate">{item.title}</p>
              </div>
              <span className="text-[10px] text-white/30">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tools Tab ─── */

function ToolsTab({ searchQuery, onEdit }: { searchQuery: string; onEdit: (item: any) => void }) {
  const tools = useMemo(() => {
    const allTools = searchQuery ? searchTools(searchQuery) : searchTools('');
    return allTools.slice(0, 50);
  }, [searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">{tools.length} tools found</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Tool
        </button>
      </div>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category', render: (val) => (
            <span className="text-xs px-2 py-0.5 bg-white/[0.06] rounded-full">{val?.replace('-tools', '')}</span>
          )},
          { key: 'shortDescription', label: 'Description', render: (val) => (
            <span className="text-xs text-white/40 truncate max-w-[200px] block">{val}</span>
          )},
          { key: 'featured', label: 'Featured', render: (val) => val ? <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <span className="text-white/20">—</span> },
          { key: 'trending', label: 'Trending', render: (val) => val ? <TrendingUp className="w-3.5 h-3.5 text-red-400" /> : <span className="text-white/20">—</span> },
        ]}
        data={tools}
        onEdit={onEdit}
        onDelete={(row) => console.log('Delete:', row)}
      />
    </motion.div>
  );
}

/* ─── Blogs Tab ─── */

function BlogsTab({ searchQuery, onEdit }: { searchQuery: string; onEdit: (item: any) => void }) {
  const blogs = useMemo(() => {
    if (!searchQuery) return BLOG_POSTS;
    const q = searchQuery.toLowerCase();
    return BLOG_POSTS.filter(b => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">{blogs.length} blog posts</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>
      <DataTable
        columns={[
          { key: 'title', label: 'Title', render: (val) => <span className="font-bold text-white">{val}</span> },
          { key: 'category', label: 'Category', render: (val) => {
            const cat = BLOG_CATEGORIES.find(c => c.id === val);
            return <span className="text-xs px-2 py-0.5 bg-white/[0.06] rounded-full">{cat?.icon} {cat?.name || val}</span>;
          }},
          { key: 'publishDate', label: 'Date' },
          { key: 'readTime', label: 'Read Time' },
          { key: 'featured', label: 'Featured', render: (val) => val ? <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <span className="text-white/20">—</span> },
        ]}
        data={blogs}
        onEdit={onEdit}
        onDelete={(row) => console.log('Delete:', row)}
      />
    </motion.div>
  );
}

/* ─── Categories Tab ─── */

function CategoriesTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...BLOG_CATEGORIES, ...CATEGORIES.map(c => ({ id: c.id, name: c.name, icon: '🔧', description: c.description, color: c.color }))].map(cat => (
          <div key={cat.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                <p className="text-[10px] text-white/30">{cat.id}</p>
              </div>
            </div>
            <p className="text-xs text-white/40 line-clamp-2">{cat.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── SEO Tab ─── */

function SEOTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">Global SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 block mb-1">Site Title</label>
            <input type="text" defaultValue="CreatorBoost AI" className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Meta Description</label>
            <textarea defaultValue="100+ free online tools: AI generators, image editors, PDF tools, financial calculators, social media tools." className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 h-20 resize-none" />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Canonical URL</label>
            <input type="text" defaultValue="https://creatorboostai.xyz" className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Robots</label>
            <select className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50">
              <option>index, follow</option>
              <option>noindex, nofollow</option>
            </select>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" /> Save SEO Settings
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Analytics Tab ─── */

function AnalyticsTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Daily Views" value="1,250" change="+15%" color="bg-blue-500/10 text-blue-400" />
        <StatCard icon={Wrench} label="Tool Uses Today" value="890" change="+8%" color="bg-green-500/10 text-green-400" />
        <StatCard icon={Users} label="Active Users" value="342" change="+5%" color="bg-purple-500/10 text-purple-400" />
        <StatCard icon={TrendingUp} label="Bounce Rate" value="32%" change="-3%" color="bg-amber-500/10 text-amber-400" />
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">Top Tools by Usage</h3>
        <div className="space-y-3">
          {[
            { name: 'Image Compressor', uses: 2450, trend: '+12%' },
            { name: 'PDF Merger', uses: 1890, trend: '+8%' },
            { name: 'QR Code Generator', uses: 1560, trend: '+15%' },
            { name: 'Hashtag Generator', uses: 1230, trend: '+5%' },
            { name: 'YouTube Title Generator', uses: 980, trend: '+20%' },
          ].map((tool, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
              <span className="text-xs font-bold text-white/30 w-6">#{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{tool.name}</p>
              </div>
              <span className="text-sm text-white/60">{tool.uses.toLocaleString()} uses</span>
              <span className="text-[10px] font-bold text-green-400">{tool.trend}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-white text-sm rounded-xl hover:bg-white/[0.08] transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-white text-sm rounded-xl hover:bg-white/[0.08] transition-colors">
          <BarChart3 className="w-4 h-4" /> Full Report
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Users Tab ─── */

function UsersTab() {
  const roles = ['admin', 'editor', 'author'];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {roles.map(role => (
          <div key={role} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 text-center">
            <Users className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white capitalize">{role}s</div>
            <div className="text-xs text-white/40">
              {role === 'admin' ? '1 user' : role === 'editor' ? '2 users' : '3 users'}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">Permissions Matrix</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-2 text-[10px] text-white/40 uppercase">Permission</th>
              <th className="text-center py-2 text-[10px] text-white/40 uppercase">Admin</th>
              <th className="text-center py-2 text-[10px] text-white/40 uppercase">Editor</th>
              <th className="text-center py-2 text-[10px] text-white/40 uppercase">Author</th>
            </tr>
          </thead>
          <tbody className="text-white/60">
            {[
              { perm: 'Create Content', admin: true, editor: true, author: true },
              { perm: 'Edit Content', admin: true, editor: true, author: false },
              { perm: 'Delete Content', admin: true, editor: false, author: false },
              { perm: 'Publish Content', admin: true, editor: true, author: false },
              { perm: 'Manage Users', admin: true, editor: false, author: false },
              { perm: 'View Analytics', admin: true, editor: true, author: false },
              { perm: 'System Settings', admin: true, editor: false, author: false },
            ].map((row, i) => (
              <tr key={i} className="border-b border-white/[0.04]">
                <td className="py-2">{row.perm}</td>
                <td className="text-center py-2">{row.admin ? <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />}</td>
                <td className="text-center py-2">{row.editor ? <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />}</td>
                <td className="text-center py-2">{row.author ? <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-white/20 mx-auto" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ─── AI Generator Tab ─── */

function AIGeneratorTab() {
  const [generatorType, setGeneratorType] = useState<'blog' | 'tool' | 'meta'>('blog');
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    // Simulate AI generation
    await new Promise(r => setTimeout(r, 2000));
    setResult(`Generated ${generatorType} content for: ${topic}\n\nThis is a preview of AI-generated content. In production, this would call the Gemini API.`);
    setGenerating(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex gap-2">
        {[
          { id: 'blog' as const, label: 'Blog Article', icon: FileText },
          { id: 'tool' as const, label: 'Tool Description', icon: Wrench },
          { id: 'meta' as const, label: 'Meta Tags', icon: Globe },
        ].map(type => (
          <button
            key={type.id}
            onClick={() => setGeneratorType(type.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              generatorType === type.id
                ? 'bg-primary text-black'
                : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:text-white'
            }`}
          >
            <type.icon className="w-4 h-4" /> {type.label}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-xs text-white/40 block mb-1">Topic / Subject</label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder={generatorType === 'blog' ? 'e.g., Best AI Tools for Content Creators' : generatorType === 'tool' ? 'e.g., Image Compressor' : 'e.g., CreatorBoost AI Homepage'}
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
          />
        </div>

        {generatorType === 'blog' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 block mb-1">Category</label>
              <select className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50">
                <option>AI</option>
                <option>YouTube</option>
                <option>SEO</option>
                <option>Tutorials</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1">Tone</label>
              <select className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50">
                <option>Professional</option>
                <option>Casual</option>
                <option>Technical</option>
                <option>Conversational</option>
              </select>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || generating}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {generating ? 'Generating...' : 'Generate'}
        </button>

        {result && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
            <pre className="text-sm text-white/60 whitespace-pre-wrap font-mono">{result}</pre>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Media Tab ─── */

function MediaTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="border-2 border-dashed border-white/[0.1] rounded-2xl p-12 text-center hover:border-primary/30 transition-colors cursor-pointer">
        <Upload className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-sm text-white/50 mb-2">Drag & drop files here, or click to browse</p>
        <p className="text-xs text-white/30">Supports: JPG, PNG, WebP, GIF, SVG, PDF (Max 50MB)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center hover:border-white/[0.12] transition-colors cursor-pointer">
            <Image className="w-8 h-8 text-white/10" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Settings Tab ─── */

function SettingsTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">General Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/40 block mb-1">Site Name</label>
            <input type="text" defaultValue="CreatorBoost AI" className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-xs text-white/40 block mb-1">Site URL</label>
            <input type="text" defaultValue="https://creatorboostai.xyz" className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Backup & Export</h3>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-white text-sm rounded-xl hover:bg-white/[0.08] transition-colors">
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-white text-sm rounded-xl hover:bg-white/[0.08] transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.06] text-white text-sm rounded-xl hover:bg-white/[0.08] transition-colors">
            <Upload className="w-4 h-4" /> Import
          </button>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Danger Zone</h3>
        <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
          <div>
            <p className="text-sm font-bold text-red-400">Delete All Data</p>
            <p className="text-xs text-white/40">This action cannot be undone.</p>
          </div>
          <button className="px-4 py-2 bg-red-500/20 text-red-400 text-sm font-bold rounded-xl hover:bg-red-500/30 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tool Editor Modal ─── */

function ToolEditor({ item, onClose }: { item: any; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 block mb-1">Tool Name</label>
          <input type="text" defaultValue={item?.name} className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="text-xs text-white/40 block mb-1">Slug</label>
          <input type="text" defaultValue={item?.slug} className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
        </div>
      </div>
      <div>
        <label className="text-xs text-white/40 block mb-1">Description</label>
        <textarea defaultValue={item?.shortDescription} className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 h-20 resize-none" />
      </div>
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] text-white text-sm rounded-xl hover:bg-white/[0.08] transition-colors">Cancel</button>
        <button className="flex-1 px-4 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">Save</button>
      </div>
    </div>
  );
}

/* ─── Blog Editor Modal ─── */

function BlogEditor({ item, onClose }: { item: any; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-white/40 block mb-1">Title</label>
        <input type="text" defaultValue={item?.title} className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/40 block mb-1">Slug</label>
          <input type="text" defaultValue={item?.slug} className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
        </div>
        <div>
          <label className="text-xs text-white/40 block mb-1">Category</label>
          <select defaultValue={item?.category} className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50">
            {BLOG_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-white/40 block mb-1">Excerpt</label>
        <textarea defaultValue={item?.excerpt} className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 h-20 resize-none" />
      </div>
      <div>
        <label className="text-xs text-white/40 block mb-1">Content</label>
        <textarea defaultValue={item?.content} className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 h-40 resize-none font-mono" />
      </div>
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] text-white text-sm rounded-xl hover:bg-white/[0.08] transition-colors">Cancel</button>
        <button className="flex-1 px-4 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors">Save</button>
      </div>
    </div>
  );
}
