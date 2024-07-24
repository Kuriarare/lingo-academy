import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem('token');
    navigate('/');
  };
};
