import React, { useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to backend or email service (e.g., Nodemailer/SendGrid)
    console.log("Form submitted:", form);
    setSent(true);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Contact Us</h2>
        <p className="text-muted">
          We’d love to hear from you. Please reach out with any questions or
          feedback.
        </p>
      </div>

      <div className="row g-4">
        {/* Contact Info */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body text-center">
              <i className="bi bi-geo-alt text-primary fs-2 mb-2"></i>
              <h6 className="fw-bold">Our Location</h6>
              <p className="text-muted mb-0">Colombo, Sri Lanka</p>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body text-center">
              <i className="bi bi-envelope text-primary fs-2 mb-2"></i>
              <h6 className="fw-bold">Email Us</h6>
              <a
                href="mailto:info@edubridge.com"
                className="text-decoration-none"
              >
                info@edubridge.com
              </a>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <i className="bi bi-telephone text-primary fs-2 mb-2"></i>
              <h6 className="fw-bold">Call Us</h6>
              <a href="tel:+94112345678" className="text-decoration-none">
                +94 11 234 5678
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {sent ? (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Your message has been sent. We’ll get back to you soon.
                </div>
              ) : (
                <>
                  <h5 className="fw-bold mb-3">Send Us a Message</h5>
                  <form onSubmit={onSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input
                          name="name"
                          className="form-control"
                          placeholder="Your Name"
                          value={form.name}
                          onChange={onChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Your Email"
                          value={form.email}
                          onChange={onChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <input
                        name="subject"
                        className="form-control"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className="mt-3">
                      <textarea
                        name="message"
                        className="form-control"
                        rows="5"
                        placeholder="Your Message"
                        value={form.message}
                        onChange={onChange}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3 px-4">
                      <i className="bi bi-send me-2"></i> Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map (Optional) */}
      <div className="mt-5">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63312.31399212344!2d79.81500535!3d6.9270787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2597d92d0e70d%3A0x4245ddaa92f44e!2sColombo!5e0!3m2!1sen!2slk!4v1661412733324!5m2!1sen!2slk"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
