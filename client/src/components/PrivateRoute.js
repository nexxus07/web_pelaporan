import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    // Cek status login dari localStorage
    const isLogin = localStorage.getItem('isLogin') === 'true';
    return isLogin ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;