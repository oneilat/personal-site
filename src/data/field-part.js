export function placedX(px, width, opening) {
  const marginRatio = width < 768 ? 0.06 : 0.22;
  const margin = marginRatio * width;
  const center = width / 2;
  const gathered = px < center
    ? (px / center) * margin
    : width - margin + ((px - center) / center) * margin;
  return px + (gathered - px) * opening;
}
