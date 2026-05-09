import React from 'react'
import { useState, useEffect } from 'react';
import { CheckCircle, Edit2, Globe, Plus, Search, Shield, Trash2, XCircle } from 'lucide-react';
import axios from 'axios';
import { clearAuth } from "../utils/Auth"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const ApiURL = "http://localhost:3000/api/flags"
    const [flags, setFlags] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch flags from backend
        const fetchFlags = async () => {
            try {
                const res = await axios.get(ApiURL + "/list", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                // setFlags(res.data);
                setFlags(res.data);
            } catch (error) {

            }
        }
        fetchFlags();
    }, [])
    // Mock Data
    const [status, setStatus] = useState(true);
    const [flagKey, setFlagKey] = useState()

    const [updateStatus, setUpdateStatus] = useState(true);
    const [updateFlagKey, setUpdateFlagKey] = useState()


    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingFlag, setEditingFlag] = useState([]);

    // Filtered Flags based on Tenant and Search
    const filteredFlags = flags.filter(f =>
        // f.tenant === activeTenant &&
        f.featureKey.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // const toggleFlag = (id) => {
    //     setFlags(flags.map(f => f.id === id ? { ...f, status: !f.status } : f));
    // };

    const deleteFlag = async (id) => {
        try {
            if (window.confirm("Delete this flag?")) {
                await axios.delete(ApiURL + "/" + String(id), {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setFlags(flags.filter(f => f._id !== id));
                toast.success("Flag deleted successfully")
            }
        } catch (error) {
            console.error("Failed to delete flag:", error.message);
            toast.error("Failed to delete flag")
        }
    };

    const createFlag = async (e) => {
        e.preventDefault()
        const res = await axios.post(ApiURL + "/create", {
            featureKey: flagKey,
            enabled: status
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        setFlags([...flags, { featureKey: flagKey, enabled: status }])
        setIsModalOpen(false);
        setFlagKey(null)
        setStatus(null)
        toast.success("Flag created successfully")
    }

    const updateFlag = async (e) => {
        e.preventDefault();
        const res = await axios.put(ApiURL + "/" + String(editingFlag._id), {
            featureKey: updateFlagKey || editingFlag.featureKey,
            enabled: updateStatus
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })

        setFlags(flags.map(f =>
            f._id === String(editingFlag._id)
                ? { ...f, featureKey: updateFlagKey, enabled: updateStatus }
                : f
        ));
        toast.success("Flag updated successfully")
        setIsModalOpen(false);
        setEditingFlag([]);

    };

    const logout = () => {
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
                            <Shield className="text-indigo-600" />{localStorage.getItem('orgName') || 'Admin'} - Feature Management
                        </h1>
                        <p className="text-sm text-gray-500">Manage runtime toggles for your tenants</p>
                    </div>

                    <div className="flex items-center gap-3 text-white bg-red-500 p-2 rounded-lg shadow-sm border">
                        <button className='w-full px-2 cursor-pointer' onClick={logout}>Logout</button>
                    </div>
                </header>

                {/* Actions Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search flags..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => { setEditingFlag(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} /> Create Flag
                    </button>
                </div>

                {/* Flags Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Flag Key</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredFlags.map(flag => (
                                <tr key={flag._id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-mono text-sm font-semibold text-indigo-600">{flag.featureKey}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${flag.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {flag.enabled ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {flag.enabled ? 'ACTIVE' : 'INACTIVE'}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setEditingFlag(flag); setIsModalOpen(true); setUpdateFlagKey(flag.featureKey) }}
                                                className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-indigo-600 transition"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteFlag(flag._id)}
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
                    {filteredFlags.length === 0 && (
                        <div className="p-12 text-center text-gray-400">No flags found for this tenant.</div>
                    )}
                </div>
                <ToastContainer/>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">{editingFlag ? 'Edit Flag' : 'Create New Flag'}</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Flag Key (Slug)</label>
                                <input
                                    name="key"
                                    defaultValue={editingFlag?.key}
                                    value={editingFlag ? updateFlagKey : flagKey}
                                    required={!editingFlag}
                                    className="w-full p-2 border rounded shadow-sm font-mono text-sm"
                                    placeholder="e.g. enable-new-checkout"
                                    onChange={(e) => { editingFlag ? setUpdateFlagKey(e.target.value) : setFlagKey(e.target.value) }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={editingFlag ? updateStatus : status}
                                    onChange={(e) => {
                                        const val = e.target.value === "true"; // Convert string to boolean
                                        editingFlag ? setUpdateStatus(val) : setStatus(val);
                                    }}
                                    className="bg-transparent focus:outline-none font-medium text-sm pr-4"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
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
                                    onClick={editingFlag ? (e) => updateFlag(e) : (e) => createFlag(e)}
                                >
                                    {editingFlag ? 'Update Flag' : 'Create Flag'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard