// src/components/ProtectedRoute.js

import { Navigate } from 'react-router-dom';
import  {useAuth}  from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
