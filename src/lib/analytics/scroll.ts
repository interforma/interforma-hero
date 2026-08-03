import { track } from './track';

const MILESTONES = [25, 50, 75, 90] as const;

/**
 * Scroll depth tracker.
 * Fires once per milestone per page load.
 * Removes the listener after all milestones are hit.
 */
export function initScrollTracking(): void {
  if (typeof window === 'undefined') return;

  const fired = new Set<number>();
  const pagePath = window.location.pathname;

  function onScroll() {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const percent = Math.round((scrolled / total) * 100);

    for (const milestone of MILESTONES) {
      if (!fired.has(milestone) && percent >= milestone) {
        fired.add(milestone);
        track(`scroll_${milestone}`, { page_path: pagePath });

        if (fired.size === MILESTONES.length) {
          window.removeEventListener('scroll', onScroll);
        }
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}
