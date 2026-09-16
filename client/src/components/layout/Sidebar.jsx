import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  {
    label: 'Home',
    to: '/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 7.5L9 2l7 5.5V16a1 1 0 01-1 1H3a1 1 0 01-1-1V7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M6 17v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Subscriptions',
    to: '/subscriptions',
    auth: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 7.5l5 2-5 2V7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Liked Videos',
    to: '/liked',
    auth: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 15s-7-4.5-7-8.5A4 4 0 019 4a4 4 0 017 2.5C16 10.5 9 15 9 15z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Playlists',
    to: '/playlists',
    auth: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 5h14M2 9h10M2 13h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 10l4 2-4 2v-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Community',
    to: '/tweets',
    auth: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 3h12a1 1 0 011 1v8a1 1 0 01-1 1H6l-4 3V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Upload',
    to: '/upload',
    auth: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 12V6M6 9l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { sidebarOpen } = useUIStore()
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  const visibleItems = navItems.filter((item) => !item.auth || isAuthenticated)

  return (
    <AnimatePresence initial={false}>
      {sidebarOpen && (
        <motion.aside
          key="sidebar"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 220, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-0 top-14 bottom-0 z-30 overflow-hidden bg-black border-r border-[#111]"
        >
          <nav className="flex flex-col gap-1 px-3 pt-4 w-[220px]">
            {visibleItems.map(({ label, to, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-[#1a1a1a] text-white font-medium'
                      : 'text-[#606060] hover:text-[#a0a0a0] hover:bg-[#111]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-white' : ''}>{icon}</span>
                    <span className="whitespace-nowrap">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
