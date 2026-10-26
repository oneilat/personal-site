# Site Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage around four proof links and make Projects carry the current resume, without changing the Gruvbox, monospace, square-corner, topographic visual system.

**Architecture:** `src/data/profile.js` is the only web copy of the resume and the four homepage rows. The homepage server-renders those rows under the existing introduction. Projects renders the same module as a static record. A Node script rejects a homepage row whose id has no Projects target.

**Tech Stack:** Astro 5, React 19, Tailwind CSS 3, existing Gruvbox tokens, `react-p5` homepage field. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-11-site-improvement-design.md`

## Global Constraints

- Visible words come from the current introduction, the approved homepage proof labels, and the resume transcription in the spec.
- Do not add marketing sentences, a biography, a footer, a third page, or case-study pages.
- Do not parse `public/resume.tex` at build time.
- Do not edit `src/styles/global.css`, `tailwind.config.js`, or `src/components/P5Sketch.jsx`.
- Do not edit `TerminalIntro.jsx`, `SkillsNetwork.jsx`, `Welcome.astro`, `ResumeSection.astro`, or `Footer.astro`.
- Keep square corners, JetBrains Mono, and the Gruvbox palette.
- The topographic field stays on the homepage only.
- Homepage proof targets are exactly `hairgel`, `ion`, `cartograph`, and `market-phase-transitions`.
- Email is `mailto:aidan.oneil@impiricus.com`. Resume href is `/resume.pdf`. GitHub is `https://github.com/rhit-oneilat`. LinkedIn is `https://www.linkedin.com/in/aidan-o-neil`.
- GitHub, LinkedIn, and the resume PDF open in a new tab with `rel="noopener noreferrer"`.

## File map

- Create `src/data/profile.js`: resume record, links, and homepage rows.
- Create `scripts/check-profile.mjs`: fails when a homepage id has no Projects section, or when required copy is missing.
- Create `scripts/check-home.mjs`: fails when the homepage still has the old biography or is missing the approved controls.
- Create `scripts/check-projects.mjs`: fails when Projects still shows the old card or does not render the record.
- Modify `package.json`: `check` script.
- Modify `src/pages/index.astro`: header plus server-rendered proof rows.
- Modify `src/components/Header.astro`: keep the header above the homepage field.
- Modify `src/components/HomeComponent.jsx`: introduction, links, and scroll target.
- Create `src/components/ProjectsRecord.astro`: Projects record and skill sidebar.
- Modify `src/pages/projects.astro`: render that record inside `Layout`.
- Delete `src/components/ResumeContent.jsx` and `src/components/SkillsBoard.jsx` after nothing imports them.

---

### Task 1: Resume data and id check

**Files:**
- Create: `src/data/profile.js`
- Create: `scripts/check-profile.mjs`
- Modify: `package.json`
- Test: `scripts/check-profile.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `export const profile` from `src/data/profile.js` with `links`, `homeProofs`, `education`, `experience`, `awards`, `projects`, `technicalSkills`, and `additionalSkills`. Homepage rows and linked sections share `id`. Workstream and project ids are optional except for the four homepage targets. `links` is `{ email, resume, github, linkedin }`. `homeProofs` items are `{ id, kicker, title, date, barClass }`. Experience items are `{ org, dates, role, location, colorClass, bullets, workstreams }`. Workstreams are `{ id, title, dates, colorClass, bullets }`. Project items are `{ id, title, dates, colorClass, bullets }`. Skill items are `{ label, items }`.

- [ ] **Step 1: Write the failing check**

Create `scripts/check-profile.mjs`:

```js
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
```

Add this script to `package.json` inside `"scripts"`:

```json
"check": "node scripts/check-profile.mjs"
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm run check`

Expected: FAIL because `src/data/profile.js` cannot be resolved.

- [ ] **Step 3: Write the profile module**

Create `src/data/profile.js` with this exact module:

```js
export const profile = {
  links: {
    email: 'mailto:aidan.oneil@impiricus.com',
    resume: '/resume.pdf',
    github: 'https://github.com/rhit-oneilat',
    linkedin: 'https://www.linkedin.com/in/aidan-o-neil',
  },
  homeProofs: [
    { id: 'hairgel', kicker: 'IMPIRICUS · DATA ENGINEER', title: 'HAIRGEL', date: '2026–', barClass: 'bg-gruvbox-green' },
    { id: 'ion', kicker: 'IMPIRICUS · DATA ENGINEER', title: 'ION', date: '2026–', barClass: 'bg-gruvbox-blue' },
    { id: 'cartograph', kicker: 'IMPIRICUS · DATA ENGINEER', title: 'Cartograph', date: '2026–', barClass: 'bg-gruvbox-aqua' },
    { id: 'market-phase-transitions', kicker: 'SELECTED PROJECT', title: 'Dynamic Network Modeling', date: '2025–26', barClass: 'bg-gruvbox-purple' },
  ],
  education: {
    dates: 'August 2022 – February 2026',
    school: 'Rose-Hulman Institute of Technology',
    degree: 'Bachelor of Science in Mathematics and Data Science and Artificial Intelligence, Minor in Economics',
    location: 'Terre Haute, Indiana',
    colorClass: 'text-gruvbox-aqua',
  },
  experience: [
    {
      org: 'Impiricus',
      dates: 'Nov. 2025 – Present',
      role: 'Data Engineer',
      location: 'Houston, TX',
      colorClass: 'text-gruvbox-green',
      bullets: [
        'Lead engineer and architect of an interconnected analytics vertical (data warehouse, behavioral-scoring, and optimization-based scheduling), built and operated end-to-end across 5 production PostgreSQL/Aurora schemas and supporting 15+ engineers across 3 product teams.',
      ],
      workstreams: [
        {
          id: 'hairgel',
          title: 'HAIRGEL: Cross-Channel Dimensional Data Warehouse',
          dates: 'Apr. 2026 – Present',
          colorClass: 'text-gruvbox-green',
          bullets: [
            'Architected the system of record for cross-channel campaign engagement analytics: a 5-schema PostgreSQL/Aurora warehouse on a Kimball star schema with SCD Type-2 dimensions, a ~12M-row partitioned fact table, and a ~9M-row HCP dimension.',
            'Accelerated consumer queries 14×–130× over the legacy OLTP path at exact 1:1 row parity, through a zero-failure hourly pg_cron ETL pipeline.',
            'Root-caused a multi-day silent production failure (PostgreSQL drops inherited group-role privileges after an in-procedure COMMIT while has_table_privilege still reports TRUE); resolved with direct grants and SECURITY DEFINER least-privilege execution.',
            'Designed a standardized 4-tier role-based access control (RBAC) framework across ~10 services for 50+ users (SOC2-aligned governance); authored a unified all-channel event-log API and a daily automated agency click-export feed.',
          ],
        },
        {
          id: 'ion',
          title: 'ION: Scheduling & Optimization Engine',
          dates: 'Jan. 2026 – Present',
          colorClass: 'text-gruvbox-blue',
          bullets: [
            'Lead engineer; built and own end-to-end a 7-service, production-deployed scheduling and inventory-optimization platform (~28K LOC Python/Go, ~700 tests, 18-table schema, OpenTofu/Terraform CI/CD).',
            'Replaced a manual allocation workflow with a two-pass economic optimizer — a HiGHS mixed-integer program with an LP-relaxation shadow-pricing feedback loop — scaling to 8M targets across 1000 campaigns over a 120-day horizon.',
            'Proved the program\'s integrality gap is exactly zero (min-cost network flow / total unimodularity), establishing the LP duals as exact competitive-equilibrium (Walrasian) prices; verified across 10,000+ instances.',
            'Named inventor on the ION scheduling-architecture patent application (filed 2026, patent pending); authored counsel review memos seeding a shadow-pricing continuation.',
            'Built the React/TypeScript Forecaster SPA (ALB–Cognito Google OAuth + RBAC) and own the production rollback/safety gate.',
          ],
        },
        {
          id: 'cartograph',
          title: 'Cartograph: HCP Behavioral-Representation & Engagement Engine',
          dates: 'May 2026 – Present',
          colorClass: 'text-gruvbox-aqua',
          bullets: [
            'Designed and shipped a consumer-agnostic embedding engine: d=32 learned provider representations plus an engagement scalar for 334K providers (Postgres/pgvector + HNSW), retrieval separation +0.547, treating cold-start (~95% of the network) as a first-class regime.',
            'Built a deterministic 4-signal inbound-reply scorer (two fine-tuned RoBERTa checkpoints over a 3-stage dispatch) replacing a 4-model GPT-4o chain, trained on an 11,731-row human-labeled corpus and deployed as a live FastAPI service.',
            'Measured engagement sparsity and burstiness across the provider network (median 1 substantive event/provider/year), redirecting the architecture to a count-based window; wired an integrality-safe engagement term into ION\'s optimizer.',
          ],
        },
        {
          id: '',
          title: 'Platform, Cross-Functional Leadership & IP',
          dates: '2026',
          colorClass: 'text-gruvbox-purple',
          bullets: [
            'Conceived and presented the firm-wide "Delivery Intelligence Platform" thesis (HAIRGEL → Cartograph → ION) at the company all-hands with a live ION demo; ran a cross-team ION code review for engineering, product, and QA.',
            'Designated cross-functional owner of the company-wide event taxonomy and engineering partner-of-record for Product on ION delivery; onboarded a new engineer onto ION code reviews and taught safe query/optimization patterns across teams.',
            'Built Peer Connect, a two-sided physician-to-physician matching product, on the shared embedding and optimization stack (winner of the 2026 Impiricus development hackathon; see Awards).',
          ],
        },
      ],
    },
    {
      org: 'Booz Allen Hamilton',
      dates: 'Jun. 2025 – Aug. 2025',
      role: 'AI Engineering Intern',
      location: 'Fort Meade, Maryland',
      colorClass: 'text-gruvbox-blue',
      bullets: [
        'Co-architected (team of 4) a full-stack AI deployment framework for on-prem GPU clusters, enabling multi-model inference workflows without predefined specifications.',
        'Built a scalable RAG-enabled code retrieval system using GraphCodeBERT embeddings, designed to index repositories up to ~1GB for contextual code generation and QA.',
        'Implemented Kubernetes-based deployment pipelines supporting concurrent LLM inference across 9 consumer GPUs (RTX 2080 ×4, RTX 2060 ×5), deploying up to 6 models simultaneously via vLLM.',
        'Developed 5 reusable LangGraph-based orchestration workflows, establishing modular components for future AI project teams.',
      ],
      workstreams: [],
    },
    {
      org: "O'Neil and Yuan Advisory",
      dates: 'Apr. 2023 – Dec. 2024',
      role: 'Co-Founder and Technical Lead',
      location: 'Houston, TX',
      colorClass: 'text-gruvbox-purple',
      bullets: [
        'Scoped, architected, and delivered 15 data pipelines for 11 nonprofit clients, handling datasets up to 40M historical records.',
        'Designed cloud-native data infrastructure, reducing client reporting cycles by 70% across manufacturing and retail engagements.',
        'Developed custom ETL systems and ML-based forecasting tools, managing end-to-end technical delivery and client-facing project sign-off.',
      ],
      workstreams: [],
    },
  ],
  awards: [
    '"Outstanding Contributions to Impiricus" Award, Data Engineering / Development team recognition (2026).',
    'Winner, Impiricus Development Hackathon (team award), 2026, for Peer Connect.',
  ],
  projects: [
    {
      id: 'market-phase-transitions',
      title: 'Dynamic Network Modeling of Market Phase Transitions',
      dates: 'Aug. 2025 – Feb. 2026',
      colorClass: 'text-gruvbox-yellow',
      bullets: [
        'Developed a density-constrained dynamic graph model of financial markets using N=52 liquidity-weighted S&P 500 constituents and sliding-window (ω=60) correlation tensors.',
        'Imposed fixed topological density (ρ=0.10, K=132 edges) to isolate structural changes independent of network sparsity, preserving signed edge information (correlation/anti-correlation).',
        'Defined and quantified an "Inhibition Vacuum" metric I(t) capturing the collapse of anti-correlated edges preceding systemic hypersynchrony.',
        'Validated phase-transition significance using a 10,000-iteration stationary block bootstrap preserving temporal autocorrelation, observing statistically significant inhibition collapse (p < 10⁻⁴) prior to the 2018 crash.',
        'Performed density sensitivity analysis, identifying a sparsity-dependent signal regime ("Sparsity Cliff" at ρ ≈ 0.12) demonstrating structural signal degradation beyond biologically plausible connectivity thresholds.',
      ],
    },
    {
      id: '',
      title: 'Blockchain Fraud Detection via Graph-Based Feature Engineering',
      dates: 'Feb. 2024 – Aug. 2024',
      colorClass: 'text-gruvbox-yellow',
      bullets: [
        'Engineered spectral and structural graph features from a Bitcoin transaction network (203K nodes, 234K edges) for supervised fraud classification.',
        'Extracted centrality, community structure, and embedding-based features to capture latent transaction topology.',
        'Trained XGBoost and LightGBM classifiers achieving 82% accuracy, improving baseline performance by 8%.',
      ],
    },
  ],
  technicalSkills: [
    { label: 'Languages', items: 'Python, SQL, Rust, Go, R, JavaScript/TypeScript, Bash/Zsh, LaTeX' },
    { label: 'Data Engineering & Infrastructure', items: 'PostgreSQL/Aurora, pg_cron, MongoDB, Redis, Apache Spark, Kubernetes, Docker, AWS (S3, Lambda, SageMaker, Glue, Athena, ECS, Cognito), OpenTofu/Terraform, pgvector, FastAPI, Serverless Architectures' },
    { label: 'Machine Learning & AI', items: 'PyTorch, scikit-learn, XGBoost, LightGBM, RoBERTa/Transformers, LangGraph, vLLM, RAG, GraphCodeBERT, Embeddings/HNSW' },
    { label: 'Optimization & Mathematics', items: 'Mixed-Integer Programming (HiGHS, OR-Tools), LP Duality & Shadow Pricing, Network Flows, Mechanism Design, Spectral Graph Theory, Control Theory, Network Science, Bayesian Inference' },
    { label: 'Developer Tools & Visualization', items: 'Git, Neovim, Linux/Unix, Tableau, Plotly, Seaborn, React' },
  ],
  additionalSkills: [
    { label: 'Languages', items: 'Mandarin Chinese (HSK 3.5)' },
    { label: 'Professional Operations', items: 'Technical Documentation, Stakeholder Management, Agile/Scrum, Cross-functional Team Leadership' },
    { label: 'Leadership & Activities', items: 'Shakespeare Club President; Phi Gamma Delta Member' },
  ],
};
```

The empty `id` values must not become HTML ids. Later tasks render `id` only when the string is non-empty.

- [ ] **Step 4: Run the check to verify it passes**

Run: `npm run check`

Expected: exit 0 and no error output.

- [ ] **Step 5: Commit**

```bash
git add src/data/profile.js scripts/check-profile.mjs package.json
git commit -m "$(cat <<'EOF'
Add the shared resume record and proof-link check.

The homepage and Projects page need one approved copy source whose section ids cannot drift apart.
EOF
)"
```

---

### Task 2: Proof-led homepage

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/HomeComponent.jsx`
- Create: `scripts/check-home.mjs`
- Modify: `package.json`
- Test: `scripts/check-home.mjs`

**Interfaces:**
- Consumes: `profile.links` and `profile.homeProofs` from `src/data/profile.js`.
- Produces: homepage section `id="proofs"`. Each row links to `/projects#` plus its `id`. The scroll control calls `document.getElementById('proofs')`.

- [ ] **Step 1: Write the failing homepage check**

Create `scripts/check-home.mjs`:

```js
import fs from 'node:fs';

const index = fs.readFileSync('src/pages/index.astro', 'utf8');
const home = fs.readFileSync('src/components/HomeComponent.jsx', 'utf8');
const header = fs.readFileSync('src/components/Header.astro', 'utf8');
const errors = [];

if (!index.includes('<Header />')) errors.push('index is missing Header');
if (!index.includes('id="proofs"')) errors.push('index is missing proofs');
if (!index.includes('profile.homeProofs')) errors.push('proofs are not rendered from profile');
if (!header.includes('z-20')) errors.push('header does not sit above the field');
if (home.includes('ResumeContent')) errors.push('homepage still mounts ResumeContent');
if (home.includes('Who I Am')) errors.push('homepage still contains Who I Am');
if (home.includes('Check Out My Work')) errors.push('old secondary button remains');
if (home.includes('yourgithub')) errors.push('placeholder GitHub remains');
if (home.includes('oneilat@rose-hulman.edu')) errors.push('old email remains');
if (!home.includes('profile.links')) errors.push('hero links do not use profile.links');
if (!home.includes("getElementById('proofs')")) errors.push('scroll target is not proofs');
if (!home.includes('calc(100svh-4.5rem)')) errors.push('hero does not fit below the header');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
```

Change the `check` script in `package.json` to:

```json
"check": "node scripts/check-profile.mjs && node scripts/check-home.mjs"
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm run check`

Expected: FAIL with `index is missing Header` and the other missing homepage markers. `check-profile.mjs` still passes before the homepage check fails.

- [ ] **Step 3: Update the header, homepage, and hero**

In `src/components/Header.astro`, change the header tag to:

```astro
<header class="relative z-20 bg-gruvbox-bg1 shadow-md py-4">
```

Replace `src/pages/index.astro` with:

```astro
---
import Header from '../components/Header.astro';
import HomeComponent from '../components/HomeComponent.jsx';
import { profile } from '../data/profile.js';
import '../styles/global.css';
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
    <HomeComponent client:load />
    <section id="proofs" class="relative z-10 w-full max-w-6xl mx-auto px-8 pb-24">
      <div class="space-y-4">
        {profile.homeProofs.map((row) => (
          <a
            href={`/projects#${row.id}`}
            class="grid grid-cols-[4px_1fr_auto] items-center gap-4 border border-gruvbox-bg3 bg-gruvbox-bg/70 px-4 py-4"
          >
            <span class={`block h-8 w-1 ${row.barClass}`}></span>
            <span>
              <span class="block text-xs font-bold tracking-wide text-gruvbox-gray">{row.kicker}</span>
              <span class="block text-xl font-bold text-gruvbox-fg">{row.title}</span>
            </span>
            <span class="text-sm text-gruvbox-fg4">{row.date}</span>
          </a>
        ))}
      </div>
    </section>
  </body>
</html>
```

In `src/components/HomeComponent.jsx`:

- Remove the `ResumeContent` import and the `<ResumeContent />` element.
- Import `{ profile }` from `../data/profile.js`.
- Change the root class from `relative w-full bg-gruvbox-bg text-gruvbox-fg` to `relative w-full bg-transparent text-gruvbox-fg`.
- Change the hero class from `min-h-screen` to `min-h-[calc(100svh-4.5rem)]`.
- Replace the two hero buttons with:

```jsx
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
```

- Set the GitHub href to `{profile.links.github}`, the LinkedIn href to `{profile.links.linkedin}`, and the email href to `{profile.links.email}`.
- Add `target="_blank"` and `rel="noopener noreferrer"` to the GitHub and LinkedIn anchors only.
- Change the scroll handler to `document.getElementById('proofs')?.scrollIntoView({ behavior: 'smooth' })`.
- Keep the accessible name `Scroll to Resume`.

Leave the sketch loader, hero heading, and the line "Mathematician, Data Scientist, and Engineer" unchanged.

- [ ] **Step 4: Run the check to verify it passes**

Run: `npm run check`

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro src/components/Header.astro src/components/HomeComponent.jsx scripts/check-home.mjs package.json
git commit -m "$(cat <<'EOF'
Lead the homepage with four links into the resume record.

A technical reader can reach contact, the PDF, and the selected work without the old biography.
EOF
)"
```

---

### Task 3: Projects record

**Files:**
- Create: `src/components/ProjectsRecord.astro`
- Modify: `src/pages/projects.astro`
- Create: `scripts/check-projects.mjs`
- Modify: `package.json`
- Test: `scripts/check-projects.mjs`

**Interfaces:**
- Consumes: `profile.education`, `profile.experience`, `profile.awards`, `profile.projects`, `profile.technicalSkills`, and `profile.additionalSkills`.
- Produces: element ids `hairgel`, `ion`, `cartograph`, and `market-phase-transitions` on the Projects page.

- [ ] **Step 1: Write the failing Projects check**

Create `scripts/check-projects.mjs`:

```js
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
```

Change the `check` script in `package.json` to:

```json
"check": "node scripts/check-profile.mjs && node scripts/check-home.mjs && node scripts/check-projects.mjs"
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm run check`

Expected: FAIL because `src/components/ProjectsRecord.astro` does not exist. The profile and homepage checks still pass before that file read throws.

- [ ] **Step 3: Render the record**

Create `src/components/ProjectsRecord.astro`:

```astro
---
import { profile } from '../data/profile.js';
---

<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 font-mono">
  <div class="lg:col-span-8 space-y-16">
    <section class="space-y-8">
      <h2 class="text-3xl font-bold text-gruvbox-yellow inline-block border-b-4 border-gruvbox-yellow/30 pb-2">Education</h2>
      <div>
        <p class="text-sm font-bold text-gruvbox-gray">{profile.education.dates}</p>
        <h3 class={`mt-2 text-2xl font-bold ${profile.education.colorClass}`}>{profile.education.school}</h3>
        <p class="mt-2 text-xl text-gruvbox-fg2">{profile.education.degree}</p>
        <p class="mt-4 border-l-2 border-gruvbox-bg3 pl-6 text-lg text-gruvbox-fg">{profile.education.location}</p>
      </div>
    </section>

    <section class="space-y-12">
      <h2 class="text-3xl font-bold text-gruvbox-yellow inline-block border-b-4 border-gruvbox-yellow/30 pb-2">Professional Experience</h2>
      {profile.experience.map((job) => (
        <article>
          <p class="text-sm font-bold text-gruvbox-gray">{job.dates} · {job.location}</p>
          <h3 class={`mt-2 text-2xl font-bold ${job.colorClass}`}>{job.org}</h3>
          <p class="mt-1 text-gruvbox-fg2">{job.role}</p>
          <ul class="mt-4 space-y-3">
            {job.bullets.map((bullet) => (
              <li class="border-l-2 border-gruvbox-bg3 pl-6 text-lg leading-relaxed text-gruvbox-fg">{bullet}</li>
            ))}
          </ul>
          <div class="mt-6 space-y-4">
            {job.workstreams.map((stream) => (
              <div id={stream.id || undefined} class="border border-gruvbox-bg3 bg-gruvbox-bg/30 p-6">
                <h4 class={`text-xl font-bold ${stream.colorClass}`}>{stream.title}</h4>
                <p class="mt-1 text-sm font-bold text-gruvbox-gray">{stream.dates}</p>
                <ul class="mt-4 space-y-3">
                  {stream.bullets.map((bullet) => (
                    <li class="border-l-2 border-gruvbox-bg3 pl-6 text-lg leading-relaxed text-gruvbox-fg">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>

    <section class="space-y-6">
      <h2 class="text-3xl font-bold text-gruvbox-yellow inline-block border-b-4 border-gruvbox-yellow/30 pb-2">Awards & Recognition</h2>
      <ul class="space-y-3">
        {profile.awards.map((award) => (
          <li class="border-l-2 border-gruvbox-bg3 pl-6 text-lg font-bold text-gruvbox-fg">{award}</li>
        ))}
      </ul>
    </section>

    <section class="space-y-10">
      <h2 class="text-3xl font-bold text-gruvbox-yellow inline-block border-b-4 border-gruvbox-yellow/30 pb-2">Projects</h2>
      {profile.projects.map((project) => (
        <article id={project.id || undefined}>
          <h3 class={`text-2xl font-bold ${project.colorClass}`}>{project.title}</h3>
          <p class="mt-1 text-sm font-bold text-gruvbox-gray">{project.dates}</p>
          <ul class="mt-4 space-y-3">
            {project.bullets.map((bullet) => (
              <li class="border-l-2 border-gruvbox-bg3 pl-6 text-lg leading-relaxed text-gruvbox-fg">{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  </div>

  <aside class="lg:col-span-4 h-fit border border-gruvbox-bg3 bg-gruvbox-bg/30 p-10">
    <section>
      <h2 class="text-2xl font-bold text-gruvbox-aqua">Technical Skills</h2>
      <div class="mt-6 space-y-5">
        {profile.technicalSkills.map((skill) => (
          <p>
            <span class="block font-bold text-gruvbox-yellow">{skill.label}</span>
            <span class="mt-1 block text-gruvbox-fg2">{skill.items}</span>
          </p>
        ))}
      </div>
    </section>
    <section class="mt-12">
      <h2 class="text-2xl font-bold text-gruvbox-aqua">Additional Skills</h2>
      <div class="mt-6 space-y-5">
        {profile.additionalSkills.map((skill) => (
          <p>
            <span class="block font-bold text-gruvbox-yellow">{skill.label}</span>
            <span class="mt-1 block text-gruvbox-fg2">{skill.items}</span>
          </p>
        ))}
      </div>
    </section>
  </aside>
</div>
```

Replace `src/pages/projects.astro` with:

```astro
---
import Layout from '../layouts/Layout.astro';
import ProjectsRecord from '../components/ProjectsRecord.astro';
---

<Layout title="Projects | Aidan O'Neil">
  <ProjectsRecord />
</Layout>
```

`Layout` already renders one header and one main. Do not add another header, footer, or main.

- [ ] **Step 4: Run the check to verify it passes**

Run: `npm run check`

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectsRecord.astro src/pages/projects.astro scripts/check-projects.mjs package.json
git commit -m "$(cat <<'EOF'
Show the full resume record on Projects.

Homepage proof links now land on the matching education, experience, award, project, and skill sections.
EOF
)"
```

---

### Task 4: Remove the old homepage record

**Files:**
- Delete: `src/components/ResumeContent.jsx`
- Delete: `src/components/SkillsBoard.jsx`
- Modify: `scripts/check-projects.mjs`
- Test: `scripts/check-projects.mjs`

**Interfaces:**
- Consumes: the homepage and Projects page from Tasks 2 and 3.
- Produces: no remaining import of `ResumeContent` or `SkillsBoard`.

- [ ] **Step 1: Extend the check so the old files fail it**

Append this block to `scripts/check-projects.mjs` before the final `if (errors.length > 0)` check:

```js
for (const file of ['src/components/ResumeContent.jsx', 'src/components/SkillsBoard.jsx']) {
  if (fs.existsSync(file)) errors.push(file + ' still exists');
}
const source = fs.readFileSync('src/components/HomeComponent.jsx', 'utf8')
  + fs.readFileSync('src/pages/projects.astro', 'utf8');
if (source.includes('ResumeContent') || source.includes('SkillsBoard')) {
  errors.push('old resume components are still imported');
}
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm run check`

Expected: FAIL with `src/components/ResumeContent.jsx still exists` and `src/components/SkillsBoard.jsx still exists`.

- [ ] **Step 3: Delete the unused components**

Delete `src/components/ResumeContent.jsx` and `src/components/SkillsBoard.jsx`.

Search `src` for `ResumeContent` and `SkillsBoard`. The only matches before deletion are those two files and the old homepage import removed in Task 2. After deletion there are no matches.

- [ ] **Step 4: Run the check to verify it passes**

Run: `npm run check`

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/ResumeContent.jsx src/components/SkillsBoard.jsx scripts/check-projects.mjs
git commit -m "$(cat <<'EOF'
Remove the old homepage biography and placeholder skills.

Those components carried unapproved copy and are no longer mounted.
EOF
)"
```

---

### Task 5: Browser verification

**Files:**
- Modify: whichever file a failed check points to. Do not create a verification report.
- Test: local site in a browser, plus `npm run check`.

**Interfaces:**
- Consumes: the finished homepage and Projects page.
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
- The four proof rows show the approved kickers, titles, and dates.
- The topographic field is visible behind the introduction, corners stay square, and type stays monospace.
- The scroll control brings `#proofs` into view.
- The page does not contain `Who I Am`, `Check Out My Work`, or `will be detailed here`.

Click each proof row. It lands on `/projects` at `hairgel`, `ion`, `cartograph`, and `market-phase-transitions` respectively.

On `/projects`:

- Projects is the yellow current item.
- Education, Professional Experience, Awards & Recognition, Projects, Technical Skills, and Additional Skills are present.
- HAIRGEL, ION, Cartograph, and Platform are nested inside Impiricus.
- Booz Allen Hamilton and O'Neil and Yuan Advisory follow Impiricus.
- The old "This Website" card is absent.
- The field animation is absent.

- [ ] **Step 4: Check a phone width, 390 by 844**

Reload `/` and `/projects`. The header, introduction, proof rows, and Projects sections remain readable. The skill sidebar sits below the record. There is no horizontal page overflow.

- [ ] **Step 5: Fix failures and recheck**

If any check fails, change only the file responsible, then repeat Steps 1, 3, and 4. Stop when both the script and both widths pass.

- [ ] **Step 6: Commit any verification fixes**

If Step 5 changed files:

```bash
git add src/pages/index.astro src/pages/projects.astro src/components/HomeComponent.jsx src/components/Header.astro src/components/ProjectsRecord.astro src/data/profile.js scripts/check-profile.mjs scripts/check-home.mjs scripts/check-projects.mjs
git commit -m "$(cat <<'EOF'
Fix the homepage and Projects record after browser verification.

The proof links, contact actions, and resume sections need to work at desktop and phone widths.
EOF
)"
```

If Step 5 changed nothing, do not create an empty commit.
