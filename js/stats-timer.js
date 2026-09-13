/* stats-timer.js — the running duration in the Kennzahlen-Banner.

   Counts from the founding: 9 May 2020, 12:00 local German time. That date was
   inside summer time, so the instant is 12:00+02:00 (CEST) — written as an
   explicit offset in the datetime attribute rather than left to the parser.

   The markup already contains the six fields (J M T Std Min Sek); this only
   writes numbers into them, so the layout never depends on the script. Without
   JavaScript the fields stay hidden and the line above keeps reading "seit dem
   9. Mai 2020", which stays true forever.

   There is deliberately no aria-live: a value that changes every second would
   make a screen reader talk over everything else. The <time datetime> carries
   the founding instant for anything reading the page programmatically. */

const clock = document.getElementById('aktiv-seit');

if (clock) {
  const start = new Date(clock.getAttribute('datetime'));
  const cells = [...clock.querySelectorAll('.clock__value')].sort(
    (a, b) => a.dataset.unit - b.dataset.unit
  );

  if (!Number.isNaN(start.getTime()) && cells.length === 6) {
    /* Calendar-aware, so "ein Monat" means a real month rather than 30 days.
       Borrowing runs from the smallest unit up; days borrow the length of the
       month before the current one, which is what makes month ends behave. */
    const breakdown = (from, to) => {
      let y = to.getFullYear() - from.getFullYear();
      let mo = to.getMonth() - from.getMonth();
      let d = to.getDate() - from.getDate();
      let h = to.getHours() - from.getHours();
      let mi = to.getMinutes() - from.getMinutes();
      let s = to.getSeconds() - from.getSeconds();

      if (s < 0) { s += 60; mi -= 1; }
      if (mi < 0) { mi += 60; h -= 1; }
      if (h < 0) { h += 24; d -= 1; }
      if (d < 0) {
        d += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
        mo -= 1;
      }
      if (mo < 0) { mo += 12; y -= 1; }

      return [y, mo, d, h, mi, s];
    };

    const tick = () => {
      const now = new Date();
      if (now < start) return;            // clock skew: leave the fields alone

      const values = breakdown(start, now);
      values.forEach((n, i) => {
        /* Every field is two digits, so the six columns stay the same width
           whatever the numbers do. */
        const text = String(n).padStart(2, '0');
        /* Touch the DOM only when the number actually changed — five of the six
           fields are unchanged on almost every tick. */
        if (cells[i].textContent !== text) cells[i].textContent = text;
      });
    };

    tick();
    setInterval(tick, 1000);
  }
}
