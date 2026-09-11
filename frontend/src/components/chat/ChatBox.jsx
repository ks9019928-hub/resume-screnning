import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { chatWithResume } from "../../services/api";

const QUICK_PROMPTS = [
  "How can I improve my ATS score to 90%+?",
  "Rewrite my top experience bullets with strong action verbs & metrics.",
  "What critical missing skills should I add for this position?",
  "Generate 3 tough technical interview questions tailored to my resume.",
];

function ChatBox({ resumeId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendPrompt = (text) => {
    setQuestion(text);
    sendCustomMessage(text);
  };

  const sendCustomMessage = async (queryText) => {
    const trimmed = (queryText || question).trim();
    if (!trimmed || loading) return;

    if (!resumeId) {
      setError("Please analyze a resume first to chat with the AI career assistant.");
      return;
    }

    const userMsg = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setError("");
    setLoading(true);

    try {
      const response = await chatWithResume(resumeId, trimmed);
      const botMsg = {
        sender: "bot",
        text:
          response?.answer ||
          "I've analyzed your resume and provided recommendations above.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      const backendMessage =
        err?.response?.data?.detail ||
        "Unable to reach the AI assistant. Please ensure your Gemini API key is configured.";
      setError(backendMessage);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: backendMessage, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendCustomMessage();
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden mt-8 relative"
    >
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-md">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              AI Resume & Career Copilot
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Online
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Ask any question about your resume phrasing, keyword additions, or interview prep
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="p-6">
        <div className="h-96 overflow-y-auto border border-slate-800/80 rounded-2xl p-4 bg-slate-900/40 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3 shadow-lg shadow-indigo-950/50">
                <Sparkles size={24} />
              </div>
              <h3 className="text-sm font-bold text-white">
                How can I help optimize your resume?
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Select a quick prompt below or type your custom question to get tailored feedback.
              </p>

              {/* Quick Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 max-w-xl w-full">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, y: -1 }}
                    type="button"
                    onClick={() => handleSendPrompt(prompt)}
                    className="text-left text-xs text-slate-300 bg-slate-900/80 hover:bg-indigo-950/40 hover:text-white hover:border-indigo-500/40 border border-slate-800 rounded-2xl p-3.5 transition-all shadow-md flex items-start gap-2"
                  >
                    <HelpCircle size={14} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span>{prompt}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 rounded-tr-none"
                        : msg.isError
                        ? "bg-rose-950/40 text-rose-300 border border-rose-500/40 rounded-tl-none"
                        : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap shadow-md"
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.sender === "bot" && !msg.isError && (
                      <button
                        onClick={() => copyToClipboard(msg.text, index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                        title="Copy response"
                      >
                        {copiedIndex === index ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User size={16} />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2.5">
                <div className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
                <span>AI Copilot is analyzing your resume query...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {error && (
          <div className="mt-3 text-xs text-rose-400 flex items-center gap-1.5">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex gap-2.5 mt-4">
          <input
            type="text"
            placeholder="Ask anything (e.g. 'How can I rewrite my summary to target Senior Backend roles?')..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 border border-slate-800 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 bg-slate-900/70 focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />

          <button
            onClick={() => sendCustomMessage()}
            disabled={loading || !question.trim() || !resumeId}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/30 disabled:shadow-none disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send size={15} />
            <span className="hidden sm:inline">Ask Copilot</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ChatBox;