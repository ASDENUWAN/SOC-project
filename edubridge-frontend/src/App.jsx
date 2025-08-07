// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import CreatorProfile from "./pages/CreatorProfile.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* FIXED: Add * to support nested routing */}
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
          <Route path="/" element={<ProfileRouter />} />
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
