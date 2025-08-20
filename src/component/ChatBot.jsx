import React, { useState, useRef, useEffect } from "react";
import Header from "./container/Header";
import Body from "./container/Body";
import Footer from "./container/Footer";

const API_KEY = "AIzaSyBIfF-DDbhZTAUpaMNsrdHFYSr-FgRnZ3A";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
  API_KEY;

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [theme, setTheme] = useState("light");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    if (!started) setStarted(true);

    const userMessage = { role: "user", text: input, file };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setFile(null);

    const thinkingMsg = { role: "bot", text: "...", thinking: true };
    setMessages((prev) => [...prev, thinkingMsg]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            ...messages.map((m) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.text }],
            })),
            { role: "user", parts: [{ text: input }] },
          ],
        }),
      });

      const data = await response.json();
      const apiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Error: No response";

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [...updated, { role: "bot", text: apiText }];
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [...updated, { role: "bot", text: err.message, error: true }];
      });
    } finally {
      scrollToBottom();
    }
  };

  return (
    <div
      className={`flex w-full min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-black text-gray-200" : "bg-teal-50 text-gray-900"
      }`}
    >
      <div className="relative w-full min-h-screen flex flex-col">
        {started ? (
          <>
            {/* Smooth fade-in header */}
            <div className="animate-fadeInDown">
              <Header theme={theme} setTheme={setTheme} />
            </div>

            {/* Body with padding for fixed footer */}
            <div className="flex-1 animate-fadeIn">
              <Body messages={messages} chatBodyRef={chatBodyRef} theme={theme} />
            </div>

            {/* Fixed footer at bottom */}
            <div className="animate-slideUp">
              <Footer
                input={input}
                setInput={setInput}
                file={file}
                setFile={setFile}
                handleSend={handleSend}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                theme={theme}
              />
            </div>
          </>
        ) : (
          // 🚀 Landing page
          <div className="flex flex-col items-center justify-center flex-1 text-center space-y-12">
            <h1 className="text-4xl md:text-6xl font-bold text-teal-700 dark:text-gray-200 animate-typing">
              Chat-Bot
            </h1>

            {/* Centered Footer form (70% width) */}
            <div className="w-[90%] md:w-[70%] animate-fadeInUp">
              <Footer
                input={input}
                setInput={setInput}
                file={file}
                setFile={setFile}
                handleSend={handleSend}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
                theme={theme}
                landing={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
