import { useState } from "react";
import API from "../api/axios";

// =====================================================
// 💼 INTERNSHIP CARD COMPONENT
// Fully Compatible with Flask Backend
// Handles:
// - Display internship info
// - Match score
// - Fraud risk badge
// - Apply button (POST /api/student/apply/:id)
// =====================================================

export default function InternshipCard({ internship, refresh }) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    try {
      setLoading(true);
      await API.post(`/api/student/apply/${internship.id}`);
      setApplied(true);
      if (refresh) refresh();
    } catch (error) {
      console.error("Apply Error:", error.response?.data || error.message);
      alert("Failed to apply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-5 flex flex-col justify-between">
      <div>
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800">
          {internship.title}
        </h3>

        {/* Company */}
        {internship.company && (
          <p className="text-sm text-gray-600 mt-1">
            {internship.company}
          </p>
        )}

        {/* Location */}
        {internship.location && (
          <p className="text-xs text-gray-500 mt-1">
            📍 {internship.location}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-700 mt-3 line-clamp-4">
          {internship.description}
        </p>

        {/* Match Score */}
        {internship.match_score !== undefined && (
          <div className="mt-3">
            <span className="text-xs font-semibold text-indigo-600">
              🎯 Match Score: {internship.match_score}%
            </span>
          </div>
        )}

        {/* Fraud Risk */}
        {internship.fraud_risk > 0 && (
          <div className="mt-2">
            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-lg">
              ⚠ Fraud Risk: {internship.fraud_risk}
            </span>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <div className="mt-4">
        {internship.source === "adzuna" ? (
          internship.url ? (
            <a
              href={internship.url}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              View External
            </a>
          ) : null
        ) : (
          <button
            onClick={handleApply}
            disabled={loading || applied}
            className={`w-full py-2 rounded-lg text-white transition ${
              applied
                ? "bg-green-500"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading
              ? "Applying..."
              : applied
              ? "Applied ✓"
              : "Apply Now"}
          </button>
        )}
      </div>
    </div>
  );
}
