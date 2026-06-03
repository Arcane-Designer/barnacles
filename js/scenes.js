/* ============================================================
   BARNACLES — interactive scenes
   The navigation is BAKED INTO THE ART. Doors, ladders, hatches,
   rigging, and the cabin's bookshelves are drawn into each room
   and are themselves clickable (hover glow + label). No overlay
   icons. The Great Cabin has two real walls: turn around and the
   stern windows give way to the bookshelves.

   A clickable object is a <g class="nav" data-to=".." data-type="..">
   (move) or data-open=".." (open a book). ship.js delegates clicks.
   ============================================================ */
(function () {
  'use strict';
  var VB = '0 0 1600 900';
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function svg(inner){ return '<svg viewBox="'+VB+'" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">'+inner+'</svg>'; }

  /* ---- clickable wrapper + shared affordance bits ---- */
  function nav(data, label, art, lx, ly){
    return '<g class="nav" '+data+'>'+
      '<title>'+esc(label)+'</title>'+ art +
      '<g class="navlabel" transform="translate('+lx+' '+ly+')">'+
        '<rect class="lblbg" x="-160" y="-24" width="320" height="42" rx="10"/>'+
        '<text class="lbltx" x="0" y="3">'+esc(label)+'</text>'+
      '</g></g>';
  }
  function beacon(x,y,w,h,rx){ return '<rect class="beacon" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||8)+'" fill="none" stroke="#e6c468" stroke-width="3"/>'; }
  function hl(x,y,w,h,rx){ return '<rect class="hl" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||6)+'" fill="#ffe9a8"/>'; }
  function hit(x,y,w,h){ return '<rect class="hit" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="transparent"/>'; }

  /* ---- reusable décor ---- */
  function defs(extra){
    return '<defs>'+
      '<linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a3f49"/><stop offset="1" stop-color="#06141b"/></linearGradient>'+
      '<linearGradient id="deckG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4a28"/><stop offset="1" stop-color="#3a2615"/></linearGradient>'+
      '<linearGradient id="woodWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c1d10"/><stop offset="1" stop-color="#160d06"/></linearGradient>'+
      '<radialGradient id="lant" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffce6e"/><stop offset="60%" stop-color="#b8801f" stop-opacity="0.4"/><stop offset="100%" stop-color="#b8801f" stop-opacity="0"/></radialGradient>'+
      '<radialGradient id="fire" cx="50%" cy="60%" r="55%"><stop offset="0" stop-color="#ffd36b"/><stop offset="35%" stop-color="#ff8a2a"/><stop offset="80%" stop-color="#7a2a0a" stop-opacity="0.5"/><stop offset="100%" stop-color="#7a2a0a" stop-opacity="0"/></radialGradient>'+
      (extra||'')+'</defs>';
  }
  function sea(yTop){
    var s='<rect x="0" y="'+yTop+'" width="1600" height="'+(900-yTop)+'" fill="#0c2630"/>'+
          '<rect x="0" y="'+yTop+'" width="1600" height="'+(900-yTop)+'" fill="url(#seaG)"/>';
    [40,90,150].forEach(function(d){ var y=yTop+d,p='M0 '+y; for(var x=0;x<=1600;x+=80)p+=' q 40 -10 80 0'; s+='<path d="'+p+'" fill="none" stroke="#1f4a55" stroke-width="2" opacity="0.5"/>'; });
    return s;
  }
  function planks(y,h){
    var s='<rect x="0" y="'+y+'" width="1600" height="'+h+'" fill="url(#deckG)"/>';
    for(var x=0;x<1600;x+=120) s+='<rect x="'+x+'" y="'+y+'" width="3" height="'+h+'" fill="#241608" opacity="0.5"/>';
    for(var yy=y+40;yy<y+h;yy+=60) s+='<rect x="0" y="'+yy+'" width="1600" height="2" fill="#1c1206" opacity="0.4"/>';
    return s;
  }
  function beams(){ var s=''; for(var x=120;x<1600;x+=320) s+='<rect x="'+x+'" y="0" width="34" height="900" fill="#160d06" opacity="0.55"/>'; return s; }
  function barrel(x,y){ return '<g transform="translate('+x+' '+y+')"><rect x="-44" y="-70" width="88" height="140" rx="22" fill="url(#deckG)"/><rect x="-46" y="-50" width="92" height="10" fill="#2a1a0c"/><rect x="-46" y="-6" width="92" height="10" fill="#2a1a0c"/><rect x="-46" y="38" width="92" height="10" fill="#2a1a0c"/></g>'; }
  function crate(x,y){ return '<g transform="translate('+x+' '+y+')"><rect x="-60" y="-60" width="120" height="120" fill="#3a2614" stroke="#5a3d22" stroke-width="6"/><line x1="-60" y1="-60" x2="60" y2="60" stroke="#5a3d22" stroke-width="6"/><line x1="60" y1="-60" x2="-60" y2="60" stroke="#5a3d22" stroke-width="6"/></g>'; }

  /* ---- baked navigation objects (art + beacon + hover + hit) ---- */
  function doorObj(x, y, w, h, data, label){
    var planksL=''; for(var i=1;i<4;i++) planksL+='<line x1="'+(x+i*w/4)+'" y1="'+(y+8)+'" x2="'+(x+i*w/4)+'" y2="'+(y+h-8)+'" stroke="#160d06" stroke-width="3"/>';
    var art = beacon(x-7,y-7,w+14,h+14,8)+
      '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="7" fill="#2a1a0c" stroke="#5a3d22" stroke-width="4"/>'+
      planksL+
      '<rect x="'+(x+8)+'" y="'+(y+8)+'" width="'+(w-16)+'" height="22" rx="4" fill="#3a2614"/>'+ // top brace
      '<circle cx="'+(x+w-20)+'" cy="'+(y+h/2)+'" r="7" fill="#c9a24a"/>'+ // ring handle
      '<circle cx="'+(x+w-20)+'" cy="'+(y+h/2)+'" r="11" fill="none" stroke="#c9a24a" stroke-width="3"/>'+
      hl(x,y,w,h,7)+ hit(x-10,y-10,w+20,h+20);
    return nav(data, label, art, x+w/2, y-22);
  }
  function ladderUpObj(cx, top, bot, data, label){
    var w=70, x=cx-w/2, rungs='';
    for(var ry=top+24; ry<bot; ry+=34) rungs+='<line x1="'+x+'" y1="'+ry+'" x2="'+(x+w)+'" y2="'+ry+'" stroke="#c9a24a" stroke-width="6" stroke-linecap="round"/>';
    var art = beacon(x-8, top-8, w+16, (bot-top)+16, 8)+
      '<rect x="'+(cx-90)+'" y="'+(top-30)+'" width="180" height="30" rx="4" fill="#160d06"/>'+ // opening in ceiling
      '<line x1="'+x+'" y1="'+top+'" x2="'+x+'" y2="'+bot+'" stroke="#8a6a3a" stroke-width="7"/>'+
      '<line x1="'+(x+w)+'" y1="'+top+'" x2="'+(x+w)+'" y2="'+bot+'" stroke="#8a6a3a" stroke-width="7"/>'+
      rungs + hl(x-4,top,w+8,bot-top,6) + hit(x-14,top-30,w+28,(bot-top)+40);
    return nav(data, label, art, cx, top-42);
  }
  function hatchDownObj(cx, cy, data, label){
    var w=210, h=120, x=cx-w/2, y=cy-h/2, rungs='';
    for(var ry=y+18; ry<y+h-6; ry+=26) rungs+='<line x1="'+(cx-26)+'" y1="'+ry+'" x2="'+(cx+26)+'" y2="'+ry+'" stroke="#7a5a2e" stroke-width="5"/>';
    var art = beacon(x-7,y-7,w+14,h+14,8)+
      '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="#070402" stroke="#5a3d22" stroke-width="5"/>'+
      '<rect x="'+(x-6)+'" y="'+(y-26)+'" width="120" height="26" rx="4" fill="#3a2614" stroke="#5a3d22" stroke-width="2"/>'+ // open lid
      '<line x1="'+(cx-26)+'" y1="'+(y+8)+'" x2="'+(cx-26)+'" y2="'+(y+h-8)+'" stroke="#7a5a2e" stroke-width="6"/>'+
      '<line x1="'+(cx+26)+'" y1="'+(y+8)+'" x2="'+(cx+26)+'" y2="'+(y+h-8)+'" stroke="#7a5a2e" stroke-width="6"/>'+
      rungs + hl(x,y,w,h,6) + hit(x-10,y-30,w+20,h+44);
    return nav(data, label, art, cx, y-40);
  }
  function ratlineObj(cx, top, bot, data, label){
    var spread=150, art='';
    art += beacon(cx-spread-10, top-10, (spread*2)+20, (bot-top)+20, 8);
    // shrouds
    art += '<line x1="'+cx+'" y1="'+top+'" x2="'+(cx-spread)+'" y2="'+bot+'" stroke="#2a1d10" stroke-width="6"/>';
    art += '<line x1="'+cx+'" y1="'+top+'" x2="'+(cx+spread)+'" y2="'+bot+'" stroke="#2a1d10" stroke-width="6"/>';
    art += '<line x1="'+(cx-40)+'" y1="'+top+'" x2="'+(cx-spread)+'" y2="'+bot+'" stroke="#2a1d10" stroke-width="4"/>';
    art += '<line x1="'+(cx+40)+'" y1="'+top+'" x2="'+(cx+spread)+'" y2="'+bot+'" stroke="#2a1d10" stroke-width="4"/>';
    for(var ry=top+50; ry<bot; ry+=46){ var f=(ry-top)/(bot-top); var hwL=spread*f; art+='<line x1="'+(cx-hwL)+'" y1="'+ry+'" x2="'+(cx+hwL)+'" y2="'+ry+'" stroke="#3a2a18" stroke-width="4"/>'; }
    art += hl(cx-spread, top, spread*2, bot-top, 8) + hit(cx-spread-12, top-12, (spread*2)+24, (bot-top)+24);
    return nav(data, label, art, cx, top-22);
  }
  function railDiveObj(cx, y, data, label){
    var art = beacon(cx-130, y-20, 260, 150, 10)+
      // broken rail (two posts, gap)
      '<line x1="'+(cx-120)+'" y1="'+y+'" x2="'+(cx-120)+'" y2="'+(y+70)+'" stroke="#5a3d22" stroke-width="10"/>'+
      '<line x1="'+(cx+120)+'" y1="'+y+'" x2="'+(cx+120)+'" y2="'+(y+70)+'" stroke="#5a3d22" stroke-width="10"/>'+
      '<line x1="'+(cx-120)+'" y1="'+y+'" x2="'+(cx-50)+'" y2="'+y+'" stroke="#5a3d22" stroke-width="8"/>'+
      '<line x1="'+(cx+50)+'" y1="'+y+'" x2="'+(cx+120)+'" y2="'+y+'" stroke="#5a3d22" stroke-width="8"/>'+
      // waves below the gap
      '<path d="M'+(cx-110)+' '+(y+96)+' q 28 -14 56 0 t 56 0 t 56 0" fill="none" stroke="#7fb8c8" stroke-width="5"/>'+
      '<path d="M'+(cx-110)+' '+(y+120)+' q 28 -14 56 0 t 56 0 t 56 0" fill="none" stroke="#5f98a8" stroke-width="5"/>'+
      hl(cx-120,y,240,120,8) + hit(cx-130,y-20,260,160);
    return nav(data, label, art, cx, y-30);
  }
  function surfaceObj(cx, y, data, label){
    var art = beacon(cx-300, y-10, 600, 90, 12)+
      '<path d="M'+(cx-300)+' '+(y+20)+' q 50 -22 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0" fill="none" stroke="#bfe6f0" stroke-width="6" opacity="0.8"/>'+
      '<path d="M'+(cx-300)+' '+(y+50)+' q 50 -22 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0" fill="none" stroke="#7fc0d4" stroke-width="5" opacity="0.7"/>'+
      hl(cx-300,y-6,600,80,12) + hit(cx-300,y-20,600,110);
    return nav(data, label, art, cx, y-26);
  }
  function bookSpineObj(x, y, data, label, color){
    var w=64, h=150;
    var art = beacon(x-6,y-6,w+12,h+12,6)+
      '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="'+color+'" stroke="#1a0f08" stroke-width="3"/>'+
      '<rect x="'+(x+6)+'" y="'+(y+16)+'" width="'+(w-12)+'" height="6" fill="#e6c468"/>'+
      '<rect x="'+(x+6)+'" y="'+(y+h-26)+'" width="'+(w-12)+'" height="6" fill="#e6c468"/>'+
      '<circle cx="'+(x+w/2)+'" cy="'+(y+h/2)+'" r="9" fill="none" stroke="#e6c468" stroke-width="3"/>'+
      hl(x,y,w,h,4) + hit(x-8,y-8,w+16,h+16);
    return nav(data, label, art, x+w/2, y-20);
  }
  function openBookObj(cx, cy, data, label){
    var art = beacon(cx-150, cy-70, 300, 150, 12)+
      '<path d="M'+cx+' '+(cy-46)+' C '+(cx-44)+' '+(cy-70)+', '+(cx-130)+' '+(cy-66)+', '+(cx-150)+' '+(cy-54)+' L '+(cx-150)+' '+(cy+54)+' C '+(cx-130)+' '+(cy+44)+', '+(cx-44)+' '+(cy+44)+', '+cx+' '+(cy+62)+' Z" fill="#efe7d2" stroke="#c9a24a" stroke-width="3"/>'+
      '<path d="M'+cx+' '+(cy-46)+' C '+(cx+44)+' '+(cy-70)+', '+(cx+130)+' '+(cy-66)+', '+(cx+150)+' '+(cy-54)+' L '+(cx+150)+' '+(cy+54)+' C '+(cx+130)+' '+(cy+44)+', '+(cx+44)+' '+(cy+44)+', '+cx+' '+(cy+62)+' Z" fill="#efe7d2" stroke="#c9a24a" stroke-width="3"/>'+
      '<line x1="'+cx+'" y1="'+(cy-46)+'" x2="'+cx+'" y2="'+(cy+62)+'" stroke="#b8975a" stroke-width="2"/>'+
      '<g stroke="#b8975a" stroke-width="2"><line x1="'+(cx-120)+'" y1="'+(cy-34)+'" x2="'+(cx-30)+'" y2="'+(cy-28)+'"/><line x1="'+(cx-120)+'" y1="'+(cy-16)+'" x2="'+(cx-30)+'" y2="'+(cy-10)+'"/><line x1="'+(cx-120)+'" y1="'+(cy+2)+'" x2="'+(cx-30)+'" y2="'+(cy+8)+'"/><line x1="'+(cx+30)+'" y1="'+(cy-28)+'" x2="'+(cx+120)+'" y2="'+(cy-34)+'"/><line x1="'+(cx+30)+'" y1="'+(cy-10)+'" x2="'+(cx+120)+'" y2="'+(cy-16)+'"/></g>'+
      hl(cx-150,cy-66,300,128,12) + hit(cx-156,cy-74,312,156);
    return nav(data, label, art, cx, cy-86);
  }

  /* ============================================================
     SCENES
     ============================================================ */
  var scenes = {

    helm: { indoor:false, render:function(){
      return svg(defs()+ sea(320)+
        '<rect x="100" y="296" width="1400" height="14" rx="6" fill="#3a2614"/>'+ planks(470,430)+
        // décor wheel
        '<g transform="translate(800,640)" opacity="0.9"><circle r="150" fill="none" stroke="#5a3d22" stroke-width="26"/><circle r="40" fill="#5a3d22"/>'+
          (function(){var s='';for(var a=0;a<360;a+=45){var r=a*Math.PI/180;s+='<line x1="'+(Math.cos(r)*40)+'" y1="'+(Math.sin(r)*40)+'" x2="'+(Math.cos(r)*190)+'" y2="'+(Math.sin(r)*190)+'" stroke="#5a3d22" stroke-width="14" stroke-linecap="round"/>';}return s;})()+'</g>'+
        '<circle cx="170" cy="350" r="60" fill="url(#lant)" opacity="0.7"/><circle cx="1430" cy="350" r="60" fill="url(#lant)" opacity="0.7"/>'+
        // NAV: forward to main deck (steps/opening forward, center)
        nav('data-to="maindeck" data-type="walk"', "Forward to the main deck",
          beacon(560,330,280,150,10)+
          '<rect x="560" y="350" width="280" height="120" fill="#241608"/>'+
          '<rect x="560" y="350" width="280" height="22" fill="#3a2614"/><rect x="578" y="388" width="244" height="20" fill="#3a2614"/><rect x="596" y="424" width="208" height="20" fill="#3a2614"/>'+
          hl(560,348,280,124,6)+hit(550,330,300,150), 700, 332)+
        // NAV: down to great cabin (companionway hatch, center-right)
        hatchDownObj(1060, 560, 'data-to="cabin" data-type="down"', "Down to the great cabin")
      );
    }},

    maindeck: { indoor:false, render:function(){
      return svg(defs()+ sea(290)+
        '<rect x="486" y="0" width="28" height="470" fill="#3a2614"/>'+ // mainmast
        planks(430,470)+
        // décor capstan
        '<g transform="translate(820,610)"><ellipse cx="0" cy="150" rx="100" ry="28" fill="#2a1a0c"/><rect x="-60" y="20" width="120" height="150" rx="12" fill="url(#deckG)"/><ellipse cx="0" cy="20" rx="60" ry="18" fill="#6b4a28"/></g>'+
        barrel(150,690)+
        // NAV objects spread across the deck
        ratlineObj(720, 150, 470, 'data-to="crowsnest" data-type="climbup"', "Climb the mainmast to the crow's nest")+
        // forecastle steps ahead (right, raised)
        nav('data-to="forecastle" data-type="walk"', "Forward to the forecastle",
          beacon(1000,300,260,150,10)+'<rect x="1000" y="320" width="260" height="120" fill="#241608"/><rect x="1000" y="320" width="260" height="22" fill="#3a2614"/><rect x="1018" y="358" width="224" height="20" fill="#3a2614"/><rect x="1036" y="394" width="188" height="20" fill="#3a2614"/>'+hl(1000,318,260,124,6)+hit(990,300,280,152), 1130, 302)+
        // helm steps aft (left, raised quarterdeck)
        nav('data-to="helm" data-type="walk"', "Aft to the helm",
          beacon(330,300,260,150,10)+'<rect x="330" y="320" width="260" height="120" fill="#241608"/><rect x="330" y="320" width="260" height="22" fill="#3a2614"/><rect x="348" y="358" width="224" height="20" fill="#3a2614"/><rect x="366" y="394" width="188" height="20" fill="#3a2614"/>'+hl(330,318,260,124,6)+hit(320,300,280,152), 460, 302)+
        // hatch down to gun deck (center floor)
        hatchDownObj(720, 740, 'data-to="gundeck" data-type="down"', "Down the hatch to the gun deck")+
        // rail break to dive (lower-left)
        railDiveObj(400, 600, 'data-to="sea" data-type="overboard"', "To the rail — dive overboard")
      );
    }},

    forecastle: { indoor:false, render:function(){
      return svg(defs()+ sea(280)+
        '<rect x="700" y="250" width="900" height="22" rx="10" fill="#3a2614" transform="rotate(-12 700 260)"/>'+ // bowsprit
        planks(420,480)+
        // décor anchor
        '<g transform="translate(360,560)" stroke="#1a1a1f" stroke-width="22" fill="none" stroke-linecap="round"><line x1="0" y1="-60" x2="0" y2="190"/><line x1="-90" y1="-30" x2="90" y2="-30"/><path d="M-110 150 Q 0 250 110 150"/><circle cx="0" cy="-80" r="26" stroke-width="16"/></g>'+
        // NAV: aft to main deck (steps, center)
        nav('data-to="maindeck" data-type="walk"', "Aft to the main deck",
          beacon(650,330,300,150,10)+'<rect x="650" y="350" width="300" height="120" fill="#241608"/><rect x="650" y="350" width="300" height="22" fill="#3a2614"/><rect x="668" y="388" width="264" height="20" fill="#3a2614"/><rect x="686" y="424" width="228" height="20" fill="#3a2614"/>'+hl(650,348,300,124,6)+hit(640,330,320,152), 800, 332)+
        // NAV: down to galley (hatch right)
        hatchDownObj(1120, 600, 'data-to="galley" data-type="down"', "Down to the galley")
      );
    }},

    crowsnest: { indoor:false, render:function(){
      return svg(defs()+
        '<rect x="0" y="770" width="1600" height="130" fill="#0c2630"/><rect x="0" y="770" width="1600" height="130" fill="url(#seaG)"/>'+
        '<rect x="770" y="430" width="60" height="470" fill="#3a2614"/>'+ // mast through nest
        // nest rim foreground
        '<g transform="translate(800,720)"><ellipse cx="0" cy="120" rx="380" ry="84" fill="#2a1a0c"/><path d="M-380 120 A380 84 0 0 0 380 120 L380 230 L-380 230 Z" fill="#3a2614"/><ellipse cx="0" cy="120" rx="380" ry="84" fill="none" stroke="#6b4a28" stroke-width="10"/></g>'+
        // NAV: down the ratlines to the main deck
        ratlineObj(800, 470, 760, 'data-to="maindeck" data-type="climbdown"', "Down to the main deck")
      );
    }},

    gundeck: { indoor:true, render:function(){
      var ports='', cannons='';
      for(var i=0;i<3;i++){ var x=240+i*560;
        ports+='<rect x="'+x+'" y="300" width="150" height="120" rx="8" fill="#0a1a22"/><rect x="'+x+'" y="300" width="150" height="120" rx="8" fill="url(#portLight)"/>';
        cannons+='<g transform="translate('+(x+75)+',470)"><rect x="-90" y="40" width="180" height="40" rx="8" fill="#3a2614"/><circle cx="-55" cy="92" r="26" fill="#1a1a1f"/><circle cx="55" cy="92" r="26" fill="#1a1a1f"/><rect x="-30" y="-30" width="120" height="64" rx="20" fill="#23232a"/></g>';
      }
      return svg(defs('<linearGradient id="portLight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a5a66"/><stop offset="1" stop-color="#0a1a22"/></linearGradient>')+
        '<rect x="0" y="0" width="1600" height="900" fill="url(#woodWall)"/><rect x="0" y="0" width="1600" height="120" fill="#160d06"/>'+ beams()+
        ports+ planks(560,340)+ cannons+
        '<line x1="800" y1="120" x2="800" y2="190" stroke="#241a0e" stroke-width="4"/><circle cx="800" cy="230" r="120" fill="url(#lant)"/><rect x="784" y="200" width="32" height="48" rx="6" fill="#2a1a0c" stroke="#c9a24a"/>'+
        // NAV: up to main deck (ladder up through ceiling, center)
        ladderUpObj(800, 150, 460, 'data-to="maindeck" data-type="up"', "Up the hatch to the main deck")+
        // NAV: aft door to cabin (right, within safe zone)
        doorObj(1100, 460, 150, 250, 'data-to="cabin" data-type="door"', "Aft to the captain's cabin")+
        // NAV: forward door to galley (left, within safe zone)
        doorObj(350, 460, 150, 250, 'data-to="galley" data-type="door"', "Forward to the galley")+
        // NAV: down hatch to hold (center floor)
        hatchDownObj(720, 740, 'data-to="hold" data-type="down"', "Down into the hold")
      );
    }},

    hold: { indoor:true, render:function(){
      return svg(defs()+
        '<rect x="0" y="0" width="1600" height="900" fill="#0d0905"/><rect x="0" y="0" width="1600" height="900" fill="url(#woodWall)" opacity="0.85"/>'+ beams()+
        crate(200,560)+crate(350,560)+crate(275,420)+ barrel(1240,560)+barrel(1340,560)+barrel(1290,430)+
        '<line x1="800" y1="80" x2="800" y2="200" stroke="#241a0e" stroke-width="4"/><circle cx="800" cy="260" r="200" fill="url(#lant)"/><rect x="780" y="210" width="40" height="60" rx="8" fill="#2a1a0c" stroke="#c9a24a"/>'+
        planks(720,180)+
        // NAV: up to gun deck (ladder, center)
        ladderUpObj(800, 300, 720, 'data-to="gundeck" data-type="up"', "Up the ladder to the gun deck")
      );
    }},

    cabin_fore: { indoor:true, render:function(){
      return svg(defs()+
        '<rect x="0" y="0" width="1600" height="900" fill="url(#woodWall)"/>'+
        // stern gallery windows (décor)
        (function(){var s='<rect x="540" y="100" width="520" height="360" rx="10" fill="#2a1a0c"/>';for(var c=0;c<3;c++)for(var r=0;r<2;r++)s+='<rect x="'+(560+c*165)+'" y="'+(120+r*165)+'" width="150" height="150" rx="6" fill="#7fae9e" opacity="0.7"/>';return s;})()+
        beams()+ planks(640,260)+
        // desk décor
        '<g transform="translate(800,650)"><rect x="-230" y="0" width="460" height="40" rx="8" fill="#5a3d22"/><rect x="-210" y="40" width="40" height="120" fill="#3a2614"/><rect x="170" y="40" width="40" height="120" fill="#3a2614"/><rect x="150" y="-44" width="16" height="44" fill="#e9dcbd"/><circle cx="158" cy="-50" r="11" fill="url(#fire)"/></g>'+
        '<circle cx="800" cy="560" r="170" fill="url(#lant)" opacity="0.5"/>'+
        // NAV: the open book on the desk
        openBookObj(780, 612, 'data-open="quarters"', "The open book — Barnacles")+
        // NAV: forward door to gun deck (left within safe zone)
        doorObj(350, 460, 150, 250, 'data-to="gundeck" data-type="door"', "Forward to the gun deck")+
        // NAV: companionway up to helm (right within safe zone)
        ladderUpObj(1180, 400, 720, 'data-to="helm" data-type="up"', "Up the companionway to the helm")
      );
    }},

    cabin_aft: { indoor:true, render:function(){
      // a wall of bookshelves: shelf planks + clickable learning books + décor books
      var shelves='';
      [300,520,740].forEach(function(sy){ shelves+='<rect x="240" y="'+sy+'" width="1120" height="22" fill="#3a2614"/><rect x="240" y="'+(sy-150)+'" width="20" height="172" fill="#2a1a0c"/><rect x="1340" y="'+(sy-150)+'" width="20" height="172" fill="#2a1a0c"/>'; });
      // décor books filling shelves
      var decor=''; var cols=['#5a2a20','#3a4a2a','#2a3a52','#4a3a1a','#52324a','#244a44'];
      [150,370,590].forEach(function(sy){ for(var x=300;x<1300;x+=58){ if(Math.random()<0.34){x+=4;continue;} var hh=110+Math.floor(Math.random()*30); decor+='<rect x="'+x+'" y="'+(sy+ (140-hh))+'" width="46" height="'+hh+'" rx="3" fill="'+cols[Math.floor(Math.random()*cols.length)]+'" stroke="#160d06" stroke-width="2"/>'; } });
      return svg(defs()+
        '<rect x="0" y="0" width="1600" height="900" fill="url(#woodWall)"/>'+ beams()+
        '<rect x="220" y="120" width="1160" height="680" rx="8" fill="#1c1207" stroke="#3a2614" stroke-width="6"/>'+
        decor + shelves +
        '<circle cx="800" cy="470" r="220" fill="url(#lant)" opacity="0.35"/>'+ planks(800,100)+
        // the five learning books (clickable) sitting prominently on the shelves
        bookSpineObj(390, 160, 'data-open="ships"',    "How Ships Work",   '#6b4a28')+
        bookSpineObj(585, 160, 'data-open="shanties"', "Shanties",         '#3a5a4a')+
        bookSpineObj(780, 160, 'data-open="speak"',    "Pirate Speak",     '#7a3a2a')+
        bookSpineObj(975, 160, 'data-open="history"',  "History of Piracy",'#3a4a6a')+
        bookSpineObj(1170,160, 'data-open="forge"',    "The Forge",        '#a8552e')
      );
    }},

    galley: { indoor:true, render:function(){
      return svg(defs()+
        '<rect x="0" y="0" width="1600" height="900" fill="url(#woodWall)"/>'+ beams()+
        '<g transform="translate(800,520)"><rect x="-220" y="-40" width="440" height="320" rx="10" fill="#3a201a"/>'+
          (function(){var s='';for(var r=0;r<3;r++)for(var c=0;c<9;c++){var off=(r%2)*24;s+='<rect x="'+(-216+c*48+off)+'" y="'+(-36+r*26)+'" width="44" height="22" rx="2" fill="#5a2a20" stroke="#2a1410"/>';}return s;})()+
          '<rect x="-150" y="60" width="300" height="180" rx="10" fill="#0a0503"/><circle cx="0" cy="180" r="220" fill="url(#fire)"/><circle cx="0" cy="190" r="110" fill="url(#fire)"/>'+
          '<g transform="translate(360,170)"><rect x="-60" y="0" width="120" height="30" rx="6" fill="#23232a"/><rect x="-30" y="30" width="60" height="60" fill="#1a1a1f"/></g></g>'+
        planks(700,200)+
        // NAV: up to forecastle (ladder, left within safe zone)
        ladderUpObj(380, 150, 700, 'data-to="forecastle" data-type="up"', "Up to the forecastle")+
        // NAV: aft door to gun deck (right within safe zone)
        doorObj(1080, 460, 150, 250, 'data-to="gundeck" data-type="door"', "Aft to the gun deck")
      );
    }},

    sea: { indoor:true, render:function(){
      return svg(defs('<linearGradient id="deep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b6f86"/><stop offset="1" stop-color="#03121d"/></linearGradient>')+
        '<rect x="0" y="0" width="1600" height="900" fill="url(#deep)"/>'+
        '<g opacity="0.16" fill="#bfe6f0"><polygon points="300,0 420,0 700,900 480,900"/><polygon points="900,0 980,0 1180,900 1040,900"/></g>'+
        '<g opacity="0.5" fill="#04222b"><rect x="1150" y="500" width="40" height="400" transform="rotate(18 1170 700)"/><rect x="980" y="640" width="320" height="30" transform="rotate(18 1140 655)"/></g>'+
        '<path d="M0 820 Q400 760 800 820 T1600 820 L1600 900 L0 900 Z" fill="#06161b"/>'+
        // NAV: surface
        surfaceObj(800, 120, 'data-to="maindeck" data-type="surface"', "Surface — climb back aboard")
      );
    }}
  };

  window.BRN = window.BRN || {};
  window.BRN.scenes = scenes;
})();
