import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL, axiosAPI, buildUploadUrl } from '../../config/api'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const hasFetchedRef = useRef(false);

    const apiUrl = API_BASE_URL;

    // Helper to safely read user id regardless of shape (login returns id, verify returns _id)
    const getUserId = (u) => u?._id || u?.id;

    useEffect(() => {
        // Resolve a stable current user once (AuthContext may briefly have login-shape with `id` or be null)
        if (hasFetchedRef.current) return;

        const resolveUser = async () => {
            try {
                const ctxId = getUserId(user);
                const token = localStorage.getItem('token');

                if (ctxId) {
                    // Use context user immediately
                    setCurrentUser(user);
                    setProfileData({ type: 'user', data: user });
                    setLoading(false); // Render instantly with basic account info
                    hasFetchedRef.current = true;
                    return;
                }

                if (token) {
                    // Fallback: verify token to get full user document
                    const res = await axiosAPI.get(`/api/auth/verify`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data?.success && res.data?.user) {
                        setCurrentUser(res.data.user);
                        setProfileData({ type: 'user', data: res.data.user });
                    }
                }
            } catch (err) {
                console.error('Verify/user resolve error:', err);
            } finally {
                setLoading(false); // Ensure we never get stuck on loading
                hasFetchedRef.current = true;
            }
        };

        resolveUser();
    // Intentionally depend only on `user` to run once when context hydrates
    }, [user]);

    // Upgrade to full employee profile when available
    useEffect(() => {
        const uId = getUserId(currentUser);
        if (!uId) return;

        const controller = new AbortController();

        const fetchEmployee = async () => {
            try {
                const token = localStorage.getItem('token');
                const targetUserId = id && id !== 'current' ? id : uId;
                const response = await axiosAPI.get(`/api/employee/${targetUserId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal
                });

                if (response.data?.success && response.data?.employee) {
                    setProfileData({ type: 'employee', data: response.data.employee });
                }
            } catch (error) {
                if (axios.isCancel(error)) return;
                console.error('Employee fetch error:', error);
                // Keep showing basic user profile if employee not found
            }
        };

        fetchEmployee();

        return () => controller.abort();
    }, [currentUser, id]);


    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatSalary = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-gray-900 shadow-2xl rounded-lg border border-gray-700">
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <div className="text-lg text-gray-300">Loading profile...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-gray-900 shadow-2xl rounded-lg border border-gray-700">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-2">Profile Not Available</h2>
                    <p className="text-gray-400">Unable to load profile data.</p>
                </div>
            </div>
        );
    }

    const isEmployee = profileData.type === 'employee';
    const data = profileData.data;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 shadow-2xl rounded-lg border border-gray-700">
            <div>
                {/* Header */}
                <div className="border-b border-gray-700 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-white">
                        {isEmployee ? 'Employee Profile' : 'User Profile'}
                    </h1>
                    <p className="text-gray-300 mt-1">
                        {isEmployee 
                            ? `Complete employee information for ${data?.userId?.name || data?.name || 'Unknown'}`
                            : `User account information for ${data?.name || 'Unknown'}`
                        }
                    </p>
                    {!isEmployee && data?.role !== 'admin' && (
                            <div className="mt-2 p-3 bg-blue-900 border border-blue-700 rounded-lg">
                                <p className="text-blue-200 text-sm">
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <strong>Profile Status:</strong> Your employee profile is being set up. 
                                    Contact your administrator if you need access to additional features.
                                </p>
                            </div>
                        )}
                    </div>



                    {/* Profile Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Profile Image */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                                <img 
                                    src={
                                        isEmployee
                                            ? buildUploadUrl(data?.userId?.profileImage || data?.image)
                                            : data?.profileImage
                                                ? buildUploadUrl(data.profileImage)
                                                : 'https://via.placeholder.com/200/374151/9CA3AF?text=No+Image'
                                    }
                                    alt={isEmployee ? (data?.name || 'Employee') : (data?.name || 'User')}
                                    className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-gray-600 shadow-2xl"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/200/374151/9CA3AF?text=No+Image';
                                    }}
                                />
                                <div className="mt-4">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                        data?.role === 'admin' 
                                            ? 'bg-red-900 text-red-200 border border-red-700' 
                                            : 'bg-blue-900 text-blue-200 border border-blue-700'
                                    }`}>
                                        {(data?.role || 'user')?.charAt(0).toUpperCase() + 
                                         (data?.role || 'user')?.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                                        <p className="text-lg text-white font-medium">
                                            {isEmployee 
                                                ? (data?.userId?.name || data?.name || 'N/A')
                                                : (data?.name || 'N/A')
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">
                                            {isEmployee ? 'Employee ID' : 'User ID'}
                                        </label>
                                        <p className="text-lg text-white font-medium">
                                            {isEmployee 
                                                ? (data?.employeeId || 'N/A')
                                                : (data?._id || 'N/A')
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                                        <p className="text-lg text-white">
                                            {isEmployee 
                                                ? (data?.userId?.email || data?.email || 'N/A')
                                                : (data?.email || 'N/A')
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Date of Birth</label>
                                        <p className="text-lg text-white">
                                            {isEmployee 
                                                ? (data?.dob ? formatDate(data.dob) : 'N/A')
                                                : 'Not Available'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Gender</label>
                                        <p className="text-lg text-white capitalize">
                                            {isEmployee 
                                                ? (data?.gender || 'N/A')
                                                : 'Not Available'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Marital Status</label>
                                        <p className="text-lg text-white capitalize">
                                            {isEmployee 
                                                ? (data?.maritalStatus || 'N/A')
                                                : 'Not Available'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information - Only show for employee records */}
                    {isEmployee ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg p-6 border border-blue-700">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                    </svg>
                                    Professional Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-blue-300">Designation</label>
                                        <p className="text-lg text-white font-medium">{data?.designation || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-blue-300">Department</label>
                                        <p className="text-lg text-white font-medium">
                                            {data?.department?.dep_name || 'Not Assigned'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-blue-300">Department Description</label>
                                        <p className="text-blue-100">
                                            {data?.department?.description || 'No description available'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-lg p-6 border border-green-700">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Compensation
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-green-300">Monthly Salary</label>
                                        <p className="text-2xl text-green-200 font-bold">{data?.salary ? formatSalary(data.salary) : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-green-300">Annual Salary</label>
                                        <p className="text-lg text-green-100 font-medium">{data?.salary ? formatSalary(data.salary * 12) : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Account Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-400">Account Type</label>
                                    <p className="text-lg text-white capitalize">{data?.role || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-400">Account Status</label>
                                    <p className="text-lg text-green-400">Active</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-400">Employee Profile</label>
                                    <p className="text-lg text-yellow-400">Incomplete - Contact administrator</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                {/* Timeline */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isEmployee ? 'Employment Timeline' : 'Account Timeline'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-400">
                                {isEmployee ? 'Date Joined' : 'Account Created'}
                            </label>
                            <p className="text-lg text-white">
                                {data?.createdAt ? formatDate(data.createdAt) : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Last Updated</label>
                            <p className="text-lg text-white">
                                {data?.updatedAt ? formatDate(data.updatedAt) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
