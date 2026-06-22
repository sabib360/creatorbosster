import { useState, useEffect, useRef } from 'react';
import { Search, X, Command, ArrowUpRight, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchOverlayProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchOverlay({ onSearch, placeholder = 'Search tools, pages, or topics...' }: SearchOverlayProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const quickLinks = [
    { label: 'AI Image Generator', path: '/tools/ai-text-to-image', icon: '🎨' },
    { label: 'Background Remover', path: '/tools/background-remover', icon: '✂️' },
    { label: 'PDF Merger', path: '/tools/pdf-merger', icon: '📄' },
    { label: 'QR Code Generator', path: '/tools/qr-code-generator', icon: '📱' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative z-50 w-full max-w-xl mx-4"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/10 via-cyan-500/5 to-brand-500/10 rounded-2xl blur-xl opacity-50 pointer-events-none" />
            
            <div className="relative glass-strong rounded-2xl shadow-2xl shadow-black/40 overflow-hidden border border-white/[0.08]">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <Search className="h-4 w-4 text-brand-400" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none"
                />
                <kbd className="px-2 py-1 bg-white/[0.06] text-[10px] text-white/30 rounded-lg font-mono border border-white/[0.08]">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin">
                {query.length === 0 ? (
                  <>
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" /> Quick Access
                    </div>
                    {quickLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.path}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors group"
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span className="flex-1">{link.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-brand-400 transition-colors" />
                      </a>
                    ))}
                  </>
                ) : (
                  <div className="space-y-1">
                    <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Results</p>
                    <button 
                      className="w-full text-left px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors flex items-center gap-3"
                      onClick={() => { onSearch?.(query); setOpen(false); }}
                    >
                      <Search className="w-4 h-4 text-white/20" />
                      Search for "{query}"
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] text-[10px] text-white/20">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white/[0.06] rounded font-mono border border-white/[0.08]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white/[0.06] rounded font-mono border border-white/[0.08]">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded font-mono border border-white/[0.08]">ESC</kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
