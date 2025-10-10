import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getColumns, EmployeeButtons } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';



const List = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:7000/api/employee',
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                const data = await response.data;
                if (data.success) {
                    let sno = 1;
                    const employeeData = data.employees.map((emp) => ({
                        _id: emp._id,
                        sno: sno++,
                        name: emp.name,
                        email: emp.email,
                        dep_name: emp.department.dep_name,
                        dateJoined: new Date(emp.createdAt).toLocaleDateString(),
                        profileImage: emp.userId.profileImage,
                        action: <EmployeeButtons _id={emp._id} />
                    }));
                    setEmployees(employeeData);
                    setFilteredEmployees(employeeData);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error);
                }
            }
            finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, []);

    // Filter employees based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = employees.filter(employee =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEmployees(filtered);
        } else {
            setFilteredEmployees(employees);
        }
    }, [searchTerm, employees]);


    return (
        <div className="min-h-screen bg-gray-900">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-white text-lg">Loading...</div>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h3 className="text-2xl font-bold text-white">Manage Employees</h3>
                    </div>

                    {/* Controls */}
                    <div className="mb-6 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
                        {/* Search Input */}
                        <div className="w-full md:w-auto md:flex-1 md:max-w-md">
                            <input 
                                type="text" 
                                placeholder="Search employees..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Add Button */}
                        <div className="w-full md:w-auto">
                            <Link 
                                to="/admin-dashboard/add-employee" 
                                className="block w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-center transition-colors duration-200"
                            >
                                Add New Employee
                            </Link>
                        </div>
                    </div>

                    {/* Table for larger screens */}
                    <div className="hidden md:block">
                        <div className="dark-table">
                            <DataTable
                                columns={getColumns(isMobile)}
                                data={filteredEmployees}
                                pagination
                                highlightOnHover
                                pointerOnHover
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[5, 10, 20]}
                            />
                        </div>
                    </div>

                    {/* Card layout for mobile screens */}
                    <div className="md:hidden space-y-4">
                        {filteredEmployees.map((employee, index) => (
                            <div key={employee._id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4">
                                <div className="flex items-start space-x-4 mb-4">
                                    <img
                                        src={`http://localhost:7000/uploads/${employee.profileImage}`}
                                        alt={employee.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-white">
                                            {employee.name}
                                        </h4>
                                        <p className="text-sm text-gray-400 mb-1">{employee.email}</p>
                                        <p className="text-sm text-blue-400">{employee.dep_name}</p>
                                        <p className="text-xs text-gray-500 mt-1">Joined: {employee.dateJoined}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors"
                                        onClick={() => navigate(`/admin-dashboard/employee/${employee._id}`)}
                                    >
                                        View
                                    </button>
                                    <button 
                                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors"
                                        onClick={() => navigate(`/admin-dashboard/employee/edit/${employee._id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors"
                                    >
                                        Salary
                                    </button>
                                    <button 
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-3 rounded-md text-sm transition-colors"
                                    >
                                        Leave
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {/* Pagination for mobile */}
                        {filteredEmployees.length > 10 && (
                            <div className="text-center pt-4">
                                <p className="text-gray-400 text-sm">
                                    Showing {filteredEmployees.length} employees
                                </p>
                            </div>
                        )}
                    </div>

                    {/* No data state */}
                    {filteredEmployees.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-300 text-lg mb-2">No employees found</div>
                            <p className="text-gray-400 text-sm">
                                {searchTerm ? 'Try adjusting your search or add a new employee' : 'Add your first employee to get started'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )

}

export default List
