import api from './api';

const notificationService = {
  getAll: (page = 0, size = 10) =>
    api.get('/notifications', { params: { page, size } }).then((r) => r.data.data),
  unreadCount: () => api.get('/notifications/unread-count').then((r) => r.data.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data.data),
};

export default notificationService;
