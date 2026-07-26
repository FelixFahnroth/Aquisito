/* donate.js — amount selector and live outcome line.
   Enhancement only. Without JS the radios still submit their value to PayPal
   and the default outcome line stays in the DOM as real text. */

const form = document.getElementById('spenden-form');
if (form) {
  const outcome = document.getElementById('spenden-outcome');
  const custom = document.getElementById('betrag-custom');
  const customRadio = document.getElementById('betrag-eigener');
  const amountField = document.getElementById('paypal-amount');

  /* Outcome lines live in the markup as data-outcome on each radio, so the
     copy stays with the content and out of the script. */
  function sync(radio) {
    if (!radio) return;
    if (outcome && radio.dataset.outcome) outcome.textContent = radio.dataset.outcome;
    if (amountField && radio.value !== 'custom') amountField.value = radio.value;
  }

  form.addEventListener('change', (event) => {
    const radio = event.target.closest('input[name="betrag"]');
    if (radio) {
      /* Selecting a preset clears the custom field, and vice versa. */
      if (radio.value !== 'custom' && custom) custom.value = '';
      sync(radio);
      return;
    }

    if (event.target === custom) {
      if (customRadio) customRadio.checked = true;
      if (amountField) amountField.value = custom.value;
      if (outcome && custom.value) {
        outcome.textContent = `${formatEuro(custom.value)} gehen direkt in die Projekte von CADSE.`;
      }
    }
  });

  /* Typing in the custom field selects its radio immediately, so the two
     controls never disagree about what is selected. */
  custom?.addEventListener('focus', () => {
    if (customRadio) customRadio.checked = true;
  });

  function formatEuro(value) {
    const number = Number.parseFloat(String(value).replace(',', '.'));
    if (!Number.isFinite(number) || number <= 0) return '';
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: number % 1 === 0 ? 0 : 2
    }).format(number);
  }

  sync(form.querySelector('input[name="betrag"]:checked'));
}
