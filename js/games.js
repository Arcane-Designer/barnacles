/* ============================================================
   BARNACLES — games & interactive widgets
   Each builder returns { html, init(el) }. rooms.js drops the html
   into a panel and calls init(el) to wire it up. Self-contained.
   ============================================================ */
(function () {
  'use strict';
  var G = {};

  /* =========================================================
     JOLLY ROGER FLAG DESIGNER
     ========================================================= */
  var EMBLEMS = {
    skull: function(c){ return '<g fill="'+c+'">'+
      '<ellipse cx="100" cy="86" rx="52" ry="48"/>'+
      '<rect x="74" y="120" width="52" height="34" rx="10"/>'+
      '<circle cx="80" cy="84" r="15" fill="#0c0c0c"/><circle cx="120" cy="84" r="15" fill="#0c0c0c"/>'+
      '<path d="M100 96 l-9 20 h18 z" fill="#0c0c0c"/>'+
      '<g fill="#0c0c0c"><rect x="80" y="138" width="6" height="14"/><rect x="92" y="138" width="6" height="14"/><rect x="104" y="138" width="6" height="14"/><rect x="116" y="138" width="6" height="14"/></g></g>'; },
    crossbones: function(c){ return '<g stroke="'+c+'" stroke-width="14" stroke-linecap="round">'+
      '<line x1="46" y1="56" x2="154" y2="164"/><line x1="154" y1="56" x2="46" y2="164"/></g>'+
      '<g fill="'+c+'"><circle cx="46" cy="56" r="12"/><circle cx="60" cy="50" r="12"/><circle cx="154" cy="56" r="12"/><circle cx="140" cy="50" r="12"/><circle cx="46" cy="164" r="12"/><circle cx="60" cy="170" r="12"/><circle cx="154" cy="164" r="12"/><circle cx="140" cy="170" r="12"/></g>'+
      EMBLEMS.skull(c); },
    swords: function(c){ return '<g stroke="'+c+'" stroke-width="9" stroke-linecap="round">'+
      '<line x1="40" y1="60" x2="150" y2="170"/><line x1="160" y1="60" x2="50" y2="170"/>'+
      '<line x1="40" y1="78" x2="56" y2="62"/><line x1="160" y1="78" x2="144" y2="62"/></g>'+
      EMBLEMS.skull(c); },
    hourglass: function(c){ return '<g fill="'+c+'">'+
      '<rect x="58" y="40" width="84" height="12" rx="4"/><rect x="58" y="148" width="84" height="12" rx="4"/>'+
      '<path d="M66 52 L134 52 L104 100 L134 148 L66 148 L96 100 Z" opacity="0.85"/>'+
      '<path d="M96 100 L104 100 L118 138 L82 138 Z" fill="#0c0c0c" opacity="0.4"/></g>'; },
    heart: function(c){ return '<g fill="'+c+'">'+
      '<path d="M100 150 C40 104 52 56 84 56 C97 56 100 70 100 74 C100 70 103 56 116 56 C148 56 160 104 100 150 Z"/>'+
      '<path d="M100 150 l-4 26 M100 150 l8 22" stroke="'+c+'" stroke-width="5" stroke-linecap="round"/></g>'; },
    skeleton: function(c){ return '<g fill="'+c+'" stroke="'+c+'" stroke-width="6" stroke-linecap="round">'+
      '<circle cx="100" cy="50" r="22" stroke="none"/>'+
      '<line x1="100" y1="72" x2="100" y2="140"/>'+
      '<line x1="100" y1="86" x2="64" y2="74"/><line x1="100" y1="86" x2="136" y2="74"/>'+
      '<line x1="78" y1="96" x2="122" y2="96"/><line x1="80" y1="110" x2="120" y2="110"/><line x1="82" y1="124" x2="118" y2="124"/>'+
      '<line x1="100" y1="140" x2="76" y2="176"/><line x1="100" y1="140" x2="124" y2="176"/></g>'; }
  };
  var EMBLEM_ORDER = [['skull','Skull'],['crossbones','Skull & Bones'],['swords','Skull & Swords'],['hourglass','Hourglass'],['heart','Bleeding Heart'],['skeleton','Skeleton']];
  var FIELDS = ['#0c0c0c','#7a1f17','#10202a','#15301f','#241a0c'];
  var INKS = ['#efe7d4','#e6c468','#d98a7e','#9fcf9f'];

  function flagSVG(state){
    return '<svg id="flagsvg" viewBox="0 0 360 240" xmlns="http://www.w3.org/2000/svg">'+
      '<rect width="360" height="240" fill="'+state.field+'"/>'+
      '<rect x="6" y="6" width="348" height="228" fill="none" stroke="'+state.ink+'" stroke-opacity="0.25" stroke-width="2"/>'+
      '<g transform="translate(80,20) scale(1.0)">'+ (EMBLEMS[state.emblem]||EMBLEMS.crossbones)(state.ink) +'</g>'+
      '</svg>';
  }

  G.flagDesigner = function(){
    var html =
      '<div class="game flagmaker">'+
      '<div class="flag-stage"><div class="flag-pole"></div><div class="flag-cloth" id="flag-cloth"></div></div>'+
      '<div class="flag-controls">'+
        '<div class="fc-row"><span class="fc-label">Emblem</span><div class="fc-opts" id="fc-emblem">'+
          EMBLEM_ORDER.map(function(e,i){return '<button class="chip'+(i===1?' on':'')+'" data-em="'+e[0]+'">'+e[1]+'</button>';}).join('')+'</div></div>'+
        '<div class="fc-row"><span class="fc-label">Field</span><div class="fc-opts" id="fc-field">'+
          FIELDS.map(function(c,i){return '<button class="sw'+(i===0?' on':'')+'" data-col="'+c+'" style="background:'+c+'"></button>';}).join('')+'</div></div>'+
        '<div class="fc-row"><span class="fc-label">Ink</span><div class="fc-opts" id="fc-ink">'+
          INKS.map(function(c,i){return '<button class="sw'+(i===0?' on':'')+'" data-col="'+c+'" style="background:'+c+'"></button>';}).join('')+'</div></div>'+
        '<button class="btn-ghost" id="flag-dl">Save my colours (PNG)</button>'+
      '</div></div>';
    function init(el){
      var state = { emblem:'crossbones', field:FIELDS[0], ink:INKS[0] };
      var cloth = el.querySelector('#flag-cloth');
      function draw(){ cloth.innerHTML = flagSVG(state); }
      draw();
      el.querySelector('#fc-emblem').addEventListener('click', function(e){ var b=e.target.closest('[data-em]'); if(!b)return; this.querySelectorAll('.chip').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); state.emblem=b.dataset.em; draw(); });
      function swatch(id, key){ el.querySelector(id).addEventListener('click', function(e){ var b=e.target.closest('[data-col]'); if(!b)return; this.querySelectorAll('.sw').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); state[key]=b.dataset.col; draw(); }); }
      swatch('#fc-field','field'); swatch('#fc-ink','ink');
      el.querySelector('#flag-dl').addEventListener('click', function(){
        var svg = el.querySelector('#flagsvg'); if(!svg) return;
        try{
          var xml = new XMLSerializer().serializeToString(svg);
          var src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xml)));
          var img = new Image();
          img.onload = function(){ var c=document.createElement('canvas'); c.width=720; c.height=480; var ctx=c.getContext('2d'); ctx.drawImage(img,0,0,720,480); var a=document.createElement('a'); a.download='barnacles-jolly-roger.png'; a.href=c.toDataURL('image/png'); a.click(); };
          img.src = src;
        }catch(err){ /* download blocked; ignore */ }
      });
    }
    return { html:html, init:init };
  };

  /* =========================================================
     KNOT ANIMATOR — watch a rope tie itself
     ========================================================= */
  var KNOT_PATHS = {
    bowline:  "M40 200 C40 120 120 120 120 150 C120 180 70 180 70 150 C70 110 200 110 200 60",
    clove:    "M60 60 C60 60 200 60 200 110 C200 150 60 150 60 110 C60 70 200 70 200 120 C200 160 60 160 60 200",
    reef:     "M40 130 C90 130 110 90 150 110 C190 130 120 170 90 150 C60 130 150 110 200 130",
    sheet:    "M40 90 C120 90 120 90 120 130 C120 170 70 150 90 120 C110 90 200 150 220 150",
    figure8:  "M120 40 C60 80 60 120 120 130 C190 140 190 180 120 200 C60 215 60 150 120 130 C180 110 180 70 120 40"
  };
  G.knotAnimator = function(){
    var knots = window.BRN.content.knots;
    var html = '<div class="game knotgame">'+
      '<div class="knot-tabs">'+ knots.map(function(k,i){return '<button class="chip'+(i===0?' on':'')+'" data-knot="'+k.key+'">'+k.name+'</button>';}).join('') +'</div>'+
      '<div class="knot-stage"><svg viewBox="0 0 260 240" xmlns="http://www.w3.org/2000/svg">'+
        '<path id="knot-shadow" d="" fill="none" stroke="#1a1206" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>'+
        '<path id="knot-rope" d="" fill="none" stroke="#c9a24a" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>'+
        '<path id="knot-hi" d="" fill="none" stroke="#f3e2b0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>'+
      '</svg></div>'+
      '<div class="knot-info" id="knot-info"></div>'+
      '<button class="btn-ghost" id="knot-replay">Tie it again &#8635;</button></div>';
    function init(el){
      var rope=el.querySelector('#knot-rope'), sh=el.querySelector('#knot-shadow'), hi=el.querySelector('#knot-hi');
      var cur='bowline';
      function tie(key){
        cur=key; var d=KNOT_PATHS[key]; [rope,sh,hi].forEach(function(p){p.setAttribute('d',d);});
        var k=window.BRN.content.knots.filter(function(x){return x.key===key;})[0];
        el.querySelector('#knot-info').innerHTML='<strong>'+k.name+'</strong> — '+k.use;
        var len=rope.getTotalLength ? rope.getTotalLength() : 600;
        [rope,sh,hi].forEach(function(p){ p.style.transition='none'; p.style.strokeDasharray=len; p.style.strokeDashoffset=len; });
        // force reflow then animate
        void rope.getBoundingClientRect();
        [rope,sh,hi].forEach(function(p){ p.style.transition='stroke-dashoffset 1.6s ease'; p.style.strokeDashoffset=0; });
      }
      el.querySelector('.knot-tabs').addEventListener('click', function(e){ var b=e.target.closest('[data-knot]'); if(!b)return; this.querySelectorAll('.chip').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); tie(b.dataset.knot); });
      el.querySelector('#knot-replay').addEventListener('click', function(){ tie(cur); });
      tie('bowline');
    }
    return { html:html, init:init };
  };

  /* =========================================================
     HELM — hold the course
     ========================================================= */
  G.steering = function(){
    var html = '<div class="game steer">'+
      '<p class="game-lede">The wind and sea fight your rudder. Keep the bow on course — hold the marker in the green. Use the wheel buttons or &larr; &rarr;.</p>'+
      '<div class="steer-gauge"><div class="steer-zone"></div><div class="steer-marker" id="steer-marker"></div><div class="steer-center"></div></div>'+
      '<div class="steer-controls"><button class="wheelbtn" id="steer-l">&#8634; Port</button>'+
        '<div class="steer-meter"><div class="steer-fill" id="steer-fill"></div></div>'+
        '<button class="wheelbtn" id="steer-r">Starboard &#8635;</button></div>'+
      '<div class="steer-score" id="steer-score">Hold her steady…</div></div>';
    function init(el){
      var pos=0, vel=0, input=0, onCourse=0, t0=performance.now(), running=true, fill=0;
      var marker=el.querySelector('#steer-marker'), fillEl=el.querySelector('#steer-fill'), score=el.querySelector('#steer-score');
      function setInput(v){ input=v; }
      el.querySelector('#steer-l').addEventListener('mousedown',function(){setInput(-1);});
      el.querySelector('#steer-r').addEventListener('mousedown',function(){setInput(1);});
      ['mouseup','mouseleave'].forEach(function(ev){ el.querySelector('#steer-l').addEventListener(ev,function(){setInput(0);}); el.querySelector('#steer-r').addEventListener(ev,function(){setInput(0);}); });
      el.querySelector('#steer-l').addEventListener('touchstart',function(e){e.preventDefault();setInput(-1);});
      el.querySelector('#steer-r').addEventListener('touchstart',function(e){e.preventDefault();setInput(1);});
      el.querySelector('#steer-l').addEventListener('touchend',function(){setInput(0);});
      el.querySelector('#steer-r').addEventListener('touchend',function(){setInput(0);});
      function key(e,down){ if(e.key==='ArrowLeft'){setInput(down?-1:0);} else if(e.key==='ArrowRight'){setInput(down?1:0);} }
      var kd=function(e){key(e,true);}, ku=function(e){key(e,false);};
      document.addEventListener('keydown',kd); document.addEventListener('keyup',ku);
      var wind=0, wt=0;
      function loop(now){
        if(!document.body.contains(el)){ running=false; document.removeEventListener('keydown',kd); document.removeEventListener('keyup',ku); return; }
        wt-=0.016; if(wt<=0){ wind=(Math.random()*2-1)*0.9; wt=0.6+Math.random()*1.4; }
        vel += wind*0.016 + input*0.9*0.016 - pos*0.0016;
        vel *= 0.96; pos += vel*60*0.016;
        if(pos>45){pos=45;vel=0;} if(pos<-45){pos=-45;vel=0;}
        marker.style.left = (50 + pos/45*48) + '%';
        var good = Math.abs(pos)<9;
        marker.classList.toggle('good', good);
        if(good){ fill=Math.min(100,fill+0.5); } else { fill=Math.max(0,fill-0.7); }
        fillEl.style.width=fill+'%';
        onCourse += good?0.016:0;
        score.textContent = good ? ('On course — '+onCourse.toFixed(1)+'s held') : 'Off course! Bring her back';
        if(running) requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    }
    return { html:html, init:init };
  };

  /* =========================================================
     THE HOLD — scrape the barnacles (a nod to the title)
     ========================================================= */
  G.barnacle = function(){
    var html = '<div class="game scrape">'+
      '<p class="game-lede">She\'s fouled with barnacles and dragging. Careen her — scrape them off! Click every barnacle before time\'s up.</p>'+
      '<canvas id="scrape-cv" width="900" height="340"></canvas>'+
      '<div class="scrape-hud"><button class="btn-ghost" id="scrape-go">Start scraping</button> <span id="scrape-stat" class="soon">30s · 0 scraped</span></div></div>';
    function init(el){
      var cv=el.querySelector('#scrape-cv'), ctx=cv.getContext('2d'), W=cv.width, H=cv.height;
      var barns=[], score=0, time=30, running=false, last=0, spawnT=0;
      function spawn(){ barns.push({x:30+Math.random()*(W-60), y:30+Math.random()*(H-60), r:10+Math.random()*12, a:0}); }
      function drawHull(){ var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#3a2614'); g.addColorStop(1,'#211408'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.fillStyle='rgba(0,0,0,.25)'; for(var x=0;x<W;x+=120) ctx.fillRect(x,0,3,H); }
      function barn(b){ ctx.save(); ctx.translate(b.x,b.y); ctx.globalAlpha=Math.min(1,b.a); ctx.fillStyle='#c9bfa6'; ctx.beginPath(); ctx.moveTo(0,-b.r); for(var i=0;i<10;i++){var a=i/10*6.283;var rr=b.r*(i%2?0.6:1);ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);} ctx.closePath(); ctx.fill(); ctx.fillStyle='#5a4a2e'; ctx.beginPath(); ctx.arc(0,0,b.r*0.34,0,6.28); ctx.fill(); ctx.restore(); }
      function render(){ drawHull(); barns.forEach(function(b){ if(b.a<1)b.a+=0.08; barn(b); }); }
      cv.addEventListener('click', function(e){ if(!running)return; var r=cv.getBoundingClientRect(); var mx=(e.clientX-r.left)*(W/r.width), my=(e.clientY-r.top)*(H/r.height); for(var i=barns.length-1;i>=0;i--){ var b=barns[i]; if((mx-b.x)*(mx-b.x)+(my-b.y)*(my-b.y) < (b.r+6)*(b.r+6)){ barns.splice(i,1); score++; if(window.BRN.Audio&&window.BRN.Audio.ready) window.BRN.Audio.move(); break; } } });
      function loop(now){ if(!document.body.contains(cv)){running=false;return;} var dt=last?(now-last)/1000:0; last=now; if(running){ time-=dt; spawnT-=dt; if(spawnT<=0 && barns.length<40){ spawn(); spawnT=0.25; } if(time<=0){ running=false; time=0; el.querySelector('#scrape-go').textContent='Scrape again'; } el.querySelector('#scrape-stat').textContent=time.toFixed(0)+'s · '+score+' scraped'; } render(); requestAnimationFrame(loop); }
      el.querySelector('#scrape-go').addEventListener('click', function(){ barns=[]; score=0; time=30; running=true; spawnT=0; for(var i=0;i<8;i++)spawn(); this.textContent='Scraping!'; });
      render(); requestAnimationFrame(loop);
    }
    return { html:html, init:init };
  };

  /* =========================================================
     TREASURE MAP — pan/zoom, clickable isles
     ========================================================= */
  var ISLES = [
    { x:300, y:240, name:"Gallows Cay", note:"Where the tide leaves the drowned. They say the sand counts its dead at low water." },
    { x:760, y:180, name:"The Maw", note:"A cove that swallows ships in fog. Few charts agree on where it lies — fewer captains return to correct them." },
    { x:560, y:430, name:"Saltbone Isle", note:"Fresh water, foul company. A careening beach for those who don't ask names." },
    { x:980, y:360, name:"Smuggler's Teeth", note:"A reef of black rock. Cross it at the right hour and you lose your pursuers — or your hull." },
    { x:1180, y:560, name:"X", note:"…you'll know it when the book is written." , x_marks:true }
  ];
  G.treasureMap = function(){
    var html = '<div class="game tmap">'+
      '<div class="tmap-viewport" id="tmap-vp"><div class="tmap-world" id="tmap-world">'+
        '<svg viewBox="0 0 1400 760" xmlns="http://www.w3.org/2000/svg" width="1400" height="760">'+
          '<rect width="1400" height="760" fill="#d9c79b"/>'+
          '<g opacity="0.5" stroke="#b09b66" stroke-width="2" fill="none">'+
            (function(){var s='';for(var i=0;i<14;i++){var y=40+i*52;s+='<path d="M0 '+y+' q 60 -8 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0"/>';}return s;})()+
          '</g>'+
          // compass rose
          '<g transform="translate(150,620)" stroke="#7a5a2e" fill="#7a5a2e">'+
            '<circle r="54" fill="none" stroke-width="2"/><path d="M0 -64 L10 0 L0 64 L-10 0 Z"/><path d="M-64 0 L0 -10 L64 0 L0 10 Z" opacity="0.7"/><text x="-5" y="-70" font-size="20" font-family="serif">N</text></g>'+
          // islands
          ISLES.map(function(is){ return '<g class="isle'+(is.x_marks?' xmark':'')+'" data-name="'+is.name+'" data-note="'+is.note.replace(/"/g,'&quot;')+'">'+
            (is.x_marks ?
              '<path d="M'+(is.x-22)+' '+(is.y-22)+' l44 44 M'+(is.x+22)+' '+(is.y-22)+' l-44 44" stroke="#7a1f17" stroke-width="9" stroke-linecap="round"/>'
              : '<path d="M'+is.x+' '+is.y+' m-70 16 q-18 -54 36 -60 q40 -22 70 8 q44 -2 40 36 q22 36 -30 44 q-30 30 -76 6 q-40 4 -40 -34 z" fill="#c2a86f" stroke="#8a6a3a" stroke-width="3"/>'+
                '<circle cx="'+is.x+'" cy="'+is.y+'" r="5" fill="#5a3d22"/>')+
            '<text x="'+(is.x)+'" y="'+(is.y+ (is.x_marks?44:64))+'" font-size="20" font-family="serif" fill="#5a3d22" text-anchor="middle">'+(is.x_marks?'X marks the spot':is.name)+'</text>'+
          '</g>'; }).join('')+
          // dotted route
          '<path d="M150 620 Q 320 360 560 430 T 980 360 T 1180 560" fill="none" stroke="#7a1f17" stroke-width="3" stroke-dasharray="3 12" stroke-linecap="round"/>'+
        '</svg>'+
      '</div></div>'+
      '<div class="tmap-bar"><button class="btn-ghost" id="tmap-in">+</button><button class="btn-ghost" id="tmap-out">&minus;</button>'+
        '<span class="tmap-tip" id="tmap-tip">Drag to explore. Click an isle.</span></div></div>';
    function init(el){
      var world=el.querySelector('#tmap-world'), vp=el.querySelector('#tmap-vp');
      var tx=-120, ty=-60, sc=0.9, drag=false, sx, sy;
      function apply(){ world.style.transform='translate('+tx+'px,'+ty+'px) scale('+sc+')'; }
      apply();
      vp.addEventListener('mousedown', function(e){ drag=true; sx=e.clientX-tx; sy=e.clientY-ty; vp.classList.add('grabbing'); });
      window.addEventListener('mousemove', function(e){ if(!drag)return; tx=e.clientX-sx; ty=e.clientY-sy; apply(); });
      window.addEventListener('mouseup', function(){ drag=false; vp.classList.remove('grabbing'); });
      el.querySelector('#tmap-in').addEventListener('click', function(){ sc=Math.min(2,sc+0.2); apply(); });
      el.querySelector('#tmap-out').addEventListener('click', function(){ sc=Math.max(0.5,sc-0.2); apply(); });
      el.querySelector('#tmap-world').addEventListener('click', function(e){ var g=e.target.closest('.isle'); if(!g)return; el.querySelector('#tmap-tip').innerHTML='<strong>'+g.dataset.name+'</strong> — '+g.dataset.note; });
    }
    return { html:html, init:init };
  };

  window.BRN = window.BRN || {};
  window.BRN.games = G;
})();
