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
