import { supabase } from './supabaseclient'

export interface User {
  id: string
  email: string
  username?: string
  role: 'super_admin' | 'restaurant_owner'
  restaurantId?: string
}

export class AuthService {
  // -------------------
  // LOGIN
  static async login(email: string, password: string): Promise<User> {
    // Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('No user returned from Supabase')

    // Superadmin table check
    const { data: saData, error: saError } = await supabase
      .from('superadmins')
      .select('*')
      .eq('auth_id', data.user.id)
      .single() // exactly one row expected

    if (saError || !saData) throw new Error('Not a superadmin')

    // Return safe user object
    return {
      id: data.user.id,
      email: data.user.email!,
      username: saData.username,
      role: 'super_admin'
    }
  }

  // -------------------
  // LOGOUT
  static async logout() {
    await supabase.auth.signOut()
  }

  // -------------------
  // GET CURRENT TOKEN
  static getToken() {
    return supabase.auth.session()?.access_token || null
  }
}
