import { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuItem {
  label: string;
  path: string;
  icon?: ReactNode;
  children?: MobileMenuItem[];
}

interface MobileMenuProps {
  items: MobileMenuItem[];
  className?: string;
}

export function MobileMenu({ items, className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <div className={cn('lg:hidden', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-white/60 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-strong border-l border-white/[0.06] p-6 pt-20"
            >
              <nav className="space-y-1">
                {items.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.label}</span>
                          </span>
                          <ChevronRight className={cn('h-4 w-4 transition-transform', expandedItem === item.label && 'rotate-90')} />
                        </button>
                        <AnimatePresence>
                          {expandedItem === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-4 overflow-hidden"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.label}
                                  to={child.path}
                                  className="block px-4 py-2 text-sm text-white/40 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                                  onClick={() => setOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <Link
                  to="/ai-tools"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl btn-glow"
                  onClick={() => setOpen(false)}
                >
                  <Sparkles className="w-4 h-4" />
                  Start Creating Free
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
