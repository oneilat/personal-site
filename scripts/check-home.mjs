import fs from 'node:fs';

const index = fs.readFileSync('src/pages/index.astro', 'utf8');
const home = fs.readFileSync('src/components/HomeComponent.jsx', 'utf8');
const header = fs.readFileSync('src/components/Header.astro', 'utf8');
const errors = [];

if (!index.includes('<Header />')) errors.push('index is missing Header');
if (!index.includes('publishedProjects')) errors.push('homepage does not read published articles');
if (!index.includes("getCollection('projects')")) errors.push('homepage does not load the projects collection');
if (!index.includes('id="proofs"')) errors.push('index is missing proofs');
if (!index.includes('/projects/${entry.id}')) errors.push('proof links do not use the article slug');
if (!index.includes('showProofs={published.length > 0}')) errors.push('scroll visibility is not tied to published articles');
if (!index.includes('published.length > 0 &&')) errors.push('proof section is not gated on published articles');
if (index.includes('profile.homeProofs')) errors.push('homepage still reads profile.homeProofs');
if (index.includes('/projects#')) errors.push('homepage still links to resume anchors');
if (!header.includes('z-20')) errors.push('header does not sit above the field');
if (home.includes('ResumeContent')) errors.push('homepage still mounts ResumeContent');
if (home.includes('Who I Am')) errors.push('homepage still contains Who I Am');
if (home.includes('Check Out My Work')) errors.push('old secondary button remains');
if (home.includes('yourgithub')) errors.push('placeholder GitHub remains');
if (home.includes('oneilat@rose-hulman.edu')) errors.push('old email remains');
if (!home.includes('profile.links')) errors.push('hero links do not use profile.links');
if (!home.includes('showProofs ?')) errors.push('scroll control renders when nothing is published');
if (!home.includes('aria-label="Scroll to Resume"')) errors.push('scroll control lost its name');
if (!home.includes("getElementById('proofs')")) errors.push('scroll target is not proofs');
if (!home.includes('calc(100svh-4.5rem)')) errors.push('hero does not fit below the header');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
