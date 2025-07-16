import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const Merchant = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Added toggles for Show/Hide buttons
  const [showUsers, setShowUsers] = useState(false); 
  const [showTransactions, setShowTransactions] = useState(false); 

  const headers = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
      "Content-Type": "application/json",
    },
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API}/merchant/users`, headers);
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err.response?.data || err.message);
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await axios.get(`${API}/merchant/user-transactions`, headers);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error loading transactions:", err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `${API}/merchant/update-user/${selectedId}`
      : `${API}/merchant/create-user`;
    const method = editMode ? "put" : "post";

    try {
      await axios[method](url, form, headers);
      alert(`User ${editMode ? "updated" : "created"} successfully`);
      setForm({});
      setEditMode(false);
      setSelectedId(null);
      loadUsers();
      loadTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save user");
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${API}/merchant/get-user/${id}`, headers);
      setForm(res.data.user);
      setEditMode(true);
      setSelectedId(id);
    } catch (err) {
      alert("Failed to fetch user");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await axios.delete(`${API}/merchant/delete-user/${id}`, headers);
        alert("User deleted successfully");
        loadUsers();
        loadTransactions();
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  useEffect(() => {
    if (user?.token) {
      loadUsers();
      loadTransactions();
    }
  }, [user?.token]);

  return (
    <div className="container py-4 mt-5 pt-5">
      <h2 className="mb-4">Merchant Dashboard</h2>

      <div className="card mb-4">
        <div className="card-header">
          {editMode ? "Update User" : "Create User"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
                placeholder="First Name"
                value={form.firstName || ""}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
                placeholder="Last Name"
                value={form.lastName || ""}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="text"
                placeholder="Phone"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="col-md-12">
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                value={form.password || ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editMode}
              />
            </div>
            <div className="col-md-12 d-flex justify-content-start gap-2">
              <button type="submit" className="btn btn-primary">
                {editMode ? "Update" : "Create"}
              </button>
              {editMode && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setForm({});
                    setEditMode(false);
                    setSelectedId(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/*User List with Show/Hide */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Your Users</h4>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowUsers(!showUsers)} 
          >
            {showUsers ? "Hide" : "Show"} 
          </button>
        </div>

        {showUsers && ( // <-- NEW
          users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <ul className="list-group">
              {users.map((u) => (
                <li
                  key={u._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{u.firstName} {u.lastName}</strong> ({u.email})
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(u._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>

      {/* Transaction List with Show/Hide */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>User Transactions</h4>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowTransactions(!showTransactions)} // <-- NEW
          >
            {showTransactions ? "Hide" : "Show"} {/* <-- NEW */}
          </button>
        </div>

        {showTransactions && ( // <-- NEW
          transactions && transactions.length > 0 ? (
            <ul className="list-group">
              {transactions.map((tx) => (
                <li key={tx._id} className="list-group-item">
                  <strong>{tx.type}</strong> - ₹{tx.amount} -{" "}
                  {new Date(tx.createdAt).toLocaleString()} -{" "}
                  {tx.userId && typeof tx.userId === "object"
                    ? `${tx.userId.firstName} ${tx.userId.lastName}`
                    : "User Info Not Available"}
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-warning mt-3">
              No transactions found.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Merchant;
