import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if credentials are properly configured
const isConfigured = supabaseUrl && supabaseAnonKey && 
                     supabaseUrl !== 'https://your-project.supabase.co' && 
                     supabaseAnonKey !== 'your-anon-key-here' &&
                     supabaseUrl !== 'YOUR_SUPABASE_URL' && 
                     supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
  console.warn('The app will run in demo mode without authentication.')
}

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null
