import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/layout/Layout'
import { tweetApi, likeApi } from '../api/social'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { timeAgo, getErrorMessage } from '../utils/helpers'
import EmptyState from '../components/ui/EmptyState'
import { InlineLoader } from '../components/ui/PageLoader'

function TweetCard({ tweet, currentUserId, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(tweet.content)
  const [liked, setLiked] = useState(false)
  const { addToast } = useUIStore()

  const likeMutation = useMutation({
    mutationFn: () => likeApi.toggleTweetLike(tweet._id),
    onSuccess: (res) => setLiked(res.data.data.liked),
  })

  const isOwner = currentUserId && tweet.owner?._id === currentUserId

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden">
            {tweet.owner?.avatar ? (
              <img src={tweet.owner.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#606060]">
                {tweet.owner?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-[#a0a0a0]">@{tweet.owner?.username}</p>
            <p className="text-xs text-[#3a3a3a]">{timeAgo(tweet.createdAt)}</p>
          </div>
        </div>
        {isOwner && !editing && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-[#3a3a3a] hover:text-[#a0a0a0] rounded-lg hover:bg-[#1a1a1a] transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2l2 2-6 6H2V8l6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              onClick={() => onDelete(tweet._id)}
              className="p-1.5 text-[#3a3a3a] hover:text-red-400 rounded-lg hover:bg-[#1a1a1a] transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M4 3V2h4v1M5 5v4M7 5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-[#f5f5f5] focus:outline-none focus:border-[#3a3a3a] resize-none"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(false)} className="text-xs text-[#606060] px-3 py-1.5">
              Cancel
            </button>
            <button
              onClick={() => {
                onUpdate(tweet._id, editText)
                setEditing(false)
              }}
              className="text-xs bg-white text-black px-4 py-1.5 rounded-lg font-medium"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#d0d0d0] leading-relaxed">{tweet.content}</p>
      )}

      {/* Like */}
      <div className="flex items-center pt-1 border-t border-[#1a1a1a]">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => likeMutation.mutate()}
          className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-white' : 'text-[#3a3a3a] hover:text-[#606060]'}`}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill={liked ? 'currentColor' : 'none'}>
            <path d="M6.5 11S1 7.5 1 4.5a3 3 0 015.5-1.5A3 3 0 0112 4.5C12 7.5 6.5 11 6.5 11z" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          Like
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function TweetsPage() {
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  const qc = useQueryClient()
  const [content, setContent] = useState('')

  const { data: tweets, isLoading } = useQuery({
    queryKey: ['tweets', user?._id],
    queryFn: () => tweetApi.getUserTweets(user._id).then((r) => r.data.data),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: () => tweetApi.create({ content }),
    onSuccess: () => {
      qc.invalidateQueries(['tweets'])
      setContent('')
      addToast({ type: 'success', message: 'Tweet posted!' })
    },
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => tweetApi.delete(id),
    onSuccess: () => qc.invalidateQueries(['tweets']),
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, content }) => tweetApi.update(id, { content }),
    onSuccess: () => qc.invalidateQueries(['tweets']),
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Community</h1>

        {/* Compose */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 mb-6 flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#606060]">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something with your community..."
              rows={3}
              className="flex-1 bg-transparent text-sm text-[#f5f5f5] placeholder-[#3a3a3a] focus:outline-none resize-none"
            />
          </div>
          {content.trim() && (
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-[#e0e0e0] disabled:opacity-60 transition-colors"
              >
                {createMutation.isPending && <InlineLoader size="sm" />}
                Post
              </motion.button>
            </div>
          )}
        </div>

        {/* Feed */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-xl" />
            ))}
          </div>
        ) : !tweets?.length ? (
          <EmptyState
            type="empty"
            title="Nothing posted yet"
            description="Share thoughts, updates, or questions with your community."
          />
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {tweets.map((tweet) => (
                <TweetCard
                  key={tweet._id}
                  tweet={tweet}
                  currentUserId={user?._id}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onUpdate={(id, content) => updateMutation.mutate({ id, content })}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  )
}
