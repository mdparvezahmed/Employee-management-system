import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDepartments } from '../../utils/EmployeeHelper'
import axios from 'axios';

const Add = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});

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

  useEffect(() => {
    setImagePreview(null);
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    }
    getDepartments();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });
    try {

      const response = await axios.post("http://localhost:7000/api/employee/add", formDataObj, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }

    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      } else {
        alert("An error occurred while adding the employee");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Employee</h1>
          <p className="text-gray-300">Fill in the details below to add a new employee to the system</p>
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
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  onChange={handleChange}
                  type="password"
                  name='password'
                  placeholder='Enter secure password'
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 text-white"
                />
                <p className="text-xs text-gray-400">Password should be at least 8 characters long</p>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Role <span className="text-red-400">*</span>
                </label>
                <select
                  onChange={handleChange}
                  name='role'
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
                  Profile Image <span className="text-red-400">*</span>
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
                    required
                    onChange={(e) => {
                      handleImageChange(e);
                      handleChange(e);
                    }}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:text-sm file:font-medium file:bg-gray-700 file:text-blue-400 hover:file:bg-gray-600 file:border file:border-gray-600 transition-colors duration-200"
                  />
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Employee
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

export default Add
