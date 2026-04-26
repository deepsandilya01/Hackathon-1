import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../features/auth/hook/useAuth';
import NotificationBell from '../features/user/components/NotificationBell';
import { Button } from '../components/ui/Button';
import { getNotifications } from '../features/notifications/service/notification.api';
import { setNotifications } from '../features/notifications/state/notification.slice';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getNotifications().then(res => {
        dispatch(setNotifications(res.data.data || res.data));
      }).catch(console.error);
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to={user?.role === 'Staff' ? '/staff/dashboard' : '/user/dashboard'} className="flex items-center gap-2">
              <span className="font-bold text-xl text-red-500">SOS<span className="text-white">Response</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === 'Staff' && (
              <Link to="/staff/incidents" className="text-sm font-medium text-slate-300 hover:text-white">
                All Incidents
              </Link>
            )}
            {user?.role === 'User' && (
              <Link to="/user/my-incidents" className="text-sm font-medium text-slate-300 hover:text-white">
                My Incidents
              </Link>
            )}
            <NotificationBell />
            <div className="text-sm text-slate-400 hidden md:block">
              Welcome, {user?.fullname}
            </div>
            <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
