/* nav.js — mobile menu and sticky-header state.
   Enhancement only: without JS the toggle is hidden by CSS and the links stay
   visible, so navigation still works. */

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav__toggle');
const list = document.getElementById('nav-list');

/* ---- sticky header state -------------------------------------------------
   Transparent over the hero on /, solid after 80px. Pages that are solid from
   the start carry .site-header--solid in the markup and opt out here. */

if (header && !header.classList.contains('site-header--solid')) {
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:80px;height:1px;width:1px;';
  document.body.prepend(sentinel);

  new IntersectionObserver(
    ([entry]) => header.classList.toggle('is-stuck', !entry.isIntersecting),
    { threshold: 0 }
  ).observe(sentinel);
}

/* ---- overlay menu -------------------------------------------------------- */

if (toggle && list) {
  const focusableSelector =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function open() {
    toggle.setAttribute('aria-expanded', 'true');
    list.hidden = false;
    document.body.style.overflow = 'hidden';
    list.querySelector(focusableSelector)?.focus();
  }

  function close({ restoreFocus = true } = {}) {
    toggle.setAttribute('aria-expanded', 'false');
    list.hidden = true;
    document.body.style.overflow = '';
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));

  /* Escape closes. Tab is trapped inside the overlay while it is open. */
  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = [...list.querySelectorAll(focusableSelector)];
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* Following a link inside the overlay navigates away — release the scroll
     lock without stealing focus from the destination. */
  list.addEventListener('click', (event) => {
    if (event.target.closest('a') && isOpen()) close({ restoreFocus: false });
  });

  /* The overlay must START closed on mobile — the CSS turns .nav__list into a
     full-screen fixed layer ≤899px, so without this the menu covers the whole
     page on load. On desktop the same list is the inline nav and must stay
     visible and exposed to assistive tech (hidden would remove it from the
     a11y tree even though display:flex keeps it painted). Sync on load and
     whenever the viewport crosses the breakpoint. */
  const desktop = matchMedia('(min-width: 900px)');
  function applyBreakpoint() {
    if (desktop.matches) {
      list.hidden = false;
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    } else if (!isOpen()) {
      list.hidden = true;
    }
  }
  applyBreakpoint();
  desktop.addEventListener('change', applyBreakpoint);
}
