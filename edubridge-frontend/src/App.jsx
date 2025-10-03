// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import "./index.css";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import CourseCatalog from "./pages/CourseCatalog.jsx";
import CourseView from "./pages/CourseView.jsx";
import CreatorsView from "./pages/PublicCreators.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import StudentProfile from "./pages/profiles/StudentProfile.jsx";
import CreatorProfile from "./pages/profiles/CreatorProfile.jsx";
import AdminProfile from "./pages/profiles/AdminProfile.jsx";

import ManageStudents from "./pages/admin/ManageStudents.jsx";
import ManageCreators from "./pages/admin/ManageCreators.jsx";
import ManageCourses from "./pages/admin/ManageCourses.jsx";
import CourseManagement from "./pages/creator/CourseManagement.jsx";

// NEW
import MyEnrollments from "./pages/MyEnrollments.jsx";
import CreatorInsights from "./pages/creator/CreatorInsights.jsx";
import CreatorLearners from "./pages/creator/CreatorLearners.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="container-fluid main-with-fixed-footer">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/creators" element={<CreatorsView />} />
            <Route path="/course/:id" element={<CourseView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/profile/*"
              element={
                <Protected>
                  <ProfileLayout />
                </Protected>
              }
            />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

function Protected({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function ProfileLayout() {
  return (
    <div className="row">
      <aside className="col-md-3 col-lg-2 p-0">
        <Sidebar />
      </aside>

      <main className="col-md-9 col-lg-10 p-4">
        <Routes>
          <Route path="" element={<ProfileRouter />} />

          {/* student */}
          <Route path="my-courses" element={<MyEnrollments />} />

          {/* creator */}
          <Route path="courses" element={<CourseManagement />} />
          <Route path="courses/insights" element={<CreatorInsights />} />
          <Route
            path="courses/:courseId/learners"
            element={<CreatorLearners />}
          />

          {/* admin */}
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-creators" element={<ManageCreators />} />
          <Route path="manage-courses" element={<ManageCourses />} />
        </Routes>
      </main>
    </div>
  );
}

function ProfileRouter() {
  const { user } = React.useContext(AuthContext);
  if (user?.role === "creator") return <CreatorProfile />;
  if (user?.role === "admin") return <AdminProfile />;
  return <StudentProfile />;
}
