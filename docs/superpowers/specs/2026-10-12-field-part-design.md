# Field part design

The rectangular placement in this document is replaced by `2026-10-12-tide-window-design.md`. The opening clock and the navigation timing below stay in force.

This document replaces the uniform 40% dim in `2026-10-12-page-transition-design.md`. The client router, the removed header, the `~/` home mark, the "Projects" link, and the `stage` heading transition stay.

## Purpose

Going to Projects parts the live topographic field from the center. The contour dots keep animating and slide into bands at the sides. Projects appears in the open center. Returning home closes the field along the same path.

## Motion

The field is the existing `P5Sketch` canvas, still drawn at 30 frames per second. It is not a video. Only the horizontal position of each contour dot changes. Colors, contour levels, the noise loop, and the existing contour log stay.

`placedX(px, width, opening)` maps a dot's natural x position:

- `opening` is a number from 0 to 1. At 0 the dot stays at `px`.
- The center is `width / 2`.
- A side band is 22% of `width` on each side. When `width` is below 768, each band is 6% of `width`.
- Dots left of center compress into the left band. Dots at or right of center compress into the right band.
- The drawn x is the linear mix from `px` toward that gathered x, by `opening`.

The open center is the sketch's existing background, `#1d2021`. No new color is added. The page content stays above the canvas, so the heading sits in the clear center. The side bands stay at full opacity. The layout no longer applies `opacity-40`.

The value moves from 0 to 1, or from 1 to 0, over 700 milliseconds. The clock is eased with smoothstep, `t * t * (3 - 2 * t)`, and `placedX` receives that eased value. A reader whose system requests reduced motion gets the end value in one step, with no wait.

## Navigation

A module holds the current opening. The sketch reads it every frame. The layout sets it.

On a fresh load, `/` starts at 0 and every other path starts at 1. Neither animates.

Leaving `/` for another same-origin page runs the open animation on the homepage, then the client router swaps. The existing `stage` morph runs with that swap. The field stays open.

Moving between Projects and an article does not change the opening.

Returning to `/` swaps first, so the introduction is visible through the open field, and the `stage` morph runs with that swap. The field then closes.

Browser back and forward follow the same rule from the destination path. The delay uses Astro's `astro:before-preparation` loader, which already runs for clicks and for traverse navigations.

## Unchanged

- Gruvbox tokens, JetBrains Mono, and square corners.
- The "Projects" link, the `~/` mark, and the removed header.
- Article files, `publish`, and the editorial index.
- Contour colors, levels, noise, frame rate, and the contour log.

## Checks

`npm run check` confirms:

- `placedX(100, 1000, 0)` is 100.
- `placedX(100, 1000, 1)` is 44, inside the left 220px band.
- `placedX(900, 1000, 1)` is 956, inside the right band that starts at 780.
- `placedX(100, 400, 1)` is 12, inside the left 24px band.
- The layout field wrapper does not use `opacity-40`. It stays fully opaque.
- The sketch still draws the same contour levels and still logs each level.

After implementation, with all four articles unpublished, open the site at desktop (1440×1000) and phone (390×844):

- On `/`, the field covers the screen and the "Projects" link is visible.
- Clicking "Projects" parts the field before the address changes. On `/projects` the heading sits in the open center, contour dots remain at the sides, and the field wrapper opacity is 1.
- `~/` returns to `/`. The introduction is visible while the field is still open, then the field closes over the introduction.
- Loading `/projects` directly starts already parted, with no opening animation.
- `/projects/ion` is a 404.
- Neither width scrolls horizontally.
