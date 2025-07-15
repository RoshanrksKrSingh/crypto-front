
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Optional: loading spinner while checking user
  if (user === undefined) return null;

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
