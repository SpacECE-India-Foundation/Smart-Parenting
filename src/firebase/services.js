import client from '../api/client';

// ── Math Games ──────────────────────────────────────────────────────────────
export const getMathGames = async (difficulty = null) => {
  try {
    const params = difficulty ? { difficulty } : {};
    const { data } = await client.get('/numeracy/math', { params });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

export const addMathGame = async (gameData) => {
  try {
    const { data } = await client.post('/numeracy/math', gameData);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const updateMathGame = async (id, updates) => {
  try {
    const { data } = await client.put(`/numeracy/math/${id}`, updates);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const deleteMathGame = async (id) => {
  try {
    await client.delete(`/numeracy/math/${id}`);
    return { error: null };
  } catch (e) {
    return { error: e.response?.data?.error || e.message };
  }
};

// ── Puzzle Games ────────────────────────────────────────────────────────────
export const getPuzzleGames = async (difficulty = null) => {
  try {
    const params = difficulty ? { difficulty } : {};
    const { data } = await client.get('/numeracy/puzzles', { params });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

export const addPuzzleGame = async (gameData) => {
  try {
    const { data } = await client.post('/numeracy/puzzles', gameData);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const updatePuzzleGame = async (id, updates) => {
  try {
    const { data } = await client.put(`/numeracy/puzzles/${id}`, updates);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const deletePuzzleGame = async (id) => {
  try {
    await client.delete(`/numeracy/puzzles/${id}`);
    return { error: null };
  } catch (e) {
    return { error: e.response?.data?.error || e.message };
  }
};

// ── Logic Games ─────────────────────────────────────────────────────────────
export const getLogicGames = async (difficulty = null) => {
  try {
    const params = difficulty ? { difficulty } : {};
    const { data } = await client.get('/numeracy/logic', { params });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

export const addLogicGame = async (gameData) => {
  try {
    const { data } = await client.post('/numeracy/logic', gameData);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const updateLogicGame = async (id, updates) => {
  try {
    const { data } = await client.put(`/numeracy/logic/${id}`, updates);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const deleteLogicGame = async (id) => {
  try {
    await client.delete(`/numeracy/logic/${id}`);
    return { error: null };
  } catch (e) {
    return { error: e.response?.data?.error || e.message };
  }
};

// ── Numeracy Scores ─────────────────────────────────────────────────────────
export const saveNumeracyScore = async (scoreData) => {
  try {
    const { data } = await client.post('/scores', { ...scoreData, activity_type: scoreData.activity_type || 'numeracy' });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const getNumeracyScores = async (childId) => {
  try {
    const { data } = await client.get('/scores', { params: { childId, activityType: 'numeracy' } });
    return { data: data.data, error: null };
  } catch (e) {
    return { data: [], error: e.response?.data?.error || e.message };
  }
};

// ── Auth & Session ──────────────────────────────────────────────────────────
export const onAuthChange = (callback) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  setTimeout(() => callback(user), 0);
  return () => {};
};

export const getUserProfile = async (uid) => {
  try {
    const { data } = await client.get(`/children/${uid}`);
    if (data?.data) return data.data;
  } catch {}
  try {
    const { data } = await client.get(`/users/${uid}`);
    return data?.data || null;
  } catch {
    return null;
  }
};

export const loginAnonymous = async () => {
  return { uid: 'guest', role: 'guest', displayName: 'Guest' };
};

export const updateDayStreak = async (userId) => {
  try {
    const { data } = await client.post(`/literacy/streaks/${userId}/mark-today`);
    return data.count || 0;
  } catch {
    return 0;
  }
};

export const startSession = async (userId) => {
  try {
    const { data } = await client.post('/sessions');
    return data.sessionId;
  } catch {
    return null;
  }
};

export const endSession = async (sessionId) => {
  if (!sessionId) return;
  try {
    await client.put(`/sessions/${sessionId}/end`);
  } catch {}
};

export const checkAndUnlockAchievements = async (userId, profile) => {
  return [];
};

// ── Child profile & user updates ────────────────────────────────────────────
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data } = await client.put(`/children/${userId}`, updates);
    if (data?.data) return { data: data.data, error: null };
  } catch {}
  try {
    const { data } = await client.put(`/users/${userId}`, updates);
    return { data: data.data, error: null };
  } catch (e) {
    return { data: null, error: e.response?.data?.error || e.message };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const awardProgress = async (userId, { xp = 0, stars = 0, coins = 0 } = {}) => {
  try {
    await client.put(`/children/${userId}`, { xp, stars, coins });
    return { error: null };
  } catch {
    return { error: null };
  }
};

export const getUnlockedAchievements = async (userId) => {
  try {
    const { data } = await client.get('/scores', { params: { childId: userId } });
    const scores = data.data || [];
    const achievements = [];
    if (scores.length >= 1)  achievements.push({ id: 'first_game', title: 'First Game!',   icon: '🎮', unlocked: true });
    if (scores.length >= 5)  achievements.push({ id: 'five_games', title: 'Playing Strong', icon: '⭐', unlocked: true });
    if (scores.length >= 10) achievements.push({ id: 'ten_games',  title: 'Game Master',    icon: '🏆', unlocked: true });
    const total = scores.reduce((s, a) => s + (a.score || 0), 0);
    if (total >= 100) achievements.push({ id: 'score_100', title: 'Century!',     icon: '💯', unlocked: true });
    if (total >= 500) achievements.push({ id: 'score_500', title: 'High Scorer',  icon: '🚀', unlocked: true });
    return { data: achievements, error: null };
  } catch {
    return { data: [], error: null };
  }
};