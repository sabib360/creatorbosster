import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
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
  return (
    <header className={cn('sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg hidden sm:inline">CreatorBoost</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <MegaMenu trigger="Tools" groups={toolGroups} />
          <MegaMenu trigger="AI Tools" groups={aiGroups} />
          <Link to="/blog" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">Blog</Link>
          <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">About</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSearchOpen}
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 text-xs">
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
