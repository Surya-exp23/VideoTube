import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { getErrorMessage } from '../utils/helpers'
import { InlineLoader } from '../components/ui/PageLoader'

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.3 } }),
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { setUser } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authApi.login(data)
      setUser(res.data.data.user)
      addToast({ type: 'success', message: 'Welcome back!' })
      navigate('/')
    } catch (err) {
      addToast({ type: 'error', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 mb-10"
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M3 3l8 4-8 4V3z" fill="black"/>
              </svg>
            </div>
            <span className="font-semibold text-lg">VideoTube</span>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-[#606060] mt-1">Sign in to your account</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          initial="hidden"
          animate="show"
        >
          {[
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', i: 0 },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', i: 1 },
          ].map(({ name, label, type, placeholder, i }) => (
            <motion.div key={name} custom={i} variants={fieldVariants}>
              <label className="text-xs text-[#a0a0a0] font-medium mb-1.5 block">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                {...register(name, { required: `${label} is required` })}
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] placeholder-[#3a3a3a] focus:outline-none focus:border-[#3a3a3a] focus:bg-[#161616] transition-all"
              />
              {errors[name] && (
                <p className="text-xs text-red-400 mt-1">{errors[name].message}</p>
              )}
            </motion.div>
          ))}

          <motion.div custom={2} variants={fieldVariants} className="pt-1">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-[#e0e0e0] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <InlineLoader size="sm" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-[#606060] mt-6"
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-[#a0a0a0] hover:text-white transition-colors">
            Sign up
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
