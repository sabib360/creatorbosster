import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layout?: string;
  className?: string;
}

export default function AdBanner({ slot = "1234567890", format = 'auto', layout, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const currentAdRef = adRef.current;
    let isInitialized = false;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        
        if (width > 0 && !isInitialized && !currentAdRef.getAttribute('data-adsbygoogle-status')) {
          try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isInitialized = true;
            observer.disconnect();
          } catch (err: any) {
            if (err.message && err.message.includes('already have ads')) {
              isInitialized = true;
              observer.disconnect();
              return;
            }
            console.error('AdSense error:', err);
          }
        }
      }
    });

    observer.observe(currentAdRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`ad-container my-4 flex flex-col items-center justify-center bg-surface brutal-border brutal-shadow-sm rounded-xl p-4 ${className}`}>
      <span className="text-xs font-display font-black uppercase tracking-widest mb-2 text-ink/50 border-b border-ink/20">Advertisement</span>
      <ins
        ref={adRef}
        className="adsbygoogle w-full flex items-center justify-center bg-base/50 rounded min-h-[90px]"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUB_ID"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { 'data-ad-layout': layout } : {})}
      >
        <span className="text-ink/30 font-bold text-sm">Ad Space ({format})</span>
      </ins>
    </div>
  );
}
