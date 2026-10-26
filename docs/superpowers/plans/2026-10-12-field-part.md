# Field Part Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Part the live topographic field from the center when leaving the homepage, and close it again when returning home.

**Architecture:** `placedX` is a pure function the sketch calls for every contour dot. A small module holds the current opening and eases it over 700 milliseconds. The layout delays Astro's `astro:before-preparation` loader while the field opens, then lets the existing router swap. Returning home swaps first and then closes the field. The uniform `opacity-40` dim goes away.

**Tech Stack:** Astro 5.4 client-router events, the existing `react-p5` sketch, Node checks. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-10-12-field-part-design.md`

## Global Constraints

- Only the horizontal position of each contour dot changes. Keep the colors, contour levels, noise loop, 30 fps rate, and the `console.log` for each level.
- Do not edit `src/styles/global.css`, `tailwind.config.js`, `Header.astro`, `Footer.astro`, `TerminalIntro.jsx`, `SkillsNetwork.jsx`, `Welcome.astro`, or `ResumeSection.astro`.
- The header stays unrendered. The `~/` mark, the "Projects" link, and `transition:name="stage"` stay.
- Side bands are 22% of the width, or 6% when the width is below 768. The open center remains the sketch background `#1d2021`.
- Opening and closing take 700 milliseconds with smoothstep easing. Reduced motion jumps to the end value.
- `placedX(100, 1000, 0)` is 100. `placedX(100, 1000, 1)` is 44. `placedX(900, 1000, 1)` is 956. `placedX(100, 400, 1)` is 12.

## File map

- Create `src/data/field-part.js`: `placedX(px, width, opening)`.
- Create `src/data/field-opening.js`: `getOpening`, `setOpening`, and `animateOpening`.
- Create `scripts/check-field.mjs`.
- Modify `package.json`: run the field check.
- Modify `src/components/P5Sketch.jsx`: place each dot with `placedX`.
- Modify `src/layouts/Layout.astro`: remove the dim, and run the open and close animations around navigation.
- Modify `scripts/check-home.mjs`: reject `opacity-40` and require the navigation hooks.

---

### Task 1: Dot placement

**Files:**
- Create: `src/data/field-part.js`
- Create: `scripts/check-field.mjs`
- Modify: `package.json`
- Test: `scripts/check-field.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `placedX(px, width, opening)` returns a number. `opening` is from 0 to 1. Width below 768 uses a 6% side band. Any other width uses a 22% side band.

- [ ] **Step 1: Write the failing check**

Create `scripts/check-field.mjs`:

```js
import { placedX } from '../src/data/field-part.js';

const cases = [
  [100, 1000, 0, 100],
  [100, 1000, 1, 44],
  [900, 1000, 1, 956],
  [100, 400, 1, 12],
];

const errors = [];
for (const [px, width, opening, expected] of cases) {
  const actual = placedX(px, width, opening);
  if (actual !== expected) {
    errors.push(`placedX(${px}, ${width}, ${opening}) is ${actual}, expected ${expected}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
```

In `package.json`, change the check script to:

```json
"check": "node scripts/check-profile.mjs && node scripts/check-articles.mjs && node scripts/check-field.mjs && node scripts/check-home.mjs && node scripts/check-projects.mjs"
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `node scripts/check-field.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `../src/data/field-part.js`.

- [ ] **Step 3: Add the placement function**

Create `src/data/field-part.js`:

```js
export function placedX(px, width, opening) {
  const marginRatio = width < 768 ? 0.06 : 0.22;
  const margin = marginRatio * width;
  const center = width / 2;
  const gathered = px < center
    ? (px / center) * margin
    : width - margin + ((px - center) / center) * margin;
  return px + (gathered - px) * opening;
}
```

- [ ] **Step 4: Run the check**

Run: `node scripts/check-field.mjs`

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/data/field-part.js scripts/check-field.mjs package.json
git commit -m "$(cat <<'EOF'
Add the horizontal placement for a parted topographic field.

The contour dots can later compress into side bands without changing their colors or motion.
EOF
)"
```

---

### Task 2: Open on the way out, close on the way home

**Files:**
- Create: `src/data/field-opening.js`
- Modify: `src/components/P5Sketch.jsx`
- Modify: `src/layouts/Layout.astro`
- Modify: `scripts/check-home.mjs`
- Test: `npm run check`

**Interfaces:**
- Consumes: `placedX(px, width, opening)` from Task 1. Astro passes URL objects on `astro:before-preparation` as `event.from` and `event.to`, and `event.loader` is replaceable.
- Produces: `getOpening()` returns the current number. `setOpening(value)` stores it. `animateOpening(target)` eases to 0 or 1 over 700 milliseconds and resolves when finished. Reduced motion sets the target and resolves immediately.

- [ ] **Step 1: Write the failing navigation check**

In `scripts/check-home.mjs`, replace the opacity assertions:

```js
if (!layout.includes('opacity-40')) errors.push('off-home field is not dimmed');
if (!layout.includes('opacity-100')) errors.push('homepage field is not fully opaque');
```

with:

```js
if (layout.includes('opacity-40')) errors.push('field is still dimmed');
if (!layout.includes('opacity-100')) errors.push('field wrapper is not fully opaque');
if (!layout.includes('astro:before-preparation')) errors.push('layout does not delay navigation while the field opens');
if (!layout.includes('astro:after-swap')) errors.push('layout does not close the field after returning home');
if (!layout.includes('animateOpening')) errors.push('layout does not animate the opening');
```

Append these reads before the final `if (errors.length > 0)`:

```js
const sketch = fs.readFileSync('src/components/P5Sketch.jsx', 'utf8');
if (!sketch.includes('placedX')) errors.push('sketch does not place contour dots');
if (!sketch.includes('getOpening')) errors.push('sketch does not read the opening');
if (!sketch.includes("console.log('Drawing contour at level:'")) errors.push('contour log was removed');
if (!sketch.includes('level: -50')) errors.push('contour levels changed');
if (!fs.existsSync('src/data/field-opening.js')) {
  errors.push('field opening module is missing');
} else {
  const opening = fs.readFileSync('src/data/field-opening.js', 'utf8');
  if (!opening.includes('700')) errors.push('opening duration is not 700 milliseconds');
  if (!opening.includes('3 - 2 * t')) errors.push('opening clock is not smoothstep');
  if (!opening.includes('prefers-reduced-motion')) errors.push('reduced motion is not handled');
}
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm run check`

Expected: FAIL. `check-home.mjs` reports `field is still dimmed` and `field opening module is missing`.

- [ ] **Step 3: Add the opening clock and use it in the sketch**

Create `src/data/field-opening.js`:

```js
function openingForPath(pathname) {
  return pathname === '/' ? 0 : 1;
}

let opening = typeof location === 'undefined' ? 0 : openingForPath(location.pathname);

export function getOpening() {
  return opening;
}

export function setOpening(value) {
  opening = value;
}

export function animateOpening(target) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || target === opening) {
    opening = target;
    return Promise.resolve();
  }
  const start = opening;
  const startTime = performance.now();
  return new Promise((resolve) => {
    function frame(now) {
      const t = Math.min(1, (now - startTime) / 700);
      const eased = t * t * (3 - 2 * t);
      opening = start + (target - start) * eased;
      if (t < 1) requestAnimationFrame(frame);
      else {
        opening = target;
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}
```

In `src/components/P5Sketch.jsx`, add these imports below the React import:

```js
import { placedX } from '../data/field-part.js';
import { getOpening } from '../data/field-opening.js';
```

In `drawDotsAtContour`, replace `let px = x * scl;` with:

```js
let px = placedX(x * scl, p5.width, getOpening());
```

Leave `py`, the ellipse size, the contour levels, and the `console.log` as they are.

- [ ] **Step 4: Drive the opening from navigation**

In `src/layouts/Layout.astro`, replace the field wrapper class list with a fully opaque wrapper:

```astro
    <div class="fixed inset-0 z-0 pointer-events-none opacity-100">
```

Keep `isHome` for the `~/` mark. Add this script after the existing `<style>` block:

```astro
<script>
  import { animateOpening, setOpening } from '../data/field-opening.js';

  if (!window.__fieldPartBound) {
    window.__fieldPartBound = true;
    setOpening(location.pathname === '/' ? 0 : 1);
    document.addEventListener('astro:before-preparation', (event) => {
      const fromHome = event.from.pathname === '/';
      const toHome = event.to.pathname === '/';
      if (fromHome && !toHome) {
        const original = event.loader;
        event.loader = async () => {
          await animateOpening(1);
          await original();
        };
      }
    });
    document.addEventListener('astro:after-swap', () => {
      if (location.pathname === '/') animateOpening(0);
    });
  }
</script>
```

- [ ] **Step 5: Run the check and the build**

Run: `npm run check`

Expected: exit 0.

Run: `npm run build`

Expected: exit 0. `dist/projects/ion/index.html` does not exist.

- [ ] **Step 6: Commit**

```bash
git add src/data/field-opening.js src/components/P5Sketch.jsx src/layouts/Layout.astro scripts/check-home.mjs
git commit -m "$(cat <<'EOF'
Part the topographic field when leaving the homepage.

The same canvas opens a center corridor before the page swaps, and closes after the introduction returns.
EOF
)"
```

Do not stage `public/resume.tex`, `public/resume.pdf`, `.playwright-mcp/`, or `docs/`.

---

### Task 3: Browser verification

**Files:**
- Modify: whichever file a failed check points to. Do not create a verification report.
- Test: local site in a browser, plus `npm run check`.

**Interfaces:**
- Consumes: the opening clock, `placedX`, and the layout navigation hooks.
- Produces: no new public interface.

- [ ] **Step 1: Run the automated check**

Run: `npm run check`

Expected: exit 0.

- [ ] **Step 2: Open the local site**

If `http://127.0.0.1:4321` is not already serving this repo, start it with:

```bash
npm run dev -- --host 127.0.0.1
```

Restart the dev server if it was already running before this task. Use the browser tools. Do not use the production site.

- [ ] **Step 3: Check desktop, 1440 by 1000**

On `/`:

- The header is absent. The introduction and the bouncing "Projects" link are visible.
- A canvas covers the viewport. Its wrapper opacity is 1.
- There is no `~/` mark and no `#proofs` section.

Record the time, then click "Projects". The "Projects" link bounces, so click it with Playwright's forced click. The address must still be `/` for a noticeable interval while the field parts, and must then become `/projects`. The same canvas element must still be in the document.

On `/projects`:

- The heading is `Projects`, in the horizontal center.
- `~/` points at `/` and its accessible name is `Home`.
- `View My Resume` points at `/resume.pdf` and opens in a new tab.
- The field wrapper opacity is 1.
- Sampled contour dots, if any are drawn, sit in the left 22% or the right 22% of the canvas. The center band is clear.
- The page does not contain `HAIRGEL`.

Click `~/`. The address becomes `/` while the field is still parted, and the field then returns to a full-width drawing. The `~/` mark is gone.

Load `http://127.0.0.1:4321/projects` with a fresh navigation. The field is already parted on the first painted frame that contains contour dots. There is no opening animation from a full field.

Request `/projects/ion`. The response is a 404.

- [ ] **Step 4: Check a phone width, 390 by 844**

Reload `/` and `/projects`. The introduction, "Projects", the Projects heading, "View My Resume", and `~/` fit without horizontal overflow. On `/projects`, contour dots sit in the outer 6% bands.

- [ ] **Step 5: Fix failures and recheck**

If any check fails, change only the file responsible, then repeat Steps 1, 3, and 4. Stop when both the script and both widths pass.

- [ ] **Step 6: Commit any verification fixes**

If Step 5 changed files:

```bash
git add src/data/field-part.js src/data/field-opening.js src/components/P5Sketch.jsx src/layouts/Layout.astro scripts/check-field.mjs scripts/check-home.mjs package.json
git commit -m "$(cat <<'EOF'
Fix the field part after browser verification.

The corridor needs to open before the page swap and close after the introduction returns.
EOF
)"
```

If Step 5 changed nothing, do not create an empty commit.
