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
