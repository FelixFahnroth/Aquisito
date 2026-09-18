/* kochbuch-video.js — öffnet das Kochbuch-Video in einem nativen <dialog>.

   Enhancement only. Der Link zeigt direkt auf die MP4-Datei; ohne dieses
   Skript öffnet der Browser sie in seinem eigenen Player. Mit Skript bleibt
   die Besucherin auf der Seite. showModal() liefert Fokusfalle, Escape und
   den Backdrop kostenlos — deshalb keine Bibliothek. */

const opener = document.querySelector('[data-video-dialog]');
const dialog = opener && document.getElementById(opener.dataset.videoDialog);

if (opener && dialog && typeof dialog.showModal === 'function') {
  const video = dialog.querySelector('video');
  const closeButton = dialog.querySelector('[data-video-close]');

  /* Anhalten gehört in jeden Weg nach draußen, nicht nur in ein Ereignis:
     sonst spielt der Ton weiter, wenn der Dialog zu ist. */
  const stop = () => {
    if (video && !video.paused) video.pause();
  };

  const open = (event) => {
    event.preventDefault();
    dialog.showModal();
    /* Kein Autoplay — das Video lädt erst, wenn jemand Play drückt. Fokus auf
       den Player, damit die Leertaste sofort startet. */
    video?.focus();
  };

  const shut = () => {
    stop();
    if (dialog.open) dialog.close();
    opener.focus();
  };

  opener.addEventListener('click', open);
  closeButton?.addEventListener('click', shut);

  /* Klick auf den Backdrop: der Dialog selbst ist dann das Ziel, Klicks im
     Inhalt haben ein anderes target. */
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) shut();
  });

  /* Escape: der Browser schließt selbst, wir halten nur an. */
  dialog.addEventListener('cancel', stop);
  /* Und falls der Dialog auf einem Weg zugeht, den wir nicht kennen. */
  dialog.addEventListener('close', () => { stop(); opener.focus(); });
}
