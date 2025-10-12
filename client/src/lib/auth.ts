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

    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('No user returned from Supabase')

    // Superadmin check
    const { data: saData, error: saError } = await supabase
      .from('superadmins')
      .select('username')
      .eq('auth_id', data.user.id)
      .maybeSingle() // safer than .single(), returns null if not found

    if (saError) throw new Error('Error checking superadmin table')
    if (!saData) throw new Error('Not a superadmin')

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

  // GET TOKEN
  static getToken(): string | null {
    // v2 syntax
    const session = supabase.auth.getSession ? (supabase.auth.getSession() as any) : null
    return session?.data?.session?.access_token ?? null
  }
}
