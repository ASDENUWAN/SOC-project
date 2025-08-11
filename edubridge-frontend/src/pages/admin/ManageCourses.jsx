import React, { useEffect, useState } from "react";
import { adminListCourses, adminSetCourseStatus } from "../../api/axios.js";

const Badge = ({ status }) => {
  const map = { pending: "warning", approved: "success", rejected: "danger" };
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
      const [p, all] = await Promise.all([
        adminListCourses("pending"),
        adminListCourses(),
      ]);
      setPending(p.data);
      setOthers(all.data.filter((c) => c.status !== "pending"));
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
      : list.filter(
          (c) =>
            c.title.toLowerCase().includes(q.toLowerCase()) ||
            (c.creatorName || "").toLowerCase().includes(q.toLowerCase())
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

  const Row = ({ c, actions }) => (
    <tr>
      <td className="fw-medium">{c.title}</td>
      <td>{c.subject}</td>
      <td>{c.gradeLevel}</td>
      <td>{c.language}</td>
      <td>
        {c.creatorName}{" "}
        <span className="small text-muted">&lt;{c.creatorEmail}&gt;</span>
      </td>
      <td>
        <Badge status={c.status} />
      </td>
      <td className="text-end" style={{ width: 240 }}>
        {actions ? (
          <div className="btn-group">
            <button
              className="btn btn-outline-success btn-sm"
              disabled={savingId === c.id}
              onClick={() => setStatus(c, "approved")}
            >
              Approve
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              disabled={savingId === c.id}
              onClick={() => setStatus(c, "rejected")}
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
            placeholder="Search by title/creator"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : (
        <>
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-warning-subtle">
              <strong>Pending Approval</strong>
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
                      <Row key={c.id} c={c} actions />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        Nothing pending
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
                      <Row key={c.id} c={c} actions />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
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
