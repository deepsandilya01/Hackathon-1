import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell } from 'lucide-react';
import { markAsRead, markAllAsRead as markAllAsReadApi } from '../../notifications/service/notification.api';
import { markAsRead as markAsReadAction, markAllAsRead } from '../../notifications/state/notification.slice';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      dispatch(markAsReadAction(id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsReadApi();
      dispatch(markAllAsRead());
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 hover:bg-slate-800 transition-colors"
      >
        <Bell className="h-5 w-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-800 bg-slate-900 shadow-xl z-50">
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <h3 className="font-semibold text-slate-100">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-red-500 hover:text-red-400"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-400">No notifications</div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleMarkAsRead(notif._id)}
                  className={`cursor-pointer border-b border-slate-800 p-4 hover:bg-slate-800/50 transition-colors ${
                    !notif.read ? 'bg-slate-800/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notif.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-red-500" />}
                    <div>
                      <p className={`text-sm ${!notif.read ? 'text-slate-100 font-medium' : 'text-slate-300'}`}>
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
