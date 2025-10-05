import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiSun, FiMoon } from 'react-icons/fi';
import { updateUserSettings } from '../../redux/userSlice';

const ThemeToggleButton = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const darkMode = userInfo?.user?.settings?.darkMode || false;

  const handleToggle = () => {
    const newDarkModeState = !darkMode;
    dispatch(updateUserSettings({ darkMode: newDarkModeState }));
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full bg-white/20 text-white"
    >
      {darkMode ? <FiSun /> : <FiMoon />}
    </button>
  );
};

export default ThemeToggleButton;