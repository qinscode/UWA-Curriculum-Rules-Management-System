const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_URL) {
  throw new Error('API base URL is not defined in environment variables.')
}

export const login = async (email: string, password: string): Promise<string> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Login failed')
  }

  const { access_token } = await res.json()
  localStorage.setItem('token', access_token)
  return access_token
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  const token = getToken()
  return !!token
}
