import { useState, useEffect, useCallback } from 'react';
import { Mail, X, Check, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { validateEmail } from '../lib/email-service';

interface SubscriptionFormProps {
  variant?: 'popup' | 'inline' | 'exit-intent' | 'sidebar' | 'footer';
  showName?: boolean;
  showInterests?: boolean;
  onSuccess?: () => void;
}

const INTERESTS = [
  { id: 'youtube', label: 'YouTube Growth', icon: '🎬' },
  { id: 'blogging', label: 'Blogging', icon: '✍️' },
  { id: 'design', label: 'Design & Images', icon: '🎨' },
  { id: 'development', label: 'Development', icon: '💻' },
  { id: 'marketing', label: 'Digital Marketing', icon: '📊' },
  { id: 'ai-tools', label: 'AI Tools', icon: '🤖' },
];

export function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => {
      const lastDismissed = localStorage.getItem('newsletter_popup_dismissed');
      if (!lastDismissed || Date.now() - parseInt(lastDismissed) > 7 * 24 * 60 * 60 * 1000) {
        setShow(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('newsletter_popup_dismissed', Date.now().toString());
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
        <button onClick={dismiss} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <X className="w-5 h-5 text-ink/60" />
        </button>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-black uppercase tracking-tighter text-ink">Free Weekly Tips</h2>
          <p className="text-ink/60 text-sm">Join 10,000+ creators getting weekly tips on YouTube growth, content creation, and AI tools.</p>
          <NewsletterForm variant="popup" onSuccess={dismiss} />
        </div>
      </div>
    </div>
  );
}

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        const lastDismissed = localStorage.getItem('exit_popup_dismissed');
        if (!lastDismissed || Date.now() - parseInt(lastDismissed) > 30 * 24 * 60 * 60 * 1000) {
          setShow(true);
        }
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [dismissed]);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('exit_popup_dismissed', Date.now().toString());
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-primary/20 to-slate-900 border border-primary/30 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
        <button onClick={dismiss} className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <X className="w-5 h-5 text-ink/60" />
        </button>
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl font-display font-black uppercase tracking-tighter text-ink">Wait! Don't Go Empty-Handed</h2>
          <p className="text-ink/60 text-sm">Get our free Content Creator's Toolkit — 50+ tools, templates, and guides.</p>
          <NewsletterForm variant="exit-intent" onSuccess={dismiss} />
        </div>
      </div>
    </div>
  );
}

export function NewsletterForm({ variant = 'inline', showName = false, showInterests = false, onSuccess }: SubscriptionFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const toggleInterest = (id: string) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) { setError('Please enter a valid email'); return; }
    setError('');
    setStatus('loading');

    try {
      // Simulate API call to email service
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store subscription in localStorage for demo
      const subscribers = JSON.parse(localStorage.getItem('cb_subscribers') || '[]');
      subscribers.push({
        id: `sub_${Date.now()}`,
        email,
        name: name || undefined,
        interests,
        subscribedAt: new Date().toISOString(),
        status: 'active',
        source: variant,
      });
      localStorage.setItem('cb_subscribers', JSON.stringify(subscribers));

      setStatus('success');
      onSuccess?.();
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
        <Check className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <p className="text-green-400 font-bold text-sm">Welcome aboard! Check your inbox for a confirmation email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {showName && (
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-ink text-sm focus:outline-none focus:border-primary" />
      )}
      <div className="flex gap-2">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-ink text-sm focus:outline-none focus:border-primary" />
        <button type="submit" disabled={status === 'loading'} className="px-6 py-3 bg-primary text-black font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1">
          {status === 'loading' ? '...' : <><ArrowRight className="w-4 h-4" /> Subscribe</>}
        </button>
      </div>
      {showInterests && (
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(interest => (
            <button key={interest.id} type="button" onClick={() => toggleInterest(interest.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${interests.includes(interest.id) ? 'bg-primary text-black' : 'bg-slate-800 text-ink/60 hover:bg-slate-700'}`}>
              {interest.icon} {interest.label}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
      <p className="text-[10px] text-ink/40 text-center">No spam. Unsubscribe anytime. We respect your privacy.</p>
    </form>
  );
}

export function InlineNewsletter({ className = '' }: { className?: string }) {
  return (
    <div className={`p-6 bg-primary/5 border border-primary/20 rounded-2xl ${className}`}>
      <div className="flex items-start gap-4">
        <Mail className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-ink mb-1">Get Weekly Creator Tips</h3>
          <p className="text-ink/60 text-sm mb-4">Join 10,000+ creators. Free tools, tips, and strategies every week.</p>
          <NewsletterForm variant="inline" showInterests />
        </div>
      </div>
    </div>
  );
}

export function SidebarNewsletter() {
  return (
    <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
      <Mail className="w-6 h-6 text-primary" />
      <h3 className="font-bold text-ink text-sm uppercase tracking-widest">Newsletter</h3>
      <p className="text-ink/60 text-xs">Get weekly tips and tool updates.</p>
      <NewsletterForm variant="sidebar" />
    </div>
  );
}

export function FooterNewsletter() {
  return (
    <div className="max-w-md mx-auto text-center space-y-3">
      <Mail className="w-6 h-6 text-primary mx-auto" />
      <h3 className="font-bold text-ink">Stay Updated</h3>
      <NewsletterForm variant="footer" />
    </div>
  );
}

export function ToolSubscriptionPrompt({ toolName, toolUrl }: { toolName: string; toolUrl: string }) {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
      {subscribed ? (
        <div className="text-center">
          <Check className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-green-400 text-sm font-bold">Thanks! You'll receive tips for {toolName}.</p>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-ink text-sm font-bold">Get tips for {toolName}</p>
            <p className="text-ink/60 text-xs">Receive optimization tips via email.</p>
          </div>
          <NewsletterForm variant="inline" onSuccess={() => setSubscribed(true)} />
        </div>
      )}
    </div>
  );
}
