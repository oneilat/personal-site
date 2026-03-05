import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const TerminalIntro = () => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Welcome to my site!";
  const speed = 75;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, speed);

    // Add cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  // Added return statement with JSX for the terminal
  return (
    <div className="bg-black p-4 shadow-lg font-mono text-green-400 max-w-md mx-auto mt-8">
      <div className="flex items-center mb-2">
        <div className="h-3 w-3 bg-red-500 mr-2"></div>
        <div className="h-3 w-3 bg-yellow-500 mr-2"></div>
        <div className="h-3 w-3 bg-green-500"></div>
      </div>
      <div className="p-2">
        <span className="text-white">$ </span>
        {text}
        {showCursor && <span className="animate-pulse">_</span>}
      </div>
      <div className="flex mt-4 justify-center space-x-4">
        <FaGithub className="text-gray-400 hover:text-white cursor-pointer" />
        <FaLinkedin className="text-gray-400 hover:text-white cursor-pointer" />
        <FaEnvelope className="text-gray-400 hover:text-white cursor-pointer" />
      </div>
    </div>
  );
};

export default TerminalIntro;
