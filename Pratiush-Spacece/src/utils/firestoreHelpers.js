// ---- localStorage helpers ----
function lsGet(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function lsRemove(key) {
  localStorage.removeItem(key);
}

// Firebase Firestore write - saves to both Firestore and localStorage
async function firestoreWrite(collection, docId, data) {
  try {
    const { FIREBASE_ENABLED, getDb } = await import('../firebase.js');
    if (!FIREBASE_ENABLED) return;
    
    const db = getDb();
    if (!db) return;
    
    const { setDoc, doc } = await import('firebase/firestore');
    await setDoc(doc(db, collection, docId), data, { merge: true });
    console.log(`✅ Saved to Firestore: ${collection}/${docId}`);
  } catch (error) {
    console.warn('Firestore write failed, using localStorage only:', error);
  }
}

// Firebase Firestore read - attempts to read from Firestore, falls back to localStorage
async function firestoreRead(collection, docId) {
  try {
    const { FIREBASE_ENABLED, getDb } = await import('../firebase.js');
    if (!FIREBASE_ENABLED) return null;
    
    const db = getDb();
    if (!db) return null;
    
    const { getDoc, doc } = await import('firebase/firestore');
    const docSnap = await getDoc(doc(db, collection, docId));
    if (docSnap.exists()) {
      console.log(`✅ Loaded from Firestore: ${collection}/${docId}`);
      return docSnap.data();
    }
  } catch (error) {
    console.warn('Firestore read failed, using localStorage:', error);
  }
  return null;
}

// ==============================
// ---- Child Profiles ----
// ==============================
export async function saveChildProfile(profile) {
  const id = profile.id || `child_${Date.now()}`;
  const data = { ...profile, id, updatedAt: Date.now() };
  await firestoreWrite('child_profiles', id, data);
  lsSet(`child_profile_${id}`, data);
  lsSet('current_child_id', id);

  // Track in profile list
  const list = getAllChildIds();
  if (!list.includes(id)) {
    list.push(id);
    lsSet('child_profile_ids', list);
  }
  return data;
}

export function getCurrentChildId() {
  return lsGet('current_child_id');
}

export async function getChildProfile(id) {
  const childId = id || getCurrentChildId();
  if (!childId) return null;
  
  // Try Firestore first
  const fsData = await firestoreRead('child_profiles', childId);
  if (fsData) {
    lsSet(`child_profile_${childId}`, fsData); // Cache locally
    return fsData;
  }
  
  // Fallback to localStorage
  return lsGet(`child_profile_${childId}`);
}

export function getAllChildIds() {
  return lsGet('child_profile_ids', []);
}

export function getAllChildProfiles() {
  return getAllChildIds().map(id => getChildProfile(id)).filter(Boolean);
}

export function switchChildProfile(childId) {
  lsSet('current_child_id', childId);
}

export function deleteChildProfile(childId) {
  lsRemove(`child_profile_${childId}`);
  lsRemove(`avatar_${childId}`);
  lsRemove(`achievements_${childId}`);
  lsRemove(`zones_${childId}`);
  lsRemove(`child_rewards_${childId}`);
  const list = getAllChildIds().filter(id => id !== childId);
  lsSet('child_profile_ids', list);
  // Switch to another profile if this was active
  if (getCurrentChildId() === childId) {
    lsSet('current_child_id', list[0] || null);
  }
}

// ==============================
// ---- Avatars ----
// ==============================
export async function saveAvatar(childId, avatarData) {
  const data = { ...avatarData, childId, updatedAt: Date.now() };
  await firestoreWrite('avatars', childId, data);
  lsSet(`avatar_${childId}`, data);
  return data;
}

export async function getAvatar(childId) {
  const id = childId || getCurrentChildId();
  if (!id) return null;
  
  // Try Firestore first
  const fsData = await firestoreRead('avatars', id);
  if (fsData) {
    lsSet(`avatar_${id}`, fsData); // Cache locally
    return fsData;
  }
  
  // Fallback to localStorage
  return lsGet(`avatar_${id}`);
}

// ==============================
// ---- Achievements ----
// ==============================
export async function getAchievements(childId) {
  const id = childId || getCurrentChildId();
  if (!id) {
    return {
      badges: [],
      trophies: [],
      totalStars: 0,
      totalCoins: 50
    };
  }
  
  // Try Firestore first
  const fsData = await firestoreRead('achievements', id);
  if (fsData) {
    lsSet(`achievements_${id}`, fsData); // Cache locally
    return fsData;
  }
  
  // Fallback to localStorage
  return lsGet(`achievements_${id}`, {
    badges: [],
    trophies: [],
    totalStars: 0,
    totalCoins: 50
  });
}

export async function saveAchievements(childId, achievements) {
  const id = childId || getCurrentChildId();
  await firestoreWrite('achievements', id, achievements);
  lsSet(`achievements_${id}`, achievements);
}

export async function unlockBadge(childId, badgeId) {
  const achievements = getAchievements(childId);
  if (!achievements.badges.includes(badgeId)) {
    achievements.badges.push(badgeId);
    achievements.totalStars += 5;
    achievements.totalCoins += 10;
    await saveAchievements(childId, achievements);
  }
  return achievements;
}

// ==============================
// ---- Daily Challenge ----
// ==============================
const DEFAULT_CHALLENGES = [
  { id: 'dc1', title: 'Letter Safari', desc: 'Find 5 letters hidden in the jungle!', icon: '🔤', difficulty: 2, xp: 30, zone: 'literacy' },
  { id: 'dc2', title: 'Number Crunch', desc: 'Solve 3 fun math puzzles!', icon: '🔢', difficulty: 2, xp: 25, zone: 'math' },
  { id: 'dc3', title: 'Color Mix Lab', desc: 'Mix colors to create something new!', icon: '🎨', difficulty: 1, xp: 20, zone: 'creative' },
  { id: 'dc4', title: 'Feeling Finder', desc: 'Match emotions to faces!', icon: '😊', difficulty: 1, xp: 20, zone: 'emotion' },
  { id: 'dc5', title: 'Shape Builder', desc: 'Build shapes from blocks!', icon: '🔷', difficulty: 3, xp: 35, zone: 'math' },
  { id: 'dc6', title: 'Story Time', desc: 'Complete a story with missing words!', icon: '📖', difficulty: 2, xp: 30, zone: 'literacy' },
  { id: 'dc7', title: 'Rhythm Beats', desc: 'Tap along to the rhythm!', icon: '🥁', difficulty: 1, xp: 20, zone: 'creative' },
];

export function getDailyChallenge() {
  const challenges = lsGet('admin_challenges', DEFAULT_CHALLENGES);
  const dayIndex = Math.floor(Date.now() / 86400000) % challenges.length;
  return challenges[dayIndex];
}

export function getAllChallenges() {
  return lsGet('admin_challenges', DEFAULT_CHALLENGES);
}

export function saveChallenges(challenges) {
  lsSet('admin_challenges', challenges);
}

export function addChallenge(challenge) {
  const list = getAllChallenges();
  list.push({ ...challenge, id: `dc_${Date.now()}` });
  saveChallenges(list);
  return list;
}

export function updateChallenge(challengeId, data) {
  const list = getAllChallenges().map(c => c.id === challengeId ? { ...c, ...data } : c);
  saveChallenges(list);
  return list;
}

export function deleteChallenge(challengeId) {
  const list = getAllChallenges().filter(c => c.id !== challengeId);
  saveChallenges(list);
  return list;
}

// ==============================
// ---- Recommendations ----
// ==============================
export function getRecommendations() {
  return [
    { id: 'r1', title: 'Phonics Fun', desc: 'Learn letter sounds with songs', icon: '🎵', zone: 'literacy', time: '5 min', difficulty: 1 },
    { id: 'r2', title: 'Counting Stars', desc: 'Count objects in space', icon: '⭐', zone: 'math', time: '4 min', difficulty: 1 },
    { id: 'r3', title: 'Draw & Discover', desc: 'Draw animals and learn facts', icon: '✏️', zone: 'creative', time: '8 min', difficulty: 2 },
    { id: 'r4', title: 'Puzzle Planet', desc: 'Solve jigsaw puzzles', icon: '🧩', zone: 'brain', time: '6 min', difficulty: 2 },
  ];
}

// ==============================
// ---- Adventure Zones ----
// ==============================
export function getZoneProgress(childId) {
  return lsGet(`zones_${childId || getCurrentChildId()}`, {
    literacy: { completed: 2, total: 8, unlocked: true, xp: 120 },
    math: { completed: 1, total: 8, unlocked: true, xp: 60 },
    brain: { completed: 0, total: 6, unlocked: true, xp: 0 },
    creative: { completed: 0, total: 6, unlocked: false, xp: 0 },
    emotion: { completed: 0, total: 5, unlocked: false, xp: 0 },
  });
}

export async function saveZoneProgress(childId, zones) {
  const id = childId || getCurrentChildId();
  lsSet(`zones_${id}`, zones);
}

// ==============================
// ---- Rewards System ----
// ==============================
const DEFAULT_REWARDS = [
  { item_id: 'h1', name: 'Top Hat', emoji: '🎩', coin_cost: 0, category: 'hats', sort_order: 1 },
  { item_id: 'h2', name: 'Crown', emoji: '👑', coin_cost: 20, category: 'hats', sort_order: 2 },
  { item_id: 'h3', name: 'Grad Cap', emoji: '🎓', coin_cost: 15, category: 'hats', sort_order: 3 },
  { item_id: 'h4', name: 'Helmet', emoji: '🪖', coin_cost: 10, category: 'hats', sort_order: 4 },
  { item_id: 'h5', name: 'Bow', emoji: '🎀', coin_cost: 5, category: 'hats', sort_order: 5 },
  { item_id: 'h6', name: 'Red Hat', emoji: '⛑️', coin_cost: 25, category: 'hats', sort_order: 6 },
  { item_id: 'o1', name: 'Hero Cape', emoji: '🦸', coin_cost: 15, category: 'outfits', sort_order: 1 },
  { item_id: 'o2', name: 'Space Suit', emoji: '🧑‍🚀', coin_cost: 30, category: 'outfits', sort_order: 2 },
  { item_id: 'o3', name: 'Wizard Robe', emoji: '🧙', coin_cost: 20, category: 'outfits', sort_order: 3 },
  { item_id: 'o4', name: 'Martial Arts', emoji: '🥋', coin_cost: 10, category: 'outfits', sort_order: 4 },
  { item_id: 'o5', name: 'Fancy Dress', emoji: '👗', coin_cost: 25, category: 'outfits', sort_order: 5 },
  { item_id: 'b1', name: 'Star', emoji: '⭐', coin_cost: 0, category: 'badges', sort_order: 1 },
  { item_id: 'b2', name: 'Medal', emoji: '🏅', coin_cost: 10, category: 'badges', sort_order: 2 },
  { item_id: 'b3', name: 'Diamond', emoji: '💎', coin_cost: 30, category: 'badges', sort_order: 3 },
  { item_id: 'b4', name: 'Fire', emoji: '🔥', coin_cost: 15, category: 'badges', sort_order: 4 },
  { item_id: 'b5', name: 'Rainbow', emoji: '🌈', coin_cost: 20, category: 'badges', sort_order: 5 },
];

export function getRewards() {
  return lsGet('admin_rewards', DEFAULT_REWARDS);
}

export function saveReward(reward) {
  const list = getRewards();
  const idx = list.findIndex(r => r.item_id === reward.item_id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...reward };
  } else {
    list.push({ ...reward, item_id: reward.item_id || `rw_${Date.now()}` });
  }
  lsSet('admin_rewards', list);
  return list;
}

export function deleteReward(rewardId) {
  const list = getRewards().filter(r => r.item_id !== rewardId);
  lsSet('admin_rewards', list);
  return list;
}

export function purchaseReward(childId, rewardId) {
  const reward = getRewards().find(r => r.item_id === rewardId);
  if (!reward) return false;
  const achievements = getAchievements(childId);
  if (achievements.totalCoins < reward.coin_cost) return false;
  achievements.totalCoins -= reward.coin_cost;
  saveAchievements(childId, achievements);

  const owned = getChildRewards(childId);
  if (!owned.includes(rewardId)) {
    owned.push(rewardId);
    lsSet(`child_rewards_${childId}`, owned);
  }
  return true;
}

export function getChildRewards(childId) {
  return lsGet(`child_rewards_${childId || getCurrentChildId()}`, []);
}

// ==============================
// ---- Badge Types (Admin) ----
// ==============================
const DEFAULT_BADGE_TYPES = [
  { id: 'literacy-star', emoji: '📚', name: 'Literacy Star', desc: 'Complete 5 reading activities', category: 'literacy', required: 5 },
  { id: 'math-champ', emoji: '🔢', name: 'Math Champion', desc: 'Solve 10 math challenges', category: 'math', required: 10 },
  { id: 'creative-mind', emoji: '🎨', name: 'Creative Mind', desc: 'Finish 5 creative projects', category: 'creative', required: 5 },
  { id: 'emotion-explorer', emoji: '💝', name: 'Emotion Explorer', desc: 'Complete emotional learning path', category: 'emotion', required: 4 },
  { id: 'science-whiz', emoji: '🔬', name: 'Science Whiz', desc: 'Do 5 science experiments', category: 'science', required: 5 },
  { id: 'problem-solver', emoji: '🧩', name: 'Problem Solver', desc: 'Crack 8 brain puzzles', category: 'brain', required: 8 },
  { id: 'super-reader', emoji: '📖', name: 'Super Reader', desc: 'Read 10 stories', category: 'literacy', required: 10 },
  { id: 'number-ninja', emoji: '🥷', name: 'Number Ninja', desc: 'Master multiplication tables', category: 'math', required: 12 },
  { id: 'music-master', emoji: '🎵', name: 'Music Master', desc: 'Complete 4 rhythm games', category: 'creative', required: 4 },
  { id: 'kind-heart', emoji: '🤗', name: 'Kind Heart', desc: 'Practice 5 kindness activities', category: 'emotion', required: 5 },
  { id: 'word-wizard', emoji: '✨', name: 'Word Wizard', desc: 'Learn 50 new words', category: 'literacy', required: 50 },
  { id: 'logic-legend', emoji: '🧠', name: 'Logic Legend', desc: 'Solve 15 logic puzzles', category: 'brain', required: 15 },
];

export function getAllBadgeTypes() {
  return lsGet('admin_badge_types', DEFAULT_BADGE_TYPES);
}

export function saveBadgeType(badge) {
  const list = getAllBadgeTypes();
  const idx = list.findIndex(b => b.id === badge.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...badge };
  } else {
    list.push({ ...badge, id: badge.id || `badge_${Date.now()}` });
  }
  lsSet('admin_badge_types', list);
  return list;
}

export function deleteBadgeType(badgeId) {
  const list = getAllBadgeTypes().filter(b => b.id !== badgeId);
  lsSet('admin_badge_types', list);
  return list;
}

// ==============================
// ---- Avatar Types (Admin) ----
// ==============================
const DEFAULT_AVATARS = [
  { id: 'av1', emoji: '👦🏻', name: 'Alex', bg: '#FFCDD2' },
  { id: 'av2', emoji: '👧🏽', name: 'Priya', bg: '#C8E6C9' },
  { id: 'av3', emoji: '👦🏿', name: 'Kofi', bg: '#BBDEFB' },
  { id: 'av4', emoji: '👧🏻', name: 'Luna', bg: '#F8BBD0' },
  { id: 'av5', emoji: '👦🏾', name: 'Ravi', bg: '#FFE0B2' },
  { id: 'av6', emoji: '👧🏼', name: 'Mia', bg: '#E1BEE7' },
  { id: 'av7', emoji: '🧒🏽', name: 'Ari', bg: '#B2DFDB' },
  { id: 'av8', emoji: '👶🏻', name: 'Benny', bg: '#FFF9C4' },
  { id: 'av9', emoji: '👧🏿', name: 'Amara', bg: '#D1C4E9' },
  { id: 'av10', emoji: '👦🏼', name: 'Leo', bg: '#B3E5FC' },
  { id: 'av11', emoji: '🧒🏾', name: 'Zara', bg: '#FFCCBC' },
  { id: 'av12', emoji: '👶🏽', name: 'Niko', bg: '#DCEDC8' },
];

export function getAllAvatarTypes() {
  return lsGet('admin_avatars', DEFAULT_AVATARS);
}

export function saveAvatarType(avatar) {
  const list = getAllAvatarTypes();
  const idx = list.findIndex(a => a.id === avatar.id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...avatar };
  } else {
    list.push({ ...avatar, id: avatar.id || `av_${Date.now()}` });
  }
  lsSet('admin_avatars', list);
  return list;
}

export function deleteAvatarType(avatarId) {
  const list = getAllAvatarTypes().filter(a => a.id !== avatarId);
  lsSet('admin_avatars', list);
  return list;
}
