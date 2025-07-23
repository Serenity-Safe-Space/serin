import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, UserProfile } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
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
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
  }, [])

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
        const newProfile = {
          id: userId,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        }

        console.log('AuthContext: Inserting profile:', newProfile)
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
          console.log('AuthContext: Profile created successfully')
          setProfile(data)
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/chat`
        }
      })
      
      return { error }
    } catch (error) {
      console.error('Error signing in with Google:', error)
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

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}