/* reveal.js — sections fade in with a 16px rise. Fires once, never re-triggers.
   DESIGN.md §6, motion use 1 of 3. */

const targets = document.querySelectorAll('.reveal');

/* prefers-reduced-motion zeroes the durations in tokens.css, but there is no
   reason to run an observer at all in that case. */
if (targets.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);   // once
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0 }
  );

  targets.forEach((target) => observer.observe(target));
} else {
  targets.forEach((target) => target.classList.add('is-revealed'));
}
