# Project Articles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Projects résumé wall with four empty Markdown articles that stay hidden until `publish: true`.

**Architecture:** Astro loads `src/content/projects/*.md` through one content collection. `publishedProjects` is the only filter and sort shared by the homepage and the Projects index. Article pages are generated only for published entries, so an unpublished slug is a normal 404. `profile.js` keeps contact links and nothing else.

**Tech Stack:** Astro 5.4 content collections (`astro:content`, `astro/loaders`, `astro/zod`), React 19, Tailwind CSS 3, existing Gruvbox tokens. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-11-project-articles-design.md`

## Global Constraints

- Visible words stay inside the approved introduction, "Say Hello", "View My Resume", the header labels, the four project labels, and the heading "Projects".
- Do not add a draft, summary, or "coming soon" sentence. Article bodies stay empty.
- Do not parse `public/resume.tex`. Leave `public/resume.tex` and `public/resume.pdf` untouched.
- Do not edit `src/styles/global.css`, `tailwind.config.js`, `src/components/P5Sketch.jsx`, `src/components/Header.astro`, `Footer.astro`, `TerminalIntro.jsx`, `SkillsNetwork.jsx`, `Welcome.astro`, or `ResumeSection.astro`.
- Keep square corners, JetBrains Mono, and the Gruvbox palette.
- The topographic field stays on the homepage only.
- Slugs are `hairgel`, `ion`, `cartograph`, and `market-phase-transitions`.
- Email is `mailto:aidan.oneil@impiricus.com`. Resume href is `/resume.pdf`. GitHub is `https://github.com/rhit-oneilat`. LinkedIn is `https://www.linkedin.com/in/aidan-o-neil`.
- GitHub, LinkedIn, and the résumé PDF open in a new tab with `rel="noopener noreferrer"`.
- The scroll control's accessible name stays `Scroll to Resume`.
- Dates use an en dash (`–`, U+2013), not a hyphen.

## File map

- Create `src/content/projects/hairgel.md`, `ion.md`, `cartograph.md`, and `market-phase-transitions.md`: approved frontmatter and empty bodies.
- Create `src/content.config.mjs`: the `projects` collection schema.
- Create `src/data/published-projects.js`: `publishedProjects(entries)` and `barClass`.
- Create `scripts/check-articles.mjs`: labels, slugs, and the empty-published-body rule.
- Modify `package.json`: add the article check to `npm run check`.
- Modify `src/data/profile.js`: keep `links` only.
- Modify `scripts/check-profile.mjs`: assert the four links and reject the removed résumé fields.
- Modify `src/pages/index.astro`: proof rows come from published articles.
- Modify `src/components/HomeComponent.jsx`: accept `showProofs` and hide the scroll control when it is false.
- Delete `src/pages/projects.astro`.
- Create `src/pages/projects/index.astro`: editorial index and empty state.
- Create `src/pages/projects/[slug].astro`: published article page.
- Delete `src/components/ProjectsRecord.astro`.
- Modify `scripts/check-home.mjs` and `scripts/check-projects.mjs` to match the new pages.

---

### Task 1: Article files and the publish check

**Files:**
- Create: `src/data/published-projects.js`
- Create: `src/content.config.mjs`
- Create: `src/content/projects/hairgel.md`
- Create: `src/content/projects/ion.md`
- Create: `src/content/projects/cartograph.md`
- Create: `src/content/projects/market-phase-transitions.md`
- Create: `scripts/check-articles.mjs`
- Modify: `package.json`
- Test: `scripts/check-articles.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `publishedProjects(entries)` returns the entries whose `data.publish === true`, sorted by ascending `data.order`. `barClass` is `{ green: 'bg-gruvbox-green', blue: 'bg-gruvbox-blue', aqua: 'bg-gruvbox-aqua', purple: 'bg-gruvbox-purple' }`. Collection name is `projects`. Each entry `id` is the filename without `.md`. Frontmatter fields are `title`, `kicker`, `date`, `order`, `publish`, and `color`.

- [ ] **Step 1: Write the failing check**

Create `scripts/check-articles.mjs`:

```js
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
```

In `package.json`, change the check script to:

```json
"check": "node scripts/check-profile.mjs && node scripts/check-articles.mjs && node scripts/check-home.mjs && node scripts/check-projects.mjs"
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `node scripts/check-articles.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `../src/data/published-projects.js`.

- [ ] **Step 3: Add the helper, the collection, and the four empty articles**

Create `src/data/published-projects.js`:

```js
export function publishedProjects(entries) {
  return entries
    .filter((entry) => entry.data.publish === true)
    .sort((a, b) => a.data.order - b.data.order);
}

export const barClass = {
  green: 'bg-gruvbox-green',
  blue: 'bg-gruvbox-blue',
  aqua: 'bg-gruvbox-aqua',
  purple: 'bg-gruvbox-purple',
};
```

Create `src/content.config.mjs`:

```js
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    date: z.string(),
    order: z.number().int(),
    publish: z.boolean(),
    color: z.enum(['green', 'blue', 'aqua', 'purple']),
  }),
});

export const collections = { projects };
```

Create `src/content/projects/hairgel.md`:

```md
---
title: HAIRGEL
kicker: IMPIRICUS · DATA ENGINEER
date: 2026–
order: 1
publish: false
color: green
---
```

Create `src/content/projects/ion.md` with the same shape: title `ION`, order `2`, color `blue`. Create `src/content/projects/cartograph.md` with title `Cartograph`, order `3`, color `aqua`. Create `src/content/projects/market-phase-transitions.md` with title `Dynamic Network Modeling`, kicker `SELECTED PROJECT`, date `2025–26`, order `4`, color `purple`. Every body is empty. The date character is an en dash.

- [ ] **Step 4: Run the check and the build**

Run: `node scripts/check-articles.mjs`

Expected: exit 0.

Run: `npm run build`

Expected: exit 0. The existing homepage and Projects page still build. The four articles are not linked yet.

- [ ] **Step 5: Commit**

```bash
git add package.json scripts/check-articles.mjs src/content.config.mjs src/content/projects src/data/published-projects.js
git commit -m "$(cat <<'EOF'
Add unpublished project articles and reject an empty published body.

The homepage and Projects page can later show an article only after it has something to read.
EOF
)"
```

---

### Task 2: Homepage rows, editorial index, and article route

**Files:**
- Modify: `scripts/check-home.mjs`
- Modify: `scripts/check-projects.mjs`
- Modify: `scripts/check-profile.mjs`
- Modify: `src/pages/index.astro`
- Modify: `src/components/HomeComponent.jsx`
- Modify: `src/data/profile.js`
- Delete: `src/pages/projects.astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`
- Delete: `src/components/ProjectsRecord.astro`
- Test: `npm run check`

**Interfaces:**
- Consumes: `publishedProjects(entries)`, `barClass`, and the `projects` collection from Task 1. `profile.links` remains `{ email, resume, github, linkedin }`.
- Produces: homepage proof href `/projects/${entry.id}` for each published entry. `HomeComponent` accepts `showProofs` (boolean). `/projects` lists the same entries. `/projects/<slug>` exists only when that entry's `publish` is true.

- [ ] **Step 1: Write the failing page checks**

Replace `scripts/check-home.mjs` with:

```js
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
```

Replace `scripts/check-projects.mjs` with:

```js
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
```

Replace `scripts/check-profile.mjs` with:

```js
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
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm run check`

Expected: FAIL. `check-home.mjs` reports that the homepage still reads `profile.homeProofs`. `check-projects.mjs` fails because `src/pages/projects/index.astro` does not exist. `check-profile.mjs` reports that `profile` still exports `homeProofs`.

- [ ] **Step 3: Point the homepage at published articles**

Replace `src/pages/index.astro` with:

```astro
---
import Header from '../components/Header.astro';
import HomeComponent from '../components/HomeComponent.jsx';
import { getCollection } from 'astro:content';
import { barClass, publishedProjects } from '../data/published-projects.js';
import '../styles/global.css';

const published = publishedProjects(await getCollection('projects'));
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Aidan O'Neil</title>
  </head>
  <body class="m-0 p-0">
    <Header />
    <HomeComponent client:load showProofs={published.length > 0} />
    {published.length > 0 && (
      <section id="proofs" class="relative z-10 w-full max-w-6xl mx-auto px-8 pb-24">
        <div class="space-y-4">
          {published.map((entry) => (
            <a
              href={`/projects/${entry.id}`}
              class="grid grid-cols-[4px_1fr_auto] items-center gap-4 border border-gruvbox-bg3 bg-gruvbox-bg/70 px-4 py-4"
            >
              <span class={`block h-8 w-1 ${barClass[entry.data.color]}`}></span>
              <span>
                <span class="block text-xs font-bold tracking-wide text-gruvbox-gray">{entry.data.kicker}</span>
                <span class="block text-xl font-bold text-gruvbox-fg">{entry.data.title}</span>
              </span>
              <span class="text-sm text-gruvbox-fg4">{entry.data.date}</span>
            </a>
          ))}
        </div>
      </section>
    )}
  </body>
</html>
```

In `src/components/HomeComponent.jsx`, change the component signature to:

```jsx
export default function HomeComponent({ showProofs = false }) {
```

Replace the scroll button with:

```jsx
        {showProofs ? (
          <button
            onClick={() => document.getElementById('proofs')?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute bottom-10 animate-bounce text-gruvbox-yellow text-4xl hover:text-gruvbox-orange transition-colors duration-300 cursor-pointer focus:outline-none"
            aria-label="Scroll to Resume"
          >
            <FaChevronDown />
          </button>
        ) : null}
```

Leave the introduction, links, hero height, and topographic field as they are.

- [ ] **Step 4: Replace the résumé record with the editorial index**

Replace `src/data/profile.js` with:

```js
export const profile = {
  links: {
    email: 'mailto:aidan.oneil@impiricus.com',
    resume: '/resume.pdf',
    github: 'https://github.com/rhit-oneilat',
    linkedin: 'https://www.linkedin.com/in/aidan-o-neil',
  },
};
```

Delete `src/pages/projects.astro` before creating the directory. Then create `src/pages/projects/index.astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getCollection } from 'astro:content';
import { publishedProjects } from '../../data/published-projects.js';
import { profile } from '../../data/profile.js';

const published = publishedProjects(await getCollection('projects'));
---

<Layout title="Projects | Aidan O'Neil">
  <h1 class="text-3xl font-bold text-gruvbox-yellow">Projects</h1>
  {published.length === 0 ? (
    <a
      href={profile.links.resume}
      target="_blank"
      rel="noopener noreferrer"
      class="mt-8 inline-block px-6 py-3 text-lg bg-gruvbox-bg1 border border-gruvbox-bg3 font-bold hover:bg-gruvbox-bg2 transition-all duration-300"
    >
      View My Resume
    </a>
  ) : (
    <div class="mt-8 max-w-2xl">
      {published.map((entry) => (
        <a href={`/projects/${entry.id}`} class="block border-b border-gruvbox-bg2 py-4">
          <span class="block text-xs font-bold tracking-wide text-gruvbox-gray">{entry.data.kicker}</span>
          <span class="block text-xl font-bold text-gruvbox-fg">{entry.data.title}</span>
          <span class="block text-sm text-gruvbox-fg4">{entry.data.date}</span>
        </a>
      ))}
    </div>
  )}
</Layout>
```

Create `src/pages/projects/[slug].astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const published = await getCollection('projects', ({ data }) => data.publish);
  return published.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<Layout title={`${entry.data.title} | Aidan O'Neil`}>
  <article class="max-w-prose">
    <p class="text-xs font-bold tracking-wide text-gruvbox-gray">{entry.data.kicker}</p>
    <h1 class="mt-2 text-3xl font-bold text-gruvbox-yellow">{entry.data.title}</h1>
    <div class="mt-4 h-[3px] w-[44px] bg-gruvbox-yellow"></div>
    <div class="article-body mt-8">
      <Content />
    </div>
  </article>
</Layout>

<style>
  .article-body :global(h2),
  .article-body :global(h3) {
    @apply text-gruvbox-yellow font-bold mt-6;
  }
  .article-body :global(p),
  .article-body :global(li) {
    @apply text-gruvbox-fg mt-4;
  }
  .article-body :global(a) {
    @apply text-gruvbox-yellow underline;
  }
  .article-body :global(ul),
  .article-body :global(ol) {
    @apply pl-5;
  }
  .article-body :global(pre),
  .article-body :global(code) {
    @apply bg-gruvbox-bg1;
  }
  .article-body :global(pre) {
    @apply p-4 mt-4 overflow-x-auto;
  }
</style>
```

Delete `src/components/ProjectsRecord.astro`.

- [ ] **Step 5: Run the check and the build**

Run: `npm run check`

Expected: exit 0.

Run: `npm run build`

Expected: exit 0. The build output does not contain `projects/hairgel/index.html`, `projects/ion/index.html`, `projects/cartograph/index.html`, or `projects/market-phase-transitions/index.html`.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-home.mjs scripts/check-projects.mjs scripts/check-profile.mjs src/pages/index.astro src/components/HomeComponent.jsx src/data/profile.js src/pages/projects src/pages/projects.astro src/components/ProjectsRecord.astro
git commit -m "$(cat <<'EOF'
Replace the Projects resume wall with unpublished article slots.

A project appears on the homepage and the index only after its article is published.
EOF
)"
```

`git add` of the deleted files records the deletions. Do not stage `public/resume.tex`, `public/resume.pdf`, or `.playwright-mcp/`.

---

### Task 3: Browser verification

**Files:**
- Modify: whichever file a failed check points to. Do not create a verification report.
- Test: local site in a browser, plus `npm run check`.

**Interfaces:**
- Consumes: the finished homepage, Projects index, and unpublished article routes.
- Produces: no new public interface.

- [ ] **Step 1: Run the automated check**

Run: `npm run check`

Expected: exit 0.

- [ ] **Step 2: Open the local site**

If `http://127.0.0.1:4321` is not already serving this repo, start it with:

```bash
npm run dev -- --host 127.0.0.1
```

Use the browser tools. Do not use the production site.

- [ ] **Step 3: Check desktop, 1440 by 1000**

On `/`:

- The header reads `~/`, `Aidan O'Neil`, Home, and Projects. Home is the yellow current item.
- The introduction reads `Aidan O'Neil` and `Mathematician, Data Scientist, and Engineer`.
- `Say Hello` and the email icon use `mailto:aidan.oneil@impiricus.com`.
- `View My Resume` points at `/resume.pdf` and opens in a new tab.
- GitHub points at `https://github.com/rhit-oneilat`.
- LinkedIn points at `https://www.linkedin.com/in/aidan-o-neil`.
- There is no `#proofs` section and no scroll control.
- The topographic field is visible behind the introduction, corners stay square, and type stays monospace.
- The page does not contain `Who I Am`, `Check Out My Work`, `HAIRGEL`, or `will be detailed here`.

On `/projects`:

- Projects is the yellow current item.
- The only heading is `Projects`.
- `View My Resume` points at `/resume.pdf`, has `target="_blank"`, and has `rel="noopener noreferrer"`.
- The page does not contain `HAIRGEL`, `Education`, `Professional Experience`, or `This Website`.
- The field animation is absent.

Request `/projects/ion`. The response is a 404.

- [ ] **Step 4: Check a phone width, 390 by 844**

Reload `/` and `/projects`. The header, introduction, and Projects heading remain readable. There is no horizontal page overflow. Projects still shows only the heading and the résumé button.

- [ ] **Step 5: Fix failures and recheck**

If any check fails, change only the file responsible, then repeat Steps 1, 3, and 4. Stop when both the script and both widths pass.

- [ ] **Step 6: Commit any verification fixes**

If Step 5 changed files:

```bash
git add src/pages/index.astro src/pages/projects src/components/HomeComponent.jsx src/data/profile.js src/data/published-projects.js scripts/check-profile.mjs scripts/check-articles.mjs scripts/check-home.mjs scripts/check-projects.mjs
git commit -m "$(cat <<'EOF'
Fix the empty article index after browser verification.

The unpublished homepage and Projects page need to stay readable at desktop and phone widths.
EOF
)"
```

If Step 5 changed nothing, do not create an empty commit.
