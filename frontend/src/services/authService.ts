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
    body: JSON.stringify({ email, password }), // Send email and password in the request body
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

// Function to get the JWT token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

// Function to check if the user is authenticated by checking if a token exists
export const isAuthenticated = (): boolean => {
  const token = getToken()
  return !!token // Return true if the token exists, false otherwise
}
