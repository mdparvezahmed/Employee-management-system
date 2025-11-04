import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL, axiosAPI } from '../../config/api'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../../context/AuthContext'

const Attendance = () => {
  const { user } = useAuth()
  const [qrToken, setQrToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [attendanceList, setAttendanceList] = useState([])
  const [listLoading, setListLoading] = useState(false)
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10))

  const apiUrl = API_BASE_URL

  const fetchToken = async (forceNew = false) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token') || user?.token
      const url = forceNew ? `${apiUrl}/api/attendance/generate?force=true` : `${apiUrl}/api/attendance/generate`
      const res = await axiosAPI.post(url.replace(apiUrl, ''), {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data && res.data.token) {
        setQrToken(res.data.token)
        setMessage(`✅ Token for ${res.data.date} ${forceNew ? '(regenerated)' : ''}`)
      }
    } catch (err) {
      console.error(err)
      setMessage(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async (date = filterDate) => {
    try {
      setListLoading(true)
      const token = localStorage.getItem('token') || user?.token
      const url = date ? `${apiUrl}/api/attendance?date=${date}` : `${apiUrl}/api/attendance`
      const res = await axiosAPI.get(url.replace(apiUrl, ''), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data && res.data.attendance) {
        setAttendanceList(res.data.attendance)
      }
    } catch (err) {
      console.error(err)
      setMessage(err.response?.data?.message || err.message)
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchToken()
      fetchAttendance()
    }
  }, [user])

  useEffect(() => {
    if (user?.role === 'admin' && filterDate) {
      fetchAttendance(filterDate)
    }
  }, [filterDate])

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-gray-700 text-gray-100">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* QR Code Section */}
        <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Daily QR Code</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={() => fetchToken(false)} className="px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-500 text-sm">Refresh</button>
              <button onClick={() => fetchToken(true)} className="px-3 py-2 bg-green-600 rounded hover:bg-green-500 text-sm">Generate Today's Token</button>
            </div>
          </div>

          {loading && <div className="py-6 text-center">Loading...</div>}

          {message && <div className="mb-4 text-xs sm:text-sm text-gray-300">{message}</div>}

          {qrToken ? (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-3 sm:p-4 rounded">
                <QRCodeSVG value={qrToken} size={window.innerWidth < 640 ? 180 : 220} fgColor="#111827" bgColor="#ffffff" />
              </div>
              <div className="text-xs sm:text-sm text-gray-300 break-all text-center px-2">(Scan this QR to mark attendance)</div>
              <div>
                <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 text-sm" onClick={() => { navigator.clipboard?.writeText(qrToken); setMessage('QR token copied to clipboard') }}>Copy token</button>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">No QR token available</div>
          )}
        </div>

        {/* Attendance List Section */}
        <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow">
          <div className="flex flex-col gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Attendance Records</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">Filter by date:</label>
              <div className="flex gap-2 flex-1">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                />
                <button onClick={() => fetchAttendance(filterDate)} className="px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-500 text-sm whitespace-nowrap">Refresh</button>
              </div>
            </div>
          </div>

          {listLoading && <div className="py-6 text-center">Loading attendance...</div>}

          {!listLoading && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">S.No</th>
                      <th className="px-4 py-2 text-left text-sm">Employee ID</th>
                      <th className="px-4 py-2 text-left text-sm">Name</th>
                      <th className="px-4 py-2 text-left text-sm">Date</th>
                      <th className="px-4 py-2 text-left text-sm">Time</th>
                      <th className="px-4 py-2 text-left text-sm">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {attendanceList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                          No attendance records for selected date
                        </td>
                      </tr>
                    ) : (
                      attendanceList.map((att, idx) => (
                        <tr key={att._id} className="hover:bg-gray-800">
                          <td className="px-4 py-3">{idx + 1}</td>
                          <td className="px-4 py-3 font-mono text-sm">{att.employeeId || att.userId?._id || '-'}</td>
                          <td className="px-4 py-3">{att.userId?.name || 'Unknown'}</td>
                          <td className="px-4 py-3">{att.date}</td>
                          <td className="px-4 py-3">{new Date(att.time).toLocaleTimeString()}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-800 text-green-200 rounded text-xs">
                              {att.method}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {attendanceList.length === 0 ? (
                  <div className="py-6 text-center text-gray-400">
                    No attendance records for selected date
                  </div>
                ) : (
                  attendanceList.map((att, idx) => (
                    <div key={att._id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-xs text-gray-400 mb-1">#{idx + 1}</div>
                          <div className="text-base font-semibold text-indigo-400">{att.userId?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-400 font-mono mt-1">ID: {att.employeeId || att.userId?._id || '-'}</div>
                        </div>
                        <span className="px-3 py-1 bg-green-800 text-green-200 rounded-full text-xs font-medium">
                          {att.method}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-300">
                            Date: <span className="text-white font-medium">{att.date}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-300">
                            Time: <span className="text-white font-medium">{new Date(att.time).toLocaleTimeString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {!listLoading && attendanceList.length > 0 && (
            <div className="mt-4 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              Total attendance for {filterDate}: <span className="font-semibold text-white">{attendanceList.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Attendance
