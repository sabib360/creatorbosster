import { Download, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DownloadButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  className?: string;
}

export default function DownloadButton({
  onClick,
  disabled = false,
  loading = false,
  label = 'Download',
  className,
}: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200',
        disabled || loading
          ? 'bg-white/5 text-white/30 cursor-not-allowed'
          : 'bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20',
        className,
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {label}
    </button>
  );
}
