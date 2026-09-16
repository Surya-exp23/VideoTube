import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import Layout from '../components/layout/Layout'
import { videoApi } from '../api/videos'
import { useUIStore } from '../store/uiStore'
import { getErrorMessage } from '../utils/helpers'
import { InlineLoader } from '../components/ui/PageLoader'

export default function UploadPage() {
  const { addToast } = useUIStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [videoPreview, setVideoPreview] = useState(null)
  const [thumbPreview, setThumbPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef(null)

  const uploadMutation = useMutation({
    mutationFn: (formData) =>
      videoApi.publish(formData, {
        onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 100)),
      }),
    onSuccess: (res) => {
      addToast({ type: 'success', message: 'Video published!' })
      navigate(`/watch/${res.data.data._id}`)
    },
    onError: (err) => {
      setProgress(0)
      addToast({ type: 'error', message: getErrorMessage(err) })
    },
  })

  const onSubmit = (data) => {
    if (!data.videoFile?.[0]) {
      addToast({ type: 'error', message: 'Please select a video file' })
      return
    }
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('videoFile', data.videoFile[0])
    if (data.thumbnail?.[0]) formData.append('thumbnail', data.thumbnail[0])
    uploadMutation.mutate(formData)
  }

  const handleVideoDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('video/')) {
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Upload video</h1>
            <p className="text-sm text-[#606060] mt-1">Share your content with the world</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Video drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleVideoDrop}
              className={`relative w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
                dragOver ? 'border-[#3a3a3a] bg-[#111]' : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#3a3a3a] hover:bg-[#0d0d0d]'
              }`}
            >
              <input
                type="file"
                accept="video/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                {...register('videoFile')}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setVideoPreview(URL.createObjectURL(file))
                }}
              />
              {videoPreview ? (
                <video src={videoPreview} className="absolute inset-0 w-full h-full object-contain rounded-2xl" controls />
              ) : (
                <>
                  <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 16V8M8 12l4-4 4 4" stroke="#3a3a3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#2a2a2a" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#a0a0a0] font-medium">Drop your video here</p>
                    <p className="text-xs text-[#606060] mt-1">or click to browse</p>
                  </div>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">Title *</label>
              <input
                placeholder="Enter a descriptive title"
                {...register('title', { required: 'Title is required' })}
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] placeholder-[#3a3a3a] focus:outline-none focus:border-[#3a3a3a] transition-all"
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">Description *</label>
              <textarea
                rows={3}
                placeholder="Tell viewers about your video"
                {...register('description', { required: 'Description is required' })}
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] placeholder-[#3a3a3a] focus:outline-none focus:border-[#3a3a3a] transition-all resize-none"
              />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="text-xs text-[#a0a0a0] font-medium block mb-1.5">Thumbnail (optional)</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <div className={`w-32 h-20 rounded-xl border-2 border-dashed border-[#2a2a2a] hover:border-[#3a3a3a] overflow-hidden flex items-center justify-center transition-colors ${thumbPreview ? '' : 'bg-[#0a0a0a]'}`}>
                    {thumbPreview ? (
                      <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="2" y="4" width="16" height="12" rx="2" stroke="#2a2a2a" strokeWidth="1.5"/>
                        <path d="M8 10l2-2 2 2" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register('thumbnail')}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setThumbPreview(URL.createObjectURL(file))
                    }}
                  />
                </label>
                <p className="text-xs text-[#606060]">Upload a custom thumbnail<br/>16:9 recommended</p>
              </div>
            </div>

            {/* Progress */}
            {uploadMutation.isPending && progress > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-[#606060]">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={uploadMutation.isPending}
              whileHover={!uploadMutation.isPending ? { scale: 1.01 } : {}}
              whileTap={!uploadMutation.isPending ? { scale: 0.99 } : {}}
              className="flex items-center justify-center gap-2 bg-white text-black font-semibold py-3.5 rounded-xl text-sm hover:bg-[#e0e0e0] disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {uploadMutation.isPending && <InlineLoader size="sm" />}
              {uploadMutation.isPending ? 'Uploading...' : 'Publish video'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Layout>
  )
}
