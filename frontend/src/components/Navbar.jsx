import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="navbar-app p-4 flex justify-between items-center relative transition-colors duration-300">
<h1 className="text-xl font-semibold text-white dark:text-slate-100">Inventory System</h1>
      {user && (
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="flex items-center justify-center w-11 h-11 rounded-full border border-slate-300 bg-slate-100 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-sm"
            >
              <span>👤</span>
              <span>{user.name}</span>
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div className="surface-app rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 border border-[var(--border-color)]">
              <div className="p-8 text-center border-b border-[var(--border-color)]">
                <button
                  className="absolute top-6 right-6 text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white text-2xl"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {(() => {
                      const names = user.name.trim().split(' ');
                      return names.length >= 2
                        ? `${names[0][0].toUpperCase()}${names[names.length - 1][0].toUpperCase()}`
                        : user.name.charAt(0).toUpperCase();
                    })()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Profile</h2>
              </div>
              <div className="p-8 space-y-4 text-slate-900 dark:text-slate-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs font-medium">Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs font-medium">Email</p>
                    <p className="font-semibold break-all">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs font-medium">Last Login</p>
                    <p className="font-semibold">{formatDate(user.lastLogin)}</p>
                  </div>
                  {user.role && (
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs font-medium">Role</p>
                      <p className="font-semibold">{user.role}</p>
                    </div>
                  )}
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
