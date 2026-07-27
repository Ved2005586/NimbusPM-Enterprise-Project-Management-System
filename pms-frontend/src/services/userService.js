import api from './api';

const userService = {
  getMe: () => api.get('/users/me').then((r) => r.data.data),
  updateMe: (payload) => api.patch('/users/me', payload).then((r) => r.data.data),
  updatePreferences: (payload) => api.patch('/users/me/preferences', payload).then((r) => r.data.data),
  getById: (id) => api.get(`/users/${id}`).then((r) => r.data.data),
  getAll: () => api.get('/users').then((r) => r.data.data),
  search: (query) => api.get('/users/search', { params: { query } }).then((r) => r.data.data),
  deactivate: (id) => api.patch(`/users/${id}/deactivate`).then((r) => r.data.data),
  activate: (id) => api.patch(`/users/${id}/activate`).then((r) => r.data.data),
  remove: (id) => api.delete(`/users/${id}`).then((r) => r.data.data),
};

export default userService;