import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Type, Download, ChevronDown, ChevronUp, Sparkles, Share2, FileSpreadsheet, Loader2, History, LogIn, Search, Star } from 'lucide-react';
import { getHistory, deleteFromHistory, clearHistory, type HistoryItem } from '../lib/history';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import ThumbnailEditor from './ThumbnailEditor';
import ErrorState from './ErrorState';

export default function HistoryTab() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'az'>('recent');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const loadHistory = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await getHistory(user?.uid);
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item from your history?')) {
      await deleteFromHistory(id, user?.uid);
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      await clearHistory(user?.uid);
      setHistory([]);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getFilteredAndSortedHistory = () => {
    let filtered = history;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.topic.toLowerCase().includes(term) ||
        item.results?.titles?.viral?.some(t => t.toLowerCase().includes(term)) ||
        item.results?.description?.toLowerCase?.().includes(term)
      );
    }

    // Filter by favorites
    if (showOnlyFavorites) {
      filtered = filtered.filter(item => favorites.has(item.id));
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'oldest':
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'az':
        sorted.sort((a, b) => a.topic.localeCompare(b.topic));
        break;
      case 'recent':
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    return sorted;
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = ['Topic', 'Date', 'Category', 'Title'];
    const rows: string[][] = [];

    history.forEach(item => {
      const date = new Date(item.createdAt).toLocaleDateString();
      
      if (item.results && item.results.titles) {
        Object.entries(item.results.titles).forEach(([category, titles]) => {
          (titles as string[]).forEach(title => {
            rows.push([
              `"${item.topic.replace(/"/g, '""')}"`,
              `"${date}"`,
              `"${category}"`,
              `"${title.replace(/"/g, '""')}"`
            ]);
          });
        });
      } else {
        rows.push([
          `"${item.topic.replace(/"/g, '""')}"`,
          `"${date}"`,
          'N/A',
          'N/A'
        ]);
      }
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `creatorboost-ideas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (text: string) => {
    const url = window.location.origin;
    const shareText = `${text}\n\nGenerated with CreatorBoost AI!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'CreatorBoost AI',
        text: shareText,
        url: url,
      }).catch(console.error);
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank');
    }
  };

  const ShareButton = ({ text, className = "" }: { text: string, className?: string }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleShare(text);
      }}
      className={cn(
        "p-1.5 bg-surface text-blue-500 brutal-border rounded-lg hover:-translate-y-0.5 transition-transform",
        className
      )}
      title="Share this idea"
    >
      <Share2 className="w-3.5 h-3.5" />
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-display font-black uppercase tracking-wider text-ink">Loading History...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="py-20 flex justify-center">
        <ErrorState 
          title="History Unavailable"
          message="We couldn't load your creative history. This might be due to a temporary connection issue."
          onRetry={loadHistory}
          className="max-w-xl w-full"
        />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">History</h1>
          <p className="text-lg font-medium border-l-4 border-outline pl-4">Your generated ideas and thumbnails will appear here.</p>
        </div>
        
        <div className="brutal-card p-12 flex flex-col items-center justify-center text-center">
          <Sparkles className="w-16 h-16 mb-4 text-ink/30" />
          <h2 className="text-2xl font-display font-black uppercase tracking-wider mb-2">No History Yet</h2>
          <p className="text-ink/70 font-medium">Generate some ideas in the AI Generator to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-7xl font-display font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-ink via-ink/80 to-ink/50">
            History
          </h1>
          <p className="text-lg font-medium text-ink/70 border-l-4 border-primary pl-4">
            A timeline of your creative journey and generated assets.
          </p>
        </motion.div>
        <div className="flex flex-wrap items-center gap-4 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-3 px-6 py-3 bg-slate-900/50 text-ink border border-slate-800 font-display font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-secondary hover:text-black transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> 
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-3 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 font-display font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 className="w-4 h-4" /> 
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4 p-6 bg-slate-900/30 border border-slate-800 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              placeholder="🔍 Search by topic or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-ink placeholder:text-ink/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-ink font-display font-black uppercase text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="recent">📅 Most Recent</option>
              <option value="oldest">📅 Oldest First</option>
              <option value="az">🔤 A-Z</option>
            </select>
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={cn(
                "px-4 py-3 rounded-xl font-display font-black uppercase text-xs transition-all flex items-center gap-2",
                showOnlyFavorites
                  ? "bg-yellow-500 text-black border border-yellow-500"
                  : "bg-slate-950 border border-slate-800 text-ink/70 hover:text-ink"
              )}
            >
              <Star className="w-4 h-4" />
              <span>Favorites</span>
            </button>
          </div>
        </div>
        {(searchTerm || showOnlyFavorites) && (
          <p className="text-xs text-ink/50 font-medium">
            Showing {getFilteredAndSortedHistory().length} of {history.length} items
          </p>
        )}
      </div>

      <div className="space-y-6">
        {getFilteredAndSortedHistory().map((item, index) => {
          const isExpanded = expandedItems[item.id];
          const isFavorite = favorites.has(item.id);
          
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="brutal-card overflow-hidden border-slate-800 bg-slate-900/30 backdrop-blur-sm group"
            >
              <div 
                className={cn(
                  "p-6 flex items-center justify-between cursor-pointer transition-all duration-500",
                  isExpanded ? "bg-primary text-black" : "bg-slate-950/50 hover:bg-slate-900"
                )}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex-1 min-w-0 pr-6">
                  <h3 className={cn(
                    "font-display font-black text-xl md:text-2xl uppercase tracking-tight truncate",
                    isExpanded ? "text-black" : "text-ink"
                  )}>
                    {item.topic}
                  </h3>
                  <div className={cn(
                    "flex items-center gap-3 mt-2 text-[10px] font-black uppercase tracking-widest",
                    isExpanded ? "text-black/60" : "text-ink/40"
                  )}>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(`Check out these viral YouTube ideas for "${item.topic}"`);
                    }}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      isExpanded 
                        ? "bg-black/10 text-black hover:bg-black/20" 
                        : "bg-slate-900 text-blue-400 border border-slate-800 hover:border-blue-400/50"
                    )}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      isExpanded 
                        ? "bg-black/10 text-black hover:bg-black/20" 
                        : isFavorite
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/50 hover:border-yellow-400"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-yellow-400/50 hover:text-yellow-400"
                    )}
                  >
                    <Star className={cn("w-4 h-4", isFavorite && "fill-current")} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      isExpanded 
                        ? "bg-black/10 text-black hover:bg-black/20" 
                        : "bg-slate-900 text-red-400 border border-slate-800 hover:border-red-400/50"
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500",
                    isExpanded ? "rotate-180 bg-black/10" : "bg-slate-900"
                  )}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="p-8 bg-slate-950/50 flex flex-col gap-10"
                >
                  {/* Ideas Section */}
                  {item.results && (
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                          <span className="w-6 h-[1px] bg-primary" />
                          Top Titles
                        </h4>
                        <ul className="space-y-3">
                          {item.results.titles?.viral?.slice(0, 3).map((title, i) => (
                            <li key={i} className="flex items-center justify-between gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl group/item">
                              <span className="font-bold text-ink/80">{title}</span>
                              <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <ShareButton text={`YouTube Title Idea: ${title}`} />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {item.results.hookLines && item.results.hookLines.length > 0 && (
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-secondary flex items-center gap-3">
                            <span className="w-6 h-[1px] bg-secondary" />
                            Viral Hooks
                          </h4>
                          <ul className="space-y-3">
                            {item.results.hookLines.slice(0, 2).map((hook, i) => (
                              <li key={i} className="flex items-center justify-between gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl group/item">
                                <span className="font-medium text-ink/70 italic">"{hook}"</span>
                                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <ShareButton text={`YouTube Hook Idea: ${hook}`} />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Thumbnails Section */}
                  {item.thumbnails && item.thumbnails.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-tertiary flex items-center gap-3">
                        <span className="w-6 h-[1px] bg-tertiary" />
                        Visual Assets
                      </h4>
                      <div className="grid md:grid-cols-2 gap-8">
                        {item.thumbnails.map((thumb, idx) => (
                          <div key={idx} className="bg-slate-900/50 p-6 border border-slate-800 rounded-[2rem] group/thumb hover:border-tertiary/30 transition-all">
                            <div className="flex items-start justify-between gap-4 mb-6">
                              <p className="font-bold text-ink/80 line-clamp-2 leading-relaxed">{thumb.idea}</p>
                              <ShareButton text={`YouTube Thumbnail Idea: ${thumb.idea}`} className="bg-slate-950" />
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 mb-6 shadow-2xl">
                              <img src={thumb.imageUrls[thumb.selectedIndex || 0]} alt="Generated thumbnail" className="w-full h-auto aspect-video object-cover" />
                            </div>
                            
                            {thumb.imageUrls.length > 1 && (
                              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-2">
                                {thumb.imageUrls.map((imgUrl, varIdx) => (
                                  <div 
                                    key={varIdx} 
                                    className={cn(
                                      "flex-shrink-0 w-20 aspect-video rounded-xl overflow-hidden border transition-all",
                                      (thumb.selectedIndex || 0) === varIdx 
                                        ? "border-primary ring-2 ring-primary/20" 
                                        : "border-slate-800 opacity-40"
                                    )}
                                  >
                                    <img src={imgUrl} alt={`Variation ${varIdx + 1}`} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-4">
                              <button
                                onClick={() => setEditingImage(thumb.imageUrls[thumb.selectedIndex || 0])}
                                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 text-ink font-display font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-tertiary hover:text-black transition-all"
                              >
                                <Type className="w-4 h-4" /> 
                                <span>Edit</span>
                              </button>
                              <a
                                href={thumb.imageUrls[thumb.selectedIndex || 0]}
                                download={`thumbnail-${item.id}-${idx}.jpg`}
                                className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 text-ink font-display font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-secondary hover:text-black transition-all"
                              >
                                <Download className="w-4 h-4" /> 
                                <span>Save</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!item.results && (!item.thumbnails || item.thumbnails.length === 0) && (
                    <div className="text-center py-10 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                      <p className="text-ink/30 font-display font-black uppercase tracking-widest text-xs">No detailed data available</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {editingImage && (
        <ThumbnailEditor 
          imageUrl={editingImage} 
          onClose={() => setEditingImage(null)} 
        />
      )}
    </div>
  );
}
