import React, { useMemo, useRef, useState, useEffect } from "react";
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
  const map = { excellent: "success", good: "primary", average: "warning", fail: "danger" };
  return <span className={`badge bg-${map[status] || "secondary"}`}>{status}</span>;
};

export default function App() {
  const [form, setForm] = useState({
    course_id: "",
    student_id: "",
    exam_id: "",
    marks: "",
    studentName: "",
    courseTitle: "",
    status: "auto",
  });
  const [rows, setRows] = useState([]);
  const [quizFound, setQuizFound] = useState(true);
  const ref = useRef();

  const status = useMemo(() => {
    if (form.status === "auto") return autoStatus(form.marks);
    return form.status;
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const loadRows = async () => {
    const { data } = await axios.get(`${API}/certificates`);
    setRows(data);
  };

  useEffect(() => {
    loadRows();
  }, []);

  // 🔹 Auto-fetch quiz info
  useEffect(() => {
    const { course_id, student_id, exam_id } = form;
    if (course_id && student_id && exam_id) {
      axios
        .get(`${API}/certificates/quiz/info`, { params: { course_id, student_id, exam_id } })
        .then((res) => {
          const { student_name, course_title, marks, status } = res.data;
          setForm((f) => ({
            ...f,
            marks,
            studentName: student_name,
            courseTitle: course_title,
            status,
          }));
          setQuizFound(true);
        })
        .catch(() => {
          setForm((f) => ({
            ...f,
            marks: "",
            studentName: "",
            courseTitle: "",
            status: "auto",
          }));
          setQuizFound(false);
        });
    }
  }, [form.course_id, form.student_id, form.exam_id]);

  const handleGenerate = async () => {
    if (!quizFound) {
      alert(" No matching record found in quiz database!");
      return;
    }
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: null });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    const pdfDataUrl = pdf.output("datauristring");
    pdf.save(`certificate-${form.student_id || "student"}.pdf`);
    const payload = {
      course_id: form.course_id,
      student_id: form.student_id,
      exam_id: form.exam_id,
      marks: Number(form.marks || 0),
      student_name: form.studentName,
      status: form.status === "auto" ? undefined : form.status,
      issue_date: new Date().toISOString().slice(0, 10),
      pdfDataUrl,
    };
    await axios.post(`${API}/certificates`, payload);
    await loadRows();
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="header-logo"><FaGraduationCap /> Certificate Service</div>
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
                  <input name="marks" type="number" className="form-control" value={form.marks} readOnly/>
                </div>
                <div className="col-12">
                  <label className="form-label">Student Name</label>
                  <input name="studentName" className="form-control" value={form.studentName} readOnly/>
                </div>
                <div className="col-12">
                  <label className="form-label">Course Title</label>
                  <input name="courseTitle" className="form-control" value={form.courseTitle} readOnly/>
                </div>
                <div className="col-12">
                  <label className="form-label">Status</label>
                  <input name="status" className="form-control" value={status} readOnly/>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" onClick={handleGenerate} disabled={!quizFound}>Create Certificate</button>
                  {!quizFound && <div className="text-danger mt-2">No matching quiz data found</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="p-2 rounded-4" style={{border: "4px solid #e9d8fd"}}>
            <div className="certificate-preview" ref={ref}>
              <div className="certificate-inner" style={{ backgroundImage: `url(${background})`}}>
                <div className="brand"><FaGraduationCap className="logo-cap" /><div style={{fontWeight:800, fontSize:"1.4rem"}}>EDUBRIDGE</div></div>
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
                <div className="footer-sign"><img src={signature} alt="signature" /><small>Course Instructor</small></div>
                <div className="footer-seal"><img src={seal} alt="seal" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
     
    </div>
  );
}

