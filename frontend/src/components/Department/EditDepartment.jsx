import axios from 'axios';
import { axiosAPI } from '../../config/api';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

const EditDepartment = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [department, setDepartment] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      try {
        const response = await axiosAPI.get(`/api/department/${id}`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        if (response.data.success) {
          setDepartment(response.data.department);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.message || 'Error fetching department');
        }
      }
      finally {
        setLoading(false);
      }
    }
    fetchDepartment();
  }, [id]);



  const handleChange = (e) => {
    setDepartment({ ...department, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosAPI.put(`/api/department/${id}`, 
        {
          dep_name: department.dep_name,
          description: department.description
        },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.data.success) {
        alert('Department updated successfully!');
        navigate('/admin-dashboard/departments');
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.message || 'Error updating department');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? <div>Loading...</div> : <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="max-w-3xl w-full p-8 space-y-6 bg-gray-800 text-white rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4 text-center">Edit Department</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="dep_name" className="block text-sm font-medium text-gray-300 mb-2">
                Department Name:
              </label>
              <input
                onChange={handleChange}
                type="text"
                placeholder="Enter Department Name"
                value={department.dep_name || ''}
                id="dep_name"
                name="dep_name"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description:
              </label>
              <textarea
                placeholder="Enter Department Description"
                id="description"
                name="description"
                onChange={handleChange}
                value={department.description || ''}
                rows={4}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition duration-200"
            >
              Edit Department
            </button>
          </form>
        </div>
      </div>}
    </>
  )
}

export default EditDepartment
