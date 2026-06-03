/* ============================================================
   BARNACLES — day/night clock
   Smoothly drifts night -> day -> night forever. Drives CSS
   custom properties (sky colors, ambient light, sun/moon, dawn
   glow) and exposes phase + storminess for the weather engine.
   Calmer & brighter by day; darker & stormier at night.
   ============================================================ */
(function () {
  'use strict';

  // Full loop length. 10 min => ~5 min to reach day, ~5 min back to night.
  // Change this one number to speed up / slow down the cycle.
  var CYCLE_MS = 600000;

  // sky gradient endpoints
  var NIGHT_TOP = [5, 8, 16],    NIGHT_BOT = [11, 26, 36];
  var DAY_TOP   = [110, 150, 184], DAY_BOT  = [180, 205, 214];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function mix(c1, c2, t) {
    return 'rgb(' + Math.round(lerp(c1[0], c2[0], t)) + ',' +
                    Math.round(lerp(c1[1], c2[1], t)) + ',' +
                    Math.round(lerp(c1[2], c2[2], t)) + ')';
  }

  var Clock = {
    phase: 0,        // 0 = deep night, 1 = full midday
    storm: 1,        // 1 = full storm (night), ~0.2 by day
    start: Date.now(),
    _last: 0,
    paused: false
  };

  function update() {
    if (Clock.paused) return schedule();
    var t = ((Date.now() - Clock.start) % CYCLE_MS) / CYCLE_MS; // 0..1
    // cosine ease: night(0) -> day(1) -> night(0)
    var phase = (1 - Math.cos(t * Math.PI * 2)) / 2;
    Clock.phase = phase;
    Clock.storm = 0.18 + 0.82 * (1 - phase); // stormier at night

    var top = mix(NIGHT_TOP, DAY_TOP, phase);
    var bot = mix(NIGHT_BOT, DAY_BOT, phase);
    // dawn/dusk warm band peaks during the transitions
    var warm = Math.pow(Math.max(0, 1 - Math.abs(phase - 0.5) * 2), 1.6);

    var r = document.documentElement.style;
    r.setProperty('--sky-top', top);
    r.setProperty('--sky-bot', bot);
    r.setProperty('--moon-op', (1 - phase).toFixed(3));
    r.setProperty('--sun-op', phase.toFixed(3));
    r.setProperty('--dawn-op', (warm * 0.8).toFixed(3));
    // ambient overlay: deep blue at night fading away by day
    r.setProperty('--ambient', 'rgba(4,12,24,' + (0.5 * (1 - phase)).toFixed(3) + ')');
    // a daylight wash that lifts indoor scenes a touch
    r.setProperty('--daylight', (phase).toFixed(3));
    schedule();
  }

  function schedule() { setTimeout(update, 240); }

  Clock.init = function () { Clock.start = Date.now(); update(); };

  window.BRN = window.BRN || {};
  window.BRN.Clock = Clock;
})();
