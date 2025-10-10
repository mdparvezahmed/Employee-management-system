import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const View = () => {
    const { id } = useParams();
    const [employee, setEmployee] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:7000/api/employee/${id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                if (response.data.success) {
                    setEmployee(response.data.employee);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.message || 'Error fetching employee data');
                }
            }
            finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, [id]);


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
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse text-lg text-gray-300">Loading employee details...</div>
                </div>
            ) : employee ? (
                <div>
                    {/* Header */}
                    <div className="border-b border-gray-700 pb-4 mb-6">
                        <h1 className="text-3xl font-bold text-white">Employee Details</h1>
                        <p className="text-gray-300 mt-1">Complete information about {employee.name}</p>
                    </div>

                    {/* Profile Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Profile Image */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
                                <img 
                                    src={`http://localhost:7000/uploads/${employee.userId?.profileImage || employee.image}`} 
                                    alt={employee.name}
                                    className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-gray-600 shadow-2xl"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/200/374151/9CA3AF?text=No+Image';
                                    }}
                                />
                                <div className="mt-4">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                        employee.role === 'admin' 
                                            ? 'bg-red-900 text-red-200 border border-red-700' 
                                            : 'bg-blue-900 text-blue-200 border border-blue-700'
                                    }`}>
                                        {employee.role?.charAt(0).toUpperCase() + employee.role?.slice(1)}
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
                                        <p className="text-lg text-white font-medium">{employee.userId?.name || employee.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Employee ID</label>
                                        <p className="text-lg text-white font-medium">{employee.employeeId}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                                        <p className="text-lg text-white">{employee.userId?.email || employee.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Date of Birth</label>
                                        <p className="text-lg text-white">{formatDate(employee.dob)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Gender</label>
                                        <p className="text-lg text-white capitalize">{employee.gender}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Marital Status</label>
                                        <p className="text-lg text-white capitalize">{employee.maritalStatus}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
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
                                    <p className="text-lg text-white font-medium">{employee.designation}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-blue-300">Department</label>
                                    <p className="text-lg text-white font-medium">
                                        {employee.department?.dep_name || 'Not Assigned'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-blue-300">Department Description</label>
                                    <p className="text-blue-100">
                                        {employee.department?.description || 'No description available'}
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
                                    <p className="text-2xl text-green-200 font-bold">{formatSalary(employee.salary)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-green-300">Annual Salary</label>
                                    <p className="text-lg text-green-100 font-medium">{formatSalary(employee.salary * 12)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employment Timeline */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Employment Timeline
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400">Date Joined</label>
                                <p className="text-lg text-white">{formatDate(employee.createdAt)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-400">Last Updated</label>
                                <p className="text-lg text-white">{formatDate(employee.updatedAt)}</p>
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

export default View
