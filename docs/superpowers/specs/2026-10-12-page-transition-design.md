# Page transition design

This document adds the move between the homepage and Projects to the article site in `2026-10-11-project-articles-design.md`. Publishing rules, article files, proof rows, and the approved copy stay.

## Purpose

A reader moves from the homepage to Projects by a click, and the page changes in place. The topographic field keeps running. The header is not part of that path.

## Copy rule

The only new visible word is "Projects" on the homepage control. The corner mark reuses the existing `~/`. Every other visible word stays as already approved.

## Shell

The homepage, `/projects`, and each article use `src/layouts/Layout.astro`.

The layout renders, in order:

1. Astro's `<ClientRouter />` in the document head.
2. The topographic field, fixed to the viewport, `z-0`, with pointer events off.
3. The page content, `relative z-10`.

The layout takes `fullBleed`. The homepage sets it, and its content is full-bleed. Projects and articles leave it unset and keep the current `container mx-auto px-4 py-8` column.

The layout reads the URL. When the path is not `/`, it renders the `~/` home link and sets the field to 40% opacity. On `/` the mark is absent and the field is fully opaque.

`src/components/Header.astro` stays in the repo and is not rendered.

## Field

The field moves out of `src/components/HomeComponent.jsx` into the layout. The layout loads `src/components/P5Sketch.jsx` the same way the homepage does now: a dynamic import after the page is ready. `P5Sketch.jsx` itself is unchanged.

Two nested fixed layers hold the field. The outer layer carries the opacity and is not persisted. The inner layer carries `transition:persist="topo"` and contains the sketch island, so a page change keeps that island and its canvas mounted.

On `/` the outer layer is fully opaque. On `/projects` and on an article it is at 40% opacity (`opacity-40`). A click from the homepage dims the field during the change. A direct visit to Projects or an article starts already dimmed.

## Navigation

### Homepage

The header is absent. There is no `~/` mark.

The introduction fills the first screen: `min-h-svh`. The approved introduction, "Say Hello", "View My Resume", and the three icons stay.

The bouncing control at the bottom of that screen is a link. Its text is "Projects". It is yellow, it bounces, and it points at `/projects`. It is a `text-2xl` bold label. It is present whether or not any article is published. It does not scroll.

Published proof rows stay below the introduction and link to `/projects/<slug>`. Same-origin links use the router. "Say Hello", the résumé PDF, GitHub, and LinkedIn stay ordinary links and open as they do now.

### Projects and articles

A yellow `~/` is fixed at the top-left (`top-4 left-4 z-20`). The visible text is `~/`. The accessible name is "Home". It points at `/`.

The Projects `h1`, the article `h1`, and the homepage intro card share `transition:name="stage"`. The card moves into that heading. The project list and the article body fade in with the router's default animation.

A reader whose system requests reduced motion gets the new page with no animation. Astro's client router supplies that behavior.

## Unchanged

- Gruvbox tokens, JetBrains Mono, and square corners.
- Article files, `publish`, the editorial index, and the empty Projects state.
- Proof-row appearance for published articles.
- `P5Sketch.jsx`, `Header.astro`, `Footer.astro`, `TerminalIntro.jsx`, `SkillsNetwork.jsx`, `Welcome.astro`, and `ResumeSection.astro`.
- GitHub, LinkedIn, and the résumé PDF open in a new tab with `rel="noopener noreferrer"`.

## Checks

`npm run check` confirms:

- The layout includes `<ClientRouter />` and `transition:persist="topo"`.
- The homepage does not render `Header` and links "Projects" to `/projects`.
- The intro uses `min-h-svh`. The scroll control and "Scroll to Resume" are absent.
- The layout renders the `~/` home link only when the path is not `/`. The Projects page and the article page do not render `Header`.
- The intro card, the Projects `h1`, and the article `h1` use `transition:name="stage"`.
- Non-home pages set the field wrapper to 40% opacity. The homepage leaves it fully opaque.

After implementation, with all four articles still unpublished, open the site at desktop (1440×1000) and phone (390×844):

- On `/`, the introduction, the topographic field, and the "Projects" link are visible. The header, the proof section, and the scroll control are absent.
- Clicking "Projects" lands on `/projects` without a full document reload. The same canvas element is still in the document, and it is dimmer than on the homepage.
- `/projects` shows the heading, "View My Resume", and `~/`. It does not show "HAIRGEL".
- `~/` returns to `/`, and the field is fully opaque again.
- `/projects/ion` is a 404.
- Neither width scrolls horizontally.
