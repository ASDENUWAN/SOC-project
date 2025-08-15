// src/pages/CourseView.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  getPublicCourseFull,
  getPublicCourseSummary,
  enrollCourse,
  unenrollCourse,
  getMyEnrollment,
  toggleSectionDone,
} from "../api/api.js";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

/* One row per section with inline Text Reader */
function SectionItem({ section, checked, toggling, onToggle }) {
  const [open, setOpen] = useState(false);
  const isText = section.contentType === "text";

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column">
          <div className="fw-semibold">{section.title}</div>
          <div className="small text-muted text-uppercase">
            {section.contentType}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {isText ? (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              {open ? "Hide Text" : "View Text"}
            </button>
          ) : (
            <a
              className="btn btn-sm btn-outline-primary"
              href={section.contentUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open {section.contentType.toUpperCase()}
            </a>
          )}

          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`done-${section.id}`}
              checked={checked}
              disabled={!!toggling}
              onChange={(e) => onToggle(section.id, e.target.checked)}
            />
            <label htmlFor={`done-${section.id}`} className="form-check-label">
              Done
            </label>
          </div>
        </div>
      </div>

      {/* Inline Text Reader */}
      {isText && open && (
        <div className="card mt-3 shadow-sm">
          <div className="card-header py-2 d-flex justify-content-between">
            <span className="small text-muted">Text content</span>
            <button
              className="btn btn-sm btn-light"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="card-body">
            <pre className="section-text-pre mb-0">
              {section.textContent || "No content."}
            </pre>
          </div>
        </div>
      )}
    </li>
  );
}

export default function CourseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [full, setFull] = useState(null);
  const [enr, setEnr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState({}); // map: sectionId -> boolean

  // Load summary (always)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getPublicCourseSummary(id);
        setSummary(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Load my enrollment if logged in
  const loadEnrollment = async () => {
    if (!user) {
      setEnr(null);
      return;
    }
    try {
      const { data } = await getMyEnrollment(id);
      setEnr(data);
    } catch {
      setEnr(null);
    }
  };
  useEffect(() => {
    loadEnrollment();
  }, [id, user]);

  // Load full course (with sections) only when enrolled
  useEffect(() => {
    (async () => {
      if (user && (enr?.status === "active" || enr?.status === "completed")) {
        const { data } = await getPublicCourseFull(id);
        setFull(data);
      } else {
        setFull(null);
      }
    })();
  }, [id, enr, user]);

  const onEnroll = async () => {
    if (!user) {
      navigate(`/login?redirect=/course/${id}`);
      return;
    }
    await enrollCourse(id);
    await loadEnrollment();
  };

  const onUnenroll = async () => {
    if (!window.confirm("Unenroll from this course?")) return;
    await unenrollCourse(id);
    setFull(null);
    await loadEnrollment();
  };

  const onToggle = async (sectionId, done) => {
    setToggling((m) => ({ ...m, [sectionId]: true }));
    try {
      await toggleSectionDone(id, sectionId, done);
      await loadEnrollment();
    } finally {
      setToggling((m) => ({ ...m, [sectionId]: false }));
    }
  };

  if (loading || !summary)
    return <div className="container py-4">Loading…</div>;

  const { title, subject, gradeLevel, language, description } = summary;
  const completedIds = new Set(enr?.completedSectionIds || []);
  const progress = enr?.progress || 0;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="d-flex align-items-start justify-content-between">
            <div>
              <h2 className="mb-1">{title}</h2>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-light text-dark text-uppercase">
                  {subject}
                </span>
                <span className="badge bg-secondary">{gradeLevel || "—"}</span>
                <span className="badge bg-info text-dark">
                  {language?.toUpperCase() || "EN"}
                </span>
              </div>
            </div>

            {/* Sticky on lg screens */}
            <div className="d-none d-lg-block" style={{ minWidth: 200 }}>
              {user ? (
                enr ? (
                  <div className="card sticky-top" style={{ top: 80 }}>
                    <div className="card-body">
                      <div className="mb-2">
                        <span className="badge bg-info">
                          {enr.status} • {progress}%
                        </span>
                      </div>
                      <div className="progress mb-2" style={{ height: 8 }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{ width: `${progress}%` }}
                          aria-valuenow={progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={onUnenroll}
                      >
                        Unenroll
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card sticky-top" style={{ top: 80 }}>
                    <div className="card-body">
                      <div className="mb-2 text-muted small">
                        Enroll to access sections & track progress.
                      </div>
                      <button
                        className="btn btn-primary w-100"
                        onClick={onEnroll}
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="card sticky-top" style={{ top: 80 }}>
                  <div className="card-body">
                    <div className="small text-muted mb-2">
                      Login to enroll this course.
                    </div>
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => navigate(`/login?redirect=/course/${id}`)}
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-3">{description}</p>

          {/* Sections — visible only if user is logged in and enrolled */}
          {user && enr ? (
            <>
              <h5 className="mt-4 d-flex align-items-center gap-3">
                Sections
                <span className="badge bg-secondary">{progress}%</span>
              </h5>

              {!full ? (
                <div className="text-muted">Loading sections…</div>
              ) : (
                <ul className="list-group mt-2">
                  {(full.sections || []).map((s) => (
                    <SectionItem
                      key={s.id}
                      section={s}
                      checked={completedIds.has(s.id)}
                      toggling={toggling[s.id]}
                      onToggle={onToggle}
                    />
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="alert alert-warning mt-4">
              {user
                ? "Enroll to access the sections and track your progress."
                : "Login & enroll to access the sections."}
            </div>
          )}
        </div>

        {/* Mobile Actions (below content) */}
        <div className="col-lg-4 d-lg-none">
          <div className="card">
            <div className="card-body">
              {user ? (
                enr ? (
                  <>
                    <div className="mb-2">
                      <span className="badge bg-info">
                        {enr.status} • {progress}%
                      </span>
                    </div>
                    <div className="progress mb-3" style={{ height: 8 }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={onUnenroll}
                    >
                      Unenroll
                    </button>
                  </>
                ) : (
                  <>
                    <div className="small text-muted mb-2">
                      Enroll to access sections & track progress.
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      onClick={onEnroll}
                    >
                      Enroll
                    </button>
                  </>
                )
              ) : (
                <>
                  <div className="small text-muted mb-2">
                    Login to enroll this course.
                  </div>
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate(`/login?redirect=/course/${id}`)}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Local styles for the inline reader */}
      <style>{`
        .section-text-pre {
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.7;
          font-size: 1rem;
          color: #212529;
        }
      `}</style>
    </div>
  );
}
