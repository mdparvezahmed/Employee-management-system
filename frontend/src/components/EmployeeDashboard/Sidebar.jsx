import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaBuilding, FaCalculator, FaCalendar, FaCalendarAlt, FaMoneyBill, FaMoneyBillWave, FaTachometerAlt, FaUser, FaCog, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'


const Sidebar = ({ isOpen, onClose }) => {

    const user = useAuth();

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-2 p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`bg-gray-800 text-white h-full fixed left-0 top-0 bottom-0 space-y-2 w-64 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div className='flex justify-between items-center h-14 px-6 bg-gray-900 shadow-lg'>
                    <h3 className='text-2xl text-center font-bitcount'>Employee MS</h3>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden text-white p-1 rounded-md hover:bg-gray-700 transition-colors duration-200"
                        aria-label="Close sidebar"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>
                <div className='flex flex-col px-4 space-y-2'>
                    <NavLink to={"/employee-dashboard"} className={navLinkClass} end onClick={onClose}>
                        <FaTachometerAlt />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to={"/employee-dashboard/profile"} className={navLinkClass} end onClick={onClose}>
                        <FaUser />
                        <span>My Profile</span>
                    </NavLink>
                    <NavLink to={"/employee-dashboard/leaves"} className={navLinkClass} end onClick={onClose}>
                        <FaBuilding />
                        <span>Leaves</span>
                    </NavLink>
                    <NavLink to={"/employee-dashboard/salary"} className={navLinkClass} end onClick={onClose}>
                        <FaCalendarAlt />
                        <span>Salary</span>
                    </NavLink>

                    <NavLink to={"/employee-dashboard/attendance"} className={navLinkClass} end onClick={onClose}>
                        <FaCalendar />
                        <span>Attendance</span>
                    </NavLink>
                    <NavLink to={"/employee-dashboard/settings"} className={navLinkClass} end onClick={onClose}>
                        <FaCog />
                        <span>Settings</span>
                    </NavLink>
                </div>
            </div>
        </>
    )
}

export default Sidebar
