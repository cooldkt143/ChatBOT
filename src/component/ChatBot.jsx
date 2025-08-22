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
  const [history, setHistory] = useState([]);
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

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5173/api/history");
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [messages]);

  // Handle send
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    if (!started) setStarted(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input, file },
      { role: "bot", text: "Thinking...", thinking: true },
    ]);

    // Save to history
    try {
      await fetch("http://localhost:5000/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input }),
      });
    } catch (err) {
      console.error("❌ Failed to save history:", err);
    }

    setInput("");
    setFile(null);

    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "bot",
          text: "This is a bot reply.",
        };
        return updated;
      });
    }, 1500);
  };

  return (
    <div
      className={`flex h-screen ${
        activeTheme === "dark" ? "bg-black text-white" : "bg-green-50 text-black"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        history={history}
        theme={activeTheme}
      />

      {/* Main Section (Header + Body + Footer together shift) */}
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
