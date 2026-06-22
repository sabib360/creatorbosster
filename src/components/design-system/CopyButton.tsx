import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  variant?: 'default' | 'ghost' | 'icon';
}

export function CopyButton({ text, className, label, variant = 'default' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        {
          'px-3 py-1.5 bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.10] border border-white/[0.06]': variant === 'default',
          'p-1.5 text-white/40 hover:text-white hover:bg-white/[0.06]': variant === 'ghost',
          'p-2 text-white/40 hover:text-white hover:bg-white/[0.06] rounded-lg': variant === 'icon',
        },
        className
      )}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      {label && (label || (copied ? 'Copied!' : 'Copy'))}
    </button>
  );
}
