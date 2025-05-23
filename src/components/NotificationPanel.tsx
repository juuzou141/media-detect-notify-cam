
import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationPanelProps {
  onClose: () => void;
  onNotificationRead: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose, onNotificationRead }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Detection Complete',
      message: 'Successfully detected 3 faces in uploaded media',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Confidence Detection',
      message: 'Object detected with 65% confidence - consider better lighting',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Camera Started',
      message: 'Live detection camera is now active',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    onNotificationRead();
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No notifications</p>
              <p className="text-sm text-gray-400">All caught up!</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    notification.read
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-600' : 'text-gray-800'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        notification.read ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark as read
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
