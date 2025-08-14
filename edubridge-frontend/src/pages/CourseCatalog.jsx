import React, { useEffect, useState } from "react";
import { listPublicCourses } from "../api/api.js";
import { Link } from "react-router-dom";

export default function CourseCatalog() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await listPublicCourses();
      setList(data);
    })();
  }, []);

  const filtered = !q.trim()
    ? list
    : list.filter(
        (c) =>
          c.title.toLowerCase().includes(q.toLowerCase()) ||
          (c.subject || "").toLowerCase().includes(q.toLowerCase())
      );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 m-0">Courses</h2>
        <input
          className="form-control"
          style={{ maxWidth: 340 }}
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="row g-3">
        {filtered.map((c) => (
          <div className="col-md-4" key={c.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{c.title}</h5>
                <div className="text-muted small mb-2">
                  {c.subject} • {c.gradeLevel} • {c.language}
                </div>
                <p className="card-text" style={{ minHeight: 60 }}>
                  {c.description?.slice(0, 120) || "No description"}…
                </p>
                <Link
                  className="btn btn-outline-primary btn-sm"
                  to={`/course/${c.id}`}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
        {!filtered.length && (
          <div className="text-muted">No courses found.</div>
        )}
      </div>
    </div>
  );
}
