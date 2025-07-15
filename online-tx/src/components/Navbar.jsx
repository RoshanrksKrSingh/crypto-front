import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fullName = user?.name || user?.email || "Guest";

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top shadow-sm"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.6)", // lighter background
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* Left: Brand */}
        <Link className="navbar-brand fw-bold" to="/" style={{ flex: "0 0 auto" }}>
          Online TX
        </Link>

        {/* Toggle for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Center + Right */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav text-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}

            {user?.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Panel</Link>
              </li>
            )}
            {user?.role === "merchant" && (
              <li className="nav-item">
                <Link className="nav-link" to="/merchant">Merchant Panel</Link>
              </li>
            )}
            {user?.role === "user" && (
              <li className="nav-item">
                <Link className="nav-link" to="/user">User Dashboard</Link>
              </li>
            )}

            {user && (
              <>
                <li className="nav-item d-lg-none mt-2">
                  <span className="navbar-text small d-block">
                    Logged in as: <strong>{user?.role}</strong><br />
                    Hello, <strong>{fullName}</strong>
                  </span>
                  <button className="btn btn-outline-danger btn-sm mt-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Right for desktop only */}
        {user && (
          <div className="d-none d-lg-flex align-items-center gap-3">
            <span className="navbar-text small text-end">
              Logged in as: <strong>{user?.role}</strong><br />
              Hello, <strong>{fullName}</strong>
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
