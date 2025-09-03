import React, { useMemo, useRef, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaGraduationCap } from "react-icons/fa";

import signature from "./assets/signature.png";
import seal from "./assets/seal.png";
import background from "./assets/background.png";

const API = import.meta.env.VITE_API_BASE || "http://localhost:4021/api";

function autoStatus(marks) {
  const m = Number(marks || 0);
  if (m >= 75) return "excellent";
  if (m >= 55) return "good";
  if (m >= 35) return "average";
  return "fail";
}

const StatusBadge = ({ status }) => {
  const map = {
    excellent: "success",
    good: "primary",
    average: "warning",
    fail: "danger",
  };
  return <span className={`badge bg-${map[status] || "secondary"}`}>{status}</span>;
};

export default function App() {
  const [form, setForm] = useState({
    course_id: "", student_id: "", exam_id: "",
    marks: "", studentName: "", courseTitle: "",
    status: "auto"
  });
  const [rows, setRows] = useState([]);
  const ref = useRef();

  const status = useMemo(() => {
    if (form.status === "auto") return autoStatus(form.marks);
    return form.status;
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const loadRows = async () => {
    const { data } = await axios.get(`${API}/certificates`);
    setRows(data);
  };
  React.useEffect(() => { loadRows(); }, []);

  // Make PDF from the preview DOM, download for user, and send to backend
  const handleGenerate = async () => {
    if (!ref.current) return;

    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: null });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    const pdfDataUrl = pdf.output("datauristring"); // data:application/pdf;base64,...

    // Download for the user
    pdf.save(`certificate-${form.student_id || "student"}.pdf`);

    // Save for "admin" (backend record + public URL)
    const payload = {
      course_id: form.course_id,
      student_id: form.student_id,
      exam_id: form.exam_id,
      marks: Number(form.marks || 0),
      status: form.status === "auto" ? undefined : form.status,
      issue_date: new Date().toISOString().slice(0, 10),
      pdfDataUrl
    };
    await axios.post(`${API}/certificates`, payload);
    await loadRows();
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="header-logo"><FaGraduationCap /> Certificate Service </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Create Certificate</h5>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label">Course ID</label>
                  <input name="course_id" className="form-control" value={form.course_id} onChange={onChange}/>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label">Student ID</label>
                  <input name="student_id" className="form-control" value={form.student_id} onChange={onChange}/>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label">Exam ID</label>
                  <input name="exam_id" className="form-control" value={form.exam_id} onChange={onChange}/>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label">Marks</label>
                  <input name="marks" type="number" className="form-control" value={form.marks} onChange={onChange}/>
                </div>
                <div className="col-12">
                  <label className="form-label">Student Name (shown on certificate)</label>
                  <input name="studentName" className="form-control" value={form.studentName} onChange={onChange}/>
                </div>
                <div className="col-12">
                  <label className="form-label">Course Title (shown on certificate)</label>
                  <input name="courseTitle" className="form-control" value={form.courseTitle} onChange={onChange}/>
                </div>
                <div className="col-12">
                  <label className="form-label">Status (optional)</label>
                  <select name="status" className="form-select" value={form.status} onChange={onChange}>
                    <option value="auto">Auto (based on marks)</option>
                    <option value="excellent">excellent</option>
                    <option value="good">good</option>
                    <option value="average">average</option>
                    <option value="fail">fail</option>
                  </select>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" onClick={handleGenerate}>Create Certificate</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="p-2 rounded-4" style={{border: "4px solid #e9d8fd"}}>
            <div className="certificate-preview" ref={ref}>
              <div className="certificate-inner" style={{ backgroundImage: `url(${background})`}}>
                <div className="brand">
                  <FaGraduationCap className="logo-cap" />
                  <div style={{fontWeight:800, fontSize:"1.4rem"}}>EDUBRIDGE</div>
                </div>
                <div className="smallmuted">Certificate of Achievement</div>
                <p className="smallmuted mt-2">This is to certify that</p>
                <div className="certificate-name">{form.studentName || "Your Student Name"}</div>
                <p className="smallmuted">has successfully completed the course</p>
                <div className="certificate-course">{form.courseTitle || "Course Title"}</div>
                <div className="certificate-badges">
                  <span className="badge-chip">Course ID: {form.course_id || "—"}</span>
                  <span className="badge-chip">Marks: {form.marks || "—"}</span>
                  <span className="badge-chip">Status: <StatusBadge status={status} /></span>
                </div>
                <div className="footer-sign">
                  <img src={signature} alt="signature" />
                  <small>Course Instructor</small>
                </div>
                <div className="footer-seal">
                  <img src={seal} alt="seal" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4"/>
      <h5>Issued Certificates</h5>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Student</th><th>Course</th><th>Exam</th><th>Marks</th><th>Status</th><th>Issued</th><th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.certificate_id}>
                <td>{r.certificate_id}</td>
                <td>{r.student_id}</td>
                <td>{r.course_id}</td>
                <td>{r.exam_id}</td>
                <td>{r.marks}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>{r.issue_date}</td>
                <td>
                  {r.file_url
                    ? <a className="btn btn-outline-secondary btn-sm" href={r.file_url} target="_blank">Open</a>
                    : <span className="text-muted">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
