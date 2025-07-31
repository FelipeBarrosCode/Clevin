import { Routes, Route } from 'react-router-dom'
import { ProtectedRoutes } from './components/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <ProtectedRoutes>
          <Dashboard />
        </ProtectedRoutes>
      } />
    </Routes>
  )
}

export default App
