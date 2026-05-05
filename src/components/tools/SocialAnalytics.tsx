import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Calendar, BarChart3, PieChart, Target, Clock } from 'lucide-react';

interface PlatformData {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  growth: number;
  color: string;
  icon: string;
}

interface TimeSeriesData {
  date: string;
  instagram: number;
  facebook: number;
  twitter: number;
  linkedin: number;
}

interface TopPost {
  id: string;
  platform: string;
  content: string;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
  date: string;
}

const mockPlatformData: PlatformData[] = [
  {
    platform: 'Instagram',
    followers: 15420,
    engagement: 4.2,
    reach: 45600,
    impressions: 125000,
    likes: 2340,
    comments: 567,
    shares: 89,
    growth: 12.5,
    color: 'from-pink-500/20 to-purple-500/20 border-pink-500/50',
    icon: '📷'
  },
  {
    platform: 'Facebook',
    followers: 8930,
    engagement: 3.8,
    reach: 34200,
    impressions: 89000,
    likes: 1890,
    comments: 423,
    shares: 234,
    growth: 8.3,
    color: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
    icon: '📘'
  },
  {
    platform: 'Twitter',
    followers: 5670,
    engagement: 2.9,
    reach: 28900,
    impressions: 67000,
    likes: 1234,
    comments: 345,
    shares: 156,
    growth: 15.7,
    color: 'from-sky-500/20 to-blue-500/20 border-sky-500/50',
    icon: '🐦'
  },
  {
    platform: 'LinkedIn',
    followers: 3210,
    engagement: 5.1,
    reach: 19800,
    impressions: 45000,
    likes: 890,
    comments: 234,
    shares: 67,
    growth: 22.4,
    color: 'from-blue-600/20 to-blue-700/20 border-blue-600/50',
    icon: '💼'
  }
];

const mockTimeSeriesData: TimeSeriesData[] = [
  { date: 'Mon', instagram: 1200, facebook: 800, twitter: 600, linkedin: 400 },
  { date: 'Tue', instagram: 1400, facebook: 900, twitter: 700, linkedin: 450 },
  { date: 'Wed', instagram: 1600, facebook: 1100, twitter: 800, linkedin: 500 },
  { date: 'Thu', instagram: 1800, facebook: 1000, twitter: 900, linkedin: 550 },
  { date: 'Fri', instagram: 2100, facebook: 1300, twitter: 1100, linkedin: 600 },
  { date: 'Sat', instagram: 1900, facebook: 1200, twitter: 1000, linkedin: 580 },
  { date: 'Sun', instagram: 1700, facebook: 1000, twitter: 850, linkedin: 520 }
];

const mockTopPosts: TopPost[] = [
  {
    id: '1',
    platform: 'Instagram',
    content: 'Amazing sunset from our office! 🌅 #sunset #officeview',
    engagement: 892,
    likes: 567,
    comments: 234,
    shares: 91,
    date: '2024-01-15'
  },
  {
    id: '2',
    platform: 'Facebook',
    content: 'Thank you for helping us reach 10K followers! 🎉',
    engagement: 756,
    likes: 445,
    comments: 189,
    shares: 122,
    date: '2024-01-14'
  },
  {
    id: '3',
    platform: 'Twitter',
    content: 'Quick tip: Always engage with your audience in the first hour! #socialmedia',
    engagement: 634,
    likes: 345,
    comments: 123,
    shares: 166,
    date: '2024-01-13'
  },
  {
    id: '4',
    platform: 'LinkedIn',
    content: 'Professional development opportunity: Join our webinar!',
    engagement: 445,
    likes: 234,
    comments: 156,
    shares: 55,
    date: '2024-01-12'
  }
];

export default function SocialAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [platformData, setPlatformData] = useState<PlatformData[]>(mockPlatformData);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>(mockTimeSeriesData);
  const [topPosts, setTopPosts] = useState<TopPost[]>(mockTopPosts);

  const periods = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '1year', label: 'Last Year' }
  ];

  const calculateTotalMetrics = () => {
    return {
      totalFollowers: platformData.reduce((sum, p) => sum + p.followers, 0),
      avgEngagement: (platformData.reduce((sum, p) => sum + p.engagement, 0) / platformData.length).toFixed(1),
      totalReach: platformData.reduce((sum, p) => sum + p.reach, 0),
      totalImpressions: platformData.reduce((sum, p) => sum + p.impressions, 0),
      avgGrowth: (platformData.reduce((sum, p) => sum + p.growth, 0) / platformData.length).toFixed(1)
    };
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 5) return 'text-green-400';
    if (rate >= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGrowthColor = (rate: number) => {
    if (rate >= 15) return 'text-green-400';
    if (rate >= 8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const totalMetrics = calculateTotalMetrics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          Social Media Analytics
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Track your social media performance across all platforms with detailed analytics.
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-1 inline-flex">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                selectedPeriod === period.value
                  ? 'bg-primary text-black'
                  : 'text-ink/60 hover:text-ink'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold text-primary uppercase">Total Followers</p>
          </div>
          <p className="text-2xl font-display font-black text-ink">{formatNumber(totalMetrics.totalFollowers)}</p>
          <p className="text-xs text-green-400">+{totalMetrics.avgGrowth}%</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <p className="text-xs font-bold text-blue-400 uppercase">Avg Engagement</p>
          </div>
          <p className="text-2xl font-display font-black text-ink">{totalMetrics.avgEngagement}%</p>
          <p className="text-xs text-ink/60">Rate</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <p className="text-xs font-bold text-purple-400 uppercase">Total Reach</p>
          </div>
          <p className="text-2xl font-display font-black text-ink">{formatNumber(totalMetrics.totalReach)}</p>
          <p className="text-xs text-ink/60">Unique users</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-green-400" />
            <p className="text-xs font-bold text-green-400 uppercase">Impressions</p>
          </div>
          <p className="text-2xl font-display font-black text-ink">{formatNumber(totalMetrics.totalImpressions)}</p>
          <p className="text-xs text-ink/60">Total views</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-red-400" />
            <p className="text-xs font-bold text-red-400 uppercase">Total Likes</p>
          </div>
          <p className="text-2xl font-display font-black text-ink">{formatNumber(platformData.reduce((sum, p) => sum + p.likes, 0))}</p>
          <p className="text-xs text-ink/60">All platforms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <PieChart className="w-5 h-5 text-primary" />
              Platform Performance
            </h2>
            
            <div className="space-y-4">
              {platformData.map((platform) => (
                <div key={platform.platform} className={`p-4 bg-gradient-to-r ${platform.color} rounded-xl border`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platform.icon}</span>
                      <div>
                        <p className="font-bold text-ink">{platform.platform}</p>
                        <p className="text-sm text-ink/60">{formatNumber(platform.followers)} followers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getGrowthColor(platform.growth)}`}>
                        +{platform.growth}%
                      </p>
                      <p className="text-xs text-ink/60">growth</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-ink/60">Engagement</p>
                      <p className={`font-bold ${getEngagementColor(platform.engagement)}`}>
                        {platform.engagement}%
                      </p>
                    </div>
                    <div>
                      <p className="text-ink/60">Reach</p>
                      <p className="font-bold text-ink">{formatNumber(platform.reach)}</p>
                    </div>
                    <div>
                      <p className="text-ink/60">Likes</p>
                      <p className="font-bold text-ink">{formatNumber(platform.likes)}</p>
                    </div>
                    <div>
                      <p className="text-ink/60">Comments</p>
                      <p className="font-bold text-ink">{formatNumber(platform.comments)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Engagement Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              Weekly Engagement Trends
            </h2>
            
            <div className="space-y-4">
              {timeSeriesData.map((day, index) => (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-bold text-ink/60">{day.date}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-slate-800/50 rounded-full h-6 relative overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 to-purple-500"
                        style={{ width: `${(day.instagram / 2100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-ink/60 w-12">{day.instagram}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-slate-800/50 rounded-full h-6 relative overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        style={{ width: `${(day.facebook / 1300) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-ink/60 w-12">{day.facebook}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-6 mt-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded"></div>
                <span className="text-ink/60">Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                <span className="text-ink/60">Facebook</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Performing Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            Top Performing Posts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topPosts.map((post) => {
              const platform = platformData.find(p => p.platform === post.platform);
              return (
                <div key={post.id} className={`p-4 bg-gradient-to-r ${platform?.color} rounded-xl border`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{platform?.icon}</span>
                      <span className="text-sm font-bold text-ink">{post.platform}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{post.engagement} engagement</span>
                  </div>
                  
                  <p className="text-sm text-ink mb-3 line-clamp-2">{post.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-ink/60">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{formatNumber(post.comments)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      <span>{formatNumber(post.shares)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Analytics Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Analytics Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-ink/70">
            <div>
              <p className="font-bold text-blue-400 mb-2">📈 Growth Opportunities</p>
              <p>LinkedIn shows highest growth rate at 22.4%. Consider increasing posting frequency on this platform.</p>
            </div>
            <div>
              <p className="font-bold text-green-400 mb-2">🎯 Engagement Tips</p>
              <p>LinkedIn has the highest engagement rate at 5.1%. Focus on professional content during business hours.</p>
            </div>
            <div>
              <p className="font-bold text-purple-400 mb-2">⏰ Best Times</p>
              <p>Peak engagement occurs on Fridays. Schedule your most important content for mid-week to Friday.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
