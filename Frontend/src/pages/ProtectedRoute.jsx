import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
const ProtectedRoute = ({ token, userType, children }) => {
  const location = useLocation();
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
