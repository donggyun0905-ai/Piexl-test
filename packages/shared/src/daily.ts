// 일일 도전 공용: 하루 구분(오전 9시 = UTC 0시), 입력 기록 압축·풀기, 다시 돌리기, 진행 기록 검사
import { computeScore, itemAvailable } from "./achievements";
import { CHARACTER_IDS, ENEMIES, type CharacterId } from "./content";
import { HEAL_ITEMS } from "./items";
import { PERKS } from "./perks";
import { createRun, stepSim } from "./sim/run";
import { FLOOR_COUNT, generateFloor, MAX_LAYERS } from "./sim/floor";
import { KILL_GOLD, ROOM_GOLD_MAX, START_GOLD } from "./sim/loot";
import type { RunState, TickInput } from "./sim/types";
import { TICK_RATE } from "./constants";

/** 하루 시작: 한국·일본 오전 9시 = UTC 0시 (무료 한도 초기화 시각과 같음) */
export function dayKey(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** 다음 초기화 시각 (ms) */
export function nextDayStart(ms: number): number {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
}

/** 순위표 크기 */
export const BOARD_SIZE = 30;

// ───────── 입력 기록 ─────────
// 같은 입력이 이어지는 구간을 [틱 수, moveX, moveY, aimX, aimY, 버튼] 6개 정수로 묶음 (Int16)
// 상점 팔기(sell)는 드물어서 그 틱 앞에 [-판 번호, 0, 0, 0, 0, 0] 묶음을 하나 더 넣음 (예전 기록에는 없음). 무기 팔기(-1)는 SELL_WEAPON_CODE로 적음
// 작업대 창 누름(menu, sim/station)도 드물어서 [-MENU_CODE, 누른 값, 0, 0, 0, 0] 묶음을 하나 더 넣음

const FIELDS = 6;
const SELL_WEAPON_CODE = 32000;
const MENU_CODE = 31000;

function flagsOf(i: TickInput): number {
  return (i.attack ? 1 : 0) | (i.dash ? 2 : 0) | (i.interact ? 4 : 0) | (i.autoAim ? 8 : 0) | (i.useSlot << 4) | (i.pickChoice << 6) | (i.statPick << 8) | (i.skill << 12);
}

export function encodeInputs(inputs: readonly TickInput[]): Int16Array {
  const out: number[] = [];
  let i = 0;
  while (i < inputs.length) {
    const a = inputs[i]!;
    const f = flagsOf(a);
    let n = 1;
    if (a.sell) out.push(-(a.sell < 0 ? SELL_WEAPON_CODE : a.sell), 0, 0, 0, 0, 0);
    if (a.menu) out.push(-MENU_CODE, a.menu, 0, 0, 0, 0);
    while (!a.sell && !a.menu && i + n < inputs.length && n < 32767) {
      const b = inputs[i + n]!;
      if (b.sell || b.menu) break;
      if (b.moveX !== a.moveX || b.moveY !== a.moveY || b.aimX !== a.aimX || b.aimY !== a.aimY || flagsOf(b) !== f) break;
      n++;
    }
    out.push(n, a.moveX, a.moveY, a.aimX, a.aimY, f);
    i += n;
  }
  return Int16Array.from(out);
}

export function decodeInputs(data: Int16Array): TickInput[] {
  const out: TickInput[] = [];
  let sell = 0;
  let menu = 0;
  for (let k = 0; k + FIELDS <= data.length; k += FIELDS) {
    const n = data[k]!;
    if (n === -MENU_CODE) {
      menu = data[k + 1]!;
      continue;
    }
    if (n < 0) {
      sell = -n === SELL_WEAPON_CODE ? -1 : -n;
      continue;
    }
    const f = data[k + 5]!;
    const input: TickInput = {
      moveX: data[k + 1]!,
      moveY: data[k + 2]!,
      aimX: data[k + 3]!,
      aimY: data[k + 4]!,
      attack: (f & 1) !== 0,
      dash: (f & 2) !== 0,
      interact: (f & 4) !== 0,
      autoAim: (f & 8) !== 0,
      useSlot: (f >> 4) & 3,
      pickChoice: (f >> 6) & 3,
      statPick: (f >> 8) & 15,
      skill: (f >> 12) & 3,
    };
    if (sell || menu) {
      out.push({ ...input, ...(sell ? { sell } : {}), ...(menu ? { menu } : {}) });
      sell = menu = 0;
      for (let j = 1; j < n; j++) out.push(input);
      continue;
    }
    for (let j = 0; j < n; j++) out.push(input);
  }
  return out;
}

// 브라우저·Workers·Node 모두에 있는 웹 기능 (공용 코드는 DOM 타입 없이 쓰려고 직접 꺼냄)
interface WebApis {
  CompressionStream: new (format: string) => unknown;
  DecompressionStream: new (format: string) => unknown;
  Response: new (body: unknown) => { arrayBuffer(): Promise<ArrayBuffer> };
  Blob: new (parts: unknown[]) => { stream(): { pipeThrough(s: unknown): unknown } };
  btoa(text: string): string;
  atob(text: string): string;
}
const web = globalThis as unknown as WebApis;

async function pipe(bytes: Uint8Array, gzip: boolean): Promise<Uint8Array> {
  const stream = gzip ? new web.CompressionStream("gzip") : new web.DecompressionStream("gzip");
  const res = new web.Response(new web.Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return web.btoa(bin);
}

function fromBase64(text: string): Uint8Array {
  const bin = web.atob(text);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** 입력 기록 → 보내기 좋은 글자 (gzip + base64) */
export async function packInputs(inputs: readonly TickInput[]): Promise<string> {
  const raw = encodeInputs(inputs);
  return toBase64(await pipe(new Uint8Array(raw.buffer), true));
}

export async function unpackInputs(text: string): Promise<TickInput[]> {
  const bytes = await pipe(fromBase64(text), false);
  // 짝수 위치에서 시작하도록 복사
  const copy = new Uint8Array(bytes.length - (bytes.length % 2));
  copy.set(bytes.subarray(0, copy.length));
  return decodeInputs(new Int16Array(copy.buffer));
}

/** 입력 기록으로 판 전체 다시 돌리기 (해금 없음). sudden: 서든데스 */
export function replayRun(seed: number, characterId: CharacterId, inputs: readonly TickInput[], sudden = false): RunState {
  const run = createRun(seed, characterId, [], sudden);
  for (const input of inputs) {
    if (run.over) break;
    stepSim(run, input);
  }
  return run;
}

// ───────── 진행 기록 검사 ─────────

/** 화면이 보내는 기록 요약 */
export interface RunSummary {
  characterId: CharacterId;
  floor: number;
  kills: number;
  bossKills: number;
  won: boolean;
  ticks: number;
  score: number;
  goldEarned: number;
  goldSpent: number;
  floorLog: RunState["floorLog"];
  buys: RunState["buys"];
}

export function summarize(run: RunState): RunSummary {
  return {
    characterId: run.player.characterId,
    floor: run.floor,
    kills: run.kills,
    bossKills: run.bossKills,
    won: run.won,
    ticks: run.tick,
    score: computeScore(run).total,
    goldEarned: run.goldEarned,
    goldSpent: run.goldSpent,
    floorLog: run.floorLog,
    buys: run.buys,
  };
}

/** 지금 상태 그대로 점수 계산 (요약에서) */
function scoreOf(r: RunSummary): number {
  const fake = { floor: r.floor, kills: r.kills, bossKills: r.bossKills, won: r.won, tick: r.ticks } as RunState;
  return computeScore(fake).total;
}

/**
 * 진행 기록 검사: 시드로 지도만 만들어 앞뒤가 맞는지 확인 (판을 다시 돌리지 않음, 가벼움).
 * 통과하면 null, 아니면 이유. sudden: 서든데스 (회복 아이템을 살 수 없음)
 */
export function checkProgress(seed: number, r: RunSummary, sudden = false): string | null {
  if (!CHARACTER_IDS.includes(r.characterId)) return "character";
  if (r.floor < 1 || r.floor > FLOOR_COUNT || r.ticks <= 0) return "range";
  if (r.score !== scoreOf(r)) return "score";
  if (r.bossKills > r.floor || r.bossKills > r.kills) return "bosses";
  if (r.won && (r.floor !== FLOOR_COUNT || r.bossKills !== FLOOR_COUNT)) return "won";
  // 층마다 한 번씩, 차례대로, 시각이 늘어남
  if (r.floorLog.length !== r.floor) return "floorLog";
  let lastTick = -1;
  for (let i = 0; i < r.floorLog.length; i++) {
    const e = r.floorLog[i]!;
    if (e.floor !== i + 1 || e.tick <= lastTick || e.tick > r.ticks || e.hp <= 0) return "floorLog";
    lastTick = e.tick;
  }
  // 한 층을 지나는 데 걸리는 최소 시간 (방 몇 개 + 보스): 10초 미만이면 이상함
  for (let i = 1; i < r.floorLog.length; i++) {
    if (r.floorLog[i]!.tick - r.floorLog[i - 1]!.tick < 10 * TICK_RATE) return "tooFast";
  }
  // 돈: 쓴 돈 ≤ 번 돈 + 처음 자금, 번 돈은 처치·방 정리로 얻을 수 있는 만큼까지
  if (r.goldSpent > r.goldEarned + START_GOLD()) return "gold";
  // 적이 주는 돈은 관리자 페이지에서 바뀔 수 있으니 지금 표에서 가장 큰 값으로
  const golds = Object.values(ENEMIES);
  const minionGold = Math.max(...golds.filter((e) => !e.boss).map((e) => e.gold));
  const bossGold = Math.max(...golds.filter((e) => e.boss).map((e) => e.gold));
  const maxGold = ((r.kills * minionGold + r.bossKills * bossGold) * KILL_GOLD() + r.floor * MAX_LAYERS * Math.max(20, ROOM_GOLD_MAX() * 3)) * Math.max(1, PERKS.goldPouch.gold);
  if (r.goldEarned > maxGold) return "gold";
  // 산 물건: 그 층 상점방에서, 해금 없이 나오는 물건, 쓴 돈 합계가 맞음
  let spent = 0;
  const maps = new Map<number, ReturnType<typeof generateFloor>>();
  for (const b of r.buys) {
    if (b.floor < 1 || b.floor > r.floor) return "buy";
    const map = maps.get(b.floor) ?? generateFloor(seed, b.floor);
    maps.set(b.floor, map);
    if (map.rooms[b.roomId]?.type !== "shop") return "buy";
    if (b.kind === "coin" || b.kind === "trash") return "buy";
    // 작업대(아티팩터 제작대·추적자 튜닝소)에 쓴 돈은 물건이 아니라 itemId = 기능 번호
    if (b.kind !== "reroll" && b.kind !== "bench" && b.kind !== "tune" && !itemAvailable(b.kind, b.itemId, [])) return "buy";
    if (sudden && HEAL_ITEMS.has(`${b.kind}:${b.itemId}`)) return "buy";
    spent += b.price;
  }
  if (spent !== r.goldSpent) return "buy";
  return null;
}
