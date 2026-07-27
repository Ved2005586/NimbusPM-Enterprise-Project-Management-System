import api from './api';

const sprintService = {
  getByProject: (projectId) => api.get(`/sprints/project/${projectId}`).then((r) => r.data.data),
  getById: (id) => api.get(`/sprints/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/sprints', payload).then((r) => r.data.data),
  start: (id) => api.patch(`/sprints/${id}/start`).then((r) => r.data.data),
  complete: (id) => api.patch(`/sprints/${id}/complete`).then((r) => r.data.data),
};

export default sprintService;
