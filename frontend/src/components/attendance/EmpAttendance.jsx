import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL, axiosAPI } from '../../config/api'

const EmpAttendance = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [myAttendance, setMyAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM

  const apiUrl = API_BASE_URL

  const fetchMyAttendance = async () => {
    if (!user?._id) return
    try {
      setLoading(true)
      const token = localStorage.getItem('token') || user?.token
      // Employee endpoint now automatically filters to own records
      const res = await axiosAPI.get(`/api/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data && res.data.attendance) {
        // Filter by selected month
        const filtered = res.data.attendance.filter(att => att.date.startsWith(filterMonth))
        setMyAttendance(filtered)
      }
    } catch (err) {
      console.error('Error fetching attendance', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchMyAttendance()
    }
  }, [user, filterMonth])

  // Calculate attendance stats for current month
  const presentDays = myAttendance.length

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-gray-700 text-gray-100">
      <div className="max-w-5xl mx-auto">
        
        {/* Attendance History Section */}
        <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow">
          <div className="flex flex-col gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">My Attendance History</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/employee-dashboard/add-attendance')}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-medium text-center"
              >
                Mark Attendance
              </button>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300 whitespace-nowrap">Month:</label>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="mb-6">
            <div className="bg-gray-800 p-4 sm:p-6 rounded text-center w-full sm:inline-block">
              <div className="text-2xl sm:text-3xl font-bold text-green-400">{presentDays}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Days Present This Month</div>
            </div>
          </div>

          {loading && <div className="py-6 text-center">Loading...</div>}

          {!loading && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">S.No</th>
                      <th className="px-4 py-2 text-left text-sm">Date</th>
                      <th className="px-4 py-2 text-left text-sm">Day</th>
                      <th className="px-4 py-2 text-left text-sm">Check-in Time</th>
                      <th className="px-4 py-2 text-left text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {myAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                          No attendance records for selected month
                        </td>
                      </tr>
                    ) : (
                      myAttendance.map((att, idx) => {
                        const date = new Date(att.date)
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                        return (
                          <tr key={att._id} className="hover:bg-gray-800">
                            <td className="px-4 py-3">{idx + 1}</td>
                            <td className="px-4 py-3">{att.date}</td>
                            <td className="px-4 py-3">{dayName}</td>
                            <td className="px-4 py-3">{new Date(att.time).toLocaleTimeString()}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-green-800 text-green-200 rounded text-xs">
                                Present
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {myAttendance.length === 0 ? (
                  <div className="py-6 text-center text-gray-400">
                    No attendance records for selected month
                  </div>
                ) : (
                  myAttendance.map((att, idx) => {
                    const date = new Date(att.date)
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
                    return (
                      <div key={att._id} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="text-xs text-gray-400 mb-1">#{idx + 1}</div>
                            <div className="text-lg font-semibold text-indigo-400">{att.date}</div>
                            <div className="text-sm text-gray-300">{dayName}</div>
                          </div>
                          <span className="px-3 py-1 bg-green-800 text-green-200 rounded-full text-xs font-medium">
                            Present
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-300">
                            Check-in: <span className="text-white font-medium">{new Date(att.time).toLocaleTimeString()}</span>
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmpAttendance
