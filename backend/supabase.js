import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv';

config();

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
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
)

export default supabase;