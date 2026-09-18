/* kochbuch-bestellen.js — the order form on /kochbuch.

   Pay-what-you-want: a tier radio (name="betrag") or the free field
   (#betrag-custom), never both at once, plus a quantity. The total line under
   the form is recomputed on every change so what PayPal will show is already
   on the page before anyone leaves it.

   On submit the visitor is sent to PayPal's "Buy Now" flow (cmd=_xclick) —
   unlike the donation flow it asks for a shipping address (no_shipping=2) and
   adds the flat shipping amount itself. The <form action> stays a working POST
   fallback with the same fields for when this script never runs. */

const form = document.getElementById('kochbuch-form');

if (form) {
  const custom = document.getElementById('betrag-custom');
  const qty = document.getElementById('anzahl');
  const amountField = document.getElementById('paypal-amount');
  const radios = [...form.querySelectorAll('input[name="betrag"]')];

  const sumAmount = document.getElementById('sum-amount');
  const sumShipping = document.getElementById('sum-shipping');
  const sumTotal = document.getElementById('sum-total');

  const PAYPAL = 'https://www.paypal.com/cgi-bin/webscr';
  const RETURN_URL = 'https://aquisito.de/kochbuch/danke';
  const CANCEL_URL = 'https://aquisito.de/kochbuch';

  /* Flat per order, whatever the quantity — PayPal's `shipping` without
     `shipping2` behaves exactly that way, so page and PayPal agree. */
  const SHIPPING = Number.parseFloat(form.dataset.shipping ?? '2.65');
  /* Lowest tier on the printed cost card; below that the book costs the
     Verein money. */
  const MIN_AMOUNT = Number.parseFloat(custom?.min ?? '1');

  const euro = (n) =>
    n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  /* Accepts "12", "12,50" and "12.50" alike — a German keyboard gives a comma,
     and PayPal wants a dot with at most two decimals. */
  const parseAmount = (raw) => {
    const n = Number.parseFloat(String(raw ?? '').replace(',', '.').trim());
    return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
  };

  const customAmount = () => parseAmount(custom?.value);
  const presetAmount = () => parseAmount(radios.find((r) => r.checked)?.value);
  const currentAmount = () => customAmount() ?? presetAmount();

  const quantity = () => {
    const n = Number.parseInt(qty?.value ?? '1', 10);
    return Number.isInteger(n) && n >= 1 ? Math.min(n, 20) : 1;
  };

  const render = () => {
    const amount = currentAmount();
    const n = quantity();
    if (amountField && amount !== null) amountField.value = amount.toFixed(2);

    if (sumAmount) sumAmount.textContent = amount === null ? '—' : `${n} × ${euro(amount)}`;
    if (sumShipping) sumShipping.textContent = euro(SHIPPING);
    if (sumTotal) sumTotal.textContent = amount === null ? '—' : euro(amount * n + SHIPPING);
  };

  let lastPreset = radios.find((r) => r.checked) ?? radios.find((r) => r.defaultChecked);

  custom?.addEventListener('input', () => {
    if (custom.value.trim() !== '') {
      radios.forEach((radio) => { radio.checked = false; });
    } else if (lastPreset) {
      lastPreset.checked = true;
    }
    custom.setCustomValidity('');
    render();
  });

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        lastPreset = radio;
        if (custom) {
          custom.value = '';
          custom.setCustomValidity('');
        }
      }
      render();
    });
  });

  qty?.addEventListener('input', render);
  qty?.addEventListener('change', () => {
    if (qty) qty.value = String(quantity());
    render();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const amount = currentAmount();

    if (amount === null || amount < MIN_AMOUNT) {
      if (custom) {
        custom.setCustomValidity(
          amount === null
            ? 'Bitte wähle einen Betrag oder gib einen eigenen ein.'
            : `Mindestens ${euro(MIN_AMOUNT)} pro Buch — darunter zahlen wir drauf.`,
        );
        custom.reportValidity();
        custom.focus();
      }
      return;
    }

    const params = new URLSearchParams({
      cmd: '_xclick',
      business: 'info@aquisito.de',
      item_name: 'Kochbuch „Bolivien kocht“',
      item_number: 'kochbuch',
      currency_code: 'EUR',
      amount: amount.toFixed(2),
      quantity: String(quantity()),
      shipping: SHIPPING.toFixed(2),
      no_shipping: '2',
      no_note: '1',
      return: RETURN_URL,
      cancel_return: CANCEL_URL,
      lc: 'DE',
    });

    window.location.href = `${PAYPAL}?${params}`;
  });

  render();
}
