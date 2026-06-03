/* ============================================================
   BARNACLES — procedural zone audio engine
   Everything here is synthesized in the browser with the Web
   Audio API. No sound files, no copyright, nothing to download.

   Layers (always running once unlocked, mixed to taste per zone):
     waves   - low rolling surf
     surf    - brighter wash / foam
     wind    - airy storm wind
     rumble  - distant thunder bed
     creak   - random hull timber creaks
     gulls   - occasional gull cries
     fire     - forge crackle
     bubbles  - underwater blips

   A zone sets a target gain for each layer plus a master low-pass
   cutoff (the "muffle"). Moving rooms = crossfade to a new zone.
   ============================================================ */
(function () {
  'use strict';

  var ZONES = {
    // open air, weather close: the main deck / hub
    deck:   { waves:.55, surf:.45, wind:.5,  rumble:.5,  creak:.25, gulls:.5,  fire:0,   bubbles:0, cutoff:16000, thunder:true  },
    // stern cabin: cozy, weather softened
    cabin:  { waves:.32, surf:.14, wind:.2,  rumble:.32, creak:.5,  gulls:.1,  fire:.18, bubbles:0, cutoff:2600,  thunder:true  },
    // deep below decks: muffled, all timber
    below:  { waves:.22, surf:.05, wind:.08, rumble:.22, creak:.7,  gulls:0,   fire:0,   bubbles:0, cutoff:1200,  thunder:false },
    // the forge: fire and iron
    forge:  { waves:.16, surf:.04, wind:.06, rumble:.14, creak:.3,  gulls:0,   fire:.85, bubbles:0, cutoff:5200,  thunder:false },
    // overboard — calm: muffled storm above, the odd quiet bubble
    water:  { waves:.5,  surf:.1,  wind:.05, rumble:.2,  creak:.06, gulls:0,   fire:0,   bubbles:.28,cutoff:520,  thunder:false },
    // ashore: brighter, gulls, gentle surf
    island: { waves:.5,  surf:.6,  wind:.35, rumble:.12, creak:0,   gulls:.8,  fire:0,   bubbles:0, cutoff:18000, thunder:false }
  };

  var A = {
    ctx:null, ready:false, muted:false, zone:'deck',
    nodes:{}, master:null, lpf:null, layers:{}, _thunderTimer:0, _creakTimer:0, _gullTimer:0
  };

  function noiseBuffer(ctx, seconds, color) {
    var len = Math.floor(ctx.sampleRate * seconds);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    var last = 0;
    for (var i = 0; i < len; i++) {
      var white = Math.random() * 2 - 1;
      if (color === 'brown') { last = (last + 0.02 * white) / 1.02; d[i] = last * 3.2; }
      else if (color === 'pink') { last = 0.96 * last + 0.04 * white; d[i] = (white * 0.3 + last); }
      else d[i] = white;
    }
    return buf;
  }

  function makeLoopNoise(color, secs) {
    var src = A.ctx.createBufferSource();
    src.buffer = noiseBuffer(A.ctx, secs || 4, color);
    src.loop = true;
    return src;
  }

  // a layer = source(s) -> filter -> gain -> master
  function layer(name, gainVal) {
    var g = A.ctx.createGain();
    g.gain.value = 0;
    g.connect(A.lpf);
    A.layers[name] = { gain: g, target: 0 };
    return g;
  }

  function buildWaves() {
    // brown noise, slow band, breathing amplitude
    var g = A.layers.waves.gain;
    var src = makeLoopNoise('brown', 6);
    var bp = A.ctx.createBiquadFilter(); bp.type = 'lowpass'; bp.frequency.value = 420; bp.Q.value = .6;
    var swell = A.ctx.createGain(); swell.gain.value = .6;
    var lfo = A.ctx.createOscillator(); lfo.frequency.value = 0.08;
    var lfoGain = A.ctx.createGain(); lfoGain.gain.value = .4;
    lfo.connect(lfoGain); lfoGain.connect(swell.gain);
    src.connect(bp); bp.connect(swell); swell.connect(g);
    src.start(); lfo.start();
  }

  function buildSurf() {
    var g = A.layers.surf.gain;
    var src = makeLoopNoise('pink', 5);
    var bp = A.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = .5;
    var swell = A.ctx.createGain(); swell.gain.value = .5;
    var lfo = A.ctx.createOscillator(); lfo.frequency.value = 0.13;
    var lfoGain = A.ctx.createGain(); lfoGain.gain.value = .45;
    lfo.connect(lfoGain); lfoGain.connect(swell.gain);
    src.connect(bp); bp.connect(swell); swell.connect(g);
    src.start(); lfo.start();
  }

  function buildWind() {
    var g = A.layers.wind.gain;
    var src = makeLoopNoise('pink', 5);
    var bp = A.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 2.5;
    var lfo = A.ctx.createOscillator(); lfo.frequency.value = 0.05;
    var lfoGain = A.ctx.createGain(); lfoGain.gain.value = 380;
    lfo.connect(lfoGain); lfoGain.connect(bp.frequency);
    src.connect(bp); bp.connect(g);
    src.start(); lfo.start();
  }

  function buildRumble() {
    var g = A.layers.rumble.gain;
    var src = makeLoopNoise('brown', 7);
    var lp = A.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 120;
    src.connect(lp); lp.connect(g);
    src.start();
  }

  function buildFire() {
    var g = A.layers.fire.gain;
    var src = makeLoopNoise('pink', 4);
    var bp = A.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1100; bp.Q.value = .8;
    src.connect(bp); bp.connect(g);
    src.start();
    // crackle pops
    (function pop() {
      if (A.layers.fire.target > 0.05 && A.ready) {
        var t = A.ctx.currentTime;
        var o = A.ctx.createGain(); o.gain.setValueAtTime(0, t);
        var n = A.ctx.createBufferSource(); n.buffer = noiseBuffer(A.ctx, .05, 'white');
        var f = A.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2200 + Math.random()*2200;
        n.connect(f); f.connect(o); o.connect(g);
        o.gain.linearRampToValueAtTime(.5 * A.layers.fire.target, t + .005);
        o.gain.exponentialRampToValueAtTime(.001, t + .08);
        n.start(t); n.stop(t + .1);
      }
      setTimeout(pop, 60 + Math.random() * 180);
    })();
  }

  function buildBubbles() {
    var g = A.layers.bubbles.gain;
    (function blip() {
      if (A.layers.bubbles.target > 0.05 && A.ready) {
        var t = A.ctx.currentTime;
        var o = A.ctx.createOscillator(); o.type = 'sine';
        var og = A.ctx.createGain(); og.gain.value = 0;
        var f0 = 240 + Math.random() * 360;
        o.frequency.setValueAtTime(f0, t);
        o.frequency.exponentialRampToValueAtTime(f0 * 2.1, t + .14);
        og.gain.linearRampToValueAtTime(.10 * A.layers.bubbles.target, t + .015);
        og.gain.exponentialRampToValueAtTime(.001, t + .2);
        o.connect(og); og.connect(g); o.start(t); o.stop(t + .24);
      }
      // gentle and infrequent — a calm place to sit
      setTimeout(blip, 700 + Math.random() * 2400);
    })();
  }

  function creakOnce() {
    if (!A.ready) return;
    var g = A.layers.creak.gain;
    var t = A.ctx.currentTime;
    var o = A.ctx.createOscillator(); o.type = 'sawtooth';
    var f = 70 + Math.random() * 90;
    o.frequency.setValueAtTime(f, t);
    o.frequency.linearRampToValueAtTime(f * (1.1 + Math.random()*0.5), t + .5 + Math.random()*0.6);
    var bp = A.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 320; bp.Q.value = 7;
    var og = A.ctx.createGain(); og.gain.value = 0;
    var dur = .6 + Math.random() * 0.9;
    og.gain.linearRampToValueAtTime(.5, t + .15);
    og.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(bp); bp.connect(og); og.connect(g);
    o.start(t); o.stop(t + dur + .1);
  }

  function gullOnce() {
    if (!A.ready) return;
    var g = A.layers.gulls.gain;
    var t = A.ctx.currentTime;
    for (var k = 0; k < 2 + Math.floor(Math.random()*2); k++) {
      var s = t + k * (0.18 + Math.random()*0.12);
      var o = A.ctx.createOscillator(); o.type = 'triangle';
      var base = 900 + Math.random() * 500;
      o.frequency.setValueAtTime(base, s);
      o.frequency.linearRampToValueAtTime(base * 1.5, s + .08);
      o.frequency.linearRampToValueAtTime(base * 1.1, s + .2);
      var og = A.ctx.createGain(); og.gain.value = 0;
      og.gain.linearRampToValueAtTime(.18, s + .04);
      og.gain.exponentialRampToValueAtTime(.001, s + .25);
      o.connect(og); og.connect(g); o.start(s); o.stop(s + .3);
    }
  }

  // big thunder crack (also called by lightning visuals)
  A.thunder = function () {
    if (!A.ready || A.muted) return;
    var t = A.ctx.currentTime;
    var n = A.ctx.createBufferSource(); n.buffer = noiseBuffer(A.ctx, 2.4, 'brown');
    var lp = A.ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(800, t);
    lp.frequency.exponentialRampToValueAtTime(70, t + 2.0);
    var g = A.ctx.createGain(); g.gain.value = 0;
    g.gain.linearRampToValueAtTime(.9, t + .04);
    g.gain.linearRampToValueAtTime(.5, t + .5);
    g.gain.exponentialRampToValueAtTime(.001, t + 2.3);
    n.connect(lp); lp.connect(g); g.connect(A.master);
    n.start(t); n.stop(t + 2.5);
  };

  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    A.ctx = new AC();

    A.master = A.ctx.createGain();
    A.master.gain.value = 0.0;
    A.lpf = A.ctx.createBiquadFilter();
    A.lpf.type = 'lowpass';
    A.lpf.frequency.value = 16000;
    A.lpf.connect(A.master);
    A.master.connect(A.ctx.destination);

    ['waves','surf','wind','rumble','creak','gulls','fire','bubbles'].forEach(function (n) { layer(n); });

    buildWaves(); buildSurf(); buildWind(); buildRumble(); buildFire(); buildBubbles();

    A.ready = true;
    A.setZone(A.zone, true);

    // fade master in
    var t = A.ctx.currentTime;
    A.master.gain.cancelScheduledValues(t);
    A.master.gain.setValueAtTime(0, t);
    A.master.gain.linearRampToValueAtTime(A.muted ? 0 : 0.9, t + 2.0);

    // random ambient events
    function scheduleCreak() { creakOnce(); A._creakTimer = setTimeout(scheduleCreak, 3500 + Math.random() * 7000); }
    function scheduleGull() { if ((ZONES[A.zone].gulls || 0) > .2) gullOnce(); A._gullTimer = setTimeout(scheduleGull, 4000 + Math.random() * 9000); }
    function scheduleThunder() {
      if (ZONES[A.zone].thunder && Math.random() > .35) { if (window.BRN && BRN.Weather) BRN.Weather.strike(); else A.thunder(); }
      A._thunderTimer = setTimeout(scheduleThunder, 12000 + Math.random() * 22000);
    }
    scheduleCreak(); scheduleGull(); scheduleThunder();
  };

  A.setZone = function (name, instant) {
    if (!ZONES[name]) name = 'deck';
    A.zone = name;
    if (!A.ready) return;
    var z = ZONES[name];
    var t = A.ctx.currentTime;
    var ramp = instant ? 0.01 : 1.6;
    ['waves','surf','wind','rumble','creak','gulls','fire','bubbles'].forEach(function (n) {
      var L = A.layers[n];
      L.target = z[n] || 0;
      L.gain.gain.cancelScheduledValues(t);
      L.gain.gain.setValueAtTime(L.gain.gain.value, t);
      L.gain.gain.linearRampToValueAtTime(L.target, t + ramp);
    });
    A.lpf.frequency.cancelScheduledValues(t);
    A.lpf.frequency.setValueAtTime(A.lpf.frequency.value, t);
    A.lpf.frequency.linearRampToValueAtTime(z.cutoff, t + ramp);
  };

  A.toggleMute = function () {
    A.muted = !A.muted;
    if (!A.ready) return A.muted;
    var t = A.ctx.currentTime;
    A.master.gain.cancelScheduledValues(t);
    A.master.gain.setValueAtTime(A.master.gain.value, t);
    A.master.gain.linearRampToValueAtTime(A.muted ? 0 : 0.9, t + 0.4);
    return A.muted;
  };

  // a soft wooden creak/footfall when you move through the ship
  A.move = function () {
    if (!A.ready || A.muted) return;
    var t = A.ctx.currentTime;
    // low thud
    var n = A.ctx.createBufferSource(); n.buffer = noiseBuffer(A.ctx, .3, 'brown');
    var lp = A.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 180;
    var g = A.ctx.createGain(); g.gain.value = 0;
    g.gain.linearRampToValueAtTime(.4, t + .02);
    g.gain.exponentialRampToValueAtTime(.001, t + .28);
    n.connect(lp); lp.connect(g); g.connect(A.master);
    n.start(t); n.stop(t + .3);
    // timber creak
    var o = A.ctx.createOscillator(); o.type = 'sawtooth';
    var f = 80 + Math.random() * 60; o.frequency.setValueAtTime(f, t);
    o.frequency.linearRampToValueAtTime(f * 1.4, t + .5);
    var bp = A.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 300; bp.Q.value = 8;
    var og = A.ctx.createGain(); og.gain.value = 0;
    og.gain.linearRampToValueAtTime(.22, t + .12);
    og.gain.exponentialRampToValueAtTime(.001, t + .7);
    o.connect(bp); bp.connect(og); og.connect(A.master);
    o.start(t); o.stop(t + .8);
  };

  window.BRN = window.BRN || {};
  window.BRN.Audio = A;
})();
