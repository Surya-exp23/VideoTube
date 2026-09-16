import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { authApi } from '../../api/auth'
import { getErrorMessage } from '../../utils/helpers'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { toggleSidebar, addToast } = useUIStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/?q=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (_) {
      // silent — still clear local state
    }
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-black/90 backdrop-blur-sm border-b border-[#1a1a1a] flex items-center px-4 gap-4">
      {/* Left — hamburger + logo */}
      <div className="flex items-center gap-3 shrink-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.button>

        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 4-8 4V3z" fill="black"/>
            </svg>
          </div>
          <span className="font-semibold text-[15px] tracking-tight hidden sm:block">VideoTube</span>
        </Link>
      </div>

      {/* Center — search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos..."
            className="w-full bg-[#111] border border-[#2a2a2a] rounded-full px-4 py-2 pl-4 pr-10 text-sm text-[#f5f5f5] placeholder-[#606060] focus:outline-none focus:border-[#3a3a3a] focus:bg-[#161616] transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606060] hover:text-white transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </form>

      {/* Right — auth */}
      <div className="shrink-0 flex items-center gap-2">
        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen((p) => !p)}
              className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden flex items-center justify-center"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-[#a0a0a0]">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-52 bg-[#111] border border-[#2a2a2a] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[#1a1a1a]">
                    <p className="text-sm font-medium text-[#f5f5f5]">{user?.fullname}</p>
                    <p className="text-xs text-[#606060]">@{user?.username}</p>
                  </div>
                  {[
                    { label: 'Profile', to: '/profile' },
                    { label: 'My Channel', to: `/channel/${user?._id}` },
                    { label: 'Upload Video', to: '/upload' },
                    { label: 'Liked Videos', to: '/liked' },
                  ].map(({ label, to }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#1a1a1a] transition-colors border-t border-[#1a1a1a]"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm text-[#a0a0a0] hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 text-sm bg-white text-black font-medium rounded-full hover:bg-[#e0e0e0] transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
