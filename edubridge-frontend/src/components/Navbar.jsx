// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  // compute avatar (or undefined)
  const avatar = user?.profilePicUrl;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm st sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          EduBridge
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
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
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Always visible links */}
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Contact Us
              </Link>
            </li>

            {/* If not logged in, show Login + Sign Up */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-outline-primary me-2">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              /* If logged in, show Profile icon + Sign Out */
              <>
                <li className="nav-item me-3">
                  <Link to="/profile" className="nav-link p-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        width="32"
                        height="32"
                        className="rounded-circle"
                      />
                    ) : (
                      <i
                        className="bi bi-person-circle"
                        style={{ fontSize: "1.75rem" }}
                      />
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={logout} className="btn btn-link nav-link">
                    Sign Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
