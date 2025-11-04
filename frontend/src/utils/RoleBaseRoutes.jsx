import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const RoleBaseRoutes = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>
    }

    // If not logged in, send to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If logged in but role not permitted, send to login (or change to an Unauthorized page)
    if (!requiredRole.includes(user.role)) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default RoleBaseRoutes
