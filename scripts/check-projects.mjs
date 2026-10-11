import fs from 'node:fs';

const page = fs.readFileSync('src/pages/projects.astro', 'utf8');
const record = fs.readFileSync('src/components/ProjectsRecord.astro', 'utf8');
const errors = [];

if (!page.includes('<Layout')) errors.push('Projects left Layout');
if (!page.includes('<ProjectsRecord />')) errors.push('Projects does not render ProjectsRecord');
if (page.includes('This Website')) errors.push('old project card remains');
if (page.includes('<main')) errors.push('Projects nests a second main');
if (!record.includes('profile.education')) errors.push('missing education');
if (!record.includes('profile.experience')) errors.push('missing experience');
if (!record.includes('profile.awards')) errors.push('missing awards');
if (!record.includes('profile.projects')) errors.push('missing projects');
if (!record.includes('profile.technicalSkills')) errors.push('missing technical skills');
if (!record.includes('profile.additionalSkills')) errors.push('missing additional skills');
if (!record.includes('stream.id')) errors.push('workstream ids are not rendered');
if (!record.includes('project.id')) errors.push('project ids are not rendered');
if (record.includes('will be detailed here')) errors.push('skill placeholder remains');
if (record.includes('Thespian')) errors.push('old Beyond Work copy remains');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
