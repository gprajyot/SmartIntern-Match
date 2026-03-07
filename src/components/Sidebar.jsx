import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// =====================================================
// 📌 RESPONSIVE ROLE-BASED SIDEBAR (Backend Compatible)
// =====================================================

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  if (!user) return null;

  const isActive = (path) =>
    location.pathname === path
      ? "bg-indigo-600 text-white"
      : "text-gray-600 hover:bg-indigo-100";

  return (
    <div className={`h-screen ${open ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300`}>

      {/* Toggle Button */}
      <div className="flex justify-between items-center p-4 border-b">
        {open && <h2 className="text-lg font-bold text-indigo-600">Dashboard</h2>}
        <button
          onClick={() => setOpen(!open)}
          className="text-indigo-600 font-bold"
        >
          {open ? "◀" : "▶"}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col p-4 gap-2">

        {/* STUDENT LINKS */}
        {user.role === "student" && (
          <>
            <Link
              to="/student"
              className={`p-2 rounded-lg transition ${isActive("/student")}`}
            >
              {open ? "🏠 Dashboard" : "🏠"}
            </Link>

            <Link
              to="/student/upload-resume"
              className={`p-2 rounded-lg transition ${isActive("/student/upload-resume")}`}
            >
              {open ? "📄 Upload Resume" : "📄"}
            </Link>

            <Link
              to="/student/applications"
              className={`p-2 rounded-lg transition ${isActive("/student/applications")}`}
            >
              {open ? "📂 Applications" : "📂"}
            </Link>
          </>
        )}

        {/* COMPANY LINKS */}
        {user.role === "company" && (
          <>
            <Link
              to="/company"
              className={`p-2 rounded-lg transition ${isActive("/company")}`}
            >
              {open ? "🏢 Company Dashboard" : "🏢"}
            </Link>
          </>
        )}

        {/* ADMIN LINKS */}
        {user.role === "admin" && (
          <>
            <Link
              to="/admin"
              className={`p-2 rounded-lg transition ${isActive("/admin")}`}
            >
              {open ? "🛠 Admin Panel" : "🛠"}
            </Link>

            <Link
              to="/admin/stats"
              className={`p-2 rounded-lg transition ${isActive("/admin/stats")}`}
            >
              {open ? "📊 Statistics" : "📊"}
            </Link>

            <Link
              to="/admin/analytics"
              className={`p-2 rounded-lg transition ${isActive("/admin/analytics")}`}
            >
              {open ? "📈 Analytics" : "📈"}
            </Link>

            <Link
              to="/admin/fraud"
              className={`p-2 rounded-lg transition ${isActive("/admin/fraud")}`}
            >
              {open ? "🚨 Fraud Cases" : "🚨"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
