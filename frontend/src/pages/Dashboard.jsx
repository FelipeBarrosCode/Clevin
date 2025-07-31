import { useState } from 'react'
import SideMenu from '../components/SideMenu'
import Chat from '../components/Chat'
import UploadFiles from '../components/UploadFiles'
import ManageFiles from '../components/Managefiles'
import { useNavigate } from 'react-router-dom'
import supabase  from '../supabase/supabase'


export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('chat')
  const navigate = useNavigate()
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'chat':
        return <Chat />
      case 'upload':
        return <UploadFiles />
      case 'manage':
        return <ManageFiles />
      default:
        return <Chat />
    }
  }

  const getPageTitle = () => {
    switch (activeComponent) {
      case 'chat':
        return 'Clevin'
      case 'upload':
        return 'Upload Files'
      case 'manage':
        return 'Manage Files'
      default:
        return 'AI Chat'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SideMenu 
        activeComponent={activeComponent} 
        setActiveComponent={setActiveComponent} 
      />
      
      <div className="pl-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 ml-16 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => {
              supabase.auth.signOut()
              navigate('/')
            }}>
              Logout
            </button>
          </div>
        </header>
        
        <main className="h-screen pt-16">
          <div className="h-full">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  )
}
