// src/pages/StudentProfile.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { userApi } from "../api/axios.js";
import "./profile.css";

export default function StudentProfile() {
  const { user, logout } = useContext(AuthContext);

  // form data & flags
  const [form, setForm] = useState({ name: "", mobile: "", password: "" });
  const [preview, setPreview] = useState(user.profilePicUrl || "");
  const [removePic, setRemovePic] = useState(false);

  const deleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account?"
      )
    )
      return;

    try {
      await userApi.delete("/profile");
      // Clear context and redirect to login
      logout(); // your AuthContext logout should clear user & redirect
    } catch (err) {
      console.error("Delete account failed:", err);
      alert("Could not delete account. Please try again.");
    }
  };

  // initialize form when user loads
  useEffect(() => {
    setForm({
      name: user.name || "",
      mobile: user.mobile || "",
      password: "",
    });
    setPreview(user.profilePicUrl || "");
    setRemovePic(false);
  }, [user]);

  // handle text changes (name, mobile, password)
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // handle new file selection
  const onFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm((f) => ({ ...f, _file: file }));
      setRemovePic(false);
    }
  };

  // handle “remove picture”
  const onRemove = () => {
    setPreview("");
    setForm((f) => ({ ...f, _file: null }));
    setRemovePic(true);
  };

  // submit updated profile
  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("mobile", form.mobile);
    if (form.password) data.append("password", form.password);
    if (form._file) {
      data.append("profilePic", form._file);
    }
    if (removePic && !form._file) {
      data.append("removePic", true);
    }

    await userApi.put("/profile", data);
    window.location.reload();
  };

  return (
    <div className="profile-card">
      {/* Avatar + edit/remove controls */}
      <div className="avatar-container">
        {preview ? (
          <img src={preview} alt="avatar" className="profile-avatar-lg" />
        ) : (
          <i className="bi bi-person-circle profile-avatar-lg text-secondary" />
        )}

        <div className="avatar-controls">
          {preview && (
            <button
              type="button"
              className="btn-control remove-btn"
              onClick={onRemove}
              title="Remove picture"
            >
              <i className="bi bi-trash-fill" />
            </button>
          )}

          <label
            htmlFor="profilePicInput"
            className="btn-control edit-btn"
            title="Change picture"
          >
            <i className="bi bi-pencil-fill" />
          </label>
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            className="d-none"
            onChange={onFile}
          />
        </div>
      </div>

      {/* Header */}
      <h3 className="text-center mb-4">Student Profile</h3>

      {/* Profile form */}
      <form className="profile-form" onSubmit={onSubmit}>
        {/* Username */}
        <div className="form-group mb-3 row">
          <label className="col-sm-3 col-form-label">Username</label>
          <div className="col-sm-9">
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={onChange}
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div className="form-group mb-3 row">
          <label className="col-sm-3 col-form-label">Email</label>
          <div className="col-sm-9">
            <input className="form-control" value={user.email} disabled />
          </div>
        </div>

        {/* Mobile */}
        <div className="form-group mb-3 row">
          <label className="col-sm-3 col-form-label">Mobile</label>
          <div className="col-sm-9">
            <input
              name="mobile"
              className="form-control"
              value={form.mobile}
              onChange={onChange}
            />
          </div>
        </div>

        {/* New Password */}
        <div className="form-group mb-3 row">
          <label className="col-sm-3 col-form-label">New Password</label>
          <div className="col-sm-9">
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={onChange}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={deleteAccount}
          >
            Delete Account
          </button>
          <button type="submit" className="btn btn-primary">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
