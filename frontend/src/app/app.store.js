import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.slice';
import incidentReducer from '../features/user/state/incident.slice';
import staffReducer from '../features/staff/state/staff.slice';
import notificationReducer from '../features/notifications/state/notification.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    incidents: incidentReducer,
    staff: staffReducer,
    notifications: notificationReducer,
  },
});
