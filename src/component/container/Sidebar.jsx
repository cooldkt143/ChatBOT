import React from "react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  conversations,
  theme,
  loadConversation,
}) {
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 z-30
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${
            theme === "dark"
              ? "bg-gray-950 text-white"
              : "bg-green-100 text-black"
          }`}
      >
        <div className="p-4 border-b font-semibold text-lg">Conversations</div>
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-3rem)]">
          {conversations.length > 0 ? (
            conversations.map((item) => (
              <div
                key={item._id}
                className={`p-2 rounded cursor-pointer hover:opacity-80 ${
                  theme === "dark" ? "bg-gray-800" : "bg-green-200"
                }`}
                onClick={() => loadConversation(item._id)}
              >
                {item.title}
              </div>
            ))
          ) : (
            <p className="text-sm opacity-70">No conversations yet</p>
          )}
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
