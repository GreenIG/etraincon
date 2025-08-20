export interface User {
  id: number
  username: string
  email: string
}

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Error parsing stored user:', error)
    return null
  }
}

export const setStoredUser = (user: User): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('user', JSON.stringify(user))
  } catch (error) {
    console.error('Error storing user:', error)
  }
}

export const removeStoredUser = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Error removing stored user:', error)
  }
}

export const isAuthenticated = (): boolean => {
  return getStoredUser() !== null
}

export const logout = (): void => {
  removeStoredUser()
  // You might want to call a logout API endpoint here
  // to invalidate the session on the server
}
