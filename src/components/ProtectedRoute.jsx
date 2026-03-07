import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// =====================================================
// 🔐 PROTECTED ROUTE (JWT + Role Based Protection)
// Compatible with Flask JWT (identity=sub, role claim)
// =====================================================

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // ⏳ Prevent rendering before auth check completes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  // ✅ Authorized
  return children;
}
