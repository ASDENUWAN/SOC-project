import React, { useEffect, useState } from "react";
import {
  adminListPendingCourses,
  adminListAllCourses,
  adminSetCourseStatus,
} from "../../api/api.js";

const Badge = ({ status }) => {
  // NOTE: backend uses 'submitted' not 'pending'
  const map = {
    submitted: "warning",
    approved: "success",
    rejected: "danger",
    draft: "secondary",
  };
  return (
    <span className={`badge bg-${map[status] || "secondary"}`}>{status}</span>
  );
};

export default function ManageCourses() {
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [others, setOthers] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, allRes] = await Promise.all([
        adminListPendingCourses(),
        adminListAllCourses(),
      ]);
      const all = allRes.data || [];
      const draft = pRes.data || [];

      // other = everything that is NOT submitted
      setPending(draft);
      setOthers(all.filter((c) => c.status !== "draft"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = (list) =>
    !q.trim()
      ? list
      : list.filter((c) =>
          `${c.title} ${c.subject} ${c.gradeLevel} ${c.language}`
            .toLowerCase()
            .includes(q.toLowerCase())
        );

  const setStatus = async (c, status) => {
    setSavingId(c.id);
    try {
      await adminSetCourseStatus(c.id, status);
      await load();
    } finally {
      setSavingId(null);
    }
  };

  const Row = ({ c, showActions }) => (
    <tr>
      <td className="fw-medium">{c.title}</td>
      <td>{c.subject}</td>
      <td>{c.gradeLevel}</td>
      <td>{c.language}</td>
      <td>{c.creatorId}</td>
      <td>
        <Badge status={c.status} />
      </td>
      <td className="text-end" style={{ width: 260 }}>
        {showActions ? (
          <div className="btn-group">
            {/* Approve */}
            <button
              className="btn btn-outline-success btn-sm"
              disabled={savingId === c.id || c.status === "approved"}
              onClick={() => setStatus(c, "approved")}
              title={c.status === "approved" ? "Already approved" : "Approve"}
            >
              Approve
            </button>

            {/* Reject – allowed for submitted OR already approved */}
            <button
              className="btn btn-outline-danger btn-sm"
              disabled={savingId === c.id || c.status === "rejected"}
              onClick={() => setStatus(c, "rejected")}
              title={c.status === "rejected" ? "Already rejected" : "Reject"}
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-muted small">—</span>
        )}
      </td>
    </tr>
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">Manage Courses</h2>
        <div className="input-group" style={{ maxWidth: 320 }}>
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
          <input
            className="form-control"
            placeholder="Search by title/subject/grade/lang"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : (
        <>
          {/* Submitted (pending approval) */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-warning-subtle">
              <strong>Submitted (Pending Approval)</strong>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Grade</th>
                    <th>Lang</th>
                    <th>Creator</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(pending).length ? (
                    filtered(pending).map((c) => (
                      <Row key={c.id} c={c} showActions />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        Nothing pending
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* All other courses */}
          <div className="card shadow-sm">
            <div className="card-header">
              <strong>All Courses</strong>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Grade</th>
                    <th>Lang</th>
                    <th>Creator</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered(others).length ? (
                    filtered(others).map((c) => (
                      <Row key={c.id} c={c} showActions />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No courses
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
