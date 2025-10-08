// src/pages/creator/CreatorLearners.jsx
import React, { useEffect, useState } from "react";
import { getCreatorLearners } from "../../api/api.js";
import { useParams } from "react-router-dom";

export default function CreatorLearners() {
  const { courseId } = useParams();
  const [data, setData] = useState({ courseId, count: 0, learners: [] });

  useEffect(() => {
    (async () => {
      const { data } = await getCreatorLearners(courseId);
      setData(data);
    })();
  }, [courseId]);

  return (
    <div className="container-fluid p-0">
      <h2 className="h5 mb-3">Learners for Course #{courseId}</h2>
      <div className="mb-2">
        <span className="badge bg-primary">Enrolled: {data.count}</span>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>Student ID</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Started</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {data.learners.length ? (
              data.learners.map((l) => (
                <tr key={l.enrollmentId}>
                  <td>{l.studentId}</td>
                  <td>{l.status}</td>
                  <td style={{ minWidth: 160 }}>
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${l.progress}%` }}
                      />
                    </div>
                    <span className="small text-muted">{l.progress}%</span>
                  </td>
                  <td className="small text-muted">
                    {l.startedAt ? new Date(l.startedAt).toLocaleString() : "—"}
                  </td>
                  <td className="small text-muted">
                    {l.completedAt
                      ? new Date(l.completedAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No learners yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
