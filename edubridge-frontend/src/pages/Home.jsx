import React from "react";
import { Link } from "react-router-dom";
import "./home.css"; // ← add this line (see CSS below)

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-section text-white d-flex align-items-center">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 text-center">
              <h1 className="display-4 fw-bold mb-3">
                Welcome to <span className="brand">EduBridge</span>
              </h1>
              <p className="lead mb-4">
                Learn you need with interactive courses, tutorials and quizzes.
              </p>
              <Link
                to="/register"
                className="btn btn-light btn-lg px-4 shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY EDUBRIDGE ===== */}
      <section className="py-5 bg-body-tertiary">
        <div className="container">
          <h2 className="section-title text-center mb-4">Why EduBridge?</h2>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-info-circle fs-4 text-primary"></i>
                    <h5 className="card-title mb-0">Structured Learning</h5>
                  </div>
                  <p className="card-text text-muted">
                    Bite-sized lessons, sections and resources that build up
                    your mastery step-by-step.
                  </p>
                  <Link
                    to="/register"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Start Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-info-circle fs-4 text-primary"></i>
                    <h5 className="card-title mb-0">Real-World Practice</h5>
                  </div>
                  <p className="card-text text-muted">
                    Interactive quizzes, examples, and project-style tasks to
                    build confidence.
                  </p>
                  <Link
                    to="/register"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-info-circle fs-4 text-primary"></i>
                    <h5 className="card-title mb-0">For Every Learner</h5>
                  </div>
                  <p className="card-text text-muted">
                    Courses in Maths, English & IT, tailored by grade and
                    language preferences.
                  </p>
                  <Link
                    to="/register"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Browse Courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-5 testimonials">
        <div className="container">
          <h2 className="section-title text-center mb-4">
            What Our Learners Say
          </h2>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-chat-quote fs-4 text-primary"></i>
                    <h5 className="card-title mb-0">“Clear & Practical”</h5>
                  </div>
                  <p className="card-text text-muted">
                    The lessons are concise and the examples make concepts easy
                    to apply.
                  </p>
                  <span className="badge rounded-pill bg-primary-subtle text-primary">
                    Grade 10 • Maths
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-chat-quote fs-4 text-primary"></i>
                    <h5 className="card-title mb-0">“Great Explanations”</h5>
                  </div>
                  <p className="card-text text-muted">
                    Love the section-based lessons and quick quizzes—super
                    helpful!
                  </p>
                  <span className="badge rounded-pill bg-primary-subtle text-primary">
                    Grade 8 • English
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-chat-quote fs-4 text-primary"></i>
                    <h5 className="card-title mb-0">“Helped Me Improve”</h5>
                  </div>
                  <p className="card-text text-muted">
                    The IT modules and practice tasks boosted my confidence a
                    lot.
                  </p>
                  <span className="badge rounded-pill bg-primary-subtle text-primary">
                    Grade 11 • IT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-section text-white text-center">
        <div className="container py-5">
          <h2 className="display-6 fw-bold mb-3">
            Start Your Learning Journey Today!
          </h2>
          <p className="lead mb-4">
            Join thousands of learners and improve your skills with{" "}
            <span className="brand">EduBridge</span>.
          </p>
          <Link to="/register" className="btn btn-light btn-lg px-4 shadow-sm">
            Sign Up Now
          </Link>
        </div>
      </section>
    </>
  );
}
