import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const User = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [newTx, setNewTx] = useState({ amount: "", type: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) {
      setError("No token found. Please login again.");
      return;
    }
    fetchProfile();
    fetchTransactions();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/profile`, headers);
      const userData = res.data?.user || res.data;
      setUser(userData);
      setForm(userData);
    } catch (err) {
      setError("Failed to load profile.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/my-transactions`, headers);
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        currentPassword: passwords.currentPassword,
        password: passwords.newPassword,
      };
      const res = await axios.put(`${API_URL}/user/profile`, payload, headers);
      const updatedUser = res.data?.user || res.data;
      setMessage("Profile updated successfully!");
      setEditMode(false);
      setUser(updatedUser);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        await axios.delete(`${API_URL}/user/profile`, headers);
        localStorage.removeItem("token");
        window.location.href = "/login";
      } catch (err) {
        alert("Error deleting profile");
      }
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.type) {
      alert("Please enter both amount and type");
      return;
    }
    try {
      await axios.post(`${API_URL}/transactions/create`, newTx, headers);
      setMessage("Transaction created successfully!");
      setNewTx({ amount: "", type: "" });
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating transaction");
    }
  };

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">Loading user profile...</div>;
  }

  return (
    <div className="container py-4">
      <h2>User Dashboard</h2>
      {message && <div className="alert alert-success">{message}</div>}

      {!editMode ? (
        <div className="card mb-4">
          <div className="card-body">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <button className="btn btn-primary me-2" onClick={() => setEditMode(true)}>Edit Profile</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete Profile</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="card p-4 mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
                placeholder="First Name"
                value={form.firstName || ""}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
                placeholder="Last Name"
                value={form.lastName || ""}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
                placeholder="Phone"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <h5 className="mt-3">Change Password (optional)</h5>
            <div className="col-md-6">
              <input
                className="form-control"
                type="password"
                placeholder="Current Password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
            </div>
            <div className="col-12 d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-success">Save</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <hr />

      <h4>Create Transaction</h4>
      <form onSubmit={handleCreateTransaction} className="row g-3 align-items-end mb-4">
        <div className="col-md-4">
          <input
            className="form-control"
            type="number"
            placeholder="Amount"
            value={newTx.amount}
            onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
            required
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={newTx.type}
            onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
            required
          >
            <option value="">Select Type</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-primary w-100">Create</button>
        </div>
      </form>

      <hr />

      <h4>My Transactions</h4>
      {transactions.length > 0 ? (
        <ul className="list-group">
          {transactions.map((tx, index) => (
            <li key={index} className="list-group-item">
              <strong>{tx.type}</strong> - ₹{tx.amount} -{" "}
              {new Date(tx.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-info">No transactions found.</div>
      )}
    </div>
  );
};

export default User;
