import { useEffect, useState } from 'react'
import { AuthService, User } from './lib/auth'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const loggedUser = await AuthService.getCurrentUser()
        setUser(loggedUser)
      } catch (err) {
        console.error('Auth load failed:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>

  return <div>Welcome {user.username}</div>
}
