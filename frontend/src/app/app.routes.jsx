import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import Protected from '../features/auth/components/Protected';

import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';

import UserDashboard from '../features/user/pages/UserDashboard';
import ReportIncident from '../features/user/pages/ReportIncident';
import MyIncidents from '../features/user/pages/MyIncidents';

import StaffDashboard from '../features/staff/pages/StaffDashboard';
import AllIncidents from '../features/staff/pages/AllIncidents';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: '/user',
        element: <Protected allowedRoles={['User']} />,
        children: [
          { path: 'dashboard', element: <UserDashboard /> },
          { path: 'report', element: <ReportIncident /> },
          { path: 'my-incidents', element: <MyIncidents /> }
        ]
      },
      {
        path: '/staff',
        element: <Protected allowedRoles={['Staff']} />,
        children: [
          { path: 'dashboard', element: <StaffDashboard /> },
          { path: 'incidents', element: <AllIncidents /> }
        ]
      }
    ]
  }
]);
