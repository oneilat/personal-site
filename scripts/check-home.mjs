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
if (layout.includes('opacity-40')) errors.push('field is still dimmed');
if (!layout.includes('opacity-100')) errors.push('field wrapper is not fully opaque');
if (!layout.includes('w-[88%]')) errors.push('phone content is not in the open corridor');
if (!layout.includes('md:w-[56%]')) errors.push('desktop content is not in the open corridor');
if (!layout.includes('astro:before-preparation')) errors.push('layout does not delay navigation while the field opens');
if (!layout.includes('astro:after-swap')) errors.push('layout does not close the field after returning home');
if (!layout.includes('animateOpening')) errors.push('layout does not animate the opening');
if (!layout.includes('pathname === \'/\'')) errors.push('layout does not detect the homepage');
if (!layout.includes('!isHome')) errors.push('home mark is not limited to non-home pages');
if (!layout.includes('aria-label="Home"')) errors.push('home mark has no accessible name');
if (!layout.includes('>~/</a>')) errors.push('home mark text is missing');
if (!layout.includes('<TopoField')) errors.push('layout does not render the field');

const sketch = fs.readFileSync('src/components/P5Sketch.jsx', 'utf8');
if (!sketch.includes('placedX')) errors.push('sketch does not place contour dots');
if (!sketch.includes('getOpening')) errors.push('sketch does not read the opening');
if (!sketch.includes("console.log('Drawing contour at level:'")) errors.push('contour log was removed');
if (!sketch.includes('level: -50')) errors.push('contour levels changed');
if (!fs.existsSync('src/data/field-opening.js')) {
  errors.push('field opening module is missing');
} else {
  const opening = fs.readFileSync('src/data/field-opening.js', 'utf8');
  if (!opening.includes('700')) errors.push('opening duration is not 700 milliseconds');
  if (!opening.includes('3 - 2 * t')) errors.push('opening clock is not smoothstep');
  if (!opening.includes('prefers-reduced-motion')) errors.push('reduced motion is not handled');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
