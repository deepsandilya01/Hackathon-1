import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  incidents: [],
  currentIncident: null,
  loading: false,
  error: null,
};

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setIncidents: (state, action) => {
      state.incidents = action.payload;
    },
    addIncident: (state, action) => {
      state.incidents.unshift(action.payload);
    },
    updateIncident: (state, action) => {
      const index = state.incidents.findIndex((i) => i._id === action.payload._id);
      if (index !== -1) {
        state.incidents[index] = { ...state.incidents[index], ...action.payload };
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { setIncidents, addIncident, updateIncident, setLoading, setError } = incidentSlice.actions;
export default incidentSlice.reducer;
