// 캐릭터 해금 (2026-11-03 사용자 지정): 처음엔 파수꾼·떠돌이·마법사만 열려 있고, 나머지는 캐릭터마다 정한 조건을 이루면 열림.
// 조건 종류: 업적 · 누적 횟수 · 가장 높았던 능력치 · 한 번이라도 · 패왕전 승리 · 펫 수 · 판 수 · 악마 템 · 로비 칩으로 사기 (기록은 unlock/unlockStats)
// 테스트 중에는 전부 열림 (testFlags.TEST_OPEN)
import { DEVIL_IDS, type CharacterId, type PwMode } from "@pixel-rogue/shared";
import { pwWins } from "./event/pwRecords";
import { ownedPets } from "./lobby/petStore";
import { loadAchievements, loadTotals } from "./records";
import { TEST_OPEN } from "./testFlags";
import { unlockStats, type CountKey, type FlagKey, type MaxKey } from "./unlock/unlockStats";

/** 테스트 중: 전부 열림 (testFlags) */
export const TEST_ALL_CHARACTERS = TEST_OPEN;

export type CharGoal =
  | { a: string }
  | { c: CountKey; n: number }
  | { m: MaxKey; n: number }
  | { f: FlagKey }
  | { pw: PwMode; n: number }
  | { pets: number }
  | { runs: number }
  | { devil: number }
  | { buy: number };

/** 캐릭터 → 여는 조건 (없으면 처음부터 열림) · 글자는 i18n/text/charGoals */
export const CHARACTER_GOALS: Partial<Record<CharacterId, CharGoal>> = {
  mystic: { a: "firstBoss" },
  beast: { a: "kills30" },
  engineer: { a: "shopper" },
  doctor: { a: "floor4" },
  novice: { a: "clearRun" },
  brawler: { f: "trial1000" },
  general: { c: "eliteRooms", n: 50 },
  mukin: { m: "defense", n: 20 },
  gunner: { a: "suddenClear" },
  titan: { m: "maxHp", n: 200 },
  tracker: { f: "tdFive" },
  elementalist: { f: "heroClear" },
  imugi: { f: "dragonClear" },
  wanderer: { m: "attackSpeed", n: 1.5 },
  summoner: { c: "skelarcher", n: 300 },
  spiritist: { f: "cupid" },
  automata: { pets: 3 },
  plague: { f: "heroDoctor" },
  eater: { f: "heroApostle" },
  bedouin: { f: "swarmClear" },
  rider: { m: "moveSpeed", n: 1.7 },
  ninja: { f: "arenaClear" },
  slayer: { pw: "brawl", n: 1 },
  remnant: { c: "duelBest", n: 10 },
  apostle: { m: "endlessFloor", n: 20 },
  samyeol: { c: "venom", n: 1000 },
  abandoned: { pw: "gungame", n: 1 },
  punk: { buy: 200000 },
  oni: { runs: 100 },
  bomber: { c: "bombs", n: 100 },
  idra: { c: "rests", n: 100 },
  forgotten: { c: "altars", n: 1000 },
  byeonhui: { a: "flawless3" },
  silk: { pw: "capture", n: 10 },
  pungryu: { m: "moveSpeed", n: 2 },
  leo: { m: "maxHp", n: 250 },
  onyx: { m: "maxHp", n: 350 },
  chronomancer: { a: "thrift" },
  fly: { f: "clear7" },
  elder: { c: "traps", n: 1000 },
  ren: { a: "bosses50" },
  artifacter: { buy: 300000 },
  collector: { devil: DEVIL_IDS.length },
};

/** 조건 진행도 (지금 값 · 목표) */
export function goalProgress(c: CharacterId, g: CharGoal, achieved: readonly string[] = loadAchievements()): { v: number; n: number } {
  const st = unlockStats();
  if ("a" in g) return { v: achieved.includes(g.a) ? 1 : 0, n: 1 };
  if ("c" in g) return { v: st.count[g.c] ?? 0, n: g.n };
  if ("m" in g) return { v: st.max[g.m] ?? 0, n: g.n };
  if ("f" in g) return { v: st.flag[g.f] ? 1 : 0, n: 1 };
  if ("pw" in g) return { v: pwWins(g.pw), n: g.n };
  if ("pets" in g) return { v: ownedPets().length, n: g.pets };
  if ("runs" in g) return { v: loadTotals().runs, n: g.runs };
  if ("devil" in g) return { v: st.devil.length, n: g.devil };
  return { v: st.bought.includes(c) ? 1 : 0, n: 1 };
}

/** 이 캐릭터를 고를 수 있는지 */
export function characterOpen(c: CharacterId, achieved: readonly string[] = loadAchievements()): boolean {
  const goal = CHARACTER_GOALS[c];
  if (TEST_ALL_CHARACTERS || !goal) return true;
  const p = goalProgress(c, goal, achieved);
  return p.v >= p.n;
}

/** 이 도전과제로 열리는 캐릭터 */
export const charactersFor = (achievement: string): CharacterId[] =>
  (Object.keys(CHARACTER_GOALS) as CharacterId[]).filter((c) => {
    const g = CHARACTER_GOALS[c];
    return !!g && "a" in g && g.a === achievement;
  });
