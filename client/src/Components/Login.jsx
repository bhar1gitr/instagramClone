import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/v1/login", form);
      Cookies.set('token', res.data.token, { expires: 1 }); // 1 day
      toast.success("Login Successfull");
      window.location.href = "/";
    } catch (err) {
      console.error(err.response?.data || "Login failed");
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="insta-container">
      <div className="login-box">
        <h1 className="logo">Instagram</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Log In</button>
        </form>

        <p className="forgot-password">Forgot password?</p>
      </div>

      <div className="register-redirect">
        <p>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
