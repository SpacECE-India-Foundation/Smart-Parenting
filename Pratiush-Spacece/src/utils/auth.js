// Firebase Auth helpers — with localStorage fallback when Firebase is not configured
import { FIREBASE_ENABLED } from '../firebase';

const AUTH_KEY = 'spacece_auth_user';

// ---- Anonymous Auth ----
export async function signInAnonymously() {
  if (FIREBASE_ENABLED) {
    try {
      const { getAuth, signInAnonymously: fbSignIn } = await import('firebase/auth');
      const auth = getAuth();
      const result = await fbSignIn(auth);
      return { uid: result.user.uid, isAnonymous: true };
    } catch (e) {
      console.warn('Firebase anonymous auth failed:', e);
    }
  }
  // LocalStorage fallback
  let user = getLocalUser();
  if (!user) {
    user = { uid: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`, isAnonymous: true };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
  return user;
}

// ---- Email Link (upgrade anonymous to email) ----
export async function linkWithEmail(email, password) {
  if (FIREBASE_ENABLED) {
    try {
      const { getAuth, EmailAuthProvider, linkWithCredential } = await import('firebase/auth');
      const auth = getAuth();
      const credential = EmailAuthProvider.credential(email, password);
      const result = await linkWithCredential(auth.currentUser, credential);
      return { uid: result.user.uid, email, isAnonymous: false };
    } catch (e) {
      console.warn('Firebase email link failed:', e);
      throw e;
    }
  }
  // LocalStorage fallback
  const user = getLocalUser() || {};
  const updated = { ...user, email, isAnonymous: false };
  localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
  return updated;
}

// ---- Sign Out ----
export async function signOut() {
  if (FIREBASE_ENABLED) {
    try {
      const { getAuth } = await import('firebase/auth');
      await getAuth().signOut();
    } catch (e) {
      console.warn('Firebase signout failed:', e);
    }
  }
  localStorage.removeItem(AUTH_KEY);
}

// ---- Auth State Observer ----
export function onAuthChange(callback) {
  if (FIREBASE_ENABLED) {
    import('firebase/auth').then(({ getAuth, onAuthStateChanged }) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        callback(user ? { uid: user.uid, email: user.email, isAnonymous: user.isAnonymous } : null);
      });
    }).catch(() => {
      callback(getLocalUser());
    });
  } else {
    // Immediate callback with localStorage user
    callback(getLocalUser());
  }
}

// ---- Get current auth user ----
export function getCurrentAuthUser() {
  if (FIREBASE_ENABLED) {
    try {
      // Synchronous check — may be null if auth hasn't loaded yet
      return null; // Use onAuthChange for reactive checks
    } catch { return null; }
  }
  return getLocalUser();
}

function getLocalUser() {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}
