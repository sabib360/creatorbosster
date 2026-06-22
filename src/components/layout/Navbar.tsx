import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, ChevronDown, Menu, X, TrendingUp,
  ArrowRight, Zap, Home, Grid3X3, BookOpen, BarChart3,
  Command, Image, FileText, Bot, Calculator, Hash
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ThemeToggle';

const NAV_LINKS = [
  { label: 'Tools', href: '/ai-tools', icon: Grid3X3, children: [
    { label: 'AI Tools', href: '/ai-tools', icon: Sparkles, desc: 'AI-powered tools' },
    { label: 'Image Tools', href: '/image-tools', icon: Image, desc: 'Edit & enhance' },
    { label: 'PDF Tools', href: '/pdf-tools', icon: FileText, desc: 'Merge, split, convert' },
    { label: 'YouTube Tools', href: '/social-media-tools', icon: Hash, desc: 'Grow your channel' },
    { label: 'Finance Tools', href: '/finance-tools', icon: Calculator, desc: 'Calculators' },
  ]},
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Trending', href: '/ai-tools', icon: TrendingUp },
];

export default function Navbar({ onSearchOpen }: { onSearchOpen?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleDropdownEnter = (label: string) => {
    clearTimeout(dropdownTimeout.current!);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          scrolled
            ? "glass-strong shadow-2xl shadow-black/30 border-b border-white/[0.04]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:scale-105">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-500/20 to-brand-700/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="font-display font-extrabold text-[15px] tracking-tight text-white hidden sm:block">
                CreatorBoost<span className="text-brand-400">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && handleDropdownEnter(link.label)}
                  onMouseLeave={() => link.children && handleDropdownLeave()}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200",
                      location.pathname === link.href
                        ? "text-white bg-white/[0.08]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    {link.label}
                    {link.children && <ChevronDown className={cn("w-3.5 h-3.5 opacity-50 transition-transform duration-200", activeDropdown === link.label && "rotate-180")} />}
                  </Link>

                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 glass-strong rounded-2xl p-2 shadow-2xl shadow-black/40 border border-white/[0.06]"
                        onMouseEnter={() => handleDropdownEnter(link.label)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="p-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all duration-200 group/item"
                            >
                              <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover/item:bg-brand-500/20 transition-colors flex-shrink-0">
                                <child.icon className="w-4 h-4 text-brand-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white/80 group-hover/item:text-white transition-colors">{child.label}</div>
                                {child.desc && <div className="text-[11px] text-white/30 mt-0.5">{child.desc}</div>}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={onSearchOpen}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-[13px] text-white/40 hover:text-white/60 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/[0.06] transition-all duration-200"
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline">Search tools...</span>
                <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 bg-white/[0.06] text-[10px] text-white/30 rounded font-mono border border-white/[0.08]">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </button>

              <ThemeToggle />

              <Link
                to="/ai-tools"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-[13px] font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30 btn-glow"
              >
                <Zap className="w-3.5 h-3.5" />
                Get Started
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-strong border-l border-white/[0.06] p-6 pt-20"
            >
              <nav className="space-y-1">
                {[
                  { label: 'Home', href: '/', icon: Home },
                  { label: 'All Tools', href: '/ai-tools', icon: Grid3X3 },
                  { label: 'Blog', href: '/blog', icon: BookOpen },
                  { label: 'Dashboard', href: '/dashboard/tools', icon: BarChart3 },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                      location.pathname === link.href
                        ? "text-white bg-brand-600/20 border border-brand-500/20"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-3">
                <Link
                  to="/ai-tools"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl btn-glow"
                >
                  <Zap className="w-4 h-4" />
                  Start Creating Free
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); onSearchOpen?.(); }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/[0.06] text-white/60 text-sm font-medium rounded-xl border border-white/[0.08]"
                >
                  <Search className="w-4 h-4" />
                  Search Tools
                  <kbd className="ml-auto px-1.5 py-0.5 bg-white/[0.06] text-[10px] text-white/30 rounded font-mono border border-white/[0.08]">
                    <Command className="w-2.5 h-2.5 inline" />K
                  </kbd>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
