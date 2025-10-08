import React from "react";
import { Link } from "react-router-dom";
import "./about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero bg-light">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold text-slate-800">
                Empowering Learning & Creation with EduBridge
              </h1>
              <p className="lead text-muted mt-3">
                EduBridge connects students, content creators, and admins in a
                secure, scalable platform. Learn with structured courses,
                publish high-quality lessons, manage approvals, and drive
                outcomes—all in one place.
              </p>
              <div className="mt-4 d-flex gap-2 flex-wrap">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="btn btn-outline-secondary btn-lg"
                >
                  Explore Features
                </a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="about-hero-card shadow-sm">
                <div className="d-flex align-items-center">
                  <span className="hero-badge">
                    <i className="bi bi-mortarboard"></i>
                  </span>
                  <div className="ms-3">
                    <h5 className="mb-1">Built for Learning</h5>
                    <p className="mb-0 small text-muted">
                      Structured courses, sections, and study-friendly UX.
                    </p>
                  </div>
                </div>
                <hr className="my-3" />
                <div className="d-flex align-items-center">
                  <span className="hero-badge badge-blue">
                    <i className="bi bi-easel2"></i>
                  </span>
                  <div className="ms-3">
                    <h5 className="mb-1">Creator-First Tools</h5>
                    <p className="mb-0 small text-muted">
                      Upload videos & PDFs to S3, craft text lessons, and
                      publish confidently.
                    </p>
                  </div>
                </div>
                <hr className="my-3" />
                <div className="d-flex align-items-center">
                  <span className="hero-badge badge-green">
                    <i className="bi bi-shield-check"></i>
                  </span>
                  <div className="ms-3">
                    <h5 className="mb-1">Safe & Moderated</h5>
                    <p className="mb-0 small text-muted">
                      Admin approval flow for creators & courses. JWT auth with
                      HTTP-only cookies.
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-muted small mt-2">
                * Fully responsive design. Works great on mobile, tablet, and
                desktop.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-slate-800">What We Offer</h2>
            <p className="text-muted mb-0">
              A complete learning ecosystem for students, creators, and admins.
            </p>
          </div>

          <div className="row g-4">
            {features.map((f) => (
              <div className="col-md-6 col-lg-4" key={f.title}>
                <div className="feature-card h-100 shadow-sm">
                  <div className={`icon-wrap ${f.className}`}>
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h5 className="mt-3 mb-2">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="who-card h-100 shadow-sm">
                <div className="d-flex align-items-center">
                  <span className="who-icon bg-blue">
                    <i className="bi bi-mortarboard"></i>
                  </span>
                  <h4 className="ms-3 mb-0">For Students</h4>
                </div>
                <ul className="list-unstyled mt-3 mb-0 text-muted small">
                  <li>
                    • Browse approved courses by subject (Maths, English, IT)
                  </li>
                  <li>• Learn via videos, PDFs, and text lessons</li>
                  <li>• Play quizzes & track progress (module prepared)</li>
                  <li>• Clean, distraction-free UI</li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="who-card h-100 shadow-sm">
                <div className="d-flex align-items-center">
                  <span className="who-icon bg-purple">
                    <i className="bi bi-easel2"></i>
                  </span>
                  <h4 className="ms-3 mb-0">For Creators</h4>
                </div>
                <ul className="list-unstyled mt-3 mb-0 text-muted small">
                  <li>• Build courses with rich sections (video/pdf/text)</li>
                  <li>• Tag by subject, grade, language</li>
                  <li>• Submit for admin review & publish</li>
                  <li>• Manage content & see section timestamps</li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="who-card h-100 shadow-sm">
                <div className="d-flex align-items-center">
                  <span className="who-icon bg-green">
                    <i className="bi bi-shield-lock"></i>
                  </span>
                  <h4 className="ms-3 mb-0">For Admins</h4>
                </div>
                <ul className="list-unstyled mt-3 mb-0 text-muted small">
                  <li>• Approve/reject creators & courses</li>
                  <li>• Manage users, ratings, and badges</li>
                  <li>• Enforce platform quality & compliance</li>
                  <li>• Monitor content pipeline end-to-end</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/register" className="btn btn-primary btn-lg">
              Join EduBridge
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-slate-800">How EduBridge Works</h2>
            <p className="text-muted mb-0">
              Simple steps from sign-up to learning.
            </p>
          </div>
          <div className="row g-4">
            {steps.map((s, i) => (
              <div className="col-md-6 col-lg-3" key={s.title}>
                <div className="step-card h-100 shadow-sm">
                  <div className="step-index">{i + 1}</div>
                  <h5 className="mt-2 mb-2">{s.title}</h5>
                  <p className="text-muted small mb-0">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-slate-800">Modern Architecture</h2>
            <p className="text-muted mb-0">
              Microservices with secure auth, S3 media, and a clean Bootstrap
              UI.
            </p>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {[
              "React (Vite)",
              "Bootstrap 5",
              "Node.js / Express",
              "MySQL / Sequelize",
              "JWT (HTTP-only cookies)",
              "AWS S3 (Media)",
              "Axios",
              "Microservices",
            ].map((t) => (
              <span
                key={t}
                className="badge rounded-pill text-bg-secondary tech-pill"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-slate-800">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="accordion" id="faq">
            {faqs.map((f, idx) => (
              <div className="accordion-item" key={f.q}>
                <h2 className="accordion-header" id={`h-${idx}`}>
                  <button
                    className={`accordion-button ${
                      idx !== 0 ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#c-${idx}`}
                    aria-expanded={idx === 0}
                    aria-controls={`c-${idx}`}
                  >
                    {f.q}
                  </button>
                </h2>
                <div
                  id={`c-${idx}`}
                  className={`accordion-collapse collapse ${
                    idx === 0 ? "show" : ""
                  }`}
                  aria-labelledby={`h-${idx}`}
                  data-bs-parent="#faq"
                >
                  <div className="accordion-body text-muted">{f.a}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/register" className="btn btn-primary btn-lg me-2">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-outline-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Structured Courses",
    text: "Courses are organized by sections: video lectures, slides (PDF), and text content.",
    icon: "bi-journals",
    className: "bg-blue",
  },
  {
    title: "Creator Approval Flow",
    text: "Admins approve/reject new creators and their courses to keep quality high.",
    icon: "bi-check2-shield",
    className: "bg-green",
  },
  {
    title: "Tags & Filters",
    text: "Find what you need by subject (Maths, English, IT), grade level, and language.",
    icon: "bi-tags",
    className: "bg-purple",
  },
  {
    title: "Secure Authentication",
    text: "JWT (HTTP-only cookies) + role-based access (student, creator, admin).",
    icon: "bi-shield-lock",
    className: "bg-slate",
  },
  {
    title: "Media Storage on S3",
    text: "Upload videos & PDFs; files are stored on AWS S3 for performance and reliability.",
    icon: "bi-cloud-upload",
    className: "bg-blue",
  },
  {
    title: "Admin Tools",
    text: "Moderate creators, approve courses, manage badges, and oversee the platform.",
    icon: "bi-wrench-adjustable",
    className: "bg-orange",
  },
  {
    title: "Student Dashboard",
    text: "View your courses, play quizzes, and track learning progress (module prepared).",
    icon: "bi-speedometer2",
    className: "bg-green",
  },
  {
    title: "Creator Console",
    text: "Build courses, add sections, update content, and see timestamps for changes.",
    icon: "bi-easel2",
    className: "bg-purple",
  },
  {
    title: "Responsive UI",
    text: "Clean Bootstrap UI optimized for mobile and desktop, with a modern light theme.",
    icon: "bi-bootstrap",
    className: "bg-slate",
  },
];

const steps = [
  {
    title: "Sign Up & Choose Role",
    text: "Register as Student or Creator. Creators may be reviewed by admins.",
  },
  {
    title: "Create or Explore Courses",
    text: "Creators build courses; students browse approved courses and enroll.",
  },
  {
    title: "Approval & Publishing",
    text: "Admins review and approve creator profiles and course submissions.",
  },
  {
    title: "Learn & Grow",
    text: "Watch videos, read PDFs, learn from text lessons, and take quizzes.",
  },
];

const faqs = [
  {
    q: "How do creators publish a course?",
    a: "Creators build a course with sections (video/pdf/text), then submit it. Admins review and approve. Once approved, the course becomes visible to students.",
  },
  {
    q: "Which subjects does EduBridge support?",
    a: "Currently Maths, English, and IT. Courses can also be tagged by grade level and language for easier discovery.",
  },
  {
    q: "How secure is the platform?",
    a: "We use JWT with HTTP-only cookies, role-based access, and an admin moderation workflow. Media is stored on AWS S3.",
  },
  {
    q: "Can I access EduBridge on mobile?",
    a: "Yes. The UI is fully responsive with Bootstrap 5 and works well on phones, tablets, and desktops.",
  },
];
