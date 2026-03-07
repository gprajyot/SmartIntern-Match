import { useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

// =====================================================
// 📄 RESUME UPLOAD PAGE
// Connected to:
// POST /api/student/upload-resume
// Backend expects: form-data with key "resume"
// =====================================================

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select a resume file (PDF).");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await API.post(
        "/api/student/upload-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data.resume_data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Resume upload failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          📄 Upload Resume
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-md max-w-xl">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Upload & Analyze"}
            </button>
          </form>
        </div>

        {/* Analysis Result */}
        {result && (
          <div className="bg-white p-6 rounded-2xl shadow-md mt-6 max-w-3xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">
              📊 Resume Analysis Result
            </h2>

            {result.score !== undefined && (
              <p className="mb-2">
                <strong>Resume Score:</strong> {result.score}/100
              </p>
            )}

            {result.skills && (
              <div className="mb-3">
                <strong>Extracted Skills:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.experience && (
              <p className="mb-2">
                <strong>Experience:</strong> {result.experience} years
              </p>
            )}

            {result.education && (
              <p>
                <strong>Education:</strong> {result.education}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
