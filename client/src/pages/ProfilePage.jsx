import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import Layout from '../components/layout/Layout'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { getErrorMessage } from '../utils/helpers'
import { SkeletonText, SkeletonAvatar } from '../components/ui/Skeletons'
import { InlineLoader } from '../components/ui/PageLoader'

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-[#a0a0a0] uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const { addToast } = useUIStore()
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { fullname: user?.fullname, email: user?.email },
  })
  const [tab, setTab] = useState('profile')

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  })

  const updateMutation = useMutation({
    mutationFn: (data) => authApi.updateAccount(data),
    onSuccess: (res) => {
      setUser(res.data.data)
      addToast({ type: 'success', message: 'Profile updated' })
    },
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data) => authApi.changePassword(data),
    onSuccess: () => addToast({ type: 'success', message: 'Password changed' }),
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  const updateAvatarMutation = useMutation({
    mutationFn: (file) => {
      const fd = new FormData()
      fd.append('avatar', file)
      return authApi.updateAvatar(fd)
    },
    onSuccess: (res) => {
      setUser(res.data.data)
      addToast({ type: 'success', message: 'Avatar updated' })
    },
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  const displayUser = currentUser || user

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>

          {/* Tab pills */}
          <div className="flex gap-1 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-1 w-fit">
            {['profile', 'password'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 text-sm rounded-lg font-medium transition-colors capitalize ${
                  tab === t ? 'bg-[#1a1a1a] text-white' : 'text-[#606060] hover:text-[#a0a0a0]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <div className="flex flex-col gap-6">
              {/* Avatar */}
              <Section title="Profile photo">
                {isLoading ? (
                  <div className="flex items-center gap-4">
                    <SkeletonAvatar size="xl" />
                    <SkeletonText lines={2} className="flex-1" />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer group relative">
                      <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden">
                        {displayUser?.avatar ? (
                          <img src={displayUser.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl text-[#3a3a3a] font-bold">
                            {displayUser?.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) updateAvatarMutation.mutate(file)
                        }}
                      />
                    </label>
                    <div>
                      <p className="text-sm font-medium text-white">{displayUser?.fullname}</p>
                      <p className="text-xs text-[#606060]">@{displayUser?.username}</p>
                      {updateAvatarMutation.isPending && (
                        <p className="text-xs text-[#606060] mt-1 flex items-center gap-1">
                          <InlineLoader size="sm" /> Uploading...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Section>

              {/* Details form */}
              <Section title="Account details">
                <form
                  onSubmit={handleSubmit((d) => updateMutation.mutate(d))}
                  className="flex flex-col gap-4"
                >
                  {[
                    { name: 'fullname', label: 'Full name', type: 'text' },
                    { name: 'email', label: 'Email', type: 'email' },
                  ].map(({ name, label, type }) => (
                    <div key={name}>
                      <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">{label}</label>
                      <input
                        type={type}
                        {...register(name, { required: true })}
                        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] focus:outline-none focus:border-[#3a3a3a] transition-all"
                      />
                    </div>
                  ))}
                  <motion.button
                    type="submit"
                    disabled={updateMutation.isPending}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="self-start flex items-center gap-2 bg-white text-black font-medium px-6 py-2.5 rounded-xl text-sm hover:bg-[#e0e0e0] disabled:opacity-60 transition-colors"
                  >
                    {updateMutation.isPending && <InlineLoader size="sm" />}
                    Save changes
                  </motion.button>
                </form>
              </Section>
            </div>
          )}

          {tab === 'password' && (
            <Section title="Change password">
              <form
                onSubmit={handleSubmit((d) => changePasswordMutation.mutate({ oldPassword: d.oldPassword, newPassword: d.newPassword }))}
                className="flex flex-col gap-4"
              >
                {[
                  { name: 'oldPassword', label: 'Current password' },
                  { name: 'newPassword', label: 'New password' },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">{label}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register(name, { required: true, minLength: 6 })}
                      className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] placeholder-[#3a3a3a] focus:outline-none focus:border-[#3a3a3a] transition-all"
                    />
                  </div>
                ))}
                <motion.button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="self-start flex items-center gap-2 bg-white text-black font-medium px-6 py-2.5 rounded-xl text-sm hover:bg-[#e0e0e0] disabled:opacity-60 transition-colors"
                >
                  {changePasswordMutation.isPending && <InlineLoader size="sm" />}
                  Update password
                </motion.button>
              </form>
            </Section>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
