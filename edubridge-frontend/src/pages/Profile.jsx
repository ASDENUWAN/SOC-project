import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { userApi } from "../api/axios";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", mobile: "", address: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        mobile: user.mobile || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onFile = (e) => setForm({ ...form, file: e.target.files[0] });

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("mobile", form.mobile);
    data.append("address", form.address);
    if (form.file) data.append("profilePic", form.file);

    const res = await userApi.put("/profile", data);
    // update context
    window.location.reload();
  };

  return (
    <div>
      <h2>My Profile</h2>
      <img
        src={user.profilePicUrl || "/default-avatar.png"}
        alt="avatar"
        className="img-thumbnail mb-3"
        width="150"
      />
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Mobile</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={onChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={onChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Profile Picture</label>
          <input
            type="file"
            name="profilePic"
            onChange={onFile}
            className="form-control"
            accept="image/*"
          />
        </div>
        <button className="btn btn-primary me-2">Update</button>
        <button type="button" onClick={logout} className="btn btn-danger">
          Logout
        </button>
      </form>
    </div>
  );
}
