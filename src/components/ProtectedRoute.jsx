import { Navigate,useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
export default function ProtectedRoute({children}){const {user,loading}=useAuth(),loc=useLocation();if(loading)return <div className="min-h-[60vh] grid place-items-center"><Spinner/></div>;return user?children:<Navigate to="/login" state={{from:loc.pathname}} replace/>}
