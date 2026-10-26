export function shoreDistance(width, opening, shore) {
  const desktop = width >= 768;
  const columnHalf = (desktop ? 0.28 : 0.44) * width;
  const sideMargin = (desktop ? 0.22 : 0.06) * width;
  const padding = desktop ? 16 : 0;
  const inner = columnHalf + padding;
  const room = sideMargin - padding;
  const gap = Math.min(16, room / 2);
  const wander = room - gap;
  const e = Math.min(1, Math.max(0, shore));
  return opening * (inner + gap + wander * e);
}
