/* ============================================================
   BARNACLES — weather & atmosphere on a single canvas
   Modes: storm (rain + lightning), cabin (embers/dust),
   deep (slow drifting motes), water (rising bubbles + caustics),
   shore (light haze + few gulls dots). Drives the #lightning
   flash overlay and asks the audio engine for thunder.
   ============================================================ */
(function () {
  'use strict';

  var W = { canvas:null, ctx:null, mode:'storm', w:0, h:0, raf:0, t:0,
            rain:[], motes:[], bubbles:[], flashEl:null, _nextStrike:0 };

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    W.w = W.canvas.width = window.innerWidth * devicePixelRatio;
    W.h = W.canvas.height = window.innerHeight * devicePixelRatio;
    W.canvas.style.width = window.innerWidth + 'px';
    W.canvas.style.height = window.innerHeight + 'px';
  }

  function seed() {
    W.rain = [];
    for (var i = 0; i < 320; i++) W.rain.push({ x: rand(0, W.w), y: rand(0, W.h), len: rand(12, 30) * devicePixelRatio, sp: rand(14, 26) * devicePixelRatio, w: rand(.5, 1.4) * devicePixelRatio });
    W.motes = [];
    for (var j = 0; j < 70; j++) W.motes.push({ x: rand(0, W.w), y: rand(0, W.h), r: rand(.6, 2.6) * devicePixelRatio, sp: rand(.1, .6) * devicePixelRatio, dx: rand(-.3, .3) * devicePixelRatio, life: rand(0, 1) });
    W.bubbles = [];
    for (var k = 0; k < 60; k++) W.bubbles.push({ x: rand(0, W.w), y: rand(0, W.h), r: rand(1, 5) * devicePixelRatio, sp: rand(.6, 2.2) * devicePixelRatio, wob: rand(0, 6.28) });
  }

  function drawRain(intensity) {
    var c = W.ctx;
    c.strokeStyle = 'rgba(180,205,225,' + (0.18 * intensity) + ')';
    c.lineCap = 'round';
    for (var i = 0; i < W.rain.length; i++) {
      var d = W.rain[i];
      c.lineWidth = d.w;
      c.beginPath();
      c.moveTo(d.x, d.y);
      c.lineTo(d.x - 2 * devicePixelRatio, d.y + d.len);
      c.stroke();
      d.y += d.sp; d.x -= 2 * devicePixelRatio * intensity;
      if (d.y > W.h) { d.y = -d.len; d.x = rand(0, W.w + 200); }
      if (d.x < -20) d.x = W.w;
    }
  }

  function drawMotes(color, speedMul) {
    var c = W.ctx;
    for (var i = 0; i < W.motes.length; i++) {
      var m = W.motes[i];
      m.life += 0.005;
      var a = (0.35 + 0.35 * Math.sin(m.life * 3)) ;
      c.fillStyle = color.replace('A', (a * 0.5).toFixed(3));
      c.beginPath();
      c.arc(m.x, m.y, m.r, 0, 6.2832);
      c.fill();
      m.y -= m.sp * speedMul; m.x += m.dx + Math.sin(m.life) * .3 * devicePixelRatio;
      if (m.y < -10) { m.y = W.h + 10; m.x = rand(0, W.w); }
    }
  }

  function drawBubbles() {
    var c = W.ctx;
    c.strokeStyle = 'rgba(150,200,210,0.4)';
    for (var i = 0; i < W.bubbles.length; i++) {
      var b = W.bubbles[i];
      c.lineWidth = devicePixelRatio;
      c.beginPath();
      c.arc(b.x + Math.sin(W.t * .02 + b.wob) * 8 * devicePixelRatio, b.y, b.r, 0, 6.2832);
      c.stroke();
      b.y -= b.sp;
      if (b.y < -10) { b.y = W.h + 10; b.x = rand(0, W.w); }
    }
  }

  function caustics() {
    // soft moving blue overlay for underwater
    var c = W.ctx;
    var g = c.createLinearGradient(0, 0, 0, W.h);
    g.addColorStop(0, 'rgba(20,70,90,0.20)');
    g.addColorStop(1, 'rgba(5,20,35,0.45)');
    c.fillStyle = g;
    c.fillRect(0, 0, W.w, W.h);
  }

  function loop() {
    W.t++;
    var c = W.ctx;
    c.clearRect(0, 0, W.w, W.h);

    if (W.mode === 'storm') {
      drawRain(1);
      drawMotes('rgba(200,210,220,A)', 0.4);
      maybeStrike();
    } else if (W.mode === 'cabin') {
      drawMotes('rgba(230,180,90,A)', 0.5); // warm embers
      drawRain(0.25);
    } else if (W.mode === 'deep') {
      drawMotes('rgba(150,170,180,A)', 0.25); // slow dust
    } else if (W.mode === 'forge') {
      drawMotes('rgba(255,150,60,A)', 0.9); // sparks rising
    } else if (W.mode === 'water') {
      caustics();
      drawBubbles();
    } else if (W.mode === 'shore') {
      drawMotes('rgba(220,225,210,A)', 0.3);
      drawRain(0.1);
    }

    W.raf = requestAnimationFrame(loop);
  }

  function maybeStrike() {
    if (W.t > W._nextStrike) {
      W._nextStrike = W.t + rand(280, 900);
      W.strike();
    }
  }

  W.strike = function () {
    if (W.flashEl) {
      W.flashEl.classList.remove('flash');
      void W.flashEl.offsetWidth; // reflow to restart anim
      W.flashEl.classList.add('flash');
    }
    if (window.BRN && BRN.Audio && BRN.Audio.ready) {
      setTimeout(function () { BRN.Audio.thunder(); }, rand(250, 1400));
    }
  };

  W.setMode = function (m) { W.mode = m; };

  W.mount = function () {
    W.canvas = document.getElementById('weather');
    W.flashEl = document.getElementById('lightning');
    if (!W.canvas) return;
    W.ctx = W.canvas.getContext('2d');
    resize(); seed();
    window.addEventListener('resize', function () { resize(); seed(); });
    if (!W.raf) loop();
  };

  window.BRN = window.BRN || {};
  window.BRN.Weather = W;
})();
