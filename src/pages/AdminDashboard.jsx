import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

// =====================================================
// 🛠 ADMIN DASHBOARD
// Connected to:
// GET /api/admin/stats
// GET /api/admin/analytics
// GET /api/admin/fraud-internships
// =====================================================

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [fraudCases, setFraudCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [statsRes, analyticsRes, fraudRes] = await Promise.all([
        API.get("/api/admin/stats"),
        API.get("/api/admin/analytics"),
        API.get("/api/admin/fraud-internships"),
      ]);

      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
      setFraudCases(fraudRes.data.fraud_cases || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            🛠 Admin Dashboard
          </h1>

          <button
            onClick={fetchAdminData}
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

        {/* ======= STATS CARDS ======= */}
        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.total_users} color="text-indigo-600" />
            <StatCard title="Students" value={stats.total_students} color="text-green-600" />
            <StatCard title="Companies" value={stats.total_companies} color="text-purple-600" />
            <StatCard title="Internships" value={stats.total_internships} color="text-orange-600" />
          </div>
        )}

        {/* ======= ANALYTICS ======= */}
        {analytics && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">

            {/* Role Distribution */}
            <AnalyticsCard title="Role Distribution">
              {Object.entries(analytics.role_distribution || {}).map(
                ([role, count]) => (
                  <div key={role} className="flex justify-between py-1 text-sm">
                    <span className="capitalize">{role}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                )
              )}
            </AnalyticsCard>

            {/* Industry Distribution */}
            <AnalyticsCard title="Industry Distribution">
              {Object.entries(analytics.industry_distribution || {}).map(
                ([industry, count]) => (
                  <div key={industry} className="flex justify-between py-1 text-sm">
                    <span>{industry}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                )
              )}
            </AnalyticsCard>
          </div>
        )}

        {/* ======= FRAUD INTERNSHIPS ======= */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-4 text-red-600">
            🚨 Fraud / Under Review Internships
          </h3>

          {fraudCases.length === 0 ? (
            <p className="text-gray-600">No fraud cases found.</p>
          ) : (
            <div className="space-y-3">
              {fraudCases.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 rounded-xl bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {item.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= Helper Components =================

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function AnalyticsCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-gray-700 font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
