import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold text-gray-900">
          Clevin
        </Link>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900">Log in</Link>
          <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
} 