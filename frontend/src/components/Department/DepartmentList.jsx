import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper';
import axios from 'axios';



const DepartmentList = () => {
  const [departments, setDepartments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filteredDepartments, setFilteredDepartments] = React.useState([]);

  const onDepartmentDelete = async (id) => {
    const updatedDepartments = departments.filter((dep) => dep._id !== id);
    setDepartments(updatedDepartments);
    setFilteredDepartments(updatedDepartments);
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:7000/api/department',
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        const data = await response.data;
        if (data.success) {
          let sno = 1;
          const departmentData = data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: <DepartmentButtons _id={dep._id} onDepartmentDelete={onDepartmentDelete} />
          }));
          setDepartments(departmentData);
          setFilteredDepartments(departmentData);
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
    fetchDepartments();
  }, [])

  const filterDepartments = (e) => {
    const records = departments.filter((dep) => 
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredDepartments(records);
  }

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
            <h3 className="text-2xl font-bold text-white">Manage Departments</h3>
          </div>

          {/* Controls */}
          <div className="mb-6 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
            {/* Search Input */}
            <div className="w-full md:w-auto md:flex-1 md:max-w-md">
              <input 
                type="text" 
                placeholder="Search departments..." 
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={filterDepartments}
              />
            </div>
            
            {/* Add Button */}
            <div className="w-full md:w-auto">
              <Link 
                to="/admin-dashboard/add-department" 
                className="block w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-center transition-colors duration-200"
              >
                Add New Department
              </Link>
            </div>
          </div>

          {/* Table for larger screens */}
          <div className="hidden md:block">
            <div className="dark-table">
              <DataTable
                columns={columns}
                data={filteredDepartments}
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
            {filteredDepartments.map((department, index) => (
              <div key={department._id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {department.dep_name}
                    </h4>
                    <p className="text-sm text-gray-400">Department #{department.sno}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
                    onClick={() => {
                      const navigate = () => window.location.href = `/admin-dashboard/department/${department._id}`;
                      navigate();
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
                    onClick={() => {
                      const confirm = window.confirm("Are you sure you want to delete this department?");
                      if (confirm) {
                        onDepartmentDelete(department._id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            
            {/* Pagination for mobile */}
            {filteredDepartments.length > 10 && (
              <div className="text-center pt-4">
                <p className="text-gray-400 text-sm">
                  Showing {filteredDepartments.length} departments
                </p>
              </div>
            )}
          </div>

          {/* No data state */}
          {filteredDepartments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-300 text-lg mb-2">No departments found</div>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or add a new department
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DepartmentList
