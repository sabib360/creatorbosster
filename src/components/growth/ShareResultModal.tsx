/**
 * CreatorBoost AI — Share Result Modal
 * Viral prompt after tool completion with sharing + referral
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Sparkles, Copy, Check, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { getReferralUrl, trackShare } from '../../lib/referral';
import SocialShare from './SocialShare';

interface ShareResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  resultUrl?: string;
  resultDescription?: string;
}

export default function ShareResultModal({
  isOpen,
  onClose,
  toolName,
  resultUrl,
  resultDescription,
}: ShareResultModalProps) {
  const [copiedReferral, setCopiedReferral] = useState(false);
  const { user } = useAuth();

  const shareUrl = resultUrl || window.location.href;
  const shareTitle = `I just used ${toolName} on CreatorBoost AI!`;
  const shareDescription = resultDescription || `Check out this amazing free tool: ${toolName}`;

  const handleCopyReferral = useCallback(async () => {
    const url = user ? getReferralUrl(user.uid) : shareUrl;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
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
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  }, [user, shareUrl, toolName]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-[#0B1120] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.1] transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/25">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-1">Share Your Result!</h3>
                <p className="text-sm text-white/40">
                  Let others know about <span className="text-brand-400 font-medium">{toolName}</span>
                </p>
              </div>

              {/* Social Share */}
              <div className="mb-5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Share on social media</p>
                <SocialShare
                  url={shareUrl}
                  title={shareTitle}
                  description={shareDescription}
                  toolName={toolName}
                  variant="default"
                  showLabel={false}
                />
              </div>

              {/* Referral Link */}
              {user && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">
                    Your referral link — earn rewards!
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 px-3 py-2 bg-white/[0.04] rounded-lg border border-white/[0.06] text-xs text-white/50 truncate">
                      {getReferralUrl(user.uid)}
                    </div>
                    <button
                      onClick={handleCopyReferral}
                      className={cn(
                        "p-2 rounded-lg border transition-all flex-shrink-0",
                        copiedReferral
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "bg-white/[0.04] border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08]"
                      )}
                    >
                      {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={onClose}
                className="w-full mt-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/50 hover:text-white hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2"
              >
                Continue using tools
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
