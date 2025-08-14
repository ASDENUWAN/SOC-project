import React, { useEffect, useState } from "react";
import { getPublicCourse } from "../api/api.js";
import { useParams } from "react-router-dom";

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await getPublicCourse(id);
      setCourse(data);
    })();
  }, [id]);

  if (!course) return <div className="container py-4">Loading…</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-1">{course.title}</h2>
      <div className="text-muted mb-3">
        {course.subject} • {course.gradeLevel} • {course.language}
      </div>
      <p>{course.description}</p>

      <h5 className="mt-4">Sections</h5>
      <ul className="list-group">
        {(course.sections || []).map((s) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={s.id}
          >
            <div>
              <div className="fw-semibold">{s.title}</div>
              <div className="small text-muted">{s.contentType}</div>
            </div>
            {s.contentType === "text" ? (
              <button className="btn btn-sm btn-outline-secondary" disabled>
                Text
              </button>
            ) : (
              <a
                className="btn btn-sm btn-outline-primary"
                href={s.contentUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open {s.contentType.toUpperCase()}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
