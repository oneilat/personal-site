
import fs from 'node:fs';
import { barClass, publishedProjects } from '../src/data/published-projects.js';

const ordered = publishedProjects([
  { id: 'b', data: { publish: true, order: 2 } },
  { id: 'a', data: { publish: true, order: 1 } },
  { id: 'c', data: { publish: false, order: 0 } },
]);
if (ordered.map((entry) => entry.id).join() !== 'a,b') {
  console.error('publishedProjects filter or sort is wrong');
  process.exit(1);
}

const expected = [
  ['hairgel.md', 'hairgel', 'HAIRGEL', 'IMPIRICUS · DATA ENGINEER', '2026–', 1, 'green'],
  ['ion.md', 'ion', 'ION', 'IMPIRICUS · DATA ENGINEER', '2026–', 2, 'blue'],
  ['cartograph.md', 'cartograph', 'Cartograph', 'IMPIRICUS · DATA ENGINEER', '2026–', 3, 'aqua'],
  ['market-phase-transitions.md', 'market-phase-transitions', 'Dynamic Network Modeling', 'SELECTED PROJECT', '2025–26', 4, 'purple'],
];

function parseArticle(file) {
  const raw = fs.readFileSync('src/content/projects/' + file, 'utf8');
  if (!raw.startsWith('---\n')) {
    return { error: file + ' is missing frontmatter' };
  }
  const end = raw.indexOf('\n---', 4);
  if (end === -1) {
    return { error: file + ' frontmatter does not close' };
  }
  const data = {};
  for (const line of raw.slice(4, end).split('\n')) {
    if (!line.trim()) continue;
    const splitAt = line.indexOf(':');
    const key = line.slice(0, splitAt).trim();
    let value = line.slice(splitAt + 1).trim();
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (/^\d+$/.test(value)) value = Number(value);
    data[key] = value;
  }
  return { id: file.replace(/\.md$/, ''), data, body: raw.slice(end + 4) };
}

function emptyPublishedErrors(entries) {
  return entries
    .filter((entry) => entry.data.publish === true && entry.body.trim() === '')
    .map((entry) => entry.id + ' is published with an empty body');
}

const sampleErrors = emptyPublishedErrors([
  { id: 'sample', data: { publish: true }, body: ' \n\t' },
]);
if (sampleErrors.length !== 1) {
  console.error('empty published body was not rejected');
  process.exit(1);
}
const allowed = emptyPublishedErrors([
  { id: 'draft', data: { publish: false }, body: '' },
  { id: 'live', data: { publish: true }, body: 'A paragraph.' },
]);
if (allowed.length !== 0) {
  console.error('a valid article was rejected');
  process.exit(1);
}

const errors = [];
const config = fs.readFileSync('src/content.config.mjs', 'utf8');
if (!config.includes("z.enum(['green', 'blue', 'aqua', 'purple'])")) {
  errors.push('color enum missing');
}
if (!config.includes('publish: z.boolean()')) errors.push('publish schema missing');

const names = fs.readdirSync('src/content/projects').filter((name) => name.endsWith('.md')).sort();
const expectedNames = expected.map((row) => row[0]).sort();
if (JSON.stringify(names) !== JSON.stringify(expectedNames)) {
  errors.push('project articles are not the four approved files');
}

for (const [file, slug, title, kicker, date, order, color] of expected) {
  const parsed = parseArticle(file);
  if (parsed.error) {
    errors.push(parsed.error);
    continue;
  }
  if (parsed.id !== slug) errors.push(file + ' slug mismatch');
  if (parsed.data.title !== title) errors.push(file + ' title mismatch');
  if (parsed.data.kicker !== kicker) errors.push(file + ' kicker mismatch');
  if (parsed.data.date !== date) errors.push(file + ' date mismatch');
  if (parsed.data.order !== order) errors.push(file + ' order mismatch');
  if (parsed.data.color !== color) errors.push(file + ' color mismatch');
  if (!(parsed.data.color in barClass)) errors.push(file + ' color has no bar');
  errors.push(...emptyPublishedErrors([parsed]));
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
