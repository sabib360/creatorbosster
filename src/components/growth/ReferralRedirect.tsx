/**
 * CreatorBoost AI — Referral Redirect Handler
 * Captures referral click and redirects to homepage
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackReferralClick } from '../../lib/referral';

export default function ReferralRedirect() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      trackReferralClick(code).catch(() => {});
    }
    navigate('/', { replace: true });
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-white/40">Redirecting...</p>
      </div>
    </div>
  );
}
