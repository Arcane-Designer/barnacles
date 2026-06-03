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

  /* ---------- FAMOUS PIRATES ---------- */
  piratesIntro: "The Golden Age threw up a handful of names that never sank. Some are mostly myth, some did far more than the legends remember. Here are a few worth knowing — and the single most successful pirate in all history is one most people have never heard of.",
  pirates: [
    { name:"Blackbeard (Edward Teach)", years:"active 1716–1718", tag:"Terror as a weapon",
      blurb:"The most notorious pirate of the English-speaking world, though his career lasted barely two years. He blockaded the port of Charleston with his 40-gun <em>Queen Anne's Revenge</em> and went into battle with lit slow-match smouldering under his hat to wreathe himself in smoke. Killed in a boarding fight in November 1718." },
    { name:"Bartholomew Roberts (Black Bart)", years:"d. 1722", tag:"The most successful of the Atlantic pirates",
      blurb:"A Welsh captain who took over 400 ships in three years — more than any other pirate of the age. Famous for his strict written articles, his fine clothes, and naming his own flag the 'Jolly Roger.' His death in battle against HMS Swallow in 1722 is often marked as the beginning of the end of the Golden Age." },
    { name:"Zheng Yi Sao (Ching Shih)", years:"active c.1807–1810", tag:"The most successful pirate who ever lived",
      blurb:"A Chinese commander whose Red Flag Fleet grew to as many as 1,800 ships and tens of thousands of pirates — dwarfing every Caribbean captain (Blackbeard commanded four ships). She ran it by a strict code, then did the near-impossible: negotiated a pardon, kept her plunder, and retired peacefully, dying wealthy at 69." },
    { name:"Anne Bonny & Mary Read", years:"captured 1720", tag:"Fought when the men wouldn't",
      blurb:"Two women who sailed with 'Calico Jack' Rackham. When their ship was taken in 1720, accounts say the pair fought on deck while the male crew hid drunk below. Both were convicted of piracy in Jamaica; both escaped immediate hanging by 'pleading their bellies' (pregnancy)." },
    { name:"'Calico Jack' Rackham", years:"d. 1720", tag:"Famous flag, modest career",
      blurb:"A minor captain remembered far beyond his deeds, mostly for sailing with Bonny and Read. The skull-above-crossed-swords flag everyone calls 'his' is actually a 20th-century invention — a good lesson in how much pirate 'history' is really pop culture." },
    { name:"Henry Every", years:"active 1690s", tag:"The one who got away",
      blurb:"Pulled off one of the richest hauls in history raiding a Mughal treasure ship in the Indian Ocean, sparking an international manhunt — then vanished completely. He was never caught, and his fate is unknown to this day." },
    { name:"Captain William Kidd", years:"hanged 1701", tag:"Privateer turned scapegoat",
      blurb:"Began as a privateer hunting pirates under royal commission, drifted into piracy himself, and was hanged in London — the rope broke on the first attempt. Rumours of his buried treasure helped invent the whole 'pirate gold map' legend." }
  ],

  /* ---------- THE PIRATE CODE ---------- */
  codeIntro: "Pirate ships were, oddly, more democratic than the navies they fled. Crews signed <strong>Articles of Agreement</strong>: the captain was elected and could be deposed, plunder was shared by a fixed scale, and a quartermaster checked the captain's power. These articles of <strong>Bartholomew Roberts</strong>' crew survive in Captain Charles Johnson's <em>A General History of the Pyrates</em> (1724) — lightly modernised here.",
  code: [
    { n:"I", text:"Every man has a vote in affairs of moment, and an equal share of fresh provisions and strong liquor seized — to use at pleasure, unless scarcity forces a rationing for the good of all." },
    { n:"II", text:"Every man called fairly in turn over the plunder; but anyone defrauding the company of even a dollar's worth is marooned." },
    { n:"III", text:"No person to game at cards or dice for money." },
    { n:"IV", text:"Lights and candles out by eight at night; any still wanting drink after that must do it on the open deck." },
    { n:"V", text:"Keep your piece, pistols, and cutlass clean and fit for service." },
    { n:"VI", text:"No boy or woman allowed aboard, on pain of death — meant to keep the peace among the crew." },
    { n:"VII", text:"He that deserts the ship or his quarters in battle is punished with death or marooning." },
    { n:"VIII", text:"No striking another aboard ship; quarrels are settled ashore, by sword or pistol, at the quartermaster's word." },
    { n:"IX", text:"No one may break up the company until each has made £1,000. A man crippled in service gets 800 dollars from the common stock; lesser hurts, proportionally." },
    { n:"X", text:"Shares of a prize: Captain and Quartermaster two; Master, Boatswain, Gunner one and a half; other officers one and a quarter; all else, one share." },
    { n:"XI", text:"The musicians have rest on the Sabbath, but the other six days and nights only by special favour." }
  ],

  /* ---------- FLAGS & SIGNALS ---------- */
  flagsIntro: "A pirate flag was psychological warfare. Run up the colours, and a merchant captain had a choice. A <strong>black</strong> flag meant 'surrender and you'll be given <em>quarter</em> (mercy).' A <strong>red</strong> flag meant 'no quarter — no mercy, no survivors.' The word 'Jolly Roger' is first recorded around 1724; even then it was a generic term for any black pirate flag, not one design. Build your own below.",
  flags: [
    { name:"The Black Flag", desc:"Surrender now and quarter will be given. The skull-and-crossbones is only the most famous of many designs." },
    { name:"The Red ('Bloody') Flag", desc:"No quarter. The most feared signal at sea — fight us and none of you will be spared." },
    { name:"Bartholomew Roberts'", desc:"Eyewitnesses described 'a death's head and an arm with a cutlass.' Roberts is also the first known to call his flag the Jolly Roger." },
    { name:"The hourglass", desc:"A common emblem: your time is running out. Sometimes winged — time is flying away." },
    { name:"The bleeding heart & the skeleton", desc:"Spears, bleeding hearts, and dancing skeletons all warned of the dreadful price of resistance." },
    { name:"'Calico Jack' Rackham's", desc:"The skull above crossed swords everyone knows — and a 20th-century invention. A reminder that much 'pirate history' is really Hollywood." }
  ],

  /* ---------- KNOTS & RIGGING ---------- */
  knotsIntro: "A ship runs on rope, and rope runs on knots. The right knot holds fast under tons of strain yet unties with a tug when you need it; the wrong one jams or slips and costs lives. Here are the essentials — pick one to watch it tie.",
  knots: [
    { key:"bowline",   name:"Bowline",        use:"Makes a fixed loop that won't slip or jam — the 'king of knots.' Rescue, mooring, anything needing a reliable loop." },
    { key:"clove",     name:"Clove Hitch",    use:"Fastens a line to a post or spar quickly. Easy to tie and adjust; best when the load is steady." },
    { key:"reef",      name:"Reef (Square) Knot", use:"Joins two lines of equal size or reefs (shortens) a sail. Lies flat — but never trust it under heavy strain." },
    { key:"sheet",     name:"Sheet Bend",     use:"Ties two ropes together, even of different thickness, where a reef knot would fail." },
    { key:"figure8",   name:"Figure-Eight",   use:"A stopper knot that keeps a line from running out through a block. Easy to untie after loading." }
  ],

  /* ---------- NAVIGATION & THE STARS ---------- */
  navIntro: "Out of sight of land, with no GPS and no reliable clock, how did they know where they were? Mostly they didn't — not exactly. They measured <strong>latitude</strong> (how far north or south) fairly well from the sun and stars, guessed the rest by <strong>dead reckoning</strong>, and prayed. Longitude was a nightmare unsolved until accurate clocks arrived in the 18th century.",
  navigation: [
    { name:"The magnetic compass", desc:"Points roughly north, giving heading. The foundation of every other method — but it lies a little (magnetic north isn't true north)." },
    { name:"Cross-staff & backstaff", desc:"Measure the angle of the sun or Polaris above the horizon to find latitude. The backstaff (John Davis, c.1594) let you keep the blinding sun at your back." },
    { name:"The log line — why we say 'knots'", desc:"A board on a knotted rope, thrown astern. Count how many knots run out in a timed sandglass and you have your speed. That's literally why ship speed is measured in 'knots.'" },
    { name:"The lead line", desc:"A tallow-tipped lead weight on a knotted rope, dropped to read depth — and to bring up sand or shell from the bottom, telling a wary captain what lay below." },
    { name:"Dead reckoning", desc:"From a known point, plot course (compass) × speed (log) × time (glass), correcting for wind and current. Errors pile up fast — many ships were lost to a bad reckoning." },
    { name:"The longitude problem", desc:"To know east–west position you must compare local time with the time at a home port. Without an accurate sea-clock that was impossible, so longitude stayed a deadly guess for centuries." }
  ],

  /* ---------- LIFE ABOARD ---------- */
  lifeIntro: "Strip away the romance and a pirate's life was cramped, wet, dangerous, and often boring — punctuated by terror. But it offered something a navy or merchant berth rarely did: a vote, a fair share, and a way out of a brutal hierarchy ashore.",
  life: [
    { name:"Hardtack", desc:"A rock-hard biscuit of flour, water and salt, baked until nearly indestructible. On long voyages it bred weevils; men ate in the dark so as not to see, or dunked it in grog to soften it and float the bugs out." },
    { name:"Salt beef & pork", desc:"Meat packed in barrels of salt to survive months at sea — tough, intensely salty, soaked and boiled before it could be chewed." },
    { name:"Grog", desc:"Rum cut with water (often with lime or lemon). Watering it down kept the crew working rather than blind drunk, and the citrus warded off scurvy — though no one yet knew why." },
    { name:"Scurvy", desc:"A killer of long voyages, caused by lack of vitamin C: bleeding gums, old wounds reopening, exhaustion, death. Fresh fruit cured it; ships that carried citrus suffered far less." },
    { name:"Watches", desc:"The day split into watches marked by the ship's bell, so the vessel was always crewed. Work, sleep, work — broken only by weather, drills, and the rare fight." },
    { name:"The quartermaster", desc:"Elected to balance the captain: he ran daily discipline, divided plunder, and spoke for the crew. On many ships he, not the captain, settled disputes." },
    { name:"Pay by the share", desc:"No wages — you took a cut of what was seized, set by the articles, with extra for losing a limb. No prize, no pay: a powerful reason to keep hunting." }
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
    music: [
      { t:"Sea-shanty revival (Nathan Evans, The Longest Johns)", why:"For the work-song heartbeat and crew choruses." },
      { t:"Dark folk / neofolk (Wardruna, Heilung)", why:"Ritual, storm, and dread — for the cursed-magic undertow." },
      { t:"Cinematic pirate scores (Zimmer, et al.)", why:"Momentum for chase and battle scenes." },
      { t:"[ Add your own ]", why:"Pin the tracks that put you in the cabin." }
    ]
  }
};
