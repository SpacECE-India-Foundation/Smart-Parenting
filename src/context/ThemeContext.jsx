import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Manages light/dark mode and seasonal themes.
 * Matches reference UI: Light | Dark | System, + Seasonal (None/Diwali/Holi)
 */
export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('spacece-theme') || 'light';
  });

  const [seasonal, setSeasonal] = useState(() => {
    return localStorage.getItem('spacece-seasonal') || 'none';
  });

  // Resolve actual dark/light based on mode
  const isDark = themeMode === 'dark' || 
    (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const root = document.documentElement;
    // Clear previous theme classes
    root.classList.remove('dark', 'seasonal-diwali', 'seasonal-holi');

    if (isDark) root.classList.add('dark');
    if (seasonal !== 'none') root.classList.add(`seasonal-${seasonal}`);

    localStorage.setItem('spacece-theme', themeMode);
    localStorage.setItem('spacece-seasonal', seasonal);
  }, [isDark, themeMode, seasonal]);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (themeMode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const root = document.documentElement;
      if (mq.matches) root.classList.add('dark');
      else root.classList.remove('dark');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeMode]);

  const toggleTheme = () =>
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const setMode = (mode) => setThemeMode(mode); // 'light' | 'dark' | 'system'
  const setSeasonalTheme = (theme) => setSeasonal(theme); // 'none' | 'diwali' | 'holi'

  return (
    <ThemeContext.Provider
      value={{ isDark, themeMode, seasonal, toggleTheme, setMode, setSeasonalTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
