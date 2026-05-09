import React from 'react'
import { Navigate } from 'react-router-dom'
import { getRole, isAuthenticated } from '../utils/Auth'

const ProtectedRoute = ({children, role}) => {
    if(!isAuthenticated()){
        return <Navigate to="/login" replace />
    }

    const userRole = getRole()
    if(userRole !== role){
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProtectedRoute