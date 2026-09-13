/* stats-timer.js — the running duration in the Kennzahlen-Banner.

   Counts from the founding: 9 May 2020, 12:00 local German time. That date was
   inside summer time, so the instant is 12:00+02:00 (CEST) — written as an
   explicit offset in the datetime attribute rather than left to the parser.

   Without this script the markup keeps reading "seit dem 9. Mai 2020", which
   stays true forever; the script upgrades it to "seit 6 Jahren, 4 Monaten …".
   There is deliberately no aria-live: a value that changes every second would
   make a screen reader talk over everything else. The <time datetime> carries
   the founding instant for anything reading the page programmatically. */

const el = document.getElementById('aktiv-seit');

if (el) {
  const start = new Date(el.getAttribute('datetime'));

  if (!Number.isNaN(start.getTime())) {
    /* Singular is the dative after "seit": seit einem Jahr, seit zwei Jahren. */
    const UNITS = [
      ['Jahr', 'Jahren'],
      ['Monat', 'Monaten'],
      ['Tag', 'Tagen'],
      ['Stunde', 'Stunden'],
      ['Minute', 'Minuten'],
      ['Sekunde', 'Sekunden'],
    ];

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

    const format = (values) => {
      const parts = [];
      for (const [i, n] of values.entries()) {
        /* Skip leading zeroes only — once something is on the clock, keep the
           smaller units so the seconds never vanish mid-tick. */
        if (!parts.length && n === 0 && i < values.length - 1) continue;
        /* U+00A0 between number and unit: a line break there would leave a
           stray digit hanging at the end of a line. */
        parts.push(`${n} ${UNITS[i][n === 1 ? 0 : 1]}`);
      }
      if (parts.length === 1) return parts[0];
      return `${parts.slice(0, -1).join(', ')} und ${parts[parts.length - 1]}`;
    };

    const tick = () => {
      const now = new Date();
      if (now < start) return;            // clock skew: leave the date in place
      el.textContent = format(breakdown(start, now));
    };

    tick();
    setInterval(tick, 1000);
  }
}
