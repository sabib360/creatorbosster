import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchOverlay({ onSearch, placeholder = 'Search tools, pages, or topics...' }: SearchOverlayProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

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
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
      <div className="relative z-50 w-full max-w-xl mx-4 animate-scale-in">
        <div className="bg-background border rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 border-b">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 h-14 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-1.5 text-xs text-muted-foreground">
              ESC
            </kbd>
          </div>
          <div className="p-2 max-h-80 overflow-y-auto">
            {query ? (
              <div className="space-y-1">
                <p className="px-3 py-2 text-xs text-muted-foreground font-medium">Results</p>
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                  Search for "{query}"
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="px-3 py-2 text-xs text-muted-foreground font-medium">Quick Actions</p>
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">Go to Dashboard</button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">View All Tools</button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors">Read Blog</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
