import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import sprintReducer from './slices/sprintSlice';
import notificationReducer from './slices/notificationSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    projects: projectReducer,
    tasks: taskReducer,
    sprints: sprintReducer,
    notifications: notificationReducer,
    users: userReducer,
  },
});
