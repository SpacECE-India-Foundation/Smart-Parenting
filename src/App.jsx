import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import Layout from './components/layout/Layout';

/* Pages */
import Home from './pages/Home';
import Adventure from './pages/Adventure';
import Awards from './pages/Awards';
import AvatarPage from './pages/AvatarPage';
import Settings from './pages/Settings';
import MathWorld from './pages/MathWorld';
import PuzzleWorld from './pages/PuzzleWorld';
import NumberAdventure from './pages/NumberAdventure';
import LogicIsland from './pages/LogicIsland';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Primary nav pages */}
              <Route index               element={<Home />} />
              <Route path="adventure"    element={<Adventure />} />
              <Route path="awards"       element={<Awards />} />
              <Route path="avatar"       element={<AvatarPage />} />
              <Route path="settings"     element={<Settings />} />

              {/* Game world pages */}
              <Route path="math-world"        element={<MathWorld />} />
              <Route path="puzzle-world"      element={<PuzzleWorld />} />
              <Route path="number-adventure"  element={<NumberAdventure />} />
              <Route path="logic-island"      element={<LogicIsland />} />
              <Route path="admin"             element={<AdminPanel />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}
