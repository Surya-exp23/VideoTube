import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/layout/Layout'
import { videoApi } from '../api/videos'
import { commentApi, likeApi, subscriptionApi } from '../api/social'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { formatViews, timeAgo, getErrorMessage } from '../utils/helpers'
import { SkeletonText, SkeletonAvatar } from '../components/ui/Skeletons'
import EmptyState from '../components/ui/EmptyState'
import { InlineLoader } from '../components/ui/PageLoader'

function CommentItem({ comment, onDelete, currentUserId }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const { addToast } = useUIStore()
  const qc = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: () => commentApi.updateComment(comment._id, { content: editText }),
    onSuccess: () => {
      qc.invalidateQueries(['comments', comment.video])
      setEditing(false)
    },
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  const isOwner = currentUserId && comment.owner?._id === currentUserId

  return (
    <div className="flex gap-3 group">
      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden shrink-0">
        {comment.owner?.avatar ? (
          <img src={comment.owner.avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#606060]">
            {comment.owner?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-[#a0a0a0]">@{comment.owner?.username}</span>
          <span className="text-xs text-[#3a3a3a]">{timeAgo(comment.createdAt)}</span>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-sm text-[#f5f5f5] focus:outline-none focus:border-[#3a3a3a]"
              autoFocus
            />
            <button
              onClick={() => updateMutation.mutate()}
              className="text-xs text-white bg-[#1a1a1a] px-3 py-1.5 rounded-lg hover:bg-[#252525]"
            >
              Save
            </button>
            <button onClick={() => setEditing(false)} className="text-xs text-[#606060]">
              Cancel
            </button>
          </div>
        ) : (
          <p className="text-sm text-[#d0d0d0] leading-relaxed">{comment.content}</p>
        )}
      </div>
      {isOwner && !editing && (
        <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-[#3a3a3a] hover:text-[#a0a0a0] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2l2 2-6 6H2V8l6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={() => onDelete(comment._id)}
            className="p-1 text-[#3a3a3a] hover:text-red-400 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 3h8M4 3V2h4v1M5 5v4M7 5v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default function WatchPage() {
  const { videoId } = useParams()
  const { user, isAuthenticated } = useAuthStore()
  const { addToast } = useUIStore()
  const [comment, setComment] = useState('')
  const [liked, setLiked] = useState(false)
  const qc = useQueryClient()

  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => videoApi.getById(videoId).then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  })

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', videoId],
    queryFn: () => commentApi.getVideoComments(videoId, { limit: 50 }).then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,
  })

  const addCommentMutation = useMutation({
    mutationFn: () => commentApi.addComment(videoId, { content: comment }),
    onSuccess: () => {
      qc.invalidateQueries(['comments', videoId])
      setComment('')
    },
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (id) => commentApi.deleteComment(id),
    onSuccess: () => qc.invalidateQueries(['comments', videoId]),
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  const likeMutation = useMutation({
    mutationFn: () => likeApi.toggleVideoLike(videoId),
    onSuccess: (res) => setLiked(res.data.data.liked),
  })

  const comments = commentsData?.docs || commentsData || []

  if (videoLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="skeleton w-full aspect-video rounded-2xl" />
            <SkeletonText lines={2} />
            <div className="flex gap-3 items-center">
              <SkeletonAvatar size="md" />
              <SkeletonText lines={2} className="flex-1" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!video) {
    return (
      <Layout>
        <EmptyState type="notFound" title="Video not found" description="This video may have been removed or never existed." />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — player + info */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full aspect-video rounded-2xl overflow-hidden bg-black"
          >
            <video
              src={video.videofile}
              controls
              className="w-full h-full object-contain"
              poster={video.thumbnail}
            />
          </motion.div>

          {/* Title & meta */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-3">
            <h1 className="text-xl font-semibold text-white leading-snug">{video.title}</h1>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Link to={`/channel/${video.owner?._id || video.owner}`}>
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden">
                    {video.ownerAvatar ? (
                      <img src={video.ownerAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-[#606060]">
                        {video.ownerName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                </Link>
                <div>
                  <Link to={`/channel/${video.owner?._id || video.owner}`} className="text-sm font-medium text-[#f5f5f5] hover:text-white">
                    {video.ownerName || 'Unknown'}
                  </Link>
                  <p className="text-xs text-[#606060]">{formatViews(video.views)} views • {timeAgo(video.createdAt)}</p>
                </div>
              </div>

              {isAuthenticated && (
                <motion.button
                  onClick={() => likeMutation.mutate()}
                  whileTap={{ scale: 0.9 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    liked ? 'bg-white text-black border-white' : 'bg-transparent text-[#a0a0a0] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill={liked ? 'currentColor' : 'none'}>
                    <path d="M7 12s-5.5-3.5-5.5-7A3 3 0 017 3a3 3 0 015.5 2C12.5 8.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  Like
                </motion.button>
              )}
            </div>

            {/* Description */}
            {video.description && (
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3">
                <p className="text-sm text-[#a0a0a0] leading-relaxed">{video.description}</p>
              </div>
            )}
          </motion.div>

          {/* Comments */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-[#f5f5f5]">
              Comments{comments.length ? ` (${comments.length})` : ''}
            </h2>

            {isAuthenticated && (
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
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && comment.trim()) {
                        e.preventDefault()
                        addCommentMutation.mutate()
                      }
                    }}
                    placeholder="Add a comment..."
                    className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-[#f5f5f5] placeholder-[#3a3a3a] focus:outline-none focus:border-[#3a3a3a] transition-all"
                  />
                  {comment.trim() && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setComment('')} className="text-xs text-[#606060] px-3 py-1.5">
                        Cancel
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => addCommentMutation.mutate()}
                        disabled={addCommentMutation.isPending}
                        className="text-xs bg-white text-black font-medium px-4 py-1.5 rounded-full hover:bg-[#e0e0e0] disabled:opacity-60 flex items-center gap-1.5"
                      >
                        {addCommentMutation.isPending && <InlineLoader size="sm" />}
                        Comment
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {commentsLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="skeleton w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="skeleton h-3 w-24 rounded" />
                      <div className="skeleton h-3 w-full rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length ? (
              <div className="flex flex-col gap-5">
                <AnimatePresence>
                  {comments.map((c) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CommentItem
                        comment={c}
                        currentUserId={user?._id}
                        onDelete={(id) => deleteCommentMutation.mutate(id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-sm text-[#606060]">No comments yet. Be the first!</p>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}
