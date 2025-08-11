import React, { useEffect, useState } from "react";
import {
  createSection,
  deleteSection,
  getSections,
  updateSection,
} from "../../api/axios.js";

export default function SectionManager({ course }) {
  const [list, setList] = useState([]);
  const [type, setType] = useState("text"); // text | video | pdf
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await getSections(course.id);
    setList(data);
  };
  useEffect(() => {
    load();
  }, [course.id]);

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (type === "text") {
        await createSection(course.id, { type, title, text });
      } else {
        const fd = new FormData();
        fd.append("type", type);
        fd.append("title", title);
        if (file) fd.append("file", file);
        await createSection(course.id, fd, true);
      }
      setType("text");
      setTitle("");
      setText("");
      setFile(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const editText = async (s) => {
    const newTitle = prompt("New title", s.title) ?? s.title;
    const newText = prompt("New text", s.text || "") ?? s.text;
    await updateSection(s.id, { title: newTitle, text: newText });
    await load();
  };

  const replaceFile = async (s) => {
    const newTitle = prompt("New title", s.title) ?? s.title;
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = s.type === "video" ? "video/*" : "application/pdf";
    picker.onchange = async () => {
      const fd = new FormData();
      fd.append("title", newTitle);
      if (picker.files?.[0]) fd.append("file", picker.files[0]);
      await updateSection(s.id, fd, true);
      await load();
    };
    picker.click();
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete section "${s.title}"?`)) return;
    await deleteSection(s.id);
    await load();
  };

  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between">
        <strong>Sections</strong>
        <span className="small text-muted">Course ID: {course.id}</span>
      </div>
      <div className="card-body">
        <form onSubmit={add} className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {type === "text" ? (
            <div className="col-12">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          ) : (
            <div className="col-md-4">
              <label className="form-label">{type.toUpperCase()} file</label>
              <input
                type="file"
                className="form-control"
                accept={type === "video" ? "video/*" : "application/pdf"}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          )}
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Add Section"}
            </button>
          </div>
        </form>

        <div className="table-responsive mt-4">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Created</th>
                <th>Updated</th>
                <th className="text-end" style={{ width: 220 }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.length ? (
                list.map((s) => (
                  <tr key={s.id}>
                    <td>{s.title}</td>
                    <td className="text-capitalize">{s.type}</td>
                    <td className="small text-muted">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                    <td className="small text-muted">
                      {new Date(s.updatedAt).toLocaleString()}
                    </td>
                    <td className="text-end">
                      {s.type === "text" ? (
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => editText(s)}
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => replaceFile(s)}
                        >
                          Replace File
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(s)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No sections yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
