import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  // DEV_MODE: bypass all auth
  if (DEV_MODE) return children;

  // Wait for auth to resolve
  if (loading) {
    return <LoadingSpinner fullScreen message="Verifying your session..." />;
  }

  // Not logged in → redirect to home
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Role check — if allowedRoles specified, verify user has permission
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentUser.role)) {
      // Redirect to their own dashboard
      const dashboards = {
        parent:  '/parent/dashboard',
        teacher: '/teacher/dashboard',
        admin:   '/admin/dashboard',
        child:   '/child/dashboard',
      };
      return <Navigate to={dashboards[currentUser.role] || '/'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;