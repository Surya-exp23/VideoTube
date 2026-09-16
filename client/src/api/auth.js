import api from './axios'

export const authApi = {
  register: (formData) =>
    api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  login: (data) => api.post('/users/login', data),

  logout: () => api.post('/users/logout'),

  getCurrentUser: () => api.get('/users/current-user'),

  updateAccount: (data) => api.patch('/users/update-account', data),

  changePassword: (data) => api.post('/users/change-password', data),

  updateAvatar: (formData) =>
    api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateCoverImage: (formData) =>
    api.patch('/users/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
