/* ============================================================
   BARNACLES — boot & wiring
   Floating header (wordmark + sound only), day/night clock,
   "come aboard" gate, and routing the address bar to movement
   through the ship.
   ============================================================ */
(function () {
  'use strict';
  function el(id) { return document.getElementById(id); }

  function comeAboard() {
    if (window.BRN.Audio) window.BRN.Audio.init();
    el('gate').classList.add('gone');
    setTimeout(function () { el('gate').style.display = 'none'; }, 1200);
    el('stage').classList.remove('hidden');
    document.body.classList.add('aboard');
    if (!location.hash) location.hash = '#/helm';
    window.BRN.Ship.start();
  }

  function init() {
    if (window.BRN.Weather) window.BRN.Weather.mount();
    if (window.BRN.Clock) window.BRN.Clock.init();

    el('gate-btn').addEventListener('click', comeAboard);

    el('sound-toggle').addEventListener('click', function () {
      var muted = window.BRN.Audio.toggleMute();
      this.classList.toggle('muted', muted);
      this.innerHTML = muted ? '&#9834;&#822;' : '&#9834;';
      this.title = muted ? 'Sound off' : 'Sound on';
    });

    // brand + back/forward + any #/ link → move there
    window.addEventListener('hashchange', function () {
      if (window.BRN.Ship._silent) { window.BRN.Ship._silent = false; return; }
      var key = (location.hash || '').replace('#/', '') || 'helm';
      window.BRN.Ship.go(key, 'fade');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
