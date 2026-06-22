import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  label: string;
  path: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({ items, collapsed: initialCollapsed = false, className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-white/[0.06] bg-[#0B1120] transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <nav className="space-y-1 px-3">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.04]',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-white/[0.06] text-white/30 hover:text-white transition-colors hover:bg-white/[0.03]"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
