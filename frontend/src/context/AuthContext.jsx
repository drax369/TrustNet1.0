import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  isDemoMode: false,
  signUp: async () => {},
  signIn: async () => {},
  signInWithOAuth: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {}
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn('Running in demo mode - Supabase not configured')
      setIsDemoMode(true)
      setLoading(false)
      return
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (initialSession) {
        setSession(initialSession)
        setUser(initialSession.user)
      }
      setLoading(false)
    }).catch(err => {
      console.error("Error fetching session on init:", err)
      setLoading(false)
    })

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession ? newSession.user : null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, fullName) => {
    if (!supabase) {
      throw new Error('Authentication not configured. Please set up Supabase credentials.')
    }
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || email)}`,
          role: 'Compliance Officer',
          preferences: {
            theme: 'dark',
            autoScan: true,
            emailAlerts: false
          }
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`
      }
    })
  }

  const signIn = async (email, password) => {
    if (!supabase) {
      throw new Error('Authentication not configured. Please set up Supabase credentials.')
    }
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signInWithOAuth = async (provider) => {
    if (!supabase) {
      throw new Error('Authentication not configured. Please set up Supabase credentials.')
    }
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?type=oauth&provider=${provider}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
  }

  const signOut = async () => {
    if (!supabase) return
    return await supabase.auth.signOut()
  }

  const updateProfile = async (profileData) => {
    if (!supabase) {
      throw new Error('Authentication not configured. Please set up Supabase credentials.')
    }
    const { data, error } = await supabase.auth.updateUser({
      data: profileData
    })
    if (!error && data?.user) {
      setUser(data.user)
    }
    return { data, error }
  }

  const resetPassword = async (email) => {
    if (!supabase) {
      throw new Error('Authentication not configured. Please set up Supabase credentials.')
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`
    })
  }

  const updatePassword = async (newPassword) => {
    if (!supabase) {
      throw new Error('Authentication not configured. Please set up Supabase credentials.')
    }
    return await supabase.auth.updateUser({
      password: newPassword
    })
  }

  const value = {
    session,
    user,
    loading,
    isDemoMode,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
