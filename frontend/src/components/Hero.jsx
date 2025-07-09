export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-6xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            The First AI
            <span className="block text-blue-600">Customer Service</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience the future of customer support. Our AI-powered service delivers instant, 
            accurate, and personalized responses 24/7.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="/demo" className="bg-black text-white px-8 py-3 rounded-full text-lg hover:bg-gray-800">
              Try Demo
            </a>
            <a href="/learn-more" className="text-lg text-gray-600 hover:text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 