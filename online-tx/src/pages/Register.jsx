import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  });

  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/register`, formData);
      alert(res.data.message);
      setEmailForOtp(formData.email);
      setShowOtpField(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration error');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/verify-otp`, {
        email: emailForOtp,
        otp,
      });
      alert(res.data.message);
      setShowOtpField(false);
    } catch (err) {
      alert(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-sm p-3 bg-white bg-opacity-75"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h4 className="text-center text-primary mb-3">
          {showOtpField ? 'Verify OTP' : 'Register'}
        </h4>

        {!showOtpField ? (
          <form onSubmit={handleRegister}>
            <div className="mb-2">
              <input
                name="firstName"
                className="form-control"
                placeholder="First name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <input
                name="lastName"
                className="form-control"
                placeholder="Last name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <input
                name="phone"
                className="form-control"
                placeholder="Phone"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-3">
              <label className="form-label small">
                Enter OTP sent to <strong>{emailForOtp}</strong>
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control"
                placeholder="Enter OTP"
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
