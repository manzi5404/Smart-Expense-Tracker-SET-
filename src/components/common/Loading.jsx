function Loading({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizes[size]} border-2 border-primary-200 border-t-primary-600
          rounded-full animate-spin
        `}
      />
    </div>
  )
}

function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex flex-col items-center justify-center z-50 rounded-xl">
      <Loading size="lg" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  )
}

function LoadingSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

Loading.Overlay = LoadingOverlay
Loading.Skeleton = LoadingSkeleton

export default Loading