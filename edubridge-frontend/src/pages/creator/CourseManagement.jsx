// src/pages/creator/CourseManagement.jsx
import React, { useEffect, useState } from "react";
import {
  createCourse,
  deleteCourse,
  getMyCourses,
  updateCourse,
} from "../../api/api.js";
import { Link, useNavigate } from "react-router-dom";
import CourseForm from "../../components/CourseForm.jsx";
import SectionManager from "./SectionManager.jsx";

const StatusBadge = ({ status }) => {
  const map = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
    submitted: "info",
    draft: "secondary",
  };
  return (
    <span className={`badge bg-${map[status] || "secondary"}`}>{status}</span>
  );
};

export default function CourseManagement() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sectionsFor, setSectionsFor] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getMyCourses();
      setList(data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = !q.trim()
    ? list
    : list.filter(
        (c) =>
          c.title.toLowerCase().includes(q.toLowerCase()) ||
          (c.subject || "").toLowerCase().includes(q.toLowerCase())
      );

  const onCreate = async (payload) => {
    await createCourse(payload);
    setCreating(false);
    await load();
  };
  const onUpdate = async (payload) => {
    await updateCourse(editing.id, payload);
    setEditing(null);
    await load();
  };
  const onDelete = async (c) => {
    if (!window.confirm(`Delete course "${c.title}"?`)) return;
    await deleteCourse(c.id);
    await load();
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">Course Management</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/profile/courses/insights")}
            title="View enrollments overview"
          >
            <i className="bi bi-people me-2" />
            Enrollments Overview
          </button>
          <div className="input-group" style={{ maxWidth: 320 }}>
            <span className="input-group-text">
              <i className="bi bi-search" />
            </span>
            <input
              className="form-control"
              placeholder="Search title or subject"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setCreating(true);
            }}
          >
            <i className="bi bi-plus-lg me-1" /> New Course
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Grade</th>
                <th>Language</th>
                <th>Status</th>
                <th className="text-end" style={{ width: 360 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-medium">{c.title}</td>
                    <td>{c.subject}</td>
                    <td>{c.gradeLevel}</td>
                    <td>{c.language}</td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => {
                            setCreating(false);
                            setEditing(c);
                          }}
                        >
                          Edit
                        </button>
                        {c.status === "approved" && (
                          <>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => setSectionsFor(c)}
                            >
                              Sections
                            </button>
                            <Link
                              className="btn btn-outline-success btn-sm"
                              to={`/profile/courses/${c.id}/learners`}
                            >
                              Learners
                            </Link>
                          </>
                        )}
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDelete(c)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No courses yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(creating || editing) && (
        <div className="card mt-4">
          <div className="card-header">
            <strong>
              {creating ? "Create Course" : `Edit: ${editing.title}`}
            </strong>
          </div>
          <div className="card-body">
            <CourseForm
              initial={editing}
              onCancel={() => {
                setCreating(false);
                setEditing(null);
              }}
              onSave={creating ? onCreate : onUpdate}
            />
          </div>
        </div>
      )}

      {sectionsFor && <SectionManager course={sectionsFor} />}
    </div>
  );
}
