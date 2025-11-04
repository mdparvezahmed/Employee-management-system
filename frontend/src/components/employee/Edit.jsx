import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDepartments } from '../../utils/EmployeeHelper'
import axios from 'axios';
import { axiosAPI, buildUploadUrl } from '../../config/api';

const Edit = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams() // Get employee ID from URL
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  }

  const fetchEmployeeData = async () => {
    try {
      const response = await axiosAPI.get(`/api/employee/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.data.success) {
        const employee = response.data.employee;
        setFormData({
          name: employee.name || '',
          email: employee.email || '',
          employeeId: employee.employeeId || '',
          dob: employee.dob ? employee.dob.split('T')[0] : '', // Format date for input
          gender: employee.gender || '',
          maritalStatus: employee.maritalStatus || '',
          designation: employee.designation || '',
          department: employee.department._id || employee.department || '',
          salary: employee.salary || '',
          role: employee.role || '',
          // Don't include password and image in edit form initially
        });

        // Set image preview if employee has an existing image
        if (employee.profileImage) {
          setImagePreview(buildUploadUrl(employee.profileImage));
        }
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      alert('Error loading employee data');
      navigate('/admin-dashboard/employees');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      // Fetch departments
      const departments = await fetchDepartments();
      setDepartments(departments);
      
      // Fetch employee data for editing
      if (id) {
        await fetchEmployeeData();
      }
    };
    
    initializeData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      // Only append the field if it has a value or if it's an image file
      if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
        formDataObj.append(key, formData[key]);
      }
    });
    
    try {
      const response = await axiosAPI.put(`/api/employee/edit/${id}`, formDataObj, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        alert('Employee updated successfully!');
        navigate("/admin-dashboard/employees");
      }

    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert("An error occurred while updating the employee");
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading employee data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Employee</h1>
          <p className="text-gray-300">Update the employee information below</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Employee Information</h2>
          </div>

          <form className="p-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information Section */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-600">
                  Personal Information
                </h3>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name='name'
                  value={formData.name || ''}
                  placeholder='Enter full name'
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 text-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="email"
                  name='email'
                  value={formData.email || ''}
                  placeholder='Enter email address'
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 text-white"
                />
              </div>

              {/* Employee ID */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Employee ID <span className="text-red-400">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name='employeeId'
                  value={formData.employeeId || ''}
                  placeholder='Enter employee ID'
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 text-white"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Date of Birth <span className="text-red-400">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="date"
                  name='dob'
                  value={formData.dob || ''}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white [color-scheme:dark]"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Gender <span className="text-red-400">*</span>
                </label>
                <select
                  onChange={handleChange}
                  name='gender'
                  value={formData.gender || ''}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Marital Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Marital Status <span className="text-red-400">*</span>
                </label>
                <select
                  onChange={handleChange}
                  name='maritalStatus'
                  value={formData.maritalStatus || ''}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white"
                >
                  <option value="">Select Marital Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                </select>
              </div>

              {/* Professional Information Section */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-600">
                  Professional Information
                </h3>
              </div>

              {/* Designation */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Designation <span className="text-red-400">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="text"
                  name='designation'
                  value={formData.designation || ''}
                  placeholder='Enter designation'
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 text-white"
                />
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Department <span className="text-red-400">*</span>
                </label>
                <select
                  onChange={handleChange}
                  name='department'
                  value={formData.department || ''}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white"
                >
                  <option value="">Select Department</option>
                  {departments.map(dep => (
                    <option key={dep._id} value={dep._id} >{dep.dep_name}</option>
                  ))}
                </select>
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Salary <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    onChange={handleChange}
                    type="number"
                    name='salary'
                    value={formData.salary || ''}
                    placeholder='Enter salary amount'
                    required
                    className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 text-white"
                  />
                </div>
              </div>

              {/* System Access Section */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-gray-600">
                  System Access
                </h3>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password <span className="text-gray-500">(leave blank to keep current)</span>
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  name='password'
                  placeholder='Enter new password (optional)'
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 text-white"
                />
                <p className="text-xs text-gray-400">Leave blank to keep current password. If changing, password should be at least 8 characters long</p>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Role <span className="text-red-400">*</span>
                </label>
                <select
                  onChange={handleChange}
                  name='role'
                  value={formData.role || ''}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-white"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              {/* Profile Image */}
              <div className="space-y-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-300">
                  Profile Image <span className="text-gray-500">(optional)</span>
                </label>
                <div className="flex flex-col items-center space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center bg-gray-700">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <input
                    type="file"
                    name='image'
                    accept='image/*'
                    onChange={(e) => {
                      handleImageChange(e);
                      handleChange(e);
                    }}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:text-sm file:font-medium file:bg-gray-700 file:text-blue-400 hover:file:bg-gray-600 file:border file:border-gray-600 transition-colors duration-200"
                  />
                  <p className="text-xs text-gray-400">Leave empty to keep current image</p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-600">
              <button
                type='submit'
                className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg'
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Update Employee
                </span>
              </button>
              <button
                type='button'
                onClick={() => navigate('/admin-dashboard/employees')}
                className='flex-1 sm:flex-initial bg-gray-600 text-gray-200 font-medium py-3 px-6 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Edit
