import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResumeUpload from "./pages/ResumeUpload";
import Applications from "./pages/Applications";
import ViewApplicants from "./pages/ViewApplicants";

// Components
import Chatbot from "./components/Chatbot";

// Context
import { AuthContext } from "./context/AuthContext";

// =====================================================
// 🔐 Protected Route Component
// =====================================================

function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}

// =====================================================
// 🚀 MAIN APP ROUTING
// =====================================================

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/upload-resume"
          element={
            <ProtectedRoute role="student">
              <ResumeUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/applications"
          element={
            <ProtectedRoute role="student">
              <Applications />
            </ProtectedRoute>
          }
        />

        {/* Company Routes */}
        <Route
          path="/company"
          element={
            <ProtectedRoute role="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company/applicants/:id"
          element={
            <ProtectedRoute role="company">
              <ViewApplicants />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      {/* Floating AI Chatbot (Visible After Login) */}
      <Chatbot />
    </Router>
  );
}
