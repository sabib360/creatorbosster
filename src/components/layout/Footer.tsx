import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Github, Twitter, Heart } from 'lucide-react';

const FOOTER_SECTIONS = [
  {
    title: 'Tools',
    links: [
      { label: 'AI Tools', href: '/ai-tools' },
      { label: 'Image Tools', href: '/image-tools' },
      { label: 'PDF Tools', href: '/pdf-tools' },
      { label: 'YouTube Tools', href: '/social-media-tools' },
      { label: 'SEO Tools', href: '/ai-tools' },
      { label: 'Finance Tools', href: '/finance-tools' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'How to Use', href: '/how-to-use' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact-us' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'DMCA', href: '/dmca' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04]">
      {/* Gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

      {/* Aurora glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top section - Brand + Links */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mb-14">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-sm text-white">
                CreatorBoost<span className="text-brand-400">AI</span>
              </span>
            </Link>
            <p className="text-[13px] text-white/35 leading-relaxed">
              Free AI-powered toolkit for creators. 80+ tools for image processing, PDF editing, content creation, and more. All in your browser.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.facebook.com/profile.php?id=61572335704389"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-brand-400 hover:border-brand-500/20 hover:bg-brand-500/10 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://twitter.com/creatorboostai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-brand-400 hover:border-brand-500/20 hover:bg-brand-500/10 transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Link Sections */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-4">{section.title}</h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-[13px] text-white/35 hover:text-brand-400 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} CreatorBoost AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-white/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
