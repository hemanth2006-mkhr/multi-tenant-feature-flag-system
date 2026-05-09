export const getToken = () => localStorage.getItem('token')
export const getRole = () => localStorage.getItem('role')
export const getOrgId = () => localStorage.getItem('orgId')
export const getOrgName = () => localStorage.getItem('orgName')

export const saveAuth = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
    if (data.organizationId)
        localStorage.setItem('orgId', data.organizationId)
    if (data.orgName)
        localStorage.setItem('orgName', data.orgName)
}

export const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('orgId')
    localStorage.removeItem('orgName')
}

export const isAuthenticated = () => {
  const token = getToken()
  if (!token){
    return false
  } 
  return true
}