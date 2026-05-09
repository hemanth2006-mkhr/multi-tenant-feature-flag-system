import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoutes'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { isAuthenticated } from './utils/Auth'


function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path="/dashboard" element ={
            <ProtectedRoute role={"superadmin"}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={ isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </Router> 
    </>
  )
}

export default App
