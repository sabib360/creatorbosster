import { useEffect } from 'react';

export default function GoogleAdSense({ publisherId = "ca-pub-YOUR_PUB_ID" }: { publisherId?: string }) {
  useEffect(() => {
    // Prevent adding multiple scripts
    if (document.querySelector('script[src*="adsbygoogle.js"]')) return;

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    return () => {
      // Optional: remove script on unmount, but usually AdSense script stays globally
    };
  }, [publisherId]);

  return null;
}
