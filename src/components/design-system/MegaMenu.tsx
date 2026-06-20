import { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
        {trigger}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className={cn(
          'absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] rounded-xl border bg-background shadow-xl p-4 animate-scale-in',
          className
        )}>
          <div className="grid grid-cols-2 gap-4">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path || '#'}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
                      onClick={() => setOpen(false)}
                    >
                      {item.icon && <div className="text-primary group-hover:text-primary/80">{item.icon}</div>}
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
