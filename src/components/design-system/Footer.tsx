import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Twitter, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterColumn {
  title: string;
  links: Array<{ label: string; path: string }>;
}

interface FooterProps {
  columns?: FooterColumn[];
  className?: string;
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'Tools',
    links: [
      { label: 'Image Compressor', path: '/tools/image-compressor' },
      { label: 'PDF Merger', path: '/tools/pdf-merger' },
      { label: 'AI Thumbnail', path: '/tools/ai-thumbnail-generator' },
      { label: 'QR Code Generator', path: '/tools/qr-code-generator' },
      { label: 'JSON Formatter', path: '/tools/json-formatter' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', path: '/blog' },
      { label: 'How to Use', path: '/how-to-use' },
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact-us' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms of Service', path: '/terms-of-service' },
      { label: 'Cookie Policy', path: '/cookie-policy' },
      { label: 'Disclaimer', path: '/disclaimer' },
    ],
  },
];

export function Footer({ columns = defaultColumns, className }: FooterProps) {
  return (
    <footer className={cn('relative border-t border-white/[0.04]', className)}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-sm text-white">
                CreatorBoost<span className="text-brand-400">AI</span>
              </span>
            </Link>
            <p className="text-[13px] text-white/35 leading-relaxed mb-5">
              Free AI-powered toolkit for creators. 80+ tools for image processing, PDF editing, content creation, and more.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/creatorboostai" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-brand-400 hover:border-brand-500/20 transition-all duration-300" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://github.com/creatorboostai" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-brand-400 hover:border-brand-500/20 transition-all duration-300" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-[13px] text-white/35 hover:text-brand-400 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/25">
            © {new Date().getFullYear()} CreatorBoost AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-white/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
