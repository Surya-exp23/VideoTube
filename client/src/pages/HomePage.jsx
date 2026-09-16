import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/layout/Layout'
import VideoGrid from '../components/video/VideoGrid'
import { videoApi } from '../api/videos'

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, isLoading, error } = useQuery({
    queryKey: ['videos', query],
    queryFn: () => videoApi.getAll({ query, limit: 24 }).then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const videos = data?.docs || data || []

  return (
    <Layout>
      <div className="px-6 py-6">
        {query && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#f5f5f5]">
              Results for <span className="text-[#a0a0a0]">"{query}"</span>
            </h2>
          </div>
        )}
        <VideoGrid videos={videos} isLoading={isLoading} error={error} />
      </div>
    </Layout>
  )
}
