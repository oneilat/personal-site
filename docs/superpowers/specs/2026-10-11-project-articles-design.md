# Project articles design

This document replaces the Projects page and the homepage proof source in `2026-10-11-site-improvement-design.md`. The introduction, header, contact links, visual system, and résumé PDF from that document stay.

## Purpose

Each selected project is an article Aidan writes. The site provides the files, the index, and the article page. It does not provide article prose.

The first public state has no published articles. Publishing one article adds it to the homepage and to Projects together.

## Copy rule

Visible words stay inside the set already approved:

- Homepage introduction, "Say Hello", and "View My Resume".
- Header labels.
- The four project labels below.
- The Projects heading, which matches the existing header label.

No draft, summary, or "coming soon" sentence is added. Article bodies stay empty until Aidan writes them.

## Articles

Four Markdown files live in `src/content/projects/`:

| File | Title | Kicker | Date | Order | Color |
| --- | --- | --- | --- | --- | --- |
| `hairgel.md` | HAIRGEL | IMPIRICUS · DATA ENGINEER | 2026– | 1 | green |
| `ion.md` | ION | IMPIRICUS · DATA ENGINEER | 2026– | 2 | blue |
| `cartograph.md` | Cartograph | IMPIRICUS · DATA ENGINEER | 2026– | 3 | aqua |
| `market-phase-transitions.md` | Dynamic Network Modeling | SELECTED PROJECT | 2025–26 | 4 | purple |

Every file starts unpublished:

```yaml
---
title: HAIRGEL
kicker: IMPIRICUS · DATA ENGINEER
date: 2026–
order: 1
publish: false
color: green
---
```

The body after the frontmatter is empty. The slug is the filename without `.md`.

`color` is one of `green`, `blue`, `aqua`, or `purple`. The homepage maps those names to the existing Gruvbox bar classes. The index and the article page do not show the bar.

## Publishing

`publish: false` hides the file from the homepage, the Projects index, and the build. Requesting `/projects/hairgel` while that file is unpublished returns Astro's normal 404.

`publish: true` includes the article in both places and creates `/projects/` plus the slug.

A published file whose body is empty or only whitespace fails `npm run check`. An unpublished empty file passes.

## Pages

### Homepage

The introduction is unchanged. Published articles appear below it as the current proof rows, sorted by `order`: color bar, kicker, title, and date. Each row links to `/projects/` plus the slug.

When no article is published, the proof section is absent. The scroll control is absent with it. When at least one article is published, the control returns, still named "Scroll to Resume", and moves the view to `#proofs`.

### Projects index

`/projects` uses the existing `Layout`. It shows the heading "Projects" and one editorial entry per published article, in `order`.

The list is `max-w-2xl`. Each entry is a link with three stacked lines: the kicker in gray, the bold title, and the date in muted type. Entries are separated by a bottom border. There are no cards and no color bars.

When no article is published, the page shows the heading and the existing "View My Resume" button. The button opens `/resume.pdf` in a new tab with `rel="noopener noreferrer"`.

### Article

A published article uses `Layout`. The page title is the article title followed by `| Aidan O'Neil`.

The column is `max-w-prose`. It shows the kicker, the title, then a yellow rule 44px wide and 3px tall. The Markdown body follows. Paragraphs, lists, links, and fenced code use the existing monospace type and Gruvbox colors: yellow headings, foreground text, and yellow underlined links.

## What leaves the site

These stop being rendered:

- Education, experience, awards, research projects, and skills.
- The résumé workstream panels.
- Homepage links of the form `/projects#hairgel`.

`src/components/ProjectsRecord.astro` is deleted. `src/data/profile.js` keeps only `links`: email, résumé, GitHub, and LinkedIn. `public/resume.tex` and `public/resume.pdf` stay, and the site does not parse the TeX file.

`src/pages/projects.astro` is replaced by `src/pages/projects/index.astro` and `src/pages/projects/[slug].astro`. Astro cannot keep the file and the directory together.

## Unchanged

- Gruvbox tokens, JetBrains Mono, and square corners.
- Header, including its place above the topographic field.
- Homepage topographic field and hero height.
- `P5Sketch.jsx`, `Footer.astro`, `TerminalIntro.jsx`, `SkillsNetwork.jsx`, `Welcome.astro`, and `ResumeSection.astro`.
- GitHub, LinkedIn, and the résumé PDF open in a new tab.

## Checks

`npm run check` confirms:

- The four files exist with the labels, order, colors, and slugs in the table above.
- `publish: true` combined with an empty or whitespace-only body fails the check. `publish: false` with an empty body passes, which is the starting state of all four files.
- The homepage reads published articles and links to `/projects/<slug>`.
- The proof section and scroll control are both present or both absent.
- Projects renders the editorial index through `Layout`, and does not render the résumé record.
- The old résumé component files stay gone.

The check keeps passing after an article is published, as long as that article has a body.

After this implementation, with all four files still unpublished, open the homepage and Projects at desktop and phone widths. Confirm the introduction, the empty Projects state, the résumé button, and a 404 for `/projects/ion`.
