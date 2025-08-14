import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { userApi, adminListPendingCourses } from "../api/axios.js";
import "./Sidebar.css";

const menuByRole = {
  student: [
    { to: "/profile", label: "Profile" },
    { to: "/profile/my-courses", label: "My Courses" },
    { to: "/profile/quizzes", label: "Play Quizzes" },
    { to: "/profile/my-questions", label: "My Questions" },
  ],
  creator: [
    { to: "/profile", label: "Profile" },
    { to: "/profile/content", label: "Content Management" },
    { to: "/profile/messages", label: "Messages" },
    { to: "/profile/courses", label: "Course Management" },
  ],
  admin: [
    { to: "/profile", label: "Profile" },
    { to: "/profile/manage-students", label: "Manage Students" },
    {
      to: "/profile/manage-creators",
      label: "Manage Creators",
      badge: "pendingCreators",
    },
    {
      to: "/profile/manage-courses",
      label: "Manage Courses",
      badge: "pendingCourses",
    },
    { to: "/profile/manage-badges", label: "Manage Badges" },
  ],
};

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [pendingCreators, setPendingCreators] = useState(0);
  const [pendingCourses, setPendingCourses] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (user?.role === "admin") {
        try {
          // pending creators count
          const { data } = await userApi.get("/creators");
          const pc = Array.isArray(data?.pending) ? data.pending.length : 0;
          setPendingCreators(pc);
        } catch {
          setPendingCreators(0);
        }

        try {
          // pending courses count (submitted list)
          const res = await adminListPendingCourses();
          const count = Array.isArray(res?.data) ? res.data.length : 0;
          setPendingCourses(count);
        } catch {
          setPendingCourses(0);
        }
      }
    };
    load();
  }, [user]);

  if (!user) return null;

  const menu = menuByRole[user.role] || [];
  const avatar = user.profilePicUrl || "";

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar${open ? " open" : ""}`}>
        <div className="sidebar-header text-center">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="sidebar-avatar" />
          ) : (
            <i className="bi bi-person-circle sidebar-avatar-icon"></i>
          )}
          <h5 className="mt-2 sidebar-username">{user.name}</h5>

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

        <hr className="sidebar-divider" />

        <nav className="sidebar-nav">
          {menu.map(({ to, label, badge }) => (
            <NavLink
              to={to}
              key={to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <span>{label}</span>
              {badge === "pendingCreators" && pendingCreators > 0 && (
                <span className="badge rounded-pill bg-warning text-dark ms-2">
                  {pendingCreators}
                </span>
              )}
              {badge === "pendingCourses" && pendingCourses > 0 && (
                <span className="badge rounded-pill bg-warning text-dark ms-2">
                  {pendingCourses}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
