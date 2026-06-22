/**
 * CreatorBoost AI — Badge Display Component
 * Shows earned badges with animations and rarity indicators
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, Sparkles, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BADGES, getBadgeById, type Badge } from '../../lib/referral';

/* ═══════════════════════════════════════════════════════════════════
   RARITY STYLES
   ═══════════════════════════════════════════════════════════════════ */

const RARITY_STYLES: Record<Badge['rarity'], {
  bg: string;
  border: string;
  glow: string;
  label: string;
  color: string;
}> = {
  common: {
    bg: 'bg-white/[0.04]',
    border: 'border-white/[0.08]',
    glow: '',
    label: 'Common',
    color: 'text-white/40',
  },
  rare: {
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/10',
    label: 'Rare',
    color: 'text-blue-400',
  },
  epic: {
    bg: 'bg-purple-500/5',
    border: 'border-purple-500/20',
    glow: 'shadow-purple-500/10',
    label: 'Epic',
    color: 'text-purple-400',
  },
  legendary: {
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/10',
    label: 'Legendary',
    color: 'text-amber-400',
  },
};

/* ═══════════════════════════════════════════════════════════════════
   SINGLE BADGE
   ═══════════════════════════════════════════════════════════════════ */

interface BadgeItemProps {
  badge: Badge;
  earned: boolean;
  onClick?: () => void;
}

function BadgeItem({ badge, earned, onClick }: BadgeItemProps) {
  const rarity = RARITY_STYLES[badge.rarity];

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-xl border transition-all text-left',
        earned ? rarity.bg : 'bg-white/[0.01] border-white/[0.04] opacity-40',
        earned && rarity.border,
        earned && rarity.glow && `shadow-lg ${rarity.glow}`
      )}
    >
      {/* Rarity Badge */}
      <span className={cn(
        'absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
        rarity.color,
        earned ? 'bg-white/[0.06]' : 'bg-white/[0.03]'
      )}>
        {rarity.label}
      </span>

      {/* Icon */}
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3',
        earned ? 'bg-white/[0.06]' : 'bg-white/[0.03]'
      )}>
        {earned ? badge.icon : <Lock className="w-5 h-5 text-white/20" />}
      </div>

      {/* Info */}
      <h4 className={cn('text-sm font-bold mb-1', earned ? 'text-white' : 'text-white/30')}>
        {badge.name}
      </h4>
      <p className={cn('text-xs leading-relaxed', earned ? 'text-white/50' : 'text-white/20')}>
        {badge.description}
      </p>
      <p className={cn('text-[10px] mt-2', earned ? 'text-white/30' : 'text-white/15')}>
        {badge.requirement}
      </p>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BADGE DETAIL MODAL
   ═══════════════════════════════════════════════════════════════════ */

interface BadgeDetailProps {
  badge: Badge;
  earned: boolean;
  onClose: () => void;
}

function BadgeDetail({ badge, earned, onClose }: BadgeDetailProps) {
  const rarity = RARITY_STYLES[badge.rarity];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          'relative w-full max-w-sm p-6 rounded-2xl border',
          earned ? rarity.bg : 'bg-[#0B1120]',
          earned ? rarity.border : 'border-white/[0.08]'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className={cn(
              'w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4',
              earned ? 'bg-white/[0.08]' : 'bg-white/[0.04]'
            )}
          >
            {earned ? badge.icon : <Lock className="w-8 h-8 text-white/20" />}
          </motion.div>

          {/* Rarity */}
          <span className={cn(
            'inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2',
            rarity.color,
            'bg-white/[0.06]'
          )}>
            {rarity.label}
          </span>

          {/* Name */}
          <h3 className="text-xl font-display font-bold text-white mb-2">{badge.name}</h3>
          <p className="text-sm text-white/50 mb-4">{badge.description}</p>

          {/* Requirement */}
          <div className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <p className="text-xs text-white/40">Requirement</p>
            <p className="text-sm font-medium text-white">{badge.requirement}</p>
          </div>

          {/* Status */}
          {earned ? (
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Badge Earned!</span>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center gap-2 text-white/30">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Not Yet Earned</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

interface BadgeDisplayProps {
  earnedBadgeIds: string[];
  showAll?: boolean;
  className?: string;
}

export default function BadgeDisplay({ earnedBadgeIds, showAll = false, className }: BadgeDisplayProps) {
  const [selectedBadge, setSelectedBadge] = useState<{ badge: Badge; earned: boolean } | null>(null);
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

  const earnedSet = new Set(earnedBadgeIds);

  const filteredBadges = BADGES.filter(badge => {
    if (filter === 'earned') return earnedSet.has(badge.id);
    if (filter === 'locked') return !earnedSet.has(badge.id);
    return true;
  });

  const earnedCount = BADGES.filter(b => earnedSet.has(b.id)).length;

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-400" />
            Badges
          </h3>
          <p className="text-xs text-white/40">
            {earnedCount} of {BADGES.length} earned
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {(['all', 'earned', 'locked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize',
                filter === f
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/60'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredBadges.map((badge) => (
          <BadgeItem
            key={badge.id}
            badge={badge}
            earned={earnedSet.has(badge.id)}
            onClick={() => setSelectedBadge({ badge, earned: earnedSet.has(badge.id) })}
          />
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetail
            badge={selectedBadge.badge}
            earned={selectedBadge.earned}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BADGE PREVIEW (for profiles)
   ═══════════════════════════════════════════════════════════════════ */

export function BadgePreview({ badgeIds, limit = 5 }: { badgeIds: string[]; limit?: number }) {
  const badges = badgeIds
    .slice(0, limit)
    .map(id => getBadgeById(id))
    .filter(Boolean) as Badge[];

  if (badges.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {badges.map((badge) => (
        <span
          key={badge.id}
          className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-sm"
          title={badge.name}
        >
          {badge.icon}
        </span>
      ))}
      {badgeIds.length > limit && (
        <span className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-[10px] font-bold text-white/40">
          +{badgeIds.length - limit}
        </span>
      )}
    </div>
  );
}
