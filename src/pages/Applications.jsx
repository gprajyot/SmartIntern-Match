import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

// =====================================================
// 📂 STUDENT APPLICATIONS PAGE
// Connected to:
// GET /api/student/applications
// =====================================================

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/student/applications");

      // Backend returns { total_applications, applications }
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            📂 My Applications
          </h1>

          <button
            onClick={fetchApplications}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className="text-gray-600">
            You have not applied to any internships yet.
          </div>
        )}

        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.application_id}
              className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {app.internship?.title}
                </h3>
                <p className="text-sm text-gray-600">
                  📍 {app.internship?.location}
                </p>
                {app.internship?.stipend && (
                  <p className="text-sm text-gray-500">
                    💰 {app.internship.stipend}
                  </p>
                )}
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}