import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import ResumeContent from './ResumeContent.jsx';

export default function HomeComponent() {
  const [P5Sketch, setP5Sketch] = useState(null);

  useEffect(() => {
    import('./P5Sketch.jsx').then((mod) => {
      setP5Sketch(() => mod.default);
    });
  }, []);

  return (
    <div className="relative w-full bg-gruvbox-bg text-gruvbox-fg">
      {/* Background animation - Fixed in background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {P5Sketch ? <P5Sketch /> : null}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4">
        <div className="bg-gruvbox-bg/40 backdrop-blur-sm border border-gruvbox-bg3 p-8 md:p-12 max-w-2xl text-center shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gruvbox-orange">
            Aidan O'Neil
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gruvbox-fg2">
            Mathematician, Data Scientist, and Engineer
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <a
              href="#resume"
              className="px-6 py-3 text-lg bg-gruvbox-orange text-gruvbox-bg0 font-bold hover:shadow-lg transition-all duration-300"
            >
              View My Resume
            </a>
            <a
              href="/projects"
              className="px-6 py-3 text-lg bg-gruvbox-bg1 border border-gruvbox-bg3 font-bold hover:bg-gruvbox-bg2 transition-all duration-300"
            >
              Check Out My Work
            </a>
          </div>
          <div className="mt-6 flex justify-center gap-6">
            <a
              href="https://github.com/yourgithub"
              className="text-gruvbox-fg4 hover:text-gruvbox-fg0 text-3xl transition-colors duration-300"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/aidan-o-neil"
              className="text-gruvbox-fg4 hover:text-gruvbox-fg0 text-3xl transition-colors duration-300"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:oneilat@rose-hulman.edu"
              className="text-gruvbox-fg4 hover:text-gruvbox-fg0 text-3xl transition-colors duration-300"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-10 animate-bounce text-gruvbox-yellow text-4xl hover:text-gruvbox-orange transition-colors duration-300 cursor-pointer focus:outline-none"
          aria-label="Scroll to Resume"
        >
          <FaChevronDown />
        </button>
      </div>

      {/* Resume Content Integrated Below */}
      <ResumeContent />
    </div>
  );
}
