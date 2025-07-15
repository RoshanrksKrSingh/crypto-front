
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateMerchantRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "merchant") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateMerchantRoute;
