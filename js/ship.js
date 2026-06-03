/* ============================================================
   BARNACLES — the ship (spatial navigation)
   You move through a realistic pirate-ship layout by choosing
   doors, hatches, ladders, the mast, or the rail. Paths loop;
   most rooms can be reached more than one way. Each move plays
   a transition suited to how you travel (swing a door, drop down
   a hatch, climb the mast, dive overboard).

   Adjacencies (loops on purpose):
     helm  <->  maindeck  <->  forecastle
       |          |   |            |
     cabin <----gundeck--+        galley
                 |   \____________/
                hold
     maindeck --(dive)--> sea --(surface)--> maindeck
     maindeck --(climb)--> crowsnest
   ============================================================ */
(function () {
  'use strict';

  // type -> transition style + default verb
  var GRAPH = {
    helm: {
      title: "The Helm", kicker: "Quarterdeck", scene: "helm", zone: "deck", weather: "storm",
      content: null, flavor: "You stand at the wheel on the quarterdeck, the whole ship laid out before you. The sea answers the rudder; you answer the sea.",
      exits: [
        { label: "Forward to the main deck", to: "maindeck", type: "walk", facing: "fore", x: 50, y: 40 },
        { label: "Down to the great cabin", to: "cabin", type: "down", facing: "aft", x: 50, y: 55 }
      ]
    },
    maindeck: {
      title: "The Main Deck", kicker: "The Waist & Capstan", scene: "maindeck", zone: "deck", weather: "storm",
      content: ["shanties"], flavor: "Amidships, around the capstan, where the crew set their backs to the bars and raise their voices to keep time.",
      exits: [
        { label: "Forward to the forecastle", to: "forecastle", type: "walk", facing: "fore", x: 50, y: 36 },
        { label: "Climb the mainmast to the crow's nest", to: "crowsnest", type: "climbup", facing: "fore", x: 31, y: 22 },
        { label: "Aft to the helm", to: "helm", type: "walk", facing: "aft", x: 50, y: 40 },
        { label: "Down the hatch to the gun deck", to: "gundeck", type: "down", facing: null, x: 68, y: 72 },
        { label: "To the rail — dive overboard", to: "sea", type: "overboard", facing: null, x: 9, y: 60 }
      ]
    },
    forecastle: {
      title: "The Forecastle", kicker: "The Bow", scene: "forecastle", zone: "deck", weather: "storm",
      content: null, flavor: "The fo'c's'le, up at the bow, where the great anchor sleeps and the bowsprit reaches out over open water.",
      exits: [
        { label: "Aft to the main deck", to: "maindeck", type: "walk", facing: null, x: 50, y: 34 },
        { label: "Down to the galley", to: "galley", type: "down", facing: null, x: 76, y: 70 }
      ]
    },
    crowsnest: {
      title: "The Crow's Nest", kicker: "The Lookout", scene: "crowsnest", zone: "deck", weather: "storm",
      content: ["history"], flavor: "High above the deck, the wind sharp and clean. From here a lookout sees weather, sail, and land long before the deck below — and from here we look back over the whole age of piracy.",
      exits: [
        { label: "Down to the main deck", to: "maindeck", type: "climbdown", facing: null, x: 50, y: 30 }
      ]
    },
    gundeck: {
      title: "The Gun Deck", kicker: "Cannon & Shipwright", scene: "gundeck", zone: "below", weather: "deep",
      content: ["ships", "gunnery"], flavor: "Low beams, the smell of powder, a row of guns run up to their ports. This is where a ship is understood — and where her fights are decided.",
      exits: [
        { label: "Up the hatch to the main deck", to: "maindeck", type: "up", facing: null, x: 50, y: 30 },
        { label: "Aft to the captain's cabin", to: "cabin", type: "door", facing: null, x: 88, y: 56 },
        { label: "Forward to the galley", to: "galley", type: "door", facing: null, x: 12, y: 56 },
        { label: "Down into the hold", to: "hold", type: "down", facing: null, x: 50, y: 78 }
      ]
    },
    hold: {
      title: "The Hold", kicker: "Cargo & Brig", scene: "hold", zone: "below", weather: "deep",
      content: ["speak"], flavor: "The belly of the ship — barrels, crates, damp dark, and the rats' own parliament. Words get scratched into the timbers down here.",
      exits: [
        { label: "Up the ladder to the gun deck", to: "gundeck", type: "up", facing: null, x: 50, y: 30 }
      ]
    },
    cabin: {
      title: "The Great Cabin", kicker: "Captain's Quarters — Barnacles", scene: "cabin", zone: "cabin", weather: "cabin",
      content: ["quarters"], flavor: "The captain's own room at the stern, lit by the gallery windows and a single candle. The book lives here.",
      exits: [
        { label: "Forward to the gun deck", to: "gundeck", type: "door", facing: null, x: 14, y: 58 },
        { label: "Up the companionway to the helm", to: "helm", type: "up", facing: null, x: 84, y: 40 }
      ]
    },
    galley: {
      title: "The Galley", kicker: "The Cook's Fire & Forge", scene: "galley", zone: "forge", weather: "forge",
      content: ["forge"], flavor: "Heat and iron. The cook's firebox doubles as the ship's forge — here metal is bent to will and words are tempered in flame.",
      exits: [
        { label: "Up to the forecastle", to: "forecastle", type: "up", facing: null, x: 18, y: 34 },
        { label: "Aft to the gun deck", to: "gundeck", type: "door", facing: null, x: 86, y: 56 }
      ]
    },
    sea: {
      title: "Overboard", kicker: "Beneath the Waves", scene: "sea", zone: "water", weather: "water",
      content: null, flavor: "The world goes muffled and blue. Bubbles climb past your ears. Somewhere above, the storm is only a rumor — and the sound itself has dived with you.",
      exits: [
        { label: "Surface — climb back aboard", to: "maindeck", type: "surface", facing: null, x: 50, y: 30 }
      ]
    }
  };

  var Ship = { current: null, facing: 'fore', busy: false };

  function el(id) { return document.getElementById(id); }

  function hasBothFacings(loc) {
    var f = false, a = false;
    loc.exits.forEach(function (e) { if (e.facing === 'fore') f = true; if (e.facing === 'aft') a = true; });
    return f && a;
  }

  function exitsForFacing(loc) {
    return loc.exits.filter(function (e) { return !e.facing || e.facing === Ship.facing; });
  }

  // render the location instantly (used at mid-transition)
  Ship.show = function (key) {
    var loc = GRAPH[key] || GRAPH.helm;
    Ship.current = key;

    // scene backdrop
    var sceneEl = el('scene');
    var scene = (window.BRN.scenes[loc.scene] || window.BRN.scenes.helm);
    sceneEl.className = loc.indoor || scene.indoor ? 'indoor' : 'outdoor';
    sceneEl.innerHTML = scene.render() +
      '<img class="scene-photo" alt="" src="assets/rooms/' + key + '.jpg" ' +
      'onload="this.classList.add(\'shown\')" onerror="this.remove()" />';

    // atmosphere
    if (window.BRN.Audio) window.BRN.Audio.setZone(loc.zone || 'deck');
    if (window.BRN.Weather) window.BRN.Weather.setMode(loc.weather || 'storm');

    // scene UI (exits over the scene)
    renderUI(loc);

    // content
    var content = el('content');
    content.innerHTML = '';
    if (loc.content) {
      var keys = [].concat(loc.content);
      keys.forEach(function (ck) {
        var room = window.BRN.rooms[ck];
        if (!room) return;
        var wrap = document.createElement('div');
        wrap.className = 'content-room';
        wrap.innerHTML = room.render();
        content.appendChild(wrap);
        if (room.init) room.init(wrap);
      });
    }
    document.title = 'BARNACLES — ' + loc.title;
    window.scrollTo(0, 0);
  };

  function renderUI(loc) {
    var ui = el('scene-ui');
    var exits = exitsForFacing(loc);
    var markers = exits.map(function (e) {
      return '<button class="exit type-' + e.type + '" data-to="' + e.to + '" data-type="' + e.type + '" ' +
        'style="left:' + e.x + '%;top:' + e.y + '%">' +
        '<span class="exit-glyph">' + glyph(e.type) + '</span>' +
        '<span class="exit-label">' + e.label + '</span></button>';
    }).join('');

    var turn = hasBothFacings(loc) ?
      '<button class="turn-around" id="turnBtn">⟲ Turn around</button>' : '';

    var passages = exits.map(function (e) {
      return '<button class="passage" data-to="' + e.to + '" data-type="' + e.type + '">' + glyph(e.type) + ' ' + e.label + '</button>';
    }).join('');

    ui.innerHTML =
      '<div class="loc-banner"><div class="loc-kicker">' + loc.kicker + '</div>' +
      '<div class="loc-title">' + loc.title + '</div></div>' +
      '<div class="exits">' + markers + '</div>' +
      '<div class="loc-foot">' + turn +
        '<div class="loc-flavor">' + (loc.flavor || '') + '</div>' +
        '<div class="passages"><span class="passages-lead">Passages:</span>' + passages + '</div>' +
        (loc.content ? '<div class="read-hint">Scroll down to explore this part of the ship ↓</div>' : '') +
      '</div>';

    // wire turn-around
    var tb = document.getElementById('turnBtn');
    if (tb) tb.addEventListener('click', function () {
      var sc = el('scene'), su = el('scene-ui');
      Ship.facing = (Ship.facing === 'fore') ? 'aft' : 'fore';
      sc.classList.add('turning'); su.classList.add('turning');
      setTimeout(function () { renderUI(loc); }, 220);
      setTimeout(function () { sc.classList.remove('turning'); su.classList.remove('turning'); }, 460);
    });
  }

  function glyph(type) {
    switch (type) {
      case 'up': case 'climbup': case 'surface': return '↑';
      case 'down': case 'climbdown': return '↓';
      case 'overboard': return '↓≈';
      case 'door': return '▯';
      default: return '→';
    }
  }

  // transition style per exit type
  function trClass(type) {
    if (type === 'door') return 't-door';
    if (type === 'overboard' || type === 'surface') return 't-splash';
    if (type === 'up' || type === 'climbup') return 't-up';
    if (type === 'down' || type === 'climbdown') return 't-down';
    return 't-fade';
  }

  Ship.go = function (key, type) {
    if (Ship.busy) return;
    if (!GRAPH[key]) key = 'helm';
    if (key === Ship.current && type === 'fade') { return; }
    Ship.busy = true;
    Ship.facing = 'fore';

    var tr = el('transition');
    var loc = GRAPH[key];
    el('transition').querySelector('.tr-label').textContent = loc ? loc.title : '';
    tr.className = 'show ' + trClass(type || 'fade');

    // update the address bar without re-triggering a move
    if (location.hash !== '#/' + key) { Ship._silent = true; location.hash = '#/' + key; }

    setTimeout(function () { Ship.show(key); }, 460);
    setTimeout(function () { tr.className = ''; Ship.busy = false; }, 980);
  };

  Ship.start = function () {
    var key = (location.hash || '').replace('#/', '') || 'helm';
    if (!GRAPH[key]) key = 'helm';
    Ship.show(key);

    // delegate exit / passage clicks
    el('stage').addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== this) {
        if (t.dataset && t.dataset.to) { Ship.go(t.dataset.to, t.dataset.type); return; }
        t = t.parentNode;
      }
    });
  };

  Ship.graph = GRAPH;
  window.BRN = window.BRN || {};
  window.BRN.Ship = Ship;
})();
