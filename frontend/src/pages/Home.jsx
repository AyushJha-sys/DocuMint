import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css"; 

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center mt-4 relative overflow-hidden bg-gray-50 dark:bg-transparent pb-12">
      
      {/* Decorative Blur */}
      <div className="absolute top-[0%] left-[-5%] w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[30rem] h-[30rem] bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full z-10 flex flex-col gap-12">
        
        {/* Hero Section */}
        <div className="glass-panel rounded-3xl p-10 md:p-16 text-center flex flex-col items-center">
          <span className="animate-fade-up text-sm md:text-base font-medium tracking-widest text-indigo-500 uppercase mb-4">
            Welcome to
          </span>
          <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Docu<span className="gradient-text">Mint</span>
          </h1>
          <p className="animate-fade-up delay-200 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed mb-10">
            A modern, fast, and highly interactive PDF editing and signature platform. 
            Upload, browse, sign, and securely download your documents with a beautifully designed aesthetic. 
            Built for productivity and seamless interactions.
          </p>
          <div className="animate-fade-up delay-300 flex gap-4 w-full sm:w-auto justify-center">
            <Link to="/editor" className="px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 block text-center">
              Go to Editor
            </Link>
          </div>
        </div>

        {/* Developer Intro Section */}
        <div className="animate-fade-up delay-400 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="glass-panel rounded-3xl p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the Developer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
              Hi, I'm <span className="font-semibold text-indigo-500">Ayush Jha</span>. I build web applications that are simple, useful, and thoughtfully designed. 
              DocuMint is a testament to blending clean UI with functional React architecture.
            </p>
            <Link to="/about" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-2 w-max transition-all hover:gap-3">
              Learn more about me <span>&rarr;</span>
            </Link>
          </div>

          <div className="glass-panel rounded-3xl p-10 flex flex-col justify-center items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-3xl font-bold text-white">AJ</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Ayush Jha</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
              Creator & Engineer
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/AyushJha-sys" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                GitHub
              </a>
              <a href="mailto:ayushjha0430@gmail.com" className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                Email
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
