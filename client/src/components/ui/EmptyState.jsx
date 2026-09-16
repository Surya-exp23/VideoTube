import { motion } from 'framer-motion'

const illustrations = {
  empty: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
      <circle cx="60" cy="60" r="40" stroke="#2a2a2a" strokeWidth="2"/>
      <path d="M45 60h30M60 45v30" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="60" cy="60" r="55" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="4 4"/>
    </svg>
  ),
  notFound: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
      <rect x="20" y="30" width="80" height="60" rx="6" stroke="#2a2a2a" strokeWidth="2"/>
      <path d="M20 44h80" stroke="#2a2a2a" strokeWidth="2"/>
      <circle cx="30" cy="37" r="3" fill="#3a3a3a"/>
      <circle cx="40" cy="37" r="3" fill="#3a3a3a"/>
      <path d="M50 70l6-6m0 0l6 6m-6-6v12" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  error: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
      <path d="M60 20L100 90H20L60 20Z" stroke="#2a2a2a" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M60 55v15" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="60" cy="78" r="2" fill="#3a3a3a"/>
    </svg>
  ),
  noVideos: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
      <rect x="15" y="35" width="90" height="55" rx="8" stroke="#2a2a2a" strokeWidth="2"/>
      <path d="M50 52l20 10.5L50 73V52z" stroke="#3a3a3a" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M35 20l50 0" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M45 14l30 0" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

export default function EmptyState({
  type = 'empty',
  title = 'Nothing here yet',
  description = '',
  action,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-5 py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {illustrations[type] || illustrations.empty}
      </motion.div>

      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="text-lg font-semibold text-[#f5f5f5]">{title}</h3>
        {description && (
          <p className="text-sm text-[#606060] leading-relaxed">{description}</p>
        )}
      </div>

      {action && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          className="mt-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-[#e0e0e0] transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
