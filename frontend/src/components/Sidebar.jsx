import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  return (
    <div 
      className={`flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen p-4 transition-all duration-300 shadow-2xl border-r border-gray-700 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <h2 className="text-2xl font-bold mb-8 drop-shadow-2xl tracking-tight text-white">Menu</h2>

      <ul className="flex-1 space-y-3">
        <li className="group">
          <Link 
            to="/dashboard" 
            className="flex items-center p-4 rounded-xl text-white font-bold text-lg drop-shadow-2xl hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] hover:-translate-x-1 transition-all duration-300"
          >
            <span className={`text-2xl mr-4 drop-shadow-xl transition-transform group-hover:scale-110 ${isCollapsed ? 'mr-0 text-xl' : ''}`}>
              📊
            </span>
            <span className={`${isCollapsed ? 'opacity-0 w-0 -translate-x-4 scale-x-0' : 'opacity-100 translate-x-0 scale-x-100'} text-white`}>
              Dashboard
            </span>
          </Link>
        </li>
        <li className="group">
          <Link 
            to="/products" 
            className="flex items-center p-4 rounded-xl text-white font-bold text-lg drop-shadow-2xl hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] hover:-translate-x-1 transition-all duration-300"
          >
            <span className={`text-2xl mr-4 drop-shadow-xl transition-transform group-hover:scale-110 ${isCollapsed ? 'mr-0 text-xl' : ''}`}>
              📦
            </span>
            <span className={`${isCollapsed ? 'opacity-0 w-0 -translate-x-4 scale-x-0' : 'opacity-100 translate-x-0 scale-x-100'} text-white`}>
              Products
            </span>
          </Link>
        </li>
        <li className="group">
          <Link 
            to="/orders" 
            className="flex items-center p-4 rounded-xl text-white font-bold text-lg drop-shadow-2xl hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] hover:-translate-x-1 transition-all duration-300"
          >
            <span className={`text-2xl mr-4 drop-shadow-xl transition-transform group-hover:scale-110 ${isCollapsed ? 'mr-0 text-xl' : ''}`}>
              📋
            </span>
            <span className={`${isCollapsed ? 'opacity-0 w-0 -translate-x-4 scale-x-0' : 'opacity-100 translate-x-0 scale-x-100'} text-white`}>
              Orders
            </span>
          </Link>
        </li>


        <li className="group">
          <Link 
            to="/expiry" 
            className="flex items-center p-4 rounded-xl text-white font-bold text-lg drop-shadow-2xl hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] hover:-translate-x-1 transition-all duration-300"
          >
            <span className={`text-2xl mr-4 drop-shadow-xl transition-transform group-hover:scale-110 ${isCollapsed ? 'mr-0 text-xl' : ''}`}>
              ⏰
            </span>
            <span className={`${isCollapsed ? 'opacity-0 w-0 -translate-x-4 scale-x-0' : 'opacity-100 translate-x-0 scale-x-100'} text-white`}>
              Expired Products
            </span>
          </Link>
        </li>
        {user?.role === 'admin' && (
          <li className="group">
            <Link 
              to="/admin-users" 
              className="flex items-center p-4 rounded-xl text-white font-bold text-lg drop-shadow-2xl hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] hover:-translate-x-1 transition-all duration-300"
            >
              <span className={`text-2xl mr-4 drop-shadow-xl transition-transform group-hover:scale-110 ${isCollapsed ? 'mr-0 text-xl' : ''}`}>
                👥
              </span>
              <span className={`${isCollapsed ? 'opacity-0 w-0 -translate-x-4 scale-x-0' : 'opacity-100 translate-x-0 scale-x-100'} text-white`}>
                Users
              </span>
            </Link>
          </li>
        )}
      </ul>

      <div className="mt-auto pt-8 border-t border-white/20">
        <button 
          onClick={handleLogout}
          className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-95 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl border border-red-400/50 ring-2 ring-red-500/30 hover:ring-red-600/50 transition-all duration-300 backdrop-blur-md"
        >
          <span className={`mr-4 text-2xl drop-shadow-2xl ${isCollapsed ? 'mr-0' : ''}`}>
            🚪
          </span>
          <span className={`${isCollapsed ? 'opacity-0 w-0 scale-0 -translate-x-2' : 'opacity-100 scale-1 translate-x-0'} text-white`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
