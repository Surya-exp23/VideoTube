import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import VideoGrid from '../components/video/VideoGrid'
import { videoApi } from '../api/videos'
import { subscriptionApi } from '../api/social'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { SkeletonChannelHeader } from '../components/ui/Skeletons'
import { getErrorMessage } from '../utils/helpers'
import { authApi } from '../api/auth'

export default function ChannelPage() {
  const { userId } = useParams()
  const { user: currentUser, isAuthenticated } = useAuthStore()
  const { addToast } = useUIStore()
  const qc = useQueryClient()

  const { data: channel, isLoading: channelLoading } = useQuery({
    queryKey: ['channel', userId],
    queryFn: () => authApi.getCurrentUser().then((r) => r.data.data),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })

  const { data: videosData, isLoading: videosLoading } = useQuery({
    queryKey: ['videos', 'channel', userId],
    queryFn: () => videoApi.getAll({ userId, limit: 24 }).then((r) => r.data.data),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })

  const { data: subsData } = useQuery({
    queryKey: ['subscribers', userId],
    queryFn: () => subscriptionApi.getSubscribers(userId).then((r) => r.data.data),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  })

  const subMutation = useMutation({
    mutationFn: () => subscriptionApi.toggle(userId),
    onSuccess: () => {
      qc.invalidateQueries(['subscribers', userId])
      addToast({ type: 'success', message: 'Subscription updated' })
    },
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  const isOwner = currentUser?._id === userId
  const subscriberCount = Array.isArray(subsData) ? subsData.length : 0
  const videos = videosData?.docs || videosData || []

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        {channelLoading ? (
          <div className="mb-8">
            <SkeletonChannelHeader />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            {/* Cover */}
            <div className="w-full h-44 rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] overflow-hidden mb-0">
              {channel?.coverImage ? (
                <img src={channel.coverImage} alt="cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#111] to-[#0a0a0a]" />
              )}
            </div>

            {/* Profile row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-4 -mt-10">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border-4 border-black overflow-hidden shrink-0">
                  {channel?.avatar ? (
                    <img src={channel.avatar} alt={channel.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-[#3a3a3a] font-bold">
                      {channel?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="pb-2">
                  <h1 className="text-xl font-bold text-white">{channel?.fullname || 'Channel'}</h1>
                  <p className="text-sm text-[#606060]">@{channel?.username} • {subscriberCount} subscribers</p>
                </div>
              </div>

              {isAuthenticated && !isOwner && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => subMutation.mutate()}
                  disabled={subMutation.isPending}
                  className="mb-2 px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-[#e0e0e0] disabled:opacity-60 transition-colors"
                >
                  {subMutation.isPending ? '...' : 'Subscribe'}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Videos */}
        <div className="pb-10">
          <h2 className="text-base font-semibold text-[#f5f5f5] mb-4">Videos</h2>
          <VideoGrid videos={videos} isLoading={videosLoading} />
        </div>
      </div>
    </Layout>
  )
}
