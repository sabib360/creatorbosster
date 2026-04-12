import { useState, useEffect } from 'react';

export default function AdBlockerDetector() {
  const [isAdBlocked, setIsAdBlocked] = useState(false);

  useEffect(() => {
    const checkAdBlocker = async () => {
      try {
        // Attempt to fetch the AdSense script. Ad blockers typically block this request.
        await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD',
          mode: 'no-cors',
        });
      } catch (error) {
        setIsAdBlocked(true);
      }
    };
    
    // Small delay to ensure it runs after initial page load
    const timer = setTimeout(checkAdBlocker, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isAdBlocked) return null;

  return (
    <div className="bg-primary text-black brutal-border brutal-shadow-sm p-5 my-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h3 className="font-display font-black uppercase tracking-wider text-lg">⚠️ Ad Blocker Detected</h3>
        <p className="font-medium mt-1">
          We noticed you're using an ad blocker. Please support ThumbMagic by whitelisting us so we can keep this tool free!
        </p>
      </div>
      <button 
        onClick={() => setIsAdBlocked(false)}
        className="px-4 py-2 bg-black text-white font-bold uppercase text-sm rounded-lg whitespace-nowrap hover:bg-black/80 transition-colors"
      >
        I Understand
      </button>
    </div>
  );
}
