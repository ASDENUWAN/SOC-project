import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { userApi } from "../api/axios.js";
import "./profile.css";

export default function CreatorProfile() {
  const { user, logout } = useContext(AuthContext);

  // form data & flags
  const [form, setForm] = useState({ name: "", address: "", mobile: "" });
  const [preview, setPreview] = useState(user.profilePicUrl || "");
  const [removePic, setRemovePic] = useState(false);

  // initialize form fields
  useEffect(() => {
    setForm({ name: user.name, address: user.address, mobile: user.mobile });
    setPreview(user.profilePicUrl || "");
    setRemovePic(false);
  }, [user]);

  // text field change
  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // file chosen
  const onFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm((f) => ({ ...f, _file: file }));
      setRemovePic(false); // user replaced the pic
    }
  };

  // user clicked “Remove”
  const onRemove = () => {
    setPreview(""); // clear UI
    setForm((f) => ({ ...f, _file: null })); // no new upload
    setRemovePic(true); // signal backend to delete
  };

  // submit everything
  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("address", form.address);
    data.append("mobile", form.mobile);

    if (form.password) data.append("password", form.password);

    if (form._file) {
      data.append("profilePic", form._file);
    }
    // if removePic flagged and no file, tell backend
    if (removePic && !form._file) {
      data.append("removePic", true);
    }

    await userApi.put("/profile", data);
    window.location.reload();
  };

  return (
    <div className="profile-card">
      <div className="avatar-container">
        {/* the avatar */}
        {preview ? (
          <img src={preview} alt="avatar" className="profile-avatar-lg" />
        ) : (
          <i className="bi bi-person-circle profile-avatar-lg text-secondary" />
        )}

        {/* grouped controls */}
        <div className="avatar-controls">
          {/* remove first (so trash sits left) */}
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

          {/* edit */}
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

        {/* actions */}
        <div className="actions">
          <button type="button" className="btn btn-danger" onClick={logout}>
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
