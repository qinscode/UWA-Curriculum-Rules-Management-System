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
  console.log('token', access_token)
  console.log('res.json()', res.json())

  console.log('`${API_URL}/auth/login`,', `${API_URL}/auth/login`)
  return access_token
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const isAuthenticated = (): boolean => {
  const token = getToken()
  return !!token
}
