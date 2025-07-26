import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, UserProfile } from '@/lib/supabase'
import { generateNickname } from '@/utils/nicknameGenerator'
import { sendWelcomeEmail } from '@/utils/emailService'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  resendConfirmationEmail: () => Promise<{ error: AuthError | null }>
  confirmEmail: (token: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('AuthContext: Getting initial session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
      } else {
        console.log('AuthContext: Initial session:', session ? 'Found' : 'None')
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('AuthContext: Fetching user profile...')
          // Fetch profile in background, don't wait for it
          fetchUserProfile(session.user.id).catch(error => {
            console.error('AuthContext: Initial profile fetch failed, continuing anyway:', error)
          })
        }
      }
      
      console.log('AuthContext: Setting loading to false')
      setLoading(false)
      setAuthInitialized(true)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only process auth changes after initial load to prevent loops
        if (!authInitialized) {
          console.log('AuthContext: Skipping auth change during initialization:', event)
          return
        }
        
        console.log('AuthContext: Auth state changed:', event, session ? 'Session exists' : 'No session')
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('AuthContext: User found, fetching profile...')
          // Fetch profile in background, don't wait for it
          fetchUserProfile(session.user.id).catch(error => {
            console.error('AuthContext: Profile fetch failed, continuing anyway:', error)
          })
        } else {
          console.log('AuthContext: No user, clearing profile')
          setProfile(null)
        }
        
        console.log('AuthContext: Auth change complete, setting loading to false')
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [authInitialized])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Querying profiles table for user:', userId)
      
      // Add timeout to prevent hanging
      const profileQuery = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      // Race between the query and a timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile query timeout')), 5000)
      })

      const { data, error } = await Promise.race([profileQuery, timeoutPromise]) as any

      console.log('AuthContext: Profile query result:', { data, error })

      if (error) {
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('AuthContext: Profile not found, creating new profile...')
          await createUserProfile(userId)
        } else if (error.message === 'Profile query timeout') {
          console.error('AuthContext: Profile query timed out, continuing without profile')
        } else {
          console.error('AuthContext: Error fetching profile:', error)
          // Don't let profile errors block the auth flow
          console.log('AuthContext: Continuing without profile due to error')
        }
      } else {
        console.log('AuthContext: Profile found, setting profile data')
        setProfile(data)
      }
    } catch (error) {
      console.error('AuthContext: Exception in fetchUserProfile:', error)
      // Don't let profile errors block the auth flow
      console.log('AuthContext: Continuing without profile due to exception')
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Creating new user profile...')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Generate unique nickname with retry logic
        let nickname = generateNickname()
        let attempts = 0
        const maxAttempts = 5

        // Check for nickname uniqueness and retry if needed
        while (attempts < maxAttempts) {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('nickname', nickname)
            .single()

          if (!existingProfile) {
            // Nickname is unique, break out of loop
            break
          }

          // Generate new nickname and try again
          nickname = generateNickname()
          attempts++
        }

        const newProfile = {
          id: userId,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          nickname: nickname,
          email_confirmed: user.email_confirmed_at ? true : false,
          email_confirmed_at: user.email_confirmed_at || null,
        }

        console.log('AuthContext: Inserting profile with nickname:', newProfile)
        const { data, error } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        console.log('AuthContext: Profile insert result:', { data, error })

        if (error) {
          console.error('AuthContext: Error creating profile:', error)
          // Don't let profile creation errors block auth
          console.log('AuthContext: Continuing without profile creation')
        } else {
          console.log('AuthContext: Profile created successfully with nickname:', data.nickname)
          setProfile(data)
          
          // Send welcome email to new user (don't block on email failure)
          sendWelcomeEmail({
            email: user.email || '',
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'New User',
            nickname: data.nickname,
            signupDate: user.created_at || new Date().toISOString()
          }).then(result => {
            if (result.success) {
              console.log('AuthContext: Welcome email sent successfully:', result.messageId)
            } else {
              console.error('AuthContext: Failed to send welcome email:', result.error)
              // Don't block user flow for email failures
            }
          }).catch(error => {
            console.error('AuthContext: Welcome email exception:', error)
            // Don't block user flow for email failures
          })
        }
      } else {
        console.log('AuthContext: No user found for profile creation')
      }
    } catch (error) {
      console.error('AuthContext: Exception in createUserProfile:', error)
      console.log('AuthContext: Continuing without profile creation due to exception')
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('AuthContext: Starting Google OAuth sign-in...')
      // Force absolute homepage URL regardless of current page
      const redirectURL = 'https://serin-soul-spark.vercel.app/'
      console.log('AuthContext: OAuth redirect URL (forced absolute homepage):', redirectURL)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectURL
        }
      })
      
      if (error) {
        console.error('AuthContext: OAuth error:', error)
      } else {
        console.log('AuthContext: OAuth initiated successfully')
      }
      
      return { error }
    } catch (error) {
      console.error('AuthContext: Exception in signInWithGoogle:', error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (!error) {
        setUser(null)
        setProfile(null)
        setSession(null)
      }
      
      return { error }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error: error as AuthError }
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { error: { message: 'No user logged in' } as AuthError }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { error }
      }

      setProfile(data)
      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error: error as AuthError }
    }
  }

  const resendConfirmationEmail = async () => {
    try {
      console.log('AuthContext: Starting resend confirmation email...')
      
      if (!user?.email) {
        console.error('AuthContext: No user email found')
        return { error: { message: 'No user email found' } as AuthError }
      }

      console.log('AuthContext: Attempting to resend confirmation email to:', user.email)
      console.log('AuthContext: User email_confirmed_at:', user.email_confirmed_at)

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      })

      if (error) {
        console.error('AuthContext: Supabase resend error:', error)
      } else {
        console.log('AuthContext: Resend request successful - check Supabase Auth logs for delivery status')
      }

      return { error }
    } catch (error) {
      console.error('AuthContext: Exception in resendConfirmationEmail:', error)
      return { error: error as AuthError }
    }
  }

  const confirmEmail = async (token: string) => {
    try {
      console.log('AuthContext: Starting email confirmation process...')
      
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      })

      if (error) {
        console.error('AuthContext: Email verification failed:', error)
        return { error }
      }

      console.log('AuthContext: Email verification successful, updating profile...')

      // Get fresh user data after confirmation
      const { data: { user: confirmedUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !confirmedUser) {
        console.error('AuthContext: Failed to get confirmed user:', userError)
        return { error: userError }
      }

      // Update our profiles table to match the auth.users confirmation status
      const { error: profileError } = await updateProfile({
        email_confirmed: true,
        email_confirmed_at: confirmedUser.email_confirmed_at || new Date().toISOString()
      })

      if (profileError) {
        console.error('AuthContext: Failed to update profile confirmation status:', profileError)
        // Don't return error here - the auth confirmation still succeeded
      }

      // Refresh the user and profile state
      setUser(confirmedUser)
      
      // Fetch fresh profile data
      if (confirmedUser.id) {
        console.log('AuthContext: Fetching fresh profile data after confirmation...')
        await fetchUserProfile(confirmedUser.id)
      }

      console.log('AuthContext: Email confirmation process completed successfully')
      return { error: null }
    } catch (error) {
      console.error('AuthContext: Exception in confirmEmail:', error)
      return { error: error as AuthError }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
    resendConfirmationEmail,
    confirmEmail,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}