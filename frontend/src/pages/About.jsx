import React from "react";
import "../styles/home.css"; 

export default function About() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center p-6 relative overflow-hidden bg-gray-50 dark:bg-transparent">
      
      {/* Decorative Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-panel max-w-4xl w-full rounded-3xl p-10 md:p-16 relative z-10 text-center flex flex-col items-center">
        
        {/* Entrance Animations */}
        <span className="animate-fade-up text-sm md:text-base font-medium tracking-widest text-indigo-500 uppercase mb-4">
          Welcome to my profile
        </span>

        <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
          Ayush — <br/>
          <span className="gradient-text">Developer & Problem Solver</span>
        </h1>

        <p className="animate-fade-up delay-200 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed mb-10">
          I build web applications that are simple, useful, and thoughtfully designed. Currently diving deep into full-stack development while experimenting with new tools and technologies. I enjoy transforming ideas into real products that people can interact with.
        </p>

        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href="https://github.com/AyushJha-sys"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 block text-center"
          >
            View My Work
          </a>
          <a
            href="mailto:ayushjha0430@gmail.com"
            className="px-8 py-4 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block text-center"
          >
            Let's Connect
          </a>
        </div>

      </div>
    </div>
  );
}
