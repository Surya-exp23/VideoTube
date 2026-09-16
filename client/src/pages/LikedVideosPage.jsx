import { useQuery } from '@tanstack/react-query'
import Layout from '../components/layout/Layout'
import VideoGrid from '../components/video/VideoGrid'
import { likeApi } from '../api/social'
import { useAuthStore } from '../store/authStore'

export default function LikedVideosPage() {
  const { user } = useAuthStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['liked-videos', user?._id],
    queryFn: () => likeApi.getLikedVideos().then((r) => r.data.data),
    enabled: !!user,
    staleTime: 3 * 60 * 1000,
  })

  const videos = (data || []).map((item) => ({
    _id: item.videoDetails?._id,
    title: item.videoDetails?.title,
    thumbnail: item.videoDetails?.thumbnail,
    duration: item.videoDetails?.duration,
    views: item.videoDetails?.views,
    owner: item.videoDetails?.owner,
  })).filter(Boolean)

  return (
    <Layout>
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Liked videos</h1>
        <VideoGrid videos={videos} isLoading={isLoading} error={error} />
      </div>
    </Layout>
  )
}
