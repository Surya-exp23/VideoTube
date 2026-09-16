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
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.3 } }),
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const { setUser } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setAvatarPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('fullname', data.fullname)
      formData.append('email', data.email)
      formData.append('username', data.username)
      formData.append('password', data.password)
      if (data.avatar?.[0]) formData.append('avatar', data.avatar[0])
      if (data.coverImage?.[0]) formData.append('coverImage', data.coverImage[0])

      await authApi.register(formData)

      // Auto login after register
      const loginRes = await authApi.login({ email: data.email, password: data.password })
      setUser(loginRes.data.data.user)
      addToast({ type: 'success', message: 'Account created! Welcome aboard.' })
      navigate('/')
    } catch (err) {
      addToast({ type: 'error', message: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'fullname', label: 'Full name', type: 'text', placeholder: 'Your name', i: 0 },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'yourhandle', i: 1 },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', i: 2 },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', i: 3, min: 6 },
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 mb-8"
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
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="text-sm text-[#606060] mt-1">Join VideoTube today</p>
          </div>
        </motion.div>

        {/* Avatar picker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-5"
        >
          <label className="cursor-pointer group relative">
            <div className="w-16 h-16 rounded-full bg-[#111] border-2 border-dashed border-[#2a2a2a] group-hover:border-[#3a3a3a] overflow-hidden flex items-center justify-center transition-colors">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="3.5" stroke="#3a3a3a" strokeWidth="1.5"/>
                  <path d="M3 18c0-4 3.134-7 7-7s7 3 7 7" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 2v6M2 5h6" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              {...register('avatar')}
              onChange={handleAvatarChange}
            />
          </label>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3.5"
          initial="hidden"
          animate="show"
        >
          {fields.map(({ name, label, type, placeholder, i, min }) => (
            <motion.div key={name} custom={i} variants={fieldVariants}>
              <label className="text-xs text-[#a0a0a0] font-medium mb-1.5 block">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                {...register(name, {
                  required: `${label} is required`,
                  ...(min ? { minLength: { value: min, message: `Min ${min} characters` } } : {}),
                })}
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] placeholder-[#3a3a3a] focus:outline-none focus:border-[#3a3a3a] focus:bg-[#161616] transition-all"
              />
              {errors[name] && (
                <p className="text-xs text-red-400 mt-1">{errors[name].message}</p>
              )}
            </motion.div>
          ))}

          <motion.div custom={4} variants={fieldVariants} className="pt-1">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-[#e0e0e0] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <InlineLoader size="sm" />}
              {loading ? 'Creating account...' : 'Create account'}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-[#606060] mt-6"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-[#a0a0a0] hover:text-white transition-colors">
            Sign in
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
