import React from 'react'
import SummaryCard from './SummaryCard'
import { FaBuilding, FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaRegCheckCircle, FaTimesCircle, FaUser } from 'react-icons/fa'

const AdminSummary = () => {
    return (
        <div className='p-6 bg-gray-700 text-white'>
            <h3 className='text-2xl font-semibold'>Dashboard Overview</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                <SummaryCard icon={<FaUser />} text="Total Employees" number={100} />
                <SummaryCard icon={<FaBuilding />} text="Total Departments" number={10} />
                <SummaryCard icon={<FaMoneyBillWave />} text="Monthly Salary" number={25000} />
            </div>
            <div className='mt-8'>
                <h4 className='text-md font-semibold text-2xl'>Leave Details</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                    <SummaryCard icon={<FaFileAlt />} text="Total Leave Requests" number={50} />
                    <SummaryCard icon={<FaHourglassHalf />} text="Pending Approvals" number={5} />
                    <SummaryCard icon={<FaRegCheckCircle />} text="Leave Approved" number={5} />
                    <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={15} bgcolor="bg-red-500" />
                </div>
            </div>
        </div>
    )
}

export default AdminSummary
