import React, { useEffect, useState } from "react";
import { userApi } from "../api/axios.js";

export default function PublicCreators() {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await userApi.get("/public/creators");
        setCreators(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = creators.filter((c) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(s) ||
      (c.email || "").toLowerCase().includes(s)
    );
  });

  // ⭐ Render rating stars (with half-stars)
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
      } else if (rating >= i - 0.5) {
        stars.push(<i key={i} className="bi bi-star-half text-warning"></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star text-warning"></i>);
      }
    }
    return (
      <div className="mb-2">
        {stars} <span className="small text-muted">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Our Creators</h2>
        <div className="input-group" style={{ maxWidth: 320 }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            className="form-control border-start-0"
            placeholder="Search creators by name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : filtered.length ? (
        <div className="row g-4">
          {filtered.map((c) => (
            <div className="col-md-4 col-lg-3" key={c.id}>
              <div className="card shadow-sm h-100 border-0 rounded-3 hover-shadow transition">
                <div
                  className="d-flex justify-content-center align-items-center bg-light"
                  style={{ height: 180 }}
                >
                  {c.profilePicUrl ? (
                    <img
                      src={c.profilePicUrl}
                      alt={c.name}
                      className="rounded-circle object-fit-cover"
                      style={{ width: 120, height: 120 }}
                    />
                  ) : (
                    <i
                      className="bi bi-person-circle text-secondary"
                      style={{ fontSize: 80 }}
                    />
                  )}
                </div>

                <div className="card-body text-center">
                  <h5 className="card-title fw-semibold mb-1">
                    {c.title ? `${c.title} ` : ""}
                    {c.name}
                  </h5>
                  {renderStars(c.rating)}
                  <a
                    href={`mailto:${c.email}`}
                    className="btn btn-outline-primary btn-sm mt-2"
                  >
                    <i className="bi bi-envelope me-1"></i> Contact
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">No creators found.</div>
      )}
    </div>
  );
}
