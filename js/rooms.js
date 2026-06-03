/* ============================================================
   BARNACLES — content panels
   The learning content shown when you explore a location. Each
   entry has render() (HTML string) and optional init(el). The
   ship mounts these beneath the scene. (No hub here anymore —
   the ship itself is the navigation.)
   ============================================================ */
(function () {
  'use strict';
  var C = window.BRN.content;
  var esc = function (s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };

  function roomHead(r){
    return '<div class="room-kicker">'+esc(r.kicker||'')+'</div>' +
           '<h2 class="room-title">'+esc(r.title)+'</h2>';
  }
  function renderTerms(arr){
    return '<div class="glossary" style="columns:2 300px">' + arr.map(function(t){
      return '<div class="term"><span class="word">'+esc(t.word)+'</span> ' +
        '<span class="tag '+(t.tag==='real'?'real':'myth')+'">'+(t.tag==='real'?'real':'myth')+'</span>' +
        '<div class="def">'+esc(t.def)+'</div></div>';
    }).join('') + '</div>';
  }

  var rooms = {

    ships: {
      title:"How Ships Work", kicker:"The Shipwright's Deck",
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
          '<h3 class="section">Anatomy of the ship</h3><p>Tap the numbers.</p>' + diag +
          '<h3 class="section">Breeds of vessel &amp; their eras</h3>' + types;
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
      title:"Shanties", kicker:"Songs of the Capstan",
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
        return roomHead(this) + '<p class="room-lede">'+C.shantyIntro+'</p>' + list;
      },
      init:function(el){
        el.querySelectorAll('[data-beat]').forEach(function(b){
          b.addEventListener('click', function(){ playBeat(8); });
        });
      }
    },

    speak: {
      title:"Pirate Speak", kicker:"Real vs. Myth",
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
      title:"History of Piracy", kicker:"The Crow's Nest looks back",
      render:function(){
        var tl = '<div class="timeline">' + C.history.map(function(h){
          return '<div class="tl-item"><div class="tl-year">'+esc(h.year)+'</div><div class="tl-body">'+h.text+'</div></div>';
        }).join('') + '</div>';
        return roomHead(this) + '<p class="room-lede">'+C.historyIntro+'</p>' + tl;
      }
    },

    forge: {
      title:"The Forge", kicker:"Words of Fire & Iron",
      render:function(){
        var words = '<div class="glossary" style="columns:2 260px;margin-top:18px">' +
          C.forge.map(function(w){
            return '<div class="forge-word"><span class="word">'+esc(w.word)+'</span> &mdash; <span class="def">'+esc(w.def)+'</span></div>';
          }).join('') + '</div>';
        return roomHead(this) + '<p class="room-lede">'+C.forgeIntro+'</p>' + words;
      }
    },

    quarters: {
      title:"Captain's Quarters", kicker:"The Book — Barnacles",
      render:function(){
        var b = C.book;
        var cover =
          '<div class="cover-frame">' +
            '<img src="assets/cover.jpg" alt="Barnacles cover" onerror="this.outerHTML=\'<div class=&quot;cover-missing&quot;>Drop your cover art at assets/cover.jpg and it appears here.</div>\'" />' +
            '<div style="flex:1;min-width:260px"><p class="room-lede">'+b.blurb+'</p>' +
            '<p><a class="btn-ghost" href="https://www.instagram.com/barnacles_book/" target="_blank" rel="noopener">Follow @barnacles_book</a> ' +
            '<span class="soon">&nbsp; Buy / read the book — coming when it\'s ready.</span></p></div>' +
          '</div>';
        var crew = '<h3 class="section">The Crew</h3><div class="grid cols-3">' +
          b.crew.map(function(c){
            return '<div class="panel char"><div class="role">'+esc(c.role)+'</div><div class="name">'+esc(c.name)+'</div><p>'+esc(c.note)+'</p></div>';
          }).join('') + '</div>' +
          '<div class="panel" style="margin-top:14px"><h3>Building each soul</h3><ul>' +
          b.crewPrompts.map(function(p){return '<li style="margin:.4em 0">'+esc(p)+'</li>';}).join('') + '</ul></div>';
        var lines = '<h3 class="section">The Lines</h3><p class="soon">Your words, held here &mdash; never rewritten.</p><div class="grid cols-2">' +
          b.lines.map(function(l){return '<div class="note-paper"><div class="q">'+esc(l)+'</div></div>';}).join('') + '</div>';
        var phrases = '<h3 class="section">Phrases to make stick</h3><div class="grid cols-2">' +
          b.phrases.map(function(p){return '<div class="note-paper"><div class="q">'+esc(p)+'</div></div>';}).join('') +
          '<div class="note-paper"><div class="q" style="font-style:normal">'+esc(b.proverbs)+'</div></div></div>';
        var map = '<h3 class="section">The Map</h3><div class="panel cover-missing" style="width:100%;aspect-ratio:auto;min-height:160px">Drop a map image at assets/map.jpg and it lives here.</div>';
        var music = '<h3 class="section">The Music</h3><div class="grid cols-2">' +
          b.music.map(function(m){return '<div class="panel"><h3 style="margin:.2em 0">'+esc(m.t)+'</h3><p style="color:var(--parch-dim)">'+esc(m.why)+'</p></div>';}).join('') + '</div>';
        return roomHead(this) + cover + crew + lines + phrases + map + music;
      }
    },

    gunnery: {
      title:"Gunnery", kicker:"Run out the guns",
      render:function(){
        return '<h3 class="section">Gunnery — a teaser</h3>' +
          '<p class="room-lede">Click the sea to fire on passing sail. Lead your shot &mdash; a fired ball takes a breath to arrive.</p>' +
          '<div class="panel" style="margin-top:12px"><canvas id="cannon-game" width="900" height="380"></canvas>' +
          '<p style="margin-top:10px"><span id="score" style="color:var(--gold-bright);font-family:var(--display)">Prizes taken: 0</span> ' +
          '<span class="soon">&nbsp;&mdash; more games to come.</span></p></div>';
      },
      init:function(el){ startCannon(el.querySelector('#cannon-game')); }
    }
  };

  /* ---- shared audio helpers ---- */
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

  function startCannon(cv){
    if(!cv) return;
    var ctx = cv.getContext('2d'), W=cv.width, H=cv.height;
    var ships=[], balls=[], score=0, last=performance.now(), spawn=0, running=true;
    function spawnShip(){
      var dir = Math.random()<.5?1:-1;
      ships.push({ x: dir>0?-60:W+60, y: 50+Math.random()*160, v: dir*(60+Math.random()*70), dir:dir });
    }
    cv.addEventListener('click', function(e){
      var r=cv.getBoundingClientRect();
      var tx=(e.clientX-r.left)*(W/r.width), ty=(e.clientY-r.top)*(H/r.height);
      balls.push({ x:W/2, y:H-20, tx:tx, ty:ty, t:0, dur:0.55 });
      var A=window.BRN.Audio; if(A&&A.ready){
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
      var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0e2027'); g.addColorStop(1,'#06121a'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='rgba(60,107,107,.4)'; for(var y=H*0.45;y<H;y+=24){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      ctx.fillStyle='#c9a24a'; ctx.fillRect(W/2-18,H-22,36,22);
      ctx.fillStyle='#2a1c10'; ctx.fillRect(W/2-6,H-34,12,16);
      for(var i=ships.length-1;i>=0;i--){ var s=ships[i]; s.x+=s.v*dt;
        ctx.save(); ctx.translate(s.x,s.y); ctx.scale(s.dir,1);
        ctx.fillStyle='#5a3d22'; ctx.beginPath(); ctx.moveTo(-26,8); ctx.quadraticCurveTo(0,18,26,8); ctx.lineTo(20,-2); ctx.lineTo(-20,-2); ctx.closePath(); ctx.fill();
        ctx.fillStyle='#e9dcbd'; ctx.fillRect(-2,-30,4,28); ctx.beginPath(); ctx.moveTo(2,-28); ctx.lineTo(22,-16); ctx.lineTo(2,-6); ctx.fill();
        ctx.restore();
        if(s.x< -80||s.x>W+80) ships.splice(i,1);
      }
      for(var j=balls.length-1;j>=0;j--){ var b=balls[j]; b.t+=dt; var p=b.t/b.dur;
        if(p>=1){
          for(var m=ships.length-1;m>=0;m--){ var sh=ships[m]; if(Math.abs(sh.x-b.tx)<30 && Math.abs(sh.y-b.ty)<24){ ships.splice(m,1); score++; var sel=document.getElementById('score'); if(sel) sel.textContent='Prizes taken: '+score; break; } }
          balls.splice(j,1); continue;
        }
        var bx=b.x+(b.tx-b.x)*p, by=b.y+(b.ty-b.y)*p - Math.sin(p*Math.PI)*110;
        ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(bx,by,5,0,6.28); ctx.fill();
      }
      if(running) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  window.BRN.rooms = rooms;
})();
