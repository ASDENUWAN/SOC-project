// e.g. src/pages/CreatorProfile.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { userApi } from "../api/axios.js";

export default function CreatorProfile() {
  const { user, logout } = useContext(AuthContext);

  // form state
  const [form, setForm] = useState({ name: "", address: "", mobile: "" });
  const [preview, setPreview] = useState(user.profilePicUrl || "");

  useEffect(() => {
    setForm({ name: user.name, address: user.address, mobile: user.mobile });
  }, [user]);

  // handle text fields
  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // handle file input
  const onFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setForm((f) => ({ ...f, _file: file }));
    }
  };

  // submit update
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
    <div
      className="card mx-auto my-4 p-4 rounded shadow-sm"
      style={{ maxWidth: 700 }}
    >
      {/* Avatar + file input */}
      <div className="text-center mb-4">
        <label
          htmlFor="profilePicInput"
          className="d-inline-block position-relative"
        >
          {preview ? (
            <img
              src={preview}
              alt="avatar"
              className="rounded-circle profile-avatar-lg"
            />
          ) : (
            <i className="bi bi-person-circle display-1 text-secondary"></i>
          )}
          <span
            className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 border"
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-pencil-fill"></i>
          </span>
        </label>
        <input
          id="profilePicInput"
          type="file"
          accept="image/*"
          className="d-none"
          onChange={onFile}
        />
      </div>

      <h3 className="text-center mb-4">Creator Profile</h3>
      <form onSubmit={onSubmit}>
        {/* Name */}
        <div className="mb-3 row">
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

        {/* Address */}
        <div className="mb-3 row">
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

        {/* Mobile */}
        <div className="mb-3 row">
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

        {/* Buttons */}
        <div className="d-flex justify-content-between mt-4">
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
