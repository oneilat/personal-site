import fs from 'node:fs';

const index = fs.readFileSync('src/pages/projects/index.astro', 'utf8');
const article = fs.readFileSync('src/pages/projects/[slug].astro', 'utf8');
const errors = [];

if (fs.existsSync('src/pages/projects.astro')) errors.push('projects.astro still conflicts with the projects directory');
if (fs.existsSync('src/components/ProjectsRecord.astro')) errors.push('ProjectsRecord still exists');
if (!index.includes('<Layout')) errors.push('Projects left Layout');
if (index.includes('<main')) errors.push('Projects nests a second main');
if (index.includes('ProjectsRecord')) errors.push('Projects still renders the resume record');
if (index.includes('This Website')) errors.push('old project card remains');
if (!index.includes('publishedProjects')) errors.push('index does not list published articles');
if (!index.includes('max-w-2xl')) errors.push('index list is not the editorial measure');
if (!index.includes('>Projects</h1>')) errors.push('missing Projects heading');
if (!index.includes('View My Resume')) errors.push('empty state is missing the resume button');
if (!index.includes('profile.links.resume')) errors.push('resume button does not use profile.links.resume');
if (!index.includes('rel="noopener noreferrer"')) errors.push('resume button does not open safely');
if (index.includes('profile.education')) errors.push('education is still rendered');
if (index.includes('profile.experience')) errors.push('experience is still rendered');
if (!article.includes('getStaticPaths')) errors.push('article route is not static');
if (!article.includes('data.publish')) errors.push('unpublished articles can be built');
if (!article.includes('max-w-prose')) errors.push('article column is not the reading measure');
if (!article.includes('w-[44px]')) errors.push('yellow rule is missing');
if (!article.includes('h-[3px]')) errors.push('yellow rule height is missing');
if (!article.includes('| Aidan O\'Neil')) errors.push('article title suffix is missing');

for (const file of ['src/components/ResumeContent.jsx', 'src/components/SkillsBoard.jsx']) {
  if (fs.existsSync(file)) errors.push(file + ' still exists');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
