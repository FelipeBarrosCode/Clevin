
import { createRoot } from 'react-dom/client'
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { ProtectedRoutes } from './components/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <ProtectedRoutes>
          <Dashboard />
        </ProtectedRoutes>
    } />
    </Routes>
  </BrowserRouter>,
)
