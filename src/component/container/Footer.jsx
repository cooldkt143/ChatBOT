import React, { useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function Footer({
  input,
  setInput,
  file,
  setFile,
  handleSend,
  showEmojiPicker,
  setShowEmojiPicker,
  theme,
  landing = false,
}) {
  const textareaRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFile({
        data: reader.result.split(",")[1],
        mime_type: file.type,
        preview: reader.result,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  return (
    <div
      className={`${
        landing
          ? "w-full flex flex-col items-center"
          : "fixed bottom-4 left-0 w-full flex flex-col items-center px-4"
      }`}
    >
      {/* 📂 File Preview (shows above input) */}
      {file && (
        <div className="mb-3 flex items-center gap-3 w-[95%] md:w-[70%] bg-opacity-70 p-2 rounded-3xl shadow-md border 
          border-gray-300 dark:border-gray-700 
          bg-gray-100 dark:bg-gray-800">
          {file.mime_type.startsWith("image/") ? (
            <img
              src={file.preview}
              alt="preview"
              className="w-20 h-20 object-cover rounded-md"
            />
          ) : (
            <div
              className={`flex items-center justify-center w-20 h-20 rounded-md text-sm font-medium ${
                theme === "dark" ? "bg-gray-700 text-white" : "bg-teal-100 text-teal-700"
              }`}
            >
              📄 {file.name}
            </div>
          )}
          <button
            onClick={() => setFile(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Chat Input Box */}
      <form
        onSubmit={handleSend}
        className={`flex items-end rounded-full border px-3 py-2 gap-2 shadow-lg transition-all duration-500 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-teal-300"
        } ${landing ? "w-[90%] md:w-[70%]" : "w-[95%] md:w-[70%]"}`}
      >
        <textarea
          ref={textareaRef}
          placeholder="Message..."
          className={`flex-1 resize-none outline-none text-sm md:text-lg leading-snug max-h-20 overflow-y-auto ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          required={!file}
        />

        {/* Emoji Button */}
        <button
          type="button"
          className={`flex items-center justify-center h-10 w-10 rounded-full ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
          onClick={() => setShowEmojiPicker((s) => !s)}
        >
          <span className="material-symbols-outlined">mood</span>
        </button>

        {/* File Upload */}
        <label
          className={`flex items-center justify-center h-10 w-10 rounded-full cursor-pointer ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          <span className="material-symbols-outlined">attach_file</span>
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            hidden
            onChange={handleFileChange}
          />
        </label>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() && !file}
          className={`flex items-center justify-center h-10 w-10 rounded-full text-white ${
            input.trim() || file
              ? theme === "dark"
                ? "bg-gray-600 hover:bg-gray-500"
                : "bg-teal-700 hover:bg-teal-800"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-10 z-50">
          <Picker
            data={data}
            onEmojiSelect={(emoji) => setInput((prev) => prev + emoji.native)}
          />
        </div>
      )}
    </div>
  );
}
