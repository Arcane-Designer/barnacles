# 🎨 Barnacles — Image Prompts for Realistic Room Art

The site already draws a hand-built scene for every location. But if you drop a real
image into `assets/rooms/`, the site **automatically layers it on top** and fades it in —
no code changes needed. This is the single biggest upgrade you can make to realism.

## How to use
1. Generate an image with one of the prompts below (ChatGPT/DALL·E, Midjourney, etc.).
2. Save it with the **exact filename** listed (all lowercase, `.jpg`).
3. Put it in `assets/rooms/`. Refresh the page — it appears.

## Rules for good results
- **Landscape, 16:9** (e.g. 1920×1080). The site crops to fill, so keep important detail centered.
- **First-person point of view**, as if you are standing in that spot on the ship.
- **Dark, moody, cinematic, painterly** — stormy pirate-era galleon, candle/lantern light, weathered wood. Avoid text, watermarks, people's faces, and modern objects.
- Ask for a **consistent style across all of them** — paste this style line into every prompt:

> *Style: dark cinematic painterly concept art, late-1600s/early-1700s pirate galleon, weathered oak and iron, stormy atmosphere, volumetric lantern light, muted gold and teal palette, no text, no people front-and-center, 16:9.*

---

## The prompts (filename → prompt)

**`assets/rooms/helm.jpg`** — *The Helm / Quarterdeck*
> First-person view standing at a large wooden ship's wheel on the raised quarterdeck of a pirate galleon at night, a brass binnacle compass beside the wheel, weathered deck planks, rope rigging, the stormy sea and horizon visible past the stern rail, two lit lanterns glowing. [style line]

**`assets/rooms/maindeck.jpg`** — *The Main Deck / Waist*
> First-person view amidships on the main deck of a pirate galleon, a heavy wooden capstan in the center with protruding bars, coiled ropes and barrels, two tall masts rising with rigging, dark stormy sky, sea beyond the side rails. [style line]

**`assets/rooms/forecastle.jpg`** — *The Forecastle / Bow*
> First-person view on the raised forecastle at the bow of a pirate galleon, a massive iron anchor lashed to the deck, the bowsprit reaching out over churning open sea, rope rigging, dramatic stormy light. [style line]

**`assets/rooms/crowsnest.jpg`** — *The Crow's Nest*
> First-person view from inside the wooden crow's-nest barrel high atop the mainmast of a pirate ship, looking down past converging rigging ropes to a tiny deck and vast stormy ocean far below, wind-torn clouds, vertigo height. [style line]

**`assets/rooms/gundeck.jpg`** — *The Gun Deck*
> First-person view down the low-ceilinged gun deck of a pirate galleon, a row of black iron cannons run up to open gunports with grey storm light spilling in, heavy oak beams overhead, a hanging lantern, dim and smoky. [style line]

**`assets/rooms/hold.jpg`** — *The Hold*
> First-person view in the dark cargo hold deep in the belly of a pirate ship, stacked wooden crates and barrels, a single hanging lantern casting warm glow into deep shadow, damp timber, low and claustrophobic. [style line]

**`assets/rooms/cabin.jpg`** — *The Great Cabin (Captain's Quarters)*
> First-person view inside the captain's great cabin at the stern of a pirate galleon, tall multi-paned stern gallery windows showing stormy sea, a wooden desk with an unrolled map and a single candle, warm wood, charts and a lantern, intimate and richly lit. [style line]

**`assets/rooms/galley.jpg`** — *The Galley / Forge*
> First-person view of the ship's galley and forge below decks, a brick firebox blazing orange, an anvil and blacksmith tools, hanging iron pots, sparks in the air, warm firelight against dark timber. [style line]

**`assets/rooms/sea.jpg`** — *Overboard / Underwater*
> First-person underwater view just below the surface of a stormy sea beside a galleon's hull, shafts of dim light from above, rising bubbles, a ghostly sunken mast in the blue-green murk, eerie and quiet. [style line]

---

## Also nice to have
- **`assets/cover.jpg`** — your book cover (already in place).
- **`assets/map.jpg`** — a treasure/world map for the Captain's Quarters map slot. Prompt:
  > Aged parchment pirate treasure map, hand-drawn coastlines and islands, compass rose, dotted route, sea monsters in the margins, burnt edges, no modern text. [style line]

When you've made any of these, just tell me and I'll confirm they're wired in (they should appear automatically). If you'd rather I keep refining the hand-drawn SVG scenes instead, say the word.
