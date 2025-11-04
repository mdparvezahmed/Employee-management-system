import React, { useCallback, useEffect, useMemo, useState } from 'react'
import SummaryCard from './SummaryCard'
import { FaBuilding, FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaRegCheckCircle, FaTimesCircle, FaUser } from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL, axiosAPI } from '../../config/api'

const AdminSummary = () => {
        const apiUrl = API_BASE_URL;
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const numberFmt = useMemo(() => new Intl.NumberFormat('en-US'), []);
    const currencyFmt = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }), []);

        const fetchStats = useCallback(async () => {
        try {
            setError(null);
            const token = localStorage.getItem('token');
                    const res = await axiosAPI.get(`/api/admin/stats`, {
                        headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data?.success) {
                setStats(res.data.stats);
            } else {
                setError('Failed to load stats');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
        }, [apiUrl]);

    useEffect(() => {
        fetchStats();
        const id = setInterval(fetchStats, 15000); // refresh every 15s for near real-time
        return () => clearInterval(id);
        }, [fetchStats]);

    return (
        <div className='p-6 bg-gray-700 text-white'>
            <div className='flex items-center justify-between'>
                <h3 className='text-2xl font-semibold'>Dashboard Overview</h3>
                <button onClick={fetchStats} className='px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded'>Refresh</button>
            </div>

            {error && (
                <div className='mt-4 p-3 rounded bg-red-900 border border-red-700 text-red-200 text-sm'>
                    {error}
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                <SummaryCard icon={<FaUser />} text="Total Employees" number={loading ? '—' : numberFmt.format(stats?.employees ?? 0)} />
                <SummaryCard icon={<FaBuilding />} text="Total Departments" number={loading ? '—' : numberFmt.format(stats?.departments ?? 0)} />
                <SummaryCard icon={<FaMoneyBillWave />} text="Monthly Salary" number={loading ? '—' : currencyFmt.format(stats?.monthlySalary ?? 0)} />
            </div>

            <div className='mt-8'>
                <h4 className='text-md font-semibold text-2xl'>Live Activity</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                    <SummaryCard icon={<FaFileAlt />} text="Total Leave Requests" number={loading ? '—' : numberFmt.format(stats?.leaves?.total ?? 0)} />
                    <SummaryCard icon={<FaHourglassHalf />} text="Pending Approvals" number={loading ? '—' : numberFmt.format(stats?.leaves?.pending ?? 0)} />
                    <SummaryCard icon={<FaRegCheckCircle />} text="Leave Approved" number={loading ? '—' : numberFmt.format(stats?.leaves?.approved ?? 0)} />
                    <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={loading ? '—' : numberFmt.format(stats?.leaves?.rejected ?? 0)} bgcolor="bg-red-500" />
                </div>
            </div>

            <div className='mt-8'>
                <h4 className='text-md font-semibold text-2xl'>Attendance</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                    <SummaryCard icon={<FaRegCheckCircle />} text="Marked Today" number={loading ? '—' : numberFmt.format(stats?.attendanceToday ?? 0)} />
                </div>
            </div>
        </div>
    )
}

export default AdminSummary
