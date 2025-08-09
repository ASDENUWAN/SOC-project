// src/pages/profiles/CreatorProfile.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { userApi } from "../../api/axios.js";
import "./profile.css";

export default function CreatorProfile() {
  const { user, logout } = useContext(AuthContext);

  // profile form
  const [form, setForm] = useState({ name: "", address: "", mobile: "" });
  const [preview, setPreview] = useState(user.profilePicUrl || "");
  const [removePic, setRemovePic] = useState(false);

  // password form
  const [pw, setPw] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  // UI state
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    setForm({
      name: user.name || "",
      address: user.address || "",
      mobile: user.mobile || "",
    });
    setPreview(user.profilePicUrl || "");
    setRemovePic(false);
    setPw({ current: "", next: "", confirm: "" });
    setErr("");
  }, [user]);

  // text field change
  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // password field change
  const onPw = (e) => {
    const { name, value } = e.target;
    setPw((p) => ({ ...p, [name]: value }));
  };

  // file chosen
  const onFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm((f) => ({ ...f, _file: file }));
      setRemovePic(false);
    }
  };

  // remove pic
  const onRemove = () => {
    setPreview("");
    setForm((f) => ({ ...f, _file: null }));
    setRemovePic(true);
  };

  // validate password trio if any field is provided
  const validatePassword = () => {
    const anyFilled = pw.current || pw.next || pw.confirm;
    if (!anyFilled) return true;

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
    data.append("name", form.name);
    data.append("address", form.address);
    data.append("mobile", form.mobile);

    // password trio (only if filled)
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
      // refresh to reflect latest info
      window.location.reload();
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-card">
      {/* Avatar */}
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

      <h3 className="text-center mb-4">Creator Profile</h3>

      {/* inline error */}
      {err && <div className="alert alert-danger py-2">{err}</div>}

      <form className="profile-form" onSubmit={onSubmit}>
        {/* name */}
        <div className="row form-group">
          <label className="col-sm-3 col-form-label">Name</label>
          <div className="col-sm-9">
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={onChange}
            />
          </div>
        </div>

        {/* address */}
        <div className="row form-group">
          <label className="col-sm-3 col-form-label">Address</label>
          <div className="col-sm-9">
            <input
              name="address"
              className="form-control"
              value={form.address}
              onChange={onChange}
            />
          </div>
        </div>

        {/* mobile */}
        <div className="row form-group">
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

        {/* Email (read-only) */}
        <div className="form-group mb-3 row">
          <label className="col-sm-3 col-form-label">Email</label>
          <div className="col-sm-9">
            <input className="form-control" value={user.email} disabled />
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

        {/* actions */}
        <div className="actions">
          <button type="button" className="btn btn-danger" onClick={logout}>
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
