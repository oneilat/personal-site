import { profile } from '../src/data/profile.js';

const errors = [];
if (profile.links.email !== 'mailto:aidan.oneil@impiricus.com') errors.push('email changed');
if (profile.links.resume !== '/resume.pdf') errors.push('resume link changed');
if (profile.links.github !== 'https://github.com/rhit-oneilat') errors.push('github changed');
if (profile.links.linkedin !== 'https://www.linkedin.com/in/aidan-o-neil') errors.push('linkedin changed');

for (const key of ['homeProofs', 'education', 'experience', 'awards', 'projects', 'technicalSkills', 'additionalSkills']) {
  if (key in profile) errors.push('profile still exports ' + key);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
