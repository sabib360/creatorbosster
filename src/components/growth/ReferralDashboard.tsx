/**
 * CreatorBoost AI — Referral Dashboard
 * Premium referral management with analytics and rewards
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Link2, MousePointerClick, UserPlus, Trophy, Copy, Check,
  Share2, ArrowUpRight, TrendingUp, Zap, Gift, Star, ChevronRight,
  ExternalLink, BarChart3, Flame, Award, Crown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReferral } from '../../hooks/useReferral';
import {
  REWARD_LEVELS, getReferralProgress, getCurrentRewardLevel,
  getNextRewardLevel, getReferralUrl
} from '../../lib/referral';
import SocialShare from './SocialShare';

/* ═══════════════════════════════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════════════════════════════ */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color: string;
}

function StatCard({ icon, label, value, change, changeType = 'neutral', color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.10] transition-all',
        color
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-medium text-white/40">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change && (
          <span className={cn(
            'text-xs font-medium flex items-center gap-1',
            changeType === 'positive' ? 'text-emerald-400' :
            changeType === 'negative' ? 'text-red-400' : 'text-white/40'
          )}>
            {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REWARD LEVEL CARD
   ═══════════════════════════════════════════════════════════════════ */

function RewardLevelCard({ signups }: { signups: number }) {
  const { current, next, progress, remaining } = getReferralProgress(signups);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-500/5 border border-brand-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">
              {current ? `${current.badge} ${current.name}` : 'Start Referring'}
            </h3>
            <p className="text-xs text-white/40">
              {current ? `Level ${current.level} Reward Tier` : 'Refer 5 friends to unlock rewards'}
            </p>
          </div>
        </div>
        {next && (
          <div className="text-right">
            <p className="text-xs text-white/40">Next Level</p>
            <p className="text-sm font-bold text-brand-400">{next.badge} {next.name}</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {next && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-white/40 mb-2">
            <span>{signups} / {next.requiredReferrals} referrals</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
            />
          </div>
          <p className="text-xs text-white/30 mt-2">
            {remaining} more referral{remaining !== 1 ? 's' : ''} to reach {next.name}
          </p>
        </div>
      )}

      {/* Current Rewards */}
      {current && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Your Rewards</p>
          <div className="flex flex-wrap gap-2">
            {current.rewards.map((reward, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-lg bg-white/[0.04] text-xs text-white/60 border border-white/[0.06]"
              >
                {reward}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REWARD LEVELS TIMELINE
   ═══════════════════════════════════════════════════════════════════ */

function RewardLevelsTimeline({ currentLevel }: { currentLevel: number }) {
  return (
    <div className="space-y-3">
      {REWARD_LEVELS.map((level) => {
        const isActive = currentLevel >= level.level;
        const isCurrent = currentLevel === level.level;

        return (
          <motion.div
            key={level.level}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: level.level * 0.1 }}
            className={cn(
              'flex items-center gap-4 p-3 rounded-xl border transition-all',
              isActive
                ? 'bg-white/[0.04] border-white/[0.08]'
                : 'bg-white/[0.01] border-white/[0.04] opacity-50'
            )}
          >
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
              isActive ? 'bg-brand-500/20' : 'bg-white/[0.04]'
            )}>
              {level.badge}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={cn('text-sm font-bold', isActive ? 'text-white' : 'text-white/40')}>
                  Level {level.level}: {level.name}
                </h4>
                {isCurrent && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs text-white/30">{level.requiredReferrals} referrals</p>
            </div>
            {isActive && <Check className="w-4 h-4 text-emerald-400" />}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function ReferralDashboard() {
  const {
    referralProfile,
    leaderboard,
    userRank,
    analytics,
    loading,
    copyReferralLink,
    refresh,
  } = useReferral();

  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    const success = await copyReferralLink();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copyReferralLink]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!referralProfile) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-white mb-1">Referral Program</h2>
        <p className="text-sm text-white/40">Invite friends and earn rewards for every sign-up</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Link2 className="w-4 h-4 text-brand-400" />}
          label="Total Clicks"
          value={referralProfile.totalClicks.toLocaleString()}
          change={`${analytics?.weeklyGrowth || 0} this week`}
          changeType="positive"
          color="bg-brand-500/10"
        />
        <StatCard
          icon={<UserPlus className="w-4 h-4 text-emerald-400" />}
          label="Total Signups"
          value={referralProfile.totalSignups.toLocaleString()}
          change="+2 this week"
          changeType="positive"
          color="bg-emerald-500/10"
        />
        <StatCard
          icon={<Flame className="w-4 h-4 text-orange-400" />}
          label="Current Streak"
          value={`${referralProfile.streak} days`}
          change={`Best: ${referralProfile.longestStreak}`}
          changeType="neutral"
          color="bg-orange-500/10"
        />
        <StatCard
          icon={<Star className="w-4 h-4 text-amber-400" />}
          label="Total Points"
          value={referralProfile.points.toLocaleString()}
          change={`Level ${referralProfile.level}`}
          changeType="positive"
          color="bg-amber-500/10"
        />
      </div>

      {/* Referral Link Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-r from-brand-500/10 to-cyan-500/10 border border-brand-500/20"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Your Referral Link</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-3 rounded-xl bg-black/30 text-sm text-white/80 font-mono truncate border border-white/[0.06]">
                {referralProfile.referralLink}
              </code>
              <button
                onClick={handleCopyLink}
                className={cn(
                  'px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2',
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20'
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Share */}
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <p className="text-xs text-white/30 mb-3">Quick Share</p>
          <SocialShare
            url={referralProfile.referralLink}
            title="Join CreatorBoost AI"
            description="Free AI tools for creators — Generate images, remove backgrounds, write captions, and more!"
            variant="compact"
            showLabel={false}
          />
        </div>
      </motion.div>

      {/* Reward Level */}
      <RewardLevelCard signups={referralProfile.totalSignups} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reward Levels Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
        >
          <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-400" />
            Reward Tiers
          </h3>
          <RewardLevelsTimeline currentLevel={referralProfile.rewardLevel} />
        </motion.div>

        {/* Leaderboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              Leaderboard
            </h3>
            {userRank && (
              <span className="text-xs text-white/40">
                Your rank: #{userRank.rank}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry, i) => (
              <div
                key={entry.uid}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all',
                  entry.uid === referralProfile.uid
                    ? 'bg-brand-500/10 border border-brand-500/20'
                    : 'bg-white/[0.02] hover:bg-white/[0.04]'
                )}
              >
                <span className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                  i === 0 ? 'bg-amber-500/20 text-amber-400' :
                  i === 1 ? 'bg-slate-400/20 text-slate-400' :
                  i === 2 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-white/[0.04] text-white/40'
                )}>
                  {entry.rank}
                </span>
                <img
                  src={entry.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.uid}`}
                  alt={entry.displayName}
                  className="w-8 h-8 rounded-full border border-white/[0.08]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{entry.displayName}</p>
                  <p className="text-xs text-white/30">{entry.score.toLocaleString()} points</p>
                </div>
                {i < 3 && (
                  <span className="text-lg">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
      >
        <h3 className="text-lg font-display font-bold text-white mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: 'Share Your Link',
              description: 'Copy your unique referral link and share it with friends, on social media, or in communities.',
              icon: Share2,
              color: 'text-brand-400',
            },
            {
              step: '2',
              title: 'Friends Sign Up',
              description: 'When someone clicks your link and creates an account, they become your referral.',
              icon: UserPlus,
              color: 'text-emerald-400',
            },
            {
              step: '3',
              title: 'Earn Rewards',
              description: 'Earn bonus credits, unlock badges, and climb the leaderboard with every referral.',
              icon: Gift,
              color: 'text-amber-400',
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className={cn('w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0')}>
                <item.icon className={cn('w-5 h-5', item.color)} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
