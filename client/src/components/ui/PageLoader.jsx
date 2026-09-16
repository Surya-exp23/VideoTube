import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-[#2a2a2a] border-t-white rounded-full"
        />
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[#606060] tracking-wider uppercase font-medium"
        >
          Loading
        </motion.p>
      </div>
    </motion.div>
  )
}

export function InlineLoader({ size = 'sm' }) {
  const s = size === 'sm' ? 'w-4 h-4 border-[1.5px]' : 'w-6 h-6 border-2'
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className={`${s} border-[#2a2a2a] border-t-white rounded-full`}
    />
  )
}
