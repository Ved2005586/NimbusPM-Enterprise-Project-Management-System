import api from './api';

const taskService = {
  getByProject: (projectId) => api.get(`/tasks/project/${projectId}`).then((r) => r.data.data),
  getById: (id) => api.get(`/tasks/${id}`).then((r) => r.data.data),
  create: (payload) => api.post('/tasks', payload).then((r) => r.data.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((r) => r.data.data),
  updateStatus: (id, payload) => api.patch(`/tasks/${id}/status`, payload).then((r) => r.data.data),
  assign: (id, userId) => api.patch(`/tasks/${id}/assign/${userId}`).then((r) => r.data.data),
  addComment: (id, content) => api.post(`/tasks/${id}/comments`, { content }).then((r) => r.data.data),
  getComments: (id) => api.get(`/tasks/${id}/comments`).then((r) => r.data.data),
  search: (query) => api.get('/tasks/search', { params: { query } }).then((r) => r.data.data),
  uploadAttachment: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api
      .post(`/tasks/${id}/attachments`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data.data);
  },
  getAttachments: (id) => api.get(`/tasks/${id}/attachments`).then((r) => r.data.data),
};

export default taskService;
