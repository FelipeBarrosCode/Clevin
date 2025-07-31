import { createClient } from '@supabase/supabase-js'

const customStorageObject = {
    getItem: (key) => {
      const cookies = document.cookie.split(';')
      const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
      return cookie ? cookie.split('=')[1] : null
    },
    setItem: (key, value) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
      document.cookie = `${key}=${encodeURIComponent(stringValue)}; path=/; secure; samesite=none; max-age=31536000`
    },
    getItem: (key) => {
      const cookies = document.cookie.split(';')
      const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
      if (!cookie) return null
      const value = cookie.split('=')[1]
      try {
        return JSON.parse(decodeURIComponent(value))
      } catch {
        return decodeURIComponent(value)
      }
    },
    
  } 

const supabase = createClient(
  'https://elbdnefgkagyojjiahtv.supabase.co',
  import.meta.env.VITE_PUBLIC_ANON_KEY,
  {
    auth: {
      storage: customStorageObject,
      autoRefreshToken: true,
      persistSession: true
    }
  }
)

export default supabase;