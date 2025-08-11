import React, { useEffect, useState } from "react";

const SUBJECTS = ["Maths", "English", "IT"];
const GRADES = ["Primary", "O/L", "A/L"];
const LANGS = ["English", "Sinhala", "Tamil"];

export default function CourseForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: SUBJECTS[0],
    gradeLevel: GRADES[0],
    language: LANGS[0],
    tags: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        subject: initial.subject || SUBJECTS[0],
        gradeLevel: initial.gradeLevel || GRADES[0],
        language: initial.language || LANGS[0],
        tags: (initial.tags || []).join(", "),
      });
    }
  }, [initial]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSave(payload);
  };

  return (
    <form onSubmit={submit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Subject</label>
          <select
            className="form-select"
            name="subject"
            value={form.subject}
            onChange={onChange}
          >
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Grade Level</label>
          <select
            className="form-select"
            name="gradeLevel"
            value={form.gradeLevel}
            onChange={onChange}
          >
            {GRADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Language</label>
          <select
            className="form-select"
            name="language"
            value={form.language}
            onChange={onChange}
          >
            {LANGS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Short Description</label>
          <textarea
            className="form-control"
            rows={3}
            name="description"
            value={form.description}
            onChange={onChange}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Tags (comma separated)</label>
          <input
            className="form-control"
            name="tags"
            value={form.tags}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-light" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
