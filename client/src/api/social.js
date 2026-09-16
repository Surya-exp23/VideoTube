import api from './axios'

export const commentApi = {
  getVideoComments: (videoId, params) =>
    api.get(`/comments/${videoId}`, { params }),

  addComment: (videoId, data) => api.post(`/comments/${videoId}`, data),

  updateComment: (commentId, data) =>
    api.patch(`/comments/c/${commentId}`, data),

  deleteComment: (commentId) => api.delete(`/comments/c/${commentId}`),
}

export const likeApi = {
  toggleVideoLike: (videoId) => api.post(`/likes/toggle/v/${videoId}`),
  toggleCommentLike: (commentId) => api.post(`/likes/toggle/c/${commentId}`),
  toggleTweetLike: (tweetId) => api.post(`/likes/toggle/t/${tweetId}`),
  getLikedVideos: () => api.get('/likes/videos'),
}

export const subscriptionApi = {
  toggle: (channelId) => api.post(`/subscriptions/c/${channelId}`),
  getSubscribers: (channelId) => api.get(`/subscriptions/c/${channelId}`),
  getSubscribedChannels: (userId) => api.get(`/subscriptions/u/${userId}`),
}

export const playlistApi = {
  create: (data) => api.post('/playlists', data),
  getById: (playlistId) => api.get(`/playlists/${playlistId}`),
  getUserPlaylists: (userId) => api.get(`/playlists/user/${userId}`),
  update: (playlistId, data) => api.patch(`/playlists/${playlistId}`, data),
  delete: (playlistId) => api.delete(`/playlists/${playlistId}`),
  addVideo: (videoId, playlistId) =>
    api.patch(`/playlists/add/${videoId}/${playlistId}`),
  removeVideo: (videoId, playlistId) =>
    api.patch(`/playlists/remove/${videoId}/${playlistId}`),
}

export const tweetApi = {
  create: (data) => api.post('/tweets', data),
  getUserTweets: (userId) => api.get(`/tweets/user/${userId}`),
  update: (tweetId, data) => api.patch(`/tweets/${tweetId}`, data),
  delete: (tweetId) => api.delete(`/tweets/${tweetId}`),
}
