import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  onAuthChange,
  getUserProfile,
  loginAnonymous,
  updateDayStreak,
  startSession,
  endSession,
  checkAndUnlockAchievements,
} from '../firebase/services';

const UserContext = createContext();

/**
 * Provides auth state + user profile (xp, stars, coins, streak, etc.)
 * across the entire app. Auto-signs in anonymously if no user,
 * UNLESS the user explicitly signed out (loggedOut ref = true).
 *
 * Also handles on-login:
 *   - Day streak update  (streaks collection)
 *   - Session tracking   (sessions collection)
 *   - Achievement checks (achievements + notifications collections)
 */
export function UserProvider({ children }) {
  const [user, setUser]       = useState(null);   // Firebase Auth user
  const [profile, setProfile] = useState(null);   // Firestore users/{uid}
  const [loading, setLoading] = useState(true);
  const [newAchievements, setNewAchievements] = useState([]); // badges just unlocked

  // Prevents auto-anonymous-login after an explicit logout
  const loggedOut  = useRef(false);
  // Tracks active session doc ID so we can close it on logout
  const sessionId  = useRef(null);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        loggedOut.current = false;
        setUser(firebaseUser);

        // 1. Fetch profile
        const prof = await getUserProfile(firebaseUser.uid);
        setProfile(prof);

        // 2. Update day streak
        updateDayStreak(firebaseUser.uid).catch(() => {});

        // 3. Start session tracking
        if (!sessionId.current) {
          startSession(firebaseUser.uid).then(id => { sessionId.current = id; }).catch(() => {});
        }

        // 4. Check achievement milestones (non-blocking)
        if (prof) {
          checkAndUnlockAchievements(firebaseUser.uid, prof).then(unlocks => {
            if (unlocks.length > 0) setNewAchievements(unlocks);
          }).catch(() => {});
        }

      } else if (!loggedOut.current) {
        // Auto sign in anonymously so the app always has a user
        try {
          await loginAnonymous();
        } catch (e) {
          console.error('Anonymous sign-in failed:', e);
        }
      } else {
        // Explicit logout — close session and stay signed out
        endSession(sessionId.current).catch(() => {});
        sessionId.current = null;
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /** Re-fetch profile from Firestore (call after awarding XP, etc.) */
  const refreshProfile = async () => {
    if (!user) return;
    const prof = await getUserProfile(user.uid);
    setProfile(prof);
    // Re-check achievements with updated profile
    if (prof) {
      checkAndUnlockAchievements(user.uid, prof).then(unlocks => {
        if (unlocks.length > 0) setNewAchievements(prev => [...prev, ...unlocks]);
      }).catch(() => {});
    }
  };

  /** Marks that the user explicitly signed out, so auto-login is skipped. */
  const markLoggedOut = () => {
    loggedOut.current = true;
  };

  /** Clear the new-achievement toast queue once shown */
  const clearNewAchievements = () => setNewAchievements([]);

  return (
    <UserContext.Provider value={{
      user, profile, loading,
      refreshProfile, setProfile,
      markLoggedOut,
      newAchievements, clearNewAchievements,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
