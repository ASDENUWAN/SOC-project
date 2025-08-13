import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import "./auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      // If you want to persist longer when remember is checked, handle in AuthContext/cookie
    } catch (ex) {
      setErr(
        ex?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-bg d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card border-0 shadow-lg auth-card">
              {/* Card header / branding */}
              <div className="card-header bg-transparent border-0 p-4 pb-0">
                <div className="d-flex align-items-center gap-3">
                  <span className="auth-badge">
                    <i className="bi bi-mortarboard"></i>
                  </span>
                  <div>
                    <h4 className="mb-0 fw-bold text-slate-800">
                      Welcome back
                    </h4>
                    <div className="text-muted small">
                      Sign in to continue to{" "}
                      <span className="fw-semibold">EduBridge</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card body */}
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
                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group input-group-lg auth-field">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-2">
                    <label className="form-label">Password</label>
                    <div className="input-group input-group-lg auth-field">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPwd ? "text" : "password"}
                        className="form-control border-start-0"
                        name="password"
                        placeholder="Your password"
                        value={form.password}
                        onChange={onChange}
                        required
                        minLength={4}
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

                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                        name="remember"
                        checked={form.remember}
                        onChange={onChange}
                      />
                      <label className="form-check-label" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="#"
                      className="small text-primary text-decoration-none"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100 shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing in…
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center my-4 text-muted small">or</div>

                {/* Register / CTA */}
                <div className="text-center">
                  <span className="me-2">New to EduBridge?</span>
                  <Link
                    to="/register"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Create an account
                  </Link>
                </div>
              </div>

              {/* Subtle footer */}
              <div className="card-footer bg-transparent border-0 text-center text-muted small pb-4">
                <i className="bi bi-shield-lock me-1"></i>
                Your credentials are encrypted and secure.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
