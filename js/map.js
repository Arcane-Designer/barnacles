/* ============================================================
   BARNACLES — ship's map (fast travel) + visited tracking
   A compass button opens a deck-plan of the ship; click a room to
   sail straight there. Visited rooms are remembered (localStorage,
   with a graceful in-memory fallback) and marked on the chart.
   ============================================================ */
(function () {
  'use strict';
  var REGIONS = [
    { key:'crowsnest', label:"Crow's Nest", x:400, y:24,  w:130, h:66 },
    { key:'helm',      label:'Helm',        x:64,  y:150, w:196, h:86 },
    { key:'maindeck',  label:'Main Deck',   x:286, y:150, w:300, h:86 },
    { key:'forecastle',label:'Forecastle',  x:612, y:150, w:214, h:86 },
    { key:'cabin',     label:'Great Cabin', x:74,  y:256, w:214, h:92 },
    { key:'gundeck',   label:'Gun Deck',    x:316, y:256, w:270, h:92 },
    { key:'galley',    label:'Galley',      x:612, y:256, w:214, h:92 },
    { key:'hold',      label:'The Hold',    x:140, y:368, w:620, h:86 },
    { key:'sea',       label:'Overboard',   x:60,  y:476, w:800, h:74 }
  ];
  var STORE = 'barnacles_visited';
  var Map = { visited:{} };

  function load(){ try{ Map.visited = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch(e){ /* keep memory */ } }
  function save(){ try{ localStorage.setItem(STORE, JSON.stringify(Map.visited)); } catch(e){} }

  Map.visit = function(k){ if(!Map.visited[k]){ Map.visited[k]=1; save(); } };

  function hull(){
    return '<defs><linearGradient id="mh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2614"/><stop offset="1" stop-color="#1c1206"/></linearGradient></defs>'+
      // water
      '<rect x="0" y="470" width="920" height="110" fill="#0c2630"/>'+
      '<path d="M0 476 q 60 -10 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0" fill="none" stroke="#1f4a55" stroke-width="2" opacity="0.6"/>'+
      // hull silhouette (bow to the right)
      '<path d="M40 130 L860 130 Q 910 300 760 458 L150 458 Q 30 300 40 130 Z" fill="url(#mh)" stroke="#5a3d22" stroke-width="3"/>'+
      // deck dividers
      '<line x1="55" y1="246" x2="845" y2="246" stroke="#5a3d22" stroke-width="2" opacity="0.5"/>'+
      '<line x1="80" y1="358" x2="780" y2="358" stroke="#5a3d22" stroke-width="2" opacity="0.5"/>'+
      // mast + crow's nest
      '<rect x="458" y="40" width="14" height="120" fill="#3a2614"/>'+
      // masts/sails hint
      '<path d="M300 150 L300 70 L420 110 Z" fill="#e9dcbd" opacity="0.12"/>'+
      '<path d="M620 150 L620 80 L520 116 Z" fill="#e9dcbd" opacity="0.12"/>';
  }

  function svg(){
    var cur = (window.BRN.Ship && window.BRN.Ship.current) || '';
    var regs = REGIONS.map(function(r){
      var cls = 'maproom' + (Map.visited[r.key]?' visited':'') + (r.key===cur?' current':'');
      return '<g class="'+cls+'" data-go="'+r.key+'">'+
        '<rect x="'+r.x+'" y="'+r.y+'" width="'+r.w+'" height="'+r.h+'" rx="8"/>'+
        '<text class="mr-label" x="'+(r.x+r.w/2)+'" y="'+(r.y+r.h/2)+'">'+r.label+'</text>'+
        (Map.visited[r.key]?'<text class="mr-check" x="'+(r.x+r.w-16)+'" y="'+(r.y+20)+'">&#10003;</text>':'')+
        (r.key===cur?'<text class="mr-here" x="'+(r.x+14)+'" y="'+(r.y+20)+'">&#9733;</text>':'')+
      '</g>';
    }).join('');
    return '<svg viewBox="0 0 920 580" xmlns="http://www.w3.org/2000/svg">'+hull()+regs+'</svg>';
  }

  Map.render = function(){ var c=document.getElementById('shipmap-svg'); if(c) c.innerHTML=svg(); };
  Map.open = function(){ load(); Map.render(); var m=document.getElementById('shipmap'); m.classList.add('open'); m.setAttribute('aria-hidden','false'); };
  Map.close = function(){ var m=document.getElementById('shipmap'); if(!m)return; m.classList.remove('open'); m.setAttribute('aria-hidden','true'); };
  Map.toggle = function(){ var m=document.getElementById('shipmap'); if(m && m.classList.contains('open')) Map.close(); else Map.open(); };

  Map.init = function(){
    load();
    var btn=document.getElementById('map-toggle'); if(btn) btn.addEventListener('click', Map.toggle);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') Map.close(); if(e.key==='m'||e.key==='M'){ if(document.body.classList.contains('aboard')) Map.toggle(); } });
    document.addEventListener('click', function(e){
      var m=document.getElementById('shipmap'); if(!m) return;
      var t=e.target;
      while(t && t.getAttribute){
        if(t.getAttribute('data-mapclose')){ Map.close(); return; }
        if(m.classList.contains('open')){
          var go=t.getAttribute('data-go');
          if(go && t.closest && t.closest('#shipmap')){ Map.close(); if(window.BRN.Ship) window.BRN.Ship.go(go,'fade'); return; }
        }
        t=t.parentNode;
      }
    });
  };

  window.BRN = window.BRN || {};
  window.BRN.Map = Map;
})();
