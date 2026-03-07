import { useState, useRef, useEffect } from "react";
import API from "../api/axios";

// =====================================================
// 🤖 AI CHATBOT (Bottom Right Floating Assistant)
// Connected to: POST /api/chatbot/chat
// JWT Protected via axios interceptor
// =====================================================

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { bot: "Hi 👋 I am your AI Internship Assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessages((prev) => [...prev, { user: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/api/chatbot/chat", {
        message: userMessage,
      });

      console.log("Chatbot API Response:", res.data);

      // 🔥 Handle multiple possible backend response keys safely
      const botReply =
        res.data?.reply ||
        res.data?.response ||
        res.data?.message ||
        "I couldn't understand that. Please try again.";

      setMessages((prev) => [...prev, { bot: botReply }]);
    } catch (error) {
      console.error("Chatbot Error:", error.response?.data || error.message);
      setMessages((prev) => [
        ...prev,
        { bot: "⚠ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {open && (
        <div className="bg-white w-80 h-[450px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 font-semibold">
            AI Internship Assistant
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.user ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[75%] text-sm shadow-sm ${
                    msg.user
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                >
                  {msg.user || msg.bot}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500">Typing...</div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about internships..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
      >
        💬
      </button>
    </div>
  );
}
