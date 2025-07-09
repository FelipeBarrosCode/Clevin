export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</a></li>
              <li><a href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a></li>
              <li><a href="/demo" className="text-sm text-gray-600 hover:text-gray-900">Demo</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="/blog" className="text-sm text-gray-600 hover:text-gray-900">Blog</a></li>
              <li><a href="/careers" className="text-sm text-gray-600 hover:text-gray-900">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="/help" className="text-sm text-gray-600 hover:text-gray-900">Help Center</a></li>
              <li><a href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
              <li><a href="/status" className="text-sm text-gray-600 hover:text-gray-900">Status</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a></li>
              <li><a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms</a></li>
              <li><a href="/security" className="text-sm text-gray-600 hover:text-gray-900">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600">&copy; 2024 AIService. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 