import { useEffect, useState } from "react";
import API from "../api/axios";
import InternshipCard from "../components/InternshipCard";
import Sidebar from "../components/Sidebar";

// =====================================================
// 🎓 STUDENT DASHBOARD
// Connected to:
// GET /api/student/recommendations
// GET /api/student/applications
// =====================================================

export default function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/student/recommendations");

      // Backend may return {recommendations: [...]} OR direct array
      const data = res.data.recommendations || res.data;
      setInternships(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            🎯 Recommended Internships
          </h1>

          <button
            onClick={fetchRecommendations}
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

        {!loading && internships.length === 0 && (
          <div className="text-gray-600">
            No internships found. Upload resume or update skills.
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              refresh={fetchRecommendations}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
