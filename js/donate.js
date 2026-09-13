/* donate.js — the donation widget on /spenden.

   One amount, two ways to set it: a preset radio (name="betrag") or the free
   field (#betrag-custom). The two never hold a value at the same time — typing
   in the field clears the presets, picking a preset clears the field — so what
   is submitted is always what is visibly selected.

   On submit the form is intercepted and the visitor is sent to PayPal with the
   amount in the query string. The <form action> stays a working POST fallback
   for the case where this script never runs. */

const form = document.getElementById('spenden-form');

if (form) {
  const custom = document.getElementById('betrag-custom');
  const amountField = document.getElementById('paypal-amount');
  const radios = [...form.querySelectorAll('input[name="betrag"]')];

  const PAYPAL = 'https://www.paypal.com/cgi-bin/webscr';
  /* Keeps /spenden/danke reachable after a donation; the hosted-button form
     carried the same return URL in a hidden field. */
  const RETURN_URL = 'https://aquisito.de/spenden/danke';

  /* Accepts "12", "12,50" and "12.50" alike — a German keyboard gives a comma,
     and PayPal wants a dot with at most two decimals. */
  const parseAmount = (raw) => {
    const n = Number.parseFloat(String(raw ?? '').replace(',', '.').trim());
    return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
  };

  const customAmount = () => parseAmount(custom?.value);
  const presetAmount = () =>
    parseAmount(radios.find((r) => r.checked)?.value);

  /* The free field wins whenever it holds something usable. */
  const currentAmount = () => customAmount() ?? presetAmount();

  /* Mirrored into the hidden field so the no-JS POST fallback and the visible
     selection never disagree. */
  const syncHiddenField = () => {
    const amount = currentAmount();
    if (amountField && amount !== null) amountField.value = amount.toFixed(2);
  };

  /* The preset to come back to when the free field is emptied again, so the
     widget is never left with nothing selected at all. */
  let lastPreset = radios.find((r) => r.checked) ?? radios.find((r) => r.defaultChecked);

  /* Typing a free amount clears the presets, so only one is ever lit. */
  custom?.addEventListener('input', () => {
    if (custom.value.trim() !== '') {
      radios.forEach((radio) => { radio.checked = false; });
    } else if (lastPreset) {
      lastPreset.checked = true;
    }
    custom.setCustomValidity('');
    syncHiddenField();
  });

  /* And the other direction, so picking a preset empties the free field. */
  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        lastPreset = radio;
        if (custom) {
          custom.value = '';
          custom.setCustomValidity('');
        }
      }
      syncHiddenField();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const amount = currentAmount();

    if (amount === null) {
      /* Nothing usable: say so on the field the visitor was last in rather
         than navigating to PayPal with an empty amount. */
      if (custom) {
        custom.setCustomValidity('Bitte wähle einen Betrag oder gib einen eigenen ein.');
        custom.reportValidity();
        custom.focus();
      }
      return;
    }

    const params = new URLSearchParams({
      cmd: '_donations',
      business: 'info@aquisito.de',
      item_name: 'Spende Aquisito e.V.',
      currency_code: 'EUR',
      amount: amount.toFixed(2),
      return: RETURN_URL,
    });

    window.location.href = `${PAYPAL}?${params}`;
  });

  syncHiddenField();
}
