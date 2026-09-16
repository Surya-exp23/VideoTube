import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatViews, timeAgo, formatDuration } from '../../utils/helpers'

export default function VideoCard({ video }) {
  if (!video) return null

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col gap-3 cursor-pointer"
    >
      <Link to={`/watch/${video._id}`} className="block">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111]">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 10l20 10-20 10V10z" stroke="#3a3a3a" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {/* Duration badge */}
          {video.duration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </Link>

      {/* Meta */}
      <div className="flex gap-3">
        <Link to={`/channel/${video.owner?._id || video.owner}`} className="shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden">
            {video.ownerAvatar ? (
              <img src={video.ownerAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#606060]">
                {video.ownerName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </Link>

        <div className="flex flex-col gap-0.5 overflow-hidden">
          <Link to={`/watch/${video._id}`}>
            <h3 className="text-sm font-medium text-[#f5f5f5] leading-snug line-clamp-2 hover:text-white transition-colors">
              {video.title}
            </h3>
          </Link>
          <Link
            to={`/channel/${video.owner?._id || video.owner}`}
            className="text-xs text-[#606060] hover:text-[#a0a0a0] transition-colors"
          >
            {video.ownerName || 'Unknown Channel'}
          </Link>
          <p className="text-xs text-[#606060]">
            {formatViews(video.views)} views • {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
