import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getUserProfile, updateDayStreak, startSession, endSession } from '../firebase/services';
import { getCurrentUser } from '../firebase/authService';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [newAchievements, setNewAchievements] = useState([]);
  const sessionId   = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const u = getCurrentUser();
    if (!u) { setLoading(false); return; }

    setUser(u);

    const uid = u._id || u.uid || u.id;

    // Fetch profile silently
    getUserProfile(uid)
      .then(prof => { if (prof) setProfile(prof); })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Non-blocking side effects
    updateDayStreak(uid).catch(() => {});
    startSession(uid).then(id => { sessionId.current = id; }).catch(() => {});

    return () => {
      if (sessionId.current) {
        endSession(sessionId.current).catch(() => {});
      }
    };
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const uid = user._id || user.uid || user.id;
    const prof = await getUserProfile(uid);
    if (prof) setProfile(prof);
  };

  const markLoggedOut = () => {
    setUser(null);
    setProfile(null);
    if (sessionId.current) {
      endSession(sessionId.current).catch(() => {});
      sessionId.current = null;
    }
    initialized.current = false;
  };

  return (
    <UserContext.Provider value={{
      user, profile, loading,
      refreshProfile, setProfile,
      markLoggedOut,
      newAchievements,
      clearNewAchievements: () => setNewAchievements([]),
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}