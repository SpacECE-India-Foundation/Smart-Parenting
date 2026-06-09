import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import {
  HiOutlineHome,
  HiOutlineMap,
  HiOutlineTrophy,
  HiOutlineUser,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import logoImg from '../../assets/logo.jpeg';

const NAV_ITEMS = [
  { path: '/',                 label: 'HOME',     icon: HiOutlineHome },
  { path: '/adventure',        label: 'EXPLORE',  icon: HiOutlineMap },
  { path: '/awards',           label: 'AWARDS',   icon: HiOutlineTrophy },
  { path: '/avatar',           label: 'AVATAR',   icon: HiOutlineUser },
  { path: '/settings',         label: 'SETTINGS', icon: HiOutlineCog6Tooth },
  { path: '/admin',            label: 'ADMIN',    icon: HiOutlineCog6Tooth },
];

export default function Sidebar({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const { profile } = useUser();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sidebar-mobile-overlay"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* ─── Logo ─── */}
        <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--border-default)' }}>
          {/* SpacECE Logo Icon */}
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img src={logoImg} alt="SpacECE Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-tight" style={{ color: '#F5A623', fontFamily: 'var(--font-display)' }}>
              SpacECE
            </div>
            <div className="text-[10px] font-semibold tracking-wider" style={{ color: 'var(--text-muted)' }}>
              LEARNING ADVENTURES
            </div>
          </div>
        </div>

        {/* ─── Notification / Search / Language Row ─── */}
        <div className="flex items-center gap-2 px-4 py-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'var(--bg-accent)' }}
            aria-label="Notifications"
          >
            🔔
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E91E8C] text-white text-[9px] font-bold flex items-center justify-center">3</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'var(--bg-accent)' }}
            aria-label="Search"
          >
            🔍
          </motion.button>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-[#E91E8C] text-white">EN</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>हि</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>मर</span>
          </div>
        </div>

        {/* ─── Nav Items ─── */}
        <nav className="flex-1 py-2">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    style={{ color: isActive ? 'var(--nav-icon-active)' : 'var(--nav-icon)' }}
                  />
                  <span style={{ color: isActive ? 'var(--nav-icon-active)' : 'var(--nav-icon)' }}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ─── Coin Badge ─── */}
        <div className="coin-badge">
          <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-lg">
            🪙
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {profile?.coins ?? 50}
          </span>
        </div>
      </aside>
    </>
  );
}
