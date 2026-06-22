import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = 'Copy', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200',
        copied
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-white/[0.04] text-white/50 hover:text-white border border-white/[0.06] hover:border-white/[0.12]',
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          {label}
        </>
      )}
    </button>
  );
}
