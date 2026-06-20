import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        'flex flex-col border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
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
        className="flex items-center justify-center h-10 border-t text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
