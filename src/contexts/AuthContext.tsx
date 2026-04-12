import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { getUserCredits, useCredit as useLocalCredit, LocalCredits } from '../lib/credits-client';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  credits_remaining: number;
  plan_id: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  localCredits: LocalCredits;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  consumeCredit: (count?: number) => Promise<{ success: boolean; reason?: string }>;
  refreshLocalCredits: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [localCredits, setLocalCredits] = useState<LocalCredits>(getUserCredits());
  const [loading, setLoading] = useState(true);

  const refreshLocalCredits = () => {
    setLocalCredits(getUserCredits());
  };

  useEffect(() => {
    // Listen for local credit updates
    const handleCreditsUpdate = () => {
      refreshLocalCredits();
    };
    window.addEventListener('creditsUpdated', handleCreditsUpdate);
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
          } else {
            const newProfile: Omit<UserProfile, 'uid'> = {
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Creator',
              photoURL: firebaseUser.photoURL || '',
              credits_remaining: 3,
              plan_id: 'free',
              role: 'user'
            };
            setDoc(userRef, newProfile).catch(err => handleFirestoreError(err, OperationType.CREATE, 'users'));
          }
          setLoading(false);
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        });

        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('creditsUpdated', handleCreditsUpdate);
    };
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      // Handle common auth errors gracefully
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          console.log("Login cancelled: Popup closed by user");
          break;
        case 'auth/cancelled-popup-request':
          console.log("Login cancelled: Multiple popup requests");
          break;
        case 'auth/popup-blocked':
          console.error("Login failed: Popup blocked by browser. Please allow popups for this site.");
          alert("Login popup was blocked by your browser. Please allow popups and try again.");
          break;
        default:
          console.error("Login failed:", error);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const consumeCredit = async (count = 1): Promise<{ success: boolean; reason?: string }> => {
    if (user && profile) {
      // Use account credits if logged in
      if (profile.credits_remaining < count) {
        return { success: false, reason: 'insufficient_credits' };
      }
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          credits_remaining: increment(-count)
        });
        return { success: true };
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        return { success: false, reason: 'server_error' };
      }
    } else {
      // Use local credits if not logged in
      const result = useLocalCredit(count);
      if (result.success) {
        refreshLocalCredits();
        return { success: true };
      }
      return { success: false, reason: result.reason };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      localCredits, 
      loading, 
      login, 
      logout, 
      consumeCredit,
      refreshLocalCredits 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
