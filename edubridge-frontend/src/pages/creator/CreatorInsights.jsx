// src/pages/creator/CreatorInsights.jsx
import React, { useEffect, useState } from "react";
import { getCreatorInsights, getMyCourses } from "../../api/api.js";
import { Link } from "react-router-dom";

export default function CreatorInsights() {
  const [ins, setIns] = useState([]);
  const [my, setMy] = useState([]);

  useEffect(() => {
    (async () => {
      const [{ data: insights }, { data: mine }] = await Promise.all([
        getCreatorInsights(),
        getMyCourses(),
      ]);
      setIns(insights || []);
      setMy(mine || []);
    })();
  }, []);

  // Map by courseId
  const map = {};
  for (const c of my) map[c.id] = c;
  return (
    <div className="container-fluid p-0">
      <h2 className="h5 mb-3">Enrollments Overview</h2>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Course</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Active</th>
              <th>Completed</th>
              <th>Total</th>
              <th className="text-end">Learners</th>
            </tr>
          </thead>
          <tbody>
            {ins.length ? (
              ins.map((row) => {
                const c = map[row.courseId] || {};
                return (
                  <tr key={row.courseId}>
                    <td className="fw-medium">
                      {c.title || `Course #${row.courseId}`}
                    </td>
                    <td>{c.subject}</td>
                    <td>{c.status}</td>
                    <td>{row.activeCount}</td>
                    <td>{row.completedCount}</td>
                    <td>{row.total}</td>
                    <td className="text-end">
                      <Link
                        className="btn btn-sm btn-outline-primary"
                        to={`/profile/courses/${row.courseId}/learners`}
                      >
                        View Learners
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No enrollments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
