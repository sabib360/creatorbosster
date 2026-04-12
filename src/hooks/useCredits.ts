import { useAuth } from './useAuth';

export function useCredits() {
  const { profile, user, localCredits, consumeCredit } = useAuth();

  const credits = user && profile ? profile.credits_remaining : localCredits.available;
  const adsWatchedToday = user && profile ? 0 : localCredits.adsWatchedToday; // Server-side ad tracking not implemented yet
  const maxAdsPerDay = 5;

  return {
    credits,
    adsWatchedToday,
    maxAdsPerDay,
    useCredit: consumeCredit,
    isLoading: !profile && !!user
  };
}
