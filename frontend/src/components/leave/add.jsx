import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { axiosAPI } from '../../config/api';

const Add = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    // ensure user exists before initializing state
    const [leave, setLeave] = React.useState({
        userId: user ? user._id : null,
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeave((preState) => ({ ...preState, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // send leave data in the request body and auth header in config
            console.log('Submitting leave via shared API client')
            const token = localStorage.getItem('token') || user?.token
            console.log('Using token (present?):', !!token)
            const response = await axiosAPI.post(`/api/leave/add`, leave, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(response.data.success){
                navigate('/employee-dashboard/Leaves');
            }
        } catch (error) {
            // Axios provides helpful serialization via toJSON()
            if (error && typeof error.toJSON === 'function') {
                console.error('Error adding leave:', error.toJSON());
            } else {
                console.error('Error adding leave (raw):', error);
            }
            // If server responded, show response body
            if (error.response) {
                console.error('Server response:', error.response.status, error.response.data);
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-6">
            <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Request for a Leave</h2>

                <form className="space-y-5"
                    onSubmit={handleSubmit}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Leave Type</label>
                            <select name="leaveType" value={leave.leaveType} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Select Type</option>
                                <option value="sick">Sick Leave</option>
                                <option value="casual">Casual Leave</option>
                                <option value="annual">Annual Leave</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">From Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={leave.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">To Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={leave.endDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="reason"
                            placeholder="Reason"
                            value={leave.reason}
                            onChange={handleChange}
                            required
                            className="w-full min-h-[110px] bg-gray-700 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            Add Leave
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Add
