import { AnimatePresence, motion } from 'framer-motion'
import { useUIStore } from '../../store/uiStore'

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="pointer-events-auto"
          >
            <div
              className={`flex items-start gap-3 min-w-[280px] max-w-[360px] px-4 py-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] border cursor-pointer ${
                toast.type === 'error'
                  ? 'bg-[#1a0a0a] border-[#3d1515] text-red-300'
                  : toast.type === 'success'
                  ? 'bg-[#0a1a0a] border-[#153d15] text-green-300'
                  : 'bg-[#111] border-[#2a2a2a] text-[#f5f5f5]'
              }`}
              onClick={() => removeToast(toast.id)}
            >
              <span className="text-lg leading-none mt-0.5">
                {toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'ℹ'}
              </span>
              <p className="text-sm leading-snug">{toast.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
