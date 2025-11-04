import React, { useState } from 'react'
import axios from 'axios'
import { axiosAPI } from '../../config/api'
import { useAuth } from '../../context/AuthContext'

const settings = () => {
  const { user } = useAuth()
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' })
      setLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match' })
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' })
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
  const response = await axiosAPI.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully' })
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to change password' 
      })
    } finally {
      setLoading(false)
    }
  }

return (
    <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
        
        {/* Change Password Section */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700">
            
            {message.text && (
                <div className={`mb-4 p-3 rounded-md ${
                    message.type === 'success' 
                        ? 'bg-green-900 text-green-300 border border-green-600' 
                        : 'bg-red-900 text-red-300 border border-red-600'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400"
                        placeholder="Enter your current password"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400"
                        placeholder="Enter your new password"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400"
                        placeholder="Confirm your new password"
                        required
                    />
                </div>

                <div className="pt-4 flex flex-col items-center">
                    <div className="text-sm text-center text-gray-400 mb-2">
                        Password must be at least 6 characters long
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 w-full py-2 rounded-md font-medium transition-colors ${
                            loading 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-500 focus:ring-2 focus:ring-blue-400'
                        } text-white`}
                    >
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    </div>
)
}

export default settings
