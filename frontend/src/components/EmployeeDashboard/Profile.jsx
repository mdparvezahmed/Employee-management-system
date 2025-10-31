import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [employee, setEmployee] = React.useState(null);
    const [loading, setLoading] = React.useState(true); // Start with loading true
    const [isEmployeeRecord, setIsEmployeeRecord] = React.useState(false);
    const [dataFetched, setDataFetched] = React.useState(false); // Track if we've attempted to fetch

    // Reset data fetched status when user changes
    useEffect(() => {
        setDataFetched(false);
        setEmployee(null);
        setIsEmployeeRecord(false);
        setLoading(true);
    }, [user?._id]);

    useEffect(() => {
        const fetchEmployee = async () => {
            // If auth is still loading, don't fetch employee data yet
            if (authLoading) {
                return;
            }

            // If no user after auth completes, mark as done loading
            if (!user || !user._id) {
                setLoading(false);
                setDataFetched(true);
                return;
            }

            // Only fetch if we haven't fetched yet
            if (!dataFetched) {
                console.log('Fetching employee data for user ID:', user._id);
                setLoading(true);
                
                try {
                    const response = await axios.get(`http://localhost:7000/api/employee/${user._id}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    
                    console.log('Employee API Response:', response.data);
                    
                    if (response.data.success && response.data.employee) {
                        console.log('Employee found:', response.data.employee.name);
                        setEmployee(response.data.employee);
                        setIsEmployeeRecord(true);
                    } else {
                        console.log('No employee record found');
                        setEmployee(null);
                        setIsEmployeeRecord(false);
                    }
                } catch (error) {
                    console.error('Error fetching employee:', error);
                    console.log('Will show user profile instead');
                    setEmployee(null);
                    setIsEmployeeRecord(false);
                } finally {
                    setLoading(false);
                    setDataFetched(true);
                }
            }
        }
        
        fetchEmployee();
    }, [user?._id, authLoading, dataFetched]);


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

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 shadow-2xl rounded-lg border border-gray-700">
            {(authLoading || loading || !dataFetched) ? (
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <div className="text-lg text-gray-300">Loading profile...</div>
                        <div className="text-sm text-gray-500 mt-2">
                            {authLoading ? 'Authenticating...' : 'Fetching employee data...'}
                        </div>
                    </div>
                </div>
            ) : !user ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-2">Authentication Required</h2>
                    <p className="text-gray-400">Please log in to view your profile.</p>
                </div>
            ) : (employee || (!isEmployeeRecord && user)) ? (
                <div>
                    {/* Header */}
                    <div className="border-b border-gray-700 pb-4 mb-6">
                        <h1 className="text-3xl font-bold text-white">
                            {isEmployeeRecord ? 'Employee Profile' : 'User Profile'}
                        </h1>
                        <p className="text-gray-300 mt-1">
                            {isEmployeeRecord 
                                ? `Complete employee information for ${employee?.userId?.name || employee?.name || 'Unknown'}`
                                : `User account information for ${user?.name || 'Unknown'}`
                            }
                        </p>
                        {!isEmployeeRecord && (
                            <div className="mt-2 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
                                <p className="text-yellow-200 text-sm">
                                    <strong>Note:</strong> You have a user account but no employee record. 
                                    Contact your administrator to complete your employee profile setup.
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
                                        isEmployeeRecord 
                                            ? `http://localhost:7000/uploads/${employee?.userId?.profileImage || employee?.image}` 
                                            : user?.profileImage 
                                                ? `http://localhost:7000/uploads/${user.profileImage}` 
                                                : 'https://via.placeholder.com/200/374151/9CA3AF?text=No+Image'
                                    } 
                                    alt={isEmployeeRecord ? (employee?.name || 'Employee') : (user?.name || 'User')}
                                    className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-gray-600 shadow-2xl"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/200/374151/9CA3AF?text=No+Image';
                                    }}
                                />
                                <div className="mt-4">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                        (isEmployeeRecord ? employee?.role : user?.role) === 'admin' 
                                            ? 'bg-red-900 text-red-200 border border-red-700' 
                                            : 'bg-blue-900 text-blue-200 border border-blue-700'
                                    }`}>
                                        {((isEmployeeRecord ? employee?.role : user?.role) || 'user')?.charAt(0).toUpperCase() + 
                                         ((isEmployeeRecord ? employee?.role : user?.role) || 'user')?.slice(1)}
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
                                            {isEmployeeRecord 
                                                ? (employee?.userId?.name || employee?.name || 'N/A')
                                                : (user?.name || 'N/A')
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">
                                            {isEmployeeRecord ? 'Employee ID' : 'User ID'}
                                        </label>
                                        <p className="text-lg text-white font-medium">
                                            {isEmployeeRecord 
                                                ? (employee?.employeeId || 'N/A')
                                                : (user?._id || 'N/A')
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                                        <p className="text-lg text-white">
                                            {isEmployeeRecord 
                                                ? (employee?.userId?.email || employee?.email || 'N/A')
                                                : (user?.email || 'N/A')
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Date of Birth</label>
                                        <p className="text-lg text-white">
                                            {isEmployeeRecord 
                                                ? (employee?.dob ? formatDate(employee.dob) : 'N/A')
                                                : 'Not Available'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Gender</label>
                                        <p className="text-lg text-white capitalize">
                                            {isEmployeeRecord 
                                                ? (employee?.gender || 'N/A')
                                                : 'Not Available'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Marital Status</label>
                                        <p className="text-lg text-white capitalize">
                                            {isEmployeeRecord 
                                                ? (employee?.maritalStatus || 'N/A')
                                                : 'Not Available'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information - Only show for employee records */}
                    {isEmployeeRecord ? (
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
                                        <p className="text-lg text-white font-medium">{employee?.designation || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-blue-300">Department</label>
                                        <p className="text-lg text-white font-medium">
                                            {employee?.department?.dep_name || 'Not Assigned'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-blue-300">Department Description</label>
                                        <p className="text-blue-100">
                                            {employee?.department?.description || 'No description available'}
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
                                        <p className="text-2xl text-green-200 font-bold">{employee?.salary ? formatSalary(employee.salary) : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-green-300">Annual Salary</label>
                                        <p className="text-lg text-green-100 font-medium">{employee?.salary ? formatSalary(employee.salary * 12) : 'N/A'}</p>
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
                                    <p className="text-lg text-white capitalize">{user?.role || 'N/A'}</p>
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
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {isEmployeeRecord ? 'Employment Timeline' : 'Account Timeline'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400">
                                    {isEmployeeRecord ? 'Date Joined' : 'Account Created'}
                                </label>
                                <p className="text-lg text-white">
                                    {isEmployeeRecord 
                                        ? (employee?.createdAt ? formatDate(employee.createdAt) : 'N/A')
                                        : (user?.createdAt ? formatDate(user.createdAt) : 'N/A')
                                    }
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400">Last Updated</label>
                                <p className="text-lg text-white">
                                    {isEmployeeRecord 
                                        ? (employee?.updatedAt ? formatDate(employee.updatedAt) : 'N/A')
                                        : (user?.updatedAt ? formatDate(user.updatedAt) : 'N/A')
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                        <button 
                            onClick={() => window.history.back()}
                            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 flex items-center border border-gray-600"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to List
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg className="w-24 h-24 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 className="text-2xl font-semibold text-gray-200 mb-2">Employee Not Found</h2>
                    <p className="text-gray-400">The requested employee could not be found in our records.</p>
                </div>
            )}
        </div>
    )
}

export default Profile
