const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div
      className={`${sizeClasses[size]} border-gray-200 border-t-[#ea580c] rounded-full animate-spin`}
    />
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default Loader
