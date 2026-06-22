import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function Breadcrumb({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-sm', className)}>
      {children}
    </nav>
  );
}

function BreadcrumbItem({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('flex items-center gap-1.5', className)}>{children}</span>;
}

function BreadcrumbLink({ children, to, className }: { children: ReactNode; to: string; className?: string }) {
  return (
    <Link 
      to={to} 
      className={cn('text-white/40 hover:text-brand-400 transition-colors duration-200', className)}
    >
      {children}
    </Link>
  );
}

function BreadcrumbSeparator({ className }: { className?: string }) {
  return <ChevronRight className={cn('h-3.5 w-3.5 text-white/20', className)} />;
}

function BreadcrumbCurrent({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-white/70 font-medium', className)}>{children}</span>;
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbCurrent };
