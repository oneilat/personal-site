import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { profile } from '../data/profile.js';

export default function HomeComponent() {
  return (
    <div className="text-gruvbox-fg">
      <h1 className="text-4xl md:text-6xl font-bold text-gruvbox-orange">
        Aidan O'Neil
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-gruvbox-fg2">
        Mathematician, Data Scientist, and Engineer
      </p>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <a
          href={profile.links.email}
          className="px-6 py-3 text-lg bg-gruvbox-orange text-gruvbox-bg0 font-bold hover:shadow-lg transition-all duration-300"
        >
          Say Hello
        </a>
        <a
          href={profile.links.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 text-lg bg-gruvbox-bg1 border border-gruvbox-bg3 font-bold hover:bg-gruvbox-bg2 transition-all duration-300"
        >
          View My Resume
        </a>
      </div>
      <div className="mt-6 flex justify-center gap-6">
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gruvbox-fg4 hover:text-gruvbox-fg0 text-3xl transition-colors duration-300"
        >
          <FaGithub />
        </a>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gruvbox-fg4 hover:text-gruvbox-fg0 text-3xl transition-colors duration-300"
        >
          <FaLinkedin />
        </a>
        <a
          href={profile.links.email}
          className="text-gruvbox-fg4 hover:text-gruvbox-fg0 text-3xl transition-colors duration-300"
        >
          <FaEnvelope />
        </a>
      </div>
    </div>
  );
}
