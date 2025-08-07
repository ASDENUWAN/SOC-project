import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    login(form.email, form.password);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="card p-4 mx-auto"
      style={{ maxWidth: 400 }}
    >
      <h3 className="mb-3">Login</h3>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          onChange={onChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          name="password"
          onChange={onChange}
          required
        />
      </div>
      <button className="btn btn-success w-100">Login</button>
    </form>
  );
}
