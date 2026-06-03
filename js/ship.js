/* ============================================================
   BARNACLES — the ship (spatial navigation)
   Navigation is baked into the scene art (see scenes.js): the
   doors, ladders, hatches, rigging, and the cabin's bookshelves
   are drawn into each room and are themselves clickable. This
   file picks the right scene (and, in the cabin, the right wall
   for which way you're facing), wires clicks, and handles the
   atmosphere + content for each place.
   ============================================================ */
(function () {
  'use strict';

  var GRAPH = {
    helm: {
      title:"The Helm", kicker:"Quarterdeck", scene:"helm", zone:"deck", weather:"storm",
      flavor:"You stand at the wheel on the quarterdeck. Step forward to the main deck, or drop down to the great cabin.",
      info:"The quarterdeck is the ship's brain — raised aft so the officers can see the full length of the vessel and the set of every sail. The great wheel is a latecomer; for most of the age of sail, helmsmen wrestled a <em>whipstaff</em> or hauled directly on the tiller below."
    },
    maindeck: {
      title:"The Main Deck", kicker:"The Waist & Capstan", scene:"maindeck", zone:"deck", weather:"storm",
      flavor:"Amidships, around the capstan. Steps lead aft to the helm and forward to the forecastle; the rigging climbs to the crow's nest, a hatch drops below, and the rail waits for the bold.",
      info:"The waist is the working heart of the ship. That drum is the <em>capstan</em>: crews tramped around it pushing wooden bars to weigh the anchor — slow, brutal labour the shanties existed to pace. Above you the masts and rigging carry the canvas; underfoot, hatches drop to the decks below."
    },
    forecastle: {
      title:"The Forecastle", kicker:"The Bow", scene:"forecastle", zone:"deck", weather:"storm",
      flavor:"The fo'c's'le, up at the bow, where the great anchor sleeps and the bowsprit reaches over open water.",
      info:"The forecastle (say it 'fo'c's'le') rides high at the bow to push through a head sea. Here live the anchor and its cable, and the <em>bowsprit</em> spearing forward to carry the jibs — the headsails that let a ship balance her helm and turn."
    },
    crowsnest: {
      title:"The Crow's Nest", kicker:"The Lookout", scene:"crowsnest", zone:"deck", weather:"storm",
      flavor:"High above the deck, the wind sharp and clean. Take the ratlines back down when you've had your fill of the horizon.",
      info:"A barrel or platform lashed near the masthead, the lookout's perch. Height is everything at sea: a few extra fathoms of elevation push the horizon miles farther out, turning a distant smudge into 'sail ho!' or 'land ho!' with precious minutes to spare."
    },
    gundeck: {
      title:"The Gun Deck", kicker:"Cannon & Powder", scene:"gundeck", zone:"below", weather:"deep",
      flavor:"Low beams, the smell of powder, a row of guns at their ports. Doors lead fore to the galley and aft to the cabin; ladders climb up to the deck or drop down into the hold.",
      info:"A floating battery. Cannon are lashed behind shuttered <em>gunports</em>; in action the ports drop open and the guns are hauled out to fire a <em>broadside</em> — every gun on one side at once. The weight of that broadside, not the size of the ship, usually decided a fight.",
      content:["gunnery"]
    },
    hold: {
      title:"The Hold", kicker:"Cargo, Ballast & Bilge", scene:"hold", zone:"below", weather:"deep",
      flavor:"The belly of the ship — barrels, crates, damp dark, and the rats' own parliament. The ladder climbs back to the gun deck.",
      info:"Down here ride the cargo, the water casks, the powder, and the stone or gravel <em>ballast</em> that keeps a ship upright. At the very bottom sits the <em>bilge</em>, where stinking water collects to be pumped out — the foulest duty aboard."
    },
    cabin: {
      title:"The Great Cabin", kicker:"The Captain's Library — Barnacles", views:{ fore:"cabin_fore", aft:"cabin_aft" }, zone:"cabin", weather:"cabin",
      flavor:"The captain's own room at the stern. Open the book on the desk — or turn around to the wall of shelves, where every learning waits in its own volume."
    },
    galley: {
      title:"The Galley", kicker:"The Cook's Fire & Forge", scene:"galley", zone:"forge", weather:"forge",
      flavor:"Heat and iron. A ladder climbs up to the forecastle; a door leads aft to the gun deck.",
      info:"Open flame aboard a wooden ship is a terror, so the galley fire is boxed in brick and sand. The same hearth that boils the salt-beef and bakes the rock-hard <em>hardtack</em> serves the ship's smith — the closest thing to a forge at sea."
    },
    sea: {
      title:"Overboard", kicker:"Beneath the Waves", scene:"sea", zone:"water", weather:"water",
      flavor:"The world goes muffled and blue. Bubbles climb past your ears; the storm above is only a rumor. Stay a while — then click the surface to climb back aboard."
    }
  };

  var Ship = { current:null, facing:'fore', busy:false, _silent:false };
  function el(id){ return document.getElementById(id); }

  function sceneKeyFor(loc){ return loc.views ? (loc.views[Ship.facing] || loc.views.fore) : loc.scene; }

  function renderUI(loc){
    var ui = el('scene-ui');
    var turn = loc.views ? '<button class="turn-around" data-turn="1">&#10227; Turn around</button>' : '';
    var hint = loc.views ? 'Click the book to read &mdash; or turn around for the shelves'
             : 'Click a door, ladder, hatch or the rigging to move' + ((loc.content||loc.info) ? ' &middot; scroll down to explore' : '');
    ui.innerHTML =
      '<div class="loc-banner"><div class="loc-kicker">'+loc.kicker+'</div><div class="loc-title">'+loc.title+'</div></div>'+
      '<div class="loc-foot">'+turn+
        '<div class="loc-flavor">'+(loc.flavor||'')+'</div>'+
        '<div class="read-hint">'+hint+'</div>'+
      '</div>';
  }

  function infoPanel(loc){
    return '<div class="content-room info-card"><div class="room-kicker">'+loc.kicker+'</div>'+
      '<h2 class="room-title">'+loc.title+'</h2><p class="room-lede">'+(loc.info||'')+'</p></div>';
  }

  Ship.show = function(key){
    var loc = GRAPH[key] || GRAPH.helm;
    Ship.current = key;
    var sk = sceneKeyFor(loc);
    var scene = window.BRN.scenes[sk] || window.BRN.scenes.helm;

    var sceneEl = el('scene');
    sceneEl.className = scene.indoor ? 'indoor' : 'outdoor';
    // photo scenes embed their own image (with aligned hotspots); others get an
    // auto-overlay image if a matching file exists in assets/rooms/.
    sceneEl.innerHTML = scene.render() +
      (scene.photo ? '' : '<img class="scene-photo" alt="" src="assets/rooms/'+sk+'.jpg" onload="this.classList.add(\'shown\')" onerror="this.remove()" />');

    if(window.BRN.Audio) window.BRN.Audio.setZone(loc.zone||'deck');
    if(window.BRN.Weather) window.BRN.Weather.setMode(loc.weather||'storm');

    renderUI(loc);

    var content = el('content'); content.innerHTML='';
    if(loc.info){ var iw=document.createElement('div'); iw.innerHTML=infoPanel(loc); content.appendChild(iw.firstChild); }
    if(loc.content){ [].concat(loc.content).forEach(function(ck){
      var room=window.BRN.rooms[ck]; if(!room) return;
      var wrap=document.createElement('div'); wrap.className='content-room';
      wrap.innerHTML=room.render(); content.appendChild(wrap); if(room.init) room.init(wrap);
    }); }
    document.title = 'BARNACLES — '+loc.title;
    window.scrollTo(0,0);
  };

  // Take a book off the shelf / desk: open it in the pop-up reader.
  Ship.openContent = function(roomKey){
    var room = window.BRN.rooms[roomKey]; if(!room) return;
    var body = el('book-body'); body.innerHTML='';
    var wrap=document.createElement('div'); wrap.className='content-room';
    wrap.innerHTML=room.render(); body.appendChild(wrap); if(room.init) room.init(wrap);
    var m=el('bookmodal'); m.classList.add('open'); m.setAttribute('aria-hidden','false');
    body.scrollTop=0;
    if(window.BRN.Audio) window.BRN.Audio.move();
  };
  Ship.closeBook = function(){
    var m=el('bookmodal'); if(!m) return;
    m.classList.remove('open'); m.setAttribute('aria-hidden','true');
    el('book-body').innerHTML='';
  };

  function trClass(type){
    if(type==='door') return 't-door';
    if(type==='overboard'||type==='surface') return 't-splash';
    if(type==='up'||type==='climbup') return 't-up';
    if(type==='down'||type==='climbdown') return 't-down';
    return 't-fade';
  }

  Ship.go = function(key, type){
    if(Ship.busy) return;
    if(!GRAPH[key]) key='helm';
    if(key===Ship.current && type==='fade') return;
    Ship.busy=true; Ship.facing='fore';
    if(window.BRN.Audio) window.BRN.Audio.move();
    var tr=el('transition'), loc=GRAPH[key];
    tr.querySelector('.tr-label').textContent = loc ? loc.title : '';
    tr.className='show '+trClass(type||'fade');
    if(location.hash !== '#/'+key){ Ship._silent=true; location.hash='#/'+key; }
    setTimeout(function(){ Ship.show(key); }, 460);
    setTimeout(function(){ tr.className=''; Ship.busy=false; }, 980);
  };

  Ship.turn = function(){
    if(Ship.busy) return;
    Ship.busy=true;
    Ship.facing = (Ship.facing==='fore') ? 'aft' : 'fore';
    if(window.BRN.Audio) window.BRN.Audio.move();
    var tr=el('transition');
    tr.querySelector('.tr-label').textContent='';
    tr.className='show t-fade';
    setTimeout(function(){ Ship.show(Ship.current); }, 360);
    setTimeout(function(){ tr.className=''; Ship.busy=false; }, 760);
  };

  Ship.start = function(){
    var key=(location.hash||'').replace('#/','')||'helm';
    if(!GRAPH[key]) key='helm';
    Ship.show(key);
    document.addEventListener('click', function(e){
      var t=e.target;
      while(t && t.getAttribute){
        if(t.getAttribute('data-close')){ Ship.closeBook(); return; }
        if(t.getAttribute('data-turn')){ Ship.turn(); return; }
        var to=t.getAttribute('data-to'); if(to){ Ship.go(to, t.getAttribute('data-type')); return; }
        var open=t.getAttribute('data-open'); if(open){ Ship.openContent(open); return; }
        t=t.parentNode;
      }
    });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') Ship.closeBook(); });
  };

  Ship.graph = GRAPH;
  window.BRN = window.BRN || {};
  window.BRN.Ship = Ship;
})();
