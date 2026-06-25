import client from '../api/client';

const saveSession = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ── Register ───────────────────────────────────────────────────────────────
export const registerUser = async (email, password, displayName = '', role = 'parent') => {
  try {
    const { data } = await client.post('/auth/register', { email, password, displayName, role });
    saveSession(data.token, data.user);
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err.response?.data?.error || err.message };
  }
};

export const registerWithEmail = async (email, password, displayName) => {
  return registerUser(email, password, displayName, 'parent');
};

// ── Login ──────────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  try {
    const { data } = await client.post('/auth/login', { email, password });
    saveSession(data.token, data.user);
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err.response?.data?.error || err.message };
  }
};

export const loginWithEmail = loginUser;

// ── Google Sign-In ─────────────────────────────────────────────────────────
export const loginWithGoogle = (role = 'parent') => {
  return new Promise((resolve) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === 'your_google_client_id_here') {
      resolve({
        user: null,
        error: 'Google Client ID not configured. Add VITE_GOOGLE_CLIENT_ID to your .env file.',
      });
      return;
    }

    const initGoogle = () => {
      // Guard: prevent multiple initialize() calls
      if (!window._googleInitialized) {
        window._googleInitialized = true;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const { data } = await client.post('/auth/google', {
                idToken: response.credential,
                role,
              });
              saveSession(data.token, data.user);
              resolve({ user: data.user, error: null });
            } catch (err) {
              resolve({ user: null, error: err.response?.data?.error || err.message });
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          resolve({
            user: null,
            error: 'Google Sign-In was closed. Please try again.',
          });
        }
      });
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      script.onerror = () =>
        resolve({ user: null, error: 'Failed to load Google Sign-In. Check your internet connection.' });
      document.head.appendChild(script);
    }
  });
};

// ── Child PIN login ────────────────────────────────────────────────────────
export const loginChild = async (profileId, pin = null) => {
  try {
    const { data } = await client.post('/auth/child-login', { profileId, pin });
    saveSession(data.token, data.profile);
    return { profile: data.profile, error: null };
  } catch (err) {
    return { profile: null, error: err.response?.data?.error || err.message };
  }
};

// ── Logout ─────────────────────────────────────────────────────────────────
export const logoutUser = async () => {
  if (window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect();
    window._googleInitialized = false;
  }
  try {
    await client.post('/auth/logout');
  } catch {}
  finally {
    clearSession();
  }
  return { error: null };
};

export const logout = logoutUser;

// ── Get current user ───────────────────────────────────────────────────────
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const { data } = await client.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(data.user));
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err.response?.data?.error || err.message };
  }
};

export const isAuthenticated = () => !!localStorage.getItem('token');

// ── Password ───────────────────────────────────────────────────────────────
export const sendPasswordReset = async (email) => {
  try {
    const { data } = await client.post('/auth/forgot-password', { email });
    return { message: data.message, error: null };
  } catch (err) {
    return { message: null, error: err.response?.data?.error || err.message };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const { data } = await client.put('/auth/change-password', { currentPassword, newPassword });
    return { message: data.message, error: null };
  } catch (err) {
    return { message: null, error: err.response?.data?.error || err.message };
  }
};

// ── Stubs ──────────────────────────────────────────────────────────────────
export const sendVerificationEmail = async () => ({ message: 'Managed server-side.', error: null });
export const reloadUser            = async () => ({ error: null });
export const changeEmail           = async () => ({ message: 'Contact support to change email.', error: null });