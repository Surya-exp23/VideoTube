import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 4-8 4V3z" fill="black"/>
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight">VideoTube</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-[#a0a0a0] hover:text-white transition-colors px-3 py-2">
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm bg-white text-black font-medium px-5 py-2 rounded-full hover:bg-[#e0e0e0] transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6 max-w-3xl"
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a2a2a] bg-[#111] text-xs text-[#a0a0a0]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
            A minimal video experience
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-none text-white">
            Watch, share,
            <br />
            <span className="text-[#3a3a3a]">create.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#606060] leading-relaxed max-w-xl">
            VideoTube is a clean, distraction-free platform for sharing and discovering video content.
            No clutter — just great videos.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-[#e0e0e0] transition-colors"
              >
                Start watching
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="px-8 py-3.5 bg-transparent text-white border border-[#2a2a2a] font-medium rounded-full text-sm hover:border-[#3a3a3a] hover:bg-[#111] transition-colors"
              >
                Sign in
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl mt-4"
        >
          <div className="w-full aspect-video rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
            {/* Fake UI */}
            <div className="w-full h-full flex flex-col p-4 gap-4">
              <div className="flex gap-3 items-center">
                <div className="skeleton w-6 h-6 rounded-full" />
                <div className="skeleton h-3 w-24 rounded" />
                <div className="ml-auto skeleton h-6 w-16 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-3 flex-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="skeleton aspect-video rounded-lg" style={{ animationDelay: `${i * 0.2}s` }} />
                    <div className="skeleton h-2.5 rounded" style={{ animationDelay: `${i * 0.2 + 0.1}s` }} />
                    <div className="skeleton h-2 w-3/4 rounded" style={{ animationDelay: `${i * 0.2 + 0.2}s` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </main>
    </div>
  )
}
