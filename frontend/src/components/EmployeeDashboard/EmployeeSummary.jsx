import React from 'react'
import Summary from './summary'
import { FaBuilding, FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaRegCheckCircle, FaTimesCircle, FaUser } from 'react-icons/fa'

const EmployeeSummary = () => {
    return (
        <div className='p-6 bg-gray-700 text-white'>
            <h3 className='text-2xl font-semibold'>Dashboard Overview</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                <Summary icon={<FaUser />} text="Total yearly salary" number={300000} />
                <Summary icon={<FaMoneyBillWave />} text="Monthly Salary" number={25000} />
            </div>
            <div className='mt-8'>
                <h4 className='text-md font-semibold text-2xl'>Leave Details</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                    <Summary icon={<FaFileAlt />} text="Total Leave this year" number={6} />
                    <Summary icon={<FaHourglassHalf />} text="Pending Approvals" number={1} />
                </div>
            </div>
        </div>
    )
}

export default EmployeeSummary
