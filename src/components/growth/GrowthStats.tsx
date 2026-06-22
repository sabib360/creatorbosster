/**
 * CreatorBoost AI — Growth Stats Component
 * Real-time growth analytics dashboard
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, MousePointerClick, UserPlus, Share2,
  Flame, Star, BarChart3, ArrowUpRight, ArrowDownRight,
  Zap, Activity, Target, Award
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReferral } from '../../hooks/useReferral';
import {
  calculateLevel, getLevelProgress, getPointsToNextLevel,
  getCurrentRewardLevel, getReferralProgress
} from '../../lib/referral';

/* ═══════════════════════════════════════════════════════════════════
   PROGRESS RING
   ═══════════════════════════════════════════════════════════════════ */

function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  color = 'brand',
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: 'brand' | 'emerald' | 'amber' | 'cyan';
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const colors = {
    brand: 'stroke-brand-500',
    emerald: 'stroke-emerald-500',
    amber: 'stroke-amber-500',
    cyan: 'stroke-cyan-500',
  };

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-white/[0.06]"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={colors[color]}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════════════════════════════ */

function StatCard({
  icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', color)}>
          {icon}
        </div>
        <span className="text-xs text-white/40">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-white">{value}</span>
        {change && (
          <span className="text-xs text-white/30">{change}</span>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function GrowthStats() {
  const { referralProfile, analytics, loading } = useReferral();

  if (loading || !referralProfile) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white/[0.03] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const level = calculateLevel(referralProfile.points);
  const levelProgress = getLevelProgress(referralProfile.points);
  const pointsToNext = getPointsToNextLevel(referralProfile.points);
  const rewardLevel = getCurrentRewardLevel(referralProfile.rewardLevel);

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-500/5 border border-brand-500/20"
      >
        <div className="flex items-center gap-6">
          {/* Progress Ring */}
          <div className="relative flex-shrink-0">
            <ProgressRing progress={levelProgress} size={80} strokeWidth={5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-xl font-bold text-white">{level}</span>
                <p className="text-[9px] text-white/40">LEVEL</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{rewardLevel?.badge || '⭐'}</span>
              <h3 className="text-lg font-display font-bold text-white">
                {rewardLevel?.name || 'Getting Started'}
              </h3>
            </div>
            <p className="text-xs text-white/40 mb-2">
              {referralProfile.points.toLocaleString()} total points
            </p>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span>{pointsToNext} points to next level</span>
              <span>•</span>
              <span>{referralProfile.streak} day streak</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Share2 className="w-4 h-4 text-brand-400" />}
          label="Total Shares"
          value={analytics?.totalShares || 0}
          color="bg-brand-500/10"
        />
        <StatCard
          icon={<MousePointerClick className="w-4 h-4 text-cyan-400" />}
          label="Referral Clicks"
          value={analytics?.totalReferralClicks || 0}
          color="bg-cyan-500/10"
        />
        <StatCard
          icon={<UserPlus className="w-4 h-4 text-emerald-400" />}
          label="Referral Signups"
          value={analytics?.totalReferralSignups || 0}
          color="bg-emerald-500/10"
        />
        <StatCard
          icon={<Flame className="w-4 h-4 text-orange-400" />}
          label="Weekly Growth"
          value={`+${analytics?.weeklyGrowth || 0}`}
          color="bg-orange-500/10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: Share2,
            title: 'Share Your Link',
            description: 'Spread the word and earn rewards',
            color: 'text-brand-400',
            href: '/dashboard/referrals',
          },
          {
            icon: Award,
            title: 'View Badges',
            description: 'Check your earned achievements',
            color: 'text-amber-400',
            href: '/dashboard/badges',
          },
          {
            icon: BarChart3,
            title: 'Leaderboard',
            description: 'See where you rank',
            color: 'text-cyan-400',
            href: '/dashboard/leaderboard',
          },
        ].map((action, i) => (
          <motion.a
            key={i}
            href={action.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.10] transition-all group"
          >
            <action.icon className={cn('w-5 h-5 mb-2', action.color)} />
            <h4 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors mb-1">
              {action.title}
            </h4>
            <p className="text-xs text-white/40">{action.description}</p>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
