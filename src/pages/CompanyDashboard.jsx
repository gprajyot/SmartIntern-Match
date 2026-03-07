import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import CreateInternshipForm from "../components/CreateInternshipForm";
import { Link } from "react-router-dom";

// =====================================================
// 🏢 COMPANY DASHBOARD (FINAL FIXED VERSION)
// =====================================================

export default function CompanyDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // ✅ Fetch Analytics
  // ================================
  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/api/company/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load company analytics");
    }
  };

  // ================================
  // ✅ Fetch ONLY company internships
  // ================================
  const fetchInternships = async () => {
    try {
      const res = await API.get("/api/company/my-internships");
      setInternships(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load internships");
    }
  };

  // ================================
  // ✅ Load Everything
  // ================================
  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchAnalytics(), fetchInternships()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            🏢 Company Dashboard
          </h1>
          <button
            onClick={loadData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Create Internship */}
        <CreateInternshipForm onCreated={loadData} />

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Internships"
              value={analytics.total_internships}
              color="text-indigo-600"
            />
            <StatCard
              title="Under Review"
              value={analytics.under_review_internships}
              color="text-yellow-500"
            />
            <StatCard
              title="Rejected"
              value={analytics.rejected_internships}
              color="text-red-500"
            />
            <StatCard
              title="Total Applications"
              value={analytics.total_applications}
              color="text-green-600"
            />
          </div>
        )}

        {/* My Internships */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold mb-4">My Internships</h2>

          {internships.length === 0 ? (
            <p className="text-gray-500">No internships created yet.</p>
          ) : (
            <div className="space-y-3">
              {internships.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border p-4 rounded-xl hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.location} • {item.status}
                    </p>
                  </div>

                  <Link
                    to={`/company/applicants/${item.id}`}
                    className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-lg hover:bg-indigo-200 transition text-sm"
                  >
                    View Applicants
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================
// 🔹 Reusable Stat Card
// =====================================
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}