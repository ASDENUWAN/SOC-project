import React, { useState } from "react";

const SUBJECTS = [
  { value: "maths", label: "Maths" },
  { value: "english", label: "English" },
  { value: "it", label: "IT" },
];

export default function CourseForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    subject: initial?.subject || "maths",
    gradeLevel: initial?.gradeLevel || "",
    language: initial?.language || "English",
  });

  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="row g-3"
    >
      <div className="col-md-6">
        <label className="form-label">Title</label>
        <input
          name="title"
          className="form-control"
          value={form.title}
          onChange={change}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Subject</label>
        <select
          name="subject"
          className="form-select"
          value={form.subject}
          onChange={change}
        >
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">Grade Level</label>
        <input
          name="gradeLevel"
          className="form-control"
          value={form.gradeLevel}
          onChange={change}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Language</label>
        <input
          name="language"
          className="form-control"
          value={form.language}
          onChange={change}
        />
      </div>
      <div className="col-12">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows={3}
          value={form.description}
          onChange={change}
        />
      </div>
      <div className="col-12 d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}
