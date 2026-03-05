import { useState } from 'react';

const skills = {
  'Programming Languages': ['Python', 'SQL', 'Rust', 'Go', 'R', 'JavaScript', 'Bash/Zsh', 'LaTeX'],
  'Data Engineering & Infra': ['PostgreSQL', 'MongoDB', 'Redis', 'Apache Spark', 'Kubernetes', 'Docker', 'AWS (S3/Lambda)', 'pgvector'],
  'Machine Learning & AI': ['PyTorch', 'scikit-learn', 'XGBoost', 'LightGBM', 'LangGraph', 'vLLM', 'RAG', 'Transformers'],
  'Advanced Mathematics': ['Spectral Graph Theory', 'Control Theory', 'Network Science', 'Topology', 'Bayesian Inference'],
  'Tools & Visualization': ['Git', 'Neovim', 'Linux/Unix', 'Tableau', 'Plotly', 'React'],
};

export default function SkillsBoard() {
  const [highlighted, setHighlighted] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Gruvbox colors for titles (skipping orange and yellow)
  const gruvboxColors = {
    'Programming Languages': 'text-gruvbox-purple',
    'Data Engineering & Infra': 'text-gruvbox-blue',
    'Machine Learning & AI': 'text-gruvbox-aqua',
    'Advanced Mathematics': 'text-gruvbox-green',
    'Tools & Visualization': 'text-gruvbox-orange',
  };

  return (
    <div className="w-full py-12 px-4 text-gruvbox-fg flex flex-col items-center">
      {/* Selection detail area will now be rendered inline within category groups */}

      {/* Use a wider grid that fills the available space */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category} className="bg-gruvbox-bg p-8 border border-transparent hover:border-gruvbox-bg3 transition-all duration-300 flex flex-col">
            <h3 className={`text-2xl font-bold mb-6 ${gruvboxColors[category]}`}>
              {category}
            </h3>
            <div className="flex flex-wrap gap-4 mb-6">
              {items.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                  className={`px-6 py-3 text-base font-medium transition-all duration-200 ${highlighted === skill || selectedSkill === skill
                    ? 'bg-gruvbox-orange text-gruvbox-bg0'
                    : 'bg-gruvbox-bg3 text-gruvbox-fg'
                    } hover:scale-105 active:scale-95`}
                  onMouseEnter={() => setHighlighted(skill)}
                  onMouseLeave={() => setHighlighted(null)}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Inline Detail View */}
            {selectedSkill && items.includes(selectedSkill) && (
              <div className="animate-fade-in space-y-4 mt-4 pt-6 border-t border-gruvbox-bg3">
                <div className="flex items-center gap-4 text-gruvbox-orange">
                  <span className="text-xl font-bold"></span>
                  <h4 className="text-xl font-bold">{selectedSkill}</h4>
                </div>
                <div className="p-4 bg-gruvbox-bg border-l-4 border-gruvbox-orange/50">
                  <p className="text-base leading-relaxed text-gruvbox-fg">
                    [ Personal experience and technical depth with {selectedSkill} will be detailed here. ]
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="w-3 h-3 bg-gruvbox-orange animate-pulse"></span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-sm text-gruvbox-gray hover:text-gruvbox-fg transition-colors"
                >
                  [ close ]
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
