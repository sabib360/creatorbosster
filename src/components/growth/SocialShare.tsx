/**
 * CreatorBoost AI — Enhanced Social Share Component
 * Premium sharing experience with all platforms
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2, Twitter, Facebook, Linkedin, Link2, Check,
  MessageCircle, Send, Mail, Copy, X, Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { generateShareUrls, trackShare, type ShareCardData } from '../../lib/referral';
import { useAuth } from '../../hooks/useAuth';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  toolName?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'icon';
  showLabel?: boolean;
}

const PLATFORMS = [
  { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: 'hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/30' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-blue-600/10 hover:text-blue-500 hover:border-blue-600/30' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: 'hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/30' },
  { id: 'email', name: 'Email', icon: Mail, color: 'hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30' },
] as const;

export default function SocialShare({
  url,
  title,
  description,
  toolName = 'CreatorBoost AI',
  className,
  variant = 'default',
  showLabel = true,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();

  const shareData: ShareCardData = {
    title,
    description: description || `Check out ${title} on CreatorBoost AI`,
    toolName,
    toolUrl: url,
    brandColor: '#7c3aed',
  };

  const shareUrls = generateShareUrls(shareData);

  const handleShare = useCallback(async (platform: string) => {
    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (!shareUrl) return;

    // Track share
    if (user) {
      await trackShare(user.uid, platform, toolName);
    }

    // Open share dialog
    if (platform === 'email') {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes');
    }
  }, [shareUrls, user, toolName]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      if (user) {
        await trackShare(user.uid, 'copy', toolName);
      }
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
  }, [url, user, toolName]);

  if (variant === 'icon') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={() => setShowAll(!showAll)}
          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/50 hover:text-white transition-all"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <AnimatePresence>
          {showAll && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className="absolute right-0 top-full mt-2 z-50 bg-[#0B1120] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 p-2 min-w-[200px]"
            >
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Share</span>
                <button onClick={() => setShowAll(false)} className="text-white/30 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handleShare(platform.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 transition-all',
                    platform.color
                  )}
                >
                  <platform.icon className="w-4 h-4" />
                  {platform.name}
                </button>
              ))}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/[0.04] transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1.5', className)}>
        {PLATFORMS.slice(0, 3).map((platform) => (
          <button
            key={platform.id}
            onClick={() => handleShare(platform.id)}
            className={cn(
              'p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 transition-all',
              platform.color
            )}
            aria-label={`Share on ${platform.name}`}
          >
            <platform.icon className="w-3.5 h-3.5" />
          </button>
        ))}
        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:bg-white/[0.08] hover:text-white transition-all"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Link2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {showLabel && (
        <span className="text-xs font-medium text-white/40 mr-1">Share:</span>
      )}
      {PLATFORMS.map((platform) => (
        <button
          key={platform.id}
          onClick={() => handleShare(platform.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 transition-all',
            platform.color
          )}
          aria-label={`Share on ${platform.name}`}
        >
          <platform.icon className="w-3 h-3" />
          {platform.name}
        </button>
      ))}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 hover:bg-white/[0.08] hover:text-white transition-all"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Link2 className="w-3 h-3" />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SHARE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

interface ShareCardProps {
  title: string;
  description: string;
  toolName: string;
  url: string;
  imageUrl?: string;
}

export function ShareCard({ title, description, toolName, url, imageUrl }: ShareCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1120] to-[#0F172A] border border-white/[0.08] p-6 max-w-sm">
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        {imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-white/[0.06]">
            <img src={imageUrl} alt={title} className="w-full h-32 object-cover" />
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-400" />
          </div>
          <span className="text-xs font-bold text-brand-400">{toolName}</span>
        </div>

        <h3 className="text-lg font-display font-bold text-white mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-white/50 line-clamp-2 mb-4">{description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/30">creatorboostai.xyz</span>
          <SocialShare url={url} title={title} variant="compact" showLabel={false} />
        </div>
      </div>
    </div>
  );
}
