import { useState, useEffect } from 'react';
import { Play, Award, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface WatchAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  remainingAds: number;
}

export default function WatchAdModal({ isOpen, onClose, onComplete, remainingAds }: WatchAdModalProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds for demo

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatching && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (isWatching && timeLeft === 0) {
      setIsWatching(false);
      onComplete();
      onClose();
      setTimeLeft(10); // reset
    }
    return () => clearTimeout(timer);
  }, [isWatching, timeLeft, onComplete, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface brutal-border brutal-shadow-sm rounded-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-4 border-b-4 border-outline flex justify-between items-center bg-primary">
          <h2 className="font-display font-black uppercase tracking-wider flex items-center gap-2 text-black">
            <Award className="w-5 h-5" /> Earn Free Credits
          </h2>
          {!isWatching && (
            <button onClick={onClose} className="brutal-btn p-1 bg-surface rounded-md">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="p-6 flex flex-col items-center text-center">
          {isWatching ? (
            <div className="w-full aspect-video bg-black rounded-xl brutal-border flex flex-col items-center justify-center text-white mb-6">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
              <p className="font-display font-bold text-xl mb-1">Playing Advertisement...</p>
              <p className="text-primary font-black text-2xl">{timeLeft}s</p>
              <p className="text-sm opacity-70 mt-4">Please don't close this window</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-secondary rounded-full brutal-border flex items-center justify-center mb-4">
                <Play className="w-10 h-10 text-black ml-2" />
              </div>
              <p className="text-lg font-bold mb-2">Watch a short ad to earn 1 credit!</p>
              <p className="text-ink/70 font-medium mb-6">You can watch {remainingAds} more ads today.</p>
              
              <button 
                onClick={() => setIsWatching(true)}
                className="w-full bg-black text-white font-display font-bold uppercase tracking-wider py-4 rounded-xl brutal-btn hover:bg-neutral-800 flex items-center justify-center gap-2 text-lg"
              >
                <Play className="w-6 h-6 fill-white" /> Start Watching Ad
              </button>
            </>
          )}
        </div>
        
        {!isWatching && (
          <div className="grid grid-cols-3 gap-0 border-t-4 border-outline bg-white divide-x-4 divide-outline">
            <div className="p-3 text-center">
              <div className="font-black text-lg text-black">+1</div>
              <div className="text-xs font-bold uppercase text-ink/60">Credit</div>
            </div>
            <div className="p-3 text-center">
              <div className="font-black text-lg text-black">5/Day</div>
              <div className="text-xs font-bold uppercase text-ink/60">Max Ads</div>
            </div>
            <div className="p-3 text-center">
              <div className="font-black text-lg text-black">10s</div>
              <div className="text-xs font-bold uppercase text-ink/60">Duration</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
