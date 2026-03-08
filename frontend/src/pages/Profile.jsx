import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Profile() {
  const { user, loading } = useUser();

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Credits Card */}
        <div className="bg-white dark:bg-gray-900/40 dark:backdrop-blur-md border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Available Credits</div>
          <div className={`text-5xl font-extrabold ${(user?.credits || 0) < 100 ? 'text-orange-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
            {user?.credits || 0}
          </div>
        </div>

        {/* Uploads Card */}
        <div className="bg-white dark:bg-gray-900/40 dark:backdrop-blur-md border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">PDFs Uploaded</div>
          <div className="text-5xl font-extrabold text-gray-900 dark:text-white">
            {localStorage.getItem("pdfsUploaded") || 0}
          </div>
        </div>

        {/* Downloads Card */}
        <div className="bg-white dark:bg-gray-900/40 dark:backdrop-blur-md border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">PDFs Signed</div>
          <div className="text-5xl font-extrabold text-gray-900 dark:text-white">
            {user?.signedDocuments || 0}
          </div>
        </div>

      </div>

      {(user?.credits || 0) < 100 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 shadow-lg text-white mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Running low on credits?</h3>
            <p className="text-orange-100 text-lg">
              Unlock unlimited potential! Get a subscription of <span className="font-bold text-white">999 Credits</span> for just <span className="font-bold text-white">$99</span>. Make sure your workflow never stops.
            </p>
          </div>
          <button className="px-8 py-3 bg-white text-orange-600 font-bold rounded-xl shadow-md hover:bg-gray-50 transition-colors shrink-0">
            Upgrade Now
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900/40 dark:backdrop-blur-md border border-gray-200 dark:border-gray-800/50 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">Email</span>
            <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">Display Name</span>
            <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-600 dark:text-gray-400">Plan</span>
            <span className="font-medium text-gray-900 dark:text-white">Pro Subscriber (Unlimited)</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600 dark:text-gray-400">Member Since</span>
            <span className="font-medium text-gray-900 dark:text-white">March 2026</span>
          </div>
        </div>
      </div>

    </div>
  );
}
