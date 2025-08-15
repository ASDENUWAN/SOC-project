// src/pages/CourseCatalog.jsx
import React, { useEffect, useState } from "react";
import { listPublicCourses } from "../api/api.js";
import { Link, useSearchParams } from "react-router-dom";
import SubjectTabs from "../components/SubjectTabs.jsx";

export default function CourseCatalog() {
  const [params] = useSearchParams();
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const subject = (params.get("subject") || "").toLowerCase();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await listPublicCourses(
          subject ? { subject } : undefined
        );
        setList(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [subject]);

  const filtered = !q.trim()
    ? list
    : list.filter(
        (c) =>
          c.title.toLowerCase().includes(q.toLowerCase()) ||
          (c.subject || "").toLowerCase().includes(q.toLowerCase())
      );

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
        <h2 className="h4 m-0">Courses</h2>
        <div className="input-group" style={{ maxWidth: 340 }}>
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
          <input
            className="form-control"
            placeholder="Search by title or subject"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Subject Tabs */}
      <SubjectTabs />

      {loading ? (
        <div className="row g-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="col-md-4" key={i}>
              <div className="card h-100 shadow-sm placeholder-wave">
                <div className="card-body">
                  <h5 className="card-title placeholder col-8"></h5>
                  <p className="card-text placeholder col-12"></p>
                  <p className="card-text placeholder col-10"></p>
                  <div className="btn btn-outline-secondary disabled placeholder col-5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length ? (
        <div className="row g-3">
          {filtered.map((c) => (
            <div className="col-md-4" key={c.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{c.title}</h5>
                    <span className="badge bg-light text-dark text-uppercase">
                      {c.subject}
                    </span>
                  </div>

                  <div className="text-muted small mb-2">
                    {c.gradeLevel || "—"} • {c.language?.toUpperCase() || "EN"}
                  </div>

                  <p
                    className="card-text flex-grow-1"
                    style={{ minHeight: 60 }}
                  >
                    {c.description?.slice(0, 120) || "No description"}…
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <Link
                      className="btn btn-outline-primary btn-sm"
                      to={`/course/${c.id}`}
                    >
                      View Details
                    </Link>
                    <i className="bi bi-arrow-right-circle text-primary fs-5"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info mt-4">No courses found.</div>
      )}
    </div>
  );
}
