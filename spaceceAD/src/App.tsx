import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { ChildProgress } from './pages/ChildProgress';
import { LearningMap } from './pages/LearningMap';
import { ParentDashboard } from './pages/ParentDashboard';
import { ReportsPage } from './pages/ReportsPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { SettingsPage } from './pages/SettingsPage';
import { getChildren, initializeDatabase, getAssessments, calculateSchoolReadinessScore } from './services/firebaseSimulator';
import type { Child, Assessment } from './services/firebaseSimulator';

function App() {
  const [role, setRole] = useState<'child' | 'parent' | 'teacher' | 'admin' | 'reports' | 'settings'>('child');
  const [selectedChildId, setSelectedChildId] = useState<string>('child_2');
  const [tab, setTab] = useState<string>('progress');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [readiness, setReadiness] = useState<number>(0);
  const [dbReady, setDbReady] = useState(false);

  // Initialize Firebase DB and theme on first load
  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
      setDbReady(true);

      const savedTheme = localStorage.getItem('edu_theme') || 'light';
      const savedSeason = localStorage.getItem('edu_season') || 'none';
      if (savedTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
      document.documentElement.setAttribute('data-season', savedSeason);
    };
    init();
  }, []);

  // Load children list
  useEffect(() => {
    if (!dbReady) return;
    getChildren().then(setChildrenList);
  }, [dbReady, refreshTrigger]);

  const activeChild = useMemo(() => {
    return childrenList.find(c => c.id === selectedChildId) || childrenList[0];
  }, [childrenList, selectedChildId]);

  // Load assessments + readiness for active child
  useEffect(() => {
    if (!activeChild) return;
    getAssessments(activeChild.id).then(setAssessments);
    calculateSchoolReadinessScore(activeChild.id).then(setReadiness);
  }, [activeChild, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  const handleChangeRole = (newRole: 'child' | 'parent' | 'teacher' | 'admin' | 'reports' | 'settings') => {
    setRole(newRole);
    if (newRole === 'child') setTab('progress');
    else if (newRole === 'parent') setTab('parent_dashboard');
    else if (newRole === 'reports') setTab('reports');
    else if (newRole === 'settings') setTab('settings');
    else setTab(newRole);
  };

  // Gamification stats (computed from loaded assessments)
  const stats = useMemo(() => {
    const now = new Date();
    const activeDates = new Set(assessments.map(a => a.date));
    let streakCount = 0;
    const todayStr = now.toISOString().split('T')[0];
    const yesterdayStr = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
    if (activeDates.has(todayStr) || activeDates.has(yesterdayStr)) {
      let checkDate = activeDates.has(todayStr) ? now : new Date(now.getTime() - 86400000);
      while (activeDates.has(checkDate.toISOString().split('T')[0])) {
        streakCount++;
        checkDate = new Date(checkDate.getTime() - 86400000);
      }
    }

    let totalStars = 0;
    for (let i = 29; i >= 0; i--) {
      const dateStr = new Date(now.getTime() - i * 86400000).toISOString().split('T')[0];
      const daily = assessments.filter(a => a.date === dateStr);
      if (daily.length > 0) {
        const avg = daily.reduce((s, a) => s + a.score, 0) / daily.length;
        totalStars += avg >= 80 ? 3 : avg >= 60 ? 2 : 1;
      }
    }

    let badges = 0;
    ['Literacy', 'Numeracy', 'Cognitive', 'Creativity', 'Emotional'].forEach(d => {
      const list = assessments.filter(a => a.domain === d);
      const avg = list.length > 0 ? list.reduce((s, a) => s + a.score, 0) / list.length : 0;
      if (avg >= 80) badges++;
    });
    if (streakCount >= 3) badges++;
    if (readiness >= 85) badges++;

    return { streakCount, totalStars, badges, xp: assessments.length * 10 + totalStars * 5 + badges * 50 };
  }, [assessments, readiness]);

  const mascotMessages = ["I'm here if you need me! 😊", "Let's keep going! 💪", "You're doing great! 🌟", "Ready for more? 🚀"];
  const mascotMsg = useMemo(() => mascotMessages[Math.floor(Math.random() * mascotMessages.length)], [role, tab]);
  const showMascot = localStorage.getItem('edu_mascot') !== 'false';

  if (!dbReady || !activeChild) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem' }}>
        🚀 Connecting to SpacECE…
      </div>
    );
  }

  return (
    <>
      <Navbar
        currentRole={role}
        onChangeRole={handleChangeRole}
        childrenList={childrenList}
        selectedChild={activeChild}
        onChangeChild={setSelectedChildId}
        activeTab={tab}
        onChangeTab={setTab}
      />

      <div className="main-content">
        <div className="top-bar print-hide">
          <div className="stats-bar">
            <div className="stat-pill"><span className="stat-icon">🔥</span><span className="stat-value">{stats.streakCount}</span><span className="stat-label">Day Streak</span></div>
            <div className="stat-pill"><span className="stat-icon">⭐</span><span className="stat-value">{stats.totalStars}</span><span className="stat-label">Stars</span></div>
            <div className="stat-pill"><span className="stat-icon">🏆</span><span className="stat-value">{stats.badges}</span><span className="stat-label">Badges</span></div>
            <div className="stat-pill"><span className="stat-icon">✨</span><span className="stat-value">{stats.xp}</span><span className="stat-label">XP</span></div>
          </div>
          <div className="top-bar-avatar" onClick={() => handleChangeRole('settings')} title="Settings">
            {activeChild.avatar}
          </div>
        </div>

        <div className="page-content">
          {role === 'child' && tab === 'progress' && <ChildProgress key={`${selectedChildId}_${refreshTrigger}`} selectedChild={activeChild} />}
          {role === 'child' && tab === 'map' && <LearningMap key={`${selectedChildId}_${refreshTrigger}`} selectedChild={activeChild} />}
          {role === 'parent' && tab === 'parent_dashboard' && <ParentDashboard key={`${selectedChildId}_${refreshTrigger}`} selectedChild={activeChild} onRefresh={handleRefresh} />}
          {role === 'reports' && <ReportsPage key={`${selectedChildId}_${refreshTrigger}`} selectedChild={activeChild} />}
          {role === 'teacher' && <TeacherDashboard key={refreshTrigger} onRefresh={handleRefresh} />}
          {role === 'admin' && <AdminPanel key={refreshTrigger} onRefresh={handleRefresh} />}
          {role === 'settings' && <SettingsPage key={refreshTrigger} />}
        </div>
      </div>

      {showMascot && (
        <div className="mascot-companion print-hide">
          <div className="mascot-bubble">{mascotMsg}</div>
          <div className="mascot-avatar">🏫</div>
          <span className="mascot-label">SpacECE</span>
        </div>
      )}
    </>
  );
}

export default App;
