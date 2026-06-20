import { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  layout?: string;
  className?: string;
  label?: string;
}

export default function AdBanner({
  slot = "1234567890",
  format = 'auto',
  layout,
  className = "",
  label = "Advertisement"
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('creatorboost_cookie_consent');
      if (stored) {
        const parsed = JSON.parse(stored);
        setHasConsent(parsed.level === 'all' || parsed.preferences?.advertising);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!hasConsent || !adRef.current) return;

    const currentAdRef = adRef.current;
    let isInitialized = false;

    const pushAd = () => {
      if (isInitialized || currentAdRef.getAttribute('data-adsbygoogle-status')) return;
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isInitialized = true;
      } catch (err: any) {
        if (err?.message?.includes('already have ads')) {
          isInitialized = true;
        }
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          pushAd();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(currentAdRef);

    return () => observer.disconnect();
  }, [hasConsent]);

  if (!hasConsent) {
    return (
      <div className={`my-6 flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 min-h-[100px] ${className}`}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Ad Placeholder</span>
      </div>
    );
  }

  return (
    <div className={`my-6 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 border-b border-white/10 pb-1">{label}</span>
      <ins
        ref={adRef}
        className="adsbygoogle w-full flex items-center justify-center rounded-xl min-h-[90px]"
        style={{
          display: isVisible ? 'block' : 'none',
          background: 'rgba(255,255,255,0.02)',
        }}
        data-ad-client="ca-pub-2121336720951736"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
      {!isVisible && (
        <div className="w-full flex items-center justify-center bg-white/[0.02] border border-white/[0.06] rounded-xl min-h-[90px]">
          <span className="text-white/20 text-xs font-bold">Loading ad...</span>
        </div>
      )}
    </div>
  );
}

/**
 * Ad container wrapper with proper spacing and label
 * Use this to wrap ad positions in your pages
 */
export function AdContainer({
  position,
  children,
  className = ''
}: {
  position: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`ad-container ad-${position} my-8 ${className}`}
      data-ad-position={position}
      aria-label={`Advertisement ${position}`}
    >
      {children || <AdBanner format="auto" />}
    </div>
  );
}
