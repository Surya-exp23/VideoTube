import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'
import { subscriptionApi } from '../api/social'
import { useAuthStore } from '../store/authStore'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonAvatar, SkeletonText } from '../components/ui/Skeletons'

export default function SubscriptionsPage() {
  const { user } = useAuthStore()

  const { data: channels, isLoading } = useQuery({
    queryKey: ['subscriptions', user?._id],
    queryFn: () => subscriptionApi.getSubscribedChannels(user._id).then((r) => r.data.data),
    enabled: !!user,
    staleTime: 3 * 60 * 1000,
  })

  return (
    <Layout>
      <div className="px-6 py-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Subscriptions</h1>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl">
                <SkeletonAvatar size="lg" />
                <SkeletonText lines={2} className="flex-1" />
              </div>
            ))}
          </div>
        ) : !channels?.length ? (
          <EmptyState
            type="empty"
            title="No subscriptions"
            description="Channels you subscribe to will appear here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {channels.map((item, i) => {
              const ch = item.channelDetails
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/channel/${ch._id}`}
                    className="flex items-center gap-4 p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl hover:border-[#2a2a2a] hover:bg-[#111] transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden shrink-0">
                      {ch.avatar ? (
                        <img src={ch.avatar} alt={ch.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg text-[#3a3a3a] font-bold">
                          {ch.username?.[0]?.toUpperCase() || 'C'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#f5f5f5] group-hover:text-white transition-colors">
                        {ch.fullname || ch.username}
                      </p>
                      <p className="text-xs text-[#606060]">@{ch.username}</p>
                    </div>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      className="text-[#2a2a2a] group-hover:text-[#606060] transition-colors"
                    >
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
