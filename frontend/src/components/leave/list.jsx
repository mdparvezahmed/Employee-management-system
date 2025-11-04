import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { API_BASE_URL, axiosAPI } from '../../config/api'
import Table from './Table'

const List = () => {
    const { user, loading: authLoading } = useAuth()
    const [leaves, setLeaves] = useState([])
    const [loading, setLoading] = useState(false) // data fetch loading
    const [error, setError] = useState(null)

    const apiUrl = API_BASE_URL

    useEffect(() => {
        // Wait until auth check completes. authLoading starts true while AuthContext verifies token.
        if (authLoading) return;

        const fetchLeaves = async () => {
            setLoading(true)
            setError(null)
            try {
                const token = localStorage.getItem('token') || user?.token
                const url = user?.role === 'admin' ? `/api/leave/` : `/api/leave/?userId=${user?._id}`
                console.log('Fetching leaves from', url)
                const res = await axiosAPI.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.data && res.data.leaves) setLeaves(res.data.leaves)
            } catch (err) {
                console.error('Error fetching leaves', err)
                setError(err.response?.data?.message || err.message)
            } finally {
                setLoading(false)
            }
        }

        // Only fetch when auth check is done and we have a user with a valid id
        if (user && (user._id || user.id)) {
            fetchLeaves()
        } else {
            setLeaves([])
        }
    }, [user, authLoading])

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token') || user?.token
            const res = await axiosAPI.put(`/api/leave/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            // update locally
            setLeaves((prev) => prev.map(l => l._id === id ? res.data.leave : l))
        } catch (err) {
            console.error('Failed to update status', err)
            alert('Failed to update status: ' + (err.response?.data?.message || err.message))
        }
    }

    return (
        <div className="min-h-screen bg-gray-700 text-gray-100 p-3 sm:p-6">
            <div className="max-w-6xl mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-xl sm:text-2xl font-semibold">Manage Leave</h3>
                        {/* Only show add-new for non-admin users (employees) */}
                        {user?.role !== 'admin' && (
                            <div className="flex-shrink-0">
                                <Link
                                    to="/employee-dashboard/add-leave"
                                    className="inline-block w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow"
                                >
                                    Add New Leave
                                </Link>
                            </div>
                        )}
                    </div>

                    {(authLoading || loading) && <div className="py-6 text-center">Loading...</div>}
                    {error && <div className="text-red-400 text-sm">{error}</div>}

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        {user?.role === 'admin' ? (
                            <Table leaves={leaves} onUpdateStatus={updateStatus} />
                        ) : (
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm">SNo</th>
                                        <th className="px-4 py-2 text-left text-sm">Leave Type</th>
                                        <th className="px-4 py-2 text-left text-sm">From - To</th>
                                        <th className="px-4 py-2 text-left text-sm">Description</th>
                                        <th className="px-4 py-2 text-left text-sm">Applied Date</th>
                                        <th className="px-4 py-2 text-left text-sm">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {leaves.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-gray-400">No leaves found</td>
                                        </tr>
                                    )}

                                    {leaves.map((leave, idx) => (
                                        <tr key={leave._id} className="hover:bg-gray-800">
                                            <td className="px-4 py-3 align-top">{idx + 1}</td>
                                            <td className="px-4 py-3 align-top">{leave.leaveType}</td>
                                            <td className="px-4 py-3 align-top">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 align-top max-w-xl break-words">{leave.reason}</td>
                                            <td className="px-4 py-3 align-top">{new Date(leave.createdAt).toLocaleString()}</td>
                                            <td className="px-4 py-3 align-top">
                                                <span className={`px-2 py-1 rounded text-sm ${leave.status === 'pending' ? 'bg-yellow-800 text-yellow-200' : leave.status === 'approved' ? 'bg-green-800 text-green-200' : 'bg-red-900 text-red-200'}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {leaves.length === 0 && !loading && (
                            <div className="py-6 text-center text-gray-400">No leaves found</div>
                        )}

                        {leaves.map((leave, idx) => (
                            <div key={leave._id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-400 mb-1">#{idx + 1}</div>
                                        <h4 className="font-semibold text-lg text-indigo-400">{leave.leaveType}</h4>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${leave.status === 'pending' ? 'bg-yellow-800 text-yellow-200' : leave.status === 'approved' ? 'bg-green-800 text-green-200' : 'bg-red-900 text-red-200'}`}>
                                        {leave.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-400">Duration:</span>
                                        <div className="text-gray-200 mt-1">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-gray-400">Reason:</span>
                                        <div className="text-gray-200 mt-1 break-words">{leave.reason}</div>
                                    </div>

                                    <div>
                                        <span className="text-gray-400">Applied on:</span>
                                        <div className="text-gray-200 mt-1">{new Date(leave.createdAt).toLocaleString()}</div>
                                    </div>
                                </div>

                                {user?.role === 'admin' && (
                                    <div className="flex gap-2 pt-2 border-t border-gray-700">
                                        <button 
                                            onClick={() => updateStatus(leave._id, 'approved')}
                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm py-2 px-3 rounded"
                                            disabled={leave.status !== 'pending'}
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(leave._id, 'rejected')}
                                            className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm py-2 px-3 rounded"
                                            disabled={leave.status !== 'pending'}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default List

