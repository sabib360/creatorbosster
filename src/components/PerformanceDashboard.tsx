/**
 * CreatorBoost AI — Performance Dashboard
 * Real-time Core Web Vitals monitoring and reporting
 * Shows in admin dashboard
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, Layout, AlertTriangle, CheckCircle, XCircle, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import { onMetric, getMetrics, generateReport, getResourceTimings, getLayoutShiftScore, type PerformanceMetric } from '../lib/perf-monitor';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

interface MetricCardProps {
  name: string;
  value: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  description: string;
  icon: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════════
// METRIC CARD
// ═══════════════════════════════════════════════════════════════════

function MetricCard({ name, value, unit, rating, description, icon }: MetricCardProps) {
  const ratingConfig = {
    good: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
    'needs-improvement': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
    poor: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
  };

  const config = ratingConfig[rating];
  const RatingIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-white/[0.03] border ${config.border} ${config.bg}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white">{name}</h3>
          <p className="text-xs text-white/40">{description}</p>
        </div>
        <RatingIcon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-bold ${config.color}`}>
          {rating === 'good' ? '✓' : rating === 'needs-improvement' ? '~' : '✗'} {Math.round(value)}
        </span>
        <span className="text-xs text-white/40 mb-1">{unit}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [resources, setResources] = useState<Array<{ name: string; duration: number; transferSize: number; type: string }>>([]);
  const [clsScore, setClsScore] = useState({ value: 0, entries: 0 });

  useEffect(() => {
    // Listen for new metrics
    const unsubscribe = onMetric((metric) => {
      setMetrics((prev) => {
        const exists = prev.findIndex((m) => m.name === metric.name);
        if (exists >= 0) {
          const updated = [...prev];
          updated[exists] = metric;
          return updated;
        }
        return [...prev, metric];
      });
    });

    // Get existing metrics
    setMetrics(getMetrics());
    setResources(getResourceTimings());
    setClsScore(getLayoutShiftScore());

    return unsubscribe;
  }, []);

  const refreshData = () => {
    setMetrics(getMetrics());
    setResources(getResourceTimings());
    setClsScore(getLayoutShiftScore());
  };

  const lcp = metrics.find((m) => m.name === 'LCP');
  const cls = metrics.find((m) => m.name === 'CLS');
  const inp = metrics.find((m) => m.name === 'INP');
  const fcp = metrics.find((m) => m.name === 'FCP');
  const ttfb = metrics.find((m) => m.name === 'TTFB');

  const overallScore =
    metrics.length > 0
      ? Math.round(
          metrics.reduce((acc, m) => {
            const score = m.rating === 'good' ? 100 : m.rating === 'needs-improvement' ? 50 : 0;
            return acc + score;
          }, 0) / metrics.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Performance Dashboard</h2>
          <p className="text-sm text-white/40">Real-time Core Web Vitals monitoring</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-white/60 hover:text-white transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Overall Score */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-500/10 to-cyan-500/10 border border-brand-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center">
            <Activity className="w-8 h-8 text-brand-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{overallScore}</span>
              <span className="text-sm text-white/40">/ 100</span>
            </div>
            <p className="text-sm text-white/40">Overall Performance Score</p>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          name="LCP"
          value={lcp?.value || 0}
          unit="ms"
          rating={lcp?.rating || 'good'}
          description="Largest Contentful Paint"
          icon={<Zap className="w-4 h-4 text-brand-400" />}
        />
        <MetricCard
          name="CLS"
          value={cls?.value || 0}
          unit=""
          rating={cls?.rating || 'good'}
          description="Cumulative Layout Shift"
          icon={<Layout className="w-4 h-4 text-cyan-400" />}
        />
        <MetricCard
          name="INP"
          value={inp?.value || 0}
          unit="ms"
          rating={inp?.rating || 'good'}
          description="Interaction to Next Paint"
          icon={<Clock className="w-4 h-4 text-emerald-400" />}
        />
        <MetricCard
          name="FCP"
          value={fcp?.value || 0}
          unit="ms"
          rating={fcp?.rating || 'good'}
          description="First Contentful Paint"
          icon={<TrendingUp className="w-4 h-4 text-amber-400" />}
        />
        <MetricCard
          name="TTFB"
          value={ttfb?.value || 0}
          unit="ms"
          rating={ttfb?.rating || 'good'}
          description="Time to First Byte"
          icon={<BarChart3 className="w-4 h-4 text-purple-400" />}
        />
        <MetricCard
          name="CLS Score"
          value={clsScore.value}
          unit={`(${clsScore.entries} entries)`}
          rating={clsScore.value < 0.1 ? 'good' : clsScore.value < 0.25 ? 'needs-improvement' : 'poor'}
          description="Layout Shift Score"
          icon={<Layout className="w-4 h-4 text-pink-400" />}
        />
      </div>

      {/* Resource Timing */}
      {resources.length > 0 && (
        <div>
          <h3 className="text-lg font-display font-bold text-white mb-4">Top Resources by Duration</h3>
          <div className="space-y-2">
            {resources.slice(0, 10).map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.name}</p>
                  <p className="text-xs text-white/40">{r.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{Math.round(r.duration)}ms</p>
                  <p className="text-xs text-white/40">{(r.transferSize / 1024).toFixed(1)}KB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Metrics */}
      {metrics.length > 0 && (
        <div>
          <h3 className="text-lg font-display font-bold text-white mb-4">All Collected Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/40 border-b border-white/[0.06]">
                  <th className="pb-3 font-medium">Metric</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium">Rating</th>
                  <th className="pb-3 font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, i) => (
                  <tr key={i} className="border-b border-white/[0.04]">
                    <td className="py-3 font-medium text-white">{m.name}</td>
                    <td className="py-3 text-white/60">{Math.round(m.value)}{m.name.includes('CLS') ? '' : 'ms'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        m.rating === 'good' ? 'bg-emerald-500/10 text-emerald-400' :
                        m.rating === 'needs-improvement' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {m.rating}
                      </span>
                    </td>
                    <td className="py-3 text-white/40">{Math.round(m.delta)}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
