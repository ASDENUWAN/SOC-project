// src/pages/profiles/StudentProfile.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { userApi } from "../../api/axios.js";
import "./profile.css";

export default function StudentProfile() {
  const { user, logout } = useContext(AuthContext);

  // profile fields
  const [form, setForm] = useState({
    title: user.title || "",
    name: "",
    mobile: "",
  });
  const [preview, setPreview] = useState(user.profilePicUrl || "");
  const [removePic, setRemovePic] = useState(false);

  // password fields
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  // ui
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setForm({
      title: user.title || "",
      name: user.name || "",
      mobile: user.mobile || "",
    });
    setPreview(user.profilePicUrl || "");
    setRemovePic(false);
    setPw({ current: "", next: "", confirm: "" });
    setErr("");
  }, [user]);

  // inputs
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onPw = (e) => setPw((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm((f) => ({ ...f, _file: file }));
      setRemovePic(false);
    }
  };

  const onRemove = () => {
    setPreview("");
    setForm((f) => ({ ...f, _file: null }));
    setRemovePic(true);
  };

  // delete account
  const deleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account?"
      )
    )
      return;
    try {
      await userApi.delete("/profile");
      logout(); // should clear context and redirect as you implemented
    } catch (e) {
      console.error("Delete account failed:", e);
      alert("Could not delete account. Please try again.");
    }
  };

  // password validation (optional flow)
  const validatePassword = () => {
    const any = pw.current || pw.next || pw.confirm;
    if (!any) return true; // not changing password
    if (!pw.current || !pw.next || !pw.confirm) {
      setErr(
        "Please fill current password, new password, and confirm password."
      );
      return false;
    }
    if (pw.next.length < 4) {
      setErr("New password must be at least 4 characters.");
      return false;
    }
    if (pw.next !== pw.confirm) {
      setErr("New password and confirmation do not match.");
      return false;
    }
    return true;
  };

  // submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!validatePassword()) return;

    const data = new FormData();
    data.append("title", form.title);
    data.append("name", form.name);
    data.append("mobile", form.mobile);

    if (pw.current || pw.next || pw.confirm) {
      data.append("currentPassword", pw.current);
      data.append("newPassword", pw.next);
      data.append("confirmPassword", pw.confirm);
    }

    if (form._file) data.append("profilePic", form._file);
    if (removePic && !form._file) data.append("removePic", true);

    try {
      setSaving(true);
      await userApi.put("/profile", data);
      window.location.reload();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-card">
      {/* Avatar + controls */}
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

      <h3 className="text-center mb-4">Student Profile</h3>

      {err && <div className="alert alert-danger py-2">{err}</div>}

      <form className="profile-form" onSubmit={onSubmit}>
        {/* Title */}
        <div className="form-group mb-3 row">
          <label className="col-sm-3 col-form-label">Title</label>
          <div className="col-sm-9">
            <select
              name="title"
              className="form-select"
              value={form.title}
              onChange={onChange}
            >
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Mrs">Mrs</option>
              <option value="Dr">Dr</option>
            </select>
          </div>
        </div>
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

        {/* Password change (optional) */}
        <div className="form-group mb-3 row">
          <label className="col-sm-3 col-form-label">Current Password</label>
          <div className="col-sm-9">
            <input
              type="password"
              name="current"
              className="form-control"
              value={pw.current}
              onChange={onPw}
              placeholder="Leave blank if not changing"
            />
          </div>
        </div>

        <div className="form-group mb-3 row">
          <label className="col-sm-3 col-form-label">New Password</label>
          <div className="col-sm-9">
            <input
              type="password"
              name="next"
              className="form-control"
              value={pw.next}
              onChange={onPw}
              placeholder="Min 4 characters"
            />
          </div>
        </div>

        <div className="form-group mb-3 row">
          <label className="col-sm-3 col-form-label">Confirm Password</label>
          <div className="col-sm-9">
            <input
              type="password"
              name="confirm"
              className="form-control"
              value={pw.confirm}
              onChange={onPw}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={deleteAccount}
          >
            Delete Account
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
