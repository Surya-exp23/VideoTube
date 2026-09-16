import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center gap-8 max-w-sm"
      >
        {/* Art */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.1 }}
        >
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer dashed ring */}
            <circle cx="80" cy="80" r="74" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="6 6"/>
            {/* Inner ring */}
            <circle cx="80" cy="80" r="52" stroke="#222" strokeWidth="1.5"/>
            {/* Screen */}
            <rect x="36" y="50" width="88" height="60" rx="8" stroke="#2a2a2a" strokeWidth="2"/>
            {/* Screen bezel top line */}
            <path d="M36 64h88" stroke="#222" strokeWidth="1.5"/>
            {/* Dot indicators */}
            <circle cx="47" cy="57" r="3" fill="#2a2a2a"/>
            <circle cx="58" cy="57" r="3" fill="#2a2a2a"/>
            {/* 404 text area */}
            <text x="80" y="98" textAnchor="middle" fontSize="22" fontWeight="700" fill="#2a2a2a" fontFamily="Inter,sans-serif">404</text>
            {/* Antenna */}
            <path d="M80 50V34" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="80" cy="30" r="4" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        <div className="flex flex-col gap-2">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white"
          >
            Page not found
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="text-sm text-[#606060] leading-relaxed"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/"
              className="block px-6 py-3 bg-white text-black font-semibold rounded-full text-sm hover:bg-[#e0e0e0] transition-colors"
            >
              Go home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <button
              onClick={() => history.back()}
              className="block px-6 py-3 bg-transparent text-[#a0a0a0] border border-[#2a2a2a] font-medium rounded-full text-sm hover:border-[#3a3a3a] hover:text-white transition-colors"
            >
              Go back
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
