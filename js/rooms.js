/* ============================================================
   BARNACLES — rooms
   Each room: { title, kicker, zone, weather, render(), init() }
   render() returns an HTML string; init(el) wires interactivity.
   ============================================================ */
(function () {
  'use strict';
  var C = window.BRN.content;
  var esc = function (s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };

  /* ---------------- HUB : the ship ---------------- */
  function hubSVG() {
    // viewBox 1000 x 640. Hotspots are groups with data-go.
    return '' +
    '<svg viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A pirate ship. Click a part to explore.">' +
      '<defs>' +
        '<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#173640"/><stop offset="1" stop-color="#08161d"/></linearGradient>' +
        '<linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#5a3d22"/><stop offset="1" stop-color="#2a1c10"/></linearGradient>' +
        '<linearGradient id="sail" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#e9dcbd"/><stop offset="1" stop-color="#b8a87e"/></linearGradient>' +
        '<radialGradient id="moon" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0" stop-color="#f4ecd0"/><stop offset="70%" stop-color="#c9c39e"/><stop offset="100%" stop-color="#c9c39e" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="forgeGlow" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0" stop-color="#ffae57"/><stop offset="100%" stop-color="#ffae57" stop-opacity="0"/></radialGradient>' +
      '</defs>' +

      // moon
      '<circle cx="820" cy="120" r="64" fill="url(#moon)" opacity="0.7"/>' +

      // sea
      '<path d="M0 470 Q 250 445 500 470 T 1000 470 L1000 640 L0 640 Z" fill="url(#sea)"/>' +
      '<path d="M0 470 Q 250 445 500 470 T 1000 470" fill="none" stroke="#2c5560" stroke-width="2" opacity="0.6"/>' +

      // ===== masts & rigging =====
      '<g stroke="#3a2a18" stroke-width="6" fill="none" opacity="0.9">' +
        '<line x1="350" y1="120" x2="350" y2="470"/>' +
        '<line x1="560" y1="70"  x2="560" y2="470"/>' +
        '<line x1="700" y1="150" x2="700" y2="460"/>' +
      '</g>' +
      // rigging lines
      '<g stroke="#1c140c" stroke-width="1.5" opacity="0.55">' +
        '<line x1="560" y1="80" x2="350" y2="300"/><line x1="560" y1="80" x2="700" y2="320"/>' +
        '<line x1="350" y1="130" x2="250" y2="400"/><line x1="700" y1="160" x2="820" y2="410"/>' +
        '<line x1="560" y1="80" x2="200" y2="430"/><line x1="560" y1="80" x2="900" y2="430"/>' +
      '</g>' +

      // ===== sails =====
      '<g opacity="0.96">' +
        '<path d="M300 150 Q350 175 400 150 L392 250 Q350 270 308 250 Z" fill="url(#sail)" stroke="#8a7a52"/>' +
        '<path d="M495 100 Q560 130 625 100 L612 235 Q560 258 508 235 Z" fill="url(#sail)" stroke="#8a7a52"/>' +
        '<path d="M500 270 Q560 292 620 270 L610 360 Q560 378 510 360 Z" fill="url(#sail)" stroke="#8a7a52"/>' +
        '<path d="M650 178 Q700 200 752 178 L744 280 Q700 298 658 280 Z" fill="url(#sail)" stroke="#8a7a52"/>' +
      '</g>' +
      // flag (Jolly Roger)
      '<g>' +
        '<rect x="560" y="58" width="2" height="14" fill="#3a2a18"/>' +
        '<path d="M562 60 L640 64 L632 80 L562 84 Z" fill="#0c0c0c" stroke="#000"/>' +
        '<circle cx="596" cy="70" r="5" fill="#e9dcbd"/>' +
        '<rect x="589" y="74" width="14" height="3" fill="#e9dcbd" transform="rotate(20 596 75)"/>' +
        '<rect x="589" y="74" width="14" height="3" fill="#e9dcbd" transform="rotate(-20 596 75)"/>' +
      '</g>' +

      // ===== hull =====
      '<path d="M150 400 Q500 380 870 400 L820 470 Q500 500 200 470 Z" fill="url(#hull)" stroke="#1c120a" stroke-width="3"/>' +
      '<rect x="200" y="418" width="600" height="6" fill="#2a1c10" opacity="0.6"/>' +
      // gunports
      '<g fill="#120c07">' +
        '<rect x="260" y="430" width="26" height="20" rx="3"/><rect x="330" y="432" width="26" height="20" rx="3"/>' +
        '<rect x="400" y="433" width="26" height="20" rx="3"/><rect x="470" y="433" width="26" height="20" rx="3"/>' +
        '<rect x="540" y="432" width="26" height="20" rx="3"/><rect x="610" y="431" width="26" height="20" rx="3"/>' +
        '<rect x="680" y="430" width="26" height="20" rx="3"/></g>' +
      // forge glow belowdecks
      '<circle cx="250" cy="445" r="40" fill="url(#forgeGlow)" opacity="0.85"/>' +
      // stern cabin windows
      '<g fill="#e6c468" opacity="0.85"><rect x="790" y="405" width="14" height="16" rx="2"/><rect x="808" y="405" width="14" height="16" rx="2"/></g>' +

      // ===== HOTSPOTS ===== (data-go = route)
      hot(700,150,120,90,'#/history',"Crow's Nest · History") +
      hot(488,95,150,160,'#/ships',"Rigging & Hull · How Ships Work") +
      hot(300,150,110,110,'#/shanties',"The Sails · Shanties") +
      hot(250,408,120,70,'#/forge',"The Forge") +
      hot(760,395,120,80,'#/quarters',"Captain's Quarters · Barnacles") +
      hot(420,425,260,45,'#/speak',"The Gun Deck · Pirate Speak") +
      hot(40,520,920,110,'#/dive',"Dive overboard…") +
    '</svg>';
  }
  function hot(x,y,w,h,go,label){
    return '<g class="hot" data-go="'+go+'">' +
      '<rect class="hot-fill" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6"/>' +
      '<text class="hot-label" x="'+(x+w/2)+'" y="'+(y+h/2)+'">'+esc(label)+'</text>' +
    '</g>';
  }

  var rooms = {

    hub: {
      title:"Barnacles", kicker:"", zone:"deck", weather:"storm",
      render:function(){
        var links = [
          ['#/ships','How Ships Work'],['#/shanties','Shanties'],['#/speak','Pirate Speak'],
          ['#/history','History'],['#/forge','The Forge'],['#/quarters',"Captain's Quarters"],['#/gunnery','Gunnery']
        ].map(function(l){return '<a data-go="'+l[0]+'" href="'+l[0]+'">'+l[1]+'</a>';}).join('');
        return '<div class="hub-wrap room">' +
          '<p class="hub-sub">Welcome aboard. The storm\'s up — mind your footing.</p>' +
          '<h1 class="hub-title">BARNACLES</h1>' +
          '<p class="hub-sub" style="margin-bottom:6px">Click a part of the ship to go below.</p>' +
          '<div class="ship-stage">'+hubSVG()+'</div>' +
          '<p class="hub-hint">Or chart a course &darr;</p>' +
          '<div class="room-links">'+links+'</div>' +
        '</div>';
      }
    },

    ships: {
      title:"How Ships Work", kicker:"The Shipwright's Deck", zone:"below", weather:"deep",
      render:function(){
        var diag =
          '<div class="shipdiag panel" style="margin-top:18px">' +
          '<svg viewBox="0 0 1000 520" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M70 360 Q500 300 940 360 L880 470 Q500 510 130 470 Z" fill="#2a1c10" stroke="#c9a24a" stroke-opacity="0.4" stroke-width="2"/>' +
            '<line x1="175" y1="120" x2="175" y2="360" stroke="#5a3d22" stroke-width="7"/>' +
            '<line x1="500" y1="55" x2="500" y2="360" stroke="#5a3d22" stroke-width="8"/>' +
            '<line x1="760" y1="100" x2="905" y2="240" stroke="#5a3d22" stroke-width="4"/>' +
            '<rect x="120" y="300" width="760" height="3" fill="#c9a24a" opacity="0.35"/>' +
            '<rect x="150" y="400" width="700" height="3" fill="#c9a24a" opacity="0.35"/>' +
            C.shipParts.map(function(p,i){
              return '<g class="dot" data-part="'+i+'" tabindex="0">' +
                '<circle cx="'+p.x+'" cy="'+p.y+'" r="9"/>' +
                '<text x="'+p.x+'" y="'+p.y+'">'+(i+1)+'</text></g>';
            }).join('') +
          '</svg>' +
          '<div class="part-info" id="partinfo"><p class="soon">Tap a numbered point on the ship&hellip;</p></div>' +
          '</div>';
        var types = '<div class="grid cols-2" style="margin-top:18px">' + C.ships.map(function(s){
          return '<div class="panel"><span class="tag era">'+esc(s.era)+'</span>' +
            '<h3 style="margin:.3em 0">'+esc(s.name)+'</h3>' +
            '<p style="color:var(--parch-dim);font-size:13px;letter-spacing:.04em">'+esc(s.rig)+'</p>' +
            '<p>'+esc(s.blurb)+'</p>' +
            '<p style="color:var(--gold-bright);font-size:14px">'+esc(s.stat)+'</p></div>';
        }).join('') + '</div>';
        return roomHead(this) +
          '<p class="room-lede">A ship is a machine of wind, rope, and timber. Learn her parts, then meet the breeds &mdash; and why a pirate prized speed and shallow water over sheer firepower.</p>' +
          '<h2 class="section">Anatomy of the ship</h2><p>Tap the numbers.</p>' + diag +
          '<h2 class="section">Breeds of vessel &amp; their eras</h2>' + types;
      },
      init:function(el){
        el.querySelectorAll('.dot').forEach(function(d){
          function show(){
            el.querySelectorAll('.dot').forEach(function(x){x.classList.remove('active');});
            d.classList.add('active');
            var p = C.shipParts[+d.dataset.part];
            el.querySelector('#partinfo').innerHTML =
              '<div class="card"><h3>'+esc(p.label)+'</h3><p>'+esc(p.text)+'</p></div>';
          }
          d.addEventListener('click', show);
          d.addEventListener('keydown', function(e){ if(e.key==='Enter') show(); });
        });
      }
    },

    shanties: {
      title:"Shanties", kicker:"The Galley & The Capstan", zone:"below", weather:"deep",
      render:function(){
        var list = C.shanties.map(function(s,i){
          var lyr = s.lines.map(function(l){
            return '<div class="'+(l[1]?'resp':'call')+'">'+esc(l[0])+'</div>';
          }).join('');
          return '<div class="panel shanty" style="margin-top:16px">' +
            '<span class="tag">'+esc(s.type)+'</span>' +
            '<h3 style="margin:.3em 0">'+esc(s.title)+'</h3>' +
            '<p style="color:var(--parch-dim);font-style:italic">'+esc(s.note)+'</p>' +
            '<div class="shanty-controls">' +
              '<button class="btn-ghost" data-beat="'+i+'">Sound the rhythm &#9834;</button>' +
              '<span style="color:var(--parch-dim);font-size:13px">(call &amp; <span class="resp">response</span>)</span>' +
            '</div>' +
            '<div class="lyrics">'+lyr+'</div></div>';
        }).join('');
        return roomHead(this) +
          '<p class="room-lede">'+C.shantyIntro+'</p>' + list;
      },
      init:function(el){
        el.querySelectorAll('[data-beat]').forEach(function(b){
          b.addEventListener('click', function(){ playBeat(8); });
        });
      }
    },

    speak: {
      title:"Pirate Speak", kicker:"Real vs. Myth", zone:"below", weather:"deep",
      render:function(){
        return roomHead(this) +
          '<p class="room-lede">'+C.speakIntro+'</p>' +
          '<input class="search" id="termsearch" placeholder="Search the lexicon&hellip;" />' +
          '<div id="termlist" style="margin-top:18px">'+renderTerms(C.terms)+'</div>';
      },
      init:function(el){
        var input = el.querySelector('#termsearch');
        input.addEventListener('input', function(){
          var q = input.value.toLowerCase();
          var f = C.terms.filter(function(t){ return (t.word+' '+t.def).toLowerCase().indexOf(q)>=0; });
          el.querySelector('#termlist').innerHTML = renderTerms(f);
        });
      }
    },

    history: {
      title:"History of Piracy", kicker:"The Crow's Nest looks back", zone:"cabin", weather:"storm",
      render:function(){
        var tl = '<div class="timeline">' + C.history.map(function(h){
          return '<div class="tl-item"><div class="tl-year">'+esc(h.year)+'</div><div class="tl-body">'+h.text+'</div></div>';
        }).join('') + '</div>';
        return roomHead(this) + '<p class="room-lede">'+C.historyIntro+'</p>' + tl;
      }
    },

    forge: {
      title:"The Forge", kicker:"Words of Fire & Iron", zone:"forge", weather:"forge",
      render:function(){
        var words = '<div class="grid cols-2" style="margin-top:18px"><div class="glossary" style="columns:2 260px">' +
          C.forge.map(function(w){
            return '<div class="forge-word"><span class="word">'+esc(w.word)+'</span> &mdash; <span class="def">'+esc(w.def)+'</span></div>';
          }).join('') + '</div></div>';
        return roomHead(this) + '<p class="room-lede">'+C.forgeIntro+'</p>' + words;
      }
    },

    quarters: {
      title:"Captain's Quarters", kicker:"The Book — Barnacles", zone:"cabin", weather:"cabin",
      render:function(){
        var b = C.book;
        var cover =
          '<div class="cover-frame">' +
            '<img src="assets/cover.jpg" alt="Barnacles cover" onerror="this.outerHTML=\'<div class=&quot;cover-missing&quot;>Drop your cover art at assets/cover.jpg and it appears here.</div>\'" />' +
            '<div style="flex:1;min-width:260px"><p class="room-lede">'+b.blurb+'</p>' +
            '<p><a class="btn-ghost" href="https://www.instagram.com/barnacles_book/" target="_blank" rel="noopener">Follow @barnacles_book</a> ' +
            '<span class="soon">&nbsp; Buy / read the book — coming when it\'s ready.</span></p></div>' +
          '</div>';
        var crew = '<h2 class="section">The Crew</h2><div class="grid cols-3">' +
          b.crew.map(function(c){
            return '<div class="panel char"><div class="role">'+esc(c.role)+'</div><div class="name">'+esc(c.name)+'</div><p>'+esc(c.note)+'</p></div>';
          }).join('') + '</div>' +
          '<div class="panel" style="margin-top:14px"><h3>Building each soul</h3><ul>' +
          b.crewPrompts.map(function(p){return '<li style="margin:.4em 0">'+esc(p)+'</li>';}).join('') + '</ul></div>';
        var lines = '<h2 class="section">The Lines</h2><p class="soon">Your words, held here &mdash; never rewritten.</p><div class="grid cols-2">' +
          b.lines.map(function(l){return '<div class="note-paper"><div class="q">'+esc(l)+'</div></div>';}).join('') + '</div>';
        var phrases = '<h2 class="section">Phrases to make stick</h2><div class="grid cols-2">' +
          b.phrases.map(function(p){return '<div class="note-paper"><div class="q">'+esc(p)+'</div></div>';}).join('') +
          '<div class="note-paper"><div class="q" style="font-style:normal">'+esc(b.proverbs)+'</div></div></div>';
        var map = '<h2 class="section">The Map</h2><div class="panel cover-missing" style="width:100%;aspect-ratio:auto;min-height:160px">Drop a map image at assets/map.jpg (or ask me to wire a new filename) and it lives here.</div>';
        var music = '<h2 class="section">The Music</h2><div class="grid cols-2">' +
          b.music.map(function(m){return '<div class="panel"><h3 style="margin:.2em 0">'+esc(m.t)+'</h3><p style="color:var(--parch-dim)">'+esc(m.why)+'</p></div>';}).join('') + '</div>';
        var creepy = '<h2 class="section">The Dread (a creepy list)</h2><div class="panel"><ul>' +
          b.creepy.map(function(x){return '<li>'+esc(x)+'</li>';}).join('') + '</ul>' +
          '<p style="margin-top:10px">Words on the wind: ' + b.words.map(function(w){return '<span class="tag">'+esc(w)+'</span>';}).join('') + '</p></div>';
        return roomHead(this) + cover + crew + lines + phrases + map + music + creepy;
      }
    },

    gunnery: {
      title:"Gunnery", kicker:"Run out the guns (a teaser game)", zone:"deck", weather:"storm",
      render:function(){
        return roomHead(this) +
          '<p class="room-lede">A taste of things to come. Click the sea to fire on passing sail. Lead your shot &mdash; a fired ball takes a breath to arrive.</p>' +
          '<div class="panel" style="margin-top:16px"><canvas id="cannon-game" width="900" height="420"></canvas>' +
          '<p style="margin-top:10px"><span id="score" style="color:var(--gold-bright);font-family:var(--display)">Prizes taken: 0</span> ' +
          '<span class="soon">&nbsp;&mdash; more games to come if Barnacles ever sails public.</span></p></div>';
      },
      init:function(el){ startCannon(el.querySelector('#cannon-game')); }
    }
  };

  /* ---------- helpers ---------- */
  function roomHead(r){
    return '<div class="room"><div class="room-kicker">'+esc(r.kicker||'')+'</div>' +
           '<h1 class="room-title">'+esc(r.title)+'</h1></div>';
  }
  function renderTerms(arr){
    return '<div class="glossary" style="columns:2 300px">' + arr.map(function(t){
      return '<div class="term"><span class="word">'+esc(t.word)+'</span> ' +
        '<span class="tag '+(t.tag==='real'?'real':'myth')+'">'+(t.tag==='real'?'real':'myth')+'</span>' +
        '<div class="def">'+esc(t.def)+'</div></div>';
    }).join('') + '</div>';
  }

  // simple percussive metronome using the audio engine's context
  function playBeat(beats){
    var A = window.BRN.Audio;
    if(!A || !A.ready) return;
    var ctx = A.ctx, t = ctx.currentTime, step = 0.42;
    for(var i=0;i<beats;i++){
      var time = t + i*step;
      var o = ctx.createGain(); o.gain.value=0;
      var n = ctx.createBufferSource();
      var buf = ctx.createBuffer(1, ctx.sampleRate*0.12, ctx.sampleRate);
      var d = buf.getChannelData(0);
      for(var k=0;k<d.length;k++) d[k]=(Math.random()*2-1)*Math.pow(1-k/d.length,3);
      n.buffer=buf;
      var f = ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value = (i%2===0)?220:520;
      n.connect(f); f.connect(o); o.connect(A.master);
      var amp = (i%2===0)?0.6:0.32;
      o.gain.setValueAtTime(amp,time); o.gain.exponentialRampToValueAtTime(0.001,time+0.18);
      n.start(time); n.stop(time+0.2);
    }
  }

  /* ---------- mini-game: broadside ---------- */
  function startCannon(cv){
    if(!cv) return;
    var ctx = cv.getContext('2d'), W=cv.width, H=cv.height;
    var ships=[], balls=[], score=0, last=performance.now(), spawn=0, running=true;
    function spawnShip(){
      var dir = Math.random()<.5?1:-1;
      ships.push({ x: dir>0?-60:W+60, y: 60+Math.random()*180, v: dir*(60+Math.random()*70), dir:dir });
    }
    cv.addEventListener('click', function(e){
      var r=cv.getBoundingClientRect();
      var tx=(e.clientX-r.left)*(W/r.width), ty=(e.clientY-r.top)*(H/r.height);
      balls.push({ x:W/2, y:H-20, tx:tx, ty:ty, t:0, dur:0.55 });
      var A=window.BRN.Audio; if(A&&A.ready){ // little boom
        var c=A.ctx, tm=c.currentTime, n=c.createBufferSource(), b=c.createBuffer(1,c.sampleRate*0.3,c.sampleRate),d=b.getChannelData(0);
        for(var k=0;k<d.length;k++) d[k]=(Math.random()*2-1)*Math.pow(1-k/d.length,2);
        n.buffer=b; var f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=400; var g=c.createGain(); g.gain.value=0;
        n.connect(f); f.connect(g); g.connect(A.master); g.gain.setValueAtTime(.7,tm); g.gain.exponentialRampToValueAtTime(.001,tm+.3); n.start(tm); n.stop(tm+.32);
      }
    });
    function frame(now){
      if(!document.body.contains(cv)){ running=false; return; }
      var dt=Math.min(.05,(now-last)/1000); last=now; spawn-=dt;
      if(spawn<=0){ spawnShip(); spawn=1.2+Math.random()*1.4; }
      ctx.clearRect(0,0,W,H);
      // water
      var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0e2027'); g.addColorStop(1,'#06121a'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='rgba(60,107,107,.4)'; for(var y=H*0.45;y<H;y+=26){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // your cannon
      ctx.fillStyle='#c9a24a'; ctx.fillRect(W/2-18,H-22,36,22);
      ctx.fillStyle='#2a1c10'; ctx.fillRect(W/2-6,H-34,12,16);
      // ships
      for(var i=ships.length-1;i>=0;i--){ var s=ships[i]; s.x+=s.v*dt;
        ctx.save(); ctx.translate(s.x,s.y); ctx.scale(s.dir,1);
        ctx.fillStyle='#5a3d22'; ctx.beginPath(); ctx.moveTo(-26,8); ctx.quadraticCurveTo(0,18,26,8); ctx.lineTo(20,-2); ctx.lineTo(-20,-2); ctx.closePath(); ctx.fill();
        ctx.fillStyle='#e9dcbd'; ctx.fillRect(-2,-30,4,28); ctx.beginPath(); ctx.moveTo(2,-28); ctx.lineTo(22,-16); ctx.lineTo(2,-6); ctx.fill();
        ctx.restore();
        if(s.x< -80||s.x>W+80) ships.splice(i,1);
      }
      // balls
      for(var j=balls.length-1;j>=0;j--){ var b=balls[j]; b.t+=dt; var p=b.t/b.dur;
        if(p>=1){ // landed — check hits
          for(var m=ships.length-1;m>=0;m--){ var sh=ships[m]; if(Math.abs(sh.x-b.tx)<30 && Math.abs(sh.y-b.ty)<24){ ships.splice(m,1); score++; var el=document.getElementById('score'); if(el) el.textContent='Prizes taken: '+score; break; } }
          balls.splice(j,1); continue;
        }
        var bx=b.x+(b.tx-b.x)*p, by=b.y+(b.ty-b.y)*p - Math.sin(p*Math.PI)*120;
        ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(bx,by,5,0,6.28); ctx.fill();
        ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(b.x+(b.tx-b.x)*p,b.ty,10,4,0,0,6.28); ctx.fill();
      }
      if(running) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  window.BRN.rooms = rooms;
})();
