import Header from '../components/Header'
import FormAuth from '../components/FormAuth'

export default function Signup() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex min-h-full flex-col justify-center py-32">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900">
              Get started today
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your account to begin using AI Customer Service
            </p>
          </div>
          <div className="mt-8 bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-8">
            <FormAuth currView="sign_up" />
          </div>
        </div>
      </div>
    </div>
  )
}
