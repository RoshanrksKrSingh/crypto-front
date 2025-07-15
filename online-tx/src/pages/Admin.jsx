import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({});
  const [type, setType] = useState('user');
  const [mode, setMode] = useState('create');
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState({ userId: '', merchantId: '' });
  const [showUsers, setShowUsers] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (token) loadUsers();
  }, []);

  const capitalize = (s) => s?.charAt(0).toUpperCase() + s?.slice(1);

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, headers);
      setUsers(res.data.users);
      setMerchants(res.data.users.filter((u) => u.role === 'merchant'));
    } catch (err) {
      console.error('Error loading users', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        mode === 'create'
          ? `${API}/admin/create-${type}`
          : `${API}/admin/update-${type}/${selectedId}`;
      const method = mode === 'create' ? 'post' : 'put';

      const payload = {
        ...form,
        firstName: capitalize(form.firstName),
        lastName: capitalize(form.lastName),
      };

      await axios[method](url, payload, headers);
      alert(`${type} ${mode}d successfully`);
      setForm({});
      setMode('create');
      setSelectedId(null);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setType(user.role);
    setMode('edit');
    setSelectedId(user._id);
  };

  const handleDelete = async (id, role) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API}/admin/delete-${role}/${id}`, headers);
        alert(`${role} deleted`);
        loadUsers();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const filterTransactions = async () => {
    try {
      const res = await axios.get(`${API}/admin/transactions/filter`, {
        ...headers,
        params: filter,
      });
      setTransactions(res.data);
    } catch (err) {
      alert('Failed to fetch transactions');
    }
  };

  const getAllTransactions = async () => {
    try {
      const res = await axios.get(`${API}/admin/transactions`, headers);
      setTransactions(res.data);
    } catch (err) {
      alert('Failed to fetch all transactions');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary">Admin Dashboard</h2>

      {/* Create / Update Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title mb-3">
            {mode === 'create' ? 'Create' : 'Update'} {capitalize(type)}
          </h4>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="user">User</option>
                <option value="merchant">Merchant</option>
              </select>
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={form.firstName || ''}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={form.lastName || ''}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Phone"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={form.password || ''}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={mode === 'create'}
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button type="submit" className="btn btn-success">
                {mode === 'create' ? 'Create' : 'Update'}
              </button>
              {mode === 'edit' && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setMode('create');
                    setForm({});
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

      {/* Users List */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4>All Users</h4>
          <button className="btn btn-outline-primary btn-sm" onClick={() => setShowUsers(!showUsers)}>
            {showUsers ? 'Hide' : 'Show'}
          </button>
        </div>

        {showUsers && (
          <ul className="list-group mt-3">
            {users.map((u) => (
              <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  {capitalize(u.firstName)} {capitalize(u.lastName)} ({u.email}) [{u.role}]
                </span>
                <div className="btn-group">
                  <button className="btn btn-sm btn-warning" onClick={() => handleEdit(u)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id, u.role)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Transaction Filter */}
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-3">Filter Transactions</h4>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <select
                className="form-select"
                value={filter.userId}
                onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
              >
                <option value="">-- Select User --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {capitalize(u.firstName)} {capitalize(u.lastName)}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <select
                className="form-select"
                value={filter.merchantId}
                onChange={(e) => setFilter({ ...filter, merchantId: e.target.value })}
              >
                <option value="">-- Select Merchant --</option>
                {merchants.map((m) => (
                  <option key={m._id} value={m._id}>
                    {capitalize(m.firstName)} {capitalize(m.lastName)}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" onClick={filterTransactions}>Filter</button>
              <button className="btn btn-outline-secondary" onClick={getAllTransactions}>Get All</button>
            </div>
          </div>

          <ul className="list-group">
            {transactions.map((t, idx) => (
              <li key={idx} className="list-group-item">
                <strong>{t.type}</strong> - ₹{t.amount} - {new Date(t.createdAt).toLocaleString()} ({t.userId?.email})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Admin;
