// src/pages/CourseView.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  getPublicCourseSummary,
  getPublicCourseFull,
  enrollCourse,
  unenrollCourse,
  getMyEnrollment,
  toggleSectionDone,
} from "../api/api.js";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

/* Section Item Renderer */
function SectionItem({ section, checked, toggling, onToggle, role }) {
  const [open, setOpen] = useState(false);
  const isText = section.contentType === "text";
  const isPdf = section.contentType === "pdf";
  const isVideo = section.contentType === "video";

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-semibold">{section.title}</div>
          <div className="small text-muted">{section.contentType}</div>
        </div>

        <div className="d-flex gap-2 align-items-center">
          {isText ? (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Hide Text" : "View Text"}
            </button>
          ) : isPdf ? (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Hide PDF" : "Preview PDF"}
            </button>
          ) : isVideo ? (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Hide Video" : "Watch Video"}
            </button>
          ) : null}

          {/* Progress tracking only for students */}
          {role === "student" && (
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={checked}
                disabled={!!toggling}
                onChange={(e) => onToggle(section.id, e.target.checked)}
              />
              <label className="form-check-label">Done</label>
            </div>
          )}
        </div>
      </div>

      {/* Inline Previews */}
      {isText && open && (
        <div className="card mt-2">
          <div className="card-body">
            <pre className="section-text-pre">
              {section.textContent || "No content"}
            </pre>
          </div>
        </div>
      )}

      {isPdf && open && (
        <iframe
          src={section.contentUrl}
          title="PDF Preview"
          width="100%"
          height="500px"
          style={{ border: "1px solid #ddd", marginTop: "10px" }}
        />
      )}

      {isVideo && open && (
        <div className="mt-2">
          <video width="100%" height="auto" controls>
            <source src={section.contentUrl} type="video/mp4" />
            Your browser does not support video.
          </video>
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
  const [toggling, setToggling] = useState({});
  const [error, setError] = useState("");

  // Load course summary
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getPublicCourseSummary(id);
        setSummary(data);
      } catch {
        setError("Failed to load course.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Load enrollment (only students)
  const loadEnrollment = async () => {
    if (!user || user.role !== "student") return setEnr(null);
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

  // Load sections (students if enrolled, or creators/admins always)
  useEffect(() => {
    (async () => {
      if (
        (user?.role === "student" &&
          (enr?.status === "active" || enr?.status === "completed")) ||
        user?.role === "creator" ||
        user?.role === "admin"
      ) {
        const { data } = await getPublicCourseFull(id);
        setFull(data);
      } else {
        setFull(null);
      }
    })();
  }, [id, enr, user]);

  // Enroll student
  const onEnroll = async () => {
    if (!user) return navigate(`/login?redirect=/course/${id}`);
    try {
      await enrollCourse(id);
      await loadEnrollment();
    } catch (err) {
      setError(err.response?.data?.message || "Could not enroll.");
    }
  };

  // Unenroll student
  const onUnenroll = async () => {
    if (!window.confirm("Unenroll from this course?")) return;
    try {
      await unenrollCourse(id);
      // reset state → student can re-enroll
      setEnr(null);
      setFull(null);
    } catch {
      setError("Failed to unenroll.");
    }
  };

  // Toggle section done
  const onToggle = async (sectionId, done) => {
    setToggling((m) => ({ ...m, [sectionId]: true }));
    try {
      await toggleSectionDone(id, sectionId, done);
      await loadEnrollment();
    } finally {
      setToggling((m) => ({ ...m, [sectionId]: false }));
    }
  };

  if (loading) return <div className="container py-4">Loading…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const { title, subject, gradeLevel, language, description } = summary || {};
  const completedIds = new Set(enr?.completedSectionIds || []);
  const progress = enr?.progress || 0;

  return (
    <div className="container py-4">
      <h2>{title}</h2>
      <div className="text-muted">
        {subject} • {gradeLevel} • {language?.toUpperCase() || "EN"}
      </div>
      <p>{description}</p>

      {/* Student Enrollment Actions */}
      {user?.role === "student" && (
        <div className="mb-3">
          {enr && enr.status !== "cancelled" ? (
            <div>
              <span className="badge bg-info">
                {enr.status} • {progress}%
              </span>
              <button
                className="btn btn-outline-danger ms-2"
                onClick={onUnenroll}
              >
                Unenroll
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onEnroll}>
              Enroll to Access
            </button>
          )}
        </div>
      )}

      {/* Public visitor message */}
      {!user && (
        <div className="alert alert-warning">
          Login to enroll and view course sections.
        </div>
      )}

      {/* Sections */}
      {full ? (
        <>
          <h4 className="mt-3">Sections</h4>
          {user?.role === "student" && (
            <div className="progress mb-3" style={{ height: 8 }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <ul className="list-group mt-2">
            {(full.sections || []).map((s) => (
              <SectionItem
                key={s.id}
                section={s}
                role={user?.role}
                checked={completedIds.has(s.id)}
                toggling={toggling[s.id]}
                onToggle={onToggle}
              />
            ))}
          </ul>
        </>
      ) : (
        user?.role === "student" &&
        !enr && (
          <div className="alert alert-info mt-3">
            Enroll to unlock course sections.
          </div>
        )
      )}
    </div>
  );
}
