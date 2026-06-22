/**
 * CreatorBoost AI — Referral Hook
 * Manages referral state, profile, and actions
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  getOrCreateReferralProfile,
  getReferralProfile,
  updateReferralProfile,
  trackReferralClick,
  getLeaderboard,
  getUserRank,
  getGrowthAnalytics,
  updateStreak,
  type ReferralProfile,
  type LeaderboardEntry,
} from '../lib/referral';

export function useReferral() {
  const { user, profile } = useAuth();
  const [referralProfile, setReferralProfile] = useState<ReferralProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<{ rank: number; total: number } | null>(null);
  const [analytics, setAnalytics] = useState<{
    totalShares: number;
    totalReferralClicks: number;
    totalReferralSignups: number;
    pointsEarnedToday: number;
    weeklyGrowth: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Load referral profile
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const p = await getOrCreateReferralProfile(
          user.uid,
          profile?.displayName || 'Creator',
          profile?.photoURL || ''
        );
        setReferralProfile(p);

        // Update streak
        await updateStreak(user.uid);

        // Load leaderboard
        const lb = await getLeaderboard('points', 20);
        setLeaderboard(lb);

        // Load rank
        const rank = await getUserRank(user.uid);
        setUserRank(rank);

        // Load analytics
        const stats = await getGrowthAnalytics(user.uid);
        setAnalytics(stats);
      } catch (error) {
        console.error('Failed to load referral profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, profile]);

  // Copy referral link
  const copyReferralLink = useCallback(async () => {
    if (!referralProfile) return false;
    try {
      await navigator.clipboard.writeText(referralProfile.referralLink);
      return true;
    } catch {
      return false;
    }
  }, [referralProfile]);

  // Toggle public profile
  const togglePublicProfile = useCallback(async () => {
    if (!user || !referralProfile) return;
    const newValue = !referralProfile.isPublic;
    await updateReferralProfile(user.uid, { isPublic: newValue });
    setReferralProfile(prev => prev ? { ...prev, isPublic: newValue } : null);
  }, [user, referralProfile]);

  // Refresh data
  const refresh = useCallback(async () => {
    if (!user) return;
    const p = await getReferralProfile(user.uid);
    if (p) setReferralProfile(p);
    const lb = await getLeaderboard('points', 20);
    setLeaderboard(lb);
    const rank = await getUserRank(user.uid);
    setUserRank(rank);
    const stats = await getGrowthAnalytics(user.uid);
    setAnalytics(stats);
  }, [user]);

  return {
    referralProfile,
    leaderboard,
    userRank,
    analytics,
    loading,
    copyReferralLink,
    togglePublicProfile,
    refresh,
  };
}
