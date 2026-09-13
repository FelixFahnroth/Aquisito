/* team-flip.js — the team tiles turn on hover, tap and keyboard (all CSS, see
   .team__cell:hover / :focus-within). This file adds only the discovery hint:
   the first time a tile scrolls into view it turns once on its own, pausing on
   the name plate, so it is obvious the tiles can be turned at all. Without it a
   touch visitor sees a grid of photographs and no reason to touch one.

   DESIGN.md §6, motion use 3 of 3: it fires once per tile and never again. */

const cells = document.querySelectorAll('.team__cell');

if (cells.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const cell = entry.target;
        const flip = cell.querySelector('.team__flip');
        observer.unobserve(cell); // once, whatever happens next
        if (!flip) continue;

        /* Stagger down the row so the grid reads as one wave rather than a
           dozen tiles snapping at once. */
        const delay = [...cells].indexOf(cell) * 110;

        const timer = setTimeout(() => {
          /* If the visitor already found the tile themselves, the hint has
             nothing left to teach and would fight the hover transform. */
          if (cell.matches(':hover, :focus-within')) return;

          flip.classList.add('is-hinting');
          flip.addEventListener(
            'animationend',
            () => flip.classList.remove('is-hinting'),
            { once: true }
          );
        }, delay);

        /* Touching or hovering during the stagger wait cancels the pending
           hint for that tile. */
        cell.addEventListener('pointerenter', () => clearTimeout(timer), {
          once: true,
        });
      }
    },
    { rootMargin: '0px 0px -15% 0px', threshold: 0.6 }
  );

  cells.forEach((cell) => observer.observe(cell));
}
