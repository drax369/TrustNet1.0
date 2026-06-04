import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import LoadingScreen from '../../components/LoadingScreen'
import { supabase } from '../../supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract session from URL hash (for email verification and OAuth)
        const { data, error } = await supabase.auth.getSessionFromUrl()
        
        if (error) {
          console.error("Auth callback error:", error)
          navigate('/login', { replace: true })
          return
        }

        const type = searchParams.get('type')

        // Wait a brief moment for session to be fully established
        await new Promise(r => setTimeout(r, 1000))

        if (type === 'recovery') {
          // If password recovery callback, redirect to reset password page
          navigate('/reset-password', { replace: true })
        } else if (type === 'signup') {
          // Email verification for signup - redirect to verify email page
          navigate('/verify-email', { replace: true, state: { verified: true } })
        } else {
          // OAuth login or standard signup confirm
          if (data.session) {
            navigate('/dashboard', { replace: true })
          } else {
            navigate('/login', { replace: true })
          }
        }
      } catch (err) {
        console.error("Auth callback processing failed:", err)
        navigate('/login', { replace: true })
      }
    }

    handleCallback()
  }, [navigate, searchParams])

  return <LoadingScreen message="Authenticating..." />
}
