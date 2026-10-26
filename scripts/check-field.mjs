import { shoreDistance } from '../src/data/field-tide.js';

const cases = [
  [1000, 0, 0.5, 0],
  [1000, 1, 0, 312],
  [1000, 1, 0.5, 406],
  [1000, 1, 1, 500],
  [1000, 0.5, 0, 156],
  [400, 1, 0, 188],
  [400, 1, 1, 200],
  [1000, 1, -1, 312],
  [1000, 1, 2, 500],
];

const errors = [];
for (const [width, opening, shore, expected] of cases) {
  const actual = shoreDistance(width, opening, shore);
  if (actual !== expected) {
    errors.push(`shoreDistance(${width}, ${opening}, ${shore}) is ${actual}, expected ${expected}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
