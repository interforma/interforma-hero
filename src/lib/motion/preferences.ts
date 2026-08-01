/** Returns true when the user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Returns true when the page tab is currently visible */
export function isPageVisible(): boolean {
  if (typeof document === 'undefined') return true;
  return !document.hidden;
}
