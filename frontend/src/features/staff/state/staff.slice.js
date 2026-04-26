import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allIncidents: [],
  dashboardStats: {
    total: 0,
    pending: 0,
    active: 0,
    resolved: 0,
    critical: 0,
    recentIncidents: []
  },
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setAllIncidents: (state, action) => {
      state.allIncidents = action.payload;
    },
    updateIncidentStatus: (state, action) => {
      const index = state.allIncidents.findIndex((i) => i._id === action.payload._id);
      if (index !== -1) {
        state.allIncidents[index] = action.payload;
      }
      const recentIndex = state.dashboardStats.recentIncidents.findIndex((i) => i._id === action.payload._id);
      if (recentIndex !== -1) {
        state.dashboardStats.recentIncidents[recentIndex] = action.payload;
      }
    },
    addNewIncident: (state, action) => {
      state.allIncidents.unshift(action.payload);
      state.dashboardStats.recentIncidents.unshift(action.payload);
      state.dashboardStats.total += 1;
      if (action.payload.severity === 'Critical') state.dashboardStats.critical += 1;
      state.dashboardStats.pending += 1; // Assuming new is pending
    },
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { setAllIncidents, updateIncidentStatus, addNewIncident, setDashboardStats, setLoading, setError } = staffSlice.actions;
export default staffSlice.reducer;
