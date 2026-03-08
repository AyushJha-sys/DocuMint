import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/bulb.css";
import { useUser } from "../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Settings() {
  const { user, updateName, loading: userLoading } = useUser();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [pulling, setPulling] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync newName when user data is loaded for the first time
  useEffect(() => {
    if (user && !newName) setNewName(user.name);
  }, [user, newName]);

  const toggleTheme = () => {
    setPulling(true); // Start pull animation

    setTimeout(() => {
      const isDarkModeNow = document.documentElement.classList.toggle("dark");
      setIsDark(isDarkModeNow);
      localStorage.setItem("theme", isDarkModeNow ? "dark" : "light");
    }, 200); // Switch theme at the bottom of the pull

    setTimeout(() => {
      setPulling(false);
    }, 400); // Reset animation state
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    const result = await updateName(newName);
    if (result.success) {
      toast.success("Name updated successfully!");
    } else {
      toast.error(result.error);
    }
    setIsSaving(false);
  };



  return (
    <div className="max-w-4xl mx-auto w-full">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      {userLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Account & Credits */}
        <div className="space-y-8">
          
          {/* Account Section */}
          <div className="bg-white dark:bg-gray-900/40 dark:backdrop-blur-md border border-gray-200 dark:border-gray-800/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input type="email" value={user?.email || ""} disabled className="w-full p-2.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed" />
              </div>
            </div>
            
            <button 
              onClick={handleSaveName}
              disabled={isSaving}
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Credits Section */}
          <div className="bg-white dark:bg-gray-900/40 dark:backdrop-blur-md border border-gray-200 dark:border-gray-800/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Billing & Credits</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Manage your DocuMint subscription and view your current credit balance.</p>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/80 mb-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Current Balance</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.credits || 0}
                </div>
              </div>
              <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors dark:text-white">
                View History
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Appearance & Bulb */}
        <div className="bg-white dark:bg-gray-900/40 dark:backdrop-blur-md border border-gray-200 dark:border-gray-800/50 rounded-2xl p-8 shadow-sm flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 w-full text-left">Appearance</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12 text-sm w-full text-left">Pull the wire to toggle between Light and Dark mode.</p>
          
          {/* Bulb Container */}
          <div className="bulb-container">
            {/* The wire connects to the top of the container, pulling stretches it down */}
            <div 
              className={`bulb-wire ${pulling ? 'h-[120px]' : 'h-[80px]'}`} 
            ></div>
            
            <div 
              className={`flex flex-col items-center z-20 cursor-pointer ${pulling ? 'translate-y-5' : ''} transition-transform duration-200`}
              onClick={toggleTheme}
            >
              <div className="bulb-base"></div>
              {/* Bulb is ON in Light mode (!isDark), OFF in Dark mode (isDark) */}
              <div className={`bulb ${!isDark ? 'on' : 'off'}`}></div>
            </div>
          </div>

          <div className="mt-16 text-center font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-6 py-2 rounded-full">
            Currently: {isDark ? 'Dark Mode (Off)' : 'Light Mode (On)'}
          </div>

        </div>

      </div>
      )}
    </div>
  );
}