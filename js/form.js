/* form.js — inline validation for the volunteer sign-up.
   Enhancement only: the form carries `required` attributes and posts to a real
   endpoint, so it works with JS disabled. This replaces the browser's native
   bubbles with messages that match the design and are announced politely. */

const form = document.getElementById('anmeldung');
if (form) {
  form.setAttribute('novalidate', '');

  const summary = document.getElementById('anmeldung-status');

  const messages = {
    valueMissing: 'Dieses Feld brauchen wir, um dir antworten zu können.',
    typeMismatch: 'Bitte prüfe die E-Mail-Adresse — da fehlt etwas.',
    checkboxMissing: 'Ohne deine Einwilligung dürfen wir die Anfrage nicht verarbeiten.'
  };

  const icon =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.5" stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 16.5v.01"/></svg>';

  function errorNodeFor(field) {
    const id = `${field.id}-error`;
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement('p');
      node.id = id;
      node.className = 'field__error';
      field.closest('.field').append(node);
    }
    return node;
  }

  function showError(field, message) {
    const node = errorNodeFor(field);
    node.innerHTML = `${icon}<span>${message}</span>`;
    field.setAttribute('aria-invalid', 'true');

    /* Append to the existing describedby chain rather than replacing it —
       the hint text must survive. */
    const described = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if (!described.includes(node.id)) {
      field.setAttribute('aria-describedby', [...described, node.id].join(' '));
    }
  }

  function clearError(field) {
    document.getElementById(`${field.id}-error`)?.remove();
    field.removeAttribute('aria-invalid');
    const described = (field.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((token) => token && token !== `${field.id}-error`);
    if (described.length) field.setAttribute('aria-describedby', described.join(' '));
    else field.removeAttribute('aria-describedby');
  }

  function validate(field) {
    if (field.validity.valid) {
      clearError(field);
      return true;
    }
    const message =
      field.type === 'checkbox' ? messages.checkboxMissing
      : field.validity.typeMismatch ? messages.typeMismatch
      : messages.valueMissing;
    showError(field, message);
    return false;
  }

  /* Validate on blur, but only re-validate on input once a field has already
     failed — nagging while someone is still typing is hostile. */
  form.addEventListener('blur', (event) => {
    if (event.target.matches('[required]')) validate(event.target);
  }, true);

  form.addEventListener('input', (event) => {
    if (event.target.matches('[required][aria-invalid="true"]')) validate(event.target);
  });

  form.addEventListener('submit', async (event) => {
    const fields = [...form.querySelectorAll('[required]')];
    const invalid = fields.filter((field) => !validate(field));

    if (invalid.length > 0) {
      event.preventDefault();

      if (summary) {
        summary.textContent =
          invalid.length === 1
            ? 'Ein Feld fehlt noch. Es ist unten markiert.'
            : `${invalid.length} Felder fehlen noch. Sie sind unten markiert.`;
      }

      invalid[0].focus();
      return;
    }

    /* Alles ausgefüllt: im Hintergrund absenden, damit die Seite stehen bleibt
       und die Antwort hier erscheint. Ohne JavaScript verschickt der Browser
       dasselbe Formular ganz normal an dieselbe Adresse und landet auf
       /anfrage-gesendet — die Weiche dafür sitzt im Dienst, nicht hier. */
    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const original = button?.textContent;
    if (button) { button.disabled = true; button.textContent = 'Wird gesendet …'; }
    if (summary) summary.textContent = 'Anfrage wird gesendet …';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(new FormData(form)),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.ok) {
        /* Die Felder werden entfernt, nicht geleert — ein leeres Formular unter
           einer Erfolgsmeldung sieht aus, als wäre nichts passiert. Der Knopf
           geht mit, deshalb wird er unten auch nicht wiederhergestellt.
           role="status" am Meldungsabsatz sagt es Screenreadern von selbst. */
        if (summary) {
          summary.classList.add('is-success');
          summary.textContent = result.message || 'Danke, deine Anfrage ist angekommen.';
        }
        form.querySelectorAll('.field, fieldset, button, .signup__required, .honeypot')
            .forEach((el) => el.remove());
        return;
      }

      if (summary) {
        summary.classList.add('is-error');
        summary.textContent = result.message
          || 'Das hat gerade nicht geklappt. Schreib uns bitte an info@aquisito.de.';
      }
    } catch {
      if (summary) {
        summary.classList.add('is-error');
        summary.textContent =
          'Keine Verbindung. Bitte versuch es später noch einmal oder schreib an info@aquisito.de.';
      }
    }

    /* Nur der Fehlerfall kommt hier an — im Erfolgsfall ist oben schon
       zurückgekehrt und der Knopf existiert nicht mehr. */
    if (button) { button.disabled = false; button.textContent = original; }
  });
}
