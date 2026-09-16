export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton aspect-video w-full rounded-xl" />
      <div className="flex gap-3">
        <div className="skeleton w-9 h-9 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14', xl: 'w-20 h-20' }
  return <div className={`skeleton rounded-full ${sizes[size]}`} />
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonChannelHeader() {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton w-full h-40 rounded-2xl" />
      <div className="flex items-end gap-4 -mt-10 px-4">
        <div className="skeleton w-24 h-24 rounded-full border-4 border-black shrink-0" />
        <div className="flex flex-col gap-2 flex-1 pb-2">
          <div className="skeleton h-5 w-48 rounded" />
          <div className="skeleton h-3 w-32 rounded" />
        </div>
      </div>
    </div>
  )
}
