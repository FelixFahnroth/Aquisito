/* hero-stack.js — the hero photo pile flips through itself.

   Cycles which card is on top (.is-top); the card that comes next peeks out
   behind it (.is-peek); the rest sit hidden. Purely decorative, so it pauses
   under prefers-reduced-motion and whenever the tab is in the background. */

const stack = document.querySelector(".hero__stack");

if (stack) {
  const cards = [...stack.querySelectorAll(".hero__card")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  let top = 0;

  const apply = () => {
    const n = cards.length;
    cards.forEach((card, i) => {
      const depth = (i - top + n) % n; // 0 = on top, 1 = peeking behind
      card.classList.toggle("is-top", depth === 0);
      card.classList.toggle("is-peek", depth === 1);
    });
  };
  apply();

  let timer = null;
  const advance = () => {
    top = (top + 1) % cards.length;
    apply();
  };
  const start = () => {
    if (!timer && !reduce.matches) timer = setInterval(advance, 3400);
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  if (cards.length > 1) {
    start();
    document.addEventListener("visibilitychange", () =>
      document.hidden ? stop() : start()
    );
    reduce.addEventListener("change", () => (reduce.matches ? stop() : start()));
  }
}
