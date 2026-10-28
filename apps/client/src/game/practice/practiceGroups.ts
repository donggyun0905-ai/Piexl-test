// 연습장 목록 나누기: 무기·패시브는 지금 캐릭터 → 공용 → 다른 캐릭터 순, 적은 졸개 → 단계별 보스 → 라스트 보스
import {
  BOSS_TIERS,
  ALL_CHARACTER_IDS,
  characterWeapons,
  PASSIVE_IDS,
  PASSIVES,
  USE_ITEM_IDS,
  WEAPON_IDS,
  WEAPONS,
  type CharacterId,
  type EnemyKind,
  type PassiveDef,
  type WeaponDef,
} from "@pixel-rogue/shared";
import type { TextKey } from "../../i18n";
import type { IconItem } from "../itemIcon";

/** 묶음 하나: 제목(글자 키 + 캐릭터 이름 넣기) · 처음에 펼칠지 · 들어가는 것 */
export interface Group<T> {
  key: string;
  title: TextKey;
  who?: CharacterId;
  open: boolean;
  list: T[];
}

const ownerOf = (def: { exclusive?: string }) => def.exclusive as CharacterId | undefined;

export function weaponGroups(cur: CharacterId): Group<IconItem>[] {
  const mine = characterWeapons(cur);
  const groups: Group<IconItem>[] = [{ key: "mine", title: "practiceUsable", who: cur, open: true, list: mine.map((id) => ({ kind: "weapon", id })) }];
  const common = WEAPON_IDS.filter((id) => !ownerOf(WEAPONS[id] as WeaponDef) && !mine.includes(id));
  if (common.length) groups.push({ key: "common", title: "practiceCommon", open: true, list: common.map((id) => ({ kind: "weapon", id })) });
  for (const c of ALL_CHARACTER_IDS) {
    if (c === cur) continue;
    const list = WEAPON_IDS.filter((id) => ownerOf(WEAPONS[id] as WeaponDef) === c);
    if (list.length) groups.push({ key: c, title: "practiceOnly", who: c, open: false, list: list.map((id) => ({ kind: "weapon", id })) });
  }
  return groups;
}

export function passiveGroups(cur: CharacterId): Group<IconItem>[] {
  const of = (c: CharacterId | undefined) => PASSIVE_IDS.filter((id) => ownerOf(PASSIVES[id] as PassiveDef) === c).map((id): IconItem => ({ kind: "passive", id }));
  const groups: Group<IconItem>[] = [];
  const mine = of(cur);
  if (mine.length) groups.push({ key: "mine", title: "practiceOnly", who: cur, open: true, list: mine });
  groups.push({ key: "common", title: "practiceCommon", open: true, list: of(undefined) });
  for (const c of ALL_CHARACTER_IDS) {
    const list = c === cur ? [] : of(c);
    if (list.length) groups.push({ key: c, title: "practiceOnly", who: c, open: false, list });
  }
  return groups;
}

export function useGroups(): Group<IconItem>[] {
  return [{ key: "use", title: "practiceUse", open: true, list: USE_ITEM_IDS.map((id) => ({ kind: "use", id })) }];
}

/** 부를 수 있는 적 (이름 글자 키) */
export const ENEMY_NAMES: Partial<Record<EnemyKind, TextKey>> = {
  crawler: "enemyCrawler",
  spitter: "enemySpitter",
  charger: "enemyCharger",
  mortar: "enemyMortar",
  gnat: "enemyGnat",
  guardian: "enemyGuardian",
  paladin: "enemyPaladin",
  slime: "enemySlime",
  runner: "enemyLizard",
  bat: "enemyBat",
  beetle: "enemyBeetle",
  golem: "enemyGolem",
  shaman: "enemyShaman",
  eggsac: "enemyEggSac",
  wisp: "enemyWisp",
  hulk: "bossHulk",
  brood: "bossBrood",
  seer: "bossSeer",
  knight: "bossKnight",
  archer: "bossArcher",
  siren: "bossSiren",
  centaur: "bossCentaur",
  plant: "bossPlant",
  reaper: "bossReaper",
  swordgod: "bossSwordGod",
  archangel: "bossAngel",
  dragon: "bossDragon",
  godeater: "bossGodEater",
  plight: "bossPrimeval",
  umbra: "bossUmbra",
  demigod: "bossDemigod",
  sage: "bossSage",
};

const MINIONS: EnemyKind[] = ["crawler", "spitter", "charger", "mortar", "gnat", "guardian", "paladin", "slime", "runner", "bat", "beetle", "golem", "shaman", "eggsac", "wisp"];

/** 적 묶음: 졸개 · 1~3단계 보스 (나오는 층) · 라스트 보스. floor = 그 묶음을 부를 때 맞추면 좋은 세기 */
export const ENEMY_GROUPS: (Group<EnemyKind> & { floor: number })[] = [
  { key: "minion", title: "practiceMinions", open: true, list: MINIONS, floor: 1 },
  ...BOSS_TIERS.map((tier, i) => ({ key: `tier${i}`, title: `practiceTier${i + 1}` as TextKey, open: true, list: [...tier], floor: i * 2 + 1 })),
  { key: "last", title: "practiceLast", open: true, list: ["dragon", "godeater", "plight", "umbra", "demigod", "sage"], floor: 7 },
];
