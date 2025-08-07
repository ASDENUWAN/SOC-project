import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center py-5">
      <h1>Welcome to EduBridge</h1>
      <p>
        Learn what you need with interactive courses, tutorials and quizzes.
      </p>
      <Link to="/register" className="btn btn-primary">
        Get Started
      </Link>
    </div>
  );
}
