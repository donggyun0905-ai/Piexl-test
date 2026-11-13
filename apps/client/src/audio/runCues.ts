// 게임 중 알림 소리를 언제 낼지 (화면 전용, 게임 계산에는 영향 없음 · 소리는 audio/sfxRun)
// 문: 안 깬 방에 적이 있으면 잠김, 방을 정리하면 열림 · 바닥 아이템이 새로 생기면 종류별(한꺼번에 둘 이상이면 상자 열림) · 같은 방에 적이 새로 나타남
// 내 탄이 벽에 막혀 사라짐 · 무적인 적(레이드 보스 등)에 막힘 · 방패·흰 보호막을 때림 · 받아 넘김 · 버프 끝(보호막이 남은 채 끝나면 깨짐) · 체력 꽉 참 · 3초 넘게 기다린 스킬이 다시 준비됨
import { blocksShot, ROOM_MAX_X, ROOM_MAX_Y, ROOM_MIN_X, ROOM_MIN_Y, roomGrid, type Pickup, type RunState } from "@pixel-rogue/shared";
import { BUFF_TABLE } from "../game/buffView";
import type { Sfx } from "./sound";

/** 같은 소리 사이 최소 틱 · 스킬 준비 소리를 낼 만큼 긴 대기(틱) · 짧게 켜졌다 끝난 버프는 조용히 */
const GAP = 8;
/** 자주 나는 소리는 더 띄움 (벽·적 나타남 0.3초 · 무적 0.25초 · 보호막 0.17초) */
const SLOW: Partial<Record<Sfx, number>> = { wallHit: 18, foeSpawn: 18, hitImmune: 15, hitShield: 10 };
const LONG_CD = 180;
const LONG_BUFF = 60;
/** 쿨타임이 아닌데 이름만 비슷한 칸 */
const NOT_CD = new Set(["attackCooldown", "dashCooldown"]);
const DROP: Partial<Record<Pickup["kind"], Sfx>> = { coin: "dropCoin", weapon: "dropWeapon", passive: "dropPassive", use: "dropUse" };
const BUFFS = BUFF_TABLE.filter(([, , k]) => k === "buff").map(([f]) => f);

interface Shot { x: number; y: number; vx: number; vy: number; left: number; ghost: boolean }
interface Seen {
  where: string;
  foes: Set<number>;
  picks: Set<number>;
  shots: Map<number, Shot>;
  shields: Map<number, number>;
  /** 적마다 [막힌 틱, 흰 보호막 양] */
  blocks: Map<number, [number, number]>;
  /** 칸 이름 → [지난 값, 켜진 동안 가장 큰 값] */
  vals: Map<string, [number, number]>;
  full: boolean;
  last: Map<Sfx, number>;
}
const seenOf = new WeakMap<RunState, Seen>();

/** 플레이어의 쿨타임 칸들 (이름이 Cd·Cooldown으로 끝나는 숫자, 배열이면 칸마다) */
function cooldowns(p: object): [string, number][] {
  const out: [string, number][] = [];
  for (const [k, v] of Object.entries(p)) {
    if (!/(Cd|Cooldown)$/.test(k) || NOT_CD.has(k)) continue;
    if (typeof v === "number") out.push([k, v]);
    else if (Array.isArray(v)) v.forEach((x, i) => typeof x === "number" && out.push([`${k}.${i}`, x]));
  }
  return out;
}

/** 이번 프레임에 낼 알림 소리를 fx에 더함 (방 정리 소리가 이미 있으면 문 열림도) */
export function runCues(run: RunState, fx: Sfx[]): void {
  const p = run.player;
  const where = `${run.floor}/${run.roomId}`;
  const room = run.rooms[run.roomId];
  const picks = room?.pickups ?? [];
  const was = seenOf.get(run);
  const now: Seen = {
    where,
    foes: new Set(run.enemies.map((e) => e.id)),
    picks: new Set(picks.map((k) => k.id)),
    shots: new Map(run.projectiles.filter((s) => s.fromPlayer).map((s) => [s.id, { x: s.x, y: s.y, vx: s.vx, vy: s.vy, left: s.ticksLeft, ghost: !!s.ghost }])),
    shields: new Map(run.enemies.map((e) => [e.id, e.shield ?? 0])),
    blocks: new Map(run.enemies.map((e) => [e.id, [e.blockTick ?? -1, e.ward ?? 0]])),
    vals: new Map(),
    full: p.hp >= p.stats.maxHp - 0.01,
    last: was?.last ?? new Map(),
  };
  seenOf.set(run, now);
  if (!was || run.over) return;
  const t = run.tick;
  const add = (f: Sfx) => {
    const at = now.last.get(f);
    if (at !== undefined && t >= at && t - at < (SLOW[f] ?? GAP)) return;
    now.last.set(f, t);
    fx.push(f);
  };
  // 버프·쿨타임 값 (방이 바뀌어도 이어서 봄)
  const rec = p as unknown as Record<string, unknown>;
  for (const f of BUFFS) {
    const v = typeof rec[f] === "number" ? (rec[f] as number) : 0;
    const [pv, mx] = was.vals.get(f) ?? [0, 0];
    now.vals.set(f, [v, v > 0 ? Math.max(mx, v) : 0]);
    if (v <= 0 && pv > 0) {
      if (/[sS]hield/.test(f) && pv > 2) add("shieldBreak");
      else if (mx >= LONG_BUFF) add("buffEnd");
    }
  }
  for (const [k, v] of cooldowns(p)) {
    const [pv, mx] = was.vals.get(k) ?? [0, 0];
    now.vals.set(k, [v, v > 0 ? Math.max(mx, v) : 0]);
    if (v <= 0 && pv > 0 && mx >= LONG_CD) add("cdReady");
  }
  if (now.full && !was.full && p.hp > 0) add("hpFull");
  if (fx.includes("roomClear")) add("doorOpen");
  if (where !== was.where) {
    // 방에 들어옴: 안 깬 방에 적이 있으면 문이 잠김
    if (run.enemies.length > 0 && !(room?.cleared ?? true)) add("doorLock");
    return;
  }
  if ([...now.foes].some((id) => !was.foes.has(id)) && !fx.includes("boss")) add(was.foes.size === 0 && !(room?.cleared ?? true) ? "doorLock" : "foeSpawn");
  const fresh = picks.filter((k) => !was.picks.has(k.id));
  if (fresh.length >= 2) add("chestOpen");
  else for (const k of fresh) if (DROP[k.kind]) add(DROP[k.kind]!);
  // 사라진 내 탄: 다음 자리가 벽·방 밖이면 벽에 맞은 것
  const g = roomGrid(run);
  for (const [id, s] of was.shots) {
    if (now.shots.has(id) || s.left <= 1 || s.ghost) continue;
    const x = s.x + s.vx;
    const y = s.y + s.vy;
    if (x < ROOM_MIN_X || x > ROOM_MAX_X || y < ROOM_MIN_Y || y > ROOM_MAX_Y || (g !== null && blocksShot(g, x, y))) {
      add("wallHit");
      break;
    }
  }
  for (const e of run.enemies) {
    const [bt, ward] = was.blocks.get(e.id) ?? [-1, 0];
    const shield = (e.shield ?? 0) < (was.shields.get(e.id) ?? 0);
    const barrier = (e.ward ?? 0) < ward;
    if ((shield && e.shield === 0) || (barrier && (e.ward ?? 0) <= 0)) add("shieldBreak");
    else if (shield || barrier) add("hitShield");
    if ((e.blockTick ?? -1) !== bt) add("hitImmune");
  }
  if (!fx.includes("parry") && run.effects.some((f) => f.kind === "parry" && f.ticks >= f.maxTicks - 1)) add("hitBlock");
}
