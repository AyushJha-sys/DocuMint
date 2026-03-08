import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          &copy; {new Date().getFullYear()} DocuMint. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="/home" className="hover:text-indigo-500 transition-colors">Home</a>
          <a href="/about" className="hover:text-indigo-500 transition-colors">About Me</a>
          <a href="https://github.com/AyushJha-sys" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
