import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function Pagination({ children, className }: { children: ReactNode; className?: string }) {
  return <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>{children}</nav>;
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
        'inline-flex items-center justify-center h-9 min-w-9 px-3 rounded-lg text-sm font-medium transition-all focus-ring',
        active && 'bg-primary text-primary-foreground shadow-sm',
        !active && 'hover:bg-muted text-muted-foreground hover:text-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
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

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };
