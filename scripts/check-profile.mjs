import { profile } from '../src/data/profile.js';

const ids = new Set();
for (const job of profile.experience) {
  for (const stream of job.workstreams ?? []) {
    if (stream.id) ids.add(stream.id);
  }
}
for (const project of profile.projects) {
  if (project.id) ids.add(project.id);
}

const missing = profile.homeProofs.filter((row) => !ids.has(row.id));
if (missing.length > 0) {
  console.error('Missing proof targets: ' + missing.map((row) => row.id).join(', '));
  process.exit(1);
}

const expectedProofs = [
  ['hairgel', 'IMPIRICUS · DATA ENGINEER', 'HAIRGEL', '2026–'],
  ['ion', 'IMPIRICUS · DATA ENGINEER', 'ION', '2026–'],
  ['cartograph', 'IMPIRICUS · DATA ENGINEER', 'Cartograph', '2026–'],
  ['market-phase-transitions', 'SELECTED PROJECT', 'Dynamic Network Modeling', '2025–26'],
];
const actualProofs = profile.homeProofs.map((row) => [row.id, row.kicker, row.title, row.date]);
if (JSON.stringify(actualProofs) !== JSON.stringify(expectedProofs)) {
  console.error('Homepage proofs do not match the approved labels');
  process.exit(1);
}

const text = JSON.stringify(profile);
const required = [
  '14×–130×',
  'pg_cron',
  'SECURITY DEFINER',
  'Walrasian',
  'ω=60',
  '10⁻⁴',
  'ρ ≈ 0.12',
  '82%',
  '70%',
  'HSK 3.5',
  'Shakespeare Club President; Phi Gamma Delta Member',
  'OpenTofu/Terraform',
  'mailto:aidan.oneil@impiricus.com',
  'https://github.com/rhit-oneilat',
  'https://www.linkedin.com/in/aidan-o-neil',
];
const absent = required.filter((phrase) => !text.includes(phrase));
if (absent.length > 0) {
  console.error('Missing approved copy: ' + absent.join(' | '));
  process.exit(1);
}

const counts = {
  impiricus: profile.experience[0].bullets.length,
  hairgel: profile.experience[0].workstreams[0].bullets.length,
  ion: profile.experience[0].workstreams[1].bullets.length,
  cartograph: profile.experience[0].workstreams[2].bullets.length,
  platform: profile.experience[0].workstreams[3].bullets.length,
  booz: profile.experience[1].bullets.length,
  advisory: profile.experience[2].bullets.length,
  awards: profile.awards.length,
  market: profile.projects[0].bullets.length,
  blockchain: profile.projects[1].bullets.length,
  technical: profile.technicalSkills.length,
  additional: profile.additionalSkills.length,
};
const expectedCounts = {
  impiricus: 1,
  hairgel: 4,
  ion: 5,
  cartograph: 3,
  platform: 3,
  booz: 4,
  advisory: 3,
  awards: 2,
  market: 5,
  blockchain: 3,
  technical: 5,
  additional: 3,
};
if (JSON.stringify(counts) !== JSON.stringify(expectedCounts)) {
  console.error('Bullet counts do not match the resume');
  console.error(JSON.stringify(counts));
  process.exit(1);
}
