import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { userApi } from "../api/axios.js";

export default function AdminProfile() {
  const { user, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    setForm({ name: user.name, email: user.email, password: "" });
  }, [user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    await userApi.put("/profile", form);
    window.location.reload();
  };

  return (
    <div
      className="card p-4 rounded shadow-sm mx-auto"
      style={{ maxWidth: 500 }}
    >
      <h3>Admin Profile</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" value={form.email} disabled />
        </div>
        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={onChange}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" onClick={logout} className="btn btn-danger">
            Delete Account
          </button>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
