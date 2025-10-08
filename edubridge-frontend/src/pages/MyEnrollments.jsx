// src/pages/MyEnrollments.jsx
import React, { useEffect, useState } from "react";
import { listMyEnrollments, getPublicCourseSummary } from "../api/api.js";
import { Link } from "react-router-dom";

export default function MyEnrollments() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({}); // courseId -> summary

  useEffect(() => {
    (async () => {
      const { data } = await listMyEnrollments();
      setRows(data);

      const map = {};
      await Promise.all(
        data.map(async (e) => {
          const { data: c } = await getPublicCourseSummary(e.courseId);
          map[e.courseId] = c;
        })
      );
      setMeta(map);
    })();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="h4 mb-3">My Courses</h2>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Course</th>
              <th>Status</th>
              <th>Progress</th>
              <th className="text-end">Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((e) => {
                const c = meta[e.courseId] || {};
                return (
                  <tr key={e.id}>
                    <td>
                      <div className="fw-medium">
                        {c.title || `Course #${e.courseId}`}
                      </div>
                      <div className="small text-muted">
                        {c.subject} • {c.gradeLevel} • {c.language}
                      </div>
                    </td>
                    <td>{e.status}</td>
                    <td style={{ minWidth: 180 }}>
                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${e.progress}%` }}
                          aria-valuenow={e.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                      <span className="small text-muted">{e.progress}%</span>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/course/${e.courseId}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Continue
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No enrollments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
