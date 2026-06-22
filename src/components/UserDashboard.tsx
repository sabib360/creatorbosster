/**
 * Premium User Dashboard
 * AI workspace inspired by Notion, Linear, Raycast, Perplexity, Arc Browser, Vercel.
 */

import { useState, useEffect, useMemo, useCallback, useRef, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Clock, Star, TrendingUp, Sparkles, ArrowRight, BarChart3,
  Heart, Zap, History, Search, Trash2, X, Home, Bookmark,
  Image, FileText, QrCode, Settings, HelpCircle, Bell, ChevronDown,
  ChevronRight, Download,   TrendingDown, Plus,
  Eye, Copy, Share2, LayoutGrid, List, Filter, SortAsc, SortDesc,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCw, LogOut,
  LogIn, User, Menu, Sun, Moon, Command, Target, Flame, Award,
  Calendar, FolderOpen, Brain, FileImage, Megaphone, Clapperboard,
  Globe, Hash, Calculator, Palette, Maximize2, Minimize2,
  Activity, PieChart, LineChart as LineChartIcon, Grid3x3, Layers,
  CheckCircle2, AlertCircle, Info, ExternalLink, Link2, Timer,
  Shield, Lock, Globe as GlobeIcon, Mail, Smartphone
} from 'lucide-react';
import { getRecentlyUsed } from '../hooks/useRecentlyUsed';

interface RecentTool {
  path: string;
  name: string;
  timestamp: number;
}
import { useFavorites } from '../hooks/useFavorites';
import { getTrendingTools, getPopularTools, searchTools, type ToolEntry } from '../config/tools-database';
import { getUsageStats } from '../lib/trending';
import { cn } from '../lib/utils';

/* ═══════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════ */

interface ActivityItem {
  id: string;
  toolName: string;
  toolPath: string;
  action: string;
  timestamp: number;
  category: string;
  status: 'success' | 'pending' | 'error';
}

interface CreationItem {
  id: string;
  type: 'image' | 'caption' | 'script' | 'qr' | 'thumbnail';
  title: string;
  toolUsed: string;
  timestamp: number;
  data?: string;
  favorited: boolean;
}

interface NotificationItem {
  id: string;
  type: 'feature' | 'update' | 'trending' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface SettingsState {
  theme: 'dark' | 'light';
  notifications: boolean;
  compactMode: boolean;
  language: string;
}

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════ */

const QUICK_ACTIONS = [
  { label: 'Generate Image', path: '/tools/ai-image-generator', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { label: 'Remove BG', path: '/tools/background-remover', icon: Scissors, color: 'from-emerald-500 to-teal-500' },
  { label: 'Create Caption', path: '/tools/ai-caption-generator', icon: Megaphone, color: 'from-blue-500 to-cyan-500' },
  { label: 'Generate Script', path: '/tools/youtube-script-writer', icon: Clapperboard, color: 'from-orange-500 to-red-500' },
] as const;

type DashboardTab = 'overview' | 'creations' | 'history' | 'analytics' | 'trending' | 'growth' | 'settings';

const TAB_ITEMS: { id: DashboardTab; label: string; icon: typeof Home }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'creations', label: 'My Creations', icon: FolderOpen },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'growth', label: 'Growth', icon: Award },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ACTIVITY_ICONS: Record<string, typeof Image> = {
  'image-tools': Image,
  'ai-tools': Brain,
  'pdf-tools': FileText,
  'youtube-tools': Clapperboard,
  'social-media-tools': Megaphone,
  'seo-tools': Globe,
  'developer-tools': Zap,
  'finance-tools': Calculator,
};

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function getActivityStorage(): ActivityItem[] {
  try { return JSON.parse(localStorage.getItem('cb_activity') || '[]'); } catch { return []; }
}

function saveActivity(item: ActivityItem) {
  const items = getActivityStorage();
  items.unshift(item);
  localStorage.setItem('cb_activity', JSON.stringify(items.slice(0, 100)));
}

function getCreationsStorage(): CreationItem[] {
  try { return JSON.parse(localStorage.getItem('cb_creations') || '[]'); } catch { return []; }
}

function saveCreations(items: CreationItem[]) {
  localStorage.setItem('cb_creations', JSON.stringify(items.slice(0, 200)));
}

function getNotificationsStorage(): NotificationItem[] {
  try {
    const stored = JSON.parse(localStorage.getItem('cb_notifications') || '[]');
    if (stored.length > 0) return stored;
  } catch {}
  // Default notifications
  const defaults: NotificationItem[] = [
    { id: '1', type: 'feature', title: 'New: Batch Background Remover', message: 'Process up to 20 images at once with our new batch mode.', timestamp: Date.now() - 86400000, read: false },
    { id: '2', type: 'update', title: 'AI Image Generator Updated', message: 'New styles and improved quality. Try it now!', timestamp: Date.now() - 172800000, read: false },
    { id: '3', type: 'trending', title: 'Trending: YouTube Script Writer', message: 'This tool is getting popular. Check it out!', timestamp: Date.now() - 259200000, read: true },
    { id: '4', type: 'system', title: 'Welcome to CreatorBoost AI', message: 'Start using tools and track your progress here.', timestamp: Date.now() - 345600000, read: true },
  ];
  localStorage.setItem('cb_notifications', JSON.stringify(defaults));
  return defaults;
}

function generateMockCreations(): CreationItem[] {
  const existing = getCreationsStorage();
  if (existing.length > 0) return existing;
  const mock: CreationItem[] = [
    { id: 'c1', type: 'image', title: 'Product Photo - Clean BG', toolUsed: 'Background Remover', timestamp: Date.now() - 3600000, favorited: true },
    { id: 'c2', type: 'caption', title: 'Instagram Travel Caption', toolUsed: 'AI Caption Generator', timestamp: Date.now() - 7200000, favorited: false },
    { id: 'c3', type: 'script', title: 'YouTube Video Script', toolUsed: 'YouTube Script Writer', timestamp: Date.now() - 86400000, favorited: true },
    { id: 'c4', type: 'qr', title: 'WiFi QR Code', toolUsed: 'QR Code Generator', timestamp: Date.now() - 172800000, favorited: false },
    { id: 'c5', type: 'thumbnail', title: 'Gaming Thumbnail', toolUsed: 'Thumbnail Generator', timestamp: Date.now() - 259200000, favorited: false },
    { id: 'c6', type: 'image', title: 'Profile Picture', toolUsed: 'Background Remover', timestamp: Date.now() - 345600000, favorited: true },
  ];
  saveCreations(mock);
  return mock;
}

function getStreakDays(): number {
  try {
    const streak = parseInt(localStorage.getItem('cb_streak') || '0');
    const lastVisit = localStorage.getItem('cb_last_visit');
    if (!lastVisit) return 0;
    const daysSince = Math.floor((Date.now() - parseInt(lastVisit)) / 86400000);
    if (daysSince > 1) {
      localStorage.setItem('cb_streak', '0');
      return 0;
    }
    return streak;
  } catch { return 0; }
}

function incrementStreak() {
  try {
    const lastVisit = localStorage.getItem('cb_last_visit');
    if (!lastVisit) {
      localStorage.setItem('cb_streak', '1');
      localStorage.setItem('cb_last_visit', String(Date.now()));
      return;
    }
    const daysSince = Math.floor((Date.now() - parseInt(lastVisit)) / 86400000);
    const current = parseInt(localStorage.getItem('cb_streak') || '0');
    if (daysSince === 0) {
      localStorage.setItem('cb_last_visit', String(Date.now()));
      return;
    }
    if (daysSince === 1) {
      localStorage.setItem('cb_streak', String(current + 1));
    } else {
      localStorage.setItem('cb_streak', '1');
    }
    localStorage.setItem('cb_last_visit', String(Date.now()));
  } catch {}
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{formatNumber(count)}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════════
   COMMAND PALETTE
   ═══════════════════════════════════════════════════════════════════ */

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchTools(query).slice(0, 8);
  }, [query]);

  const allItems = useMemo(() => {
    return [
      ...results.map(r => ({ type: 'tool' as const, label: r.name, desc: r.shortDescription, path: `/tools/${r.slug}`, icon: Zap })),
      ...(!query.trim() ? [
        { type: 'nav' as const, label: 'Home', desc: 'Go to homepage', path: '/', icon: Home },
        { type: 'nav' as const, label: 'Image Tools', desc: 'Browse image tools', path: '/image-tools', icon: Image },
        { type: 'nav' as const, label: 'AI Tools', desc: 'Browse AI tools', path: '/ai-tools', icon: Brain },
        { type: 'nav' as const, label: 'PDF Tools', desc: 'Browse PDF tools', path: '/pdf-tools', icon: FileText },
      ] : []),
    ];
  }, [results, query]);

  const handleSelect = useCallback((path: string) => {
    navigate(path);
    onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, allItems.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && allItems[selectedIdx]) handleSelect(allItems[selectedIdx].path);
    };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, allItems, selectedIdx, handleSelect]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="relative w-full max-w-xl mx-4 bg-slate-900 border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <Command className="w-4 h-4 text-white/30" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
            placeholder="Search tools, pages, actions..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
          <kbd className="px-1.5 py-0.5 bg-white/[0.06] text-[10px] text-white/30 rounded font-mono border border-white/[0.08]">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {allItems.length === 0 && query.trim() && (
            <p className="text-center text-sm text-white/30 py-8">No results found</p>
          )}
          {allItems.map((item, i) => (
            <button
              key={`${item.type}-${item.path}`}
              onClick={() => handleSelect(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                i === selectedIdx ? 'bg-white/[0.08] text-white' : 'text-white/60 hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.label}</p>
                <p className="text-[10px] text-white/30 truncate">{item.desc}</p>
              </div>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════ */

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ── Core State ── */
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [recentTools, setRecentTools] = useState<RecentTool[]>(getRecentlyUsed);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [stats, setStats] = useState(getUsageStats);
  const [streak, setStreak] = useState(0);

  /* ── Activity & Creations ── */
  const [activity, setActivity] = useState<ActivityItem[]>(getActivityStorage);
  const [creations, setCreations] = useState<CreationItem[]>(generateMockCreations);

  /* ── Notifications ── */
  const [notifications, setNotifications] = useState<NotificationItem[]>(getNotificationsStorage);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  /* ── Command Palette ── */
  const [cmdOpen, setCmdOpen] = useState(false);

  /* ── History Search ── */
  const [historySearch, setHistorySearch] = useState('');
  const [historySort, setHistorySort] = useState<'newest' | 'oldest'>('newest');

  /* ── Creations Filter ── */
  const [creationFilter, setCreationFilter] = useState<string>('all');
  const [creationSort, setCreationSort] = useState<'newest' | 'oldest'>('newest');
  const [creationSearch, setCreationSearch] = useState('');

  /* ── Trending Tab ── */
  const [trendingTab, setTrendingTab] = useState<'trending' | 'popular' | 'new'>('trending');

  /* ── Init streak ── */
  useEffect(() => {
    incrementStreak();
    setStreak(getStreakDays());
  }, []);

  /* ── Keyboard shortcut for Cmd+K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── Refresh data ── */
  useEffect(() => {
    const refresh = () => {
      setRecentTools(getRecentlyUsed());
      setStats(getUsageStats());
      setActivity(getActivityStorage());
      setCreations(getCreationsStorage());
    };
    window.addEventListener('storage', refresh);
    window.addEventListener('favoritesChanged', refresh);
    window.addEventListener('trendingChanged', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('favoritesChanged', refresh);
      window.removeEventListener('trendingChanged', refresh);
    };
  }, []);

  /* ── Derived Data ── */
  const trending = useMemo(() => getTrendingTools().slice(0, 12), []);
  const popular = useMemo(() => getPopularTools().slice(0, 12), []);
  const newTools = useMemo(() => getTrendingTools().filter(t => (t as any).isNew).slice(0, 6), []);

  const favoriteTools = useMemo(() => {
    if (favorites.length === 0) return [];
    return favorites.slice(0, 20).map(id => {
      const tools = searchTools(id);
      return tools[0] || null;
    }).filter(Boolean) as ToolEntry[];
  }, [favorites]);

  const filteredHistory = useMemo(() => {
    let items = [...recentTools];
    if (historySearch) {
      items = items.filter(t => t.name.toLowerCase().includes(historySearch.toLowerCase()));
    }
    items.sort((a, b) => historySort === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    return items;
  }, [recentTools, historySearch, historySort]);

  const filteredCreations = useMemo(() => {
    let items = [...creations];
    if (creationFilter !== 'all') items = items.filter(c => c.type === creationFilter);
    if (creationSearch) items = items.filter(c => c.title.toLowerCase().includes(creationSearch.toLowerCase()));
    items.sort((a, b) => creationSort === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    return items;
  }, [creations, creationFilter, creationSort, creationSearch]);

  const mostUsedTool = useMemo(() => {
    if (stats.mostUsed.length === 0) return null;
    return searchTools(stats.mostUsed[0].id)[0] || null;
  }, [stats.mostUsed]);

  const favoriteTool = useMemo(() => {
    if (favorites.length === 0) return null;
    return searchTools(favorites[0])[0] || null;
  }, [favorites]);

  /* ── Actions ── */
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    localStorage.setItem('cb_notifications', JSON.stringify(notifications.map(n => n.id === id ? { ...n, read: true } : n)));
  }, [notifications]);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('creatorboost_recently_used');
    setRecentTools([]);
  }, []);

  const deleteHistoryItem = useCallback((path: string) => {
    const items = recentTools.filter(t => t.path !== path);
    localStorage.setItem('creatorboost_recently_used', JSON.stringify(items));
    setRecentTools(items);
  }, [recentTools]);

  const deleteCreation = useCallback((id: string) => {
    const items = creations.filter(c => c.id !== id);
    saveCreations(items);
    setCreations(items);
  }, [creations]);

  const toggleCreationFavorite = useCallback((id: string) => {
    const items = creations.map(c => c.id === id ? { ...c, favorited: !c.favorited } : c);
    saveCreations(items);
    setCreations(items);
  }, [creations]);

  const isEmpty = recentTools.length === 0 && favorites.length === 0;

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="space-y-6">

      {/* ═══════ SECTION 1: WELCOME HERO ═══════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/[0.06] p-6 sm:p-8"
      >
        {/* Aurora gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white mb-1"
              >
                Welcome Back {streak > 0 && <span className="text-primary">🔥</span>}
              </motion.h1>
              <p className="text-sm text-white/50">Your AI workspace at a glance.</p>
            </div>

            {/* Streak badge */}
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full self-start"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">{streak} day streak</span>
              </motion.div>
            )}
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Most Used', value: mostUsedTool?.name || '—', icon: Target, color: 'text-primary' },
              { label: 'Favorite', value: favoriteTool?.name || '—', icon: Heart, color: 'text-pink-400' },
              { label: 'Tools Used', value: String(stats.totalUsage), icon: Zap, color: 'text-cyan-400' },
              { label: 'Favorites', value: String(stats.totalFavorites), icon: Star, color: 'text-amber-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <stat.icon className={cn("w-3 h-3", stat.color)} />
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-sm font-bold text-white truncate">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Link
                  to={action.path}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-xl text-sm font-medium text-white/80 hover:text-white transition-all group"
                >
                  <div className={cn("w-6 h-6 rounded-lg bg-gradient-to-br flex items-center justify-center", action.color)}>
                    <action.icon className="w-3 h-3 text-white" />
                  </div>
                  <span>{action.label}</span>
                  <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-white/60 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════ TOP BAR: Tabs + Search + Actions ═══════ */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl flex-shrink-0">
          {TAB_ITEMS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "text-white/40 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <button
          onClick={() => setCmdOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="px-1 py-0.5 bg-white/[0.06] text-[9px] text-white/30 rounded font-mono border border-white/[0.08]">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] transition-all"
          >
            <Bell className="w-4 h-4 text-white/50" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[9px] text-white font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-slate-900 border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  <button
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      localStorage.setItem('cb_notifications', JSON.stringify(notifications.map(n => ({ ...n, read: true }))));
                    }}
                    className="text-[10px] text-primary hover:text-primary/80 font-bold"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={cn(
                        "w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors",
                        !n.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white">{n.title}</p>
                          <p className="text-[10px] text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[9px] text-white/20 mt-1">{timeAgo(n.timestamp)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══════ OVERVIEW TAB ═══════ */}
      {activeTab === 'overview' && (
        <motion.div
          key="overview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Empty State */}
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-lg font-bold text-white/60 mb-2">Welcome to CreatorBoost AI</h3>
              <p className="text-sm text-white/40 max-w-md mx-auto mb-6">
                Start using tools and they will appear here. Your recent tools, favorites, and usage stats will be tracked automatically.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Browse Tools <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {/* Recent Activity */}
          {recentTools.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" /> Recent Activity
                </h2>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {recentTools.slice(0, 5).map((tool, i) => {
                  const toolData = searchTools(tool.name)[0];
                  return (
                    <motion.div
                      key={tool.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={tool.path}
                        className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{tool.name}</p>
                          <p className="text-[10px] text-white/30">{timeAgo(tool.timestamp)}</p>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 flex-shrink-0" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Favorites Quick Access */}
          {favoriteTools.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" /> Favorites
                </h2>
                <button
                  onClick={() => setActiveTab('creations')}
                  className="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {favoriteTools.slice(0, 8).map((tool, i) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      to={`/tools/${tool.slug}`}
                      className="block p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-pink-500/20 hover:bg-white/[0.06] transition-all group text-center"
                    >
                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                        <Star className="w-5 h-5 text-pink-400 fill-pink-400" />
                      </div>
                      <p className="text-xs font-bold text-white truncate group-hover:text-pink-400 transition-colors">{tool.name}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Trending Quick */}
          {trending.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-400" /> Trending Now
                </h2>
                <button
                  onClick={() => setActiveTab('trending')}
                  className="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {trending.slice(0, 6).map((tool, i) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/tools/${tool.slug}`}
                      className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{tool.name}</p>
                        <p className="text-[10px] text-white/30 truncate">{tool.shortDescription}</p>
                      </div>
                      {tool.trending && (
                        <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full flex-shrink-0">HOT</span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      )}

      {/* ═══════ MY CREATIONS TAB ═══════ */}
      {activeTab === 'creations' && (
        <motion.div
          key="creations"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'image', label: 'Images' },
                { id: 'caption', label: 'Captions' },
                { id: 'script', label: 'Scripts' },
                { id: 'qr', label: 'QR Codes' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCreationFilter(f.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                    creationFilter === f.id ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <Search className="w-3.5 h-3.5 text-white/30" />
              <input
                value={creationSearch}
                onChange={e => setCreationSearch(e.target.value)}
                placeholder="Search creations..."
                className="bg-transparent text-xs text-white placeholder:text-white/30 outline-none w-32"
              />
            </div>
            <button
              onClick={() => setCreationSort(s => s === 'newest' ? 'oldest' : 'newest')}
              className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] transition-colors"
            >
              {creationSort === 'newest' ? <SortDesc className="w-3.5 h-3.5 text-white/50" /> : <SortAsc className="w-3.5 h-3.5 text-white/50" />}
            </button>
          </div>

          {/* Creations Grid */}
          {filteredCreations.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">No creations yet</p>
              <p className="text-xs text-white/20 mt-1">Your generated content will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCreations.map((creation, i) => {
                const typeIcons: Record<string, typeof Image> = {
                  image: Image, caption: FileText, script: Clapperboard, qr: QrCode, thumbnail: Palette,
                };
                const Icon = typeIcons[creation.type] || FileText;
                return (
                  <motion.div
                    key={creation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{creation.title}</p>
                        <p className="text-[10px] text-white/30 mt-0.5">{creation.toolUsed}</p>
                        <p className="text-[10px] text-white/20 mt-1">{timeAgo(creation.timestamp)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleCreationFavorite(creation.id)}
                          className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
                        >
                          <Heart className={cn("w-3.5 h-3.5", creation.favorited ? "text-pink-400 fill-pink-400" : "text-white/20")} />
                        </button>
                        <button
                          onClick={() => deleteCreation(creation.id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white/20 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ═══════ HISTORY TAB ═══════ */}
      {activeTab === 'history' && (
        <motion.div
          key="history"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <Search className="w-3.5 h-3.5 text-white/30" />
              <input
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                placeholder="Search history..."
                className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 outline-none"
              />
              {historySearch && (
                <button onClick={() => setHistorySearch('')}>
                  <X className="w-3 h-3 text-white/30 hover:text-white" />
                </button>
              )}
            </div>
            <button
              onClick={() => setHistorySort(s => s === 'newest' ? 'oldest' : 'newest')}
              className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] transition-colors"
            >
              {historySort === 'newest' ? <SortDesc className="w-3.5 h-3.5 text-white/50" /> : <SortAsc className="w-3.5 h-3.5 text-white/50" />}
            </button>
            {recentTools.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-3 py-2 text-xs font-bold text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16">
              <History className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">{historySearch ? 'No matching history' : 'No history yet'}</p>
              <p className="text-xs text-white/20 mt-1">Tools you use will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((tool, i) => (
                <motion.div
                  key={tool.path + tool.timestamp}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{tool.name}</p>
                    <p className="text-[10px] text-white/30">{timeAgo(tool.timestamp)}</p>
                  </div>
                  <Link
                    to={tool.path}
                    className="p-1.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors flex-shrink-0"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                  </Link>
                  <button
                    onClick={() => deleteHistoryItem(tool.path)}
                    className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/20 hover:text-red-400" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ═══════ ANALYTICS TAB ═══════ */}
      {activeTab === 'analytics' && (
        <motion.div
          key="analytics"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Tools Used', value: stats.totalUsage, icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Searches', value: stats.totalSearches, icon: Search, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { label: 'Favorites', value: stats.totalFavorites, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
              { label: 'Creations', value: creations.length, icon: FolderOpen, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Streak', value: streak, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center"
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <p className="text-2xl font-display font-black text-white">
                  <AnimatedCounter target={stat.value} />
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Most Used Tools */}
          {stats.mostUsed.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Most Used Tools
              </h3>
              <div className="space-y-2">
                {stats.mostUsed.map((item, i) => {
                  const tool = searchTools(item.id)[0];
                  const maxCount = stats.mostUsed[0]?.count || 1;
                  const percentage = (item.count / maxCount) * 100;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{tool?.name || item.id}</p>
                        </div>
                        <span className="text-xs font-bold text-primary">{item.count}x</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Activity Timeline */}
          {activity.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Activity Timeline
              </h3>
              <div className="relative pl-6 space-y-3">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-white/[0.06]" />
                {activity.slice(0, 10).map((item, i) => {
                  const Icon = ACTIVITY_ICONS[item.category] || Zap;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative"
                    >
                      <div className="absolute -left-4 top-3 w-4 h-4 rounded-full bg-slate-900 border-2 border-white/[0.06] flex items-center justify-center z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-primary" />
                          <p className="text-xs font-bold text-white">{item.toolName}</p>
                          <span className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                            item.status === 'success' ? 'text-green-400 bg-green-500/10' :
                            item.status === 'error' ? 'text-red-400 bg-red-500/10' :
                            'text-amber-400 bg-amber-500/10'
                          )}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/30 mt-1">{item.action} · {timeAgo(item.timestamp)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Usage Breakdown (visual bars) */}
          <section>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" /> Category Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'AI Tools', count: Math.floor(stats.totalUsage * 0.3), color: 'bg-cyan-500' },
                { name: 'Image Tools', count: Math.floor(stats.totalUsage * 0.35), color: 'bg-blue-500' },
                { name: 'PDF Tools', count: Math.floor(stats.totalUsage * 0.2), color: 'bg-green-500' },
                { name: 'Other', count: Math.floor(stats.totalUsage * 0.15), color: 'bg-purple-500' },
              ].map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                    <span className="text-[10px] text-white/40">{cat.name}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{cat.count}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      )}

      {/* ═══════ TRENDING TAB ═══════ */}
      {activeTab === 'trending' && (
        <motion.div
          key="trending"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Trending Sub-tabs */}
          <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            {([
              ['trending', 'Trending', TrendingUp],
              ['popular', 'Popular', BarChart3],
              ['new', 'New', Sparkles],
            ] as const).map(([tab, label, Icon]) => (
              <button
                key={tab}
                onClick={() => setTrendingTab(tab)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors",
                  trendingTab === tab ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {/* Trending Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(trendingTab === 'trending' ? trending : trendingTab === 'popular' ? popular : newTools).map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/tools/${tool.slug}`}
                  className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] hover:bg-white/[0.06] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{tool.name}</p>
                      {tool.trending && <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">HOT</span>}
                      {(tool as any).isNew && <span className="text-[9px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">NEW</span>}
                    </div>
                    <p className="text-[10px] text-white/30 mt-0.5 truncate">{tool.shortDescription}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/60 flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══════ GROWTH TAB ═══════ */}
      {activeTab === 'growth' && (
        <motion.div
          key="growth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-400" /> Growth & Rewards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'Referrals', desc: 'Invite friends & earn rewards', path: '/dashboard/referrals', icon: Award, color: 'from-brand-500 to-purple-600' },
              { label: 'Leaderboard', desc: 'See top creators', path: '/dashboard/leaderboard', icon: TrendingUp, color: 'from-yellow-500 to-orange-600' },
              { label: 'Badges', desc: 'Collect achievements', path: '/dashboard/badges', icon: Award, color: 'from-purple-500 to-pink-600' },
              { label: 'Trending', desc: 'Popular tools right now', path: '/trending', icon: Flame, color: 'from-orange-500 to-red-600' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">{item.label}</h3>
                <p className="text-xs text-white/40 mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══════ SETTINGS TAB ═══════ */}
      {activeTab === 'settings' && (
        <motion.div
          key="settings"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 max-w-2xl"
        >
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-white/50" /> Settings
          </h2>

          {/* Appearance */}
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Appearance</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-white/60">Theme</span>
              </div>
              <div className="flex gap-1 p-1 bg-white/[0.06] rounded-lg">
                {['dark', 'light'].map(t => (
                  <button
                    key={t}
                    className="px-3 py-1.5 rounded-md text-xs font-bold capitalize bg-primary text-black"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-white/60">Compact Mode</span>
              </div>
              <div className="w-9 h-5 bg-white/[0.06] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white/40 rounded-full absolute top-0.5 left-0.5" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {[
              { label: 'New Features', icon: Sparkles, desc: 'Get notified about new tools and features' },
              { label: 'Tool Updates', icon: RefreshCw, desc: 'Know when your favorite tools are updated' },
              { label: 'Trending Content', icon: TrendingUp, desc: 'See what tools are trending' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    <p className="text-[10px] text-white/30">{item.desc}</p>
                  </div>
                </div>
                <div className="w-9 h-5 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-black rounded-full absolute top-0.5 right-0.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Privacy & Security */}
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Privacy & Security</h3>
            {[
              { label: 'Clear All Data', icon: Trash2, desc: 'Remove all local history, favorites, and settings', danger: true },
              { label: 'Export Data', icon: Download, desc: 'Download your data as JSON' },
            ].map(item => (
              <button
                key={item.label}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
                  item.danger ? "hover:bg-red-500/5" : "hover:bg-white/[0.03]"
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className={cn("w-4 h-4", item.danger ? "text-red-400" : "text-white/50")} />
                  <div className="text-left">
                    <p className={cn("text-xs font-bold", item.danger ? "text-red-400" : "text-white")}>{item.label}</p>
                    <p className="text-[10px] text-white/30">{item.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/20" />
              </button>
            ))}
          </div>

          {/* Account */}
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-white">Account</h3>
            <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg">
              <div className="w-10 h-10 bg-white/[0.06] rounded-xl flex items-center justify-center border border-white/[0.08]">
                <User className="w-5 h-5 text-white/40" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Guest User</p>
                <p className="text-[10px] text-white/30">Login to sync your data across devices</p>
              </div>
              <button className="px-3 py-1.5 bg-primary text-black text-xs font-bold rounded-lg">
                Login
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════ COMMAND PALETTE ═══════ */}
      <AnimatePresence>
        {cmdOpen && <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCISSORS ICON (missing from lucide import)
   ═══════════════════════════════════════════════════════════════════ */

function Scissors({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}
