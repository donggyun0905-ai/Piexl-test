// Character guide (English, first twelve characters). One line per point
import type { CharacterId } from "@pixel-rogue/shared";

export const GUIDE_EN_A: Partial<Record<CharacterId, readonly string[]>> = {
  warden: [
    "Basics: 120 HP · a melee fighter who cleaves a wide fan in front with a greatblade",
    "Range = slash reach, attack speed = swing speed",
    "Exclusive items: body-slam effects such as Dash Slash, which cuts foes you dash through",
    "Tip: your HP is high — dive into crowds, cleave, and dash back out",
  ],
  drifter: [
    "Basics: 90 HP · 1.35 move speed · shoots from afar with a crossbow",
    "Projectile speed = bolt speed, range = how far bolts fly",
    "No base crits (crit items can add them)",
    "Tip: keep your distance with quick feet; dash sideways when cornered",
  ],
  mage: [
    "Basics: 75 HP (low) · 1 luck · magic shots burst on hit and damage nearby foes",
    "Magic Runes: weapon attacks are basic attacks (75% damage), and each one carves a stroke into the circle at your feet. At 6 strokes a big spell matching your weapon lands on the nearest foe (fire nova, lightning, frost, comet, starfall, void)",
    "Higher range and projectile speed make the bursts reach farther and faster",
    "Tip: great against packs. Your HP is low, so don't get close",
  ],
  mystic: [
    "Basics: 85 HP · throws talismans that stick to foes",
    "As talismans stack on a foe, each weapon triggers its own extra effect (cherry bloom, lightning, etc.)",
    "Exclusive items: Mindset · Jade Bead · Prajna · Four Seals · Domain · Life Drain — boost talisman effects",
    "Tip: some weapons stack on one target, others spread to many — play to each",
  ],
  engineer: [
    "Basics: 100 HP · hold attack to melt foes with a laser (never misses, short range)",
    "Each point of attack speed = 10/3 hits per second (2 = every 0.15s); DPS = damage × attack speed",
    "Every weapon attacks differently: thrown turrets · drone beams · lightning · magnetic pulses · hammers · mines · satellite cannon",
    "Tip: placed weapons (turrets, mines) go where you aim when aiming manually",
  ],
  elementalist: [
    "Basics: 90 HP · elemental orbs circle your body and hit whatever they touch",
    "Attack speed = how often one orb can hit again · projectile speed = spin speed · range = orbit radius",
    "The attack key fires each weapon's special (bullets · trigger · gravity · god hand)",
    "Tip: walk into crowds and grind them with orbs; a wider orbit is safer",
  ],
  brawler: [
    "Basics: 110 HP · every hit chains into the next move of the combo, and the finisher is strong",
    "Attack speed = the gap between moves (faster reaches the finisher sooner)",
    "Each weapon has its own combo table · Twin Flash Strikes earns a star every 5-hit combo",
    "Tip: keep landing hits so the combo never breaks",
  ],
  doctor: [
    "Basics: 100 HP · 5 luck · a healer who deals continuous damage while attack is held",
    "Heals a little while attacking (capped per second) · overflow healing at full HP becomes a shield (overheal)",
    "Every weapon works differently: syringe · scalpel · transfusion tube · defibrillator · suture · anesthetic gas · IV pole · pills · med kit · bandage whip · ambulance",
    "Tip: healing items turn into shields, so they're never wasted at full HP",
  ],
  gunner: [
    "Basics: HP fixed at 40 (HP items don't raise it) · fast feet and critical hits",
    "Reload when the magazine is empty (shotguns reload one shell at a time while firing, miniguns spin up)",
    "Attack speed = shots per second · projectile speed = bullet speed",
    "Tip: getting hit is dangerous — dodging and spacing are everything. Drone weapons fire from the drone, not you",
  ],
  beast: [
    "Basics: 95 HP · 1.4 move speed · a cat-folk whose pet cats rush nearby foes and scratch on their own",
    "Cat damage scales with your damage · each weapon brings different cats and a different attack",
    "Your attacks: scratch · pounce · yarn (bounces off walls) · hairball (sticky) · catnip cloud · bell · catnap",
    "Fill the pounce gauge to turn into a giant tiger",
  ],
  ninja: [
    "Basics: 85 HP · 1.4 move speed · stacks marks on foes with shuriken and more",
    "When the marks fill, a shadow clone bursts from the foe's shadow and strikes from behind (mark count differs per weapon)",
    "Each weapon has its own throw/slash style and clone technique (X cut · spikes · 9-point phantom rush, etc.)",
    "Tip: focus one foe to fill marks quickly",
  ],
  chronomancer: [
    "Basics: 90 HP · your own attacks are weak (70%)",
    "One second later, an afterimage attacks again at the same spot for 120%",
    "Time Collapse: each afterimage hit adds a clock mark over the foe; at 5 the clock shatters for 400% damage (half to foes nearby)",
    "Fight on the move and attacks erupt again everywhere you've been · each weapon attacks differently",
    "Tip: attack the path foes will walk so the afterimage catches them",
  ],
};
