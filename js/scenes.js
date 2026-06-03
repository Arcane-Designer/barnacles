/* ============================================================
   BARNACLES — scenes
   A stylized SVG backdrop for each location so every part of the
   ship looks distinct. Outdoor scenes leave the sky transparent
   so the day/night #sky shows through; indoor scenes are opaque
   (the #ambient overlay still darkens them at night).

   If a real image exists at assets/rooms/<key>.jpg it is layered
   on top automatically (see ship.js) and these become the
   fallback — so the site looks good now and better with art.
   ============================================================ */
(function () {
  'use strict';
  var VB = '0 0 1600 900';
  function svg(inner) {
    return '<svg viewBox="' + VB + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }

  // shared bits ------------------------------------------------
  function sea(yTop) {
    // semi-transparent dark sea so #sky/ambient still read through edges
    return '<rect x="0" y="' + yTop + '" width="1600" height="' + (900 - yTop) + '" fill="#0c2630"/>' +
           '<rect x="0" y="' + yTop + '" width="1600" height="' + (900 - yTop) + '" fill="url(#seaG)"/>' +
           '<g stroke="#1f4a55" stroke-width="2" opacity="0.5">' +
             waves(yTop + 30) + waves(yTop + 80) + waves(yTop + 140) + '</g>';
  }
  function waves(y) {
    var p = 'M0 ' + y; for (var x = 0; x <= 1600; x += 80) p += ' q 40 -12 80 0';
    return '<path d="' + p + '" fill="none"/>';
  }
  function planks(y, h) {
    var s = '<rect x="0" y="' + y + '" width="1600" height="' + h + '" fill="url(#deckG)"/>';
    for (var x = 0; x < 1600; x += 110) s += '<rect x="' + x + '" y="' + y + '" width="3" height="' + h + '" fill="#241608" opacity="0.5"/>';
    for (var yy = y + 40; yy < y + h; yy += 60) s += '<rect x="0" y="' + yy + '" width="1600" height="2" fill="#1c1206" opacity="0.4"/>';
    return s;
  }
  function defs(extra) {
    return '<defs>' +
      '<linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a3f49"/><stop offset="1" stop-color="#06141b"/></linearGradient>' +
      '<linearGradient id="deckG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4a28"/><stop offset="1" stop-color="#3a2615"/></linearGradient>' +
      '<linearGradient id="woodWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c1d10"/><stop offset="1" stop-color="#160d06"/></linearGradient>' +
      '<radialGradient id="lant" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffce6e"/><stop offset="60%" stop-color="#b8801f" stop-opacity="0.4"/><stop offset="100%" stop-color="#b8801f" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="fire" cx="50%" cy="60%" r="55%"><stop offset="0" stop-color="#ffd36b"/><stop offset="35%" stop-color="#ff8a2a"/><stop offset="80%" stop-color="#7a2a0a" stop-opacity="0.5"/><stop offset="100%" stop-color="#7a2a0a" stop-opacity="0"/></radialGradient>' +
      (extra || '') + '</defs>';
  }
  function rope(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#241a0e" stroke-width="4" opacity="0.7"/>'; }
  function mast(x, top, bot) { return '<rect x="' + (x - 14) + '" y="' + top + '" width="28" height="' + (bot - top) + '" fill="#3a2614"/>'; }

  var scenes = {

    /* ---- QUARTERDECK / HELM (start) ---- */
    helm: { indoor: false, render: function () {
      return svg(defs() +
        sea(330) +
        // aft rail far
        '<rect x="120" y="300" width="1360" height="14" rx="6" fill="#3a2614"/>' +
        planks(470, 430) +
        // binnacle + the wheel
        '<g transform="translate(800,560)">' +
          '<rect x="-30" y="150" width="60" height="120" fill="#2a1a0c"/>' +
          '<circle cx="0" cy="120" r="150" fill="none" stroke="#5a3d22" stroke-width="26"/>' +
          '<circle cx="0" cy="120" r="150" fill="none" stroke="#3a2614" stroke-width="10"/>' +
          '<circle cx="0" cy="120" r="40" fill="#5a3d22"/>' +
          spokes(0, 120, 40, 190) +
          '</g>' +
        // side rails
        '<rect x="0" y="430" width="40" height="470" fill="#3a2614"/>' +
        '<rect x="1560" y="430" width="40" height="470" fill="#3a2614"/>' +
        // lanterns
        '<circle cx="180" cy="360" r="60" fill="url(#lant)" opacity="0.7"/>' +
        '<circle cx="1420" cy="360" r="60" fill="url(#lant)" opacity="0.7"/>'
      );
    }},

    /* ---- MAIN DECK / WAIST (capstan) ---- */
    maindeck: { indoor: false, render: function () {
      return svg(defs() +
        sea(300) +
        // masts
        '<rect x="486" y="0" width="28" height="520" fill="#3a2614"/>' +
        '<rect x="1086" y="0" width="28" height="520" fill="#3a2614"/>' +
        // rigging
        '<g>' + rope(500, 60, 200, 430) + rope(500, 60, 800, 430) + rope(1100, 90, 1400, 430) + rope(1100, 90, 800, 430) + '</g>' +
        planks(430, 470) +
        // capstan center
        '<g transform="translate(800,560)">' +
          '<ellipse cx="0" cy="150" rx="120" ry="34" fill="#2a1a0c"/>' +
          '<rect x="-70" y="20" width="140" height="150" rx="14" fill="#5a3d22"/>' +
          '<rect x="-70" y="20" width="140" height="150" rx="14" fill="url(#deckG)"/>' +
          '<ellipse cx="0" cy="20" rx="70" ry="20" fill="#6b4a28"/>' +
          // capstan bars
          '<rect x="-150" y="34" width="300" height="10" rx="5" fill="#3a2614"/>' +
          '<rect x="-12" y="-90" width="24" height="260" rx="5" fill="#3a2614" transform="rotate(60 0 44)"/>' +
        '</g>' +
        // barrels
        barrel(170, 640) + barrel(250, 660) + barrel(1380, 650) +
        // coiled rope
        '<g transform="translate(1280,720)"><circle r="46" fill="none" stroke="#6b5230" stroke-width="14"/><circle r="26" fill="none" stroke="#6b5230" stroke-width="14"/></g>' +
        '<rect x="0" y="430" width="34" height="470" fill="#3a2614"/><rect x="1566" y="430" width="34" height="470" fill="#3a2614"/>'
      );
    }},

    /* ---- FORECASTLE (bow, anchor) ---- */
    forecastle: { indoor: false, render: function () {
      return svg(defs() +
        sea(280) +
        // bowsprit pointing out over the sea
        '<rect x="700" y="250" width="900" height="22" rx="10" fill="#3a2614" transform="rotate(-12 700 260)"/>' +
        rope(720, 250, 520, 70) + rope(900, 230, 1100, 70) +
        planks(420, 480) +
        // big anchor
        '<g transform="translate(360,560)" stroke="#1a1a1f" stroke-width="22" fill="none" stroke-linecap="round">' +
          '<line x1="0" y1="-60" x2="0" y2="190"/>' +
          '<line x1="-90" y1="-30" x2="90" y2="-30"/>' +
          '<path d="M-110 150 Q 0 250 110 150"/>' +
          '<circle cx="0" cy="-80" r="26" stroke-width="16"/>' +
        '</g>' +
        // foremast base
        '<rect x="1086" y="0" width="30" height="460" fill="#3a2614"/>' +
        barrel(1300, 640) + barrel(1380, 660) +
        '<rect x="0" y="420" width="34" height="480" fill="#3a2614"/><rect x="1566" y="420" width="34" height="480" fill="#3a2614"/>'
      );
    }},

    /* ---- CROW'S NEST (lookout) ---- */
    crowsnest: { indoor: false, render: function () {
      return svg(defs() +
        // tiny far sea low down
        '<rect x="0" y="760" width="1600" height="140" fill="#0c2630"/>' +
        '<rect x="0" y="760" width="1600" height="140" fill="url(#seaG)"/>' +
        // mast coming up through center
        '<rect x="770" y="500" width="60" height="400" fill="#3a2614"/>' +
        // rigging fanning down
        '<g>' + rope(800, 560, 120, 900) + rope(800, 560, 1480, 900) + rope(800, 560, 400, 900) + rope(800, 560, 1200, 900) + '</g>' +
        // the nest (barrel rim) foreground
        '<g transform="translate(800,720)">' +
          '<ellipse cx="0" cy="120" rx="360" ry="80" fill="#2a1a0c"/>' +
          '<path d="M-360 120 A360 80 0 0 0 360 120 L360 220 L-360 220 Z" fill="#3a2614"/>' +
          '<ellipse cx="0" cy="120" rx="360" ry="80" fill="none" stroke="#6b4a28" stroke-width="10"/>' +
          // staves
          staves(360, 120, 220) +
        '</g>'
      );
    }},

    /* ---- GUN DECK (cannons) ---- */
    gundeck: { indoor: true, render: function () {
      var ports = '', cannons = '';
      for (var i = 0; i < 4; i++) {
        var x = 180 + i * 380;
        ports += '<rect x="' + x + '" y="300" width="150" height="120" rx="8" fill="#0a1a22"/>' +
                 '<rect x="' + x + '" y="300" width="150" height="120" rx="8" fill="url(#portLight)"/>';
        cannons += '<g transform="translate(' + (x + 75) + ',470)">' +
          '<rect x="-90" y="40" width="180" height="40" rx="8" fill="#3a2614"/>' +
          '<circle cx="-55" cy="92" r="26" fill="#1a1a1f"/><circle cx="55" cy="92" r="26" fill="#1a1a1f"/>' +
          '<rect x="-30" y="-30" width="120" height="64" rx="20" fill="#23232a"/>' +
          '<rect x="78" y="-18" width="46" height="40" rx="8" fill="#15151a"/>' +
        '</g>';
      }
      return svg(defs('<linearGradient id="portLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a5a66"/><stop offset="1" stop-color="#0a1a22"/></linearGradient>') +
        '<rect x="0" y="0" width="1600" height="900" fill="url(#woodWall)"/>' +
        // ceiling beams
        '<rect x="0" y="0" width="1600" height="120" fill="#160d06"/>' +
        beams() +
        ports + planks(560, 340) + cannons +
        // hanging lantern
        '<line x1="800" y1="120" x2="800" y2="190" stroke="#241a0e" stroke-width="4"/>' +
        '<circle cx="800" cy="230" r="120" fill="url(#lant)"/>' +
        '<rect x="784" y="200" width="32" height="48" rx="6" fill="#2a1a0c" stroke="#c9a24a"/>'
      );
    }},

    /* ---- THE HOLD (barrels, dark) ---- */
    hold: { indoor: true, render: function () {
      return svg(defs() +
        '<rect x="0" y="0" width="1600" height="900" fill="#0d0905"/>' +
        '<rect x="0" y="0" width="1600" height="900" fill="url(#woodWall)" opacity="0.8"/>' +
        beams() +
        // stacked crates + barrels
        crate(180, 560) + crate(330, 560) + crate(255, 420) +
        barrel(1180, 560) + barrel(1280, 560) + barrel(1230, 430) + barrel(1380, 560) +
        // lantern glow center
        '<line x1="800" y1="80" x2="800" y2="200" stroke="#241a0e" stroke-width="4"/>' +
        '<circle cx="800" cy="260" r="200" fill="url(#lant)"/>' +
        '<rect x="780" y="210" width="40" height="60" rx="8" fill="#2a1a0c" stroke="#c9a24a"/>' +
        planks(720, 180) +
        // dripping / damp
        '<rect x="0" y="700" width="1600" height="40" fill="#06120f" opacity="0.6"/>'
      );
    }},

    /* ---- GREAT CABIN (captain's quarters) ---- */
    cabin: { indoor: true, render: function () {
      return svg(defs() +
        '<rect x="0" y="0" width="1600" height="900" fill="url(#woodWall)"/>' +
        // stern gallery windows
        '<g>' +
          window6(560, 120) +
        '</g>' +
        beams() +
        planks(640, 260) +
        // desk
        '<g transform="translate(800,640)">' +
          '<rect x="-220" y="0" width="440" height="40" rx="8" fill="#5a3d22"/>' +
          '<rect x="-200" y="40" width="40" height="120" fill="#3a2614"/><rect x="160" y="40" width="40" height="120" fill="#3a2614"/>' +
          // map + candle
          '<rect x="-120" y="-22" width="200" height="120" rx="4" fill="#d9c89c" transform="rotate(-4 -20 38)"/>' +
          '<rect x="120" y="-40" width="14" height="40" fill="#e9dcbd"/><circle cx="127" cy="-46" r="10" fill="url(#fire)"/>' +
        '</g>' +
        '<circle cx="800" cy="540" r="160" fill="url(#lant)" opacity="0.5"/>'
      );
    }},

    /* ---- GALLEY / THE FORGE (fire) ---- */
    galley: { indoor: true, render: function () {
      return svg(defs() +
        '<rect x="0" y="0" width="1600" height="900" fill="url(#woodWall)"/>' +
        beams() +
        // brick firebox
        '<g transform="translate(800,520)">' +
          '<rect x="-220" y="-40" width="440" height="320" rx="10" fill="#3a201a"/>' +
          bricks() +
          '<rect x="-150" y="60" width="300" height="180" rx="10" fill="#0a0503"/>' +
          '<circle cx="0" cy="180" r="220" fill="url(#fire)"/>' +
          '<circle cx="0" cy="190" r="110" fill="url(#fire)"/>' +
          // anvil
          '<g transform="translate(360,170)"><rect x="-60" y="0" width="120" height="30" rx="6" fill="#23232a"/><rect x="-30" y="30" width="60" height="60" fill="#1a1a1f"/><path d="M-60 0 L-100 14 L-60 24 Z" fill="#23232a"/></g>' +
        '</g>' +
        // hanging pots
        '<line x1="300" y1="120" x2="300" y2="220" stroke="#241a0e" stroke-width="4"/><circle cx="300" cy="250" r="40" fill="none" stroke="#23232a" stroke-width="16"/>' +
        '<line x1="380" y1="120" x2="380" y2="200" stroke="#241a0e" stroke-width="4"/><circle cx="380" cy="225" r="28" fill="none" stroke="#23232a" stroke-width="12"/>' +
        planks(700, 200)
      );
    }},

    /* ---- THE SEA (overboard / underwater) ---- */
    sea: { indoor: true, render: function () {
      return svg(defs('<linearGradient id="deep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b6f86"/><stop offset="1" stop-color="#03121d"/></linearGradient>') +
        '<rect x="0" y="0" width="1600" height="900" fill="url(#deep)"/>' +
        // light shafts
        '<g opacity="0.18" fill="#bfe6f0">' +
          '<polygon points="300,0 420,0 700,900 480,900"/>' +
          '<polygon points="900,0 980,0 1180,900 1040,900"/>' +
        '</g>' +
        // sunken mast silhouette
        '<g opacity="0.5" fill="#04222b"><rect x="1150" y="500" width="40" height="400" transform="rotate(18 1170 700)"/><rect x="980" y="640" width="320" height="30" transform="rotate(18 1140 655)"/></g>' +
        // seabed
        '<path d="M0 820 Q400 760 800 820 T1600 820 L1600 900 L0 900 Z" fill="#06161b"/>'
      );
    }}
  };

  // helper shapes ----------------------------------------------
  function spokes(cx, cy, r1, r2) {
    var s = '';
    for (var a = 0; a < 360; a += 45) {
      var rad = a * Math.PI / 180;
      s += '<line x1="' + (cx + Math.cos(rad) * r1) + '" y1="' + (cy + Math.sin(rad) * r1) + '" x2="' + (cx + Math.cos(rad) * r2) + '" y2="' + (cy + Math.sin(rad) * r2) + '" stroke="#5a3d22" stroke-width="14" stroke-linecap="round"/>';
    }
    return s;
  }
  function barrel(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<rect x="-44" y="-70" width="88" height="140" rx="22" fill="#5a3d22"/>' +
      '<rect x="-44" y="-70" width="88" height="140" rx="22" fill="url(#deckG)"/>' +
      '<rect x="-46" y="-50" width="92" height="10" fill="#2a1a0c"/><rect x="-46" y="-6" width="92" height="10" fill="#2a1a0c"/><rect x="-46" y="38" width="92" height="10" fill="#2a1a0c"/></g>';
  }
  function crate(x, y) {
    return '<g transform="translate(' + x + ',' + y + ')"><rect x="-60" y="-60" width="120" height="120" fill="#3a2614" stroke="#5a3d22" stroke-width="6"/>' +
      '<line x1="-60" y1="-60" x2="60" y2="60" stroke="#5a3d22" stroke-width="6"/><line x1="60" y1="-60" x2="-60" y2="60" stroke="#5a3d22" stroke-width="6"/></g>';
  }
  function beams() {
    var s = '';
    for (var x = 120; x < 1600; x += 320) s += '<rect x="' + x + '" y="0" width="34" height="900" fill="#160d06" opacity="0.55"/>';
    return s;
  }
  function bricks() {
    var s = '';
    for (var r = 0; r < 3; r++) for (var c = 0; c < 9; c++) {
      var off = (r % 2) * 24;
      s += '<rect x="' + (-216 + c * 48 + off) + '" y="' + (-36 + r * 26) + '" width="44" height="22" rx="2" fill="#5a2a20" stroke="#2a1410"/>';
    }
    return s;
  }
  function staves(rx, cy, h) {
    var s = '';
    for (var x = -rx; x <= rx; x += 60) s += '<line x1="' + x + '" y1="' + cy + '" x2="' + x + '" y2="' + (cy + h - Math.abs(x) / rx * 60) + '" stroke="#2a1a0c" stroke-width="6"/>';
    return s;
  }
  function window6(x, y) {
    var s = '<rect x="' + (x - 20) + '" y="' + (y - 20) + '" width="520" height="360" rx="10" fill="#2a1a0c"/>';
    for (var c = 0; c < 3; c++) for (var r = 0; r < 2; r++) {
      s += '<rect x="' + (x + c * 165) + '" y="' + (y + r * 165) + '" width="150" height="150" rx="6" fill="#7fae9e" opacity="0.7"/>';
    }
    return s;
  }

  // fix accidental token in mast/crate fills above (defensive cleanup not needed at runtime)
  window.BRN = window.BRN || {};
  window.BRN.scenes = scenes;
})();
