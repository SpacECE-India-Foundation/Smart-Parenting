import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  getChildProfiles,
  createChildProfile as createProfile,
  updateChildProfile as updateProfile,
  deleteChildProfile as deleteProfile,
} from '../api/childProfileService';

const ChildProfileContext = createContext(null);

export const useChildProfile = () => {
  const ctx = useContext(ChildProfileContext);
  if (!ctx) throw new Error('useChildProfile must be used within ChildProfileProvider');
  return ctx;
};

export const ChildProfileProvider = ({ children }) => {
  // Use stable uid string — NOT the whole currentUser object
  const { uid, userRole } = useAuth();

  const [childProfiles, setChildProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('spaceece_saved_child_profiles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeChild, setActiveChild]     = useState(null);
  const [loading, setLoading]             = useState(false);
  const fetchedUid = useRef(null);

  const loadProfiles = useCallback(async (forceUid) => {
    const targetUid = forceUid || uid;
    if (!targetUid || userRole !== 'parent') return;

    // Prevent duplicate fetches for same user
    if (fetchedUid.current === targetUid) return;
    fetchedUid.current = targetUid;

    setLoading(true);
    try {
      const { data, error } = await getChildProfiles(targetUid);
      if (!error && data) {
        setChildProfiles(data);
        localStorage.setItem('spaceece_saved_child_profiles', JSON.stringify(data));

        const savedId = localStorage.getItem('spaceece_active_child');
        if (savedId) {
          const saved = data.find(p => (p._id || p.id) === savedId);
          if (saved) setActiveChild(saved);
        }
      }
    } catch {}
    setLoading(false);
  }, [uid, userRole]);

  // Only re-run when uid STRING changes — not on every render
  useEffect(() => {
    if (uid && userRole === 'parent') {
      loadProfiles(uid);
    } else if (!uid) {
      // Logout parent/child — clear active child, but keep profiles cache
      setActiveChild(null);
      fetchedUid.current = null;
    }
  }, [uid, userRole]); // uid is a string — stable reference

  // Child role — set active child from token
  useEffect(() => {
    if (userRole === 'child' && uid) {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      if (u) setActiveChild(u);
    }
  }, [userRole, uid]);

  const selectChild = useCallback((child) => {
    setActiveChild(child);
    if (child) {
      localStorage.setItem('spaceece_active_child', child._id || child.id);
    } else {
      localStorage.removeItem('spaceece_active_child');
    }
  }, []);

  const createChildProfile = useCallback(async (data) => {
    if (!uid) return { error: 'Not authenticated' };
    const result = await createProfile(uid, data);
    if (!result.error) {
      fetchedUid.current = null;
      await loadProfiles(uid);
    }
    return result;
  }, [uid, loadProfiles]);

  const updateChildProfile = useCallback(async (profileId, data) => {
    const result = await updateProfile(profileId, data);
    if (!result.error) {
      setChildProfiles(prev => {
        const next = prev.map(p => ((p._id || p.id) === profileId ? { ...p, ...result.data } : p));
        localStorage.setItem('spaceece_saved_child_profiles', JSON.stringify(next));
        return next;
      });
      if (activeChild && (activeChild._id || activeChild.id) === profileId) {
        setActiveChild(prev => ({ ...prev, ...result.data }));
      }
    }
    return result;
  }, [activeChild]);

  const deleteChildProfile = useCallback(async (profileId) => {
    const result = await deleteProfile(profileId);
    if (!result.error) {
      setChildProfiles(prev => {
        const next = prev.filter(p => (p._id || p.id) !== profileId);
        localStorage.setItem('spaceece_saved_child_profiles', JSON.stringify(next));
        return next;
      });
      if (activeChild && (activeChild._id || activeChild.id) === profileId) {
        setActiveChild(null);
        localStorage.removeItem('spaceece_active_child');
      }
    }
    return result;
  }, [activeChild]);

  const switchChild = useCallback((profileId) => {
    const profile = childProfiles.find((p) => (p._id || p.id) === profileId);
    if (profile) {
      setActiveChild(profile);
      localStorage.setItem('spaceece_active_child', profileId);
    }
  }, [childProfiles]);

  return (
    <ChildProfileContext.Provider value={{
      childProfiles,
      activeChild,
      loading,
      selectChild,
      switchChild,
      loadProfiles,
      createChildProfile,
      updateChildProfile,
      deleteChildProfile,
    }}>
      {children}
    </ChildProfileContext.Provider>
  );
};