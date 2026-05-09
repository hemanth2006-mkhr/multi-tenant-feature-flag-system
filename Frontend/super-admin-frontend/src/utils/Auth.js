export const getToken = () => localStorage.getItem('token')
export const getRole = () => localStorage.getItem('role')


export const saveAuth = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
}

export const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
}

export const isAuthenticated = () => {
  const token = getToken()
  if (!token){
    return false
  } 
  return true
}