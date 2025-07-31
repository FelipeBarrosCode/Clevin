import { createClient } from '@supabase/supabase-js'

const customStorageObject = {
    getItem: (key) => {
      const cookies = document.cookie.split(';')
      const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))
      return cookie ? cookie.split('=')[1] : null
    },
    setItem: (key, value) => {
      document.cookie = `${key}=${value}; path=/; secure; samesite=strict; max-age=31536000`
    },
    removeItem: (key) => {
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
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