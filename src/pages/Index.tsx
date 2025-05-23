
import React, { useState } from 'react';
import { Camera, Bell, Upload, X, Play, Pause, Moon, Sun } from 'lucide-react';
import MediaUpload from '../components/MediaUpload';
import LiveDetection from '../components/LiveDetection';
import NotificationPanel from '../components/NotificationPanel';
import { useDarkMode } from '../hooks/useDarkMode';

const Index = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (notificationCount > 0) {
      setNotificationCount(0);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-sm border-b sticky top-0 z-40 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700/20' 
          : 'bg-white/80 border-white/20'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MediaScope
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>AI-Powered Media Detection</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 border rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200' 
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>

              {/* Notification Button */}
              <button
                onClick={handleNotificationClick}
                className={`relative p-3 border rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200' 
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className={`backdrop-blur-sm rounded-2xl border p-2 mb-8 shadow-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/60 border-gray-700/20' 
            : 'bg-white/60 border-white/20'
        }`}>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload Media</span>
            </button>
            <button
              onClick={() => setActiveTab('detection')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'detection'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Live Detection</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          {activeTab === 'upload' && <MediaUpload />}
          {activeTab === 'detection' && <LiveDetection />}
        </div>
      </main>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel 
          onClose={() => setShowNotifications(false)}
          onNotificationRead={() => setNotificationCount(Math.max(0, notificationCount - 1))}
        />
      )}
    </div>
  );
};

export default Index;
