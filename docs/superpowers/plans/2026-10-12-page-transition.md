# Page Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the header and move from the homepage to Projects with Astro's client router, keeping the topographic field running and dimming it off the homepage.

**Architecture:** `Layout.astro` becomes the shell for the homepage, Projects, and articles. It owns the router, the persisted sketch, the 40% dim, and the `~/` home link. The intro card stays an Astro element so it can share `transition:name="stage"` with the Projects and article headings. `transition:name` does not work inside React, so the card chrome moves out of `HomeComponent.jsx`.

**Tech Stack:** Astro 5.4 `<ClientRouter />` from `astro:transitions`, React 19, Tailwind CSS 3, existing `react-p5` sketch. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-12-page-transition-design.md`

## Global Constraints

- The only new visible word is "Projects" on the homepage control. The corner mark is the existing `~/`.
- Do not edit `src/components/P5Sketch.jsx`, `src/components/Header.astro`, `src/styles/global.css`, `tailwind.config.js`, `Footer.astro`, `TerminalIntro.jsx`, `SkillsNetwork.jsx`, `Welcome.astro`, or `ResumeSection.astro`.
- `Header.astro` stays in the repo and is not rendered.
- Keep square corners, JetBrains Mono, and the Gruvbox palette.
- Article files, `publish`, the editorial index, and the empty Projects state stay.
- Email is `mailto:aidan.oneil@impiricus.com`. Resume href is `/resume.pdf`. GitHub is `https://github.com/rhit-oneilat`. LinkedIn is `https://www.linkedin.com/in/aidan-o-neil`.
- GitHub, LinkedIn, and the résumé PDF open in a new tab with `rel="noopener noreferrer"`.
- The field persist name is `topo`. The shared heading name is `stage`. Off-home opacity is `opacity-40`.

## File map

- Create `src/components/TopoField.jsx`: dynamic import of `P5Sketch.jsx`.
- Modify `src/layouts/Layout.astro`: router, field, dim, home mark, `fullBleed`.
- Modify `src/pages/index.astro`: use the layout, full-screen intro, Projects link, stage name on the card.
- Modify `src/components/HomeComponent.jsx`: card contents only.
- Modify `src/pages/projects/index.astro`: `transition:name="stage"` on the Projects `h1`.
- Modify `src/pages/projects/[slug].astro`: `transition:name="stage"` on the article `h1`.
- Modify `scripts/check-home.mjs` and `scripts/check-projects.mjs`.

---

### Task 1: Shell, Projects link, and shared heading transition

**Files:**
- Create: `src/components/TopoField.jsx`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/HomeComponent.jsx`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/projects/[slug].astro`
- Modify: `scripts/check-home.mjs`
- Modify: `scripts/check-projects.mjs`
- Test: `npm run check`

**Interfaces:**
- Consumes: `publishedProjects(entries)`, `barClass`, and `profile.links` from the article site.
- Produces: `Layout` props `{ title: string, fullBleed?: boolean }`. `TopoField` is a React component with no props. The persisted element is `transition:persist="topo"`. The morphed elements use `transition:name="stage"`.

- [ ] **Step 1: Write the failing checks**

Replace `scripts/check-home.mjs` with:

```js
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
```

Add these lines to `scripts/check-projects.mjs` immediately after the `article title suffix` check:

```js
if (index.includes('<Header')) errors.push('Projects still renders Header');
if (article.includes('<Header')) errors.push('article still renders Header');
if (!index.includes('transition:name="stage"')) errors.push('Projects heading has no stage name');
if (!article.includes('transition:name="stage"')) errors.push('article heading has no stage name');
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm run check`

Expected: FAIL. `check-home.mjs` reports that the homepage still renders `Header` and that the layout is missing the client router.

- [ ] **Step 3: Add the field island and the shell**

Create `src/components/TopoField.jsx`:

```jsx
import { useEffect, useState } from 'react';

export default function TopoField() {
  const [P5Sketch, setP5Sketch] = useState(null);

  useEffect(() => {
    import('./P5Sketch.jsx').then((mod) => {
      setP5Sketch(() => mod.default);
    });
  }, []);

  return P5Sketch ? <P5Sketch /> : null;
}
```

Replace `src/layouts/Layout.astro` with:

```astro
---
import { ClientRouter } from 'astro:transitions';
import Footer from '../components/Footer.astro';
import TopoField from '../components/TopoField.jsx';
import '../styles/global.css';

export interface Props {
  title: string;
  fullBleed?: boolean;
}

const { title, fullBleed = false } = Astro.props;
const isHome = Astro.url.pathname === '/';
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <ClientRouter />
    <title>{title}</title>
  </head>
  <body class="m-0 flex min-h-screen flex-col p-0">
    <div class:list={['fixed inset-0 z-0 pointer-events-none', isHome ? 'opacity-100' : 'opacity-40']}>
      <div transition:persist="topo">
        <TopoField client:load />
      </div>
    </div>
    {!isHome && (
      <a href="/" aria-label="Home" class="fixed top-4 left-4 z-20 font-mono text-gruvbox-yellow">~/</a>
    )}
    {fullBleed ? (
      <div class="relative z-10">
        <slot />
      </div>
    ) : (
      <main class="relative z-10 container mx-auto flex-grow px-4 py-8">
        <slot />
      </main>
    )}
  </body>
</html>

<style>
  html,
  body {
    margin: 0;
    width: 100%;
    height: 100%;
  }
</style>
```

`Footer` stays imported and unrendered, as it is today. Do not render it.

- [ ] **Step 4: Move the homepage onto the shell**

Replace `src/components/HomeComponent.jsx` with:

```jsx
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { profile } from '../data/profile.js';

export default function HomeComponent() {
  return (
    <div className="text-gruvbox-fg">
      <h1 className="text-4xl md:text-6xl font-bold text-gruvbox-orange">
        Aidan O'Neil
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-gruvbox-fg2">
        Mathematician, Data Scientist, and Engineer
      </p>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <a
          href={profile.links.email}
          className="px-6 py-3 text-lg bg-gruvbox-orange text-gruvbox-bg0 font-bold hover:shadow-lg transition-all duration-300"
        >
          Say Hello
        </a>
        <a
          href={profile.links.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 text-lg bg-gruvbox-bg1 border border-gruvbox-bg3 font-bold hover:bg-gruvbox-bg2 transition-all duration-300"
        >
          View My Resume
        </a>
      </div>
      <div className="mt-6 flex justify-center gap-6">
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gruvbox-fg4 hover:text-gruvbox-fg0 text-3xl transition-colors duration-300"
        >
          <FaGithub />
        </a>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gruvbox-fg4 hover:text-gruvbox-fg0 text-3xl transition-colors duration-300"
        >
          <FaLinkedin />
        </a>
        <a
          href={profile.links.email}
          className="text-gruvbox-fg4 hover:text-gruvbox-fg0 text-3xl transition-colors duration-300"
        >
          <FaEnvelope />
        </a>
      </div>
    </div>
  );
}
```

Replace `src/pages/index.astro` with:

```astro
---
import Layout from '../layouts/Layout.astro';
import HomeComponent from '../components/HomeComponent.jsx';
import { getCollection } from 'astro:content';
import { barClass, publishedProjects } from '../data/published-projects.js';

const published = publishedProjects(await getCollection('projects'));
---

<Layout title="Aidan O'Neil" fullBleed>
  <div class="relative flex min-h-svh w-full flex-col items-center justify-center px-4">
    <div transition:name="stage" class="max-w-2xl border border-gruvbox-bg3 bg-gruvbox-bg/40 p-8 text-center shadow-2xl backdrop-blur-sm md:p-12">
      <HomeComponent client:load />
    </div>
    <a href="/projects" class="absolute bottom-10 animate-bounce text-2xl font-bold text-gruvbox-yellow transition-colors duration-300 hover:text-gruvbox-orange">Projects</a>
  </div>
  {published.length > 0 && (
    <section id="proofs" class="relative z-10 mx-auto w-full max-w-6xl px-8 pb-24">
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
</Layout>
```

In `src/pages/projects/index.astro`, change the heading to:

```astro
<h1 transition:name="stage" class="text-3xl font-bold text-gruvbox-yellow">Projects</h1>
```

In `src/pages/projects/[slug].astro`, change the heading to:

```astro
<h1 transition:name="stage" class="mt-2 text-3xl font-bold text-gruvbox-yellow">{entry.data.title}</h1>
```

- [ ] **Step 5: Run the check and the build**

Run: `npm run check`

Expected: exit 0.

Run: `npm run build`

Expected: exit 0. `dist/projects/ion/index.html` does not exist.

- [ ] **Step 6: Commit**

```bash
git add src/components/TopoField.jsx src/layouts/Layout.astro src/pages/index.astro src/components/HomeComponent.jsx src/pages/projects/index.astro src/pages/projects/[slug].astro scripts/check-home.mjs scripts/check-projects.mjs
git commit -m "$(cat <<'EOF'
Move between the homepage and Projects without reloading the field.

The header is gone, and the same topographic canvas dims behind Projects and articles.
EOF
)"
```

Do not stage `public/resume.tex`, `public/resume.pdf`, `.playwright-mcp/`, or `docs/`.

---

### Task 2: Browser verification

**Files:**
- Modify: whichever file a failed check points to. Do not create a verification report.
- Test: local site in a browser, plus `npm run check`.

**Interfaces:**
- Consumes: the shell, the Projects link, and the `~/` home link.
- Produces: no new public interface.

- [ ] **Step 1: Run the automated check**

Run: `npm run check`

Expected: exit 0.

- [ ] **Step 2: Open the local site**

If `http://127.0.0.1:4321` is not already serving this repo, start it with:

```bash
npm run dev -- --host 127.0.0.1
```

Use the browser tools. Do not use the production site. If the dev server was already running before this task, restart it so the client router and the sketch load from the new modules.

- [ ] **Step 3: Check desktop, 1440 by 1000**

On `/`:

- The header is absent. There is no `~/` mark.
- The introduction reads `Aidan O'Neil` and `Mathematician, Data Scientist, and Engineer`.
- `Say Hello` uses `mailto:aidan.oneil@impiricus.com`.
- `View My Resume` points at `/resume.pdf` and opens in a new tab.
- GitHub points at `https://github.com/rhit-oneilat`. LinkedIn points at `https://www.linkedin.com/in/aidan-o-neil`.
- A bouncing link reads `Projects` and points at `/projects`.
- There is no `#proofs` section and no control named `Scroll to Resume`.
- A canvas is visible behind the introduction. Corners stay square. Type stays monospace.
- The page does not contain `Who I Am`, `Check Out My Work`, `HAIRGEL`, or `will be detailed here`.

Record the canvas element. Click `Projects`.

On `/projects`:

- The address is `/projects`.
- The document did not reload: the canvas element recorded on `/` is still the same element.
- That canvas is dimmer than it was on `/` (the field wrapper computes to opacity `0.4`).
- The only heading is `Projects`.
- `View My Resume` points at `/resume.pdf`, has `target="_blank"`, and has `rel="noopener noreferrer"`.
- `~/` is visible, points at `/`, and its accessible name is `Home`.
- The page does not contain `HAIRGEL`, `Education`, `Professional Experience`, or `This Website`.

Click `~/`. The address returns to `/`, the `~/` mark is gone, and the field wrapper computes to opacity `1`.

Request `/projects/ion`. The response is a 404.

- [ ] **Step 4: Check a phone width, 390 by 844**

Reload `/` and `/projects`. The introduction, the `Projects` link, the Projects heading, `View My Resume`, and `~/` remain readable. There is no horizontal page overflow.

- [ ] **Step 5: Fix failures and recheck**

If any check fails, change only the file responsible, then repeat Steps 1, 3, and 4. Stop when both the script and both widths pass.

- [ ] **Step 6: Commit any verification fixes**

If Step 5 changed files:

```bash
git add src/components/TopoField.jsx src/layouts/Layout.astro src/pages/index.astro src/components/HomeComponent.jsx src/pages/projects/index.astro src/pages/projects/[slug].astro scripts/check-home.mjs scripts/check-projects.mjs
git commit -m "$(cat <<'EOF'
Fix the page transition after browser verification.

The Projects link, the home mark, and the dimmed field need to work at desktop and phone widths.
EOF
)"
```

If Step 5 changed nothing, do not create an empty commit.
