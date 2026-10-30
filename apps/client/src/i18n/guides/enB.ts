// Character guide (English, last eleven characters)
import type { CharacterId } from "@pixel-rogue/shared";

export const GUIDE_EN_B: Partial<Record<CharacterId, readonly string[]>> = {
  summoner: [
    "Basics: 95 HP · lashes far ahead with a whip",
    "Hitting enough foes with the whip calls each weapon's summon (skeleton · imp · golem · wolf · fairy · baby dragon, etc.)",
    "Summons fight on their own and scale with your damage",
    "Tip: hitting many foes at once fills summons faster",
  ],
  novice: [
    "Basics: 100 HP · starts bare-handed · only finds shared weapons and shared passives",
    "Defeat foes to gain XP and level up, then spend stat points yourself",
    "Per point: +6% damage · +5% attack speed · +12 HP · +0.04 move · +6% range · +8% projectile speed · +1 luck · crit chance/damage",
    "Your outfit changes at levels 5 · 10 · 15 · 20",
  ],
  bedouin: [
    "Basics: 95 HP · 24 damage · a single body-sized chakram",
    "First attack spins and slashes around you; the next throws it very far",
    "The thrown chakram stays where it lands → dash through it to pick it up with a big sandy spin slash",
    "Empty hands make you faster, and your dash cuts foes you pass through",
  ],
  general: [
    "Basics: 115 HP · every press keeps the combo flowing without breaks",
    "Thrust ×3 → swing ×2 → a spinning dash thrust that explodes at the end; a short pause after each set",
    "Legendary generals' weapons change the combo · with Hidden Power items, the combo ends in that weapon owner's ultimate",
  ],
  imugi: [
    "Basics: 100 HP · thrust and swing in one, each hit adds to the combo (COMBO, top left)",
    "Combo 72: dragon aura fills and you grow stronger · 108: you become a dragon (a giant dragon sweeps the map cutting every foe, then 8s of a stronger body)",
    "Each dragon summon grants a permanent +15% crit · each weapon adds its own extra attack (lightning, storm, poison, etc.)",
    "The Dragon Pearl strikes every foe in the room with lightning (doesn't count toward the combo)",
  ],
  apostle: [
    "Basics: 105 HP · inverted crosses fall from the sky and crush foes",
    "Crosses of the Seven Sins leave cursed fields instead of damage (lust · greed · pride · sloth, etc.)",
    "Potions are poison: drinking one costs HP · heal by devouring the souls of fallen foes",
    "Each soul eaten grants +0.01 damage (keeps stacking) · Satan's Mask · weapons of rebellion",
  ],
  abandoned: [
    "Basics: 100 HP · three kids who grew up together — P1 shield (green) · P2 gun (red) · P3 sword (blue)",
    "Dash button = tag: the incoming kid takes your spot and the outgoing kid goes where they stood (0.23s invulnerable on a correct tag)",
    "The two kids not in play fight beside you · with the gun kid out, auto-attack reaches far",
    "Follow the combo chart (top left) with attacks and tags to unleash a special per stage · a mistake restarts and forces P1 in",
    "Attack speed never increases from items",
  ],
  titan: [
    "Basics: 170 HP · a slow tank · -15% damage taken · a big body that's easy to hit",
    "Normal attacks: very slow area attacks or fast but very weak jabs, depending on the weapon",
    "Damage taken charges the mech arm's energy; when full, the next attack is a powerful smash",
    "Parry instead of dash: blocked damage becomes energy (the circle by your HP bar shows the cooldown)",
  ],
  oni: [
    "Basics: 150 HP · 36 damage · an oni whose club is its true self · slow, crushing swings · +30% damage taken",
    "Each weapon has a chance of extra attacks (lightning · cold wave · hellfire · gold · darkness · light pillar · storm · tidal wave, etc.)",
    "Stat changes: 1 damage → 5 max HP · 1% attack speed → 1 regen (heals that much every 5s) · range → extra-attack area ('UP!' over your head)",
    "25 swings grant 30s of Shinin form: a sleek look with long horns · +45% damage · +50% max HP · 100% extra attacks",
    "Six clubs (Thunder Cudgel, Frostfang Club, Crimson Lotus Pillar, Shadow of Eight Heads, Wind God's Call, Dragon Tide Club) each have three exclusive items that appear only while you hold that club (more often with high luck)",
    "Golden Club: strikes with your gold · no shops or other weapons · entering treasure or golden rooms gives a full heal + gold",
    "??? : a netherworld weapon unlocked with 400 max HP after reviving once · ??? : an azure weapon unlocked with 60 regen after reviving once",
  ],
  stargazer: [
    "Hidden · 110 HP · each attack plants a star on the spot",
    "Nearby stars link with beams of light that burn foes passing through",
    "When stars fill up, the constellation completes and every star bursts at once · stars vanish when you change rooms",
    "Tip: plant stars densely along foes' paths to weave a web of beams",
  ],
  duck: [
    "Hidden · 130 HP · 1.4 move speed · 2 luck · very sturdy",
    "Quack waves shove and hit every foe in front · every 4th is a big quack all around (stun)",
    "Ducklings follow in a line, block enemy shots, and quack along with you",
  ],
  scribe: [
    "Hidden · The Scribe of the Akashic Records · 95 HP · 2 luck",
    "Fires ink shots with a quill · hit foes gather records (ink dots, up to 9)",
    "Every 5th attack writes the weapon's glyph: 劍 blade · 爆 blast · 封 seal · 雷 chain lightning · 氷 freeze · 炎 fire · 再 damage per record · 星 shooting stars · 滅 the weakest foe",
    "The Akashic Original writes every glyph in turn · exclusive items make glyphs more frequent, stronger, or doubled",
  ],
};
