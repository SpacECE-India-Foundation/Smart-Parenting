import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import Mascot from './Mascot';
import { useUser } from '../../context/UserContext';

/**
 * App shell: fixed sidebar on left, scrollable main content on right.
 * Also renders global achievement unlock toasts from UserContext.
 */
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { newAchievements, clearNewAchievements } = useUser();

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="main-content flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating mascot */}
      <Mascot />

      {/* ── Achievement Unlock Toasts ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {newAchievements.map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, x: 80, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ delay: i * 0.15 }}
              onAnimationComplete={() => {
                // Auto-dismiss after 4 seconds
                setTimeout(clearNewAchievements, 4000);
              }}
              className="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #7C4DFF, #E91E8C)',
                color: 'white',
                minWidth: 220,
              }}
            >
              <span className="text-3xl">{ach.emoji}</span>
              <div>
                <p className="text-xs font-bold opacity-80 uppercase tracking-wide">🏅 Achievement Unlocked!</p>
                <p className="font-bold text-sm">{ach.label}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
