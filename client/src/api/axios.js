import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Refresh token on 401
let isRefreshing = false
let queue = []

const processQueue = (error) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()))
  queue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        })
          .then(() => api(original))
          .catch((e) => Promise.reject(e))
      }

      original._retry = true
      isRefreshing = true

      try {
        await api.post('/users/refresh-token')
        processQueue(null)
        return api(original)
      } catch (e) {
        processQueue(e)
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
