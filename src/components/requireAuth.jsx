// src/components/RequireAuth.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGlobalSocket from '../hooks/useGlobalSocket';

// eslint-disable-next-line react/prop-types
const RequireAuth = ({ children, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);
  const token = userInfo?.token;
  const userRole = userInfo?.user?.role;
  useGlobalSocket();

  useEffect(() => {
    if (!token) {
      // If no token, redirect to /login
      navigate('/login', { state: { from: location }, replace: true });
    } else if (role && userRole !== role) {
      // If there's a token but the role doesn't match, redirect to /home
      navigate('/home', { replace: true });
    }
  }, [token, userRole, role, navigate, location]);

  // If there's a token and the role matches (or no role is required), render the children
  return token && (!role || userRole === role) ? children : null;
};

export default RequireAuth;
