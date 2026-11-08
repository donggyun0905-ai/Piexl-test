// 튜토리얼: 출구가 막힌 방에서 단계마다 하나씩 해 보며 배움 (연습장과 같은 방, 기록·업적 없음)
import {
  generateFloor,
  practiceGive,
  practiceSpawn,
  practiceToggleDummy,
  ROOM_HEIGHT,
  ROOM_WIDTH,
  type CharacterId,
  type PassiveId,
  type RunState,
  type WeaponId,
} from "@pixel-rogue/shared";

export const TUTORIAL_STEPS = ["move", "attack", "dash", "dodge", "weapon", "reward", "item", "map", "end"] as const;
export type TutorialStepId = (typeof TUTORIAL_STEPS)[number];

/** 무기 바꾸기를 배울 때 바닥에 놓는 두 무기 (캐릭터의 공격 방식에 맞게, 무기가 하나뿐이면 null = 이 단계는 바로 넘어감) */
const DEMO_WEAPONS: Record<CharacterId, [WeaponId, WeaponId] | null> = {
  warden: ["broadaxe", "halberd"],
  drifter: ["longbow", "shortbow"],
  mage: ["frostwand", "triorb"],
  mystic: ["lightcharm", "darkcharm"],
  engineer: ["focuscannon", "teslacoil"],
  elementalist: ["planets", "steelorb"],
  brawler: ["kick", "taekkyon"],
  doctor: ["scalpel", "medkitbomb"],
  gunner: ["shotgun", "smg"],
  beast: ["catpack", "lionheart"],
  ninja: ["phantomring", "kunai"],
  chronomancer: ["clockhands", "timebomb"],
  summoner: ["shadowwhip", "starwhip"],
  novice: ["club", "javelin"],
  bedouin: null,
  general: ["skyHalberd", "cliffSpear"],
  imugi: ["azureDragon", "crimsonDragon"],
  apostle: ["wrathCross", "satanMask"],
  stargazer: ["twinStars", "novaHeart"],
  duck: ["megaphone", "crownDuck"],
  scribe: ["inkBrush", "akashicOrigin"],
  idra: ["gaia", "gaia"],
  byeonhui: ["bearForm", "phoenixForm"],
  fly: ["windTalon", "queenTalon"],
  elder: ["fiveDaggers", "heavenPalace"],
  ren: ["renHands", "renHands"],
  spiritist: ["idraSpirit", "abyssRuin"],
  plague: ["ratKing", "deathGrip"],
  slayer: ["whirlScythe", "executionScythe"],
  eater: null,
  mukin: ["quakeRam", "chainRam"],
  samyeol: ["lotusNeedles", "threadNeedle"],
  automata: ["adSisters", "adArsenal"],
  rider: ["rdPulse", "rdNitro"],
  bomber: ["bmFirework", "bmMega"],
  artifacter: null,
  punk: ["cyMonowire", "cyHack"],
  collector: null,
  tracker: null,
  forgotten: null,
  remnant: null,
  wanderer: null,
  silk: null,
  pungryu: null,
  leo: null,
  onyx: null,
  fenrir: null,
  eclipse: null,
  thorken: ["tkIron", "tkTide"],
  levia: ["lvAqua", "lvTopaz"],
  tail: ["tlTide", "tlMako"],
  madQueen: ["mqTide", "mqCrimson"],
  hook: ["hkRusty", "hkKraken"],
  orca: ["ocTide", "ocPod"],
  wave: ["wvBoard", "wvPrism"],
  miryu: ["mrSeiran", "mrVortex"],
  beatrice: null,
  ian: null,
  gabriel: null,
  serena: null,
  rafael: null,
  yuriel: null,
  michaela: null,
  blast: null,
  nailer: null,
  scissors: null,
  hellfist: null,
  silverBullet: null,
  blueFlame: null,
  miner: ["mnTnt", "mnPit"],
  voyager: null,
  zeus: ["zsSky", "zsChain"],
  pilgrim: ["pgCrane", "pgGate"],
  fallenKing: null,
  lux: null,
  abandoned: ["twinPistols", "lastPromise"],
  titan: ["pistonFist", "anvilHammer"],
  oni: ["frostClub", "tideClub"],
};
const DEMO_REWARDS: PassiveId[] = ["whetstone", "windBoots", "sturdyHeart"];

function drop(run: RunState, kind: "weapon" | "passive", itemId: string, x: number, y: number, group = 0): void {
  run.rooms[run.roomId]!.pickups.push({ id: run.nextId++, kind, itemId, x, y, group, armed: true, price: 0 });
}

/** 갈림길 연습: 시작 방의 출구를 원래 지도대로 열고, 다음 칸 방들은 적 없는 막다른 전투방으로 */
function openExits(run: RunState, startId: number): void {
  const real = generateFloor(run.seed, run.floor).rooms[startId]!;
  run.map.rooms[startId]!.exits = [...real.exits];
  for (const n of real.exits) {
    if (n < 0) continue;
    const room = run.map.rooms[n]!;
    room.exits = room.exits.map(() => -1);
    room.type = "combat";
    // 들어가도 적이 나오지 않게 (빈 목록이면 이미 정리된 방)
    run.rooms[n]!.enemies = [];
    run.rooms[n]!.pickups = [];
  }
}

export interface Tutorial {
  readonly step: TutorialStepId;
  readonly index: number;
  /** 매 프레임: 지금 단계를 끝냈으면 다음 단계로 넘어가고 true */
  update(): boolean;
  /** 지금 단계 건너뛰기 */
  skip(): void;
}

export function createTutorial(run: RunState): Tutorial {
  const p = run.player;
  let index = 0;
  let base = { x: p.x, y: p.y, kills: run.kills, weapon: p.weaponId };
  practiceToggleDummy(run); // 허수아비는 끔
  const startId = run.roomId;

  const enter = () => {
    base = { x: p.x, y: p.y, kills: run.kills, weapon: p.weaponId };
    const cx = ROOM_WIDTH / 2;
    const cy = ROOM_HEIGHT / 2;
    switch (TUTORIAL_STEPS[index]) {
      case "attack":
        practiceSpawn(run, "crawler");
        break;
      case "dodge":
        practiceSpawn(run, "mortar");
        break;
      case "weapon": {
        const demo = DEMO_WEAPONS[p.characterId];
        if (!demo) break;
        drop(run, "weapon", demo[0], cx - 50, cy + 30);
        drop(run, "weapon", demo[1], cx + 50, cy + 30);
        break;
      }
      case "reward": {
        const room = run.rooms[run.roomId]!;
        room.pickups = room.pickups.filter((pk) => pk.kind !== "weapon");
        DEMO_REWARDS.forEach((id, i) => drop(run, "passive", id, cx - 28 + i * 28, cy - 34, 1));
        break;
      }
      case "item":
        run.rooms[run.roomId]!.pickups = [];
        p.hp = Math.ceil(p.stats.maxHp * 0.5);
        practiceGive(run, { kind: "use", id: "potion" });
        break;
      case "map":
        openExits(run, startId);
        break;
      default:
        break;
    }
  };

  const finished = (): boolean => {
    switch (TUTORIAL_STEPS[index]) {
      case "move": {
        const dx = p.x - base.x;
        const dy = p.y - base.y;
        return dx * dx + dy * dy > 50 * 50;
      }
      case "attack":
      case "dodge":
        return run.kills > base.kills;
      case "dash":
        return p.dashTicks > 0;
      case "weapon":
        return !DEMO_WEAPONS[p.characterId] || p.weaponId !== base.weapon;
      case "reward":
        return p.passives.length > 0;
      case "item":
        return p.useSlots.every((s) => s === null);
      case "map":
        return run.roomId !== startId;
      default:
        return false;
    }
  };

  const next = () => {
    if (index < TUTORIAL_STEPS.length - 1) {
      index++;
      enter();
    }
  };

  return {
    get step() {
      return TUTORIAL_STEPS[index]!;
    },
    get index() {
      return index;
    },
    update() {
      if (!finished()) return false;
      next();
      return true;
    },
    skip: next,
  };
}
