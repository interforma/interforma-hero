/**
 * Intersection Observer–driven entrance animations.
 * Adds `is-visible` to [data-animate] elements when they enter the viewport.
 * Respects prefers-reduced-motion: skips the observer and shows all immediately.
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = el.dataset.delay ?? '0';
          setTimeout(() => el.classList.add('is-visible'), Number(delay));
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}
