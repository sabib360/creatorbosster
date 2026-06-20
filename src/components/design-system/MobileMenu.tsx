import { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className={cn('md:hidden', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-16 z-50 bg-background border-t animate-fade-in">
          <nav className="p-4 space-y-1 overflow-y-auto h-full">
            {items.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </span>
                      <ChevronRight className={cn('h-4 w-4 transition-transform', expandedItem === item.label && 'rotate-90')} />
                    </button>
                    {expandedItem === item.label && (
                      <div className="ml-4 space-y-1 animate-fade-in">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.path}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
