import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { userApi } from "../api/axios.js";
import "./profile.css";

export default function CreatorProfile() {
  const { user, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", address: "", mobile: "" });
  const [preview, setPreview] = useState(user.profilePicUrl || "");

  useEffect(() => {
    setForm({ name: user.name, address: user.address, mobile: user.mobile });
  }, [user]);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm((f) => ({ ...f, _file: file }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("address", form.address);
    data.append("mobile", form.mobile);
    if (form._file) data.append("profilePic", form._file);

    await userApi.put("/profile", data);
    window.location.reload();
  };

  return (
    <div className="profile-card">
      <div className="avatar-container">
        {preview ? (
          <img src={preview} alt="avatar" className="profile-avatar-lg" />
        ) : (
          <i className="bi bi-person-circle profile-avatar-lg text-secondary"></i>
        )}
        <label htmlFor="profilePicInput" className="edit-btn">
          <i className="bi bi-pencil-fill"></i>
        </label>
        <input
          id="profilePicInput"
          type="file"
          accept="image/*"
          className="d-none"
          onChange={onFile}
        />
      </div>

      <h3 className="text-center">Creator Profile</h3>
      <form className="profile-form" onSubmit={onSubmit}>
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
