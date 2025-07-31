import Header from '../components/Header'
import Hero from '../components/Hero'


export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Header />
      <main>
        <Hero />
        <div className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-semibold text-gray-900">
                  Trained on Real Conversations
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Our AI model has been fine-tuned on over 26,000 real customer service conversations, 
                  ensuring authentic and contextually appropriate responses for your business.
                </p>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-semibold text-gray-900">
                  Powered by ChatGPT 4.1 Nano
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Leveraging the latest ChatGPT 4.1 Nano technology, our service delivers 
                  lightning-fast responses while maintaining high accuracy and natural conversation flow.
                </p>
              </div>
            </div>
            <div className="mt-16 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900">
                Customizable to Your Business
              </h3>
              <p className="mt-4 text-lg text-gray-600">
                Simply provide your company's customer service scripts and guidelines, and our AI will 
                adapt its responses to match your brand voice and service protocols. The more context 
                you provide, the more personalized the experience becomes.
              </p>
              <div className="mt-8">
                <a href="/upload" className="inline-flex items-center rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-gray-800">
                  Upload Your Guidelines
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 