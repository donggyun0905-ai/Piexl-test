// 업적 · 영구 해금 · 점수. 업적은 혼자 하기에서만 해금에 쓰임 (일일·배틀 제외)
// 업적 하나에 보상을 붙이려면 그 줄에 unlock만 넣으면 됨 (아이템·무기·캐릭터). 판정은 아래 함수
import { CHARACTER_IDS, type CharacterId, type WeaponId } from "./content";
import type { PassiveId, UseItemId } from "./items";
import { FLOOR_COUNT } from "./sim/floor";
import type { RunState } from "./sim/types";
import { TICK_RATE } from "./constants";

/** 업적 목록 화면의 묶음 (이 순서로 보여 줌) */
export const ACHIEVEMENT_CATEGORIES = ["progress", "combat", "boss", "wealth", "build", "character", "challenge", "career"] as const;
export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number];

export type UnlockRef =
  | { kind: "passive"; id: PassiveId }
  | { kind: "use"; id: UseItemId }
  | { kind: "weapon"; id: WeaponId }
  | { kind: "character"; id: CharacterId };

/** 이 기기의 누적 기록 (끝난 판마다 더함, 연습장·튜토리얼 제외) */
export interface CareerStats {
  runs: number;
  wins: number;
  kills: number;
  bossKills: number;
  goldEarned: number;
  purchases: number;
  /** 캐릭터별 클리어 수 */
  clearedBy: Partial<Record<CharacterId, number>>;
}

export const EMPTY_CAREER: CareerStats = { runs: 0, wins: 0, kills: 0, bossKills: 0, goldEarned: 0, purchases: 0, clearedBy: {} };

/** 누적 기록 + 지금 판 (판 수는 끝났을 때만 셈) */
export function careerWith(c: CareerStats, s: RunState): CareerStats {
  const ch = s.player.characterId;
  return {
    runs: c.runs + (s.over ? 1 : 0),
    wins: c.wins + (s.won ? 1 : 0),
    kills: c.kills + s.kills,
    bossKills: c.bossKills + s.bossKills,
    goldEarned: c.goldEarned + s.goldEarned,
    purchases: c.purchases + s.purchases,
    clearedBy: s.won ? { ...c.clearedBy, [ch]: (c.clearedBy[ch] ?? 0) + 1 } : c.clearedBy,
  };
}

export interface AchievementDef {
  id: string;
  category: AchievementCategory;
  /** 한 판 안에서 달성 여부 */
  run?: (s: RunState) => boolean;
  /** 누적 목표: value(누적 기록)가 goal 이상이면 달성. 목록에 진행도 막대로 보임 */
  total?: { goal: number; value: (c: CareerStats) => number };
  /** 달성하면 나오기 시작하는 것 */
  unlock?: UnlockRef;
}

/** 클리어 시간 기준 (남은 시간 보너스·빠른 클리어) */
export const TIME_LIMIT_TICKS = 15 * 60 * TICK_RATE;
const MIN = 60 * TICK_RATE;

const clearAs = (id: CharacterId) => (s: RunState) => s.won && s.player.characterId === id;
/** 그 캐릭터로 클리어 업적 한 줄 */
const ch = <I extends string>(id: I, c: CharacterId) => ({ id, category: "character" as const, run: clearAs(c) });
const total = (goal: number, value: (c: CareerStats) => number) => ({ goal, value });

// 수치는 임시. id는 저장·서버에 남으므로 바꾸지 않음 (순서·이름·조건 수치는 바꿔도 됨)
export const ACHIEVEMENTS = [
  // 진행
  { id: "floor2", category: "progress", run: (s) => s.floor >= 2 },
  { id: "floor3", category: "progress", run: (s) => s.floor >= 3, unlock: { kind: "passive", id: "hunterEye" } },
  { id: "floor4", category: "progress", run: (s) => s.floor >= 4, unlock: { kind: "use", id: "elixir" } },
  { id: "floor5", category: "progress", run: (s) => s.floor >= 5, unlock: { kind: "weapon", id: "boomerang" } },
  { id: "floor6", category: "progress", run: (s) => s.floor >= 6, unlock: { kind: "passive", id: "secondWind" } },
  { id: "clearRun", category: "progress", run: (s) => s.won, unlock: { kind: "passive", id: "ironSkin" } },
  // 전투 (한 판)
  { id: "kills30", category: "combat", run: (s) => s.kills >= 30, unlock: { kind: "weapon", id: "dagger" } },
  { id: "kills70", category: "combat", run: (s) => s.kills >= 70, unlock: { kind: "passive", id: "furySeal" } },
  { id: "hunter", category: "combat", run: (s) => s.kills >= 120, unlock: { kind: "weapon", id: "glaive" } },
  { id: "kills170", category: "combat", run: (s) => s.kills >= 170, unlock: { kind: "weapon", id: "javelin" } },
  // 보스
  { id: "firstBoss", category: "boss", run: (s) => s.bossKills >= 1, unlock: { kind: "passive", id: "quickDraw" } },
  { id: "boss3", category: "boss", run: (s) => s.bossKills >= 3, unlock: { kind: "passive", id: "heavyPlate" } },
  { id: "flawlessBoss", category: "boss", run: (s) => s.flawlessBosses >= 1, unlock: { kind: "weapon", id: "starwand" } },
  { id: "flawless3", category: "boss", run: (s) => s.flawlessBosses >= 3, unlock: { kind: "passive", id: "dashCloak" } },
  // 돈·상점 (한 판)
  { id: "rich", category: "wealth", run: (s) => s.goldEarned >= 150, unlock: { kind: "passive", id: "goldTooth" } },
  { id: "gold300", category: "wealth", run: (s) => s.goldEarned >= 300, unlock: { kind: "passive", id: "goldPouch" } },
  { id: "hoard", category: "wealth", run: (s) => s.gold >= 100, unlock: { kind: "passive", id: "featherTip" } },
  { id: "shopper", category: "wealth", run: (s) => s.purchases >= 4, unlock: { kind: "use", id: "frost" } },
  { id: "bigSpender", category: "wealth", run: (s) => s.goldSpent >= 150, unlock: { kind: "weapon", id: "repeater" } },
  // 아이템
  { id: "passives5", category: "build", run: (s) => s.player.passives.length >= 5, unlock: { kind: "passive", id: "regenCharm" } },
  { id: "passives10", category: "build", run: (s) => s.player.passives.length >= 10 },
  { id: "fullHands", category: "build", run: (s) => s.player.useSlots.length > 0 && s.player.useSlots.every((x) => x !== null), unlock: { kind: "weapon", id: "sling" } },
  // 캐릭터
  ch("clearWarden", "warden"),
  ch("clearDrifter", "drifter"),
  ch("clearMage", "mage"),
  ch("clearMystic", "mystic"),
  ch("clearEngineer", "engineer"),
  ch("clearElementalist", "elementalist"),
  ch("clearBrawler", "brawler"),
  ch("clearDoctor", "doctor"),
  ch("clearGunner", "gunner"),
  ch("clearBeast", "beast"),
  ch("clearNinja", "ninja"),
  ch("clearChronomancer", "chronomancer"),
  ch("clearSummoner", "summoner"),
  ch("clearNovice", "novice"),
  ch("clearBedouin", "bedouin"),
  ch("clearGeneral", "general"),
  ch("clearImugi", "imugi"),
  ch("clearApostle", "apostle"),
  ch("clearDuck", "duck"),
  ch("clearScribe", "scribe"),
  ch("clearMiner", "miner"),
  ch("clearVoyager", "voyager"),
  ch("clearZeus", "zeus"),
  ch("clearPilgrim", "pilgrim"),
  ch("clearFallenKing", "fallenKing"),
  ch("clearLux", "lux"),
  ch("clearAbandoned", "abandoned"),
  ch("clearTitan", "titan"),
  ch("clearOni", "oni"),
  ch("clearIdra", "idra"),
  ch("clearByeonhui", "byeonhui"),
  ch("clearFly", "fly"),
  ch("clearElder", "elder"),
  ch("clearPlague", "plague"),
  ch("clearSlayer", "slayer"),
  ch("clearEater", "eater"),
  ch("clearMukin", "mukin"),
  ch("clearSamyeol", "samyeol"),
  ch("clearAutomata", "automata"),
  ch("clearRider", "rider"),
  ch("clearBomber", "bomber"),
  ch("clearArtifacter", "artifacter"),
  ch("clearPunk", "punk"),
  ch("clearCollector", "collector"),
  ch("clearTracker", "tracker"),
  ch("clearForgotten", "forgotten"),
  ch("clearRemnant", "remnant"),
  ch("clearWanderer", "wanderer"),
  ch("clearSilk", "silk"),
  ch("clearPungryu", "pungryu"),
  ch("clearLeo", "leo"),
  ch("clearOnyx", "onyx"),
  ch("clearFenrir", "fenrir"),
  ch("clearEclipse", "eclipse"),
  ch("clearThorken", "thorken"),
  ch("clearLevia", "levia"),
  ch("clearTail", "tail"),
  ch("clearMadQueen", "madQueen"),
  ch("clearHook", "hook"),
  ch("clearOrca", "orca"),
  ch("clearWave", "wave"),
  ch("clearMiryu", "miryu"),
  ch("clearBeatrice", "beatrice"),
  ch("clearIan", "ian"),
  ch("clearGabriel", "gabriel"),
  ch("clearSerena", "serena"),
  ch("clearRafael", "rafael"),
  ch("clearYuriel", "yuriel"),
  ch("clearMichaela", "michaela"),
  ch("clearBlast", "blast"),
  ch("clearNailer", "nailer"),
  ch("clearScissors", "scissors"),
  ch("clearHellfist", "hellfist"),
  ch("clearSilverBullet", "silverBullet"),
  ch("clearBlueFlame", "blueFlame"),
  ch("clearLunatic", "lunatic"),
  ch("clearIncision", "incision"),
  ch("clearRen", "ren"),
  ch("clearSpiritist", "spiritist"),
  { id: "clearAll", category: "character", total: total(CHARACTER_IDS.length, (c) => Object.values(c.clearedBy).filter((n) => (n ?? 0) > 0).length) },
  // 도전 (클리어 조건)
  { id: "fastClear", category: "challenge", run: (s) => s.won && s.tick <= 12 * MIN },
  { id: "swiftClear", category: "challenge", run: (s) => s.won && s.tick <= 10 * MIN },
  { id: "thrift", category: "challenge", run: (s) => s.won && s.purchases === 0 },
  { id: "closeCall", category: "challenge", run: (s) => s.won && s.player.hp <= 10 },
  { id: "suddenClear", category: "challenge", run: (s) => s.won && s.sudden === true },
  // 누적
  { id: "runs10", category: "career", total: total(10, (c) => c.runs) },
  { id: "runs50", category: "career", total: total(50, (c) => c.runs) },
  { id: "wins5", category: "career", total: total(5, (c) => c.wins) },
  { id: "wins20", category: "career", total: total(20, (c) => c.wins) },
  { id: "kills1000", category: "career", total: total(1000, (c) => c.kills) },
  { id: "kills5000", category: "career", total: total(5000, (c) => c.kills) },
  { id: "bosses10", category: "career", total: total(10, (c) => c.bossKills) },
  { id: "bosses50", category: "career", total: total(50, (c) => c.bossKills) },
  { id: "gold1000", category: "career", total: total(1000, (c) => c.goldEarned) },
  { id: "gold5000", category: "career", total: total(5000, (c) => c.goldEarned) },
] as const satisfies readonly AchievementDef[];

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];

export const ACHIEVEMENT_IDS: readonly AchievementId[] = ACHIEVEMENTS.map((a) => a.id);

const DEFS: readonly AchievementDef[] = ACHIEVEMENTS;

export function achievementDef(id: string): AchievementDef | undefined {
  return DEFS.find((a) => a.id === id);
}

/** 해금해야 나오는 것 (종류:id) */
const LOCKED = new Set(DEFS.flatMap((a) => (a.unlock ? [`${a.unlock.kind}:${a.unlock.id}`] : [])));

/** 쓸 수 있는지 (아이템·무기·캐릭터). unlocks: 달성한 업적 id. 어떤 업적에도 걸려 있지 않으면 처음부터 열림 */
export function isUnlocked(kind: UnlockRef["kind"], id: string, unlocks: readonly string[]): boolean {
  const key = `${kind}:${id}`;
  if (!LOCKED.has(key)) return true;
  return DEFS.some((a) => a.unlock && `${a.unlock.kind}:${a.unlock.id}` === key && unlocks.includes(a.id));
}

/** 이 판에서 나올 수 있는 아이템인지 */
export function itemAvailable(kind: Exclude<UnlockRef["kind"], "character">, id: string, unlocks: readonly string[]): boolean {
  return isUnlocked(kind, id, unlocks);
}

/** 고를 수 있는 캐릭터인지 (캐릭터 해금 업적을 붙이면 바로 적용) */
export function characterAvailable(id: CharacterId, unlocks: readonly string[]): boolean {
  return isUnlocked("character", id, unlocks);
}

/** 지금 판에서 달성한 업적 (이미 가진 것 포함). career: 이 판 전까지의 누적 기록 */
export function achievedIn(s: RunState, career: CareerStats = EMPTY_CAREER): AchievementId[] {
  // 레이드 아레나·패왕전은 업적을 세지 않음 (보통 판과 진행이 다름)
  if (s.arenaLv || s.pw || s.pvp) return [];
  let c: CareerStats | null = null;
  return ACHIEVEMENTS.filter((a: AchievementDef) => {
    if (a.run) return a.run(s);
    if (!a.total) return false;
    c ??= careerWith(career, s);
    return a.total.value(c) >= a.total.goal;
  }).map((a) => a.id);
}

/** 누적 업적 진행도 (한 판 업적은 null) */
export function achievementProgress(id: string, career: CareerStats): { value: number; goal: number } | null {
  const t = achievementDef(id)?.total;
  return t ? { value: Math.min(t.value(career), t.goal), goal: t.goal } : null;
}

// ───────── 점수 (일일 도전·배틀 공통, 임시 수치) ─────────

export interface ScoreBreakdown {
  floor: number;
  kills: number;
  bosses: number;
  clear: number;
  time: number;
  total: number;
}

/** 도달 층 + 처치 + 보스 처치 + 클리어 보너스 + 남은 시간 보너스(클리어했을 때만, 15분 기준) */
export function computeScore(s: RunState): ScoreBreakdown {
  const floor = (Math.min(s.floor, FLOOR_COUNT) - 1) * 500;
  const kills = s.kills * 10;
  const bosses = s.bossKills * 300;
  const clear = s.won ? 2000 : 0;
  const time = s.won ? Math.max(0, Math.floor((TIME_LIMIT_TICKS - s.tick) / TICK_RATE)) * 3 : 0;
  return { floor, kills, bosses, clear, time, total: floor + kills + bosses + clear + time };
}
