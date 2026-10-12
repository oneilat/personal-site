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
