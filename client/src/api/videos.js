import api from './axios'

export const videoApi = {
  getAll: (params) => api.get('/videos', { params }),

  getById: (videoId) => api.get(`/videos/${videoId}`),

  publish: (formData) =>
    api.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (videoId, formData) =>
    api.patch(`/videos/${videoId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (videoId) => api.delete(`/videos/${videoId}`),

  togglePublish: (videoId) => api.patch(`/videos/toggle/publish/${videoId}`),
}
