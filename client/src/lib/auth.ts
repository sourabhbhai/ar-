import { supabase } from './supabaseclient'

export interface User {
  id: string
  email: string
  username?: string
  role: 'super_admin' | 'restaurant_owner'
  restaurantId?: string
}

export class AuthService {
  // LOGIN
  static async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) throw new Error(error?.message || 'Login failed')

    // Superadmin check
    const { data: saData, error: saError } = await supabase
      .from('superadmins')
      .select('username')
      .eq('auth_id', data.user.id)
      .maybeSingle()

    if (saError || !saData) throw new Error('Not a superadmin')

    return {
      id: data.user.id,
      email: data.user.email ?? '',
      username: saData.username ?? '',
      role: 'super_admin'
    }
  }

  // LOGOUT
  static async logout(): Promise<void> {
    await supabase.auth.signOut()
  }

  // GET CURRENT USER (safe)
  static async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      if (error || !session?.user) return null

      const { data: saData } = await supabase
        .from('superadmins')
        .select('username')
        .eq('auth_id', session.user.id)
        .maybeSingle()

      return {
        id: session.user.id,
        email: session.user.email ?? '',
        username: saData?.username ?? '',
        role: 'super_admin'
      }
    } catch {
      return null
    }
  }
}
