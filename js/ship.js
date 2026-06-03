/* ============================================================
   BARNACLES — the ship (spatial navigation)
   Move through a realistic pirate-ship layout via doors, hatches,
   ladders, the mast, and the rail. Paths loop. Each location has
   a flavor line and (usually) an "About this place" card; the
   Great Cabin is the ship's library — turn around for the shelves
   of learnings, with the open Barnacles book as the centerpiece.
   ============================================================ */
(function () {
  'use strict';

  var GRAPH = {
    helm: {
      title:"The Helm", kicker:"Quarterdeck", scene:"helm", zone:"deck", weather:"storm",
      flavor:"You stand at the wheel on the quarterdeck, the whole ship laid out before you. The sea answers the rudder; you answer the sea.",
      info:"The quarterdeck is the ship's brain — raised aft so the officers can see the full length of the vessel and the set of every sail. The great wheel you're holding is actually a latecomer; for most of the age of sail, helmsmen wrestled a <em>whipstaff</em> or hauled directly on the tiller below. Steering orders were called, repeated back, and held.",
      exits:[
        { label:"Forward to the main deck", to:"maindeck", type:"walk", facing:"fore", x:50, y:48 },
        { label:"Down to the great cabin", to:"cabin", type:"down", facing:"aft", x:50, y:58 }
      ]
    },
    maindeck: {
      title:"The Main Deck", kicker:"The Waist & Capstan", scene:"maindeck", zone:"deck", weather:"storm",
      flavor:"Amidships, around the capstan, where the crew set their backs to the bars and raise their voices to keep time.",
      info:"The waist is the working heart of the ship. That drum is the <em>capstan</em>: crews tramped around it pushing wooden bars to weigh the anchor or hoist heavy yards — slow, brutal labour that the shanties existed to pace. Above you the masts and a web of rigging carry the canvas; underfoot, hatches drop to the decks below.",
      exits:[
        { label:"Forward to the forecastle", to:"forecastle", type:"walk", facing:"fore", x:50, y:42 },
        { label:"Climb the mainmast to the crow's nest", to:"crowsnest", type:"climbup", facing:"fore", x:29, y:20 },
        { label:"Aft to the helm", to:"helm", type:"walk", facing:"aft", x:50, y:44 },
        { label:"Down the hatch to the gun deck", to:"gundeck", type:"down", facing:null, x:67, y:73 },
        { label:"To the rail — dive overboard", to:"sea", type:"overboard", facing:null, x:11, y:66 }
      ]
    },
    forecastle: {
      title:"The Forecastle", kicker:"The Bow", scene:"forecastle", zone:"deck", weather:"storm",
      flavor:"The fo'c's'le, up at the bow, where the great anchor sleeps and the bowsprit reaches out over open water.",
      info:"The forecastle (say it 'fo'c's'le') rides high at the bow to push through a head sea. Here live the anchor and its cable, and the <em>bowsprit</em> spearing forward to carry the jibs — the headsails that let a ship balance her helm and turn. On many vessels the crew berthed up here, forward of the working deck.",
      exits:[
        { label:"Aft to the main deck", to:"maindeck", type:"walk", facing:null, x:50, y:42 },
        { label:"Down to the galley", to:"galley", type:"down", facing:null, x:74, y:70 }
      ]
    },
    crowsnest: {
      title:"The Crow's Nest", kicker:"The Lookout", scene:"crowsnest", zone:"deck", weather:"storm",
      flavor:"High above the deck, the wind sharp and clean. From here a lookout sees weather, sail, and land long before the deck below.",
      info:"A barrel or platform lashed near the masthead, the lookout's perch. Height is everything at sea: a few extra fathoms of elevation push the horizon miles farther out, turning a distant smudge into 'sail ho!' or 'land ho!' with precious minutes to spare. In foul weather it is the loneliest, wildest billet aboard.",
      exits:[
        { label:"Down to the main deck", to:"maindeck", type:"climbdown", facing:null, x:50, y:66 }
      ]
    },
    gundeck: {
      title:"The Gun Deck", kicker:"Cannon & Powder", scene:"gundeck", zone:"below", weather:"deep",
      flavor:"Low beams, the smell of powder, a row of guns run up to their ports. This is where a ship's fights are decided.",
      info:"A floating battery. Cannon are lashed behind shuttered <em>gunports</em>; in action the ports drop open and the guns are hauled out on their carriages to fire a <em>broadside</em> — every gun on one side at once. The weight of that broadside, not the size of the ship, usually decided a fight. Mind your head: the deckhead is built low.",
      content:["gunnery"],
      exits:[
        { label:"Up the hatch to the main deck", to:"maindeck", type:"up", facing:null, x:50, y:26 },
        { label:"Aft to the captain's cabin", to:"cabin", type:"door", facing:null, x:87, y:55 },
        { label:"Forward to the galley", to:"galley", type:"door", facing:null, x:13, y:55 },
        { label:"Down into the hold", to:"hold", type:"down", facing:null, x:50, y:81 }
      ]
    },
    hold: {
      title:"The Hold", kicker:"Cargo, Ballast & Bilge", scene:"hold", zone:"below", weather:"deep",
      flavor:"The belly of the ship — barrels, crates, damp dark, and the rats' own parliament.",
      info:"Down here ride the cargo, the water casks, the powder, and the stone or gravel <em>ballast</em> that keeps a ship upright. At the very bottom sits the <em>bilge</em>, where stinking water collects to be pumped out — the foulest duty aboard. Prisoners and the condemned were often kept down here in the brig.",
      exits:[
        { label:"Up the ladder to the gun deck", to:"gundeck", type:"up", facing:null, x:50, y:32 }
      ]
    },
    cabin: {
      title:"The Great Cabin", kicker:"The Captain's Library — Barnacles", scene:"cabin", zone:"cabin", weather:"cabin",
      flavor:"The captain's own room at the stern, lit by the gallery windows and a single candle. The book lives here — and so does everything worth knowing. Turn around for the shelves.",
      features:[
        { label:"The open book — Barnacles", opens:"quarters", type:"book", facing:"fore", x:50, y:60 },
        { label:"How Ships Work",     opens:"ships",    type:"shelf", facing:"aft", x:20, y:50 },
        { label:"Shanties",           opens:"shanties", type:"shelf", facing:"aft", x:36, y:50 },
        { label:"Pirate Speak",       opens:"speak",    type:"shelf", facing:"aft", x:52, y:50 },
        { label:"History of Piracy",  opens:"history",  type:"shelf", facing:"aft", x:68, y:50 },
        { label:"The Forge",          opens:"forge",    type:"shelf", facing:"aft", x:84, y:50 }
      ],
      exits:[
        { label:"Forward to the gun deck", to:"gundeck", type:"door", facing:"fore", x:15, y:55 },
        { label:"Up the companionway to the helm", to:"helm", type:"up", facing:"fore", x:86, y:44 }
      ]
    },
    galley: {
      title:"The Galley", kicker:"The Cook's Fire & Forge", scene:"galley", zone:"forge", weather:"forge",
      flavor:"Heat and iron. The cook's firebox doubles as the ship's forge — here metal is bent to will.",
      info:"Open flame aboard a wooden ship is a terror, so the galley fire is boxed in brick and sand and the first thing doused in a storm. The same hearth that boils the salt-beef and bakes the rock-hard <em>hardtack</em> serves the ship's smith for repairs — the closest thing to a forge at sea.",
      exits:[
        { label:"Up to the forecastle", to:"forecastle", type:"up", facing:null, x:18, y:34 },
        { label:"Aft to the gun deck", to:"gundeck", type:"door", facing:null, x:84, y:55 }
      ]
    },
    sea: {
      title:"Overboard", kicker:"Beneath the Waves", scene:"sea", zone:"water", weather:"water",
      flavor:"The world goes muffled and blue. Bubbles climb past your ears. Somewhere above, the storm is only a rumor — and the sound itself has dived with you. Stay a while.",
      exits:[
        { label:"Surface — climb back aboard", to:"maindeck", type:"surface", facing:null, x:50, y:30 }
      ]
    }
  };

  var Ship = { current:null, facing:'fore', busy:false, _silent:false };
  function el(id){ return document.getElementById(id); }

  /* ---- which exits/features show for the current facing ---- */
  function forFacing(arr){ return (arr||[]).filter(function(e){ return !e.facing || e.facing===Ship.facing; }); }
  function bothFacings(loc){
    var all=(loc.exits||[]).concat(loc.features||[]);
    var f=false,a=false; all.forEach(function(e){ if(e.facing==='fore')f=true; if(e.facing==='aft')a=true; });
    return f&&a;
  }

  /* ---- illustrated markers (sit exactly on the click point) ---- */
  function icon(type){
    var glow='<ellipse class="glow" cx="50" cy="52" rx="42" ry="44" fill="#e6c468"/>';
    var inner;
    switch(type){
      case 'door':
        inner='<rect x="28" y="14" width="44" height="74" rx="4" fill="#241608" stroke="#e6c468" stroke-width="3"/>'+
              '<line x1="40" y1="18" x2="40" y2="84" stroke="#0e0905" stroke-width="2"/>'+
              '<line x1="50" y1="18" x2="50" y2="84" stroke="#0e0905" stroke-width="2"/>'+
              '<line x1="60" y1="18" x2="60" y2="84" stroke="#0e0905" stroke-width="2"/>'+
              '<circle cx="64" cy="52" r="3.5" fill="#e6c468"/>'; break;
      case 'down': case 'climbdown':
        inner='<rect x="22" y="26" width="56" height="46" rx="3" fill="#0a0603" stroke="#e6c468" stroke-width="3"/>'+
              '<rect x="16" y="18" width="34" height="10" rx="2" fill="#3a2614" stroke="#e6c468" stroke-width="2"/>'+
              '<g stroke="#9a7a44" stroke-width="3"><line x1="42" y1="30" x2="42" y2="70"/><line x1="58" y1="30" x2="58" y2="70"/>'+
              '<line x1="42" y1="40" x2="58" y2="40"/><line x1="42" y1="52" x2="58" y2="52"/><line x1="42" y1="64" x2="58" y2="64"/></g>'+
              '<path d="M43 78 L50 88 L57 78" fill="none" stroke="#e6c468" stroke-width="3" stroke-linecap="round"/>'; break;
      case 'up': case 'climbup':
        inner='<g stroke="#e6c468" stroke-width="3"><line x1="40" y1="22" x2="40" y2="86"/><line x1="60" y1="22" x2="60" y2="86"/>'+
              '<line x1="40" y1="34" x2="60" y2="34"/><line x1="40" y1="50" x2="60" y2="50"/><line x1="40" y1="66" x2="60" y2="66"/><line x1="40" y1="80" x2="60" y2="80"/></g>'+
              '<path d="M43 22 L50 12 L57 22" fill="none" stroke="#e6c468" stroke-width="3" stroke-linecap="round"/>'; break;
      case 'overboard':
        inner='<g stroke="#e6c468" stroke-width="3"><line x1="20" y1="34" x2="80" y2="34"/><line x1="28" y1="34" x2="28" y2="56"/><line x1="72" y1="34" x2="72" y2="56"/></g>'+
              '<path d="M20 66 q10 -8 20 0 t20 0 t20 0" fill="none" stroke="#7fb8c8" stroke-width="3"/>'+
              '<path d="M20 78 q10 -8 20 0 t20 0 t20 0" fill="none" stroke="#7fb8c8" stroke-width="3"/>'+
              '<path d="M46 40 L50 60 L54 40" fill="#e6c468"/>'; break;
      case 'surface':
        inner='<path d="M16 56 q9 -8 18 0 t18 0 t18 0" fill="none" stroke="#7fb8c8" stroke-width="3"/>'+
              '<path d="M16 70 q9 -8 18 0 t18 0 t18 0" fill="none" stroke="#7fb8c8" stroke-width="3"/>'+
              '<path d="M43 50 L50 36 L57 50" fill="none" stroke="#e6c468" stroke-width="3" stroke-linecap="round"/>'+
              '<line x1="50" y1="38" x2="50" y2="64" stroke="#e6c468" stroke-width="3"/>'+
              '<circle cx="68" cy="30" r="3" fill="none" stroke="#bfe6f0" stroke-width="2"/><circle cx="74" cy="22" r="2" fill="none" stroke="#bfe6f0" stroke-width="2"/>'; break;
      default: /* walk */
        inner='<path d="M30 30 L52 50 L30 70" fill="none" stroke="#e6c468" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'+
              '<path d="M50 30 L72 50 L50 70" fill="none" stroke="#e6c468" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>';
    }
    return '<svg viewBox="0 0 100 100">'+glow+inner+'</svg>';
  }
  function featureIcon(type){
    var glow='<ellipse class="glow" cx="50" cy="52" rx="42" ry="40" fill="#e6c468"/>';
    if(type==='book'){
      return '<svg viewBox="0 0 100 100">'+glow+
        '<path d="M50 26 C38 18 22 18 14 22 L14 76 C22 72 38 72 50 80 C62 72 78 72 86 76 L86 22 C78 18 62 18 50 26 Z" fill="#efe7d2" stroke="#e6c468" stroke-width="3"/>'+
        '<line x1="50" y1="26" x2="50" y2="80" stroke="#b8975a" stroke-width="2"/>'+
        '<g stroke="#b8975a" stroke-width="2"><line x1="22" y1="34" x2="44" y2="38"/><line x1="22" y1="44" x2="44" y2="48"/><line x1="56" y1="38" x2="78" y2="34"/><line x1="56" y1="48" x2="78" y2="44"/></g></svg>';
    }
    // shelf book (a standing spine)
    return '<svg viewBox="0 0 100 100">'+glow+
      '<rect x="36" y="20" width="28" height="64" rx="3" fill="#5a2a20" stroke="#e6c468" stroke-width="3"/>'+
      '<line x1="36" y1="30" x2="64" y2="30" stroke="#e6c468" stroke-width="2"/>'+
      '<line x1="36" y1="74" x2="64" y2="74" stroke="#e6c468" stroke-width="2"/>'+
      '<circle cx="50" cy="52" r="5" fill="none" stroke="#e6c468" stroke-width="2"/></svg>';
  }

  /* ---- render the scene-ui (banner, markers, turn-around) ---- */
  function renderUI(loc){
    var ui = el('scene-ui');
    var exits = forFacing(loc.exits);
    var feats = forFacing(loc.features);

    var markers = exits.map(function(e){
      return '<button class="exit type-'+e.type+'" data-to="'+e.to+'" data-type="'+e.type+'" style="left:'+e.x+'%;top:'+e.y+'%">'+
        '<span class="exit-icon">'+icon(e.type)+'</span>'+
        '<span class="exit-label">'+e.label+'</span></button>';
    }).join('');

    var features = feats.map(function(f){
      return '<button class="feature" data-open="'+f.opens+'" style="left:'+f.x+'%;top:'+f.y+'%">'+
        '<span class="feature-icon">'+featureIcon(f.type)+'</span>'+
        '<span class="feature-label">'+f.label+'</span></button>';
    }).join('');

    var turn = bothFacings(loc) ? '<button class="turn-around" id="turnBtn">&#10227; Turn around</button>' : '';
    var hint = loc.features ? 'Open a book to read &mdash; or turn around for the shelves'
             : (loc.content || loc.info) ? 'Scroll down to explore this part of the ship ↓' : '';

    ui.innerHTML =
      '<div class="loc-banner"><div class="loc-kicker">'+loc.kicker+'</div><div class="loc-title">'+loc.title+'</div></div>'+
      '<div class="exits">'+markers+features+'</div>'+
      '<div class="loc-foot">'+turn+
        '<div class="loc-flavor">'+(loc.flavor||'')+'</div>'+
        (hint ? '<div class="read-hint">'+hint+'</div>' : '')+
      '</div>';

    var tb = document.getElementById('turnBtn');
    if(tb) tb.addEventListener('click', function(){
      var sc=el('scene'), su=el('scene-ui');
      Ship.facing = (Ship.facing==='fore') ? 'aft' : 'fore';
      if(window.BRN.Audio) window.BRN.Audio.move();
      sc.classList.add('turning'); su.classList.add('turning');
      setTimeout(function(){ renderUI(loc); }, 220);
      setTimeout(function(){ sc.classList.remove('turning'); su.classList.remove('turning'); }, 460);
    });
  }

  function infoPanel(loc){
    return '<div class="content-room info-card"><div class="room-kicker">'+loc.kicker+'</div>'+
      '<h2 class="room-title">'+loc.title+'</h2><p class="room-lede">'+(loc.info||'')+'</p></div>';
  }

  /* ---- render a location instantly (used mid-transition) ---- */
  Ship.show = function(key){
    var loc = GRAPH[key] || GRAPH.helm;
    Ship.current = key;

    var sceneEl = el('scene');
    var scene = window.BRN.scenes[loc.scene] || window.BRN.scenes.helm;
    sceneEl.className = scene.indoor ? 'indoor' : 'outdoor';
    sceneEl.innerHTML = scene.render() +
      '<img class="scene-photo" alt="" src="assets/rooms/'+key+'.jpg" onload="this.classList.add(\'shown\')" onerror="this.remove()" />';

    if(window.BRN.Audio) window.BRN.Audio.setZone(loc.zone||'deck');
    if(window.BRN.Weather) window.BRN.Weather.setMode(loc.weather||'storm');

    renderUI(loc);

    // auto content (info + any always-on rooms like gunnery)
    var content = el('content'); content.innerHTML='';
    if(loc.info){ var iw=document.createElement('div'); iw.innerHTML=infoPanel(loc); content.appendChild(iw.firstChild); }
    if(loc.content){
      [].concat(loc.content).forEach(function(ck){
        var room=window.BRN.rooms[ck]; if(!room) return;
        var wrap=document.createElement('div'); wrap.className='content-room';
        wrap.innerHTML=room.render(); content.appendChild(wrap); if(room.init) room.init(wrap);
      });
    }
    document.title = 'BARNACLES — '+loc.title;
    window.scrollTo(0,0);
  };

  /* ---- open a book/shelf into the content area (cabin) ---- */
  Ship.openContent = function(roomKey){
    var room = window.BRN.rooms[roomKey]; if(!room) return;
    var content = el('content'); content.innerHTML='';
    var wrap=document.createElement('div'); wrap.className='content-room';
    wrap.innerHTML=room.render(); content.appendChild(wrap); if(room.init) room.init(wrap);
    if(window.BRN.Audio) window.BRN.Audio.move();
    wrap.scrollIntoView({behavior:'smooth', block:'start'});
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

  Ship.start = function(){
    var key=(location.hash||'').replace('#/','')||'helm';
    if(!GRAPH[key]) key='helm';
    Ship.show(key);
    el('stage').addEventListener('click', function(e){
      var t=e.target;
      while(t && t!==this){
        if(t.dataset && t.dataset.to){ Ship.go(t.dataset.to, t.dataset.type); return; }
        if(t.dataset && t.dataset.open){ Ship.openContent(t.dataset.open); return; }
        t=t.parentNode;
      }
    });
  };

  Ship.graph = GRAPH;
  window.BRN = window.BRN || {};
  window.BRN.Ship = Ship;
})();
