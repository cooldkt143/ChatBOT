import React, { useState, useEffect, useRef } from "react";
import Header from "./container/Header";
import Body from "./container/Body";
import Footer from "./container/Footer";
import Sidebar from "./container/Sidebar";

export default function Chatbot() {
  const [theme, setTheme] = useState("system");
  const [systemTheme, setSystemTheme] = useState("light");
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [started, setStarted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const chatBodyRef = useRef(null);

  // Detect system theme
  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () =>
      setSystemTheme(darkQuery.matches ? "dark" : "light");

    updateSystemTheme();
    darkQuery.addEventListener("change", updateSystemTheme);
    return () => darkQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  const activeTheme = theme === "system" ? systemTheme : theme;

  // Fetch conversations for sidebar
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/conversations");
        const data = await res.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, [messages, started]);

  // Handle send
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    if (!started) setStarted(true);

    // Optimistic update in UI
    setMessages((prev) => [
      ...prev,
      { role: "user", text: input, file },
      { role: "bot", text: "Thinking...", thinking: true },
    ]);

    try {
      if (!currentConversationId) {
        // First message → create new conversation
        const res = await fetch("http://localhost:5000/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: input,
            firstMessage: { role: "user", text: input },
          }),
        });
        const data = await res.json();
        setCurrentConversationId(data._id);
      } else {
        // Add user message
        await fetch(
          `http://localhost:5000/api/conversations/${currentConversationId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: "user", text: input }),
          }
        );
      }
    } catch (err) {
      console.error("❌ Failed to save message:", err);
    }

    setInput("");
    setFile(null);

    // Simulate bot reply
    setTimeout(async () => {
      const botReply = "This is a bot reply.";

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: botReply,
        };
        return updated;
      });

      if (currentConversationId) {
        await fetch(
          `http://localhost:5000/api/conversations/${currentConversationId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: "bot", text: botReply }),
          }
        );
      }
    }, 1500);
  };

  // Load a conversation from sidebar
  const loadConversation = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/conversations/${id}`);
      const convo = await res.json();
      setMessages(convo.messages);
      setCurrentConversationId(convo._id);
      setStarted(true);
      setSidebarOpen(false);
    } catch (err) {
      console.error("❌ Failed to load conversation:", err);
    }
  };

  return (
    <div
      className={`flex h-screen ${
        activeTheme === "dark"
          ? "bg-black text-white"
          : "bg-green-50 text-black"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        conversations={conversations}
        theme={activeTheme}
        loadConversation={loadConversation}
      />

      {/* Main Section (Header + Body + Footer) */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <Header
          theme={theme}
          setTheme={setTheme}
          started={started}
          systemTheme={systemTheme}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Landing vs Chat */}
        {started ? (
          <>
            {/* Body */}
            <div className="flex-1 overflow-hidden">
              <Body messages={messages} theme={activeTheme} />
            </div>
            {/* Footer */}
            <Footer
              input={input}
              setInput={setInput}
              file={file}
              setFile={setFile}
              handleSend={handleSend}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              theme={activeTheme}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center space-y-12">
            <h1 className="text-4xl md:text-6xl font-bold text-teal-700 dark:text-gray-200 animate-typing">
              Chat-Bot
            </h1>
            <div className="w-[90%] md:w-[70%]">
              <Footer
                input={input}
                setInput={setInput}
                file={file}
                setFile={setFile}
                handleSend={handleSend}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                theme={activeTheme}
                landing={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
