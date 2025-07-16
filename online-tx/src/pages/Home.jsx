import React from "react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const fullName =
    user?.name?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Guest";

  return (
    <div>
      <div className="container py-4 mt-5 pt-5">
        <div className="row justify-content-center text-center">
          <div className="col-md-8">
            <div className="card shadow-lg p-4 border-0 bg-white bg-opacity-75">
              <h1 className="display-5 fw-bold text-primary">Welcome to Online TX</h1>
              <p className="lead mt-3">
                Hello, <strong className="text-success">{fullName}</strong>!
              </p>
              <p className="text-muted">
                Manage users, merchants, and transactions with easily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
