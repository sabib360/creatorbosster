import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

function Pagination({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center', className)}>
      {children}
    </nav>
  );
}

function PaginationContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex items-center gap-1', className)}>{children}</div>;
}

function PaginationItem({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

function PaginationLink({ children, onClick, active, disabled, className }: { children: ReactNode; onClick?: () => void; active?: boolean; disabled?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center h-9 min-w-9 px-3 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        active && 'bg-brand-600 text-white shadow-lg shadow-brand-600/20',
        !active && 'text-white/40 hover:text-white hover:bg-white/[0.06]',
        disabled && 'opacity-30 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      {children}
    </button>
  );
}

function PaginationNext({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return (
    <PaginationLink onClick={onClick} disabled={disabled}>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationPrevious({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return (
    <PaginationLink onClick={onClick} disabled={disabled}>
      <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis() {
  return (
    <span className="inline-flex items-center justify-center h-9 min-w-9">
      <MoreHorizontal className="h-4 w-4 text-white/20" />
    </span>
  );
}

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis };
