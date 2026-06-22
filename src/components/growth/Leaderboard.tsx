/**
 * CreatorBoost AI — Leaderboard Component
 * Premium leaderboard with rankings, animations, and filtering
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Trophy, Medal, TrendingUp, Flame, Star,
  ChevronDown, Users, Zap, Award
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { type LeaderboardEntry } from '../../lib/referral';
import { BadgePreview } from './BadgeDisplay';

/* ═══════════════════════════════════════════════════════════════════
   RANK ICONS
   ═══════════════════════════════════════════════════════════════════ */

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;

  return (
    <span className={cn(
      'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
      rank <= 10 ? 'bg-white/[0.06] text-white/60' : 'bg-white/[0.03] text-white/30'
    )}>
      {rank}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PODIUM CARD (Top 3)
   ═══════════════════════════════════════════════════════════════════ */

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: 1 | 2 | 3 }) {
  const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
  const gradients = {
    1: 'from-amber-500/20 to-amber-500/5',
    2: 'from-slate-400/20 to-slate-400/5',
    3: 'from-orange-500/20 to-orange-500/5',
  };
  const borders = {
    1: 'border-amber-500/30',
    2: 'border-slate-400/30',
    3: 'border-orange-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1 }}
      className="flex flex-col items-center"
    >
      {/* Avatar */}
      <div className="relative mb-3">
        <img
          src={entry.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.uid}`}
          alt={entry.displayName}
          className={cn(
            'rounded-full border-2 object-cover',
            borders[position],
            position === 1 ? 'w-16 h-16' : 'w-12 h-12'
          )}
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0B1120] flex items-center justify-center text-sm">
          {position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'}
        </div>
      </div>

      {/* Name */}
      <p className={cn(
        'font-bold text-white mb-1 text-center',
        position === 1 ? 'text-base' : 'text-sm'
      )}>
        {entry.displayName}
      </p>

      {/* Points */}
      <p className={cn(
        'font-bold mb-2',
        position === 1 ? 'text-amber-400 text-lg' : 'text-white/60 text-sm'
      )}>
        {entry.score.toLocaleString()} pts
      </p>

      {/* Badges */}
      {entry.badges.length > 0 && (
        <BadgePreview badgeIds={entry.badges} limit={3} />
      )}

      {/* Podium Bar */}
      <div className={cn(
        'w-full rounded-t-xl mt-3 bg-gradient-to-t',
        gradients[position]
      )}>
        <div className={cn(heights[position], 'flex items-center justify-center')}>
          <span className="text-3xl font-bold text-white/10">#{entry.rank}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LEADERBOARD ROW
   ═══════════════════════════════════════════════════════════════════ */

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all',
        isCurrentUser
          ? 'bg-brand-500/10 border border-brand-500/20'
          : 'hover:bg-white/[0.03]'
      )}
    >
      <RankIcon rank={entry.rank} />

      <img
        src={entry.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.uid}`}
        alt={entry.displayName}
        className="w-10 h-10 rounded-full border border-white/[0.08] object-cover"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white truncate">{entry.displayName}</p>
          {isCurrentUser && (
            <span className="text-[10px] font-bold text-brand-400 bg-brand-500/20 px-1.5 py-0.5 rounded">
              You
            </span>
          )}
        </div>
        {entry.badges.length > 0 && (
          <BadgePreview badgeIds={entry.badges} limit={3} />
        )}
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-white">{entry.score.toLocaleString()}</p>
        <p className="text-[10px] text-white/30">points</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

export default function Leaderboard({ entries, currentUserId, className }: LeaderboardProps) {
  const [sortBy, setSortBy] = useState<'points' | 'referrals' | 'streak'>('points');
  const [showAll, setShowAll] = useState(false);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const displayEntries = showAll ? rest : rest.slice(0, 10);

  if (entries.length === 0) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <Trophy className="w-12 h-12 text-white/10 mx-auto mb-3" />
        <p className="text-sm text-white/40">No leaderboard data yet</p>
        <p className="text-xs text-white/20">Be the first to earn points!</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          Leaderboard
        </h3>

        {/* Sort Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          {[
            { id: 'points', label: 'Points', icon: Star },
            { id: 'referrals', label: 'Referrals', icon: Users },
            { id: 'streak', label: 'Streak', icon: Flame },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSortBy(id as typeof sortBy)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all',
                sortBy === id
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/40 hover:text-white/60'
              )}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Podium (Top 3) */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-4">
          <PodiumCard entry={top3[1]} position={2} />
          <PodiumCard entry={top3[0]} position={1} />
          <PodiumCard entry={top3[2]} position={3} />
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="space-y-1">
        {displayEntries.map((entry) => (
          <LeaderboardRow
            key={entry.uid}
            entry={entry}
            isCurrentUser={entry.uid === currentUserId}
          />
        ))}
      </div>

      {/* Show More */}
      {rest.length > 10 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2"
        >
          Show All ({entries.length} users)
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
