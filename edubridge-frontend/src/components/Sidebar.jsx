// src/components/Sidebar.jsx
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import "./Sidebar.css";

// Define your per‑role menu items here
const menuByRole = {
  student: [
    { to: "/profile", label: "Profile" },
    { to: "/my-courses", label: "My Courses" },
    { to: "/quizzes", label: "Play Quizzes" },
    { to: "/my-questions", label: "My Questions" },
  ],
  creator: [
    { to: "/profile", label: "Profile" },
    { to: "/content", label: "Content Management" },
    { to: "/messages", label: "Messages" },
    { to: "/courses", label: "Course Management" },
  ],
  admin: [
    { to: "/profile", label: "Profile" },
    { to: "/manage-students", label: "Manage Students" },
    { to: "/manage-creators", label: "Manage Creators" },
    { to: "/manage-badges", label: "Manage Badges" },
  ],
};

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  if (!user) return null; // only show when logged in

  const menu = menuByRole[user.role] || [];
  const avatar = user.profilePicUrl || "";

  return (
    <>
      {/* 1) Toggle button (mobile only) */}
      <button
        className="sidebar-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
      </button>

      {/* 2) Sidebar container */}
      <aside className={`sidebar${open ? " open" : ""}`}>
        {/* Avatar + Name */}
        <div className="sidebar-header text-center">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="sidebar-avatar" />
          ) : (
            <i className="bi bi-person-circle sidebar-avatar-icon"></i>
          )}
          <h5 className="mt-2 sidebar-username">{user.name}</h5>

          {/* Creator stars */}
          {user.role === "creator" && typeof user.rating === "number" && (
            <div className="rating-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <i
                  key={i}
                  className={i < user.rating ? "bi bi-star-fill" : "bi bi-star"}
                />
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <hr className="sidebar-divider" />

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menu.map(({ to, label }) => (
            <NavLink
              to={to}
              key={to}
              className="sidebar-link"
              activeclassname="active"
              onClick={() => setOpen(false)} // close on mobile click
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
