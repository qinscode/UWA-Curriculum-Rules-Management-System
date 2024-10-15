export const login = async (email: string, password: string): Promise<string> => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!API_URL) {
    throw new Error('API base URL is not defined in environment variables.')
  }

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
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', access_token)
  }
  return access_token
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
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

export const updateUserProfile = async (userData: { username: string; email: string }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!API_URL) {
    throw new Error('API base URL is not defined in environment variables.')
  }

  const token = getToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update profile')
  }

  return response.json()
}

export const register = async (userData: {
  username: string
  email: string
  password: string
}): Promise<{ message: string; userId: number }> => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!API_URL) {
    throw new Error('API base URL is not defined in environment variables.')
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Registration failed')
  }

  return res.json()
}

export const createAdminUser = async (userData: {
  username: string
  email: string
  password: string
}): Promise<{ message: string; userId: number }> => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!API_URL) {
    throw new Error('API base URL is not defined in environment variables.')
  }

  const token = getToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const res = await fetch(`${API_URL}/auth/create-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Failed to create admin user')
  }

  return res.json()
}

export const getAllUsers = async (): Promise<User[]> => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!API_URL) {
    throw new Error('API base URL is not defined in environment variables.')
  }

  const token = getToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const res = await fetch(`${API_URL}/auth/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Failed to fetch users')
  }

  return res.json()
}

export const deleteUser = async (userId: number): Promise<void> => {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!API_URL) {
    throw new Error('API base URL is not defined in environment variables.')
  }

  const token = getToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  const res = await fetch(`${API_URL}/auth/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Failed to delete user')
  }
}
