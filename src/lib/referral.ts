/**
 * CreatorBoost AI — Viral Growth & Referral Engine
 * Core logic for referrals, rewards, leaderboards, and growth loops
 *
 * Uses Firestore for authenticated users, localStorage for guests
 */

import { db, auth, handleFirestoreError, OperationType } from './firebase';
import {
  doc, setDoc, getDoc, updateDoc, increment,
  collection, query, where, orderBy, getDocs, limit as firestoreLimit,
  addDoc, serverTimestamp, Timestamp
} from 'firebase/firestore';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface ReferralProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  referralCode: string;
  referralLink: string;
  totalClicks: number;
  totalSignups: number;
  activeReferrals: number;
  totalRewardsEarned: number;
  rewardLevel: number;
  badges: string[];
  points: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  joinedAt: string;
  isPublic: boolean;
}

export interface ReferralEvent {
  id: string;
  referrerUid: string;
  referredUid?: string;
  referredEmail?: string;
  type: 'click' | 'signup' | 'active';
  timestamp: number;
  source: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  score: number;
  rank: number;
  badges: string[];
  level: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface RewardLevel {
  level: number;
  name: string;
  requiredReferrals: number;
  rewards: string[];
  badge: string;
  color: string;
}

export interface ShareCardData {
  title: string;
  description: string;
  imageUrl?: string;
  toolName: string;
  toolUrl: string;
  brandColor: string;
}

export interface GrowthEvent {
  type: 'share' | 'referral_click' | 'referral_signup' | 'badge_unlocked' | 'level_up' | 'streak_milestone';
  timestamp: number;
  metadata?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const SITE_URL = 'https://creatorboostai.xyz';

export const REWARD_LEVELS: RewardLevel[] = [
  {
    level: 1,
    name: 'Starter',
    requiredReferrals: 5,
    rewards: ['5 bonus credits', 'Starter badge', 'Priority support'],
    badge: '🏆',
    color: 'from-amber-500 to-orange-500',
  },
  {
    level: 2,
    name: 'Promoter',
    requiredReferrals: 25,
    rewards: ['25 bonus credits', 'Promoter badge', 'Custom profile theme', 'Early access to new tools'],
    badge: '🚀',
    color: 'from-purple-500 to-pink-500',
  },
  {
    level: 3,
    name: 'Ambassador',
    requiredReferrals: 100,
    rewards: ['100 bonus credits', 'Ambassador badge', 'Featured profile', 'Direct line to team', 'Beta access'],
    badge: '👑',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    level: 4,
    name: 'Legend',
    requiredReferrals: 500,
    rewards: ['500 bonus credits', 'Legend badge', 'Lifetime premium access', 'Co-creation opportunities', 'Merch package'],
    badge: '💎',
    color: 'from-yellow-400 to-amber-500',
  },
];

export const BADGES: Badge[] = [
  // Referral Badges
  { id: 'first_referral', name: 'First Referral', description: 'Referred your first user', icon: '🎯', color: 'text-emerald-400', requirement: '1 referral', rarity: 'common' },
  { id: 'referral_5', name: 'Connector', description: 'Referred 5 users', icon: '🤝', color: 'text-blue-400', requirement: '5 referrals', rarity: 'common' },
  { id: 'referral_25', name: 'Networker', description: 'Referred 25 users', icon: '🌐', color: 'text-purple-400', requirement: '25 referrals', rarity: 'rare' },
  { id: 'referral_100', name: 'Viral Master', description: 'Referred 100 users', icon: '⚡', color: 'text-amber-400', requirement: '100 referrals', rarity: 'epic' },
  { id: 'referral_500', name: 'Growth Legend', description: 'Referred 500 users', icon: '🔥', color: 'text-red-400', requirement: '500 referrals', rarity: 'legendary' },

  // Engagement Badges
  { id: 'early_adopter', name: 'Early Adopter', description: 'Joined in the first month', icon: '⭐', color: 'text-yellow-400', requirement: 'Join early', rarity: 'rare' },
  { id: 'power_creator', name: 'Power Creator', description: 'Used 10+ different tools', icon: '💪', color: 'text-pink-400', requirement: '10 tools used', rarity: 'rare' },
  { id: 'streak_7', name: 'Consistent Creator', description: '7-day usage streak', icon: '📅', color: 'text-orange-400', requirement: '7 day streak', rarity: 'common' },
  { id: 'streak_30', name: 'Dedicated Creator', description: '30-day usage streak', icon: '🏅', color: 'text-amber-400', requirement: '30 day streak', rarity: 'rare' },
  { id: 'streak_100', name: 'Unstoppable', description: '100-day usage streak', icon: '💎', color: 'text-cyan-400', requirement: '100 day streak', rarity: 'epic' },

  // Social Badges
  { id: 'first_share', name: 'Social Butterfly', description: 'Shared your first creation', icon: '🦋', color: 'text-blue-400', requirement: '1 share', rarity: 'common' },
  { id: 'share_10', name: 'Content Distributor', description: 'Shared 10 creations', icon: '📢', color: 'text-purple-400', requirement: '10 shares', rarity: 'common' },
  { id: 'share_50', name: 'Viral Creator', description: 'Shared 50 creations', icon: '🌊', color: 'text-cyan-400', requirement: '50 shares', rarity: 'rare' },

  // Milestone Badges
  { id: 'tools_used_5', name: 'Explorer', description: 'Used 5 different tools', icon: '🗺️', color: 'text-green-400', requirement: '5 tools', rarity: 'common' },
  { id: 'tools_used_25', name: 'Tool Master', description: 'Used 25 different tools', icon: '🎓', color: 'text-purple-400', requirement: '25 tools', rarity: 'rare' },
  { id: 'tools_used_all', name: 'Completionist', description: 'Used every tool on the platform', icon: '🏆', color: 'text-amber-400', requirement: 'All tools', rarity: 'legendary' },

  // Community Badges
  { id: 'trendsetter', name: 'Trendsetter', description: 'Had a creation reach the trending page', icon: '📈', color: 'text-emerald-400', requirement: 'Trending creation', rarity: 'rare' },
  { id: 'community_star', name: 'Community Star', description: 'Featured in the community showcase', icon: '🌟', color: 'text-yellow-400', requirement: 'Featured', rarity: 'epic' },
];

// ═══════════════════════════════════════════════════════════════════
// REFERRAL CODE GENERATION
// ═══════════════════════════════════════════════════════════════════

function generateReferralCode(displayName: string, uid: string): string {
  const cleanName = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 8);
  const suffix = uid.slice(0, 4);
  return `${cleanName}${suffix}`;
}

// ═══════════════════════════════════════════════════════════════════
// REFERRAL PROFILE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

export async function getOrCreateReferralProfile(
  uid: string,
  displayName: string,
  photoURL: string
): Promise<ReferralProfile> {
  const userRef = doc(db, 'referralProfiles', uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data() as ReferralProfile;
  }

  const code = generateReferralCode(displayName, uid);
  const profile: ReferralProfile = {
    uid,
    displayName,
    photoURL,
    referralCode: code,
    referralLink: `${SITE_URL}/ref/${code}`,
    totalClicks: 0,
    totalSignups: 0,
    activeReferrals: 0,
    totalRewardsEarned: 0,
    rewardLevel: 0,
    badges: [],
    points: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    joinedAt: new Date().toISOString(),
    isPublic: true,
  };

  try {
    await setDoc(userRef, profile);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'referralProfiles');
  }

  return profile;
}

export async function getReferralProfile(uid: string): Promise<ReferralProfile | null> {
  try {
    const userRef = doc(db, 'referralProfiles', uid);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? (docSnap.data() as ReferralProfile) : null;
  } catch {
    return null;
  }
}

export async function updateReferralProfile(
  uid: string,
  updates: Partial<ReferralProfile>
): Promise<void> {
  try {
    const userRef = doc(db, 'referralProfiles', uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'referralProfiles');
  }
}

// ═══════════════════════════════════════════════════════════════════
// REFERRAL TRACKING
// ═══════════════════════════════════════════════════════════════════

export async function trackReferralClick(code: string, source: string = 'direct'): Promise<void> {
  try {
    // Find referrer by code
    const q = query(
      collection(db, 'referralProfiles'),
      where('referralCode', '==', code)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const referrerDoc = snapshot.docs[0];
    const referrerUid = referrerDoc.id;

    // Record click event
    await addDoc(collection(db, 'referralEvents'), {
      referrerUid,
      type: 'click',
      source,
      timestamp: Date.now(),
    });

    // Update referrer stats
    const userRef = doc(db, 'referralProfiles', referrerUid);
    await updateDoc(userRef, {
      totalClicks: increment(1),
      points: increment(1),
    });
  } catch (error) {
    console.error('Failed to track referral click:', error);
  }
}

export async function trackReferralSignup(
  code: string,
  newUserId: string,
  newUserEmail: string
): Promise<void> {
  try {
    // Find referrer by code
    const q = query(
      collection(db, 'referralProfiles'),
      where('referralCode', '==', code)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const referrerDoc = snapshot.docs[0];
    const referrerUid = referrerDoc.id;

    // Don't allow self-referral
    if (referrerUid === newUserId) return;

    // Record signup event
    await addDoc(collection(db, 'referralEvents'), {
      referrerUid,
      referredUid: newUserId,
      referredEmail: newUserEmail,
      type: 'signup',
      timestamp: Date.now(),
    });

    // Update referrer stats
    const userRef = doc(db, 'referralProfiles', referrerUid);
    await updateDoc(userRef, {
      totalSignups: increment(1),
      activeReferrals: increment(1),
      totalRewardsEarned: increment(5),
      points: increment(10),
    });

    // Check for reward level upgrade
    const profile = await getReferralProfile(referrerUid);
    if (profile) {
      const newLevel = calculateRewardLevel(profile.totalSignups + 1);
      if (newLevel > profile.rewardLevel) {
        await updateDoc(userRef, { rewardLevel: newLevel });
      }

      // Award badges
      const newBadges = calculateBadges(profile);
      if (newBadges.length > profile.badges.length) {
        await updateDoc(userRef, { badges: newBadges });
      }
    }

    // Create notification for referrer
    await addDoc(collection(db, 'notifications'), {
      userId: referrerUid,
      type: 'referral_signup',
      title: 'New Referral!',
      message: `Someone signed up using your referral link! You earned 5 bonus credits.`,
      timestamp: Date.now(),
      read: false,
    });
  } catch (error) {
    console.error('Failed to track referral signup:', error);
  }
}

export async function trackReferralActive(referrerUid: string): Promise<void> {
  try {
    const userRef = doc(db, 'referralProfiles', referrerUid);
    await updateDoc(userRef, {
      points: increment(5),
    });
  } catch (error) {
    console.error('Failed to track active referral:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════
// REWARD LEVEL CALCULATION
// ═══════════════════════════════════════════════════════════════════

export function calculateRewardLevel(signups: number): number {
  for (let i = REWARD_LEVELS.length - 1; i >= 0; i--) {
    if (signups >= REWARD_LEVELS[i].requiredReferrals) {
      return REWARD_LEVELS[i].level;
    }
  }
  return 0;
}

export function getCurrentRewardLevel(level: number): RewardLevel | null {
  return REWARD_LEVELS.find(r => r.level === level) || null;
}

export function getNextRewardLevel(currentLevel: number): RewardLevel | null {
  return REWARD_LEVELS.find(r => r.level === currentLevel + 1) || null;
}

export function getReferralProgress(signups: number): {
  current: RewardLevel | null;
  next: RewardLevel | null;
  progress: number;
  remaining: number;
} {
  const current = getCurrentRewardLevel(calculateRewardLevel(signups));
  const next = current ? getNextRewardLevel(current.level) : REWARD_LEVELS[0];

  if (!next) {
    return { current, next: null, progress: 100, remaining: 0 };
  }

  const currentMin = current?.requiredReferrals || 0;
  const progress = ((signups - currentMin) / (next.requiredReferrals - currentMin)) * 100;
  const remaining = next.requiredReferrals - signups;

  return { current, next, progress: Math.min(100, Math.max(0, progress)), remaining };
}

// ═══════════════════════════════════════════════════════════════════
// BADGE SYSTEM
// ═══════════════════════════════════════════════════════════════════

export function calculateBadges(profile: ReferralProfile): string[] {
  const badges = new Set(profile.badges);

  // Referral badges
  if (profile.totalSignups >= 1) badges.add('first_referral');
  if (profile.totalSignups >= 5) badges.add('referral_5');
  if (profile.totalSignups >= 25) badges.add('referral_25');
  if (profile.totalSignups >= 100) badges.add('referral_100');
  if (profile.totalSignups >= 500) badges.add('referral_500');

  // Streak badges
  if (profile.streak >= 7) badges.add('streak_7');
  if (profile.streak >= 30) badges.add('streak_30');
  if (profile.streak >= 100) badges.add('streak_100');

  // Early adopter (within first 30 days of launch)
  const launchDate = new Date('2026-06-01');
  const joinDate = new Date(profile.joinedAt);
  if (joinDate.getTime() - launchDate.getTime() < 30 * 24 * 60 * 60 * 1000) {
    badges.add('early_adopter');
  }

  return Array.from(badges);
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

export function getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
  return BADGES.filter(b => b.rarity === rarity);
}

// ═══════════════════════════════════════════════════════════════════
// LEADERBOARD
// ═══════════════════════════════════════════════════════════════════

export async function getLeaderboard(
  sortBy: 'points' | 'referrals' | 'streak' = 'points',
  limitCount: number = 50
): Promise<LeaderboardEntry[]> {
  try {
    const sortField = sortBy === 'referrals' ? 'totalSignups' : sortBy;
    const q = query(
      collection(db, 'referralProfiles'),
      where('isPublic', '==', true),
      orderBy(sortField, 'desc'),
      firestoreLimit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, index) => {
      const data = doc.data() as ReferralProfile;
      return {
        uid: data.uid,
        displayName: data.displayName,
        photoURL: data.photoURL,
        score: sortBy === 'referrals' ? data.totalSignups : sortBy === 'streak' ? data.streak : data.points,
        rank: index + 1,
        badges: data.badges,
        level: data.level,
      };
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}

export async function getUserRank(uid: string): Promise<{ rank: number; total: number } | null> {
  try {
    const profile = await getReferralProfile(uid);
    if (!profile) return null;

    const q = query(
      collection(db, 'referralProfiles'),
      where('isPublic', '==', true),
      orderBy('points', 'desc')
    );

    const snapshot = await getDocs(q);
    const total = snapshot.size;
    const rank = snapshot.docs.findIndex(doc => doc.id === uid) + 1;

    return { rank: rank || total + 1, total };
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// POINTS & LEVELING
// ═══════════════════════════════════════════════════════════════════

export function calculateLevel(points: number): number {
  // Level formula: every 100 points = 1 level
  return Math.floor(points / 100) + 1;
}

export function getPointsToNextLevel(points: number): number {
  const currentLevel = calculateLevel(points);
  const nextLevelPoints = currentLevel * 100;
  return nextLevelPoints - points;
}

export function getLevelProgress(points: number): number {
  const currentLevel = calculateLevel(points);
  const basePoints = (currentLevel - 1) * 100;
  return ((points - basePoints) / 100) * 100;
}

// ═══════════════════════════════════════════════════════════════════
// STREAK SYSTEM
// ═══════════════════════════════════════════════════════════════════

export async function updateStreak(uid: string): Promise<{ streak: number; isNew: boolean }> {
  try {
    const profile = await getReferralProfile(uid);
    if (!profile) return { streak: 0, isNew: false };

    const today = new Date().toISOString().split('T')[0];
    const lastActive = profile.lastActiveDate;

    if (lastActive === today) {
      return { streak: profile.streak, isNew: false };
    }

    const lastDate = new Date(lastActive);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak: number;
    if (diffDays === 1) {
      newStreak = profile.streak + 1;
    } else {
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, profile.longestStreak);

    await updateDoc(doc(db, 'referralProfiles', uid), {
      streak: newStreak,
      longestStreak,
      lastActiveDate: today,
      points: increment(diffDays === 1 ? 2 : 1), // Bonus for consecutive days
    });

    return { streak: newStreak, isNew: diffDays === 1 };
  } catch (error) {
    console.error('Failed to update streak:', error);
    return { streak: 0, isNew: false };
  }
}

// ═══════════════════════════════════════════════════════════════════
// SHARE TRACKING
// ═══════════════════════════════════════════════════════════════════

export async function trackShare(
  uid: string,
  platform: string,
  toolName: string
): Promise<void> {
  try {
    await addDoc(collection(db, 'shareEvents'), {
      uid,
      platform,
      toolName,
      timestamp: Date.now(),
    });

    // Award points for sharing
    await updateDoc(doc(db, 'referralProfiles', uid), {
      points: increment(2),
    });

    // Check for share badges
    const q = query(
      collection(db, 'shareEvents'),
      where('uid', '==', uid)
    );
    const snapshot = await getDocs(q);
    const shareCount = snapshot.size;

    const newBadges: string[] = [];
    if (shareCount >= 1) newBadges.push('first_share');
    if (shareCount >= 10) newBadges.push('share_10');
    if (shareCount >= 50) newBadges.push('share_50');

    if (newBadges.length > 0) {
      const profile = await getReferralProfile(uid);
      if (profile) {
        const allBadges = [...new Set([...profile.badges, ...newBadges])];
        await updateDoc(doc(db, 'referralProfiles', uid), { badges: allBadges });
      }
    }
  } catch (error) {
    console.error('Failed to track share:', error);
  }
}

export async function getShareCount(uid: string): Promise<number> {
  try {
    const q = query(collection(db, 'shareEvents'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch {
    return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════
// GROWTH ANALYTICS
// ═══════════════════════════════════════════════════════════════════

export async function getGrowthAnalytics(uid: string): Promise<{
  totalShares: number;
  totalReferralClicks: number;
  totalReferralSignups: number;
  pointsEarnedToday: number;
  weeklyGrowth: number;
}> {
  try {
    const profile = await getReferralProfile(uid);
    if (!profile) {
      return { totalShares: 0, totalReferralClicks: 0, totalReferralSignups: 0, pointsEarnedToday: 0, weeklyGrowth: 0 };
    }

    const shareCount = await getShareCount(uid);

    // Get this week's events
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const q = query(
      collection(db, 'referralEvents'),
      where('referrerUid', '==', uid),
      where('timestamp', '>=', weekAgo)
    );
    const snapshot = await getDocs(q);
    const weeklyGrowth = snapshot.size;

    return {
      totalShares: shareCount,
      totalReferralClicks: profile.totalClicks,
      totalReferralSignups: profile.totalSignups,
      pointsEarnedToday: profile.points % 100,
      weeklyGrowth,
    };
  } catch {
    return { totalShares: 0, totalReferralClicks: 0, totalReferralSignups: 0, pointsEarnedToday: 0, weeklyGrowth: 0 };
  }
}

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════════

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string
): Promise<void> {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false,
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

export async function getNotifications(uid: string, limitCount: number = 20): Promise<any[]> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', uid),
      orderBy('timestamp', 'desc'),
      firestoreLimit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════
// ANTI-FRAUD
// ═══════════════════════════════════════════════════════════════════

export function detectReferralFraud(events: ReferralEvent[]): {
  isSuspicious: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  // Check for rapid signups from same IP
  const recentSignups = events.filter(
    e => e.type === 'signup' && Date.now() - e.timestamp < 60 * 60 * 1000
  );
  if (recentSignups.length > 10) {
    reasons.push('Unusual number of signups in short time');
  }

  // Check for self-referral patterns
  const uniqueEmails = new Set(events.map(e => e.referredEmail));
  if (uniqueEmails.size < events.filter(e => e.type === 'signup').length * 0.5) {
    reasons.push('Suspicious email patterns detected');
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons,
  };
}

// ═══════════════════════════════════════════════════════════════════
// SHARE URL HELPERS
// ═══════════════════════════════════════════════════════════════════

export function generateShareUrls(data: ShareCardData): Record<string, string> {
  const text = encodeURIComponent(`Check out ${data.title} on CreatorBoost AI — Free AI tools for creators!`);
  const url = encodeURIComponent(data.toolUrl);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    reddit: `https://reddit.com/submit?url=${url}&title=${encodeURIComponent(data.title)}`,
    email: `mailto:?subject=${encodeURIComponent(data.title)}&body=${text}%0A%0A${url}`,
  };
}

export function getReferralUrl(code: string): string {
  return `${SITE_URL}/ref/${code}`;
}

export function getProfileUrl(uid: string): string {
  return `${SITE_URL}/profile/${uid}`;
}
