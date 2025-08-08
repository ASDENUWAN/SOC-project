// src/pages/admin/ManageCreators.jsx
import React, { useEffect, useState } from "react";
import { userApi } from "../../api/axios.js";
import StarRating from "../../components/StarRating.jsx";

export default function ManageCreators() {
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [others, setOthers] = useState([]);
  const [q, setQ] = useState("");
  const [savingId, setSavingId] = useState(null); // disable buttons while saving

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.get("/creators");
      setPending(
        data.pending.map((c) => ({
          ...c,
          _status: c.status,
          // no rating editing in pending list
        }))
      );
      setOthers(
        data.others.map((c) => ({
          ...c,
          _status: c.status,
          _rating: c.rating ?? 0,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = (list) => {
    if (!q.trim()) return list;
    const s = q.toLowerCase();
    return list.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s) ||
        (c.mobile || "").toLowerCase().includes(s)
    );
  };

  // API helpers
  const apiSetStatus = async (creator) =>
    userApi.put(`/creators/${creator.id}/status`, { status: creator._status });

  const apiSetRating = async (creator) =>
    userApi.put(`/creators/${creator.id}/rating`, { rating: creator._rating });

  const remove = async (creator) => {
    if (!window.confirm(`Remove ${creator.name}? This cannot be undone.`))
      return;
    setSavingId(creator.id);
    try {
      await userApi.delete(`/creators/${creator.id}`);
      await load();
    } finally {
      setSavingId(null);
    }
  };

  // For ALL creators: one Update button → save status & rating (only if changed)
  const updateBoth = async (creator) => {
    setSavingId(creator.id);
    try {
      const ops = [];
      const statusChanged = creator._status !== creator.status;
      const ratingChanged =
        (Number(creator._rating) || 0) !== (Number(creator.rating) || 0);

      if (statusChanged) ops.push(apiSetStatus(creator));
      if (ratingChanged) ops.push(apiSetRating(creator));

      if (ops.length === 0) {
        // nothing changed
        return;
      }
      await Promise.all(ops);
      await load(); // refresh after update
    } finally {
      setSavingId(null);
    }
  };

  const statuses = ["pending", "approved", "rejected"];

  const CreatorCell = ({ c }) => (
    <div className="d-flex align-items-center gap-2">
      {c.profilePicUrl ? (
        <img
          src={c.profilePicUrl}
          alt=""
          width="36"
          height="36"
          className="rounded-circle object-fit-cover"
        />
      ) : (
        <i className="bi bi-person-circle" style={{ fontSize: 28 }}></i>
      )}
      <div>
        <div className="fw-semibold">{c.name}</div>
        {/* clickable email */}
        <div className="small">
          <a href={`mailto:${c.email}`} className="text-decoration-none">
            {c.email}
          </a>
        </div>
      </div>
      {c.isNew && <span className="badge bg-warning text-dark ms-2">NEW</span>}
    </div>
  );

  const ContactCell = ({ c }) => (
    <div className="small">
      {c.mobile ? (
        <div>
          <i className="bi bi-telephone me-1"></i>
          <a href={`tel:${c.mobile}`} className="text-decoration-none">
            {c.mobile}
          </a>
        </div>
      ) : (
        <span className="text-muted">—</span>
      )}
    </div>
  );

  // Row for PENDING/NEW list (no rating, only save status + remove)
  const PendingRow = ({ creator, onChange }) => (
    <tr>
      <td className="text-nowrap">
        <CreatorCell c={creator} />
      </td>
      <td>
        <ContactCell c={creator} />
      </td>
      <td style={{ width: 160 }}>
        <select
          className="form-select form-select-sm"
          value={creator._status}
          onChange={(e) => onChange({ ...creator, _status: e.target.value })}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="text-end" style={{ width: 220 }}>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={savingId === creator.id}
            onClick={async () => {
              setSavingId(creator.id);
              try {
                await apiSetStatus(creator);
                await load();
              } finally {
                setSavingId(null);
              }
            }}
          >
            Save Status
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            disabled={savingId === creator.id}
            onClick={() => remove(creator)}
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );

  // Row for ALL creators (status + rating, single Update + Remove)
  const AllRow = ({ creator, onChange }) => (
    <tr>
      <td style={{ width: 80 }} className="text-muted">
        {creator.id}
      </td>
      <td className="text-nowrap">
        <CreatorCell c={creator} />
      </td>
      <td>
        <ContactCell c={creator} />
      </td>
      <td style={{ width: 160 }}>
        <select
          className="form-select form-select-sm"
          value={creator._status}
          onChange={(e) => onChange({ ...creator, _status: e.target.value })}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>
      <td style={{ width: 180 }}>
        <StarRating
          value={creator._rating || 0}
          onChange={(val) => onChange({ ...creator, _rating: val })}
        />
      </td>
      <td className="text-end" style={{ width: 220 }}>
        <div className="btn-group">
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={savingId === creator.id}
            onClick={() => updateBoth(creator)}
          >
            Update
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            disabled={savingId === creator.id}
            onClick={() => remove(creator)}
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="container-fluid p-0">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">Manage Creators</h2>
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
        <>
          {/* Pending/New */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-warning-subtle">
              <strong>New / Pending Creators</strong>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Creator</th>
                      <th>Contact</th>
                      <th style={{ width: 160 }}>Status</th>
                      <th className="text-end" style={{ width: 220 }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered(pending).length ? (
                      filtered(pending).map((c, idx) => (
                        <PendingRow
                          key={c.id}
                          creator={c}
                          onChange={(next) => {
                            const copy = [...pending];
                            copy[idx] = next;
                            setPending(copy);
                          }}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                          No pending creators
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* All creators */}
          <div className="card shadow-sm">
            <div className="card-header">
              <strong>All Creators</strong>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Creator</th>
                      <th>Contact</th>
                      <th style={{ width: 160 }}>Status</th>
                      <th style={{ width: 180 }}>Rating</th>
                      <th className="text-end" style={{ width: 220 }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered(others).length ? (
                      filtered(others).map((c, idx) => (
                        <AllRow
                          key={c.id}
                          creator={c}
                          onChange={(next) => {
                            const copy = [...others];
                            copy[idx] = next;
                            setOthers(copy);
                          }}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          No creators
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
