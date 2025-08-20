import React from "react";

export default function Header({ theme, setTheme }) {
  return (
    <div
      className={`fixed top-0 left-0 w-full flex items-center justify-between p-3 ${
        theme === "dark" ? "bg-gray-900" : "bg-teal-600"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            theme === "dark" ? "bg-gray-700" : "bg-white"
          }`}
        >
          <svg
            className={`w-6 h-6 ${
              theme === "dark" ? "fill-white" : "fill-teal-700"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
          >
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9z"></path>
          </svg>
        </div>
        <h2 className="font-semibold text-lg text-white">Chat-Bot</h2>
      </div>

      {/* Theme Toggle with Material Icons */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`h-10 w-10 flex items-center justify-center rounded-full transition ${
          theme === "dark"
            ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
            : "bg-white text-teal-700 hover:bg-teal-100"
        }`}
      >
        <span className="material-symbols-outlined">
          {theme === "dark" ? "light_mode" : "dark_mode"}
        </span>
      </button>
    </div>
  );
}
