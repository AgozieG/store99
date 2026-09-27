import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="min-h-[60vh] grid place-items-center"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return profile?.is_admin ? children : <Navigate to="/" replace />;
}
