/**
 * Intersection Observer–driven entrance animations.
 *
 * Elements start VISIBLE in CSS (no opacity:0 by default).
 * This script adds 'animations-ready' to <body>, which triggers
 * the CSS initial hidden state ONLY for off-screen elements.
 * The Hero (already in viewport) stays visible on first paint → good LCP.
 *
 * Respects prefers-reduced-motion: skips entirely if reduced.
 */
export function initAnimations(): void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elements = Array.from(
    document.querySelectorAll<HTMLElement>('[data-animate]')
  );

  if (prefersReduced || !('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Mark body so CSS applies the hidden initial state.
  // Elements already intersecting (e.g. hero) will fire immediately.
  document.body.classList.add('animations-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.delay ?? 0);
          setTimeout(() => el.classList.add('is-visible'), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}
