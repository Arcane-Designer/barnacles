/* ============================================================
   BARNACLES — content
   The substance of the learning rooms. Written to be accurate
   and to separate real history from pop-culture myth.
   Add to these arrays freely; the rooms render whatever is here.
   ============================================================ */
window.BRN = window.BRN || {};
window.BRN.content = {

  /* ---------- SHIPS: types & eras ---------- */
  ships: [
    { name:"Sloop", era:"Late 1600s–1700s", rig:"Single mast, fore-and-aft",
      blurb:"Small, fast, shallow-drafted single-master. The pirate's favorite in the Caribbean: it could slip into shoals and coves where larger navy ships dared not follow, then outrun anything it couldn't out-gun.",
      stat:"~10–14 guns · crew 75ish · very shallow draft" },
    { name:"Schooner", era:"1700s onward",  rig:"2–3 masts, fore-and-aft (gaff)",
      blurb:"Fore-and-aft rig made it nimble and able to sail closer to the wind with a smaller crew. Quick and weatherly — excellent for raiding and running.",
      stat:"Fast · weatherly · economical crew" },
    { name:"Brigantine", era:"1600s–1800s", rig:"2 masts; square fore, fore-and-aft main",
      blurb:"A hybrid: square sails forward for downwind power, fore-and-aft aft for maneuverability. Swifter and handier than a sloop or schooner of the day — which is exactly why it was 'employed for piracy.'",
      stat:"Versatile · ~10 guns · favored raider" },
    { name:"Frigate", era:"17th–19th c.", rig:"Three masts, fully square-rigged",
      blurb:"A fast, medium warship — the navy's scout and convoy-screen. Pirates rarely fielded true frigates, but a captured one was a terror. Single gun deck, built for speed and independent action.",
      stat:"~28–44 guns · one gun deck · fast warship" },
    { name:"Galleon", era:"15th–17th c.", rig:"Three+ masts, square-rigged, high stern",
      blurb:"The great armed merchantman of Spain's treasure fleets — towering sterncastle, two or more decks, heavy but mighty. The floating prize that built the pirate legend.",
      stat:"Multi-deck · cargo + cannon · the treasure ship" },
    { name:"Ship-of-the-Line / Man-o'-War", era:"17th–19th c.", rig:"Three masts, square-rigged",
      blurb:"The battleship of the age of sail: two or more full gun decks, rated by the number of cannon, built to stand in the 'line of battle.' Evolved from the galleon. Pirates ran from these.",
      stat:"64–100+ guns · 2–3 gun decks · line of battle" }
  ],

  /* parts of a ship for the interactive cutaway (x,y are % of the svg viewBox 1000x520) */
  shipParts: [
    { x:500, y:60,  label:"Mainmast", text:"The tallest mast, amidships. Carries the main and topsails — the engine room of canvas." },
    { x:760, y:95,  label:"Crow's Nest", text:"A lookout platform high on the mast. First to spot sail, land, or storm — 'land ho!' is born here." },
    { x:175, y:120, label:"Foremast", text:"The forward mast. On a brigantine it's square-rigged for downwind drive." },
    { x:905, y:240, label:"Stern / Helm", text:"The rear of the ship and the wheel (or whipstaff/tiller in earlier eras). The captain's cabin sits beneath." },
    { x:80,  y:255, label:"Bow & Bowsprit", text:"The pointed front; the bowsprit spar carries the jibs (headsails) that help her turn and balance." },
    { x:500, y:300, label:"Main Deck", text:"The working weather deck — capstan, hatches, and the daily labor of sailing her." },
    { x:500, y:400, label:"Gun Deck", text:"Cannon run out through gunports. Broadside weight decided most fights of the age." },
    { x:300, y:455, label:"Hold", text:"The belly: cargo, water casks, powder, and plunder. Dark, damp, and where the rats hold court." },
    { x:660, y:455, label:"Bilge", text:"The lowest point, where water collects and is pumped out. The foulest, most dreaded duty aboard." },
    { x:120, y:430, label:"Keel", text:"The backbone running stem to stern. Lose the keel and you've lost the ship." }
  ],

  /* ---------- SHANTIES ---------- */
  shantyIntro: "A shanty (from the French <em>chanter</em>, 'to sing') is a work song that sets the rhythm of heavy labor at sea. Its heyday was the early-to-mid 1800s. The two great families are <strong>capstan</strong> songs (a steady walking push, as when weighing anchor) and <strong>halyard</strong> songs (a heave-and-pause pull, as when hoisting sail). Most follow a <strong>call-and-response</strong> form — a structure rooted in African musical tradition — where a shantyman sings the line and the crew answers on the pull.",
  shanties: [
    { title:"Drunken Sailor", type:"Capstan / Stamp-and-go", note:"Early 1800s; one of the very few shanties tolerated in the Royal Navy.",
      lines:[
        ["What shall we do with a drunken sailor,", false],
        ["What shall we do with a drunken sailor,", false],
        ["What shall we do with a drunken sailor,", false],
        ["Early in the morning?", true],
        ["Way hay and up she rises,", true],
        ["Way hay and up she rises,", true],
        ["Way hay and up she rises,", true],
        ["Early in the morning!", true]
      ] },
    { title:"Soon May the Wellerman Come", type:"Whaling song (not strictly a work shanty)", note:"19th-century New Zealand origin; the 'Wellerman' was a supply ship of the Weller Bros. Went global in 2021.",
      lines:[
        ["There once was a ship that put to sea,", false],
        ["The name of the ship was the Billy o' Tea.", false],
        ["The winds blew hard, her bow dipped down—", false],
        ["Blow, me bully boys, blow!", true],
        ["Soon may the Wellerman come,", true],
        ["To bring us sugar and tea and rum.", true],
        ["One day, when the tonguin' is done,", true],
        ["We'll take our leave and go.", true]
      ] },
    { title:"Leave Her, Johnny", type:"Capstan (homeward / pay-off)", note:"Sung at the end of a voyage, pumping the ship dry one last time. 'Her' is the ship.",
      lines:[
        ["Oh the times was hard and the wages low,", false],
        ["Leave her, Johnny, leave her!", true],
        ["I'll pack my bag and go below,", false],
        ["And it's time for us to leave her!", true]
      ] }
  ],

  /* ---------- PIRATE SPEAK: real vs myth ---------- */
  speakIntro: "Here's the honest truth most pirate sites won't tell you: nobody really knows how Golden Age pirates spoke. The growling 'arrr,' the 'me hearties,' the rolling West-Country burr — that's almost entirely the invention of one actor, <strong>Robert Newton</strong>, who exaggerated his native Dorset accent playing Long John Silver in Disney's 1950 <em>Treasure Island</em> (and again as Blackbeard). It stuck so hard it became 'how pirates sound.' Below, the genuine sailor's vocabulary is marked <span class='tag real'>real</span>; the beloved theatrical stuff is marked <span class='tag myth'>myth / pop-culture</span>. Both are useful to a storyteller — just know which is which.",
  terms: [
    { word:"Avast!", tag:"real", def:"A genuine nautical command meaning 'stop' or 'hold fast.' From Dutch <em>hou' vast</em>." },
    { word:"Belay", tag:"real", def:"To make a rope fast (secure it to a pin or cleat); figuratively, 'cancel that' — 'belay that order.'" },
    { word:"Weigh anchor", tag:"real", def:"To haul the anchor up off the seabed to get under way. 'Weigh' here means 'lift,' not 'wait.'" },
    { word:"Heave to", tag:"real", def:"To set the sails so the ship nearly stops, holding position against wind and sea." },
    { word:"Booty / Plunder", tag:"real", def:"Stolen goods. 'Plunder' as verb and noun is period-accurate." },
    { word:"Landlubber", tag:"real", def:"A clumsy, inexperienced sailor — 'lubber' is genuinely old sailor's slang for an oaf." },
    { word:"Shoals", tag:"real", def:"Shallow water or a sandbank — a deadly hazard. A shallow-draft ship could cross them; a deep warship could not." },
    { word:"Scuttle", tag:"real", def:"To deliberately sink a ship by holing her. A 'scuttlebutt' was the water cask — and the gossip around it." },
    { word:"Quarter", tag:"real", def:"Mercy. To 'give no quarter' is to take no prisoners; a black flag could promise quarter, a red flag none." },
    { word:"Arrr / Arr", tag:"myth", def:"The signature pirate growl — popularized by Robert Newton in 1950. In the West Country it stands in for 'yes.' No evidence real pirates leaned on it." },
    { word:"Shiver me timbers!", tag:"myth", def:"An oath of shock. Literary — popularized via Treasure Island and screen pirates, not the historical record." },
    { word:"Ahoy, me hearties!", tag:"myth", def:"'Ahoy' is a real hail; the cozy 'me hearties' address is largely theatrical pirate flavor." },
    { word:"Walk the plank", tag:"myth", def:"Iconic, but vanishingly rare in reality. Real pirates favored marooning, ransom, or simpler violence." },
    { word:"Pieces of eight", tag:"real", def:"The Spanish silver dollar (real de a ocho), cut into eight 'bits' for change — the actual currency of the Caribbean." },
    { word:"Jolly Roger", tag:"real", def:"The pirate flag, by the early 1700s. Designs varied wildly; the skull-and-crossbones is only one. A flag was psychological warfare — surrender, or else." }
  ],

  /* ---------- HISTORY timeline ---------- */
  historyIntro: "The 'Golden Age of Piracy' is loosely 1650s–1730s, but its most famous, romanticized window is the <strong>post-Spanish-Succession years, roughly 1714–1726</strong>: thousands of demobilized sailors, a sea full of merchant traffic, and weak colonial policing. Historians often mark the era's end with the deaths of its biggest names.",
  history: [
    { year:"c. 1650–1680", text:"Age of the <strong>buccaneers</strong> — Caribbean raiders like Henry Morgan, often semi-sanctioned against Spain." },
    { year:"1690s–1700s", text:"The 'Pirate Round': raiders sail to the Red Sea and Indian Ocean for rich Mughal and East India shipping. Henry Every and Captain Kidd belong here." },
    { year:"1701–1714", text:"The War of the Spanish Succession. When it ends, navies discharge huge numbers of trained, unemployed sailors into the Caribbean." },
    { year:"1716–1718", text:"Peak. <strong>Blackbeard (Edward Teach)</strong> blockades Charleston with the 40-gun <em>Queen Anne's Revenge</em>; lit slow-match under his hat in battle for terror effect. Killed November 1718." },
    { year:"1718", text:"Nassau, the pirates' republic in the Bahamas, is reclaimed by Royal Governor Woodes Rogers, who offers pardons." },
    { year:"1719–1720", text:"<strong>Anne Bonny</strong> and <strong>Mary Read</strong> sail with 'Calico Jack' Rackham; captured November 1720 and tried in Jamaica. Both 'pleaded their bellies' (pregnancy) to escape immediate hanging." },
    { year:"1722", text:"<strong>Bartholomew Roberts</strong> ('Black Bart'), the most successful of all — over 400 ships taken — is killed in battle against HMS Swallow. Widely seen as the beginning of the end." },
    { year:"1726–1730", text:"Executions of William Fly (1726) and others; Olivier Levasseur (1730). The Golden Age closes as navies and pardons grind piracy down." }
  ],

  /* ---------- THE FORGE: words of fire & iron (from your notes) ---------- */
  forgeIntro: "An <strong>athanor</strong> is an alchemist's furnace, built to hold a steady, low heat for long, careful transformation — a fitting patron for a workshop of words. These are the verbs of fire and iron, the language of the smith. Good fuel for the ship's armorer, the cursed blade, the forge that won't go cold.",
  forge: [
    { word:"Forge", def:"To heat metal and shape it with hammer blows." },
    { word:"Smelt", def:"To extract metal from ore by heating it to a molten state." },
    { word:"Temper", def:"To heat then cool metal in a controlled way to give it toughness and flex." },
    { word:"Quench", def:"To cool hot metal rapidly in water, oil, or brine." },
    { word:"Anneal", def:"To heat metal and let it cool slowly to make it softer and easier to work." },
    { word:"Harden", def:"To increase metal's strength by heating and rapid cooling." },
    { word:"Stoke", def:"To feed or stir a fire to increase its heat." },
    { word:"Scorch", def:"To burn the surface of something with sudden or intense heat." },
    { word:"Sear", def:"To burn or char the outside with high heat." },
    { word:"Weld", def:"To join pieces of metal by heating them to fusion." },
    { word:"Braze", def:"To join metals using a melted filler below the base metal's melting point." },
    { word:"Fuse", def:"To melt or blend materials together." },
    { word:"Cast", def:"To melt metal and pour it into a mold." },
    { word:"Mold", def:"To form material into a shape using a mold or external force." },
    { word:"Grind", def:"To remove material with an abrasive stone or wheel." },
    { word:"Hone", def:"To sharpen or refine an edge with controlled abrasion." },
    { word:"Polish", def:"To smooth and brighten a metal surface." },
    { word:"Etch", def:"To cut patterns or markings with acid or a corrosive substance." },
    { word:"Athanor", def:"An alchemical furnace for steady, low, long heat — slow, careful transformation." }
  ],

  /* ---------- CAPTAIN'S QUARTERS: the book itself ---------- */
  book: {
    blurb: "<em>Barnacles</em> is the book. This cabin is its private harbor — drop the maps, log the crew, pin the lines, keep the music. Nothing here is written by the AI; it only holds and arranges what is yours.",
    // Your character-building prompts, kept as scaffolding (not as written characters)
    crewPrompts: [
      "Every soul aboard has a motive: the dream of being a pirate, running from the law, hunger for adventure, riches, paying a debt, a traitor on enemy coin, no home to return to, loyalty, love… the cooking.",
      "Give each a unique reason to be liked. What do they live for? Where do they draw the line? Where are their morals?",
      "A mess of personalities, motives, and methods — bound to one collective goal. It needs to involve treasure, or at least promise something for everyone.",
      "A code that must be stood by.",
      "Each chapter focuses on one crew member but builds on all their stories.",
      "Fears to seed: storms, heights, drowning. One of the crew is deaf — deaf from overwhelm?",
      "Make the ship herself a character — leading this way and that, a mind of her own. Make it matter when she's damaged."
    ],
    crew: [
      { name:"[ Add a name ]", role:"Captain", note:"Motive · fear · the line they won't cross · why we love them. (Yours to fill — this is just the frame.)" },
      { name:"[ Add a name ]", role:"First Mate", note:"Loyalty or quiet mutiny? What do they live for?" },
      { name:"[ The Ship ]", role:"A character in her own right", note:"Her moods, her damage, her will. Name her." }
    ],
    // Your lines, exactly as you noted them — held, not authored
    lines: [
      "“Never trust anyone, me lady,” he said. “Not completely, that is. You never know when they’ve been possessed by dark magic and turned against you. Or if their identical twin they never knew existed just sliced their throat and took their place. Or perhaps they’ve been fed a bad meal by a corrupt cook and are starving for mutiny. Stranger things have happened.”",
      "“Best beware of them ___. They’ll treat yer insides like offal til there’s nothing left.”",
      "“And why did you take my word as truth? You do know I’m a pirate, right?”",
      "“I’ve been tied down to the harbor,” __ said. “But death for the child of God releases us.”",
      "I am the shadow, but he is darkness. To him, I shine brighter than the brightest sun."
    ],
    phrases: [
      "Only those who survive get to spin the tale.",
      "Breathe the water, drink the waves.",
      "Squiffed, soaked, and pockets full!",
      "May the flood come swift and wash you ‘way to the land of forever."
    ],
    proverbs: "“Her feet go down to death, her steps lay hold of hell. … For she has cast down many wounded, and all who were slain by her were strong men. Her house is the way to hell, descending to the chambers of death.” — Proverbs",
    words: ["shoals","outlandish","concoction","aright"],
    creepy: ["Careful where you step.","Human-shaped, disfigured things.","One bite, one touch, one little thing — and you’re dead.","Old things: a fuzzy camera feed, beat-up houses.","Reflections and mirrors.","Raining beings.","A bridge of bodies.","Glowing caves."],
    music: [
      { t:"Sea-shanty revival (Nathan Evans, The Longest Johns)", why:"For the work-song heartbeat and crew choruses." },
      { t:"Dark folk / neofolk (Wardruna, Heilung)", why:"Ritual, storm, and dread — for the cursed-magic undertow." },
      { t:"Cinematic pirate scores (Zimmer, et al.)", why:"Momentum for chase and battle scenes." },
      { t:"[ Add your own ]", why:"Pin the tracks that put you in the cabin." }
    ]
  }
};
