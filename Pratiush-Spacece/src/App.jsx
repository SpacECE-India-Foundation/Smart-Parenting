import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { I18nProvider } from './i18n';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import OfflineIndicator from './components/OfflineIndicator';
import Mascot from './components/Mascot';
import LoadingScreen from './components/LoadingScreen';
import Welcome from './pages/Welcome';
import AvatarPage from './pages/Avatar';
import Dashboard from './pages/Dashboard';
import Achievements from './pages/Achievements';
import Adventure from './pages/Adventure';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import './index.css';

function AppRoutes() {
  const { state, dispatch } = useApp();
  const location = useLocation();
  
  // Hide navbar on welcome page
  const showNavbar = state.isOnboarded && location.pathname !== '/welcome';

  // Show loading screen on initial load
  if (state.isLoading) {
    return <LoadingScreen onComplete={() => dispatch({ type: 'SET_LOADING', payload: false })} />;
  }

  return (
    <>
      <OfflineIndicator />
      <div className={`main-content ${showNavbar ? 'has-navbar' : ''}`}>
        <Routes>
          <Route path="/" element={
            state.isOnboarded ? <Navigate to="/dashboard" replace /> : <Navigate to="/welcome" replace />
          } />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/avatar" element={<AvatarPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/adventure" element={<Adventure />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      {showNavbar && <Navbar />}
      {showNavbar && state.mascotVisible && <Mascot visible={true} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <ThemeProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </ThemeProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}
