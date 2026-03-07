import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// =============================================
// 🌟 RESPONSIVE NAVBAR (Role-Based + Modern UI)
// =============================================

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // Hide navbar on login/register pages

  const handleDashboardRedirect = () => {
    if (user.role === "student") navigate("/student");
    if (user.role === "company") navigate("/company");
    if (user.role === "admin") navigate("/admin");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
        {/* Logo / Brand */}
        <div
          onClick={handleDashboardRedirect}
          className="text-xl font-bold cursor-pointer tracking-wide hover:scale-105 transition"
        >
          AI Internship Platform
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium">

          {user.role === "student" && (
            <>
              <Link to="/student" className="hover:text-gray-200 transition">
                Dashboard
              </Link>
              <Link to="/student/upload-resume" className="hover:text-gray-200 transition">
                Upload Resume
              </Link>
              <Link to="/student/applications" className="hover:text-gray-200 transition">
                Applications
              </Link>
            </>
          )}

          {user.role === "company" && (
            <>
              <Link to="/company" className="hover:text-gray-200 transition">
                Dashboard
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <>
              <Link to="/admin" className="hover:text-gray-200 transition">
                Admin Panel
              </Link>
            </>
          )}

          {/* User Info */}
          <div className="flex items-center gap-4 border-l border-white/30 pl-4">
            <span className="hidden md:block text-xs opacity-80">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="bg-white text-indigo-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
