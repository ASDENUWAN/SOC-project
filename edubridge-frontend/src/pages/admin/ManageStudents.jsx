import React, { useEffect, useState } from "react";
import { userApi } from "../../api/axios.js";

export default function ManageStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.get("/students"); // backend endpoint
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = students.filter((s) => {
    if (!q.trim()) return true;
    const str = q.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(str) ||
      (s.email || "").toLowerCase().includes(str) ||
      (s.mobile || "").toLowerCase().includes(str)
    );
  });

  const remove = async (student) => {
    if (!window.confirm(`Remove ${student.name}? This cannot be undone.`))
      return;
    setSavingId(student.id);
    try {
      await userApi.delete(`/users/${student.id}`);
      await load();
    } finally {
      setSavingId(null);
    }
  };

  const StudentCell = ({ s }) => (
    <div className="d-flex align-items-center gap-2">
      {s.profilePicUrl ? (
        <img
          src={s.profilePicUrl}
          alt=""
          width="36"
          height="36"
          className="rounded-circle object-fit-cover"
        />
      ) : (
        <i className="bi bi-person-circle" style={{ fontSize: 28 }}></i>
      )}
      <div>
        <div className="fw-semibold">
          {s.title ? `${s.title} ` : ""}
          {s.name}
        </div>
        <div className="small">
          <a href={`mailto:${s.email}`} className="text-decoration-none">
            {s.email}
          </a>
        </div>
      </div>
    </div>
  );

  const ContactCell = ({ s }) => (
    <div className="small">
      {s.mobile ? (
        <div>
          <i className="bi bi-telephone me-1"></i>
          <a href={`tel:${s.mobile}`} className="text-decoration-none">
            {s.mobile}
          </a>
        </div>
      ) : (
        <span className="text-muted">—</span>
      )}
    </div>
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">Manage Students</h2>
        <div className="input-group" style={{ maxWidth: 360 }}>
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
          <input
            className="form-control"
            placeholder="Search by name, email or mobile"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-header">
            <strong>All Students</strong>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Contact</th>
                    <th className="text-end" style={{ width: 180 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length ? (
                    filtered.map((s) => (
                      <tr key={s.id}>
                        <td style={{ width: 80 }} className="text-muted">
                          {s.id}
                        </td>
                        <td className="text-nowrap">
                          <StudentCell s={s} />
                        </td>
                        <td>
                          <ContactCell s={s} />
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            disabled={savingId === s.id}
                            onClick={() => remove(s)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No students
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
