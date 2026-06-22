import { Share2, Twitter, Facebook, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
}

export default function ShareButton({ url, title, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`Check out ${title} on CreatorBoost AI`);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleShare = (platform: string) => {
    if (shareLinks[platform as keyof typeof shareLinks]) {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => handleShare('twitter')}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-white/50 hover:text-white transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-3 h-3" /> Share
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-white/50 hover:text-white transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-3 h-3" /> Share
      </button>
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-white/50 hover:text-white transition-colors"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Link2 className="w-3 h-3" />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
