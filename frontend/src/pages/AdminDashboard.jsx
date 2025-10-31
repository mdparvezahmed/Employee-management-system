import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSideBar from '../components/dashboard/AdminSidebar';
import NavBar from '../components/dashboard/NavBar';


const AdminDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isSidebarOpen]);



  return (
    <div className='flex'>
      <AdminSideBar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className='flex-1 lg:ml-64 bg-gray-700 min-h-screen'>
        <NavBar toggleSidebar={toggleSidebar} />
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
