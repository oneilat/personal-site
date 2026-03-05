import React from 'react';
import SkillsBoard from './SkillsBoard.jsx';

const ResumeContent = () => {
    return (
        <div id="resume" className="relative z-10 w-full max-w-6xl mx-auto px-8 py-24 space-y-32 bg-transparent font-mono">
            {/* My Journey Section - Asymmetric Layout */}
            <section className="flex flex-col md:flex-row gap-12 items-start opacity-0 animate-fade-in transition-opacity duration-1000">
                <div className="relative group w-64 h-64 flex-shrink-0">
                    {/* Dot Matrix Headshot Placeholder */}
                    <div className="absolute inset-0 bg-gruvbox-bg3 border border-gruvbox-bg2 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(circle, #ebdbb2 1px, transparent 1px)',
                                backgroundSize: '4px 4px'
                            }}>
                        </div>
                        <div className="w-full h-full flex items-center justify-center text-gruvbox-gray/30 text-5xl">
                            
                        </div>
                    </div>
                    {/* Decorative bits */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-gruvbox-orange"></div>
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-gruvbox-orange"></div>
                </div>

                <div className="flex-1 space-y-6">
                    <h2 className="text-5xl font-bold text-gruvbox-orange">Who I Am</h2>
                    <div className="space-y-4">
                        <p className="text-2xl leading-relaxed text-gruvbox-fg">
                            I'm <span className="text-gruvbox-yellow">Aidan</span>. I spend most of my time
                            thinking about how to build <span className="text-gruvbox-aqua">elegant systems</span> and
                            solve <span className="text-gruvbox-purple">large-scale data puzzles</span>.
                        </p>
                        <p className="text-lg text-gruvbox-fg2 max-w-2xl">
                            Currently, I'm at Rose-Hulman studying Math and Data Science. Professionally, I'm at Impiricus,
                            where I'm focused on making data move faster and more securely. I'm fascinated
                            by the intersection of mathematical theory and practical AI engineering.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <a href="/resume.pdf" target="_blank" className="px-8 py-4 bg-gruvbox-green text-gruvbox-bg0 font-bold hover:bg-gruvbox-aqua transition-all duration-300">
                            [ My Full Resume ]
                        </a>
                        <a href="mailto:aidan.oneil@impiricus.com" className="px-8 py-4 border-2 border-gruvbox-bg3 text-gruvbox-fg font-bold hover:bg-gruvbox-bg3 transition-all duration-300">
                            Say Hello
                        </a>
                    </div>
                </div>
            </section>

            {/* Education Section */}
            <section className="space-y-16">
                <h2 className="text-3xl font-bold text-gruvbox-yellow inline-block border-b-4 border-gruvbox-yellow/30 pb-2">
                    Education
                </h2>

                <div className="space-y-12">
                    <div className="group relative">
                        <span className="text-sm font-bold text-gruvbox-gray block mb-2">2022 - 2026 (Expected)</span>
                        <h3 className="text-2xl font-bold text-gruvbox-aqua group-hover:text-gruvbox-blue transition-colors">
                            Rose-Hulman Institute of Technology
                        </h3>
                        <p className="text-xl text-gruvbox-fg2 mb-4">
                            B.S. Mathematics & Data Science / Artificial Intelligence
                        </p>
                        <div className="text-lg leading-relaxed text-gruvbox-fg border-l-2 border-gruvbox-bg3 pl-6">
                            Minor in Economics. Focused on the intersection of mathematical theory and practical AI engineering.
                        </div>
                    </div>
                </div>
            </section>

            {/* Professional Life - Main Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <section className="lg:col-span-8 space-y-16">
                    <h2 className="text-3xl font-bold text-gruvbox-yellow inline-block border-b-4 border-gruvbox-yellow/30 pb-2">
                        Professional Life
                    </h2>

                    <div className="space-y-16">
                        <div className="group relative">
                            <span className="text-sm font-bold text-gruvbox-gray block mb-2">Nov 2025 - Present</span>
                            <h3 className="text-2xl font-bold text-gruvbox-green group-hover:text-gruvbox-aqua transition-colors">Impiricus</h3>
                            <p className="text-gruvbox-fg2 mb-4">Data Engineer (Full-Time)</p>
                            <p className="text-lg leading-relaxed text-gruvbox-fg border-l-2 border-gruvbox-bg3 pl-6">
                                I'm building the database architecture and algorithmic tooling that powers our
                                scheduling optimization. Keeping things fast and secure across dozens of services.
                            </p>
                        </div>

                        <div className="group relative">
                            <span className="text-sm font-bold text-gruvbox-gray block mb-2">Summer 2025</span>
                            <h3 className="text-2xl font-bold text-gruvbox-blue group-hover:text-gruvbox-aqua transition-colors">Booz Allen Hamilton</h3>
                            <p className="text-gruvbox-fg2 mb-4">AI Engineering Intern</p>
                            <p className="text-lg leading-relaxed text-gruvbox-fg border-l-2 border-gruvbox-bg3 pl-6">
                                Architected AI deployment frameworks and RAG systems in support of
                                <span className="text-gruvbox-aqua"> US GOV intelligence and national security clients</span>.
                                Focused on high-performance LLM inference across GPU clusters.
                            </p>
                        </div>

                        <div className="group relative">
                            <span className="text-sm font-bold text-gruvbox-gray block mb-2">2023 - 2024</span>
                            <h3 className="text-2xl font-bold text-gruvbox-purple group-hover:text-gruvbox-aqua transition-colors">O'Neil and Yuan Advisory</h3>
                            <p className="text-gruvbox-fg2 mb-4">Co-Founder & Technical Lead</p>
                            <p className="text-lg leading-relaxed text-gruvbox-fg border-l-2 border-gruvbox-bg3 pl-6">
                                Helped <span className="text-gruvbox-orange">non-profits and SMBs</span> modernize their data game.
                                Designed cloud-native infrastructure and automated complex reporting cycles.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Sidebar Column: Extra only */}
                <aside className="lg:col-span-4 space-y-16 bg-gruvbox-bg/30 backdrop-blur-sm p-10 border border-gruvbox-bg3 h-fit">
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-gruvbox-aqua">Beyond Work</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <span className="text-3xl text-gruvbox-orange w-8"></span>
                                <div>
                                    <h4 className="font-bold text-gruvbox-fg">Thespian</h4>
                                    <p className="text-gruvbox-gray">President of Shakespeare Club</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-3xl text-gruvbox-blue w-8"></span>
                                <div>
                                    <h4 className="font-bold text-gruvbox-fg">Polyglot</h4>
                                    <p className="text-gruvbox-gray">Mandarin Chinese (HSK 3.5)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-3xl text-gruvbox-green w-8"></span>
                                <div>
                                    <h4 className="font-bold text-gruvbox-fg">Brother</h4>
                                    <p className="text-gruvbox-gray">Phi Gamma Delta Member</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>

            {/* Toolbox Section - Centered Focus */}
            <section className="space-y-12">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gruvbox-yellow mb-4">My Toolbox</h2>
                    <p className="text-gruvbox-fg2">The languages and technologies I use to build things.</p>
                </div>
                <div className="bg-gruvbox-bg/50 backdrop-blur-lg p-2 border border-gruvbox-bg3 shadow-inner">
                    <SkillsBoard />
                </div>
            </section>
        </div>
    );
};

export default ResumeContent;
