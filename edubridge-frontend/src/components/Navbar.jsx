import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const avatar = user?.profilePicUrl;

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-soft shadow-sm sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="brand-badge">
            <i className="bi bi-mortarboard"></i>
          </span>
          <span className="fw-bold text-slate-800">EduBridge</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link nav-link-soft">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/courses" end className="nav-link nav-link-soft">
                Courses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link nav-link-soft">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/creators" className="nav-link nav-link-soft">
                Our Creators
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link nav-link-soft">
                Contact
              </NavLink>
            </li>

            {!user ? (
              <>
                <li className="nav-item ms-lg-3 my-2 my-lg-0">
                  <Link className="btn btn-outline-primary me-2" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item my-2 my-lg-0">
                  <Link className="btn btn-primary" to="/register">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown ms-lg-3 my-2 my-lg-0">
                <button
                  className="btn btn-ghost-soft dropdown-toggle d-flex align-items-center gap-2"
                  id="userMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      width="32"
                      height="32"
                      className="rounded-circle ring-soft"
                    />
                  ) : (
                    <i className="bi bi-person-circle fs-4 text-slate-700"></i>
                  )}
                  <span className="d-none d-lg-inline text-slate-800">
                    {user.name}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
