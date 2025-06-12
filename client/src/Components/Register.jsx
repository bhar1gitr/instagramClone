import React, { useState } from 'react';
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    dob: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post("http://localhost:4000/api/v1/register", form)
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="insta-container">
      <div className="register-box">
        <h1 className="logo">Instagram</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
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
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>

        <p className="terms-text">
          By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
        </p>
      </div>

      <div className="login-redirect">
        <p>
          Have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
