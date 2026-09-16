import VideoCard from './VideoCard'
import { SkeletonGrid } from '../ui/Skeletons'
import EmptyState from '../ui/EmptyState'
import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function VideoGrid({ videos, isLoading, error }) {
  if (isLoading) return <SkeletonGrid count={12} />

  if (error) {
    return (
      <EmptyState
        type="error"
        title="Couldn't load videos"
        description="Something went wrong on our end. Try refreshing."
      />
    )
  }

  if (!videos?.length) {
    return (
      <EmptyState
        type="noVideos"
        title="No videos yet"
        description="Videos you upload or find will appear here."
      />
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {videos.map((video) => (
        <motion.div key={video._id} variants={item}>
          <VideoCard video={video} />
        </motion.div>
      ))}
    </motion.div>
  )
}
