import React from "react";

export default function Header({ theme, setTheme, started, systemTheme, toggleSidebar }) {
  const activeTheme = theme === "system" ? systemTheme : theme;

  return (
    <div
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 transition-all duration-500 z-20
        ${started
          ? activeTheme === "dark"
            ? "bg-gray-900/90 border-b border-blue-700 text-white"
            : "bg-green-300/90 border-b border-green-400 text-black"
          : "bg-transparent text-teal-700 dark:text-gray-200"
        }`}
    >
      {/* Left side: menu button + logo */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
            started
              ? activeTheme === "dark"
                ? "bg-gray-800"
                : "bg-white"
              : "bg-transparent border border-current"
          }`}
        >
          <svg
            className={`w-6 h-6 ${
              started
                ? activeTheme === "dark"
                  ? "fill-white"
                  : "fill-green-800"
                : "fill-current"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
          >
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9z"></path>
          </svg>
        </div>
        <h2 className="font-semibold text-lg">Chat-Bot</h2>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() =>
          setTheme((prev) =>
            prev === "dark" ? "light" : prev === "light" ? "system" : "dark"
          )
        }
        className={`p-2 rounded-full h-10 w-10 transition ${
          activeTheme === "dark"
            ? "bg-blue-800 text-white hover:bg-blue-700"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        <span className="material-symbols-outlined">
          {activeTheme === "dark" ? "dark_mode" : "light_mode"}
        </span>
      </button>
    </div>
  );
}
