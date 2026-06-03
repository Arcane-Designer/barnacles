/* ============================================================
   BARNACLES — app / router
   Hash routing, room transitions, and wiring the audio zone +
   weather mode to whatever room you're in. Classic script so the
   whole thing runs from a double-clicked index.html (file://).
   ============================================================ */
(function () {
  'use strict';
  var rooms = window.BRN.rooms;
  var Audio = window.BRN.Audio;
  var Weather = window.BRN.Weather;

  var navOrder = [
    ['#/hub','Deck'], ['#/ships','Ships'], ['#/shanties','Shanties'],
    ['#/speak','Speak'], ['#/history','History'], ['#/forge','Forge'],
    ['#/quarters','Quarters'], ['#/gunnery','Gunnery']
  ];

  var footQuotes = [
    "Only those who survive get to spin the tale.",
    "Breathe the water, drink the waves.",
    "Squiffed, soaked, and pockets full!",
    "May the flood come swift and wash you ‘way to the land of forever.",
    "Never trust anyone, me lady. Not completely, that is."
  ];

  function el(id){ return document.getElementById(id); }

  function buildNav(){
    var nav = el('quicknav');
    nav.innerHTML = navOrder.map(function(n){
      return '<a data-go="'+n[0]+'" href="'+n[0]+'">'+n[1]+'</a>';
    }).join('');
  }

  function setActiveNav(hash){
    var links = el('quicknav').querySelectorAll('a');
    links.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href')===hash); });
  }

  function diveRoom(){
    return '<div class="room" style="text-align:center">' +
      '<div class="room-kicker">Overboard</div>' +
      '<h1 class="room-title">Beneath the Waves</h1>' +
      '<p class="room-lede" style="margin:0 auto">The world goes muffled and blue. Bubbles rise. Somewhere above, the storm is only a rumor.</p>' +
      '<p style="margin-top:30px"><a class="btn-aged" data-go="#/hub" href="#/hub">Surface</a></p>' +
      '<p class="soon" style="margin-top:18px">Listen — the sound itself dives with you.</p>' +
    '</div>';
  }

  function render(hash){
    var view = el('view');
    var key = hash.replace('#/','') || 'hub';

    // special: dive
    if (key === 'dive'){
      view.innerHTML = diveRoom();
      Audio && Audio.setZone('water');
      Weather && Weather.setMode('water');
      setActiveNav('');
      window.scrollTo(0,0);
      return;
    }

    var room = rooms[key] || rooms.hub;
    view.innerHTML = room.render();
    if (room.init) room.init(view);

    Audio && Audio.setZone(room.zone || 'deck');
    Weather && Weather.setMode(room.weather || 'storm');
    setActiveNav('#/'+ (rooms[key] ? key : 'hub'));
    document.title = 'BARNACLES — ' + (room.title || 'A Pirate\'s Compendium');
    window.scrollTo(0,0);
  }

  function route(){ render(location.hash || '#/hub'); }

  function comeAboard(){
    Audio && Audio.init();
    el('gate').classList.add('gone');
    setTimeout(function(){ el('gate').style.display='none'; }, 1200);
    ['rail','view','foot'].forEach(function(id){ el(id).classList.remove('hidden'); });
    if (!location.hash) location.hash = '#/hub';
    route();
  }

  function init(){
    Weather && Weather.mount();
    buildNav();

    // rotate footer quote
    var fq = el('foot-quote'); var qi = 0;
    setInterval(function(){ qi=(qi+1)%footQuotes.length; if(fq){ fq.style.opacity=0; setTimeout(function(){ fq.textContent=footQuotes[qi]; fq.style.opacity=1; },400); } }, 9000);
    if (fq){ fq.style.transition='opacity .4s ease'; }

    el('gate-btn').addEventListener('click', comeAboard);

    el('sound-toggle').addEventListener('click', function(){
      var muted = Audio.toggleMute();
      this.classList.toggle('muted', muted);
      this.innerHTML = muted ? '&#9834;&#822;' : '&#9834;';
      this.title = muted ? 'Sound off' : 'Sound on';
    });

    // delegate clicks for [data-go] (SVG hotspots + links)
    document.addEventListener('click', function(e){
      var t = e.target;
      while (t && t !== document){
        if (t.dataset && t.dataset.go){ e.preventDefault(); location.hash = t.dataset.go; return; }
        t = t.parentNode;
      }
    });

    window.addEventListener('hashchange', route);

    // If user reloads on a deep link, still show the gate first (audio needs a gesture).
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
