/**
 * CreatorBoost AI — Badges Page
 * Full badge gallery with earned status
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Sparkles, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BADGES, type Badge } from '../../lib/referral';
import { useAuth } from '../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';

const RARITY_STYLES: Record<Badge['rarity'], { bg: string; border: string; glow: string; label: string; color: string }> = {
  common: { bg: 'bg-white/[0.04]', border: 'border-white/[0.08]', glow: '', label: 'Common', color: 'text-white/40' },
  rare: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-blue-500/10', label: 'Rare', color: 'text-blue-400' },
  epic: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', glow: 'shadow-purple-500/20', label: 'Epic', color: 'text-purple-400' },
  legendary: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: 'shadow-yellow-500/20', label: 'Legendary', color: 'text-yellow-400' },
};

export default function BadgesPage() {
  const { user } = useAuth();
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`badges-${user.uid}`);
      if (stored) setEarnedBadges(JSON.parse(stored));
    }
  }, [user]);

  const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
  const sortedBadges = [...BADGES].sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

  return (
    <>
      <Helmet>
        <title>Badges — CreatorBoost AI</title>
        <meta name="description" content="Collect badges by using tools, referring friends, and engaging with CreatorBoost AI." />
      </Helmet>

      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white mb-2">Badges</h1>
          <p className="text-sm text-white/40">
            {earnedBadges.length} / {BADGES.length} collected
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sortedBadges.map((badge) => {
            const earned = earnedBadges.includes(badge.id);
            const style = RARITY_STYLES[badge.rarity];
            return (
              <motion.button
                key={badge.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBadge(badge)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  earned ? style.bg : 'bg-white/[0.02] opacity-50',
                  earned ? style.border : 'border-white/[0.04]'
                )}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className="text-sm font-bold text-white truncate">{badge.name}</h3>
                <p className={cn('text-[10px] font-medium mt-1', style.color)}>
                  {style.label}
                </p>
                {!earned && (
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-white/20">
                    <Lock className="w-3 h-3" />
                    Locked
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedBadge(null)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-sm bg-[#0B1120] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.06] text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center">
                <div className="text-5xl mb-3">{selectedBadge.icon}</div>
                <h3 className="text-lg font-display font-bold text-white mb-1">{selectedBadge.name}</h3>
                <p className={cn('text-xs font-medium mb-2', RARITY_STYLES[selectedBadge.rarity].color)}>
                  {RARITY_STYLES[selectedBadge.rarity].label}
                </p>
                <p className="text-sm text-white/40">{selectedBadge.description}</p>
                {earnedBadges.includes(selectedBadge.id) ? (
                  <div className="mt-4 py-2 px-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 font-medium">
                    Earned!
                  </div>
                ) : (
                  <div className="mt-4 py-2 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/30">
                    Keep using tools to unlock
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
