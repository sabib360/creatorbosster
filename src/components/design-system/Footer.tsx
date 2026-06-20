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
    <footer className={cn('border-t bg-background', className)}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">CreatorBoost</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Free tools for content creators. Process images, PDFs, and leverage AI — all in your browser.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/creatorboostai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/creatorboostai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-foreground mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CreatorBoost AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> for creators
          </p>
        </div>
      </div>
    </footer>
  );
}
