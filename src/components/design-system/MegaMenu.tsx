import { useState, useRef, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MegaMenuItem {
  label: string;
  path?: string;
  icon?: ReactNode;
  description?: string;
}

interface MegaMenuGroup {
  title: string;
  items: MegaMenuItem[];
}

interface MegaMenuProps {
  trigger: ReactNode;
  groups: MegaMenuGroup[];
  className?: string;
}

export function MegaMenu({ trigger, groups, className }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn('relative', className)} 
      onMouseEnter={handleEnter} 
      onMouseLeave={handleLeave}
    >
      <button className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-white/50 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all duration-200">
        {trigger}
        <ChevronDown className={cn('h-3.5 w-3.5 opacity-50 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] glass-strong rounded-2xl p-4 shadow-2xl shadow-black/40 border border-white/[0.06]"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <div className="grid grid-cols-2 gap-4">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 px-3">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path || '#'}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all duration-200 group"
                        onClick={() => setOpen(false)}
                      >
                        {item.icon && (
                          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                            <span className="text-brand-400">{item.icon}</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.label}</p>
                          {item.description && <p className="text-[11px] text-white/30">{item.description}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
