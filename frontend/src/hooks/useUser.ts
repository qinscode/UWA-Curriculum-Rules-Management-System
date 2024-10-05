import { useState, useEffect } from 'react'
import { getToken } from '@/services/authService'
import { User, UserRole } from '@/types'

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!API_URL) {
          throw new Error('API base URL is not defined in environment variables.')
        }

        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const userData = await response.json()
        const user: User = {
          ...userData,
          role: userData.role.toLowerCase() as UserRole,
        }
        setUser(user)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}
