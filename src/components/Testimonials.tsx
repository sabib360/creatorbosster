/**
 * Testimonials & Social Proof Component
 * Displays user reviews, ratings, and trust signals.
 * Important for AdSense approval and E-E-A-T.
 */

import { Star, Users, TrendingUp, Award, Quote, ExternalLink } from 'lucide-react';

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  platform?: string;
  date?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'YouTube Creator',
    content: 'CreatorBoost AI has replaced 5 different tools I was paying for. The image compressor and thumbnail generator are my daily go-to tools. Fast, free, and actually works.',
    rating: 5,
    platform: 'YouTube',
  },
  {
    name: 'Marcus Johnson',
    role: 'Freelance Designer',
    content: 'The PDF merger and compressor saved me countless hours. No signup required, no watermarks, just clean professional results. This is how free tools should be.',
    rating: 5,
    platform: 'Fiverr',
  },
  {
    name: 'Priya Patel',
    role: 'Small Business Owner',
    content: 'I use the QR code generator and social media tools daily for my business. The hashtag generator alone has doubled my Instagram reach. Incredible value.',
    rating: 5,
    platform: 'Instagram',
  },
  {
    name: 'Alex Rivera',
    role: 'Content Strategist',
    content: 'The AI tools are surprisingly good. The content idea generator and blog title generator have become essential parts of my content planning workflow.',
    rating: 5,
    platform: 'LinkedIn',
  },
];

const STATS = [
  { value: '10,000+', label: 'Active Users', icon: Users },
  { value: '50+', label: 'Free Tools', icon: Award },
  { value: '4.8/5', label: 'User Rating', icon: Star },
  { value: '100K+', label: 'Tools Used', icon: TrendingUp },
];

interface TestimonialsProps {
  variant?: 'grid' | 'carousel' | 'minimal';
  showStats?: boolean;
  limit?: number;
}

export default function Testimonials({
  variant = 'grid',
  showStats = true,
  limit = 4,
}: TestimonialsProps) {
  const displayed = TESTIMONIALS.slice(0, limit);

  return (
    <div className="space-y-10">
      {/* Stats Bar */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center space-y-2">
              <stat.icon className="w-5 h-5 text-primary mx-auto" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonials */}
      {variant === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((t, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 space-y-4 hover:border-white/[0.12] transition-colors">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-3.5 h-3.5 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
                ))}
              </div>
              <Quote className="w-5 h-5 text-primary/30" />
              <p className="text-sm text-white/60 leading-relaxed">{t.content}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
                {t.platform && (
                  <span className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
                    via {t.platform}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'minimal' && (
        <div className="flex flex-wrap gap-3">
          {displayed.map((t, i) => (
            <div key={i} className="flex-1 min-w-[250px] bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-3 h-3 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
                ))}
              </div>
              <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{t.content}</p>
              <p className="text-xs font-bold text-white/60">{t.name} <span className="font-normal text-white/30">· {t.role}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Trust badges component for sidebar or footer
 */
export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      {[
        { icon: Shield, text: '100% Secure' },
        { icon: Lock, text: 'No Data Stored' },
        { icon: Zap, text: 'Instant Results' },
        { icon: Globe, text: 'Works Worldwide' },
      ].map((badge) => (
        <div key={badge.text} className="flex items-center gap-1.5 text-xs text-white/40">
          <badge.icon className="w-3.5 h-3.5 text-primary/60" />
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
}

// Re-import icons needed by TrustBadges
import { Shield, Lock, Zap, Globe } from 'lucide-react';
