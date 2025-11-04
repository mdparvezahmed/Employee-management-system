import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import axios from 'axios'
import { API_BASE_URL, axiosAPI } from '../../config/api'

const ScanAttendance = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [manualToken, setManualToken] = useState('')
  const [cameras, setCameras] = useState([])
  const [selectedCamera, setSelectedCamera] = useState('')
  const html5QrCodeRef = useRef(null)

  const apiUrl = API_BASE_URL

  // Get available cameras
  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setCameras(devices)
        // Select back camera by default
        const backCamera = devices.find(d => d.label.toLowerCase().includes('back')) || devices[0]
        setSelectedCamera(backCamera.id)
      }
    }).catch(err => {
      console.error('Error getting cameras:', err)
      setMessage({ type: 'error', text: 'No cameras found. Please check camera permissions.' })
    })
  }, [])

  const handleScanSuccess = async (decodedText) => {
    console.log('QR Code detected:', decodedText)
    
    // Stop scanner
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        setScanning(false)
        html5QrCodeRef.current = null
      }).catch(err => console.error('Error stopping scanner:', err))
    }

    // Submit attendance
    try {
      const token = localStorage.getItem('token') || user?.token
      const res = await axiosAPI.post(`/api/attendance/scan`, { qr: decodedText }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: res.data?.message || 'Attendance recorded successfully!' })
      
      // Navigate to list after 2 seconds
      setTimeout(() => {
        navigate('/employee-dashboard/attendance')
      }, 2000)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message })
    }
  }

  const handleScanError = (errorMessage) => {
    // Ignore frequent scan errors
  }

  const startScanner = async () => {
    if (!selectedCamera) {
      setMessage({ type: 'error', text: 'Please select a camera' })
      return
    }

    setScanning(true)
    setMessage(null)

    // Wait for DOM to be ready
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode('qr-video-container')
        html5QrCodeRef.current = html5QrCode

        await html5QrCode.start(
          selectedCamera,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          handleScanSuccess,
          handleScanError
        )
      } catch (err) {
        console.error('Error starting scanner:', err)
        setMessage({ type: 'error', text: 'Failed to start camera. Please check permissions.' })
        setScanning(false)
      }
    }, 100)
  }

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        setScanning(false)
        html5QrCodeRef.current = null
      }).catch(err => console.error('Error stopping scanner:', err))
    } else {
      setScanning(false)
    }
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    if (!manualToken.trim()) return

    try {
      const token = localStorage.getItem('token') || user?.token
      const res = await axiosAPI.post(`/api/attendance/scan`, { qr: manualToken }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage({ type: 'success', text: res.data?.message || 'Attendance recorded successfully!' })
      setManualToken('')
      
      // Navigate to list after 2 seconds
      setTimeout(() => {
        navigate('/employee-dashboard/attendance')
      }, 2000)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message })
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(err => console.error('Cleanup error:', err))
      }
    }
  }, [])

  return (
    <div className="min-h-screen p-6 bg-gray-700 text-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Mark Attendance</h2>
            <button
              onClick={() => navigate('/employee-dashboard/attendance')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              View My Attendance
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-800 text-green-200' : 'bg-red-900 text-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Camera Scanner Section */}
            <div>
              <h3 className="text-md font-medium mb-3">Option 1: Scan QR Code</h3>
              
              {!scanning && cameras.length > 0 && (
                <div className="mb-3">
                  <label className="block text-sm text-gray-300 mb-1">Select Camera:</label>
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  >
                    {cameras.map(camera => (
                      <option key={camera.id} value={camera.id}>
                        {camera.label || `Camera ${camera.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!scanning ? (
                <button
                  onClick={startScanner}
                  disabled={!selectedCamera}
                  className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium"
                >
                  Start Camera
                </button>
              ) : (
                <div>
                  <div id="qr-video-container" className="w-full rounded-lg overflow-hidden mb-3 bg-black"></div>
                  <button
                    onClick={stopScanner}
                    className="w-full px-3 py-2 bg-red-600 hover:bg-red-500 rounded font-medium"
                  >
                    Stop Camera
                  </button>
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    Point camera at the QR code displayed on admin screen
                  </div>
                </div>
              )}
            </div>

            {/* Manual Entry Section */}
            <div>
              <h3 className="text-md font-medium mb-3">Option 2: Manual Entry</h3>
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Paste QR Token</label>
                  <textarea
                    rows="4"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="Paste token from admin here..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!manualToken.trim()}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium"
                >
                  Submit Attendance
                </button>
              </form>
              <div className="mt-2 text-xs text-gray-400">
                Ask admin to copy the token if camera doesn't work
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScanAttendance
