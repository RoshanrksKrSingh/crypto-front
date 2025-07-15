import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin";
import Merchant from "./pages/Merchant";
import User from "./pages/User";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import PrivateAdminRoute from "./routes/PrivateAdminRoute";
import PrivateMerchantRoute from "./routes/PrivateMerchantRoute";

function App() {
  return (
    <AuthProvider>
      <>
        <Navbar /> {/* Always visible on all pages */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateAdminRoute>
                <Admin />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/merchant"
            element={
              <PrivateMerchantRoute>
                <Merchant />
              </PrivateMerchantRoute>
            }
          />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
