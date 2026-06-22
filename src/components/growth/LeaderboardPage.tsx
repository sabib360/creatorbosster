/**
 * CreatorBoost AI — Leaderboard Page
 * Full-page leaderboard with rankings and stats
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Medal, TrendingUp, Flame, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getLeaderboard, type LeaderboardEntry } from '../../lib/referral';
import { Helmet } from 'react-helmet-async';

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className={cn(
      'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
      rank <= 10 ? 'bg-white/[0.06] text-white/60' : 'bg-white/[0.03] text-white/30'
    )}>
      {rank}
    </span>
  );
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'points' | 'referrals' | 'streak'>('points');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboard(sortBy, 50);
        setEntries(data);
      } catch {
        setEntries([]);
      }
      setLoading(false);
    };
    load();
  }, [sortBy]);

  return (
    <>
      <Helmet>
        <title>Leaderboard — CreatorBoost AI</title>
        <meta name="description" content="See the top creators on CreatorBoost AI. Compete for the #1 spot!" />
      </Helmet>

      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white mb-2">Leaderboard</h1>
          <p className="text-sm text-white/40">Top creators on CreatorBoost AI</p>
        </div>

        {/* Sort Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: 'points' as const, label: 'Points', icon: Crown },
            { id: 'referrals' as const, label: 'Referrals', icon: Users },
            { id: 'streak' as const, label: 'Streak', icon: Flame },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSortBy(id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                sortBy === id
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                  : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white/60'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Entries */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-12 h-12 mx-auto text-white/10 mb-3" />
            <p className="text-sm text-white/30">No entries yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border transition-all',
                  i < 3
                    ? 'bg-brand-500/5 border-brand-500/20'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                )}
              >
                <RankIcon rank={i + 1} />
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg font-bold text-white/40 overflow-hidden">
                  {entry.photoURL ? (
                    <img src={entry.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    entry.displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{entry.displayName}</p>
                  <p className="text-xs text-white/30">
                    Level {entry.level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-400">{entry.score.toLocaleString()}</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-wider">
                    {sortBy === 'points' ? 'points' : sortBy === 'referrals' ? 'referrals' : 'score'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
