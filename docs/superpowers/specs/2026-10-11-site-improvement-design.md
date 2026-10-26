# Site improvement design

## Purpose

The site should give a technical leader a short path from the introduction to contact, while the Projects page carries the current resume in full. The existing visual system stays: Gruvbox colors, JetBrains Mono, square corners, and the topographic field on the homepage.

## Audience and outcome

The first reader is a technical leader or senior hiring manager. The page should make contact easy. "Say Hello" is the primary action.

## Copy rule

Visible words come from two approved sources:

- The current homepage introduction and button labels.
- `public/resume.tex`, transcribed to plain Unicode as specified below.

The homepage proof labels in the Homepage section are approved display labels. They are shorter than the resume titles. No other new sentences are part of this design.

## Visual system

Retain these existing rules:

- Palette in `tailwind.config.js`.
- Square corners from `src/styles/global.css`.
- Monospace body type.
- Homepage field from `src/components/P5Sketch.jsx`, fixed behind the homepage content.
- Yellow section rules, colored organization names, and left-border body text already used in `src/components/ResumeContent.jsx`.
- Header treatment already used in `src/components/Header.astro`.

The topographic field is on the homepage only. The header on the homepage sits above that field.

Color roles on Projects:

- Rose-Hulman: aqua
- Impiricus and HAIRGEL: green
- ION and Booz Allen Hamilton: blue
- Cartograph: aqua
- Platform and O'Neil and Yuan Advisory: purple
- Independent project titles: yellow

Homepage proof bars use the same roles: HAIRGEL green, ION blue, Cartograph aqua, Dynamic Network Modeling purple.

## Information architecture

Two pages.

### Homepage

Order:

1. Header: `~/`, `Aidan O'Neil`, Home, Projects. Home is the current item.
2. Introduction, centered in the remaining first screen.
3. Four proof rows.
4. The existing scroll control, which moves the view to the proof rows.

Introduction, unchanged:

- Heading: Aidan O'Neil
- Line: Mathematician, Data Scientist, and Engineer
- Primary button: Say Hello, linking to `mailto:aidan.oneil@impiricus.com`
- Secondary button: View My Resume, linking to `/resume.pdf`

The current hero buttons "View My Resume" (page anchor) and "Check Out My Work" are replaced by those two buttons. Projects remains available in the header.
- GitHub icon: `https://github.com/rhit-oneilat`
- LinkedIn icon: `https://www.linkedin.com/in/aidan-o-neil`
- Email icon: `mailto:aidan.oneil@impiricus.com`

GitHub and LinkedIn open in a new tab with `rel="noopener noreferrer"`. The resume PDF opens in a new tab.

Proof rows, in order:

| Kicker | Title | Date | Target |
| --- | --- | --- | --- |
| IMPIRICUS · DATA ENGINEER | HAIRGEL | 2026– | `/projects#hairgel` |
| IMPIRICUS · DATA ENGINEER | ION | 2026– | `/projects#ion` |
| IMPIRICUS · DATA ENGINEER | Cartograph | 2026– | `/projects#cartograph` |
| SELECTED PROJECT | Dynamic Network Modeling | 2025–26 | `/projects#market-phase-transitions` |

The current "Who I Am" paragraphs, homepage education block, three short job summaries, and "Beyond Work" sidebar leave the homepage. Their facts appear on Projects in the resume wording below.

### Projects

Route remains `/projects`. The header marks Projects as the current item.

Large screens show the record on the left and the skill sidebar on the right. Narrower screens place the sidebar after the record.

Each record entry uses the current pattern: a gray date line, a colored title, a muted subtitle where the resume has a role, and bullets on a left border. The four Impiricus workstreams are nested panels inside the Impiricus entry. Booz Allen Hamilton and O'Neil and Yuan Advisory are separate entries after it. Award names are bold.

Main column, in this order:

1. Education
2. Professional Experience
3. Awards & Recognition
4. Projects

Sidebar:

1. Technical Skills
2. Additional Skills

The current single card titled "This Website" leaves this page.

## Resume record

Dates use an en dash. LaTeX math and commands become the Unicode shown here. Words stay as written in `public/resume.tex`.

### Education

- August 2022 – February 2026
- Rose-Hulman Institute of Technology
- Bachelor of Science in Mathematics and Data Science and Artificial Intelligence, Minor in Economics
- Terre Haute, Indiana

### Professional Experience

**Impiricus** — Nov. 2025 – Present — Data Engineer — Houston, TX

- Lead engineer and architect of an interconnected analytics vertical (data warehouse, behavioral-scoring, and optimization-based scheduling), built and operated end-to-end across 5 production PostgreSQL/Aurora schemas and supporting 15+ engineers across 3 product teams.

**HAIRGEL: Cross-Channel Dimensional Data Warehouse** — Apr. 2026 – Present — id `hairgel`

- Architected the system of record for cross-channel campaign engagement analytics: a 5-schema PostgreSQL/Aurora warehouse on a Kimball star schema with SCD Type-2 dimensions, a ~12M-row partitioned fact table, and a ~9M-row HCP dimension.
- Accelerated consumer queries 14×–130× over the legacy OLTP path at exact 1:1 row parity, through a zero-failure hourly pg_cron ETL pipeline.
- Root-caused a multi-day silent production failure (PostgreSQL drops inherited group-role privileges after an in-procedure COMMIT while has_table_privilege still reports TRUE); resolved with direct grants and SECURITY DEFINER least-privilege execution.
- Designed a standardized 4-tier role-based access control (RBAC) framework across ~10 services for 50+ users (SOC2-aligned governance); authored a unified all-channel event-log API and a daily automated agency click-export feed.

**ION: Scheduling & Optimization Engine** — Jan. 2026 – Present — id `ion`

- Lead engineer; built and own end-to-end a 7-service, production-deployed scheduling and inventory-optimization platform (~28K LOC Python/Go, ~700 tests, 18-table schema, OpenTofu/Terraform CI/CD).
- Replaced a manual allocation workflow with a two-pass economic optimizer — a HiGHS mixed-integer program with an LP-relaxation shadow-pricing feedback loop — scaling to 8M targets across 1000 campaigns over a 120-day horizon.
- Proved the program's integrality gap is exactly zero (min-cost network flow / total unimodularity), establishing the LP duals as exact competitive-equilibrium (Walrasian) prices; verified across 10,000+ instances.
- Named inventor on the ION scheduling-architecture patent application (filed 2026, patent pending); authored counsel review memos seeding a shadow-pricing continuation.
- Built the React/TypeScript Forecaster SPA (ALB–Cognito Google OAuth + RBAC) and own the production rollback/safety gate.

**Cartograph: HCP Behavioral-Representation & Engagement Engine** — May 2026 – Present — id `cartograph`

- Designed and shipped a consumer-agnostic embedding engine: d=32 learned provider representations plus an engagement scalar for 334K providers (Postgres/pgvector + HNSW), retrieval separation +0.547, treating cold-start (~95% of the network) as a first-class regime.
- Built a deterministic 4-signal inbound-reply scorer (two fine-tuned RoBERTa checkpoints over a 3-stage dispatch) replacing a 4-model GPT-4o chain, trained on an 11,731-row human-labeled corpus and deployed as a live FastAPI service.
- Measured engagement sparsity and burstiness across the provider network (median 1 substantive event/provider/year), redirecting the architecture to a count-based window; wired an integrality-safe engagement term into ION's optimizer.

**Platform, Cross-Functional Leadership & IP** — 2026

- Conceived and presented the firm-wide "Delivery Intelligence Platform" thesis (HAIRGEL → Cartograph → ION) at the company all-hands with a live ION demo; ran a cross-team ION code review for engineering, product, and QA.
- Designated cross-functional owner of the company-wide event taxonomy and engineering partner-of-record for Product on ION delivery; onboarded a new engineer onto ION code reviews and taught safe query/optimization patterns across teams.
- Built Peer Connect, a two-sided physician-to-physician matching product, on the shared embedding and optimization stack (winner of the 2026 Impiricus development hackathon; see Awards).

**Booz Allen Hamilton** — Jun. 2025 – Aug. 2025 — AI Engineering Intern — Fort Meade, Maryland

- Co-architected (team of 4) a full-stack AI deployment framework for on-prem GPU clusters, enabling multi-model inference workflows without predefined specifications.
- Built a scalable RAG-enabled code retrieval system using GraphCodeBERT embeddings, designed to index repositories up to ~1GB for contextual code generation and QA.
- Implemented Kubernetes-based deployment pipelines supporting concurrent LLM inference across 9 consumer GPUs (RTX 2080 ×4, RTX 2060 ×5), deploying up to 6 models simultaneously via vLLM.
- Developed 5 reusable LangGraph-based orchestration workflows, establishing modular components for future AI project teams.

**O'Neil and Yuan Advisory** — Apr. 2023 – Dec. 2024 — Co-Founder and Technical Lead — Houston, TX

- Scoped, architected, and delivered 15 data pipelines for 11 nonprofit clients, handling datasets up to 40M historical records.
- Designed cloud-native data infrastructure, reducing client reporting cycles by 70% across manufacturing and retail engagements.
- Developed custom ETL systems and ML-based forecasting tools, managing end-to-end technical delivery and client-facing project sign-off.

### Awards & Recognition

- "Outstanding Contributions to Impiricus" Award, Data Engineering / Development team recognition (2026).
- Winner, Impiricus Development Hackathon (team award), 2026, for Peer Connect.

### Projects

**Dynamic Network Modeling of Market Phase Transitions** — Aug. 2025 – Feb. 2026 — id `market-phase-transitions`

- Developed a density-constrained dynamic graph model of financial markets using N=52 liquidity-weighted S&P 500 constituents and sliding-window (ω=60) correlation tensors.
- Imposed fixed topological density (ρ=0.10, K=132 edges) to isolate structural changes independent of network sparsity, preserving signed edge information (correlation/anti-correlation).
- Defined and quantified an "Inhibition Vacuum" metric I(t) capturing the collapse of anti-correlated edges preceding systemic hypersynchrony.
- Validated phase-transition significance using a 10,000-iteration stationary block bootstrap preserving temporal autocorrelation, observing statistically significant inhibition collapse (p < 10⁻⁴) prior to the 2018 crash.
- Performed density sensitivity analysis, identifying a sparsity-dependent signal regime ("Sparsity Cliff" at ρ ≈ 0.12) demonstrating structural signal degradation beyond biologically plausible connectivity thresholds.

**Blockchain Fraud Detection via Graph-Based Feature Engineering** — Feb. 2024 – Aug. 2024

- Engineered spectral and structural graph features from a Bitcoin transaction network (203K nodes, 234K edges) for supervised fraud classification.
- Extracted centrality, community structure, and embedding-based features to capture latent transaction topology.
- Trained XGBoost and LightGBM classifiers achieving 82% accuracy, improving baseline performance by 8%.

### Technical Skills

- Languages: Python, SQL, Rust, Go, R, JavaScript/TypeScript, Bash/Zsh, LaTeX
- Data Engineering & Infrastructure: PostgreSQL/Aurora, pg_cron, MongoDB, Redis, Apache Spark, Kubernetes, Docker, AWS (S3, Lambda, SageMaker, Glue, Athena, ECS, Cognito), OpenTofu/Terraform, pgvector, FastAPI, Serverless Architectures
- Machine Learning & AI: PyTorch, scikit-learn, XGBoost, LightGBM, RoBERTa/Transformers, LangGraph, vLLM, RAG, GraphCodeBERT, Embeddings/HNSW
- Optimization & Mathematics: Mixed-Integer Programming (HiGHS, OR-Tools), LP Duality & Shadow Pricing, Network Flows, Mechanism Design, Spectral Graph Theory, Control Theory, Network Science, Bayesian Inference
- Developer Tools & Visualization: Git, Neovim, Linux/Unix, Tableau, Plotly, Seaborn, React

### Additional Skills

- Languages: Mandarin Chinese (HSK 3.5)
- Professional Operations: Technical Documentation, Stakeholder Management, Agile/Scrum, Cross-functional Team Leadership
- Leadership & Activities: Shakespeare Club President; Phi Gamma Delta Member

## Architecture

`src/data/profile.js` is the only web source for the record and the four homepage rows. The site does not parse `public/resume.tex` at build time. A later resume edit updates the TeX file, the PDF, and this module together.

`profile.homeProofs` contains the four rows and their target ids. `profile` also contains every Projects section. The four target ids are `hairgel`, `ion`, `cartograph`, and `market-phase-transitions`.

Homepage composition:

- `src/pages/index.astro` renders `Header` and then `HomeComponent`.
- It does not use `Layout`, because that layout's padded container would break the full-bleed field.
- `HomeComponent` keeps the fixed sketch, the introduction, and the scroll control.
- The proof rows are server-rendered from `profile.homeProofs` and use the id `proofs`.

Projects composition:

- `src/pages/projects.astro` keeps `Layout` and renders the record from `profile`.
- The page stays static. It does not need a client island.

`ResumeContent` and `SkillsBoard` are removed from both pages. Delete them when nothing else imports them. Leave unused components that this design does not touch.

`/resume.pdf` remains the file behind "View My Resume."

## Failure behavior

The pages are static. A missing proof target is a build error, not a runtime message. `scripts/check-profile.mjs` loads `profile.js` and exits non-zero unless every `homeProofs` target id exists on a Projects section. `package.json` exposes that script as `check`.

## Verification

Run `npm run check`. Then open the local site and confirm:

- Desktop and phone widths for both `/` and `/projects`.
- "Say Hello" and the email icon use `mailto:aidan.oneil@impiricus.com`.
- "View My Resume" opens `/resume.pdf`.
- GitHub and LinkedIn open the URLs in the Homepage section.
- Each proof row lands on its Projects section.
- Projects shows every section and bullet in the Resume record section.
- The placeholder skill sentence is gone.
- Square corners, Gruvbox colors, monospace type, and the homepage field are still present.

## Out of scope

- New marketing sentences, a biography rewrite, or separate case-study pages.
- Parsing the TeX file during the build.
- Changing the contour algorithm.
- Adding a footer, a blog, or a third page.
- Editing unused components that the two pages do not render.
