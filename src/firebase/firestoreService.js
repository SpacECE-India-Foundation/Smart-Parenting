import client from '../api/client';

// ── Users ───────────────────────────────────────────────────────────────────
export const getUserAccount = async (uid) => {
  try {
    const { data } = await client.get(`/users/${uid}`);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const updateUserAccount = async (uid, updates) => {
  try {
    const { data } = await client.put(`/users/${uid}`, updates);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const getAllUsers = async (filters = {}) => {
  try {
    const { data } = await client.get('/users', { params: filters });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

export const createUserAccount = async (uid, userData) => {
  try {
    const result = await client.put(`/users/${uid}`, userData);
    return { data: result.data?.data, error: null };
  } catch {
    return { data: null, error: null };
  }
};

export const deactivateUser = async (uid) => {
  try {
    await client.delete(`/users/${uid}`);
    return { error: null };
  } catch (e) {
    return { error: e.response?.data?.error || e.message };
  }
};

export const activateUser = async (uid) => {
  try {
    const { data } = await client.put(`/users/${uid}`, { is_active: true });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const changeUserRole = async (uid, role) => {
  try {
    const { data } = await client.put(`/users/${uid}`, { role });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

// ── Sessions ─────────────────────────────────────────────────────────────────
export const createSession = async () => {
  try {
    const { data } = await client.post('/sessions');
    return { sessionId: data.sessionId, error: null };
  } catch (e) {
    return { sessionId: null, error: e.response?.data?.error || e.message };
  }
};

export const endSession = async (sessionId) => {
  try {
    await client.put(`/sessions/${sessionId}/end`);
    return { error: null };
  } catch (e) {
    return { error: e.response?.data?.error || e.message };
  }
};

export const getActiveSessions = async () => {
  try {
    const { data } = await client.get('/sessions');
    const active = (data.data || []).filter(s => s.is_active);
    return { data: active, error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

export const getUserSessions = async (userId) => {
  try {
    const { data } = await client.get('/sessions', { params: { userId } });
    return { data: data.data || [], error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

// ── Scores ───────────────────────────────────────────────────────────────────
export const saveActivityScore = async (scoreData) => {
  try {
    const { data } = await client.post('/scores', scoreData);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const getActivityScores = async (childId, activityType = null) => {
  try {
    const params = { childId };
    if (activityType) params.activityType = activityType;
    const { data } = await client.get('/scores', { params });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

export const getLeaderboard = async () => {
  try {
    const { data } = await client.get('/scores/leaderboard');
    return { data: data.data, error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

export const getChildSummary = async (childId) => {
  try {
    const { data } = await client.get(`/scores/summary/${childId}`);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: {}, error: e.response?.data?.error || e.message };
  }
};

// ── Notifications (stubs) ─────────────────────────────────────────────────────
export const getNotifications = async () => ({ data: [], error: null });
export const getParentNotifications = async () => ({ data: [], error: null });
export const markNotificationAsRead = async () => ({ error: null });
export const getUnreadCount = async () => ({ count: 0, error: null });
export const subscribeToNotifications = (userId, callback) => { callback([]); return () => {}; };
export const getNotificationTemplates = async () => ({ data: [], error: null });
export const saveNotificationTemplate = async (data) => ({ data, error: null });
export const deleteNotificationTemplate = async () => ({ error: null });
export const toggleNotificationTemplate = async () => ({ error: null });

// ── Feature Flags ─────────────────────────────────────────────────────────────
export const subscribeToFeatureFlags = (callback) => {
  const flags = JSON.parse(localStorage.getItem('featureFlags') || '{}');
  callback(flags);
  return () => {};
};

export const saveFeatureFlags = async (flags) => {
  localStorage.setItem('featureFlags', JSON.stringify(flags));
  return { error: null };
};

// ── Utility helpers ───────────────────────────────────────────────────────────
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getInitials = (name = '') => {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
};

// ── Auth aliases ──────────────────────────────────────────────────────────────
export const loginWithEmail = async (email, password) => {
  try {
    const { data } = await client.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { user: data.user, error: null };
  } catch (e) {
    return { user: null, error: e.response?.data?.error || e.message };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const sendPasswordReset = async (email) => {
  try {
    const { data } = await client.post('/auth/forgot-password', { email });
    return { message: data.message, error: null };
  } catch (e) {
    return { message: null, error: e.response?.data?.error || e.message };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const { data } = await client.put('/auth/change-password', { currentPassword, newPassword });
    return { message: data.message, error: null };
  } catch (e) {
    return { message: null, error: e.response?.data?.error || e.message };
  }
};