import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    mobile: "",
    address: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    register(form);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          name="email"
          onChange={onChange}
          className="form-control"
          required
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={onChange}
          className="form-control"
          required
          minLength="6"
        />
      </div>
      <div className="mb-3">
        <label>Role</label>
        <select name="role" className="form-select" onChange={onChange}>
          <option value="student">Student</option>
          <option value="creator">Creator</option>
        </select>
      </div>
      {form.role === "creator" && (
        <>
          <div className="mb-3">
            <label>Mobile</label>
            <input
              name="mobile"
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Address</label>
            <input
              name="address"
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
        </>
      )}
      <button className="btn btn-primary">Register</button>
    </form>
  );
}
