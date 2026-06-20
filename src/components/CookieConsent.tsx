import { useState, useEffect } from 'react';
import { Cookie, X, Settings, Check, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'creatorboost_cookie_consent';

type ConsentLevel = 'all' | 'essential' | 'none';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
}

const defaultPreferences: CookiePreferences = { essential: true, analytics: false, advertising: false };

function getStoredConsent(): { level: ConsentLevel; preferences: CookiePreferences } | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export function getCookieConsent(): ConsentLevel {
  const stored = getStoredConsent();
  return stored?.level || 'none';
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (level: ConsentLevel, prefs?: CookiePreferences) => {
    const finalPrefs = prefs || (level === 'all'
      ? { essential: true, analytics: true, advertising: true }
      : level === 'essential'
        ? { essential: true, analytics: false, advertising: false }
        : defaultPreferences);
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ level, preferences: finalPrefs, timestamp: Date.now() }));
    setVisible(false);
    setShowDetails(false);
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('cookieconsent', { detail: { level, preferences: finalPrefs } }));
  };

  const acceptAll = () => saveConsent('all');
  const rejectAll = () => saveConsent('none');
  const saveCustom = () => saveConsent(preferences.analytics || preferences.advertising ? 'all' : 'essential', preferences);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4" role="dialog" aria-label="Cookie consent">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={rejectAll} />

      {/* Banner */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 flex items-start gap-4">
          <div className="bg-primary/20 rounded-xl p-2.5 flex-shrink-0">
            <Cookie className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white">We Value Your Privacy</h2>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              We use cookies to enhance your experience, serve personalized ads through Google AdSense,
              and analyze site traffic via Google Analytics. You can customize your preferences below.
            </p>
          </div>
          <button
            onClick={rejectAll}
            className="text-gray-500 hover:text-white transition p-1"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cookie Details Toggle */}
        <div className="px-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition mb-4"
          >
            <Settings className="w-4 h-4" />
            Customize Cookie Preferences
            <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Detailed Preferences */}
        {showDetails && (
          <div className="px-6 pb-4 space-y-3">
            {/* Essential */}
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-white text-sm font-semibold">Essential Cookies</p>
                  <p className="text-gray-500 text-xs">Required for the site to function</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 bg-slate-700 px-2 py-1 rounded">Always On</span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">Analytics Cookies</p>
                  <p className="text-gray-500 text-xs">Google Analytics traffic analysis</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                className={`w-12 h-6 rounded-full transition-colors relative ${preferences.analytics ? 'bg-primary' : 'bg-slate-600'}`}
                aria-label="Toggle analytics cookies"
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Advertising */}
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-white text-sm font-semibold">Advertising Cookies</p>
                  <p className="text-gray-500 text-xs">Google AdSense personalized ads</p>
                </div>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, advertising: !preferences.advertising })}
                className={`w-12 h-6 rounded-full transition-colors relative ${preferences.advertising ? 'bg-primary' : 'bg-slate-600'}`}
                aria-label="Toggle advertising cookies"
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.advertising ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={rejectAll}
            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition border border-slate-600"
          >
            Reject All
          </button>
          {showDetails ? (
            <button
              onClick={saveCustom}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition border border-slate-600"
            >
              Save Preferences
            </button>
          ) : null}
          <button
            onClick={acceptAll}
            className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-black rounded-xl text-sm font-bold transition"
          >
            Accept All
          </button>
        </div>

        {/* Link to Cookie Policy */}
        <div className="px-6 pb-4 text-center">
          <Link to="/cookie-policy" className="text-xs text-gray-500 hover:text-primary transition underline">
            Read our Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
