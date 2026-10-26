# Tide window design

This document replaces the rectangular placement in `2026-10-12-field-part-design.md`. The opening clock, the navigation timing, the client router, the removed header, the `~/` mark, the "Projects" link, and the `stage` heading transition stay as that document and `2026-10-12-page-transition-design.md` describe them.

## Purpose

Leaving the homepage opens a window in the live topographic field. The window edge is a moving shoreline, and it keeps drifting with the existing noise loop while the window is open. The content column stays clear of contour dots, including while a long article scrolls. Returning home closes the window along the same path.

## Shape

The field is the existing `P5Sketch` canvas, still drawn at 30 frames per second. Contour colors, contour levels, the terrain noise, the frame rate, and the contour log stay. Dots are not slid sideways. The rectangular `placedX` placement is removed. A dot is either drawn at its natural `(x * scl, y * scl)` or not drawn. While the window is open, each side draws the shoreline with the same 1.2 pixel dots and alpha 220 as the contours, in the field gray `#928374`, every 2 pixels along the shore. The line is absent when `opening` is below 0.02, so the homepage has no center line.

The content column is the non-home `<main>`: 56% of the canvas width when the width is at least 768, and 88% otherwise, centered. That column is the full canvas height, so the window is a vertical channel. Its left and right edges are the shoreline.

`src/data/field-tide.js` exports `shoreDistance(width, opening, shore)`. It is the half-width of the channel at one row, in pixels from the canvas center. `opening` is the existing 0-to-1 clock. `shore` is a 0-to-1 value for that row and side, clamped.

The shore value is not the terrain height of the dot. A dot is only drawn where the terrain matches its contour level, so every dot of one color has nearly the same height. A shore built from that height cuts each color on a straight line, which reads as a rectangle. The sketch therefore samples a separate wave each frame, one value per row and side:

`shore = (noise(y * 0.02 + loopX, side * 40 + loopY) - 0.36) / 0.42`

`side` is -1 on the left and 1 on the right. `loopX` and `loopY` are the same loop offsets the terrain uses, so the shore drifts at the same pace as the field.

For a canvas width `W`:

- Column half-width is `0.28 * W` when `W >= 768`, and `0.44 * W` otherwise.
- Side margin is `0.22 * W` when `W >= 768`, and `0.06 * W` otherwise.
- Padding is 16 when `W >= 768`, and 0 below that. On a 390px screen the side margin is 23px, so a desktop pad would cover the shore. The text column width stays 56% and 88%.
- `inner = columnHalf + padding`. This is the clear zone.
- `room = sideMargin - padding`.
- `gap = min(16, room / 2)`. The shore's closest approach sits this far outside the clear zone.
- `wander = room - gap`.

`shoreDistance = opening * (inner + gap + wander * clamp(shore, 0, 1))`.

A dot is not drawn when `abs(px - W / 2) < shoreDistance`. At `opening` 0 the distance is 0 and the field is whole. At `opening` 1 the distance is at least `inner + gap` for every shore value.

The `~/` mark stays fixed at the top left, over the field.

## Exact distances

`npm run check` confirms these values:

- `shoreDistance(1000, 0, 0.5)` is 0.
- `shoreDistance(1000, 1, 0)` is 312. The clear zone ends at 296, and the column half-width is 280.
- `shoreDistance(1000, 1, 0.5)` is 406.
- `shoreDistance(1000, 1, 1)` is 500.
- `shoreDistance(1000, 0.5, 0)` is 156.
- `shoreDistance(400, 1, 0)` is 188. The phone column half-width is 176.
- `shoreDistance(400, 1, 1)` is 200.
- `shoreDistance(1000, 1, -1)` is 312 and `shoreDistance(1000, 1, 2)` is 500, because the shore value is clamped.

## Unchanged

- The 700ms smoothstep clock, reduced motion, fresh-load values, open-before-swap, close-after-return, and staying open between Projects and an article.
- Gruvbox tokens, JetBrains Mono, and square corners.
- The content widths `w-[88%]` and `md:w-[56%]`.
- The "Projects" link, the `~/` mark, and the removed header.
- Article files, `publish`, and the editorial index.
- Contour colors, levels, terrain noise, frame rate, and the contour log.

## Checks

After implementation, with all four articles unpublished, open the site at desktop (1440×1000) and phone (390×844):

- On `/`, the field covers the screen and the "Projects" link is visible.
- Clicking "Projects" opens the channel before the address changes. On `/projects` the heading and "View My Resume" sit in a clear column, contour dots remain in the side margins, and the field wrapper opacity is 1.
- No contour dot is drawn inside the content column.
- The first drawn dot on each side moves by row. It is not one straight line.
- `~/` returns to `/`. The introduction is visible while the channel is still open, then the channel closes over the introduction.
- Loading `/projects` directly starts already open, with no opening animation.
- `/projects/ion` is a 404.
- Neither width scrolls horizontally.
