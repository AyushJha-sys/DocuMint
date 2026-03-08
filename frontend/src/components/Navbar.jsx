import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-full h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-[100]">

      <div className="text-2xl font-black text-indigo-600 tracking-tighter cursor-pointer" onClick={() => navigate("/home")}>
        DocuMint
      </div>

      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
        <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
        <Link to="/editor" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Editor</Link>
        <Link to="/documents" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Documents</Link>
        <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Me</Link>
        <Link to="/settings" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Settings</Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Credits Pill */}
        <div className="hidden sm:flex items-center bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50">
          <span className="text-xs uppercase font-bold text-indigo-500 dark:text-indigo-400 mr-2">Credits</span>
          <span className="text-sm font-bold text-indigo-700 dark:text-indigo-200">
            {user?.credits ?? 0}
          </span>
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-transparent hover:border-indigo-500/30"
        >
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="hidden lg:block">{user?.name || 'User'}</span>
        </button>

        <button
          onClick={logout}
          className="px-4 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
        >
          Logout
        </button>
      </div>
    </div>
  );
}