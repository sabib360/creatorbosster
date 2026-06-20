import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function Breadcrumb({ children, className }: { children: ReactNode; className?: string }) {
  return <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>{children}</nav>;
}

function BreadcrumbItem({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('flex items-center gap-1', className)}>{children}</span>;
}

function BreadcrumbLink({ children, to, className }: { children: ReactNode; to: string; className?: string }) {
  return <Link to={to} className={cn('text-muted-foreground hover:text-foreground transition-colors', className)}>{children}</Link>;
}

function BreadcrumbSeparator({ className }: { className?: string }) {
  return <ChevronRight className={cn('h-4 w-4 text-muted-foreground', className)} />;
}

function BreadcrumbCurrent({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-foreground font-medium', className)}>{children}</span>;
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbCurrent };
