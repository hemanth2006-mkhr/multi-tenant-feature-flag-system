import React from 'react'
import { useState, useEffect } from 'react';
import { CheckCircle, Edit2, Globe, Plus, Search, Shield, Trash2, XCircle } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { clearAuth } from "../utils/Auth"
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const ApiURL = "http://localhost:3000/api/org"
    const [orgs, setOrgs] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch orgs from backend
        const fetchOrgs = async () => {
            try {
                const res = await axios.get(ApiURL + "/list", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setOrgs(res.data);
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchOrgs();
    }, [])
    // Mock Data

    const [orgName, setOrgName] = useState("")

    // UI State

    const [searchQuery, setSearchQuery] = useState('');

    // Filtered orgs based on organization
    const filteredOrgs = orgs.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const createOrg = async (e) => {
        e.preventDefault()
        if (orgName.trim() === "") return;
        orgs.map((name) => {
            if (name.name === orgName) {
                return toast.error("Org with same name already exists")
            }
        })
        const res = await axios.post(ApiURL + "/create", {
            name: orgName
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        setOrgs([...orgs, { name: res.data.name, _id: res.data._id }])
        toast.success("Created successfully !")
        setOrgName("")
        setIsModalOpen(null)
    }

    const deleteOrg = async (id) => {
        try {
            if (window.confirm("Delete this flag?")){
                await axios.delete(ApiURL + "/" + String(id), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            setOrgs(orgs.filter((org)=> org._id !== id))
            toast.success("Organization deleted successfully")
            }
            
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = ()=> {
        clearAuth()
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Shield className="text-indigo-600" />Super Admin - Organizations Management
                        </h1>
                        <p className="text-sm text-gray-500">Manage your tenants</p>
                    </div>

                    <div className="flex items-center gap-3 text-white bg-red-500 p-2 rounded-lg shadow-sm border hover:bg-red-400">
                        <button className='w-full px-2 cursor-pointer' onClick={logout}>Logout</button>
                    </div>
                </header>

                {/* Actions Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search orgs..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} /> Create Organization
                    </button>
                </div>

                {/* orgs Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Organization Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrgs.map(org => (
                                <tr key={org._id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-mono text-sm font-semibold text-indigo-600">{org.name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => deleteOrg(org._id)}
                                                className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrgs.length === 0 && (
                        <div className="p-12 text-center text-gray-400">No orgs found for this tenant.</div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Create New Organization</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Organization Name</label>
                                <input
                                    name="orgName"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    className="w-full p-2 border rounded shadow-sm font-mono text-sm"
                                    placeholder="e.g. name of orgs"

                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                    onClick={(e) => { createOrg(e); setIsModalOpen(null); }}
                                >
                                    Create Org
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Dashboard