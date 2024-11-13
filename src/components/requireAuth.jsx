// src/components/RequireAuth.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.user.userInfo?.token); // Use optional chaining

  useEffect(() => {
    if (!token) {
      // If no token, redirect to /login
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [token, navigate, location]);

  // If there's a token, render the children
  return token ? children : null;
};

export default RequireAuth;
