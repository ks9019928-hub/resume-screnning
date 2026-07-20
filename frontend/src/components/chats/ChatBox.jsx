import { useState } from "react";
import API from "../../services/api";

function ChatBox() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await API.post(
        "/chat",
        {
          question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMessage = {
        sender: "bot",
        text: response.data.answer,
      };

      setMessages((prev) => [...prev, botMessage]);
      setQuestion("");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-semibold mb-5">
        AI Resume Assistant
      </h2>

      <div className="h-80 overflow-y-auto border rounded-xl p-4 bg-gray-50">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.sender === "user"
                ? "text-right"
                : "text-left"
            }`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-xl ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}

      </div>

      <div className="flex gap-3 mt-4">

        <input
          type="text"
          placeholder="Ask anything about the resume..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-3"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl"
        >
          {loading ? "..." : "Send"}
        </button>

      </div>

    </div>
  );
}

export default ChatBox;