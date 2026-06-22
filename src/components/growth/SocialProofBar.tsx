/**
 * CreatorBoost AI — Social Proof Bar
 * Shows live counters to build trust and FOMO
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, TrendingUp, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

interface SocialProofBarProps {
  className?: string;
}

export default function SocialProofBar({ className }: SocialProofBarProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    toolsUsed: 0,
    todayUsage: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem('creatorboost-social-proof');
    if (stored) {
      const data = JSON.parse(stored);
      const now = Date.now();
      const hoursSince = (now - data.timestamp) / (1000 * 60 * 60);
      
      if (hoursSince < 24) {
        setStats({
          totalUsers: data.totalUsers + Math.floor(Math.random() * 50),
          toolsUsed: data.toolsUsed + Math.floor(Math.random() * 200),
          todayUsage: data.todayUsage + Math.floor(Math.random() * 10),
        });
        return;
      }
    }

    setStats({
      totalUsers: 847293 + Math.floor(Math.random() * 10000),
      toolsUsed: 12847293 + Math.floor(Math.random() * 50000),
      todayUsage: 23847 + Math.floor(Math.random() * 1000),
    });

    localStorage.setItem('creatorboost-social-proof', JSON.stringify({
      totalUsers: 847293,
      toolsUsed: 12847293,
      todayUsage: 23847,
      timestamp: Date.now(),
    }));
  }, []);

  const items = [
    { icon: Users, label: 'Active Creators', value: stats.totalUsers, color: 'text-brand-400' },
    { icon: Zap, label: 'Tools Used', value: stats.toolsUsed, color: 'text-purple-400' },
    { icon: TrendingUp, label: 'Used Today', value: stats.todayUsage, color: 'text-green-400' },
  ];

  return (
    <div className={cn('flex items-center justify-center gap-6 sm:gap-8 py-3', className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2 text-xs"
        >
          <item.icon className={cn('w-3.5 h-3.5', item.color)} />
          <span className="text-white/40">
            <span className="font-bold text-white/70"><AnimatedCounter value={item.value} /></span>
            {' '}{item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
