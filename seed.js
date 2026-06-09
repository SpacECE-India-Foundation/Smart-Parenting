/**
 * SpacECE — Firestore Seed Script
 * ─────────────────────────────────
 * Run AFTER enabling Anonymous Auth and publishing Firestore rules.
 *
 * Usage:
 *   node seed.js
 *
 * Requires: npm install firebase (already installed as a dep)
 * Note: uses ADMIN-style writes via the client SDK — run locally only.
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
} from 'firebase/firestore';

// ── Config (mirrors .env) ──────────────────────────────────────────
// Load .env vars — run: node --env-file=.env seed.js
const firebaseConfig = {
  apiKey:            process.env.VITE_FIREBASE_API_KEY,
  authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Seed Data ──────────────────────────────────────────────────────
const MATH_GAMES = [
  { id: 'counting-1-3',  title: 'Counting Fun',    description: 'Count colourful objects and learn numbers 1–10!', emoji: '🐻', ageRange: '1–3', age_group: '1–3', difficulty: 'Easy',   gradient: 'bg-gradient-to-br from-[#FF9A56] via-[#F5A623] to-[#FFCC02]', type: 'counting',    stars: 0 },
  { id: 'number-match',  title: 'Number Match',    description: 'Match numbers to the right group of objects!',   emoji: '🎯', ageRange: '4–6', age_group: '4–6', difficulty: 'Medium', gradient: 'bg-gradient-to-br from-[#2EC4B6] to-[#4FC3F7]',                type: 'matching',    stars: 0 },
  { id: 'add-sub',       title: 'Add & Subtract',  description: 'Master addition and subtraction!',               emoji: '➕', ageRange: '7–10',age_group: '7–10',difficulty: 'Hard',   gradient: 'bg-gradient-to-br from-[#7C4DFF] to-[#FF6B9D]',                type: 'arithmetic',  stars: 0 },
  { id: 'times-tables',  title: 'Times Tables',    description: 'Speed through multiplication timed rounds!',     emoji: '✖️', ageRange: '7–10',age_group: '7–10',difficulty: 'Hard',   gradient: 'bg-gradient-to-br from-[#FF6B9D] via-[#F5A623] to-[#FFD180]', type: 'arithmetic',  stars: 0 },
  { id: 'number-order',  title: 'Number Order',    description: 'Put numbers in the right order!',                emoji: '📊', ageRange: '4–6', age_group: '4–6', difficulty: 'Medium', gradient: 'bg-gradient-to-br from-[#66BB6A] to-[#2EC4B6]',                type: 'ordering',    stars: 0 },
  { id: 'shape-numbers', title: 'Shape Numbers',   description: 'Count the sides and corners of shapes!',         emoji: '🔷', ageRange: '1–3', age_group: '1–3', difficulty: 'Easy',   gradient: 'bg-gradient-to-br from-[#4FC3F7] to-[#7C4DFF]',                type: 'counting',    stars: 0 },
];

const PUZZLE_GAMES = [
  { id: 'shape-match',    title: 'Shape Matching',   description: 'Match shapes to their shadows!',     emoji: '🔷', ageRange: '1–3', age_group: '1–3', difficulty: 'Easy',   gradient: 'bg-gradient-to-br from-[#2EC4B6] to-[#4FC3F7]', stars: 0 },
  { id: 'drag-puzzle',    title: 'Drag & Drop',      description: 'Drag pieces to complete pictures!',  emoji: '🧩', ageRange: '4–6', age_group: '4–6', difficulty: 'Medium', gradient: 'bg-gradient-to-br from-[#7C4DFF] to-[#FF6B9D]', stars: 0 },
  { id: 'logic-puzzles',  title: 'Logic Challenges', description: 'Solve tricky logic puzzles!',        emoji: '🧠', ageRange: '7–10',age_group: '7–10',difficulty: 'Hard',   gradient: 'bg-gradient-to-br from-[#FF6B9D] via-[#F5A623] to-[#FFD180]', stars: 0 },
  { id: 'jigsaw',         title: 'Jigsaw Puzzles',   description: 'Put together beautiful pictures!',   emoji: '🖼️', ageRange: '4–6', age_group: '4–6', difficulty: 'Medium', gradient: 'bg-gradient-to-br from-[#FF9A56] via-[#F5A623] to-[#FFCC02]', stars: 0 },
  { id: 'pattern-puzzle', title: 'Pattern Puzzles',  description: 'Find the missing piece!',            emoji: '🔮', ageRange: '4–6', age_group: '4–6', difficulty: 'Medium', gradient: 'bg-gradient-to-br from-[#66BB6A] to-[#2EC4B6]', stars: 0 },
  { id: 'color-sort',     title: 'Color Sorting',    description: 'Sort objects by color, shape, size!',emoji: '🎨', ageRange: '1–3', age_group: '1–3', difficulty: 'Easy',   gradient: 'bg-gradient-to-br from-[#4FC3F7] to-[#7C4DFF]', stars: 0 },
];

const LOGIC_GAMES = [
  { id: 'pattern-recognition',  title: 'Pattern Spotter',  description: 'Find the pattern and choose what comes next!', emoji: '🔍', ageRange: '4–6', age_group: '4–6', difficulty: 'Medium', gradient: 'bg-gradient-to-br from-[#7C4DFF] to-[#FF6B9D]', stars: 0 },
  { id: 'sequence-complete',    title: 'Sequence Builder',  description: 'Complete the number sequence correctly!',       emoji: '🧬', ageRange: '7–10',age_group: '7–10',difficulty: 'Hard',   gradient: 'bg-gradient-to-br from-[#FF9A56] via-[#F5A623] to-[#FFCC02]', stars: 0 },
  { id: 'maze-challenge',       title: 'Maze Runner',       description: 'Navigate through tricky mazes!',               emoji: '🏃', ageRange: '4–6', age_group: '4–6', difficulty: 'Medium', gradient: 'bg-gradient-to-br from-[#2EC4B6] to-[#4FC3F7]', stars: 0 },
  { id: 'multiplication-quest', title: 'Multiply Quest',    description: 'Master multiplication through epic quests!',   emoji: '⚔️', ageRange: '7–10',age_group: '7–10',difficulty: 'Hard',   gradient: 'bg-gradient-to-br from-[#FF6B9D] via-[#F5A623] to-[#FFD180]', stars: 0 },
  { id: 'word-problems',        title: 'Story Problems',    description: 'Solve real-world math problems in stories!',   emoji: '📖', ageRange: '7–10',age_group: '7–10',difficulty: 'Hard',   gradient: 'bg-gradient-to-br from-[#66BB6A] to-[#2EC4B6]', stars: 0 },
  { id: 'odd-one-out',          title: 'Odd One Out',       description: "Find the item that doesn't belong!",          emoji: '🎭', ageRange: '1–3', age_group: '1–3', difficulty: 'Easy',   gradient: 'bg-gradient-to-br from-[#4FC3F7] to-[#7C4DFF]', stars: 0 },
];

// ── Helpers ────────────────────────────────────────────────────────
async function seedCollection(colName, docs) {
  console.log(`\n📦 Seeding [${colName}]...`);
  const existing = await getDocs(collection(db, colName));
  if (existing.size > 0) {
    console.log(`   ⚠️  Already has ${existing.size} docs — skipping (delete them first to re-seed)`);
    return;
  }
  for (const d of docs) {
    const { id, ...data } = d;
    await setDoc(doc(db, colName, id), data);
    console.log(`   ✅ ${id}`);
  }
  console.log(`   Done — ${docs.length} docs written.`);
}

// ── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 SpacECE Firestore Seed Script');
  console.log('   Project:', firebaseConfig.projectId);
  console.log('');
  console.log('⚠️  Make sure you have published Firestore rules that allow writes first!');
  console.log('   (temporarily set: allow read, write: if true; for seeding, then revert)');
  console.log('');

  try {
    await seedCollection('math_games',   MATH_GAMES);
    await seedCollection('puzzle_games', PUZZLE_GAMES);
    await seedCollection('logic_games',  LOGIC_GAMES);
    console.log('\n🎉 Seeding complete!');
  } catch (e) {
    console.error('\n❌ Seeding failed:', e.message);
    console.error('   Make sure Firestore rules allow write access during seeding.');
  }
  process.exit(0);
}

main();
