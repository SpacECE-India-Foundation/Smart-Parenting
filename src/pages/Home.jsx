import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import ProgressBar from '../components/common/ProgressBar';
import FloatingElements from '../components/animations/FloatingElements';

const MODULES = [
  {
    id: 'math-world',
    title: 'Math World',
    path: '/math-world',
    emoji: '🔢',
    bgGradient: 'bg-gradient-to-br from-[#FF9A56] via-[#F5A623] to-[#FFCC02]',
    progress: 65,
    total: 8,
    done: 5,
    color: '#F5A623',
  },
  {
    id: 'puzzle-world',
    title: 'Puzzle World',
    path: '/puzzle-world',
    emoji: '🧩',
    bgGradient: 'bg-gradient-to-br from-[#2EC4B6] to-[#4FC3F7]',
    progress: 40,
    total: 8,
    done: 3,
    color: '#2EC4B6',
  },
  {
    id: 'number-adventure',
    title: 'Number Adventure',
    path: '/number-adventure',
    emoji: '🗺️',
    bgGradient: 'bg-gradient-to-br from-[#7C4DFF] to-[#FF6B9D]',
    progress: 25,
    total: 6,
    done: 2,
    color: '#7C4DFF',
  },
  {
    id: 'logic-island',
    title: 'Logic Island',
    path: '/logic-island',
    emoji: '🧠',
    bgGradient: 'bg-gradient-to-br from-[#FF6B9D] via-[#F5A623] to-[#FFD180]',
    progress: 10,
    total: 6,
    done: 1,
    color: '#FF6B9D',
  },
];

const LEARNING_JOURNEY = [
  { id: 'alphabet-forest', title: 'Alphabet Forest', emoji: '🌲', progress: 100, done: true },
  { id: 'literacy-land',   title: 'Literacy Land',   emoji: '📚', progress: 35,  done: false },
  { id: 'math-mountain',   title: 'Math Mountain',   emoji: '🏔️', progress: 0,   done: false },
];

const DAILY_MISSIONS = [
  { label: 'Complete Letter Safari', done: true },
  { label: 'Solve 5 Math Puzzles',   done: false },
  { label: 'Earn 3 Stars',           done: false },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { profile } = useUser();

  const name = profile?.name ?? 'Ayush';
  const greeting = getGreeting();

  return (
    <div className="relative min-h-screen">
      <FloatingElements count={5} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6">
        {/* ─── Greeting ─── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            {greeting}, {name} 🥰 👋
          </h1>
        </motion.div>

        {/* ─── Continue Learning Banner ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl overflow-hidden mb-6"
        >
          <div
            className="relative p-7"
            style={{ background: 'linear-gradient(135deg, #F5A623, #FFCC02)' }}
          >
            {/* Background book emoji */}
            <div className="absolute -bottom-2 right-6 text-[90px] opacity-80 select-none pointer-events-none">
              📖
            </div>
            {/* Sparkle */}
            <div className="absolute top-4 right-48 text-2xl animate-sparkle select-none pointer-events-none">✨</div>
            <div className="absolute top-8 right-40 text-2xl animate-sparkle select-none pointer-events-none" style={{ animationDelay: '0.5s' }}>⭐</div>

            <div className="relative z-10 max-w-lg">
              <span
                className="inline-block text-xs font-bold tracking-widest text-white/80 bg-white/20 rounded-full px-3 py-1 mb-3"
              >
                CONTINUE LEARNING
              </span>
              <h2
                className="text-3xl font-bold text-white mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Literacy Land
              </h2>
              <p className="text-white/80 text-sm mb-4">Current Course: Letter Sounds & Recognition</p>

              {/* Progress bar */}
              <div className="mb-1">
                <div className="progress-track" style={{ background: 'rgba(255,255,255,0.3)' }}>
                  <div
                    className="progress-fill"
                    style={{ width: '35%', background: 'white' }}
                  />
                </div>
              </div>
              <p className="text-white font-bold text-sm mb-5">35% Complete</p>

              <div className="flex items-center gap-2 text-white/80 text-sm mb-5">
                <span>🕐</span>
                <span>Estimated Time: 10 minutes remaining</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/adventure')}
                className="btn-primary text-base"
              >
                Continue Journey →
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* ─── Two-column: Learning Journey + Daily Missions ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Learning Journey */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-5"
          >
            <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              🗺️ Learning Journey
            </h3>
            <div className="space-y-3">
              {LEARNING_JOURNEY.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 relative"
                    style={{ background: item.done ? '#4CAF5020' : 'var(--bg-accent)' }}
                  >
                    {item.emoji}
                    {item.done && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 progress-track" style={{ height: 6 }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${item.progress}%`,
                            background: item.done ? '#4CAF50' : 'linear-gradient(90deg, #F5A623, #FF9A56)',
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                        {item.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Daily Missions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card p-5"
          >
            <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              ✅ Daily Missions
            </h3>
            <div className="space-y-3">
              {DAILY_MISSIONS.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: m.done ? '#4CAF5010' : 'var(--bg-accent)' }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: m.done ? '#4CAF50' : 'var(--border-default)',
                      color: m.done ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    {m.done ? '✓' : '○'}
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: m.done ? '#4CAF50' : 'var(--text-primary)',
                      textDecoration: m.done ? 'line-through' : 'none',
                    }}
                  >
                    {m.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* ─── Module Cards ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            🌍 Explore Worlds
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(mod.path)}
                className="relative overflow-hidden rounded-3xl cursor-pointer"
              >
                <div className={`${mod.bgGradient} p-5 pb-6 relative min-h-[160px] flex flex-col justify-between`}>
                  {/* Background emoji */}
                  <div className="absolute -top-3 -right-3 text-[80px] opacity-15 animate-float select-none pointer-events-none">
                    {mod.emoji}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl drop-shadow">{mod.emoji}</span>
                      <h4
                        className="text-xl font-bold text-white drop-shadow"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {mod.title}
                      </h4>
                    </div>
                    <span className="bg-white/25 backdrop-blur-sm text-white text-xs font-bold rounded-full px-3 py-1">
                      {mod.done}/{mod.total} lessons
                    </span>
                  </div>

                  {/* Bottom progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-white text-xs font-semibold mb-1">
                      <span>Progress</span>
                      <span>{mod.progress}%</span>
                    </div>
                    <div className="progress-track" style={{ background: 'rgba(255,255,255,0.3)', height: 8 }}>
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${mod.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 + i * 0.1 }}
                        style={{ background: 'rgba(255,255,255,0.8)' }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
