export type User = {
  id: string
  username: string
  email: string
  role: 'super_admin' | 'restaurant_owner'
  restaurantId?: string
  displayName?: string
  extra?: Record<string, any>
}

const DEV_CREDENTIALS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin1234',
    user: {
      id: 'dev-1',
      username: 'admin',
      email: 'admin@local',
      role: 'super_admin',
      displayName: 'Super Admin Raj',
      extra: { allowedRestaurants: ['res-1', 'res-2'] }
    }
  },
  owner1: {
    password: 'ownerpass',
    user: {
      id: 'dev-2',
      username: 'owner1',
      email: 'owner1@local',
      role: 'restaurant_owner',
      restaurantId: 'res-1',
      displayName: 'Owner — Cafe Blue',
      extra: { menuVariant: 'v1' }
    }
  },
  owner2: {
    password: 'owner2pass',
    user: {
      id: 'dev-3',
      username: 'owner2',
      email: 'owner2@local',
      role: 'restaurant_owner',
      restaurantId: 'res-2',
      displayName: 'Owner — Spice House',
      extra: { menuVariant: 'v2' }
    }
  }
}

const DEV_USER_KEY = 'dev_auth_user'

// Always return true for testing/demo on any server!
function isDevMode(): boolean {
  return true;
}

export class AuthService {
  static async login(username: string, password: string): Promise<User> {
    if (isDevMode()) {
      // Always handle trim + lowercase
      const entry = DEV_CREDENTIALS[username.trim().toLowerCase()];
      if (entry && entry.password === password) {
        localStorage.setItem(DEV_USER_KEY, JSON.stringify(entry.user))
        return entry.user
      }
      throw new Error('Invalid dev credentials')
    }
    throw new Error('No production auth configured')
  }

  static async logout(): Promise<void> {
    localStorage.removeItem(DEV_USER_KEY)
  }

static async getCurrentUser(): Promise<User | null> {
  if (isDevMode()) {
    const s = localStorage.getItem(DEV_USER_KEY)
    // Only parse if s is truthy and not just empty string
    if (!s || s === "" || s === "undefined" || s === "null") return null
    try {
      return JSON.parse(s) as User
    } catch {
      localStorage.removeItem(DEV_USER_KEY)
      return null
    }
  }
  return null
}
}
