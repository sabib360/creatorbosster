import { useAuth as useAuthContext } from '../contexts/AuthContext';

export type { UserProfile } from '../contexts/AuthContext';

export function useAuth() {
  return useAuthContext();
}
