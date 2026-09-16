import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import WatchPage from './pages/WatchPage'
import ChannelPage from './pages/ChannelPage'
import UploadPage from './pages/UploadPage'
import ProfilePage from './pages/ProfilePage'
import PlaylistsPage from './pages/PlaylistsPage'
import LikedVideosPage from './pages/LikedVideosPage'
import TweetsPage from './pages/TweetsPage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/common/ProtectedRoute'

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

export default function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Public — guest landing or authenticated feed */}
      <Route
        path="/"
        element={isAuthenticated ? <HomePage /> : <LandingPage />}
      />

      {/* Auth pages — redirect away if already logged in */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Public pages */}
      <Route path="/watch/:videoId" element={<WatchPage />} />
      <Route path="/channel/:userId" element={<ChannelPage />} />

      {/* Protected pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/liked" element={<LikedVideosPage />} />
        <Route path="/tweets" element={<TweetsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
