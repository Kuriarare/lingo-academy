import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiMoon, FiBell, FiUser, FiEye, FiDroplet, FiType, FiShield, FiLogOut, FiGlobe, FiInfo } from 'react-icons/fi';
import Dashboard from '../../sections/dashboard';
import Navbar from '../navbar';
import { updateUserSettings } from '../../redux/userSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('appearance');
  const [showBanner, setShowBanner] = useState(true);

  const darkMode = userInfo?.user?.settings?.darkMode || false;
  const [accentColor, setAccentColor] = useState('#3B82F6');
  const [fontSize, setFontSize] = useState('medium');
  const [classReminders, setClassReminders] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleDarkModeToggle = () => {
    const newDarkModeState = !darkMode;
    dispatch(updateUserSettings({ darkMode: newDarkModeState }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Appearance</h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiMoon className="text-xl text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={handleDarkModeToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiDroplet className="text-xl text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Accent Color</span>
              </div>
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiType className="text-xl text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Font Size</span>
              </div>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="border-gray-300 dark:border-purple-500/20 rounded-md bg-white dark:bg-brand-dark text-gray-700 dark:text-gray-300">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiBell className="text-xl text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Class Reminders</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiBell className="text-xl text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">New Messages</span>
              </div>
            </div>
          </div>
        );
      case 'account':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account</h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiGlobe className="text-xl text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Language</span>
              </div>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border-gray-300 dark:border-purple-500/20 rounded-md bg-white dark:bg-brand-dark text-gray-700 dark:text-gray-300">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <button className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
              <FiShield className="text-xl text-gray-500 dark:text-gray-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Change Password</span>
            </button>
            <button className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-500">
              <FiLogOut className="text-xl" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100 dark:bg-brand-dark">
      <Dashboard />
      <div className="w-full">
        <section className="w-full bg-brand-navbar-light dark:bg-brand-dark-secondary shadow-md border-b border-transparent dark:border-purple-500/20">
          <div className="container">
            <Navbar header="Settings" />
          </div>
        </section>
        <div className="p-8">
          {showBanner && (
            <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg mb-8 flex justify-between items-center shadow-md">
              <div className="flex items-center">
                <FiInfo className="text-2xl mr-3" />
                <p className="font-semibold">This page is for demonstration purposes only. Settings are not yet functional.</p>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-xl font-bold">&times;</button>
            </div>
          )}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Manage your preferences</p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-brand-dark-secondary rounded-xl shadow-lg p-4 space-y-2 border border-gray-200 dark:border-purple-500/20">
                <button onClick={() => setActiveTab('appearance')} className={`w-full text-left flex items-center gap-3 p-3 rounded-lg font-semibold ${activeTab === 'appearance' ? 'bg-blue-500 dark:bg-brand-purple text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'}`}>
                  <FiEye /> Appearance
                </button>
                <button onClick={() => setActiveTab('notifications')} className={`w-full text-left flex items-center gap-3 p-3 rounded-lg font-semibold ${activeTab === 'notifications' ? 'bg-blue-500 dark:bg-brand-purple text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'}`}>
                  <FiBell /> Notifications
                </button>
                <button onClick={() => setActiveTab('account')} className={`w-full text-left flex items-center gap-3 p-3 rounded-lg font-semibold ${activeTab === 'account' ? 'bg-blue-500 dark:bg-brand-purple text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'}`}>
                  <FiUser /> Account
                </button>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="bg-white dark:bg-brand-dark-secondary rounded-xl shadow-lg p-8 border border-gray-200 dark:border-purple-500/20">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;