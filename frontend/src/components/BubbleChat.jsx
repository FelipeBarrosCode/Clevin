

export default function BubbleChat({ color = 'blue', content, className = '' }) {
  const getColorClasses = (color) => {
    switch (color.toLowerCase()) {
      case 'blue':
        return 'bg-blue-500 text-white'
      case 'green':
        return 'bg-green-500 text-white'
      case 'red':
        return 'bg-red-500 text-white'
      case 'yellow':
        return 'bg-yellow-500 text-gray-900'
      case 'purple':
        return 'bg-purple-500 text-white'
      case 'pink':
        return 'bg-pink-500 text-white'
      case 'gray':
        return 'bg-gray-500 text-white'
      case 'black':
        return 'bg-black text-white'
      case 'white':
        return 'bg-white text-gray-900 border border-gray-300'
      default:
        return 'bg-blue-500 text-white'
    }
  }

  return (
    <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${getColorClasses(color)} ${className}`}>
      <p className="text-sm break-words">{content}</p>
    </div>
  )
} 