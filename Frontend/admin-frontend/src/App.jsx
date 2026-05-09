import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { isAuthenticated } from './utils/Auth'


function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path="/dashboard" element ={
            <ProtectedRoute role={"admin"}>
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
