import api from './api';

const projectService = {
  getAll: () => api.get('/projects').then((r) => r.data.data),
  getById: (id) => api.get(`/projects/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/projects', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/projects/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/projects/${id}`).then((r) => r.data.data),
  archive: (id) => api.patch(`/projects/${id}/archive`).then((r) => r.data.data),
  search: (query) => api.get('/projects/search', { params: { query } }).then((r) => r.data.data),
  addMember: (id, payload) => api.post(`/projects/${id}/members`, payload).then((r) => r.data.data),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`).then((r) => r.data.data),
};

export default projectService;
