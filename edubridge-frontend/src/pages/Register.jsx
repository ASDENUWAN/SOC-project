import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import "./auth.css";

export default function Register() {
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "student",
    mobile: "",
    address: "",
    agree: false,
  });

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.title) return "Please select a title.";
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    if (form.role === "creator") {
      if (!form.mobile.trim()) return "Mobile is required for creators.";
      if (!/^\+?\d{7,15}$/.test(form.mobile.trim()))
        return "Enter a valid mobile number (7–15 digits).";
      if (!form.address.trim()) return "Address is required for creators.";
    }
    if (!form.agree) return "Please agree to the Terms to continue.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const why = validate();
    if (why) {
      setErr(why);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        ...(form.role === "creator" && {
          mobile: form.mobile.trim(),
          address: form.address.trim(),
        }),
      };
      await register(payload);
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-bg d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="card border-0 shadow-lg auth-card">
              {/* Header */}
              <div className="card-header bg-transparent border-0 p-4 pb-0">
                <div className="d-flex align-items-center gap-3">
                  <span className="auth-badge">
                    <i className="bi bi-person-plus"></i>
                  </span>
                  <div>
                    <h4 className="mb-0 fw-bold text-slate-800">
                      Create your account
                    </h4>
                    <div className="text-muted small">
                      Join <span className="fw-semibold">EduBridge</span> to
                      start learning.
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="card-body p-4 pt-3">
                {err && (
                  <div
                    className="alert alert-danger d-flex align-items-center"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{err}</div>
                  </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                  {/* Role selector */}
                  <div className="mb-4">
                    <label className="form-label">I am a</label>
                    <div className="role-toggle">
                      <input
                        type="radio"
                        className="btn-check"
                        name="role"
                        id="role-student"
                        value="student"
                        checked={form.role === "student"}
                        onChange={onChange}
                      />
                      <label
                        className="btn btn-outline-secondary"
                        htmlFor="role-student"
                      >
                        <i className="bi bi-mortarboard me-2"></i>Student
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="role"
                        id="role-creator"
                        value="creator"
                        checked={form.role === "creator"}
                        onChange={onChange}
                      />
                      <label
                        className="btn btn-outline-secondary"
                        htmlFor="role-creator"
                      >
                        <i className="bi bi-easel2 me-2"></i>Creator
                      </label>
                    </div>
                  </div>

                  {/* Title + Name */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Title</label>
                      <select
                        name="title"
                        className="form-select"
                        value={form.title}
                        onChange={onChange}
                        required
                      >
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Full Name</label>
                      <div className="input-group input-group-lg auth-field">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          name="name"
                          className="form-control border-start-0"
                          placeholder="Jane Doe"
                          value={form.name}
                          onChange={onChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group input-group-lg auth-field">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control border-start-0"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password + confirm */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <div className="input-group input-group-lg auth-field">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type={showPwd ? "text" : "password"}
                          name="password"
                          className="form-control border-start-0"
                          placeholder="At least 6 characters"
                          value={form.password}
                          onChange={onChange}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary auth-eye"
                          onClick={() => setShowPwd((s) => !s)}
                          tabIndex={-1}
                          title={showPwd ? "Hide password" : "Show password"}
                        >
                          <i
                            className={`bi ${
                              showPwd ? "bi-eye-slash" : "bi-eye"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Confirm Password</label>
                      <div className="input-group input-group-lg auth-field">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-check2-circle"></i>
                        </span>
                        <input
                          type={showPwd ? "text" : "password"}
                          name="confirm"
                          className="form-control border-start-0"
                          placeholder="Re-enter password"
                          value={form.confirm}
                          onChange={onChange}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Creator-only fields */}
                  {form.role === "creator" && (
                    <div className="row g-3 mt-1">
                      <div className="col-md-6">
                        <label className="form-label">Mobile</label>
                        <div className="input-group input-group-lg auth-field">
                          <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-telephone"></i>
                          </span>
                          <input
                            name="mobile"
                            className="form-control border-start-0"
                            placeholder="+94771234567"
                            value={form.mobile}
                            onChange={onChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Address</label>
                        <div className="input-group input-group-lg auth-field">
                          <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-geo-alt"></i>
                          </span>
                          <input
                            name="address"
                            className="form-control border-start-0"
                            placeholder="City / Street"
                            value={form.address}
                            onChange={onChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms */}
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agree"
                      name="agree"
                      checked={form.agree}
                      onChange={onChange}
                    />
                    <label className="form-check-label" htmlFor="agree">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-primary text-decoration-none"
                      >
                        Terms & Privacy
                      </Link>
                      .
                    </label>
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100 mt-3 shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating account…
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check me-2"></i>Create
                        Account
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="me-2">Already have an account?</span>
                  <Link
                    to="/login"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Sign in
                  </Link>
                </div>
              </div>

              {/* Card footer */}
              <div className="card-footer bg-transparent border-0 text-center text-muted small pb-4">
                <i className="bi bi-shield-lock me-1"></i>We keep your data
                secure.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
