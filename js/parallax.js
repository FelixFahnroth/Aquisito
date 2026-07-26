/* Band parallax — the photo drifts vertically as its band scrolls through the
   viewport, so it moves *with* the page but at its own pace. Decorative only:
   skipped entirely under prefers-reduced-motion. Paired with the vertical slack
   in components.css (.js img.band__media) so a translate never reveals an edge. */

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const medias = [...document.querySelectorAll("img.band__media")];

if (!reduce && medias.length) {
  const SHIFT = 0.36; // max translate, as a fraction of band height (< the 40% slack)
  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    for (const img of medias) {
      const band = img.closest(".band");
      if (!band) continue;
      const r = band.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue; // off-screen: leave it be
      // -1 when the band sits below the viewport, +1 when above; 0 at centre.
      const progress = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      const px = progress * r.height * SHIFT;
      img.style.transform = `translate3d(0, ${px.toFixed(1)}px, 0)`;
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  update();
}
