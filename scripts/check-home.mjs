import fs from 'node:fs';

const index = fs.readFileSync('src/pages/index.astro', 'utf8');
const home = fs.readFileSync('src/components/HomeComponent.jsx', 'utf8');
const layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');
const errors = [];

if (!fs.existsSync('src/components/Header.astro')) errors.push('Header.astro was deleted');
if (index.includes('<Header')) errors.push('homepage still renders Header');
if (layout.includes('<Header')) errors.push('layout still renders Header');
if (!index.includes('publishedProjects')) errors.push('homepage does not read published articles');
if (!index.includes("getCollection('projects')")) errors.push('homepage does not load the projects collection');
if (!index.includes('id="proofs"')) errors.push('index is missing proofs');
if (!index.includes('/projects/${entry.id}')) errors.push('proof links do not use the article slug');
if (!index.includes('published.length > 0 &&')) errors.push('proof section is not gated on published articles');
if (index.includes('profile.homeProofs')) errors.push('homepage still reads profile.homeProofs');
if (index.includes('/projects#')) errors.push('homepage still links to resume anchors');
if (!index.includes('fullBleed')) errors.push('homepage is not full bleed');
if (!index.includes('min-h-svh')) errors.push('intro does not fill the screen');
if (!index.includes('href="/projects"')) errors.push('Projects link is missing');
if (!index.includes('>Projects</a>')) errors.push('Projects link text is missing');
if (!index.includes('animate-bounce')) errors.push('Projects link does not bounce');
if (!index.includes('text-2xl')) errors.push('Projects link is not the specified size');
if (!index.includes('transition:name="stage"')) errors.push('intro card has no stage name');
if (index.includes('Scroll to Resume')) errors.push('scroll control remains on the homepage');
if (home.includes('ResumeContent')) errors.push('homepage still mounts ResumeContent');
if (home.includes('Who I Am')) errors.push('homepage still contains Who I Am');
if (home.includes('Check Out My Work')) errors.push('old secondary button remains');
if (home.includes('yourgithub')) errors.push('placeholder GitHub remains');
if (home.includes('oneilat@rose-hulman.edu')) errors.push('old email remains');
if (!home.includes('profile.links')) errors.push('hero links do not use profile.links');
if (home.includes('P5Sketch')) errors.push('sketch is still mounted by the intro');
if (home.includes('Scroll to Resume')) errors.push('scroll name remains in the intro');
if (home.includes('FaChevronDown')) errors.push('scroll icon remains');
if (!layout.includes('<ClientRouter />')) errors.push('layout is missing the client router');
if (!layout.includes('transition:persist="topo"')) errors.push('field is not persisted');
if (!layout.includes('opacity-40')) errors.push('off-home field is not dimmed');
if (!layout.includes('opacity-100')) errors.push('homepage field is not fully opaque');
if (!layout.includes('pathname === \'/\'')) errors.push('layout does not detect the homepage');
if (!layout.includes('!isHome')) errors.push('home mark is not limited to non-home pages');
if (!layout.includes('aria-label="Home"')) errors.push('home mark has no accessible name');
if (!layout.includes('>~/</a>')) errors.push('home mark text is missing');
if (!layout.includes('<TopoField')) errors.push('layout does not render the field');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
