import { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { Button } from './Button';

interface HeaderProps {
  className?: string;
  onSearchOpen?: () => void;
}

const toolGroups = [
  {
    title: 'Image Tools',
    items: [
      { label: 'Image Compressor', path: '/tools/image-compressor', description: 'Reduce file size' },
      { label: 'Image Resizer', path: '/tools/image-resizer', description: 'Change dimensions' },
      { label: 'Background Remover', path: '/tools/background-remover', description: 'Remove backgrounds' },
      { label: 'Image Cropper', path: '/tools/image-cropper', description: 'Crop images' },
    ],
  },
  {
    title: 'PDF Tools',
    items: [
      { label: 'PDF Merger', path: '/tools/pdf-merger', description: 'Combine PDFs' },
      { label: 'PDF Compressor', path: '/tools/pdf-compressor', description: 'Reduce PDF size' },
      { label: 'PDF to Word', path: '/tools/pdf-to-word', description: 'Convert PDF' },
      { label: 'PDF Splitter', path: '/tools/pdf-splitter', description: 'Extract pages' },
    ],
  },
];

const aiGroups = [
  {
    title: 'AI Tools',
    items: [
      { label: 'AI Thumbnail Generator', path: '/tools/ai-thumbnail-generator', description: 'Create thumbnails' },
      { label: 'AI Assistant', path: '/tools/ai-assistant', description: 'Content strategy' },
      { label: 'Image Analyzer', path: '/tools/image-analyzer', description: 'Analyze images' },
      { label: 'PDF Summarizer', path: '/tools/pdf-summarizer', description: 'Summarize docs' },
    ],
  },
];

export function Header({ className, onSearchOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300',
      scrolled 
        ? 'glass-strong shadow-2xl shadow-black/20 border-b border-white/[0.04]' 
        : 'bg-transparent',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-all duration-300">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
          </div>
          <span className="font-display font-extrabold text-[15px] tracking-tight text-white hidden sm:block">
            CreatorBoost<span className="text-brand-400">AI</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <MegaMenu trigger="Tools" groups={toolGroups} />
          <MegaMenu trigger="AI Tools" groups={aiGroups} />
          <Link to="/blog" className="px-3.5 py-2 text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all duration-200">Blog</Link>
          <Link to="/about" className="px-3.5 py-2 text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all duration-200">About</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearchOpen}
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl bg-white/[0.04] text-white/40 text-sm hover:bg-white/[0.08] hover:text-white/60 transition-all duration-200 border border-white/[0.06]"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded bg-white/[0.06] px-1.5 text-[10px] text-white/30 border border-white/[0.08] font-mono">
              ⌘K
            </kbd>
          </button>
          <MobileMenu items={[
            { label: 'Tools', path: '/image-tools', children: [
              { label: 'Image Compressor', path: '/tools/image-compressor' },
              { label: 'Image Resizer', path: '/tools/image-resizer' },
              { label: 'PDF Merger', path: '/tools/pdf-merger' },
            ]},
            { label: 'AI Tools', path: '/ai-tools' },
            { label: 'Blog', path: '/blog' },
            { label: 'About', path: '/about' },
          ]} />
        </div>
      </div>
    </header>
  );
}
