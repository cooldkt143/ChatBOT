import React, { useEffect, useRef, useState } from "react";

export default function Body({ messages, theme }) {
  const chatBodyRef = useRef(null);
  const bottomRef = useRef(null); // dummy anchor at bottom
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto scroll on new message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Detect scroll position
  const handleScroll = () => {
    if (!chatBodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;

    // If user is more than 100px away from bottom, show button
    if (scrollHeight - scrollTop - clientHeight > 100) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  // Scroll to bottom on button click
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex-1 ">
      <div
        ref={chatBodyRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto p-4 pt-20 pb-24 flex flex-col gap-3 scrollbar-thin h-full ${
          theme === "dark"
            ? "bg-black text-gray-200 scrollbar-thumb-gray-700"
            : "bg-teal-50 text-gray-900 scrollbar-thumb-transparent"
        }`}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "items-start gap-2"
            }`}
          >
            {msg.role === "bot" && (
              <div
                className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-teal-600 text-white"
                }`}
              >
                🤖
              </div>
            )}
            <div
              className={`px-3 py-2 max-w-[75%] rounded-lg text-sm whitespace-pre-wrap break-words ${
                msg.role === "user"
                  ? theme === "dark"
                    ? "bg-gray-800 text-white rounded-br-sm"
                    : "bg-teal-700 text-white rounded-br-sm"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-200 rounded-bl-sm"
                  : "bg-teal-100 text-gray-900 rounded-bl-sm"
              } ${msg.error ? "text-red-500" : ""}`}
            >
              {msg.thinking ? (
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce delay-300"></span>
                </div>
              ) : (
                msg.text
              )}
            </div>
            {msg.file && msg.file.preview && (
              <img
                src={msg.file.preview}
                alt="attachment"
                className="w-24 rounded-lg mt-1"
              />
            )}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className={`absolute bottom-28 right-6 p-3 rounded-full shadow-lg transition ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          <span className="material-symbols-outlined text-xl">south</span>
        </button>
      )}
    </div>
  );
}
