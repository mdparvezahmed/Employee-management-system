import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Summary from './summary'
import { FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaUser } from 'react-icons/fa'
import axios from 'axios'
import { API_BASE_URL, axiosAPI } from '../../config/api'
import { useAuth } from '../../context/AuthContext'

const EmployeeSummary = () => {
        const apiUrl = API_BASE_URL;
    const { user } = useAuth();

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [monthlySalary, setMonthlySalary] = useState(0);
    const [yearlySalary, setYearlySalary] = useState(0);
    const [totalLeavesThisYear, setTotalLeavesThisYear] = useState(0);
    const [pendingLeaves, setPendingLeaves] = useState(0);

    const numberFmt = useMemo(() => new Intl.NumberFormat('en-US'), []);
    const currencyFmt = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }), []);

    const getUserId = (u) => u?._id || u?.id;

    const resolveUser = useCallback(async () => {
        try {
            setError(null);
            const ctxId = getUserId(user);
            if (ctxId) {
                setCurrentUser(user);
                return;
            }
            const token = localStorage.getItem('token');
            if (token) {
            const res = await axiosAPI.get(`/api/auth/verify`, { headers: { Authorization: `Bearer ${token}` } });
                if (res.data?.success && res.data?.user) {
                    setCurrentUser(res.data.user);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to resolve user');
        } finally {
            setLoading(false);
        }
    }, [apiUrl, user]);

    const fetchEmployee = useCallback(async (uid, signal) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axiosAPI.get(`/api/employee/${uid}`, { headers: { Authorization: `Bearer ${token}` }, signal });
            if (res.data?.success && res.data?.employee) {
                const salary = Number(res.data.employee.salary || 0);
                setMonthlySalary(salary);
                setYearlySalary(salary * 12);
            }
        } catch (err) {
            if (axios.isCancel(err)) return;
            // Keep going even if no employee profile; salaries remain 0
        }
    }, [apiUrl]);

    const fetchLeaves = useCallback(async (uid, signal) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axiosAPI.get(`/api/leave`, { params: { userId: uid }, headers: { Authorization: `Bearer ${token}` }, signal });
            if (res.data?.success && Array.isArray(res.data.leaves)) {
                const year = new Date().getFullYear();
                const inYear = res.data.leaves.filter(lv => {
                    const d = lv.startDate ? new Date(lv.startDate) : null;
                    return d && d.getFullYear() === year;
                });
                setTotalLeavesThisYear(inYear.length);
                setPendingLeaves(inYear.filter(lv => lv.status === 'pending').length);
            }
        } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.response?.data?.message || err.message || 'Failed to load leaves');
        }
    }, [apiUrl]);

    // Resolve user once
    useEffect(() => {
        resolveUser();
    }, [resolveUser]);

    // Fetch data when we have a user
    useEffect(() => {
        const uid = getUserId(currentUser);
        if (!uid) return;
        const controller = new AbortController();

        const run = () => {
            fetchEmployee(uid, controller.signal);
            fetchLeaves(uid, controller.signal);
        };

        run();
        const id = setInterval(run, 15000); // Refresh every 15s
        return () => { clearInterval(id); controller.abort(); };
    }, [currentUser, fetchEmployee, fetchLeaves]);

    return (
        <div className='p-6 bg-gray-700 text-white'>
            <div className='flex items-center justify-between'>
                <h3 className='text-2xl font-semibold'>Dashboard Overview</h3>
                <button onClick={() => {
                    const uid = getUserId(currentUser);
                    if (uid) { fetchEmployee(uid); fetchLeaves(uid); }
                }} className='px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded'>Refresh</button>
            </div>

            {error && (
                <div className='mt-4 p-3 rounded bg-red-900 border border-red-700 text-red-200 text-sm'>
                    {error}
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                <Summary icon={<FaUser />} text="Total yearly salary" number={loading ? '—' : currencyFmt.format(yearlySalary)} />
                <Summary icon={<FaMoneyBillWave />} text="Monthly Salary" number={loading ? '—' : currencyFmt.format(monthlySalary)} />
            </div>
            <div className='mt-8'>
                <h4 className='text-md font-semibold text-2xl'>Leave Details</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                    <Summary icon={<FaFileAlt />} text="Total Leave this year" number={loading ? '—' : numberFmt.format(totalLeavesThisYear)} />
                    <Summary icon={<FaHourglassHalf />} text="Pending Approvals" number={loading ? '—' : numberFmt.format(pendingLeaves)} />
                </div>
            </div>
        </div>
    )
}

export default EmployeeSummary
