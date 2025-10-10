import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { FaBars } from 'react-icons/fa'

const NavBar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();


return (
    <nav className="flex  justify-between items-center h-14 px-6 bg-gray-900 shadow-lg ">
        <div className="flex items-center gap-4">
            <button
                onClick={toggleSidebar}
                className="lg:hidden text-white p-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle sidebar"
            >
                <FaBars size={20} />
            </button>
            <p className="text-gray-100 font-semibold text-lg">
                Welcome {user?.name}
            </p>
        </div>
        <button
            onClick={logout}
            className="bg-blue-700 text-white font-medium rounded-lg px-5 py-2 shadow hover:bg-blue-800 transition-colors duration-200"
        >
            Logout
        </button>
    </nav>
)
}

export default NavBar
