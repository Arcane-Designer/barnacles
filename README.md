# 🏴‍☠️ BARNACLES

A dark, stormy, interactive companion site for the pirate book **Barnacles** — a place to learn how ships work, sing the shanties, speak the speak, walk the history, and breathe the salt air. Built to keep the author living in the vibe (and motivated to write).

> The book is **100% human-written**. This site is the playground around it.

## What's here

- **The Ship (home)** — click parts of the vessel to go below into different rooms.
- **How Ships Work** — interactive anatomy diagram + the breeds of vessel and their eras.
- **Shanties** — what a shanty is, capstan vs. halyard, call-and-response, with lyrics and a rhythm button.
- **Pirate Speak** — a searchable lexicon that honestly separates *real* sailor's language from *pop-culture myth* (the "arrr" is mostly one 1950 actor).
- **History of Piracy** — a timeline of the Golden Age and its famous names.
- **The Forge** — a glossary of fire-and-iron words for the smith.
- **Captain's Quarters** — the private book room: cover, crew profiles, the lines/phrases, a map slot, music, and the "dread" notes. *Holds your material; never rewrites it.*
- **Gunnery** — a small teaser mini-game.
- **Zone-based ambient audio** — everything is synthesized live in the browser (no audio files). Sound changes as you move: open storm on deck, muffled creaks below, underwater when you dive.

## Run it

Just **double-click `index.html`** — it works straight off the disk, no server or build step. (Webfonts and the cover load when you're online; it still runs offline with fallbacks.)

## Add your own art

- **Cover:** save your cover image as `assets/cover.jpg` (already wired).
- **Map:** save a map image as `assets/map.jpg` to fill the Captain's Quarters map slot.

## Editing content

All the words live in `js/content.js` — add ships, shanties, terms, timeline entries, crew, lines, and music by editing those arrays. No coding the layout required.

## How you move

You don't jump between pages — you **move through the ship**. Start at the helm and choose
doors, hatches, ladders, the mast, or the rail to travel: helm ⇄ main deck ⇄ forecastle,
down to the gun deck, hold, galley, and great cabin, up to the crow's nest, or overboard
into the sea. Paths loop; most rooms can be reached more than one way. A slow **day/night
cycle** drifts overhead (calmer and brighter by day, stormier at night).

## Structure

```
index.html        # shell: layered scene stack, floating header, gate
css/styles.css    # theme + ship interface + transitions
js/content.js     # all the words (edit me)
js/clock.js       # day/night cycle (CYCLE_MS to retune)
js/audio.js       # procedural zone audio engine
js/weather.js     # canvas rain / lightning / motes / bubbles (clock-aware)
js/scenes.js      # the SVG backdrop for each location
js/rooms.js       # each room's content panel + interactivity
js/ship.js        # the ship layout, exits, and movement transitions
js/app.js         # boot + wiring
assets/           # cover.jpg, map.jpg
assets/rooms/     # optional realistic backgrounds (see ASSET-PROMPTS.md)
ASSET-PROMPTS.md  # image-generation prompts for realistic room art
```

## Publishing to GitHub Pages (later)

Once pushed to a GitHub repo: **Settings → Pages → Source: `main` / root**. The site goes live at `https://<user>.github.io/<repo>/`. Nothing else needed — it's all static.

---
*Only those who survive get to spin the tale.*
