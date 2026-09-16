import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ToastContainer from '../ui/ToastContainer'
import { useUIStore } from '../../store/uiStore'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}

export default function Layout({ children }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Sidebar />
      <motion.main
        animate={{ marginLeft: sidebarOpen ? 220 : 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="pt-14 min-h-screen"
      >
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      </motion.main>
      <ToastContainer />
    </div>
  )
}

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <ToastContainer />
      {children}
    </div>
  )
}
