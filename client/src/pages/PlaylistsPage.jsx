import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import { playlistApi } from '../api/social'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { getErrorMessage } from '../utils/helpers'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonGrid } from '../components/ui/Skeletons'
import { InlineLoader } from '../components/ui/PageLoader'

function CreatePlaylistModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { addToast } = useUIStore()
  const qc = useQueryClient()

  const createMutation = useMutation({
    mutationFn: () => playlistApi.create({ name, description }),
    onSuccess: () => {
      qc.invalidateQueries(['playlists'])
      addToast({ type: 'success', message: 'Playlist created!' })
      onClose()
    },
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-white mb-5">New playlist</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My playlist"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] placeholder-[#3a3a3a] focus:outline-none focus:border-[#3a3a3a] transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What's this playlist about?"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] placeholder-[#3a3a3a] focus:outline-none focus:border-[#3a3a3a] transition-all resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end mt-1">
            <button onClick={onClose} className="px-5 py-2.5 text-sm text-[#606060] hover:text-white transition-colors">
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => createMutation.mutate()}
              disabled={!name.trim() || !description.trim() || createMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-[#e0e0e0] disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending && <InlineLoader size="sm" />}
              Create
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PlaylistsPage() {
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists', user?._id],
    queryFn: () => playlistApi.getUserPlaylists(user._id).then((r) => r.data.data),
    enabled: !!user,
    staleTime: 3 * 60 * 1000,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => playlistApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(['playlists'])
      addToast({ type: 'success', message: 'Playlist deleted' })
    },
    onError: (err) => addToast({ type: 'error', message: getErrorMessage(err) }),
  })

  return (
    <Layout>
      <AnimatePresence>
        {showModal && <CreatePlaylistModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Playlists</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-[#e0e0e0] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New playlist
          </motion.button>
        </div>

        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : !playlists?.length ? (
          <EmptyState
            type="empty"
            title="No playlists yet"
            description="Create a playlist to organize your favorite videos."
            action={{ label: 'Create playlist', onClick: () => setShowModal(true) }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {playlists.map((pl, i) => (
              <motion.div
                key={pl._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden hover:border-[#2a2a2a] transition-colors"
              >
                <Link to={`/playlists/${pl._id}`} className="block">
                  <div className="aspect-video bg-[#1a1a1a] flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M4 8h24M4 14h16M4 20h20" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M22 20l8 4-8 4V20z" stroke="#2a2a2a" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-[#f5f5f5] truncate">{pl.name}</p>
                    <p className="text-xs text-[#606060] mt-0.5 line-clamp-1">{pl.description}</p>
                  </div>
                </Link>
                <div className="px-3 pb-3 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      deleteMutation.mutate(pl._id)
                    }}
                    className="text-xs text-[#3a3a3a] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  )
}
