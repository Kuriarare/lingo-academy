import React, { useState } from 'react';
import { FiMoon, FiBell, FiUser, FiEye, FiDroplet, FiType, FiShield, FiLogOut, FiGlobe, FiInfo } from 'react-icons/fi';
import Dashboard from '../../sections/dashboard';
import Navbar from '../navbar';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [showBanner, setShowBanner] = useState(true);

  // State for settings - currently for UI demonstration
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#3B82F6');
  const [fontSize, setFontSize] = useState('medium');
  const [classReminders, setClassReminders] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Appearance</h2>
            {/* Dark Mode */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiMoon className="text-xl text-gray-500" />
                <span className="font-semibold">Dark Mode</span>
              </div>
              {/* Custom Toggle Switch */}
            </div>
            {/* Accent Color */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiDroplet className="text-xl text-gray-500" />
                <span className="font-semibold">Accent Color</span>
              </div>
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded-full" />
            </div>
            {/* Font Size */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiType className="text-xl text-gray-500" />
                <span className="font-semibold">Font Size</span>
              </div>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="border-gray-300 rounded-md">
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
            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
            {/* Class Reminders */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiBell className="text-xl text-gray-500" />
                <span className="font-semibold">Class Reminders</span>
              </div>
               {/* Custom Toggle Switch */}
            </div>
            {/* Message Notifications */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiBell className="text-xl text-gray-500" />
                <span className="font-semibold">New Messages</span>
              </div>
               {/* Custom Toggle Switch */}
            </div>
          </div>
        );
      case 'account':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Account</h2>
            {/* Language Selection */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <FiGlobe className="text-xl text-gray-500" />
                <span className="font-semibold">Language</span>
              </div>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border-gray-300 rounded-md">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <button className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100">
              <FiShield className="text-xl text-gray-500" />
              <span className="font-semibold">Change Password</span>
            </button>
            <button className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-red-50 text-red-600">
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
    <div className="flex w-full min-h-screen">
      <Dashboard />
      <div className="w-full">
        <section className="w-full custom-bg">
          <div className="container">
            <Navbar header="Settings" />
          </div>
        </section>
        <div className="p-8">
          {showBanner && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-8 flex justify-between items-center shadow-md">
              <div className="flex items-center">
                <FiInfo className="text-2xl mr-3" />
                <p className="font-semibold">This page is for demonstration purposes only. Settings are not yet functional.</p>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-xl font-bold">&times;</button>
            </div>
          )}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900">Settings</h1>
            <p className="text-lg text-gray-500 mt-2">Manage your preferences</p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
                <button onClick={() => setActiveTab('appearance')} className={`w-full text-left flex items-center gap-3 p-3 rounded-lg font-semibold ${activeTab === 'appearance' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                  <FiEye /> Appearance
                </button>
                <button onClick={() => setActiveTab('notifications')} className={`w-full text-left flex items-center gap-3 p-3 rounded-lg font-semibold ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                  <FiBell /> Notifications
                </button>
                <button onClick={() => setActiveTab('account')} className={`w-full text-left flex items-center gap-3 p-3 rounded-lg font-semibold ${activeTab === 'account' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
                  <FiUser /> Account
                </button>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
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