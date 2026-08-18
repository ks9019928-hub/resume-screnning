import { useState } from "react";
import { chatWithResume } from "../../services/api";

function ChatBox({ resumeId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    // --------------------------------------------------------
    // Resume validation
    // --------------------------------------------------------

    if (!resumeId) {
      setError(
        "Please analyze a resume first before using the AI assistant."
      );
      return;
    }

    // --------------------------------------------------------
    // Add user message immediately
    // --------------------------------------------------------

    const userMessage = {
      sender: "user",
      text: trimmedQuestion,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setQuestion("");
    setError("");
    setLoading(true);

    try {
      // ------------------------------------------------------
      // Call backend chatbot API
      // ------------------------------------------------------

      const response = await chatWithResume(
        resumeId,
        trimmedQuestion
      );

      // ------------------------------------------------------
      // Add AI response
      // ------------------------------------------------------

      const botMessage = {
        sender: "bot",
        text:
          response?.answer ||
          "I couldn't generate a response.",
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

    } catch (err) {
      console.error(
        "Chatbot error:",
        err
      );

      const backendMessage =
        err?.response?.data?.detail ||
        "Unable to connect to the AI assistant.";

      setError(
        backendMessage
      );

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: backendMessage,
        },
      ]);

    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // ENTER KEY
  // ==========================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="mb-5">

        <h2 className="text-2xl font-semibold">
          AI Resume Assistant
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Ask questions about your resume, ATS score,
          skills, experience, or improvements.
        </p>

      </div>


      {/* ================================================== */}
      {/* CHAT AREA */}
      {/* ================================================== */}

      <div className="h-80 overflow-y-auto border rounded-xl p-4 bg-gray-50">

        {/* Empty state */}

        {messages.length === 0 && (

          <div className="h-full flex items-center justify-center text-center">

            <div>

              <p className="text-gray-600 font-medium">
                👋 Ask me anything about your resume
              </p>

              <p className="text-gray-400 text-sm mt-2">
                Try:
              </p>

              <div className="text-gray-400 text-sm mt-1 space-y-1">

                <p>
                  "How can I improve my experience section?"
                </p>

                <p>
                  "What skills am I missing?"
                </p>

                <p>
                  "How can I improve my ATS score?"
                </p>

              </div>

            </div>

          </div>
        )}


        {/* Messages */}

        {messages.map(
          (msg, index) => (

            <div
              key={index}
              className={`mb-4 flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[80%] px-4 py-3 rounded-xl whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >

                {msg.text}

              </div>

            </div>

          )
        )}


        {/* Loading */}

        {loading && (

          <div className="flex justify-start mb-4">

            <div className="bg-gray-200 text-gray-600 px-4 py-3 rounded-xl">

              <span>
                AI is thinking...
              </span>

            </div>

          </div>

        )}

      </div>


      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (

        <div className="mt-3 text-sm text-red-600">
          {error}
        </div>

      )}


      {/* ================================================== */}
      {/* INPUT */}
      {/* ================================================== */}

      <div className="flex gap-3 mt-4">

        <input
          type="text"
          placeholder="Ask anything about the resume..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />

        <button
          onClick={sendMessage}
          disabled={
            loading ||
            !question.trim() ||
            !resumeId
          }
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 rounded-xl transition"
        >

          {loading
            ? "..."
            : "Send"}

        </button>

      </div>

    </div>
  );
}

export default ChatBox;