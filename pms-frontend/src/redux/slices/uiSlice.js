import { createSlice } from '@reduxjs/toolkit';

const storedMode = typeof window !== 'undefined' ? localStorage.getItem('nimbus-theme-mode') : null;

const initialState = {
  themeMode: storedMode || 'light',
  sidebarOpen: true,
  toast: null, // { message, severity }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleThemeMode(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('nimbus-theme-mode', state.themeMode);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    showToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const { toggleThemeMode, toggleSidebar, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
