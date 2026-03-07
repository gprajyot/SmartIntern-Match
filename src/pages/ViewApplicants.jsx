import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

// =====================================================
// 👥 VIEW APPLICANTS PAGE (COMPANY)
// Connected to:
// GET  /api/company/applicants/:internship_id
// PUT  /api/company/application/:application_id
// =====================================================

export default function ViewApplicants() {
  const { id } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/company/applicants/${id}`);
      setApplicants(res.data.applicants || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await API.put(`/api/company/application/${applicationId}`, {
        status,
      });
      fetchApplicants();
    } catch (err) {
      console.error(err);
      alert("Failed to update application status");
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const getStatusBadge = (status) => {
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
            👥 Internship Applicants
          </h1>

          <button
            onClick={fetchApplicants}
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

        {!loading && applicants.length === 0 && (
          <div className="text-gray-500">
            No students have applied yet.
          </div>
        )}

        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app.application_id}
              className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {app.student_email}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${getStatusBadge(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>

              {app.status === "pending" && (
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      updateStatus(app.application_id, "accepted")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(app.application_id, "rejected")
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
