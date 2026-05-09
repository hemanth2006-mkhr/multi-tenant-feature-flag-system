import React from 'react'
import { useState, useEffect } from 'react';
import { replace, useNavigate } from 'react-router-dom';
import { saveAuth } from '../utils/Auth';
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"

const Signup = () => {
  const ApiUrl = ""
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState("")
  const [orgId, setOrgId] = useState([])
  const [org, setOrg] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrg = async () => {
      const res = await axios.get("http://localhost:3000/api/flags/org-list")
      setOrg(res.data)
    }

    fetchOrg()
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        name: orgName,
        email,
        password,
        organizationId: orgId
      })

      toast.success("Signup successful!")
      if (res.status === 201) {
        navigate("/login", replace)
      }
    } catch (error) {
      console.error("Login failed:", error.message)
      toast.error("Signup failed: " + error.message)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Create Admin Account
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Organization</label>
            <select name="orgName" id="orgName" className='w-1/4 h-10 mt-2 hover:border-b focus:outline-0' defaultValue="---"
              onChange={(e) => { 
                const splitValue = e.target.value.split(" ")
                setOrgId(splitValue[0])
                setOrgName(splitValue[1])
              }}            >
              <option value="---" disabled>---</option>
              {
                org.map((item) => (
                  <option key={item._id} value={item._id+" "+item.name} >{item.name}</option>
                ))
              }
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            onClick={handleSubmit}
          >
            Sign up
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer" onClick={() => navigate("/login")}>Login</button>
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Signup