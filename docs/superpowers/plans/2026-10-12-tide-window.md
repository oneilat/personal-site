# Tide Window Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open the live topographic field as a full-height channel whose left and right shores follow the terrain, and keep the content column clear.

**Architecture:** `shoreDistance` is a pure function of canvas width, the existing opening clock, and one terrain elevation. The sketch draws each contour dot at its natural position, and skips it when it sits inside that distance from the canvas center. The opening clock, the layout navigation hooks, and the content column widths stay as they are. The rectangular `placedX` placement is removed.

**Tech Stack:** The existing `react-p5` sketch, the existing `field-opening.js` clock, Node checks. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-12-tide-window-design.md`

## Global Constraints

- Draw a dot at its natural `(x * scl, y * scl)`, or do not draw it. Do not slide dots sideways. Do not add a stroke.
- Keep the contour colors, contour levels, noise loop, 30 fps rate, and the `console.log` for each level.
- Do not edit `src/styles/global.css`, `tailwind.config.js`, `Header.astro`, `Footer.astro`, `TerminalIntro.jsx`, `SkillsNetwork.jsx`, `Welcome.astro`, `ResumeSection.astro`, `src/data/field-opening.js`, or `src/layouts/Layout.astro`.
- The header stays unrendered. The `~/` mark, the "Projects" link, `transition:name="stage"`, and the content widths `w-[88%]` and `md:w-[56%]` stay.
- Column half-width is `0.28 * W` when `W >= 768`, and `0.44 * W` otherwise. Side margin is `0.22 * W` when `W >= 768`, and `0.06 * W` otherwise.
- Padding is 32 when `W >= 768`, and 0 otherwise. `inner = columnHalf + padding`. `room = sideMargin - padding`. `gap = min(16, room / 2)`. `wander = room - gap`.
- `e = clamp((elevation + 78) / 141, 0, 1)`. `shoreDistance = opening * (inner + gap + wander * e)`.
- `shoreDistance(1000, 0, 0)` is 0. `shoreDistance(1000, 1, -78)` is 328. `shoreDistance(1000, 1, -7.5)` is 414. `shoreDistance(1000, 1, 63)` is 500. `shoreDistance(1000, 0.5, -78)` is 164. `shoreDistance(400, 1, -78)` is 188. `shoreDistance(400, 1, 63)` is 200.
- Do not stage `public/resume.tex`, `public/resume.pdf`, `.playwright-mcp/`, or `docs/`.

## File map

- Create `src/data/field-tide.js`: `shoreDistance(width, opening, elevation)`.
- Delete `src/data/field-part.js` once the sketch no longer imports it.
- Modify `scripts/check-field.mjs`: assert the tide distances.
- Modify `src/components/P5Sketch.jsx`: skip dots inside the shore.
- Modify `scripts/check-home.mjs`: require `shoreDistance` and reject `placedX`.

---

### Task 1: Shore distance

**Files:**
- Create: `src/data/field-tide.js`
- Modify: `scripts/check-field.mjs`
- Test: `scripts/check-field.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `shoreDistance(width, opening, elevation)` returns a number, in pixels from the canvas center. `opening` is from 0 to 1. `elevation` is a terrain value. Width below 768 uses the 88% column and no padding. Any other width uses the 56% column and 32px of padding.

- [ ] **Step 1: Write the failing check**

Replace `scripts/check-field.mjs` with:

```js
import { shoreDistance } from '../src/data/field-tide.js';

const cases = [
  [1000, 0, 0, 0],
  [1000, 1, -78, 328],
  [1000, 1, -7.5, 414],
  [1000, 1, 63, 500],
  [1000, 0.5, -78, 164],
  [400, 1, -78, 188],
  [400, 1, 63, 200],
];

const errors = [];
for (const [width, opening, elevation, expected] of cases) {
  const actual = shoreDistance(width, opening, elevation);
  if (actual !== expected) {
    errors.push(`shoreDistance(${width}, ${opening}, ${elevation}) is ${actual}, expected ${expected}`);
  }
}

for (let elevation = -78; elevation <= 63; elevation += 1) {
  const desktop = shoreDistance(1000, 1, elevation);
  const phone = shoreDistance(400, 1, elevation);
  if (desktop < 328) errors.push(`desktop shore ${desktop} entered the clear zone at elevation ${elevation}`);
  if (phone < 188) errors.push(`phone shore ${phone} entered the column at elevation ${elevation}`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm run check`

Expected: FAIL because `src/data/field-tide.js` does not exist.

- [ ] **Step 3: Write the shore distance**

Create `src/data/field-tide.js`:

```js
export function shoreDistance(width, opening, elevation) {
  const desktop = width >= 768;
  const columnHalf = (desktop ? 0.28 : 0.44) * width;
  const sideMargin = (desktop ? 0.22 : 0.06) * width;
  const padding = desktop ? 32 : 0;
  const inner = columnHalf + padding;
  const room = sideMargin - padding;
  const gap = Math.min(16, room / 2);
  const wander = room - gap;
  const e = Math.min(1, Math.max(0, (elevation + 78) / 141));
  return opening * (inner + gap + wander * e);
}
```

Leave `src/data/field-part.js` in place. The sketch still imports it until Task 2.

- [ ] **Step 4: Run the check to verify it passes**

Run: `npm run check`

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/data/field-tide.js scripts/check-field.mjs
git commit -m "$(cat <<'EOF'
Add the tide shoreline distance for the topographic window.

The shore stays outside the content column for every elevation the terrain can produce.
EOF
)"
```

---

### Task 2: Skip dots inside the channel

**Files:**
- Modify: `src/components/P5Sketch.jsx`
- Modify: `scripts/check-home.mjs`
- Delete: `src/data/field-part.js`
- Test: `scripts/check-home.mjs` and `scripts/check-field.mjs`

**Interfaces:**
- Consumes: `shoreDistance(width, opening, elevation)` from `src/data/field-tide.js`. `getOpening()` from `src/data/field-opening.js`.
- Produces: contour dots drawn at natural coordinates, omitted where `abs(px - width / 2) < shoreDistance(width, opening, elevation)`.

- [ ] **Step 1: Write the failing check**

In `scripts/check-home.mjs`, replace the `placedX` assertion with:

```js
if (!sketch.includes('shoreDistance')) errors.push('sketch does not use the tide shore');
if (sketch.includes('placedX')) errors.push('sketch still uses the rectangular placement');
```

Keep the existing `getOpening`, contour log, and `level: -50` assertions.

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm run check`

Expected: FAIL with `sketch does not use the tide shore` and `sketch still uses the rectangular placement`.

- [ ] **Step 3: Draw dots on the shore**

In `src/components/P5Sketch.jsx`, replace the `placedX` import with:

```js
import { shoreDistance } from '../data/field-tide.js';
```

Keep the `getOpening` import. Replace `drawDotsAtContour` with:

```js
function drawDotsAtContour(p5, target, threshold) {
  const opening = getOpening();
  for (let x = 1; x < cols - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let val = terrain[x][y];
      if (Math.abs(val - target) < threshold) {
        let px = x * scl;
        let py = y * scl;
        if (Math.abs(px - p5.width / 2) < shoreDistance(p5.width, opening, val)) continue;
        p5.ellipse(px, py, 1.2, 1.2);
      }
    }
  }
}
```

Do not change `generateTerrain`, `drawContours`, the contour colors, the contour levels, or the contour log.

Delete `src/data/field-part.js`.

- [ ] **Step 4: Run the check and the build**

Run: `npm run check`

Expected: exit 0.

Run: `npm run build`

Expected: exit 0. `dist/projects/ion/index.html` does not exist.

- [ ] **Step 5: Commit**

```bash
git add src/components/P5Sketch.jsx scripts/check-home.mjs src/data/field-part.js
git commit -m "$(cat <<'EOF'
Open the topographic field along a moving shoreline.

Contour dots stay at their natural positions and drop out inside the channel.
EOF
)"
```

---

### Task 3: Browser verification

**Files:**
- Modify: whichever file a failed check points to. Do not create a verification report.
- Test: local site in a browser, plus `npm run check`.

**Interfaces:**
- Consumes: `shoreDistance`, `getOpening`, and the layout navigation hooks from the earlier tasks.
- Produces: no new public interface.

- [ ] **Step 1: Run the automated check**

Run: `npm run check`

Expected: exit 0.

- [ ] **Step 2: Open the local site**

If `http://127.0.0.1:4321` is not already serving this repo, start it with:

```bash
npm run dev -- --host 127.0.0.1
```

Restart the dev server if it was already running before this task. Use the browser tools. Do not use the production site. The "Projects" link bounces, so click it with Playwright's forced click.

Wait until the canvas is painted before sampling pixels. Undrawn canvas is black. A painted frame has the sketch background `#1d2021` (rgb 29, 32, 33) on most of the sample, within a tolerance of about 8.

- [ ] **Step 3: Check desktop, 1440 by 1000**

On `/`:

- The header is absent. The introduction and the bouncing "Projects" link are visible.
- A canvas covers the viewport. Its wrapper opacity is 1.
- There is no `~/` mark and no `#proofs` section.

Record the time, then click "Projects". The address must still be `/` for a noticeable interval while the channel opens, and must then become `/projects`. The same canvas element must still be in the document.

On `/projects`:

- The heading is `Projects`. Its box sits inside the centered 56% column, which runs from x = 317 to x = 1123.
- `~/` points at `/` and its accessible name is `Home`.
- `View My Resume` points at `/resume.pdf` and opens in a new tab.
- The field wrapper opacity is 1.
- A point 40px inside the column edge, x = 357, is the sketch background. The matching point on the right, x = 1083, is the same background.
- Some sampled points in the outer side margin, x under 200, are contour dots. The same is true on the right, x over 1240.
- The page does not contain `HAIRGEL`.
- The page does not scroll horizontally.

Click `~/`. The address becomes `/` while the channel is still open, and the channel then closes over the introduction. The `~/` mark is gone.

Load `http://127.0.0.1:4321/projects` with a fresh navigation. The channel is already open on the first painted frame that contains contour dots. There is no opening animation from a full field.

Request `/projects/ion`. The response is a 404.

- [ ] **Step 4: Check a phone width, 390 by 844**

Reload `/` and `/projects`. The introduction, "Projects", the Projects heading, "View My Resume", and `~/` fit without horizontal overflow.

On `/projects`, the column runs from x = 23 to x = 367. A point 16px inside that edge, x = 39, is the sketch background. Some sampled points in the outer 12px are contour dots.

- [ ] **Step 5: Fix failures and recheck**

If any check fails, change only the file responsible, then repeat Steps 1, 3, and 4. Stop when both the script and both widths pass.

- [ ] **Step 6: Commit any verification fixes**

If Step 5 changed files:

```bash
git add src/data/field-tide.js src/components/P5Sketch.jsx scripts/check-field.mjs scripts/check-home.mjs
git commit -m "$(cat <<'EOF'
Fix the tide window after browser verification.

The channel has to leave the content column clear on both the desktop and the phone.
EOF
)"
```

If Step 5 changed nothing, do not create an empty commit.
